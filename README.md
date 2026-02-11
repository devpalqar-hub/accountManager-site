# Palqar Accounting - Frontend

A professional, mobile-responsive React frontend for the Palqar Accounting Management System.

## 🚀 Features

- **Modern Tech Stack**: React 18 + TypeScript + Vite
- **Mobile-First Design**: Fully responsive, works like a mobile app
- **Authentication**: Secure OTP-based login system
- **Complete Modules**:
  - 📊 Dashboard with analytics
  - 📁 Projects management
  - 💼 Bank accounts tracking
  - 💳 Payments recording
  - 📦 Work packages organization
  - 👥 User management
  - 📈 Advanced analytics with charts

## 📋 Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:4000`

## 🛠️ Installation

### 1. Install Dependencies

```bash
cd palqar-frontend
npm install
```

### 2. Configure Environment

The `.env` file is already created with default settings:

```env
VITE_API_URL=http://localhost:4000
```

Update this if your backend runs on a different port.

### 3. Start Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📱 Application Structure

```
src/
├── components/          # Reusable components
│   ├── layout/         # Layout components (MainLayout, etc.)
│   └── ProtectedRoute.tsx
├── pages/              # Page components
│   ├── auth/          # Login page
│   ├── dashboard/     # Dashboard
│   ├── projects/      # Projects module
│   ├── accounts/      # Accounts module
│   ├── payments/      # Payments module
│   ├── work-packages/ # Work packages module
│   ├── users/         # Users module
│   └── analytics/     # Analytics & reports
├── services/          # API services
│   └── api.ts        # All API endpoints
├── store/            # State management (Zustand)
│   └── authStore.ts  # Authentication state
├── types/            # TypeScript interfaces
│   └── index.ts      # All type definitions
├── lib/              # Utilities
│   └── api-client.ts # Axios configuration
├── App.tsx           # Main app & routing
├── main.tsx          # App entry point
└── index.css         # Global styles (Tailwind)
```

## 🔐 Authentication Flow

1. **Login Page**: User enters email
2. **OTP Request**: Backend sends 6-digit OTP to email
3. **Verification**: User enters OTP
4. **Success**: JWT token stored, user redirected to dashboard

## 📡 API Integration

### Complete API Reference

#### **Authentication APIs**
```typescript
POST /auth/send-otp
Body: { email: string }

POST /auth/verify-otp
Body: { email: string, otp: string }
Response: { access_token: string, user: User }
```

#### **User APIs**
```typescript
GET    /users              // Get all users
GET    /users/:id          // Get user by ID
POST   /users              // Create user
        Body: { email: string }
PATCH  /users/:id          // Update user
        Body: { email?, isActive? }
DELETE /users/:id          // Delete user
```

#### **Account APIs**
```typescript
GET    /accounts           // Get all accounts
GET    /accounts/:id       // Get account by ID
GET    /accounts/:id/balance  // Get account balance
POST   /accounts           // Create account
        Body: {
          accountName: string,
          accountHolderName: string,
          bankName?: string,
          accountNumber?: string,
          ifscCode?: string,
          accountType?: string,
          openingBalance?: number,
          isActive?: boolean
        }
PATCH  /accounts/:id       // Update account
DELETE /accounts/:id       // Delete account
```

#### **Project APIs**
```typescript
GET    /projects           // Get all projects
GET    /projects/my-projects  // Get current user's projects
GET    /projects/:id       // Get project by ID
POST   /projects           // Create project
        Body: {
          title: string,
          clientDetails?: string,
          startDate?: string,
          endDate?: string,
          description?: string,
          status?: string,
          budget?: number
        }
PATCH  /projects/:id       // Update project
DELETE /projects/:id       // Delete project
```

#### **Work Package APIs**
```typescript
GET    /work-packages      // Get all work packages
GET    /work-packages/:id  // Get by ID
GET    /work-packages/project/:projectId  // Get by project
GET    /work-packages/project/:projectId/stats  // Get stats
POST   /work-packages      // Create work package
        Body: {
          workPackageName: string,
          amount: number,
          projectId: string,
          version?: string,
          startDate?: string,
          completionDate?: string,
          advanceAmount?: number,
          miscellaneousAmount?: number,
          ongoingCost?: number,
          status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD',
          description?: string
        }
PATCH  /work-packages/:id  // Update
DELETE /work-packages/:id  // Delete
```

#### **Payment APIs**
```typescript
GET    /payments           // Get all payments
GET    /payments/:id       // Get by ID
GET    /payments/project/:projectId  // Get by project
GET    /payments/project/:projectId/summary  // Get summary
GET    /payments/account/:accountId  // Get by account
POST   /payments           // Create payment
        Body: {
          amount: number,
          accountId: string,
          projectId: string,
          paymentDate?: string,
          description?: string,
          transactionRef?: string
        }
PATCH  /payments/:id       // Update
DELETE /payments/:id       // Delete
```

#### **Analytics APIs**
```typescript
GET /analytics/dashboard
    Response: {
      totalProjects, activeProjects, completedProjects,
      totalRevenue, totalExpenses, netProfit,
      totalAccounts, activeAccounts,
      recentPayments[], recentProjects[]
    }

GET /analytics/projects
    Response: {
      totalProjects,
      byStatus: [{ status, count }],
      topProjects: [{ id, title, totalPayments, totalWorkPackages }]
    }

GET /analytics/financial?startDate=2026-01-01&endDate=2026-12-31
    Response: {
      totalIncome, totalExpense, netBalance,
      monthlyData: [{ month, income, expense }]
    }

GET /analytics/work-packages

GET /analytics/reports/monthly?year=2026&month=1

GET /analytics/reports/yearly?year=2026
```

## 🎨 UI Components & Styling

### Tailwind CSS Utilities

The app uses custom utility classes:

```css
.btn              /* Base button */
.btn-primary      /* Primary button (blue) */
.btn-secondary    /* Secondary button (gray) */
.btn-outline      /* Outlined button */
.input            /* Form input */
.card             /* Card container */
.page-header      /* Page title */
.section-header   /* Section title */
```

### Mobile Responsiveness

- **Drawer Navigation**: Side menu slides in on mobile
- **Responsive Grid**: Auto-adjusts columns based on screen size
- **Touch-Friendly**: Large tap targets (44px minimum)
- **Mobile Gestures**: Swipe to close sidebar
- **Adaptive Typography**: Scales based on viewport

### Color Scheme

- Primary: Blue (`#0ea5e9`)
- Success: Green (`#10b981`)
- Warning: Yellow (`#f59e0b`)
- Danger: Red (`#ef4444`)

## 🔧 Development

### Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 📦 State Management

Uses **Zustand** for lightweight state management:

```typescript
// Authentication Store
const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();
```

## 🌐 Routing

Powered by **React Router v6**:

```
/login              -> Login page (public)
/dashboard          -> Dashboard (protected)
/projects           -> Projects list
/projects/new       -> Create project
/accounts           -> Accounts list
/payments           -> Payments list
/work-packages      -> Work packages list
/users              -> Users management
/analytics          -> Analytics & reports
```

## 📊 Charts & Analytics

Uses **Recharts** for data visualization:

- Bar charts for financial trends
- Pie charts for project status distribution
- Responsive containers for mobile

## 🔒 Security

- JWT token stored in localStorage
- Automatic token injection in API calls
- Protected routes with authentication guard
- Auto-logout on 401 responses

## 🎯 Best Practices

1. **Component Organization**: One component per file
2. **Type Safety**: Full TypeScript coverage
3. **Code Splitting**: Lazy loading for better performance
4. **Error Handling**: Global error interceptor
5. **Loading States**: Spinner for async operations
6. **Toast Notifications**: User feedback for actions

## 📱 Mobile App Features

- **App-Like Experience**: Looks and feels native
- **Responsive Design**: Works on all screen sizes
- **Touch Optimized**: Large buttons and easy navigation
- **Fast Loading**: Optimized bundle size
- **Offline Detection**: Shows when connection is lost

## 🚀 Deployment

### Vercel / Netlify

```bash
npm run build
```

Deploy the `dist/` folder.

### Environment Variables

Set `VITE_API_URL` to your production backend URL.

## 🐛 Troubleshooting

### API Connection Issues

1. Ensure backend is running on port 4000
2. Check CORS configuration in backend
3. Verify `.env` file has correct API URL

### Build Errors

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Mobile Layout Issues

- Clear browser cache
- Test in mobile browser or DevTools mobile view
- Check viewport meta tag in `index.html`

## 📄 License

MIT License - Palqar Accounting System

## 👥 Support

For issues or questions, contact the development team.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
