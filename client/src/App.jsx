import React from "react";
import AuthHeader from "./components/AuthHeader";
import Auth from "./pages/auth/Auth";
import LoginForm from "./components/LoginForm";
import Home from "./pages/main/Home";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/main/Dashboard";
import Profile from "./pages/main/Profile";
import Performance from "./pages/main/Performance";
import Revenue from "./pages/main/Revenue";
import Orders from "./pages/main/Orders";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/main" element={<Home />}>
        <Route index element={<Dashboard />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="profile" element={<Profile />} />
        <Route path="performance" element={<Performance />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}

export default App;
