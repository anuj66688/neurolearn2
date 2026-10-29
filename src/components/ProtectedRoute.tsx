// ==========================================
// NeuroLearn ProtectedRoute
// Guards routes based on Firebase Auth status and user role.
// ==========================================

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Which roles are allowed. If empty, any authenticated user is allowed. */
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
}) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  // ─── Still resolving auth state from Firebase ────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
        <p className="text-slate-400 text-sm">Verifying session…</p>
      </div>
    );
  }

  // ─── Not authenticated → redirect to login ────────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ─── Authenticated but wrong role ─────────────────────────────────────────
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to the user's own dashboard
    const fallback =
      role === 'admin'
        ? '/admin/dashboard'
        : role === 'teacher'
        ? '/teacher/dashboard'
        : '/student/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
};
