import requests
import json

# Test OTP verification API
url = "http://localhost:8000/api/auth/verify-otp/"
data = {
    "phone": "+254712345679",
    "otp_code": "718828"  # Use the OTP returned from registration
}

try:
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)
    print("Response:", response.json())
except Exception as e:
    print("Error:", e)
