// Firebase Authentication utilities for HustleDesk

import { 
    auth, 
    db, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    googleProvider,
    signInWithPopup,
    onAuthStateChanged,
    doc, 
    setDoc, 
    getDoc 
} from './firebase.js';

class AuthService {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Set up auth state listener
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                this.currentUser = user;
                // Load user profile from Firestore
                await this.loadUserProfile(user.uid);
            } else {
                this.currentUser = null;
                localStorage.removeItem('currentUser');
            }
        });

        // Load user from localStorage if available
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    // User registration with Firebase Auth and Firestore
    async register(name, email, password, businessName, businessCategory) {
        try {
            // Validate password strength
            if (password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save user profile in Firestore
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email,
                businessName: businessName,
                businessCategory: businessCategory,
                createdAt: new Date(),
            });

            console.log("User registered:", user.uid);
            return { success: true, user: user };
        } catch (error) {
            let errorMessage = 'Registration failed';
            
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'Email already in use';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak';
            }
            
            console.error("Registration error:", errorMessage);
            return { success: false, error: errorMessage };
        }
    }

    // User login with Firebase Auth
    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Load user profile from Firestore
            await this.loadUserProfile(user.uid);
            
            console.log("User logged in:", user.uid);
            return { success: true, user: user };
        } catch (error) {
            let errorMessage = 'Login failed';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address';
            }
            
            console.error("Login error:", errorMessage);
            return { success: false, error: errorMessage };
        }
    }

    // Google Sign-In
    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Save to Firestore if first time
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    createdAt: new Date(),
                }, { merge: true });
            }

            console.log("Google Sign-In success:", user.uid);
            return { success: true, user: user };
        } catch (error) {
            console.error("Google Login error:", error.message);
            return { success: false, error: 'Google login failed' };
        }
    }

    // Load user profile from Firestore
    async loadUserProfile(uid) {
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userProfile = {
                    uid: uid,
                    email: auth.currentUser?.email,
                    ...userData
                };
                localStorage.setItem('currentUser', JSON.stringify(userProfile));
                this.currentUser = userProfile;
                return userProfile;
            }
        } catch (error) {
            console.error("Error loading user profile:", error);
        }
        return null;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Logout
    async logout() {
        try {
            await signOut(auth);
            localStorage.removeItem('currentUser');
            this.currentUser = null;
            window.location.href = '../index.html';
        } catch (error) {
            console.error("Logout error:", error);
        }
    }

    // Check if user has completed onboarding
    hasCompletedOnboarding() {
        return this.isAuthenticated() && this.currentUser?.businessName;
    }

    // Update user profile
    async updateProfile(updates) {
        try {
            if (this.currentUser && auth.currentUser) {
                await setDoc(doc(db, "users", auth.currentUser.uid), updates, { merge: true });
                await this.loadUserProfile(auth.currentUser.uid);
                return { success: true, user: this.currentUser };
            }
            return { success: false, error: 'No user logged in' };
        } catch (error) {
            console.error("Profile update error:", error);
            return { success: false, error: 'Profile update failed' };
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
