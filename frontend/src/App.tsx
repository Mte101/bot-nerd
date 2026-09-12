import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import HomePage from '@/pages/Home'
import LoginPage from '@/pages/Login'
import RegisterPage from '@/pages/Register'
// import your other page components here

/**
 * Wrap any route that must not be viewable while signed out:
 *   <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
 * Nothing is wrapped by default — this template ships blank and unauthenticated.
 */
export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Built-in auth pages — keep, replace with an external provider, or delete. */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Add your app's routes here, e.g.: */}
      {/* <Route path="/orders" element={<OrdersPage />} /> */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
