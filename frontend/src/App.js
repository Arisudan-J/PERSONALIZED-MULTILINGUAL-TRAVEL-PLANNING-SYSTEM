import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RecommendationPage from './pages/RecommendationPage';
import PaymentPage from './pages/PaymentPage';
import PdfDownloadPage from './pages/PdfDownloadPage';
import ProfilePage from './pages/ProfilePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: '40vh' }} />;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: '40vh' }} />;
  if (!user || !isAdmin()) return <Navigate to="/admin" />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Admin routes — no Navbar */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* User routes — with Navbar */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/recommendations" element={<ProtectedRoute><RecommendationPage /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
              <Route path="/itinerary" element={<ProtectedRoute><PdfDownloadPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LangProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </LangProvider>
    </AuthProvider>
  );
}
