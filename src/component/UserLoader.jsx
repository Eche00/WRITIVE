import { Circle, Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import React from "react";

function UserLoader() {
  return (
    <motion.div
      initial={{ scale: 2, opacity: 1 }}
      whileInView={{ scale: 0, opacity: 0 }}
      transition={{ duration: 1.5, delay: 0.5 }}
      className="p-4 md:w-[80%] w-fit mx-auto text-black flex flex-col h-fit">
      <div className=" bg-transparent p-6 ">
        {/* Donut Loader */}
        <div className="flex justify-center items-center py-16 flex-col gap-4">
          <div
            className="w-32 h-32 border-[12px] border-[#412666]/30 border-t-[#412666] border-b-[#412666] rounded-full animate-spin flex items-center justify-center shadow-[0_0_12px_#41266650] transition-all duration-300 ease-in-out"
            style={{ borderTopStyle: "dotted", borderBottomStyle: "dotted" }}>
            <Circle style={{ fontSize: 46, color: "#412666" }} />
          </div>
          <p className="text-[#412666] text-[32px] font-bold tracking-wide">
            Wird geladen...
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default UserLoader;
