import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Posts from "./pages/Posts";
import GroupPage from "./pages/GroupPage";
import Chat from "./pages/Chat";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/groups" element={<GroupPage />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
