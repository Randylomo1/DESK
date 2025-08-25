from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Customer, Sale, Expense, Invoice, Task

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'phone', 'business_name', 'business_category', 'is_phone_verified')
    list_filter = ('business_category', 'is_phone_verified', 'is_staff', 'is_active')
    search_fields = ('username', 'email', 'phone', 'business_name')
    fieldsets = UserAdmin.fieldsets + (
        ('Business Information', {
            'fields': ('phone', 'business_name', 'business_category', 'is_phone_verified')
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Business Information', {
            'fields': ('phone', 'business_name', 'business_category')
        }),
    )

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'user', 'is_debtor', 'created_at')
    list_filter = ('is_debtor', 'created_at', 'user')
    search_fields = ('name', 'phone', 'email', 'user__business_name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'customer', 'amount', 'payment_method', 'date')
    list_filter = ('payment_method', 'date', 'user', 'is_synced_with_mpesa')
    search_fields = ('customer__name', 'user__business_name', 'mpesa_reference')
    readonly_fields = ('date',)

@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'category', 'description', 'date')
    list_filter = ('category', 'date', 'user')
    search_fields = ('description', 'user__business_name')
    readonly_fields = ('date',)

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'customer', 'total_amount', 'status', 'due_date')
    list_filter = ('status', 'payment_method', 'due_date', 'user')
    search_fields = ('customer__name', 'user__business_name')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'due_date', 'is_completed', 'created_at')
    list_filter = ('is_completed', 'due_date', 'user')
    search_fields = ('title', 'description', 'user__business_name')
    readonly_fields = ('created_at', 'updated_at')
