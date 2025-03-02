import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Posts from "./pages/Posts";
import GroupPage from "./pages/GroupPage";
import Chat from "./pages/Chat";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./context/authGuard";
import Loader from "./components/Loader";
import { LoaderProvider } from "./context/loaderContext";
import { Toaster } from "sonner";
import { StoreProvider } from "./context/storeContext";

function App() {
  return (
    <BrowserRouter>
      <LoaderProvider>
        <Loader />
        <StoreProvider>
          <AuthProvider>
            <Toaster richColors position="top-right" />
            <Routes>
              <Route index element={<LoginPage />} />
              <Route
                path="/posts"
                element={
                  <ProtectedRoute>
                    <Posts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/groups"
                element={
                  <ProtectedRoute>
                    <GroupPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chats"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </StoreProvider>
      </LoaderProvider>
    </BrowserRouter>
  );
}
export default App;
