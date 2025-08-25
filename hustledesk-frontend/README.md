# HustleDesk Frontend

A comprehensive business management frontend application built with HTML, CSS, and JavaScript.

## Features

### 🎯 Onboarding Flow
- **Splash Screen**: Beautiful loading animation with HustleDesk branding
- **Welcome Carousel**: 3-screen introduction showcasing key features
- **Authentication**: Phone registration with OTP verification
- **Social Login**: Google and Facebook integration support

### 📊 Dashboard
- **Overview Widgets**: Today's sales, expenses, and top customer
- **Quick Actions**: One-tap access to record sales, add expenses, add customers, send invoices
- **Recent Activity**: Live feed of all business transactions
- **Responsive Design**: Works perfectly on mobile and desktop

### 💰 Sales Management
- **Record Sales**: Quick sale recording with customer details
- **Sales History**: Complete transaction history with filtering
- **Payment Methods**: Support for Cash and M-Pesa payments
- **Sales Analytics**: Total sales, monthly performance, average sale metrics

### 💸 Expense Tracking
- **Expense Categories**: Stock, Rent, Transport, Utilities, Other
- **Expense History**: Track all business expenditures
- **Budget Insights**: Understand spending patterns

### 👥 Customer Management
- **Customer CRM**: Add and manage customer profiles
- **Customer Notes**: Track preferences and important details
- **Purchase History**: View customer transaction history

### 📋 Invoice System
- **Create Invoices**: Professional invoice creation
- **Send Options**: WhatsApp, SMS, PDF download
- **Payment Tracking**: Monitor invoice status

### 📈 Reports & Analytics
- **Sales Reports**: Daily, weekly, monthly performance
- **Expense Reports**: Categorized spending analysis
- **Profit/Loss**: Comprehensive financial overview
- **Debtors Report**: Track outstanding payments

### ✅ Tasks & Reminders
- **To-Do List**: Manage business tasks
- **Due Dates**: Set deadlines and reminders
- **Completion Tracking**: Mark tasks as complete

### 📱 M-Pesa Integration
- **Payment Sync**: Automatic M-Pesa transaction matching
- **Payment Methods**: Seamless M-Pesa payment recording
- **Transaction History**: Complete payment tracking

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Tailwind CSS (via CDN)
- **Storage**: LocalStorage for data persistence
- **Icons**: Heroicons SVG icons
- **Responsive**: Mobile-first design approach

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Modern web browser

### Installation & Running

1. **Navigate to the frontend directory**:
   ```bash
   cd hustledesk-frontend
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser**:
   Navigate to `http://localhost:3000`

### Demo Credentials
For OTP verification, use code: `123456`

## Project Structure

```
hustledesk-frontend/
├── index.html              # Splash screen & landing
├── auth/                   # Authentication pages
│   ├── welcome.html        # Welcome carousel
│   ├── register.html       # Registration form
│   └── verify-otp.html     # OTP verification
├── dashboard.html          # Main dashboard
├── sales/                  # Sales management
│   ├── index.html         # Sales list
│   └── record.html         # Record sale form
├── css/
│   └── style.css          # Custom styles
├── js/                    # JavaScript modules
│   ├── auth.js           # Authentication logic
│   ├── dashboard.js      # Dashboard functionality
│   └── sales.js          # Sales operations
├── start-server.js       # Development server
└── package.json          # Project configuration
```

## Key JavaScript Modules

### Auth Service (`js/auth.js`)
- User registration and authentication
- OTP verification handling
- Session management
- Social login integration

### Dashboard Service (`js/dashboard.js`)
- Overview widgets data
- Recent activity tracking
- Sales and expense calculations
- Data visualization

### Sales Service (`js/sales.js`)
- Sales recording and management
- Sales filtering and search
- Statistics and analytics
- Data persistence

## Data Storage

The application uses browser localStorage for data persistence, storing:
- User authentication data
- Sales transactions
- Expense records
- Customer information
- Application settings

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Development Notes

- All form validations are client-side
- Mock APIs simulate backend functionality
- Responsive design tested on mobile and desktop
- LocalStorage provides data persistence between sessions

## Next Steps

1. **Backend Integration**: Connect to Django REST API endpoints
2. **Real M-Pesa Integration**: Implement actual M-Pesa payment processing
3. **Database Migration**: Move from localStorage to proper database
4. **Real-time Updates**: Add WebSocket support for live data
5. **Offline Support**: Implement service workers for offline capability
6. **Progressive Web App**: Add PWA features for mobile app-like experience

## License

MIT License - feel free to use for your business management needs!
