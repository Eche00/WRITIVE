import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import CustomerHeader from "./CustomerHeader";

function CustomerContainer() {
  const token = localStorage.getItem("token");
  const is_Admin = localStorage.getItem("is_admin");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else if (is_Admin === "true") {
      navigate("/admin/home");
    }
  }, [navigate]);

  return (
    <div className=" relative sm:h-full bg-white dark:bg-[#1F1F1F]">
      {/* header  */}
      <CustomerHeader />

      {/* outlet for pages   */}
      <section className=" w-full flex mt-[65px] relative bg-white dark:bg-[#1F1F1F]">
        <div className="flex-1 p-5 h-fit overflow-y-scroll  md:text-wrap md:overflow-hidden text-nowrap  overflow-scroll">
          <Outlet />
        </div>
      </section>
    </div>
  );
}

export default CustomerContainer;
