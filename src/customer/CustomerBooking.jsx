import React, { useEffect, useState } from "react";
import { Circle, Search } from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";
import {
  Format1,
  Format10,
  Format11,
  Format2,
  Format3,
  Format4,
  Format5,
  Format6,
  Format7,
  Format8,
  Format9,
} from "../assets";

const CustomerBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/customers/productions`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setBookings(data || []);
      console.log(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-4 md:w-[80%] w-full mx-auto text-black flex flex-col h-fit overflow-scroll">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[42px] font-bold font-mono text-[#412666]">
          BUCHUNGEN
        </h2>
      </div>

      {loading ? (
        <UserLoader />
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow border border-gray-100 w-fit xl:w-full">
          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Auftrags Nr</th>
                <th className="py-2 px-3">Produkt </th>
                <th className="py-2 px-3">Auflage</th>
                <th className="py-2 px-3">Datum</th>
                <th className="py-2 px-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  className=" border-gray-100 hover:bg-gray-50 transition-all py-2 border-b"
                  key={b.KampagneID}>
                  <td className="py-4 px-3">{b.KampagneID}</td>
                  <td className="py-4 px-3 ">
                    <div className="flex flex-row items-center  h-full gap-[5px]">
                      {" "}
                      <img
                        src={
                          b.Format === "DIN A6 KARTE"
                            ? Format1
                            : b.Format === "DIN A6 POSTKARTE"
                            ? Format2
                            : b.Format === "DIN LANG KARTE"
                            ? Format3
                            : b.Format === "DIN LANG POSTKARTE"
                            ? Format4
                            : b.Format === "MAXI POSTKARTE"
                            ? Format5
                            : b.Format === "DIN A6 KARTE +KUVERT"
                            ? Format6
                            : b.Format === "C6 KUVERT"
                            ? Format7
                            : b.Format === "DIN LANG KUVERT"
                            ? Format8
                            : b.Format === "DIN A4 BRIEF"
                            ? Format9
                            : b.Format === "DIN A4 BRIEF +KUVERT"
                            ? Format10
                            : Format11
                        }
                        alt={b.Format}
                        className="w-[30px] h-[20px] object-cover"
                      />
                      {b.Format}
                    </div>
                  </td>
                  <td className="py-4 px-3">{b.RestCredits}</td>
                  <td className="py-4 px-3">{b.StartDatum}</td>
                  <td className="py-4 px-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold bg-opacity-20
                              `}>
                      <p
                        className={`flex flex-col items-center justify-center 
    ${
      b.Status === "aktive"
        ? "text-orange-500"
        : b.Status === "ausstehend"
        ? "text-yellow-300"
        : b.Status === "abgeschlossen"
        ? "text-green-500"
        : "text-gray-500"
    }`}>
                        <Circle />
                        {b.Status}
                      </p>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default CustomerBooking;
