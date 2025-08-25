from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Customer, Sale, Expense, Invoice, Task
from django.utils import timezone
import random
import string

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'phone', 'business_name', 'business_category', 'password', 'password_confirm')
        extra_kwargs = {
            'username': {'required': False}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        
        if User.objects.filter(phone=attrs['phone']).exists():
            raise serializers.ValidationError("Phone number already registered")
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Generate username if not provided
        if not validated_data.get('username'):
            validated_data['username'] = f"user_{validated_data['phone']}"
        
        # Generate OTP
        validated_data['otp_code'] = ''.join(random.choices(string.digits, k=6))
        validated_data['otp_expiry'] = timezone.now() + timezone.timedelta(minutes=10)
        
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        return user

class OTPVerificationSerializer(serializers.Serializer):
    phone = serializers.CharField()
    otp_code = serializers.CharField(min_length=6, max_length=6)
    
    def validate(self, attrs):
        try:
            user = User.objects.get(phone=attrs['phone'])
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        if user.otp_code != attrs['otp_code']:
            raise serializers.ValidationError("Invalid OTP code")
        
        if user.otp_expiry and user.otp_expiry < timezone.now():
            raise serializers.ValidationError("OTP has expired")
        
        return attrs

class UserLoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        phone = attrs.get('phone')
        password = attrs.get('password')
        
        if phone and password:
            user = authenticate(username=phone, password=password)
            if not user:
                raise serializers.ValidationError("Invalid phone number or password")
            if not user.is_phone_verified:
                raise serializers.ValidationError("Phone number not verified")
        else:
            raise serializers.ValidationError("Phone number and password are required")
        
        attrs['user'] = user
        return attrs

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone', 'business_name', 'business_category', 'is_phone_verified')

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

class SaleSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    
    class Meta:
        model = Sale
        fields = '__all__'
        read_only_fields = ('id', 'user', 'date', 'is_synced_with_mpesa')

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ('id', 'user', 'date')

class InvoiceSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')

class DashboardStatsSerializer(serializers.Serializer):
    today_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    today_expenses = serializers.DecimalField(max_digits=10, decimal_places=2)
    monthly_sales = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_customers = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    top_customer = serializers.CharField()
