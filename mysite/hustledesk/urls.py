from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
# We'll register viewsets here if needed

urlpatterns = [
    # Authentication endpoints
    path('auth/register/', views.UserRegistrationView.as_view(), name='register'),
    path('auth/login/', views.UserLoginView.as_view(), name='login'),
    
    # Dashboard endpoints
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('dashboard/activity/', views.RecentActivityView.as_view(), name='recent-activity'),
    
    # Sales endpoints
    path('sales/', views.SaleListCreateView.as_view(), name='sale-list'),
    path('sales/<uuid:pk>/', views.SaleDetailView.as_view(), name='sale-detail'),
    
    # Customer endpoints
    path('customers/', views.CustomerListCreateView.as_view(), name='customer-list'),
    path('customers/<uuid:pk>/', views.CustomerDetailView.as_view(), name='customer-detail'),
    
    # Expense endpoints
    path('expenses/', views.ExpenseListCreateView.as_view(), name='expense-list'),
    path('expenses/<uuid:pk>/', views.ExpenseDetailView.as_view(), name='expense-detail'),
    
    # Invoice endpoints
    path('invoices/', views.InvoiceListCreateView.as_view(), name='invoice-list'),
    path('invoices/<uuid:pk>/', views.InvoiceDetailView.as_view(), name='invoice-detail'),
    
    # Task endpoints
    path('tasks/', views.TaskListCreateView.as_view(), name='task-list'),
    path('tasks/<uuid:pk>/', views.TaskDetailView.as_view(), name='task-detail'),
]

urlpatterns += router.urls
