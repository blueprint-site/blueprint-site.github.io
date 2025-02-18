// src/routes/authRoutes.tsx
import { RouteObject } from 'react-router-dom';

import ProtectedRoute from '@/components/utility/ProtectedRoute';
import AuthPage from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import AuthSuccess from '@/components/public/auth/AuthSuccess';
import AuthError from "@/components/public/auth/AuthError.tsx";

export const authRoutes: RouteObject[] = [
  { path: 'user/:username', element: <Profile /> },
  { path: 'user', element: <Profile /> },
  { path: 'login', element: <AuthPage /> },
  { path: 'auth/success', element: <AuthSuccess /> },
  { path: 'auth/error', element: <AuthError />},
  {
    path: 'settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    )
  }
];