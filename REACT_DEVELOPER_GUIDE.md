# 🎨 React Developer Quick Reference

## For Frontend Developers Working on Palqar Accounting

---

## 🚀 Quick Start (3 Steps)

```bash
# 1. Install dependencies
cd palqar-frontend
npm install

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── App.tsx                 # Main app with routing
├── main.tsx               # Entry point
├── index.css              # Global styles (Tailwind)
│
├── components/            
│   ├── layout/
│   │   └── MainLayout.tsx        # App shell with sidebar
│   └── ProtectedRoute.tsx        # Auth guard
│
├── pages/                 # All page components
│   ├── auth/
│   │   └── LoginPage.tsx         # OTP login
│   ├── dashboard/
│   │   └── DashboardPage.tsx     # Home dashboard
│   ├── projects/
│   │   ├── ProjectsPage.tsx      # List view
│   │   └── CreateProjectPage.tsx # Create form
│   ├── accounts/
│   │   ├── AccountsPage.tsx
│   │   └── CreateAccountPage.tsx
│   ├── payments/
│   │   ├── PaymentsPage.tsx
│   │   └── CreatePaymentPage.tsx
│   ├── work-packages/
│   │   ├── WorkPackagesPage.tsx
│   │   └── CreateWorkPackagePage.tsx
│   ├── users/
│   │   └── UsersPage.tsx
│   └── analytics/
│       └── AnalyticsPage.tsx     # Charts & reports
│
├── services/
│   └── api.ts                    # ALL API calls
│
├── store/
│   └── authStore.ts              # Zustand auth state
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
└── lib/
    └── api-client.ts             # Axios config
```

---

## 🔌 API Integration

### Import API Services

```typescript
import {
  authApi,
  userApi,
  accountApi,
  projectApi,
  workPackageApi,
  paymentApi,
  analyticsApi
} from '@/services/api';
```

### Usage Examples

```typescript
// GET request
const response = await projectApi.getAll();
const projects = response.data;

// POST request
await projectApi.create({
  title: 'New Project',
  budget: 50000
});

// PATCH request
await projectApi.update(id, {
  status: 'COMPLETED'
});

// DELETE request
await projectApi.delete(id);
```

### Error Handling

Errors are automatically handled by the API client:
- Shows toast notification
- Logs user out on 401
- Returns error for custom handling

```typescript
try {
  await projectApi.create(data);
  toast.success('Created!');
  navigate('/projects');
} catch (error) {
  // Error already shown in toast
  console.error(error);
}
```

---

## 🔐 Authentication

### Login Flow

```typescript
import { authApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';

// 1. Send OTP
await authApi.sendOtp({ email });

// 2. Verify OTP
const response = await authApi.verifyOtp({ email, otp });
const { access_token, user } = response.data;

// 3. Save auth state
const { setAuth } = useAuthStore();
setAuth(user, access_token);

// 4. Navigate
navigate('/dashboard');
```

### Logout

```typescript
const { logout } = useAuthStore();
logout();
navigate('/login');
```

### Get Current User

```typescript
const { user, isAuthenticated } = useAuthStore();

if (isAuthenticated) {
  console.log('Logged in as:', user.email);
}
```

---

## 🎨 Styling with Tailwind

### Pre-built Components

```tsx
// Button
<button className="btn btn-primary">
  Primary Button
</button>

<button className="btn btn-outline">
  Outline Button
</button>

// Input
<input className="input" placeholder="Enter text" />

// Card
<div className="card">
  <h2>Card Title</h2>
  <p>Card content</p>
</div>

// Page Header
<h1 className="page-header">Page Title</h1>

// Section Header
<h2 className="section-header">Section Title</h2>
```

### Responsive Grid

```tsx
{/* 1 column on mobile, 2 on tablet, 3 on desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card">Item 1</div>
  <div className="card">Item 2</div>
  <div className="card">Item 3</div>
</div>
```

### Mobile-First Design

```tsx
{/* Show on desktop only */}
<div className="hidden lg:block">Desktop only</div>

{/* Show on mobile only */}
<div className="lg:hidden">Mobile only</div>

{/* Responsive padding */}
<div className="p-4 md:p-6 lg:p-8">Content</div>

{/* Responsive text */}
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive Title
</h1>
```

---

## 📊 Adding a New Page

### 1. Create Page Component

```tsx
// src/pages/invoices/InvoicesPage.tsx
import React, { useEffect, useState } from 'react';
import { invoiceApi } from '@/services/api';

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const response = await invoiceApi.getAll();
      setInvoices(response.data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="page-header">Invoices</h1>
      {/* Your content */}
    </div>
  );
};
```

### 2. Add API Service

```typescript
// src/services/api.ts
export const invoiceApi = {
  getAll: () => apiClient.get('/invoices'),
  getById: (id: string) => apiClient.get(`/invoices/${id}`),
  create: (data: any) => apiClient.post('/invoices', data),
  update: (id: string, data: any) => apiClient.patch(`/invoices/${id}`, data),
  delete: (id: string) => apiClient.delete(`/invoices/${id}`),
};
```

### 3. Add Route

```tsx
// src/App.tsx
import { InvoicesPage } from '@/pages/invoices/InvoicesPage';

<Route path="/invoices" element={<InvoicesPage />} />
```

### 4. Add to Navigation

```tsx
// src/components/layout/MainLayout.tsx
import { FileText } from 'lucide-react';

const menuItems = [
  // ... existing items
  { icon: FileText, label: 'Invoices', path: '/invoices' },
];
```

---

## 🎨 Common UI Patterns

### Data Table

```tsx
<div className="card overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
            Amount
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {items.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50">
            <td className="px-6 py-4">{item.name}</td>
            <td className="px-6 py-4">{item.amount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
```

### Empty State

```tsx
{items.length === 0 ? (
  <div className="card text-center py-12">
    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <p className="text-gray-500 mb-4">No items yet</p>
    <Link to="/create" className="btn btn-primary inline-flex items-center gap-2">
      <Plus className="w-5 h-5" />
      Create First Item
    </Link>
  </div>
) : (
  // Render items
)}
```

### Form with Validation

```tsx
const [formData, setFormData] = useState({
  title: '',
  amount: '',
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await api.create({
      ...formData,
      amount: parseFloat(formData.amount),
    });
    toast.success('Created successfully!');
    navigate('/list');
  } catch (error) {
    // Error handled automatically
  }
};

<form onSubmit={handleSubmit} className="card space-y-6">
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Title *
    </label>
    <input
      name="title"
      type="text"
      value={formData.title}
      onChange={handleChange}
      className="input"
      required
    />
  </div>

  <div className="flex gap-4">
    <button type="button" className="btn btn-outline flex-1">
      Cancel
    </button>
    <button type="submit" className="btn btn-primary flex-1">
      Save
    </button>
  </div>
</form>
```

### Loading Spinner

```tsx
{loading ? (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
) : (
  // Content
)}
```

### Stats Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  <div className="card">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-3 bg-blue-100 rounded-lg">
        <FolderKanban className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <p className="text-sm text-gray-600">Total Items</p>
        <p className="text-2xl font-bold">{total}</p>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 Icons

Using **lucide-react**:

```tsx
import {
  Home,
  User,
  Settings,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  Calendar,
  Clock,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

<Plus className="w-5 h-5" />
```

[Full icon list](https://lucide.dev/icons/)

---

## 📱 Mobile Responsive Tips

### 1. Use Responsive Grid

```tsx
{/* Stack on mobile, row on desktop */}
<div className="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### 2. Hide Elements on Mobile

```tsx
{/* Desktop only */}
<span className="hidden md:inline">Desktop Text</span>

{/* Mobile only */}
<span className="md:hidden">Mobile Text</span>
```

### 3. Responsive Spacing

```tsx
<div className="p-4 md:p-6 lg:p-8">
  <div className="space-y-4 md:space-y-6">
    {/* Content with responsive spacing */}
  </div>
</div>
```

### 4. Touch-Friendly Buttons

```tsx
{/* Minimum 44px tap target */}
<button className="btn btn-primary min-h-[44px] min-w-[44px]">
  Action
</button>
```

---

## 🔧 Debugging Tips

### 1. Check API Response

```typescript
const response = await projectApi.getAll();
console.log('Projects:', response.data);
```

### 2. Check Auth State

```typescript
const authState = useAuthStore.getState();
console.log('Auth:', authState);
```

### 3. Network Errors

- Open DevTools → Network tab
- Look for failed requests (red)
- Check request/response details

### 4. React DevTools

Install React DevTools extension:
- View component tree
- Inspect props and state
- Profile performance

---

## 📦 Common Dependencies

```json
{
  "react": "^18.2.0",           // UI library
  "react-router-dom": "^6.22.0", // Routing
  "axios": "^1.6.7",            // HTTP client
  "zustand": "^4.5.0",          // State management
  "react-hot-toast": "^2.4.1",  // Notifications
  "lucide-react": "^0.323.0",   // Icons
  "recharts": "^2.12.0",        // Charts
  "date-fns": "^3.3.1",         // Date utilities
  "tailwindcss": "^3.4.1"       // Styling
}
```

---

## 🚀 Building for Production

```bash
# Build
npm run build

# Preview build locally
npm run preview

# Deploy to Vercel
vercel

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

---

## 💡 Pro Tips

1. **Always use TypeScript types** - Import from `@/types`
2. **Reuse API services** - Don't create new axios instances
3. **Use the card class** - Consistent styling
4. **Mobile-first** - Design for mobile, enhance for desktop
5. **Loading states** - Always show spinners during async ops
6. **Error handling** - Let API client handle, add custom if needed
7. **Toast notifications** - Provide feedback for user actions
8. **Protected routes** - Use ProtectedRoute wrapper
9. **Responsive images** - Use srcset or CSS
10. **Accessibility** - Add aria-labels, keyboard navigation

---

## 📚 Learn More

- **React Docs**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org
- **Tailwind CSS**: https://tailwindcss.com
- **React Router**: https://reactrouter.com
- **Zustand**: https://docs.pmnd.rs/zustand
- **Recharts**: https://recharts.org

---

**Happy Coding! 🎉**
