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
// import AmazonReviews from "./pages/AmazonReviews";
import QRCodeProcessing from "./pages/QRCodeProcessing";
import CustomerContainer from "./component/CustomerContainer";
import CustomerBooking from "./customer/CustomerBooking";
import CustomerCampaigns from "./customer/CustomerCampaigns";
import CustomerQRScans from "./customer/CustomerQRScans";
import CustomerAmazonReviews from "./customer/CustomerAmazonReviews";
import CustomerProfile from "./pages/CustomerProfile";
import Categories from "./pages/Categories";
import Articles from "./pages/Articles";

function App() {
  return (
    <div className=" text-white  overflow-hidden bg-white  dark:bg-[#1F1F1F]">
      <Routes>
        {/* Auth Routes */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        {/* Admin Protected Routes  */}
        <Route path="/admin" element={<Container />}>
          {/* Dashboard */}
          <Route path="/admin/home" element={<Dashboard />} />

          {/* User Management */}
          <Route path="/admin/users" element={<Users />} />

          {/* Brand & Campaign */}
          <Route path="/admin/brand" element={<Brand />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/articles" element={<Articles />} />
          <Route path="/admin/campaign" element={<Campaign />} />

          {/* Workflow & Inventory */}
          <Route path="/admin/workflow" element={<ProductionWorkflow />} />
          <Route path="/admin/booking" element={<Booking />} />
          <Route path="/admin/inventory" element={<Inventory />} />

          {/* Reviews & QR Code */}
          {/* <Route path="/admin/amazonreviews" element={<AmazonReviews />} /> */}
          <Route path="/admin/qrcode" element={<QRCodeProcessing />} />

          {/* Settings */}
          <Route path="/admin/settings" element={<Settings />} />
        </Route>
        {/* Customer routes */}
        <Route path="/customer" element={<CustomerContainer />}>
          <Route path="/customer/home" element={<CustomerProfile />} />
          <Route path="/customer/booking" element={<CustomerBooking />} />
          <Route path="/customer/campaign" element={<CustomerCampaigns />} />
          <Route path="/customer/qrcode" element={<CustomerQRScans />} />
          <Route
            path="/customer/amazonreviews"
            element={<CustomerAmazonReviews />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
