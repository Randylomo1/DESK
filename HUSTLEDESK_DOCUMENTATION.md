# HustleDesk - Complete Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend Structure](#frontend-structure)
4. [Backend Structure](#backend-structure)
5. [API Endpoints](#api-endpoints)
6. [Authentication Flow](#authentication-flow)
7. [Data Models](#data-models)
8. [Setup Instructions](#setup-instructions)
9. [Usage Guide](#usage-guide)
10. [Development Workflow](#development-workflow)
11. [Testing](#testing)
12. [Deployment](#deployment)

## 🎯 Overview

HustleDesk is a comprehensive business management application designed for small businesses and entrepreneurs. It provides tools for managing sales, expenses, customers, invoices, and tasks in one centralized platform.

**Key Features:**
- User registration with phone verification (OTP)
- Dashboard with business overview and analytics
- Sales recording and management
- Expense tracking with categories
- Customer relationship management (CRM)
- Invoice generation and management
- Task management with due dates
- Responsive design for mobile and desktop

## 🏗️ Architecture

### Frontend (Client-Side)
- **Technology Stack**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS framework
- **Storage**: Browser localStorage for data persistence
- **API Communication**: RESTful API calls using Fetch API
- **Authentication**: JWT (JSON Web Tokens)

### Backend (Server-Side)
- **Framework**: Django 5.0 with Django REST Framework
- **Database**: SQLite (development), PostgreSQL (production-ready)
- **Authentication**: JWT with SimpleJWT
- **API**: RESTful architecture with JSON responses
- **CORS**: Enabled for cross-origin requests

### Data Flow
```
Frontend (Browser) → API Requests → Django Backend → Database
Frontend ← API Responses ← Django Backend ← Database
```

## 📁 Frontend Structure

```
hustledesk-frontend/
├── index.html              # Splash screen & landing page
├── auth/                   # Authentication pages
│   ├── welcome.html        # Welcome carousel & feature showcase
│   ├── register.html       # User registration form
│   └── verify-otp.html     # OTP verification
├── dashboard.html          # Main dashboard with overview
├── sales/                  # Sales management
│   ├── index.html         # Sales list & analytics
│   └── record.html         # Record new sale form
├── css/
│   └── style.css          # Custom styles & overrides
├── js/                    # JavaScript modules
│   ├── api.js            # API client & HTTP requests
│   ├── auth.js           # Authentication logic
│   ├── dashboard.js      # Dashboard functionality
│   └── sales.js          # Sales operations
├── start-server.js       # Development HTTP server
└── package.json          # Project configuration
```

## 🖥️ Backend Structure

```
mysite/
├── mysite/               # Django project settings
│   ├── settings.py       # Project configuration
│   ├── urls.py          # Main URL routing
│   └── wsgi.py          # WSGI configuration
├── hustledesk/          # Main Django app
│   ├── models.py        # Database models
│   ├── serializers.py   # API serializers
│   ├── views.py         # API views & business logic
│   ├── urls.py          # App URL routing
│   ├── admin.py         # Django admin configuration
│   └── migrations/      # Database migrations
└── manage.py            # Django management script
```

## 🔌 API Endpoints

### Authentication Endpoints
- `POST /api/auth/register/` - User registration
- `POST /api/auth/verify-otp/` - OTP verification
- `POST /api/auth/login/` - User login

### Dashboard Endpoints
- `GET /api/dashboard/stats/` - Dashboard statistics
- `GET /api/dashboard/activity/` - Recent activity

### Sales Endpoints
- `GET /api/sales/` - List all sales
- `POST /api/sales/` - Create new sale
- `GET /api/sales/{id}/` - Get specific sale
- `PUT /api/sales/{id}/` - Update sale
- `DELETE /api/sales/{id}/` - Delete sale

### Customer Endpoints
- `GET /api/customers/` - List all customers
- `POST /api/customers/` - Create new customer
- `GET /api/customers/{id}/` - Get specific customer
- `PUT /api/customers/{id}/` - Update customer
- `DELETE /api/customers/{id}/` - Delete customer

### Expense Endpoints
- `GET /api/expenses/` - List all expenses
- `POST /api/expenses/` - Create new expense
- `GET /api/expenses/{id}/` - Get specific expense
- `PUT /api/expenses/{id}/` - Update expense
- `DELETE /api/expenses/{id}/` - Delete expense

## 🔐 Authentication Flow

1. **User Registration**
   - User enters phone, business name, category, and password
   - Backend generates OTP and stores temporarily
   - OTP is "sent" to phone (demo: returned in response)

2. **OTP Verification**
   - User enters received OTP code
   - Backend verifies OTP and expiry
   - JWT tokens generated upon successful verification

3. **User Login**
   - User enters phone and password
   - Backend authenticates and returns JWT tokens
   - Tokens stored in localStorage for subsequent requests

4. **API Authentication**
   - All authenticated endpoints require JWT in Authorization header
   - Tokens automatically refreshed when expired

## 🗃️ Data Models

### User Model
```python
class User(AbstractUser):
    phone = models.CharField(max_length=15, unique=True)
    business_name = models.CharField(max_length=255)
    business_category = models.CharField(max_length=100)
    is_phone_verified = models.BooleanField(default=False)
    otp_code = models.CharField(max_length=6, null=True)
    otp_expiry = models.DateTimeField(null=True)
```

### Sale Model
```python
class Sale(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True)
    payment_method = models.CharField(max_length=20, choices=[...])
    date = models.DateTimeField(auto_now_add=True)
```

### Customer Model
```python
class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=15, null=True)
    email = models.EmailField(null=True)
    notes = models.TextField(null=True)
    is_debtor = models.BooleanField(default=False)
```

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 14+
- Django 5.0
- SQLite/PostgreSQL

### Backend Setup
```bash
# Navigate to Django project
cd mysite

# Install Python dependencies
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd hustledesk-frontend

# Install Node.js dependencies
npm install

# Start development server
npm start
```

### Environment Configuration
Backend runs on: `http://localhost:8000`
Frontend runs on: `http://localhost:3000`

## 📖 Usage Guide

### 1. Getting Started
1. Open `http://localhost:3000` in your browser
2. Complete the onboarding process:
   - View welcome carousel
   - Register with phone and business details
   - Verify OTP (use `123456` for demo)
   - Access dashboard

### 2. Dashboard Features
- View today's sales and expenses
- See monthly performance metrics
- Check recent activity feed
- Access quick actions for common tasks

### 3. Managing Sales
- Navigate to Sales section
- Record new sales with customer details
- View sales history with filtering options
- Analyze sales performance

### 4. Customer Management
- Add new customers with contact information
- View customer purchase history
- Track debtor status

### 5. Expense Tracking
- Record business expenses with categories
- Categorize expenses (stock, rent, transport, etc.)
- Monitor spending patterns

## 🔧 Development Workflow

### Adding New Features
1. **Backend First Approach**
   - Define models in `models.py`
   - Create serializers in `serializers.py`
   - Implement views in `views.py`
   - Add URL routes in `urls.py`
   - Run migrations

2. **Frontend Integration**
   - Create HTML pages if needed
   - Add API calls in JavaScript modules
   - Update UI components
   - Test functionality

### Code Organization
- Keep backend logic in Django app
- Frontend assets in separate directory
- API communication through dedicated client
- Error handling and validation throughout

## 🧪 Testing

### Backend Testing
```bash
# Run Django tests
python manage.py test hustledesk
```

### Frontend Testing
- Manual testing through browser
- API integration testing
- UI/UX validation

### Demo Data
- Sample sales, expenses, and customers are auto-generated
- Use OTP code `123456` for verification
- Demo users created with mock data

## 🚀 Deployment

### Production Considerations
1. **Database**: Switch from SQLite to PostgreSQL
2. **Static Files**: Configure Django static files serving
3. **Security**: Use environment variables for secrets
4. **CORS**: Update allowed origins for production domain
5. **HTTPS**: Enable SSL/TLS encryption

### Deployment Options
- **Frontend**: Netlify, Vercel, or traditional web hosting
- **Backend**: Heroku, DigitalOcean, AWS, or similar
- **Database**: Cloud SQL, AWS RDS, or managed database service

## 📞 Support & Contribution

For issues, feature requests, or contributions:
1. Check existing documentation
2. Review API endpoints and data models
3. Test with demo data first
4. Submit issues with detailed descriptions

## 🔮 Future Enhancements

- Real M-Pesa integration
- Advanced reporting and analytics
- Mobile app development
- Multi-currency support
- Inventory management
- Team collaboration features
- API documentation with Swagger
- WebSocket real-time updates
- Offline capability with service workers

---

*Last Updated: January 2024*
*Version: 1.0.0*
