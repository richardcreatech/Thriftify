import { Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/Auth.jsx";
import Main from "./pages/app/Main.jsx";
import Dashboard from "./pages/app/Dashboard.jsx";
import Product from "./pages/app/Product.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/main" element={<Main />}>
        <Route index element={<Dashboard />} />
        <Route path="product/:id" element={<Product />} />
      </Route>
    </Routes>
  );
}

export default App;
