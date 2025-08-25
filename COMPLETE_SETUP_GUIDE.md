# HustleDesk - Complete Setup and Usage Guide

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ installed
- Node.js 14+ installed
- Modern web browser

### 1. Start the Backend (Django)
```bash
# Navigate to Django project
cd mysite

# Install Python dependencies (if not already installed)
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Start the Django development server
python manage.py runserver
```

**Backend will be running at:** `http://localhost:8000`

### 2. Start the Frontend
```bash
# Open a new terminal and navigate to frontend
cd hustledesk-frontend

# Install Node.js dependencies
npm install

# Start the frontend development server
npm start
```

**Frontend will be running at:** `http://localhost:3000`

### 3. Access the Application
1. Open your browser and go to `http://localhost:3000`
2. Complete the onboarding process:
   - View the welcome screens
   - Register with your phone number and business details
   - Verify OTP (use `123456` for demo)
   - Access your dashboard

## 📋 Application Structure

### Backend (Django)
```
mysite/
├── mysite/               # Project settings
│   ├── settings.py       # Configuration with CORS, JWT, etc.
│   ├── urls.py          # Main URL routing (includes /api/)
│   └── wsgi.py          # WSGI configuration
├── hustledesk/          # Main application
│   ├── models.py        # Database models (User, Sale, Customer, etc.)
│   ├── serializers.py   # API serializers for data conversion
│   ├── views.py         # API endpoints and business logic
│   ├── urls.py          # App-specific URL routes
│   ├── admin.py         # Django admin configuration
│   └── migrations/      # Database migration files
└── manage.py            # Django management script
```

### Frontend (HTML/CSS/JS)
```
hustledesk-frontend/
├── index.html           # Landing/splash page
├── auth/                # Authentication pages
│   ├── welcome.html     # Welcome carousel
│   ├── register.html    # Registration form
│   └── verify-otp.html  # OTP verification
├── dashboard.html       # Main dashboard
├── sales/               # Sales management
│   ├── index.html      # Sales list
│   └── record.html      # Record sale form
├── css/
│   └── style.css       # Custom styles
├── js/                 # JavaScript modules
│   ├── api.js          # API client for backend communication
│   ├── auth.js         # Authentication logic
│   ├── dashboard.js    # Dashboard functionality
│   └── sales.js        # Sales operations
├── start-server.js     # Development HTTP server
├── package.json        # Node.js configuration
└── README.md           # Project documentation
```

## 🔌 API Endpoints Overview

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/verify-otp/` - Verify OTP code
- `POST /api/auth/login/` - User login

### Dashboard
- `GET /api/dashboard/stats/` - Get dashboard statistics
- `GET /api/dashboard/activity/` - Get recent activity

### Sales Management
- `GET /api/sales/` - List all sales
- `POST /api/sales/` - Create new sale
- `GET /api/sales/{id}/` - Get specific sale
- `PUT /api/sales/{id}/` - Update sale
- `DELETE /api/sales/{id}/` - Delete sale

### Customer Management
- `GET /api/customers/` - List all customers
- `POST /api/customers/` - Create new customer
- (Similar endpoints for expenses, invoices, tasks)

## 🎯 Key Features

### 1. User Onboarding
- Beautiful welcome carousel showcasing features
- Phone-based registration with OTP verification
- Business information collection
- Social login options (Google/Facebook - demo mode)

### 2. Dashboard
- Real-time business overview
- Today's sales and expenses
- Monthly performance metrics
- Recent activity feed
- Quick action buttons

### 3. Sales Management
- Record sales with customer details
- Multiple payment methods (Cash, M-Pesa)
- Sales history with filtering
- Analytics and statistics

### 4. Customer Management
- Add and manage customer profiles
- Track customer purchase history
- Debtor management
- Customer notes and details

### 5. Expense Tracking
- Categorized expense recording
- Expense history
- Budget insights
- Spending analysis

## 🔧 Configuration Details

### Backend Configuration (mysite/settings.py)
- **Database**: SQLite (development), easily switchable to PostgreSQL
- **CORS**: Enabled for localhost:3000
- **JWT**: Token-based authentication with 24-hour access tokens
- **Authentication**: Custom user model with phone verification

### Frontend Configuration
- **API Base URL**: `http://localhost:8000/api`
- **Storage**: localStorage for tokens and user data
- **Styling**: Tailwind CSS with custom overrides
- **Responsive**: Mobile-first design approach

## 🧪 Testing the Application

### Demo Credentials
- **OTP Code**: Always use `123456` for verification
- **Sample Data**: Auto-generated demo sales and customers

### Testing Flow
1. **Registration**: Fill out the registration form
2. **OTP Verification**: Enter `123456` when prompted
3. **Dashboard**: Explore the overview widgets
4. **Sales**: Record test sales transactions
5. **Customers**: Add sample customers
6. **Expenses**: Record test expenses

### API Testing
You can test API endpoints using curl or Postman:

```bash
# Test registration
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+254712345678", "business_name": "Test Business", "business_category": "retail", "password": "test123", "password_confirm": "test123"}'

# Test OTP verification
curl -X POST http://localhost:8000/api/auth/verify-otp/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+254712345678", "otp_code": "123456"}'
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend is running on port 8000
   - Check CORS settings in `settings.py`
   - Verify frontend is on port 3000

2. **Database Issues**
   - Run migrations: `python manage.py migrate`
   - Check SQLite database file creation

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token storage

4. **Port Conflicts**
   - Backend: Change port with `python manage.py runserver 8001`
   - Frontend: Change port in `start-server.js`

### Debug Mode
- Backend runs in DEBUG mode by default
- Check browser console for frontend errors
- Check Django terminal for backend errors

## 📈 Next Steps & Enhancements

### Immediate Next Steps
1. **Test All Features**: Go through each module thoroughly
2. **Data Validation**: Add more robust form validation
3. **Error Handling**: Improve error messages and handling
4. **UI Polish**: Refine user interface and UX

### Future Enhancements
1. **Real M-Pesa Integration**: Replace mock payment processing
2. **Advanced Reporting**: Add comprehensive analytics
3. **Mobile App**: Develop React Native mobile version
4. **Real-time Updates**: Implement WebSocket support
5. **Offline Support**: Add service workers for offline capability
6. **Multi-currency**: Support multiple currencies
7. **Inventory Management**: Add stock tracking features

## 🆘 Support

If you encounter issues:
1. Check this documentation first
2. Verify all services are running
3. Check console for error messages
4. Ensure all dependencies are installed

## 📊 Sample Data

The application includes sample data generation:
- Demo sales transactions
- Sample customers
- Test expenses
- This helps with testing without manual data entry

---

**🎉 Congratulations! Your HustleDesk application is now set up and ready to use.**

Start exploring the features and customize according to your business needs. The architecture is designed to be modular and scalable for future enhancements.
