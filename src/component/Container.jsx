import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Header from "./Header";

function Container() {
  const token = localStorage.getItem("token");
  const is_Admin = localStorage.getItem("is_admin");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    } else if (is_Admin === "false") {
      navigate("/customer/home");
    }
  }, [navigate]);
  return (
    <div className=" relative sm:h-full bg-white dark:bg-[#1F1F1F]">
      {/* header  */}
      <Header />

      {/* outlet for pages and sidebar  */}
      <section className=" w-full flex mt-[65px] relative bg-white dark:bg-[#1F1F1F]">
        <div className="flex-1 p-5 h-fit overflow-y-scroll  md:text-wrap md:overflow-hidden text-nowrap  overflow-scroll">
          <Outlet />
        </div>
      </section>
    </div>
  );
}

export default Container;
