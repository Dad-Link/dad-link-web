// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    // Render a loading spinner or placeholder
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" replace />;
  }

  // Render the child component for authenticated users
  return children;
};

export default PrivateRoute;
