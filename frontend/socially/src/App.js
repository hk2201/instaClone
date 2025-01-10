import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import GroupPage from "./pages/GroupPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/groups" element={<GroupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
