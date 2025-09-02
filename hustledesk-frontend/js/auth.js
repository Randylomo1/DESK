// Django Authentication utilities for HustleDesk

class AuthService {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Load user state from localStorage
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        if (isAuthenticated) {
            // In a real app, you might want to verify the session with the backend here
            this.currentUser = { isAuthenticated: true }; 
        }
    }

    // User registration with Django backend
    async register(name, email, password, businessName, businessCategory) {
        try {
            const response = await fetch('/api/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Django's CSRF token needs to be included in headers
                    'X-CSRFToken': this.getCsrfToken() 
                },
                body: JSON.stringify({
                    username: email, // Assuming email is the username
                    email: email,
                    password: password,
                    first_name: name,
                    // You might need to adjust your Django backend to accept these fields
                    business_name: businessName,
                    business_category: businessCategory
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const data = await response.json();
            return { success: true, message: data.message };

        } catch (error) {
            console.error("Registration error:", error.message);
            return { success: false, error: error.message };
        }
    }

    // User login with Django backend
    async login(email, password) {
        try {
            const response = await fetch('/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.getCsrfToken()
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
            
            const data = await response.json();
            localStorage.setItem('isAuthenticated', 'true');
            this.currentUser = { isAuthenticated: true };

            return { success: true };

        } catch (error) {
            console.error("Login error:", error.message);
            return { success: false, error: error.message };
        }
    }

    // Logout from Django backend
    async logout() {
        try {
            await fetch('/api/logout/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': this.getCsrfToken()
                }
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('isAuthenticated');
            this.currentUser = null;
            window.location.href = '/auth/login.html';
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser && localStorage.getItem('isAuthenticated') === 'true';
    }

    // Get current user (simplified)
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Helper to get CSRF token from cookies
    getCsrfToken() {
        let csrfToken = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, 'csrftoken'.length + 1) === ('csrftoken' + '=')) {
                    csrfToken = decodeURIComponent(cookie.substring('csrftoken'.length + 1));
                    break;
                }
            }
        }
        return csrfToken;
    }
}

// Initialize auth service
const authService = new AuthService();

// Utility functions for auth-related operations
function requireAuth() {
    if (!authService.isAuthenticated()) {
        window.location.href = '/auth/login.html';
        return false;
    }
    return true;
}

// These functions can be used to show messages to the user
function showAuthError(message) {
    // You can implement a toast notification or other UI element here
    console.error("Auth Error:", message);
    alert(message); // Simple alert for now
}

function showAuthSuccess(message) {
    // You can implement a toast notification or other UI element here
    console.log("Auth Success:", message);
    alert(message); // Simple alert for now
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { authService, requireAuth, showAuthError, showAuthSuccess };
}
