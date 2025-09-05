import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { getAccessToken, refreshAccessToken } from "../lib/refresh";
import UserLoader from "./UserLoader";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsAuth(false);
        return;
      }

      try {
        // Decode JWT expiry
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        const isExpired = Date.now() >= exp * 1000;

        if (!isExpired) {
          setIsAuth(true); // still valid
          return;
        }

        // Only refresh if expired
        const newToken = await refreshAccessToken();
        if (newToken) {
          setIsAuth(true);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("refresh_token");
          setIsAuth(false);
        }
      } catch (err) {
        console.error("Token check error:", err);
        setIsAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) {
    return <UserLoader />;
  }

  return isAuth ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
