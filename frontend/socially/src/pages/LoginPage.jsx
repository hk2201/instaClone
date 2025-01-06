import Title from "../components/Title";

function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-sky-100">
      <div class="bg-white shadow-md rounded w-full max-w-xl py-20">
        <div className="flex justify-center pb-10">
          <Title />
        </div>
        <form class="px-8 pt-6 pb-8 mb-4">
          <div class="mb-4">
            <input
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="username"
            />
          </div>
          <div class="mb-6">
            <input
              class="hadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="password"
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
        </form>
        <p class="text-center text-gray-500 text-xs">&copy;Footer Part</p>
      </div>
    </div>
  );
}

export default LoginPage;
