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
import Reviews from "./pages/main/Reviews";
import Marketplaces from "./pages/main/Marketplaces";
import SingleMarket from "./pages/main/SingleMarket";
import SignUp from "./pages/auth/SignUp";
import Email from "./pages/auth/verification/Email";
import Verification from "./pages/auth/verification/Verification";
import Password from "./pages/auth/verification/Password";
import Name from "./pages/auth/verification/Name";
import Username from "./pages/auth/verification/Username";
import Profile_Creation from "./pages/auth/verification/Profile_Creation";

function App() {
  return (
    <Routes>
      <Route index element={<Auth />} />
      <Route path="/signin" element={<Auth />} />
      <Route path="/onboarding" element={<SignUp />}>
        <Route index element={<Email />} />
        <Route path="verify" element={<Verification />} />
        <Route path="password" element={<Password />} />
        <Route path="username" element={<Username />} />
        <Route path="name" element={<Name />} />
        <Route path="profile" element={<Profile_Creation />} />
      </Route>

      <Route path="/main" element={<Home />}>
        {/* <Route index element={<Dashboard />} /> */}
        <Route path="" element={<Marketplaces />} />
        <Route path="marketplaces/:id" element={<SingleMarket />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="profile" element={<Profile />} />
        <Route path="performance" element={<Performance />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reviews" element={<Reviews />} />
      </Route>
    </Routes>
  );
}

export default App;
