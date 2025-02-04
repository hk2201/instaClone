import { createContext, useContext, useState, useEffect } from "react";
import { data, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLoader } from "./loaderContext";
import { showToast } from "./toastService";
import { jwtDecode } from "jwt-decode";

// Create authentication context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { setIsLoading } = useLoader();
  const navigate = useNavigate();

  // Check if user is already logged in (from localStorage or API)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true); // Show loader
    try {
      const response = await axios.post(process.env.REACT_APP_LOGIN_API, {
        email: email,
        password: password,
      });

      console.log("User logged in:");
      const userData = { email }; // Store user data
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // For success messages
      showToast(`${userData.email} logged in successfully`, "success");

      navigate("/groups"); // Redirect after login
    } catch (error) {
      console.error("Error logging in:", error);
      showToast(
        error.response?.data?.message || "Login failed. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false); // Hide loader (Runs even if there's an error)
    }
  };

  const signup = async (email, password, lastname, username) => {
    if (password.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }

    setIsLoading(true); // Show loader

    try {
      const response = await axios.post(process.env.REACT_APP_SIGNUP_API, {
        email,
        password,
        lastname,
        username,
      });

      if (response?.data) {
        console.log("User Signed in:");
        const userData = { email };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        showToast(`${userData.email} signed up successfully`, "success");
        navigate("/groups"); // Redirect after login
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.statusText ||
        "Signup failed. Please try again.";
      console.error("Error Signing in:", error);
      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false); // Hide loader (Runs even if there's an error)
    }
  };

  // ✅ Google Login Function
  const googleLogin = async (response) => {
    setIsLoading(true); // Show loader
    try {
      const decoded = jwtDecode(response.credential);

      // Send token to backend
      const backendResponse = await axios.post(
        process.env.REACT_APP_GOOGLE_LOGIN_API,
        {
          email: decoded.email,
          username: decoded.given_name || "", // First name
          lastname: decoded.family_name || "", // Last name
        }
      );

      const email = backendResponse.data.data.user.email;
      const userData = { email };
      localStorage.setItem("user", JSON.stringify(userData)); // Store user
      setUser(userData);
      showToast(`${userData.email} logged in successfully`, "success");
      navigate("/groups"); // Redirect after login
    } catch (error) {
      console.error("Google Login Error:", error);
      showToast("Google Login failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    localStorage.removeItem("user");
    setUser(null);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, googleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
