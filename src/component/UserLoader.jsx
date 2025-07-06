import { Search } from "@mui/icons-material";
import React from "react";

function UserLoader() {
  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#412666] ">Nutzer</h2>
          <div className="border border-[#412666] rounded-lg px-4  w-1/3 focus:outline-none flex items-center gap-[10px]">
            <Search />
            <input
              type="text"
              placeholder=""
              className=" border-none focus:outline-none py-2 flex-1"
            />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="text-[#412666] border-b border-gray-200">
            <tr>
              <th className="py-2 px-3">AutoID</th>
              <th className="py-2 px-3">KontaktName</th>
              <th className="py-2 px-3">EmailAdresse</th>
              <th className="py-2 px-3">Firma</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200 hover:bg-gray-50 transition">
              <td className="py-2 px-3">.......</td>
              <td className="py-2 px-3">.......</td>
              <td className="py-2 px-3">.......</td>
              <td className="py-2 px-3">.......</td>
              <td className="py-2 px-3">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700`}>
                  <span className="w-2 h-2 bg-current rounded-full"></span>
                  ....
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserLoader;
