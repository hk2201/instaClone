import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Posts from "./pages/Posts";
import GroupPage from "./pages/GroupPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/groups" element={<GroupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
