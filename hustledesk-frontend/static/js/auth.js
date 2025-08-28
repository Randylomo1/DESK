document.getElementById('register-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const email = formData.get('email');
    const password = formData.get('password');
    const businessName = formData.get('business_name');
    const businessCategory = formData.get('business_category');

    try {
        const response = await fetch('http://localhost:8000/api/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                business_name: businessName,
                business_category: businessCategory,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Registration successful!');
            window.location.href = '/auth/login/';
        } else {
            alert(data.error || 'Registration failed.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});
