import { useState } from "react";
import Title from "../components/Title";
import SignUpPage from "./SignUpPage";
import { useAuth } from "../context/authContext";
import { useTheme } from "../context/themeContext";
import withAuthRedirect from "../context/loginHOC";
import { GoogleLogin } from "@react-oauth/google";
import ThemeToggle from "../components/ThemeToggle";

function LoginPage() {
  const [isSignup, SetIsSignup] = useState(false);
  const [userData, SetUserData] = useState({ email: "", password: "" });
  const { login, googleLogin } = useAuth();
  const { darkMode } = useTheme();

  function handleClick() {
    SetIsSignup(!isSignup);
  }

  function handleChange(newVal) {
    SetIsSignup(newVal);
  }

  function handleInputChange(e) {
    const { id, value } = e.target;
    SetUserData({ ...userData, [id]: value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(userData.email, userData.password);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {isSignup ? (
        <SignUpPage isLogin={isSignup} OnValChange={handleChange} />
      ) : (
        <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 size-11/12 flex justify-center items-center flex-col h-screen transition-colors duration-300">
            {/* Theme Toggle Button */}
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>

            <div className="rounded w-full max-w-xl">
              <div className="flex justify-center pb-10 ">
                <Title />
              </div>
              <form className="px-8 pt-5 pb-8 mb-4">
                <div className="mb-4">
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 
                            text-gray-700 dark:text-gray-200 
                            bg-white dark:bg-gray-700
                            leading-tight focus:outline-none focus:shadow-outline
                            transition-colors duration-300"
                    id="email"
                    type="text"
                    value={userData.email}
                    onChange={handleInputChange}
                    placeholder="Phone number, username, or email"
                  />
                </div>
                <div className="mb-6">
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 
                            text-gray-700 dark:text-gray-200 
                            bg-white dark:bg-gray-700
                            leading-tight focus:outline-none focus:shadow-outline
                            transition-colors duration-300"
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={userData.password}
                    onChange={handleInputChange}
                  />
                  <div className="flex flex-row-reverse py-3">
                    <a
                      className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <button
                  className="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 
                          text-white w-full font-bold py-2 px-4 rounded 
                          focus:outline-none focus:shadow-outline
                          transition-colors duration-300"
                  type="button"
                  onClick={handleSubmit}
                >
                  Log In
                </button>

                {/* Divider with OR */}
                <div className="flex items-center my-4">
                  <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
                  <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm">
                    OR
                  </span>
                  <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
                </div>

                {/* Google Login */}
                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={googleLogin}
                    onError={() => console.log("Google Login Failed")}
                    theme={darkMode ? "filled_blue" : "outline"}
                    size="large"
                  />
                </div>

                <div className="flex justify-center pb-15">
                  <a
                    className="inline-block align-baseline font-bold py-10 px-10 text-sm 
                            text-blue-500 hover:text-blue-800 
                            dark:text-blue-400 dark:hover:text-blue-300"
                    href="#"
                    onClick={handleClick}
                  >
                    Don't have an account? Sign Up
                  </a>
                </div>
              </form>
              <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
                &copy;2025 Socially
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default withAuthRedirect(LoginPage);
