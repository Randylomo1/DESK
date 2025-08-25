# HustleDesk Application Architecture

## Overview
HustleDesk is a business management application designed to help users manage their sales, expenses, customers, and tasks efficiently. The application is built using a Django backend and a JavaScript frontend, utilizing RESTful APIs for communication between the two.

## Architecture Components

### 1. Frontend
- **Technologies Used**: HTML, CSS (Tailwind CSS), JavaScript
- **Structure**:
  - **HTML Pages**: Contains the main structure of the application, including onboarding, dashboard, sales management, and authentication.
  - **CSS**: Tailwind CSS is used for styling, providing a responsive and modern design.
  - **JavaScript**: Handles client-side logic, API interactions, and user authentication.

### 2. Backend
- **Framework**: Django
- **Key Components**:
  - **Models**: Defines the data structure for users, sales, expenses, customers, invoices, and tasks.
  - **Serializers**: Converts complex data types (like querysets) into JSON format for API responses.
  - **Views**: Handles the business logic and API endpoints for user registration, authentication, and data management.
  - **URLs**: Maps URLs to the corresponding views for handling requests.

### 3. Database
- **Database Engine**: SQLite (for development)
- **Data Models**:
  - **User**: Custom user model with additional fields for business information.
  - **Customer**: Stores customer details and relationships with sales.
  - **Sale**: Records sales transactions, including amount, customer, and payment method.
  - **Expense**: Tracks business expenses with categories and descriptions.
  - **Invoice**: Manages invoices associated with customers and sales.
  - **Task**: Keeps track of tasks and their completion status.

### 4. API
- **RESTful API**: Provides endpoints for frontend to interact with backend services.
- **Authentication**: Uses JWT (JSON Web Tokens) for secure user authentication.
- **CORS**: Configured to allow requests from the frontend application.

## Features
- **User Registration and Authentication**: Users can register, verify their phone numbers via OTP, and log in.
- **Dashboard**: Provides an overview of sales, expenses, and recent activity.
- **Sales Management**: Users can record sales, view sales history, and analyze performance.
- **Expense Tracking**: Users can add and manage expenses.
- **Customer Management**: Users can add and manage customer profiles.
- **Task Management**: Users can create and track tasks.

## Setup Instructions
1. **Clone the Repository**: 
   ```bash
   git clone <repository-url>
   cd hustledesk-frontend
   ```

2. **Install Dependencies**:
   - For the frontend, ensure you have Node.js installed and run:
     ```bash
     npm install
     ```

3. **Run the Development Server**:
   ```bash
   npm start
   ```

4. **Run the Django Backend**:
   - Navigate to the Django project directory and run:
     ```bash
     python manage.py runserver
     ```

5. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000` for the frontend and `http://localhost:8000/admin` for the Django admin panel.

## Conclusion
HustleDesk provides a comprehensive solution for managing business operations. The architecture is designed to be modular and scalable, allowing for future enhancements and integrations.

For any issues or contributions, please refer to the project's GitHub repository.
