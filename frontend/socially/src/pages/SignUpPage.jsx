import { useState } from "react";
import Title from "../components/Title";

function SignUpPage({ isSignup, OnValChange }) {
  const [isLogin, SetIsLogin] = useState(isSignup);
  function handleClick() {
    SetIsLogin(!isLogin);
    OnValChange(isLogin);
  }
  return (
    <div className="flex justify-center items-center h-screen white-100">
      <div class="bg-white shadow-xl rounded-3xl border-2 size-11/12 flex justify-center items-center flex-col h-screen">
        <div className="rounded w-full max-w-xl">
          <div className="flex justify-center pb-10 ">
            <Title />
          </div>
          <form class="px-8 pt-5 pb-8 mb-4">
            <div class="mb-4">
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="fname"
                type="text"
                placeholder="First Name"
              />
            </div>
            <div class="mb-4">
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="lname"
                type="text"
                placeholder="Last Name"
              />
            </div>
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
            </div>
            <div class="mb-6">
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="rpassword"
                type="password"
                placeholder="Re-enter Password"
              />
            </div>
            <button
              class="bg-blue-500 hover:bg-blue-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Sign Up
            </button>

            <div className="flex justify-center pb-15">
              <a
                class="inline-block align-baseline font-bold py-10 px-10 text-sm text-blue-500 hover:text-blue-800"
                href="#"
                onClick={handleClick}
              >
                Have Account ? Log In
              </a>
            </div>
          </form>
          <p class="text-center text-gray-500 text-xs">&copy;2025 Socially</p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
