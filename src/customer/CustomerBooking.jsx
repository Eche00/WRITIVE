import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

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
    <div className="p-4 md:w-[80%] w-full mx-auto text-black flex flex-col h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#412666]">
          Buchungshistorie
        </h2>
        <div className="flex gap-2">
          {["csv", "xlsx", "pdf"].map((format) => (
            <button
              key={format}
              onClick={() =>
                window.open(
                  `${BASE_URL}/buchungshistorie/export?format=${format}`,
                  "_blank"
                )
              }
              className="px-3 py-1 border border-[#412666] rounded hover:bg-[#412666] hover:text-white transition-all">
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-[#412666] rounded-lg px-4 w-full md:w-1/3 flex items-center gap-2 mb-4">
        <Search />
        <input
          type="text"
          placeholder="Suche Firmenname oder KundeID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-none py-2 focus:outline-none bg-transparent"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Lädt Buchungen...</p>
      ) : bookings.length === 0 ? (
        <p className="text-gray-500">Keine Buchungen gefunden.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">KundeID</th>
                <th className="py-2 px-3">Firmenname</th>
                <th className="py-2 px-3">Buchungswert (€)</th>
                <th className="py-2 px-3">Zeitstempel</th>
              </tr>
            </thead>
            <tbody>
              {bookings
                .filter(
                  (b) =>
                    (b.KundeID?.toLowerCase() || "").includes(
                      search.toLowerCase()
                    ) ||
                    (b.Firmenname?.toLowerCase() || "").includes(
                      search.toLowerCase()
                    )
                )
                .map((b) => (
                  <tr
                    key={b.ID}
                    className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{b.ID}</td>
                    <td className="py-2 px-3">{b.KundeID}</td>
                    <td className="py-2 px-3">{b.Firmenname}</td>
                    <td className="py-2 px-3">€ {b.Buchungswert}</td>
                    <td className="py-2 px-3">
                      {new Date(b.Zeitstempel).toLocaleString("de-DE")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerBooking;
