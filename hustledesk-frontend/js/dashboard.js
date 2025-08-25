// Dashboard functionality for HustleDesk

class DashboardService {
    constructor() {
        this.salesData = JSON.parse(localStorage.getItem('sales') || '[]');
        this.expensesData = JSON.parse(localStorage.getItem('expenses') || '[]');
        this.customersData = JSON.parse(localStorage.getItem('customers') || '[]');
    }

    // Get today's sales total
    getTodaySales() {
        const today = new Date().toLocaleDateString();
        return this.salesData
            .filter(sale => new Date(sale.date).toLocaleDateString() === today)
            .reduce((total, sale) => total + parseFloat(sale.amount), 0);
    }

    // Get today's expenses total
    getTodayExpenses() {
        const today = new Date().toLocaleDateString();
        return this.expensesData
            .filter(expense => new Date(expense.date).toLocaleDateString() === today)
            .reduce((total, expense) => total + parseFloat(expense.amount), 0);
    }

    // Get top customer for the week
    getTopCustomer() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const weeklySales = this.salesData.filter(sale => 
            new Date(sale.date) >= oneWeekAgo
        );

        const customerSales = {};
        weeklySales.forEach(sale => {
            if (sale.customer) {
                customerSales[sale.customer] = (customerSales[sale.customer] || 0) + parseFloat(sale.amount);
            }
        });

        const topCustomer = Object.entries(customerSales)
            .sort(([,a], [,b]) => b - a)[0];

        return topCustomer ? { name: topCustomer[0], amount: topCustomer[1] } : null;
    }

    // Get recent activity (last 10 transactions)
    getRecentActivity() {
        const allTransactions = [
            ...this.salesData.map(sale => ({ ...sale, type: 'sale' })),
            ...this.expensesData.map(expense => ({ ...expense, type: 'expense' }))
        ];

        return allTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
    }

    // Format currency
    formatCurrency(amount) {
        return `KES ${parseFloat(amount).toLocaleString()}`;
    }

    // Update dashboard widgets
    updateWidgets() {
        const todaySales = this.getTodaySales();
        const todayExpenses = this.getTodayExpenses();
        const topCustomer = this.getTopCustomer();

        document.getElementById('todaySales').textContent = this.formatCurrency(todaySales);
        document.getElementById('todayExpenses').textContent = this.formatCurrency(todayExpenses);
        document.getElementById('topCustomer').textContent = topCustomer ? 
            `${topCustomer.name} (${this.formatCurrency(topCustomer.amount)})` : 'No data';
    }

    // Render recent activity
    renderRecentActivity() {
        const activityContainer = document.getElementById('recentActivity');
        const activities = this.getRecentActivity();

        if (activities.length === 0) {
            activityContainer.innerHTML = `
                <div class="text-center py-8 text-gray-500">
                    <svg class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p>No recent activity yet</p>
                    <p class="text-sm">Start recording sales to see activity here</p>
                </div>
            `;
            return;
        }

        activityContainer.innerHTML = activities.map(activity => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'sale' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
                                activity.type === 'sale' ? 
                                'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' :
                                'M19 9l-7 7-7-7'
                            }"></path>
                        </svg>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-800">${activity.description || (activity.type === 'sale' ? 'Sale' : 'Expense')}</p>
                        <p class="text-xs text-gray-600">${new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-semibold ${
                        activity.type === 'sale' ? 'text-green-600' : 'text-red-600'
                    }">${activity.type === 'sale' ? '+' : '-'} ${this.formatCurrency(activity.amount)}</p>
                    ${activity.customer ? `<p class="text-xs text-gray-600">${activity.customer}</p>` : ''}
                </div>
            </div>
        `).join('');
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!requireAuth()) return;

    const user = authService.getCurrentUser();
    
    // Update user info in header
    document.getElementById('greeting').textContent = `Hi, ${user.name} 👋`;
    document.getElementById('businessName').textContent = user.business?.name || 'Business';
    document.getElementById('userInitials').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileBusiness').textContent = user.business?.name || 'Business';

    // Initialize dashboard service
    const dashboardService = new DashboardService();
    dashboardService.updateWidgets();
    dashboardService.renderRecentActivity();

    // Update dashboard data every minute
    setInterval(() => {
        dashboardService.updateWidgets();
        dashboardService.renderRecentActivity();
    }, 60000);
});

// Sample data initialization for demo
function initializeSampleData() {
    if (!localStorage.getItem('sales')) {
        const sampleSales = [
            {
                id: '1',
                amount: '1500',
                description: 'Haircut service',
                customer: 'John Doe',
                paymentMethod: 'mpesa',
                date: new Date().toISOString(),
                category: 'service'
            },
            {
                id: '2',
                amount: '2500',
                description: 'Braiding service',
                customer: 'Jane Smith',
                paymentMethod: 'cash',
                date: new Date(Date.now() - 86400000).toISOString(), // yesterday
                category: 'service'
            }
        ];
        localStorage.setItem('sales', JSON.stringify(sampleSales));
    }

    if (!localStorage.getItem('expenses')) {
        const sampleExpenses = [
            {
                id: '1',
                amount: '500',
                description: 'Hair products',
                category: 'supplies',
                date: new Date().toISOString()
            }
        ];
        localStorage.setItem('expenses', JSON.stringify(sampleExpenses));
    }

    if (!localStorage.getItem('customers')) {
        const sampleCustomers = [
            {
                id: '1',
                name: 'John Doe',
                phone: '+254712345678',
                email: 'john@example.com',
                notes: 'Regular customer, prefers haircuts',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                name: 'Jane Smith',
                phone: '+254798765432',
                email: 'jane@example.com',
                notes: 'New customer, braiding services',
                createdAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('customers', JSON.stringify(sampleCustomers));
    }
}

// Initialize sample data on first load
initializeSampleData();
