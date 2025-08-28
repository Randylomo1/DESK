// Debug script to test frontend registration
const API_BASE_URL = 'http://localhost:8000/api';

async function testRegistration() {
    const testData = {
        phone: "+254712345678",
        business_name: "Test Business",
        business_category: "services",
        password: "test123",
        password_confirm: "test123"
    };

    console.log("Testing registration with data:", testData);

    try {
        const response = await fetch(`${API_BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData),
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

testRegistration();
