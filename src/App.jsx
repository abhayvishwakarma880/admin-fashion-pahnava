import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './components/layout/AdminLayout';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import ProductsList from './pages/ProductsList';
import Orders from './pages/Orders';
import Contacts from './pages/Contacts';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Categories from './pages/Categories';
import Login from './pages/Login';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      {/* Toast Notification Container */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0f172a',
            color: '#fff',
            border: '1 border-slate-800',
          },
        }} 
      />

      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="categories" element={<Categories />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="orders" element={<Orders />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="customers" element={<Customers />} />
          <Route path="analytics" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;