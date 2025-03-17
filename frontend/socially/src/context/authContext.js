import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLoader } from "./loaderContext";
import { showToast } from "./toastService";
import { jwtDecode } from "jwt-decode";
import { useStoreContext } from "./storeContext";

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
    setIsLoading(true);
    try {
      const response = await axios.post(process.env.REACT_APP_LOGIN_API, {
        email,
        password,
      });

      const token = response.data.data.token; // Get JWT token
      localStorage.setItem("token", token); // Store JWT token

      const decoded = jwtDecode(token); // Decode JWT to extract userId
      const userData = { email, userId: decoded.userId };
      localStorage.setItem("user", JSON.stringify(userData)); // Store user info

      setUser(userData);
      showToast(`${userData.email} logged in successfully`, "success");
      navigate("/groups");
    } catch (error) {
      console.error("Error logging in:", error);
      showToast(error.response?.data?.message || "Login failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email, password, lastname, username, repassword) => {
    if (!lastname || !username) {
      showToast("First-Name or Last-Name missing", "error");
      return;
    }
    if (!email || !password) {
      showToast("Email and Password required", "error");
      return;
    }
    if (password.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }
    if (password != repassword) {
      showToast("Password not matching", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(process.env.REACT_APP_SIGNUP_API, {
        email,
        password,
        lastname,
        username,
      });

      const token = response.data.data.token; // Get JWT token
      localStorage.setItem("token", token); // Store JWT token

      const decoded = jwtDecode(token); // Decode JWT to extract userId
      const userData = { email, userId: decoded.userId };
      localStorage.setItem("user", JSON.stringify(userData)); // Store user info

      setUser(userData);
      showToast(`${userData.email} signed up successfully`, "success");
      navigate("/groups");
    } catch (error) {
      console.error("Signup Error:", error);
      showToast(error.response?.data?.message || "Signup failed.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Google Login Function
  const googleLogin = async (response) => {
    setIsLoading(true);
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

      const token = backendResponse.data.data.token; // Get JWT token
      localStorage.setItem("token", token); // Store JWT token

      const userDecoded = jwtDecode(token); // Decode JWT to extract userId
      const userData = { email: decoded.email, userId: userDecoded.userId };
      localStorage.setItem("user", JSON.stringify(userData)); // Store user info

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
    localStorage.removeItem("token");
    setUser(null);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signup, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
