import { Navigate } from "react-router-dom";
import { useAuth } from "./authContext.js";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return user || storedUser ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
