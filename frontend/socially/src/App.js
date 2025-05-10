import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Posts from "./pages/Posts";
import GroupPage from "./pages/GroupPage";
import Chat from "./pages/Chat";
import ProfilePage from "./pages/Profile";
import { AuthProvider } from "./context/authContext";
import ProtectedRoute from "./context/authGuard";
import Loader from "./components/Loader";
import { LoaderProvider } from "./context/loaderContext";
import { Toaster } from "sonner";
import { StoreProvider } from "./context/storeContext";
import { PostProvider } from "./context/postContext";
import { ThemeProvider } from "./context/themeContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <LoaderProvider>
          <Loader />
          <StoreProvider>
            <PostProvider>
              <AuthProvider>
                <Toaster richColors position="top-right" />
                <Routes>
                  <Route index element={<LoginPage />} />
                  <Route
                    path="/posts/:groupId"
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
                  <Route
                    path="/profile/:profileId"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AuthProvider>
            </PostProvider>
          </StoreProvider>
        </LoaderProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
export default App;
