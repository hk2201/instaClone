import { useState } from "react";
import Title from "../components/Title";
import { useAuth } from "../context/authContext";
import { GoogleLogin } from "@react-oauth/google";

function SignUpPage({ isSignup, OnValChange }) {
  // Please implement the re enter password validation check
  const [isLogin, SetIsLogin] = useState(isSignup);
  const [userData, SetUserData] = useState({
    email: "",
    username: "",
    lastname: "",
    password: "",
    repassword: "",
  });
  const { signup, googleLogin } = useAuth();

  function handleClick() {
    SetIsLogin(!isLogin);
    OnValChange(isLogin);
  }

  // Handle input changes and store values in state
  function handleInputChange(e) {
    const { id, value } = e.target;
    SetUserData({
      ...userData,
      [id]: value, // Update the specific field based on the input ID
    });
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(
        userData.email,
        userData.password,
        userData.lastname,
        userData.username,
        userData.repassword
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen white-100">
      <div className="bg-white size-11/12 flex justify-center items-center flex-col h-screen">
        <div className="rounded w-full max-w-xl">
          <div className="flex justify-center pb-10 ">
            <Title />
          </div>
          <form className="px-8 pt-5 pb-8 mb-4">
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="username"
                type="text"
                placeholder="First Name"
                value={userData.username}
                onChange={handleInputChange} // Capture input value
              />
            </div>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lastname"
                type="text"
                placeholder="Last Name"
                value={userData.lastname}
                onChange={handleInputChange} // Capture input value
              />
            </div>
            <div className="mb-4">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="text"
                placeholder="Phone number, username, or email"
                value={userData.email}
                onChange={handleInputChange} // Capture input value
              />
            </div>
            <div className="mb-6">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleInputChange} // Capture input value
              />
            </div>
            <div className="mb-6">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="repassword"
                type="password"
                value={userData.repassword}
                onChange={handleInputChange}
                placeholder="Re-enter Password"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              Sign Up
            </button>
            {/* Divider with OR */}
            <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="mx-4 text-gray-500 text-sm">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={googleLogin}
                onError={() => console.log("Google Login Failed")}
                theme="outline" // Options: "outline" or "filled_blue"
                size="large" // Options: "small", "medium", "large"
              />
            </div>

            <div className="flex justify-center pb-15">
              <a
                className="inline-block align-baseline font-bold py-10 px-10 text-sm text-blue-500 hover:text-blue-800"
                href="#"
                onClick={handleClick}
              >
                Have Account ? Log In
              </a>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2025 Socially
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
