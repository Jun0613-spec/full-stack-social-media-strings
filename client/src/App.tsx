import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import AuthLayout from "./components/layouts/auth/AuthLayout";
import MainLayout from "./components/layouts/main/MainLayout";

import Spinner from "./components/Spinner";

import { useAuthStore } from "./stores/authStore";

import { useAuth } from "./hooks/auth/useAuth";

import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";

import HomePage from "./pages/Home";
import SearchPage from "./pages/main/Search";
import NotificationsPage from "./pages/main/Notifications";
import ProfilePage from "./pages/main/Profile";
import GoogleAuthSuccess from "./pages/auth/GoogleAuthSuccess";
import SettingsPage from "./pages/main/Settings";

function App() {
  useAuth();
  const { isLoggedIn, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <Spinner size={48} />
      </div>
    );
  }

  const ProtectedRoute = () => {
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
  };

  const PublicRoute = () => {
    return !isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
  };

  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route path="/settings" element={<SettingsPage />} />

          <Route path="/profile/:username" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
