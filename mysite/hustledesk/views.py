from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import render
from django.contrib.auth import authenticate
from .models import User, Customer, Sale, Expense, Invoice, Task
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer,
    UserSerializer, CustomerSerializer, SaleSerializer, ExpenseSerializer,
    InvoiceSerializer, TaskSerializer, DashboardStatsSerializer
)
from django.http import HttpResponse

def home_view(request):
    """Simple landing page for the root URL"""
    return render(request, 'hustledesk/home.html')

def register_view(request):
    """Render the registration page."""
    return render(request, 'hustledesk/auth/register.html')

class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        tokens = user.get_tokens()
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': tokens
        }, status=status.HTTP_200_OK)

class DashboardStatsView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DashboardStatsSerializer

    def get(self, request, *args, **kwargs):
        # Simplified stats calculation
        stats = {
            'today_sales': '0.00',
            'today_expenses': '0.00',
            'monthly_sales': '0.00',
            'total_customers': 0,
            'pending_tasks': 0,
            'top_customer': 'No data'
        }
        
        serializer = self.get_serializer(stats)
        return Response(serializer.data)

class RecentActivityView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response({'recent_activity': []})

class SaleListCreateView(generics.ListCreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

class SaleDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

class CustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAuthenticated]

class ExpenseListCreateView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

class ExpenseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated]

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

def login_view(request):
    """Render the login page."""
    return render(request, 'hustledesk/auth/login.html')

def welcome_view(request):
    """Render the welcome page."""
    return render(request, 'hustledesk/auth/welcome.html')
