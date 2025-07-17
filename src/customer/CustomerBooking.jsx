import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";

const BASE_URL = "https://65e435ef7c7e.ngrok-free.app";

const CustomerBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/buchungshistorie/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setBookings(data.bookings || []);
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
                <th className="py-4 px-3">ID</th>
                <th className="py-4 px-3">KundeID</th>
                <th className="py-4 px-3">ArtikelID</th>
                <th className="py-4 px-3">Bezeichnung</th>
                <th className="py-4 px-3">Buchungstyp</th>
                <th className="py-4 px-3">Kategorie</th>
                <th className="py-4 px-3">Buchungswert (€)</th>
                <th className="py-4 px-3">Zeitstempel</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.ID}
                  className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-6 px-3">{b.ID}</td>
                  <td className="py-6 px-3">{b.KundeID}</td>
                  <td className="py-6 px-3">{b.ArtikelID}</td>
                  <td className="py-6 px-3">{b.Bezeichnung}</td>
                  <td className="py-6 px-3">{b.Buchungstyp}</td>
                  <td className="py-6 px-3">{b.Kategorie}</td>
                  <td className="py-6 px-3">€ {b.Buchungswert}</td>
                  <td className="py-6 px-3">
                    {new Date(b.Zeitstempel).toLocaleString("de-DE")}
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
