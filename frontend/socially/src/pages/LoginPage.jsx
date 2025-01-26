import { useState } from "react";
import Title from "../components/Title";
import SignUpPage from "./SignUpPage";

function LoginPage() {
  const [isSignup, SetIsSignup] = useState(false);
  function handleClick() {
    SetIsSignup(!isSignup);
  }
  function handleChange(newVal) {
    SetIsSignup(newVal);
  }
  return (
    <>
      {isSignup ? (
        <SignUpPage isLogin={isSignup} OnValChange={handleChange} />
      ) : (
        <div className="flex justify-center items-center h-screen white-100">
          <div class="bg-white size-11/12 flex justify-center items-center flex-col h-screen">
            <div className="rounded w-full max-w-xl">
              <div className="flex justify-center pb-10 ">
                <Title />
              </div>
              <form class="px-8 pt-5 pb-8 mb-4">
                <div class="mb-4">
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="username"
                    type="text"
                    placeholder="Phone number, username, or email"
                  />
                </div>
                <div class="mb-6">
                  <input
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="password"
                    type="password"
                    placeholder="Password"
                  />
                  <div className="flex flex-row-reverse py-3">
                    <a
                      class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  </div>
                </div>
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="button"
                >
                  Log In
                </button>

                <div className="flex justify-center pb-15">
                  <a
                    class="inline-block align-baseline font-bold py-10 px-10 text-sm text-blue-500 hover:text-blue-800"
                    href="#"
                    onClick={handleClick}
                  >
                    Don't have account ? Sign Up
                  </a>
                </div>
              </form>
              <p class="text-center text-gray-500 text-xs">
                &copy;2025 Socially
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginPage;
