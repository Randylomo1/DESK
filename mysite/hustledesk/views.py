from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils import timezone
from django.db.models import Sum, Count
from django.shortcuts import get_object_or_404
from .models import User, Customer, Sale, Expense, Invoice, Task
from .serializers import (
    UserRegistrationSerializer, OTPVerificationSerializer, UserLoginSerializer,
    UserSerializer, CustomerSerializer, SaleSerializer, ExpenseSerializer,
    InvoiceSerializer, TaskSerializer, DashboardStatsSerializer
)
from datetime import datetime, timedelta

class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # In production, you would send the OTP via SMS here
            # For demo, we'll just return the OTP in the response
            return Response({
                'message': 'User registered successfully. OTP sent to phone.',
                'otp': user.otp_code,  # Remove this in production
                'phone': user.phone
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OTPVerificationView(APIView):
    permission_classes = []  # Allow unauthenticated access for testing
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.get(phone=serializer.validated_data['phone'])
            user.is_phone_verified = True
            user.otp_code = None
            user.otp_expiry = None
            user.save()
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'message': 'Phone verified successfully',
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        today = timezone.now().date()
        
        # Today's sales
        today_sales = Sale.objects.filter(
            user=user, 
            date__date=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Today's expenses
        today_expenses = Expense.objects.filter(
            user=user,
            date__date=today
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Monthly sales (current month)
        monthly_sales = Sale.objects.filter(
            user=user,
            date__year=today.year,
            date__month=today.month
        ).aggregate(total=Sum('amount'))['total'] or 0
        
        # Total customers
        total_customers = Customer.objects.filter(user=user).count()
        
        # Pending tasks
        pending_tasks = Task.objects.filter(
            user=user,
            is_completed=False,
            due_date__gte=today
        ).count()
        
        # Top customer (this month)
        top_customer_sales = Sale.objects.filter(
            user=user,
            date__year=today.year,
            date__month=today.month,
            customer__isnull=False
        ).values('customer__name').annotate(total=Sum('amount')).order_by('-total').first()
        
        top_customer = top_customer_sales['customer__name'] if top_customer_sales else 'No data'
        
        stats = {
            'today_sales': today_sales,
            'today_expenses': today_expenses,
            'monthly_sales': monthly_sales,
            'total_customers': total_customers,
            'pending_tasks': pending_tasks,
            'top_customer': top_customer
        }
        
        serializer = DashboardStatsSerializer(stats)
        return Response(serializer.data)

class SaleListCreateView(generics.ListCreateAPIView):
    serializer_class = SaleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Sale.objects.filter(user=self.request.user).order_by('-date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SaleSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Sale.objects.filter(user=self.request.user)

class CustomerListCreateView(generics.ListCreateAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Customer.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CustomerSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Customer.objects.filter(user=self.request.user)

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

class InvoiceListCreateView(generics.ListCreateAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user).order_by('-created_at')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Invoice.objects.filter(user=self.request.user)

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user).order_by('due_date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)

class RecentActivityView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        limit = int(request.GET.get('limit', 10))
        
        # Get recent sales and expenses
        sales = Sale.objects.filter(user=user).order_by('-date')[:limit]
        expenses = Expense.objects.filter(user=user).order_by('-date')[:limit]
        
        # Combine and sort
        activities = []
        for sale in sales:
            activities.append({
                'type': 'sale',
                'id': sale.id,
                'amount': sale.amount,
                'description': sale.description or 'Sale',
                'customer': sale.customer.name if sale.customer else None,
                'date': sale.date,
                'payment_method': sale.payment_method
            })
        
        for expense in expenses:
            activities.append({
                'type': 'expense',
                'id': expense.id,
                'amount': expense.amount,
                'description': expense.description,
                'category': expense.category,
                'date': expense.date
            })
        
        # Sort by date descending
        activities.sort(key=lambda x: x['date'], reverse=True)
        
        return Response(activities[:limit])
