import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const AuthRoute = () => {
  const { user, hydrated } = useAuthStore();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AuthRoute;
