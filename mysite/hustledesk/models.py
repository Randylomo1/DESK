from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
from rest_framework_simplejwt.tokens import RefreshToken
import uuid

class User(AbstractUser):
    business_name = models.CharField(max_length=255)
    business_category = models.CharField(max_length=100, choices=[
        ('food', 'Food & Restaurant'),
        ('retail', 'Retail Shop'),
        ('salon', 'Salon & Beauty'),
        ('services', 'Services'),
        ('fashion', 'Fashion & Clothing'),
        ('electronics', 'Electronics'),
        ('other', 'Other')
    ])
    
    def __str__(self):
        return f"{self.username} - {self.business_name}"
    
    def get_tokens(self):
        """Generate JWT tokens for the user"""
        refresh = RefreshToken.for_user(self)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

class Customer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customers')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    is_debtor = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name

class Sale(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales')
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='sales')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    description = models.TextField(null=True, blank=True)
    payment_method = models.CharField(max_length=20, choices=[
        ('cash', 'Cash'),
        ('mpesa', 'M-Pesa'),
        ('card', 'Card'),
        ('other', 'Other')
    ])
    date = models.DateTimeField(auto_now_add=True)
    is_synced_with_mpesa = models.BooleanField(default=False)
    mpesa_reference = models.CharField(max_length=50, null=True, blank=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Sale #{self.id} - {self.amount}"

class Expense(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    category = models.CharField(max_length=50, choices=[
        ('stock', 'Stock'),
        ('rent', 'Rent'),
        ('transport', 'Transport'),
        ('utilities', 'Utilities'),
        ('salaries', 'Salaries'),
        ('other', 'Other')
    ])
    description = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Expense #{self.id} - {self.amount}"

class Invoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='invoices')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='invoices')
    items = models.JSONField()  # Store invoice items as JSON
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    due_date = models.DateField()
    status = models.CharField(max_length=20, choices=[
        ('draft', 'Draft'),
        ('sent', 'Sent'),
        ('paid', 'Paid'),
        ('overdue', 'Overdue')
    ], default='draft')
    payment_method = models.CharField(max_length=20, choices=[
        ('cash', 'Cash'),
        ('mpesa', 'M-Pesa'),
        ('bank', 'Bank Transfer')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Invoice #{self.id} - {self.total_amount}"

class Task(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    due_date = models.DateTimeField()
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['due_date']
    
    def __str__(self):
        return self.title
