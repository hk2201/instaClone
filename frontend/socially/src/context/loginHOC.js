import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./authContext";

const withAuthRedirect = (Component, redirectTo = "/groups") => {
  return function ProtectedComponent(props) {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        navigate(redirectTo, { replace: true });
      }
    }, [user, navigate]);

    return !user ? <Component {...props} /> : null;
  };
};

export default withAuthRedirect;
