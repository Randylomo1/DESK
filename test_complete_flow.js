// Test script for complete registration and OTP verification flow
const API_BASE_URL = 'http://localhost:8000/api';

async function testCompleteFlow() {
    console.log('=== Testing Complete Registration & OTP Flow ===');
    
    // Step 1: Registration
    console.log('\n1. Testing Registration...');
    const userData = {
        name: 'Test User',
        business_name: 'Test Business',
        business_category: 'services',
        phone: '+254797584227', // Updated phone number
        password: 'test123',
        password_confirm: 'test123'
    };

    try {
        const registerResponse = await fetch(API_BASE_URL + '/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        console.log('Registration Status:', registerResponse.status);
        const registerData = await registerResponse.json();
        console.log('Registration Response:', registerData);

        if (registerResponse.status === 201) {
            // Step 2: OTP Verification
            console.log('\n2. Testing OTP Verification...');
            const otpData = {
                phone: userData.phone,
                otp_code: registerData.otp // Use the OTP from registration response
            };

            const verifyResponse = await fetch(API_BASE_URL + '/auth/verify-otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(otpData),
            });

            console.log('OTP Verification Status:', verifyResponse.status);
            const verifyData = await verifyResponse.json();
            console.log('OTP Verification Response:', verifyData);

            if (verifyResponse.status === 200) {
                console.log('\n✅ SUCCESS: Complete flow test passed!');
                console.log('User registered and verified successfully.');
                console.log('Access Token:', verifyData.tokens.access.substring(0, 50) + '...');
                console.log('User ID:', verifyData.user.id);
            } else {
                console.log('\n❌ OTP Verification failed');
            }
        } else {
            console.log('\n❌ Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

testCompleteFlow();
