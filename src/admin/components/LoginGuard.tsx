import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface LoginGuardProps {
  children: React.ReactNode;
}

const LoginGuard: React.FC<LoginGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // No token, redirect to login (unless already there)
      if (!location.pathname.includes("/login")) {
        navigate("/admin/login", { state: { from: location }, replace: true });
      } else {
        setIsChecking(false);
      }
    } else {
      // Token exists, allow access
      setIsChecking(false);
    }
  }, [navigate, location]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoginGuard;
