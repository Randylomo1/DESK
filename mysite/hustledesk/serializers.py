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
        fields = ('username', 'email', 'business_name', 'business_category', 'password', 'password_confirm')
        extra_kwargs = {
            'username': {'required': False}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        # Generate username if not provided
        if not validated_data.get('username'):
            validated_data['username'] = f"user_{validated_data['email'].split('@')[0]}"
        
        # Create user with password
        user = User.objects.create_user(password=password, **validated_data)
        
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError("Invalid email or password")
        else:
            raise serializers.ValidationError("Email and password are required")
        
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
