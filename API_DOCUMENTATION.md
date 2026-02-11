# Complete API Reference & Frontend Guide

## 🎯 Quick Start Guide

### Backend Setup
```bash
cd palqar-account
npm install
npx prisma generate
npx prisma db push
npm run start:dev
# Backend runs on http://localhost:4000
```

### Frontend Setup
```bash
cd palqar-frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

### First Time Login
1. Create a user in the backend (POST /users with email)
2. Go to http://localhost:3000/login
3. Enter email
4. Check console/email for OTP
5. Enter OTP to login

---

## 📡 Complete API Documentation

### Base URL
```
http://localhost:4000
```

### Authentication
All endpoints except `/auth/*` require JWT Bearer token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 Authentication Endpoints

### 1. Send OTP
**Endpoint:** `POST /auth/send-otp`

**Request:**
```json
{
  "email": "admin@palqar.com"
}
```

**Response:**
```json
{
  "message": "OTP sent successfully"
}
```

**Frontend Usage:**
```typescript
import { authApi } from '@/services/api';

await authApi.sendOtp({ email: 'admin@palqar.com' });
```

---

### 2. Verify OTP & Login
**Endpoint:** `POST /auth/verify-otp`

**Request:**
```json
{
  "email": "admin@palqar.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@palqar.com",
    "isActive": true,
    "createdAt": "2026-02-11T10:00:00.000Z",
    "updatedAt": "2026-02-11T10:00:00.000Z"
  }
}
```

**Frontend Usage:**
```typescript
const response = await authApi.verifyOtp({ 
  email: 'admin@palqar.com', 
  otp: '123456' 
});
const { access_token, user } = response.data;
```

---

## 👥 User Management Endpoints

### 1. Get All Users
**Endpoint:** `GET /users`

**Response:**
```json
[
  {
    "id": "uuid",
    "email": "admin@palqar.com",
    "isActive": true,
    "createdAt": "2026-02-11T10:00:00.000Z",
    "updatedAt": "2026-02-11T10:00:00.000Z"
  }
]
```

**Frontend Usage:**
```typescript
const users = await userApi.getAll();
```

---

### 2. Get User by ID
**Endpoint:** `GET /users/:id`

**Response:**
```json
{
  "id": "uuid",
  "email": "admin@palqar.com",
  "isActive": true,
  "createdAt": "2026-02-11T10:00:00.000Z",
  "updatedAt": "2026-02-11T10:00:00.000Z"
}
```

---

### 3. Create User
**Endpoint:** `POST /users`

**Request:**
```json
{
  "email": "newuser@palqar.com"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "newuser@palqar.com",
  "isActive": true,
  "createdAt": "2026-02-11T10:00:00.000Z",
  "updatedAt": "2026-02-11T10:00:00.000Z"
}
```

---

### 4. Update User
**Endpoint:** `PATCH /users/:id`

**Request:**
```json
{
  "email": "updated@palqar.com",
  "isActive": false
}
```

---

### 5. Delete User
**Endpoint:** `DELETE /users/:id`

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 💼 Account Management Endpoints

### 1. Get All Accounts
**Endpoint:** `GET /accounts`

**Response:**
```json
[
  {
    "id": "uuid",
    "accountName": "HDFC Business Account",
    "accountHolderName": "John Doe",
    "bankName": "HDFC Bank",
    "accountNumber": "1234567890123456",
    "ifscCode": "HDFC0001234",
    "accountType": "Current",
    "openingBalance": 10000.0,
    "currentBalance": 50000.0,
    "isActive": true,
    "createdAt": "2026-02-11T10:00:00.000Z",
    "updatedAt": "2026-02-11T10:00:00.000Z"
  }
]
```

**Frontend Usage:**
```typescript
const accounts = await accountApi.getAll();
```

---

### 2. Get Account by ID
**Endpoint:** `GET /accounts/:id`

---

### 3. Get Account Balance
**Endpoint:** `GET /accounts/:id/balance`

**Response:**
```json
{
  "currentBalance": 50000.0,
  "openingBalance": 10000.0
}
```

---

### 4. Create Account
**Endpoint:** `POST /accounts`

**Request:**
```json
{
  "accountName": "HDFC Business Account",
  "accountHolderName": "John Doe",
  "bankName": "HDFC Bank",
  "accountNumber": "1234567890123456",
  "ifscCode": "HDFC0001234",
  "accountType": "Current",
  "openingBalance": 10000.0,
  "isActive": true
}
```

**Frontend Component:**
```tsx
<CreateAccountPage />
// Located at: src/pages/accounts/CreateAccountPage.tsx
// Route: /accounts/new
```

---

### 5. Update Account
**Endpoint:** `PATCH /accounts/:id`

---

### 6. Delete Account
**Endpoint:** `DELETE /accounts/:id`

---

## 📁 Project Management Endpoints

### 1. Get All Projects
**Endpoint:** `GET /projects`

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "E-commerce Platform Development",
    "clientDetails": "ABC Corporation, Contact: John Doe",
    "startDate": "2026-01-01T00:00:00.000Z",
    "endDate": "2026-12-31T00:00:00.000Z",
    "description": "Full-stack e-commerce platform",
    "status": "ACTIVE",
    "budget": 50000.0,
    "createdById": "uuid",
    "createdAt": "2026-02-11T10:00:00.000Z",
    "updatedAt": "2026-02-11T10:00:00.000Z"
  }
]
```

---

### 2. Get My Projects
**Endpoint:** `GET /projects/my-projects`

Returns only projects created by the authenticated user.

---

### 3. Get Project by ID
**Endpoint:** `GET /projects/:id`

---

### 4. Create Project
**Endpoint:** `POST /projects`

**Request:**
```json
{
  "title": "E-commerce Platform Development",
  "clientDetails": "ABC Corporation, Contact: John Doe, Email: john@abc.com",
  "startDate": "2026-01-01T00:00:00.000Z",
  "endDate": "2026-12-31T00:00:00.000Z",
  "description": "Full-stack e-commerce platform with payment integration",
  "status": "ACTIVE",
  "budget": 50000.0
}
```

**Frontend Component:**
```tsx
<CreateProjectPage />
// Located at: src/pages/projects/CreateProjectPage.tsx
// Route: /projects/new
```

---

### 5. Update Project
**Endpoint:** `PATCH /projects/:id`

**Request:**
```json
{
  "status": "COMPLETED",
  "budget": 75000.0
}
```

---

### 6. Delete Project
**Endpoint:** `DELETE /projects/:id`

---

## 📦 Work Package Endpoints

### 1. Get All Work Packages
**Endpoint:** `GET /work-packages`

**Response:**
```json
[
  {
    "id": "uuid",
    "workPackageName": "Phase 1 - Foundation Development",
    "amount": 25000.0,
    "projectId": "uuid",
    "version": "1.0",
    "startDate": "2026-02-01T00:00:00.000Z",
    "completionDate": "2026-03-31T00:00:00.000Z",
    "advanceAmount": 10000.0,
    "miscellaneousAmount": 2000.0,
    "ongoingCost": 5000.0,
    "status": "PENDING",
    "description": "Initial development phase",
    "createdAt": "2026-02-11T10:00:00.000Z",
    "updatedAt": "2026-02-11T10:00:00.000Z"
  }
]
```

---

### 2. Get Work Package by ID
**Endpoint:** `GET /work-packages/:id`

---

### 3. Get Work Packages by Project
**Endpoint:** `GET /work-packages/project/:projectId`

---

### 4. Get Work Package Stats for Project
**Endpoint:** `GET /work-packages/project/:projectId/stats`

**Response:**
```json
{
  "total": 5,
  "totalAmount": 125000.0,
  "byStatus": {
    "PENDING": 2,
    "IN_PROGRESS": 2,
    "COMPLETED": 1
  }
}
```

---

### 5. Create Work Package
**Endpoint:** `POST /work-packages`

**Request:**
```json
{
  "workPackageName": "Phase 1 - Foundation Development",
  "amount": 25000.0,
  "projectId": "uuid",
  "version": "1.0",
  "startDate": "2026-02-01T00:00:00.000Z",
  "completionDate": "2026-03-31T00:00:00.000Z",
  "advanceAmount": 10000.0,
  "miscellaneousAmount": 2000.0,
  "ongoingCost": 5000.0,
  "status": "PENDING",
  "description": "Initial development phase including backend setup"
}
```

**Status Options:**
- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `ON_HOLD`

**Frontend Component:**
```tsx
<CreateWorkPackagePage />
// Located at: src/pages/work-packages/CreateWorkPackagePage.tsx
// Route: /work-packages/new
```

---

### 6. Update Work Package
**Endpoint:** `PATCH /work-packages/:id`

---

### 7. Delete Work Package
**Endpoint:** `DELETE /work-packages/:id`

---

## 💳 Payment Endpoints

### 1. Get All Payments
**Endpoint:** `GET /payments`

**Response:**
```json
[
  {
    "id": "uuid",
    "amount": 25000.0,
    "accountId": "uuid",
    "projectId": "uuid",
    "paymentDate": "2026-01-24T10:30:00.000Z",
    "description": "Payment for Phase 1 development - Invoice #123",
    "transactionRef": "TXN123456789",
    "createdById": "uuid",
    "createdAt": "2026-02-11T10:00:00.000Z",
    "updatedAt": "2026-02-11T10:00:00.000Z"
  }
]
```

---

### 2. Get Payment by ID
**Endpoint:** `GET /payments/:id`

---

### 3. Get Payments by Project
**Endpoint:** `GET /payments/project/:projectId`

---

### 4. Get Project Payment Summary
**Endpoint:** `GET /payments/project/:projectId/summary`

**Response:**
```json
{
  "totalPayments": 75000.0,
  "paymentCount": 3,
  "averagePayment": 25000.0
}
```

---

### 5. Get Payments by Account
**Endpoint:** `GET /payments/account/:accountId`

---

### 6. Create Payment
**Endpoint:** `POST /payments`

**Request:**
```json
{
  "amount": 25000.0,
  "accountId": "uuid",
  "projectId": "uuid",
  "paymentDate": "2026-01-24T10:30:00.000Z",
  "description": "Payment for Phase 1 development - Invoice #123",
  "transactionRef": "TXN123456789"
}
```

**Frontend Component:**
```tsx
<CreatePaymentPage />
// Located at: src/pages/payments/CreatePaymentPage.tsx
// Route: /payments/new
```

---

### 7. Update Payment
**Endpoint:** `PATCH /payments/:id`

---

### 8. Delete Payment
**Endpoint:** `DELETE /payments/:id`

---

## 📊 Analytics Endpoints

### 1. Get Dashboard Overview
**Endpoint:** `GET /analytics/dashboard`

**Response:**
```json
{
  "totalProjects": 10,
  "activeProjects": 6,
  "completedProjects": 4,
  "totalRevenue": 500000.0,
  "totalExpenses": 350000.0,
  "netProfit": 150000.0,
  "totalAccounts": 5,
  "activeAccounts": 5,
  "recentPayments": [],
  "recentProjects": []
}
```

**Frontend Component:**
```tsx
<DashboardPage />
// Located at: src/pages/dashboard/DashboardPage.tsx
// Route: /dashboard
```

---

### 2. Get Project Analytics
**Endpoint:** `GET /analytics/projects`

**Response:**
```json
{
  "totalProjects": 10,
  "byStatus": [
    { "status": "ACTIVE", "count": 6 },
    { "status": "COMPLETED", "count": 4 }
  ],
  "topProjects": [
    {
      "id": "uuid",
      "title": "E-commerce Platform",
      "totalPayments": 75000.0,
      "totalWorkPackages": 5
    }
  ]
}
```

---

### 3. Get Financial Analytics
**Endpoint:** `GET /analytics/financial?startDate=2026-01-01&endDate=2026-12-31`

**Query Parameters:**
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response:**
```json
{
  "totalIncome": 500000.0,
  "totalExpense": 350000.0,
  "netBalance": 150000.0,
  "monthlyData": [
    {
      "month": "January",
      "income": 50000.0,
      "expense": 30000.0
    }
  ]
}
```

---

### 4. Get Work Package Analytics
**Endpoint:** `GET /analytics/work-packages`

---

### 5. Get Monthly Report
**Endpoint:** `GET /analytics/reports/monthly?year=2026&month=1`

**Query Parameters:**
- `year` (required): Number
- `month` (required): Number (1-12)

---

### 6. Get Yearly Report
**Endpoint:** `GET /analytics/reports/yearly?year=2026`

**Query Parameters:**
- `year` (required): Number

---

## 🎨 Frontend Component Structure

### Pages Overview

```
/login              → LoginPage
/dashboard          → DashboardPage
/projects           → ProjectsPage
/projects/new       → CreateProjectPage
/accounts           → AccountsPage
/accounts/new       → CreateAccountPage
/payments           → PaymentsPage
/payments/new       → CreatePaymentPage
/work-packages      → WorkPackagesPage
/work-packages/new  → CreateWorkPackagePage
/users              → UsersPage
/analytics          → AnalyticsPage
```

### API Service Usage

```typescript
// Import API services
import { 
  authApi, 
  userApi, 
  accountApi, 
  projectApi, 
  workPackageApi, 
  paymentApi, 
  analyticsApi 
} from '@/services/api';

// Example: Get all projects
const response = await projectApi.getAll();
const projects = response.data;

// Example: Create project
await projectApi.create({
  title: 'New Project',
  budget: 50000
});

// Example: Update project
await projectApi.update(projectId, {
  status: 'COMPLETED'
});

// Example: Delete project
await projectApi.delete(projectId);
```

### State Management

```typescript
// Authentication
import { useAuthStore } from '@/store/authStore';

const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();

// Login
const { access_token, user } = await authApi.verifyOtp({ email, otp });
setAuth(user, access_token);

// Logout
logout();
```

---

## 🔨 Common Workflows

### 1. Complete User Journey

```typescript
// 1. Login
const otpResponse = await authApi.sendOtp({ email });
const loginResponse = await authApi.verifyOtp({ email, otp });
setAuth(loginResponse.data.user, loginResponse.data.access_token);

// 2. View Dashboard
const dashboard = await analyticsApi.getDashboard();

// 3. Create Project
const project = await projectApi.create({ title: 'New Project', budget: 50000 });

// 4. Create Work Package
const workPackage = await workPackageApi.create({
  workPackageName: 'Phase 1',
  amount: 25000,
  projectId: project.data.id
});

// 5. Record Payment
const payment = await paymentApi.create({
  amount: 25000,
  accountId: 'account-id',
  projectId: project.data.id
});

// 6. View Analytics
const analytics = await analyticsApi.getProjects();
```

---

## 🔧 Error Handling

### API Client Interceptor

```typescript
// Automatic error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on unauthorized
      localStorage.clear();
      window.location.href = '/login';
    }
    toast.error(error.response?.data?.message || 'Error occurred');
    return Promise.reject(error);
  }
);
```

### Frontend Error Handling

```typescript
try {
  await projectApi.create(projectData);
  toast.success('Project created!');
} catch (error) {
  // Error already handled by interceptor
  console.error(error);
}
```

---

## 📱 Mobile Responsive Features

1. **Drawer Navigation**: Slide-in menu on mobile
2. **Touch Targets**: Minimum 44px for all interactive elements
3. **Responsive Grid**: Auto-adjusts columns (1 on mobile, 2-4 on desktop)
4. **Adaptive Typography**: Scales with viewport
5. **Mobile Gestures**: Swipe to close sidebar

---

## 🚀 Production Deployment

### Environment Variables

```env
# .env.production
VITE_API_URL=https://api.yourdomain.com
```

### Build Commands

```bash
# Frontend
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3 + CloudFront
# - Any static hosting
```

---

## 📝 TypeScript Types

All types available in `src/types/index.ts`:

```typescript
import {
  User,
  Account,
  Project,
  WorkPackage,
  Payment,
  DashboardStats,
  FinancialAnalytics,
  ProjectAnalytics
} from '@/types';
```

---

**Complete & Professional Accounting System** ✨
