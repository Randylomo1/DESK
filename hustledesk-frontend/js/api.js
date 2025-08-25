// API client for connecting to Django backend

const API_BASE_URL = 'http://localhost:8000/api';

class APIClient {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.refreshToken = localStorage.getItem('refreshToken');
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                // Token expired, try to refresh
                await this.refreshAuthToken();
                return this.request(endpoint, options);
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async refreshAuthToken() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh: this.refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                this.setTokens(data.access, this.refreshToken);
                return true;
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            this.clearTokens();
            window.location.href = '/auth/welcome.html';
            return false;
        }
    }

    setTokens(accessToken, refreshToken) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    clearTokens() {
        this.token = null;
        this.refreshToken = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
    }

    // Authentication methods
    async register(userData) {
        return this.request('/auth/register/', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async verifyOTP(phone, otpCode) {
        return this.request('/auth/verify-otp/', {
            method: 'POST',
            body: JSON.stringify({ phone, otp_code: otpCode }),
        });
    }

    async login(phone, password) {
        return this.request('/auth/login/', {
            method: 'POST',
            body: JSON.stringify({ phone, password }),
        });
    }

    // Dashboard methods
    async getDashboardStats() {
        return this.request('/dashboard/stats/');
    }

    async getRecentActivity(limit = 10) {
        return this.request(`/dashboard/activity/?limit=${limit}`);
    }

    // Sales methods
    async getSales() {
        return this.request('/sales/');
    }

    async createSale(saleData) {
        return this.request('/sales/', {
            method: 'POST',
            body: JSON.stringify(saleData),
        });
    }

    async getSale(id) {
        return this.request(`/sales/${id}/`);
    }

    async updateSale(id, saleData) {
        return this.request(`/sales/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(saleData),
        });
    }

    async deleteSale(id) {
        return this.request(`/sales/${id}/`, {
            method: 'DELETE',
        });
    }

    // Customer methods
    async getCustomers() {
        return this.request('/customers/');
    }

    async createCustomer(customerData) {
        return this.request('/customers/', {
            method: 'POST',
            body: JSON.stringify(customerData),
        });
    }

    async getCustomer(id) {
        return this.request(`/customers/${id}/`);
    }

    async updateCustomer(id, customerData) {
        return this.request(`/customers/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(customerData),
        });
    }

    async deleteCustomer(id) {
        return this.request(`/customers/${id}/`, {
            method: 'DELETE',
        });
    }

    // Expense methods
    async getExpenses() {
        return this.request('/expenses/');
    }

    async createExpense(expenseData) {
        return this.request('/expenses/', {
            method: 'POST',
            body: JSON.stringify(expenseData),
        });
    }

    async getExpense(id) {
        return this.request(`/expenses/${id}/`);
    }

    async updateExpense(id, expenseData) {
        return this.request(`/expenses/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(expenseData),
        });
    }

    async deleteExpense(id) {
        return this.request(`/expenses/${id}/`, {
            method: 'DELETE',
        });
    }

    // Invoice methods
    async getInvoices() {
        return this.request('/invoices/');
    }

    async createInvoice(invoiceData) {
        return this.request('/invoices/', {
            method: 'POST',
            body: JSON.stringify(invoiceData),
        });
    }

    async getInvoice(id) {
        return this.request(`/invoices/${id}/`);
    }

    async updateInvoice(id, invoiceData) {
        return this.request(`/invoices/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(invoiceData),
        });
    }

    async deleteInvoice(id) {
        return this.request(`/invoices/${id}/`, {
            method: 'DELETE',
        });
    }

    // Task methods
    async getTasks() {
        return this.request('/tasks/');
    }

    async createTask(taskData) {
        return this.request('/tasks/', {
            method: 'POST',
            body: JSON.stringify(taskData),
        });
    }

    async getTask(id) {
        return this.request(`/tasks/${id}/`);
    }

    async updateTask(id, taskData) {
        return this.request(`/tasks/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(taskData),
        });
    }

    async deleteTask(id) {
        return this.request(`/tasks/${id}/`, {
            method: 'DELETE',
        });
    }
}

// Initialize global API client
const apiClient = new APIClient();

// Utility function to handle API errors
function handleApiError(error, defaultMessage = 'An error occurred') {
    console.error('API Error:', error);
    
    let message = defaultMessage;
    if (error.message.includes('NetworkError')) {
        message = 'Network error. Please check your connection.';
    } else if (error.message.includes('401')) {
        message = 'Session expired. Please login again.';
        apiClient.clearTokens();
        window.location.href = '/auth/welcome.html';
    } else if (error.message.includes('404')) {
        message = 'Resource not found.';
    } else if (error.message.includes('500')) {
        message = 'Server error. Please try again later.';
    }
    
    showToast(message, 'error');
    return message;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apiClient, handleApiError };
}
