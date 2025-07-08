import { Close, DragHandle } from "@mui/icons-material";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

function CustomerHeader() {
  const [mobileNav, setMobileNav] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Logout failed");
      }

      localStorage.clear();

      navigate("/signin");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  return (
    <div className="shadow-xl dark:shadow-none dark:border-b-[0.8px] dark:border-gray-700  fixed top-0 left-0 w-full bg-white dark:bg-[#1F1F1F] z-50">
      {/* container */}
      <main className=" flex items-center  justify-between py-[10px]   w-[90%] mx-auto">
        {/* logo */}
        <section>
          <img
            src="/logo.webp"
            alt="logo"
            className="w-[40px] h-[40px] object-cover "
          />
        </section>
        {/* navigation */}
        {token && (
          <nav className=" hidden xl:flex items-center gap-[20px] text-black">
            <NavLink
              to="/customer/home"
              className={({ isActive }) =>
                isActive
                  ? "text-[14px] font-bold text-[#412666]"
                  : " text-[14px] font-bold text-gray-600"
              }>
              Kundenübersicht
            </NavLink>
            <NavLink
              to="/customer/booking"
              className={({ isActive }) =>
                isActive
                  ? "text-[14px] font-bold text-[#412666]"
                  : " text-[14px] font-bold text-gray-600"
              }>
              Buchungshistorie
            </NavLink>
            <NavLink
              to="/customer/campaign"
              className={({ isActive }) =>
                isActive
                  ? "text-[14px] font-bold text-[#412666]"
                  : " text-[14px] font-bold text-gray-600"
              }>
              Kampagne
            </NavLink>
            <NavLink
              to="/customer/amazonreviews"
              className={({ isActive }) =>
                isActive
                  ? "text-[14px] font-bold text-[#412666]"
                  : " text-[14px] font-bold text-gray-600"
              }>
              Amazon-Bewertungen
            </NavLink>
            <NavLink
              to="/customer/qrcode"
              className={({ isActive }) =>
                isActive
                  ? "text-[14px] font-bold text-[#412666]"
                  : " text-[14px] font-bold text-gray-600"
              }>
              QR-Code-Verarbeitung
            </NavLink>
          </nav>
        )}
        {token && (
          <div className=" flex items-center gap-[10px]">
            <button
              className="  text-[#412666] xl:hidden flex items-center justify-center px-2"
              onClick={() => setMobileNav(!mobileNav)}>
              {mobileNav ? <Close /> : <DragHandle fontSize="large" />}
            </button>

            <button
              className=" py-[8px] px-[24px] bg-[#412666] rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300"
              onClick={handleLogout}>
              Abmelden
            </button>
          </div>
        )}
        {token && mobileNav && (
          <div
            className=" fixed top-[60px] left-0 w-full h-[100vh]  bg-white border-t border-gray-100"
            onClick={() => setMobileNav(false)}>
            <nav className=" flex flex-col  text-black p-10">
              <NavLink
                to="/customer/home"
                className={({ isActive }) =>
                  isActive
                    ? "text-[14px] font-bold text-[#412666] p-3 border-b border-gray-200"
                    : " text-[14px] font-bold text-gray-600 p-3 border-b border-gray-200"
                }>
                Kundenübersicht
              </NavLink>
              <NavLink
                to="/customer/booking"
                className={({ isActive }) =>
                  isActive
                    ? "text-[14px] font-bold text-[#412666] p-3 border-b border-gray-200"
                    : " text-[14px] font-bold text-gray-600 p-3 border-b border-gray-200"
                }>
                Buchungshistorie
              </NavLink>
              <NavLink
                to="/customer/campaign"
                className={({ isActive }) =>
                  isActive
                    ? "text-[14px] font-bold text-[#412666] p-3 border-b border-gray-200"
                    : " text-[14px] font-bold text-gray-600 p-3 border-b border-gray-200"
                }>
                Kampagne
              </NavLink>
              <NavLink
                to="/customer/amazonreviews"
                className={({ isActive }) =>
                  isActive
                    ? "text-[14px] font-bold text-[#412666] p-3 border-b border-gray-200"
                    : " text-[14px] font-bold text-gray-600 p-3 border-b border-gray-200"
                }>
                Amazon-Bewertungen
              </NavLink>
              <NavLink
                to="/customer/qrcode"
                className={({ isActive }) =>
                  isActive
                    ? "text-[14px] font-bold text-[#412666] p-3 border-b border-gray-200"
                    : " text-[14px] font-bold text-gray-600 p-3 border-b border-gray-200"
                }>
                QR-Code-Verarbeitung
              </NavLink>
            </nav>
          </div>
        )}
      </main>
    </div>
  );
}

export default CustomerHeader;
