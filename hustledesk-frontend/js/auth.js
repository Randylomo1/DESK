// Authentication utilities for HustleDesk with API integration

class AuthService {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Load user from localStorage
        const userData = localStorage.getItem('currentUser');
        const authToken = localStorage.getItem('authToken');
        
        if (userData && authToken) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // User registration with API
    async register(userData) {
        try {
            const response = await apiClient.register(userData);
            
            // Store temp data for OTP verification
            localStorage.setItem('tempUserData', JSON.stringify({
                phone: userData.phone,
                businessName: userData.business_name,
                category: userData.business_category
            }));
            
            return { success: true, ...response };
        } catch (error) {
            const message = handleApiError(error, 'Registration failed');
            return { success: false, error: message };
        }
    }

    // OTP verification with API
    async verifyOTP(phone, otpCode) {
        try {
            const response = await apiClient.verifyOTP(phone, otpCode);
            
            // Store tokens and user data
            apiClient.setTokens(response.tokens.access, response.tokens.refresh);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUser = response.user;
            
            return { success: true, user: response.user };
        } catch (error) {
            const message = handleApiError(error, 'OTP verification failed');
            return { success: false, error: message };
        }
    }

    // User login with API
    async login(phone, password) {
        try {
            const response = await apiClient.login(phone, password);
            
            // Store tokens and user data
            apiClient.setTokens(response.tokens.access, response.tokens.refresh);
            localStorage.setItem('currentUser', JSON.stringify(response.user));
            this.currentUser = response.user;
            
            return { success: true, user: response.user };
        } catch (error) {
            const message = handleApiError(error, 'Login failed');
            return { success: false, error: message };
        }
    }

    // Social login (mock for now - would integrate with actual providers)
    async loginWithProvider(provider) {
        try {
            // For demo purposes, we'll create a mock user
            // In production, this would integrate with actual OAuth providers
            const mockUser = {
                id: 'social-user-123',
                username: `user_${provider}`,
                email: `demo@${provider}.com`,
                phone: null,
                business_name: `${provider} Business`,
                business_category: 'services',
                is_phone_verified: true
            };
            
            // Generate mock tokens (in production, these would come from the backend)
            const mockTokens = {
                access: `mock_access_token_${provider}`,
                refresh: `mock_refresh_token_${provider}`
            };
            
            // Store mock data
            apiClient.setTokens(mockTokens.access, mockTokens.refresh);
            localStorage.setItem('currentUser', JSON.stringify(mockUser));
            this.currentUser = mockUser;
            
            return { success: true, user: mockUser };
        } catch (error) {
            const message = handleApiError(error, `${provider} login failed`);
            return { success: false, error: message };
        }
    }

    // Check if user is authenticated
    isAuthenticated() {
        const authToken = localStorage.getItem('authToken');
        return !!this.currentUser && !!authToken;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Logout
    logout() {
        apiClient.clearTokens();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('tempUserData');
        this.currentUser = null;
        window.location.href = '../index.html';
    }

    // Check if user has completed onboarding
    hasCompletedOnboarding() {
        return this.isAuthenticated() && this.currentUser?.business_name;
    }

    // Update user profile
    async updateProfile(updates) {
        try {
            // This would call the backend API in production
            // For now, we'll update localStorage
            if (this.currentUser) {
                this.currentUser = { ...this.currentUser, ...updates };
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                return { success: true, user: this.currentUser };
            }
            return { success: false, error: 'No user logged in' };
        } catch (error) {
            const message = handleApiError(error, 'Profile update failed');
            return { success: false, error: message };
        }
    }
}

// Initialize auth service
const authService = new AuthService();

// Utility functions for auth-related operations
function requireAuth() {
    if (!authService.isAuthenticated()) {
        window.location.href = '../auth/welcome.html';
        return false;
    }
    return true;
}

function showAuthError(message) {
    showToast(message, 'error');
}

function showAuthSuccess(message) {
    showToast(message, 'success');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { authService, requireAuth, showAuthError, showAuthSuccess };
}
