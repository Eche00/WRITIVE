import React, { useState } from "react";
import { Route, Routes } from "react-router";
import Container from "./component/Container";
import Signup from "./authentication/Signup";
import Signin from "./authentication/Signin";
import ForgotPassword from "./authentication/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Brand from "./pages/Brand";
import ProductionWorkflow from "./pages/ProductionWorkflow";
import Booking from "./pages/Booking";
import Inventory from "./pages/Inventory";
import Settings from "./pages/Settings";
import Campaign from "./pages/Campaign";
import AmazonReviews from "./pages/AmazonReviews";
import QRCodeProcessing from "./pages/QRCodeProcessing";

function App() {
  return (
    <div className=" text-white  overflow-hidden bg-white  dark:bg-[#1F1F1F]">
      <Routes>
        <Route element={<Container />}>
          <Route path="/home" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="/workflow" element={<ProductionWorkflow />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/campaign" element={<Campaign />} />
          <Route path="/amazonreviews" element={<AmazonReviews />} />
          <Route path="/qrcode" element={<QRCodeProcessing />} />

          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<Signup />} />
        </Route>
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </div>
  );
}

export default App;
