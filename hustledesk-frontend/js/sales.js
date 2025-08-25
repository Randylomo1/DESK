// Sales management functionality for HustleDesk

class SalesService {
    constructor() {
        this.salesData = JSON.parse(localStorage.getItem('sales') || '[]');
    }

    // Get all sales
    getAllSales() {
        return this.salesData.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Get sales by date range
    getSalesByDateRange(range) {
        const now = new Date();
        let startDate;

        switch (range) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                return this.getAllSales();
        }

        return this.salesData.filter(sale => new Date(sale.date) >= startDate);
    }

    // Search sales
    searchSales(query) {
        if (!query) return this.getAllSales();
        
        const lowerQuery = query.toLowerCase();
        return this.salesData.filter(sale =>
            sale.customer?.toLowerCase().includes(lowerQuery) ||
            sale.description?.toLowerCase().includes(lowerQuery) ||
            sale.amount?.toString().includes(lowerQuery)
        );
    }

    // Add new sale
    addSale(saleData) {
        const sale = {
            id: this.generateId(),
            ...saleData,
            date: new Date().toISOString()
        };

        this.salesData.push(sale);
        localStorage.setItem('sales', JSON.stringify(this.salesData));
        return sale;
    }

    // Get sales statistics
    getSalesStats() {
        const totalSales = this.salesData.reduce((total, sale) => total + parseFloat(sale.amount), 0);
        
        const thisMonth = new Date();
        thisMonth.setDate(1);
        const monthlySales = this.salesData
            .filter(sale => new Date(sale.date) >= thisMonth)
            .reduce((total, sale) => total + parseFloat(sale.amount), 0);

        const averageSale = this.salesData.length > 0 ? totalSales / this.salesData.length : 0;

        return {
            totalSales,
            monthlySales,
            averageSale
        };
    }

    // Format currency
    formatCurrency(amount) {
        return `KES ${parseFloat(amount).toLocaleString()}`;
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Render sales list
    renderSalesList(sales) {
        const salesList = document.getElementById('salesList');
        const emptyState = document.getElementById('emptyState');

        if (sales.length === 0) {
            salesList.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        
        salesList.innerHTML = sales.map(sale => `
            <div class="px-6 py-4 hover:bg-gray-50 cursor-pointer" onclick="viewSale('${sale.id}')">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-sm font-medium text-gray-800">${sale.customer || 'Unknown Customer'}</h3>
                            <p class="text-xs text-gray-600">${sale.description || 'Sale'}</p>
                            <p class="text-xs text-gray-500">${new Date(sale.date).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-sm font-semibold text-green-600">${this.formatCurrency(sale.amount)}</p>
                        <p class="text-xs text-gray-600 capitalize">${sale.paymentMethod}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Update sales statistics
    updateSalesStats() {
        const stats = this.getSalesStats();
        
        document.getElementById('totalSales').textContent = this.formatCurrency(stats.totalSales);
        document.getElementById('monthlySales').textContent = this.formatCurrency(stats.monthlySales);
        document.getElementById('averageSale').textContent = this.formatCurrency(stats.averageSale);
    }
}

// Initialize sales page
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!requireAuth()) return;

    const salesService = new SalesService();
    
    // Load initial data
    salesService.updateSalesStats();
    salesService.renderSalesList(salesService.getAllSales());
});

// Global functions for sales page
function filterSales(query) {
    const salesService = new SalesService();
    const filteredSales = salesService.searchSales(query);
    salesService.renderSalesList(filteredSales);
}

function filterByDate(range) {
    const salesService = new SalesService();
    const filteredSales = salesService.getSalesByDateRange(range);
    salesService.renderSalesList(filteredSales);
}

function viewSale(saleId) {
    // Implementation for viewing sale details
    showToast('Sale details view would be implemented here', 'info');
}

function recordSale() {
    window.location.href = 'record.html';
}

// Handle sale form submission
document.addEventListener('DOMContentLoaded', function() {
    const saleForm = document.getElementById('recordSaleForm');
    if (saleForm) {
        saleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const saleData = {
                customer: formData.get('customer'),
                amount: formData.get('amount'),
                paymentMethod: formData.get('paymentMethod'),
                description: formData.get('description')
            };

            const salesService = new SalesService();
            salesService.addSale(saleData);
            
            showToast('Sale recorded successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
    }
});

// Sample data for demonstration
function initializeSampleSales() {
    if (!localStorage.getItem('sales')) {
        const sampleSales = [
            {
                id: '1',
                amount: '1500',
                description: 'Haircut service',
                customer: 'John Doe',
                paymentMethod: 'mpesa',
                date: new Date().toISOString()
            },
            {
                id: '2',
                amount: '2500',
                description: 'Braiding service',
                customer: 'Jane Smith',
                paymentMethod: 'cash',
                date: new Date(Date.now() - 86400000).toISOString()
            },
            {
                id: '3',
                amount: '1200',
                description: 'Hair treatment',
                customer: 'Mike Johnson',
                paymentMethod: 'mpesa',
                date: new Date(Date.now() - 172800000).toISOString()
            }
        ];
        localStorage.setItem('sales', JSON.stringify(sampleSales));
    }
}

// Initialize sample data
initializeSampleSales();
