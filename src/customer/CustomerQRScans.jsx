import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const CustomerQRScans = () => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchScans = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/qr-scans/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setScans(data || []);
    } catch (err) {
      console.error("Error fetching QR scans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, []);

  return (
    <div className="p-4 md:w-[80%] w-full mx-auto text-black flex flex-col h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#412666]">QR-Scans</h2>
        <div className="flex gap-2">
          {["csv", "xlsx", "pdf"].map((format) => (
            <button
              key={format}
              onClick={() =>
                window.open(
                  `${BASE_URL}/qr-scans/export?format=${format}`,
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
          placeholder="Suche Kampagne, Standort oder Gerät..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-none py-2 focus:outline-none bg-transparent"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Lädt Scans...</p>
      ) : scans.length === 0 ? (
        <p className="text-gray-500">Keine Scans gefunden.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Kampagne</th>
                <th className="py-2 px-3">CampaignID</th>
                <th className="py-2 px-3">Gerät</th>
                <th className="py-2 px-3">Standort</th>
                <th className="py-2 px-3">Zeitpunkt</th>
                <th className="py-2 px-3">Synchronisiert</th>
              </tr>
            </thead>
            <tbody>
              {scans
                .filter(
                  (s) =>
                    s.Campaign?.toLowerCase().includes(search.toLowerCase()) ||
                    s.Location?.toLowerCase().includes(search.toLowerCase()) ||
                    s.DeviceID?.toLowerCase().includes(search.toLowerCase())
                )
                .map((s) => (
                  <tr
                    key={s.ID}
                    className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{s.ID}</td>
                    <td className="py-2 px-3">{s.Campaign}</td>
                    <td className="py-2 px-3">{s.CampaignID}</td>
                    <td className="py-2 px-3">{s.DeviceID}</td>
                    <td className="py-2 px-3">{s.Location}</td>
                    <td className="py-2 px-3">
                      {new Date(s.ScannedAt).toLocaleString("de-DE")}
                    </td>
                    <td className="py-2 px-3">
                      {s.Synced ? (
                        <span className="text-green-600 font-semibold">Ja</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Nein</span>
                      )}
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

export default CustomerQRScans;
