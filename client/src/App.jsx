import { Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/Auth.jsx";
import Main from "./pages/app/Main.jsx";
import Dashboard from "./pages/app/Dashboard.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/main" element={<Main />}>
        <Route path="/main" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
