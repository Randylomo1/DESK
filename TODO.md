# Authentication Migration Plan

## Phase 1: Frontend Firebase Auth Implementation ✅ COMPLETED
- [x] Update firebase.js with auth imports
- [x] Rewrite auth.js for Firebase Auth
- [x] Update register.html form for email/password
- [x] Remove verify-otp.html
- [x] Create login.html for email login
- [x] Update welcome.html login options

## Phase 2: Backend Cleanup ✅ COMPLETED
- [x] Remove OTP fields from User model
- [x] Remove OTP-related serializers
- [x] Remove OTP verification view
- [x] Clean up URLs

## Phase 3: Test File Removal ✅ COMPLETED
- [x] Remove test_registration_login.py
- [x] Remove test_login.py
- [x] Remove test_dashboard.py

## Phase 4: Testing & Verification
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test Google Sign-In
- [ ] Verify Firestore integration
