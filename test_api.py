import requests
import json

# Test registration API
url = "http://localhost:8000/api/auth/register/"
data = {
    "phone": "+254712345679",  # Different phone number
    "business_name": "Test Business 2", 
    "business_category": "services",
    "password": "test123",
    "password_confirm": "test123"
}

try:
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", e)
