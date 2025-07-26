import { Search } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../lib/baseurl";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";

function CustomerQr() {
  const [search, setSearch] = useState("");
  const [customerQRStats, setCustomerQRStats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to format date string like "2025-07-23 23:33:16"
  const formatDate = (str) =>
    str ? new Date(str.replace(" ", "T")).toLocaleString("de-DE") : "—";

  const fetchCustomerQRStatistics = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/qrplanet/customer/qr-statistics`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Fehler beim Abrufen der QR-Statistiken");

      const data = await res.json();
      setCustomerQRStats(data.campaigns || []);
    } catch (err) {
      console.error(err);
      console.error("Kampagnen-Statistiken konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomerQRStatistics();
  }, []);

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className="mt-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-[42px] font-bold font-mono text-[#412666]">
            QR-Code-Verarbeitung
          </h3>
        </div>
      </div>
      {loading ? (
        <section>
          <UserLoader />
        </section>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow border border-gray-100 w-fit xl:w-full">
          <section className="mb-6">
            <div className="flex justify-between items-center">
              <div className="border border-[#412666] rounded-lg px-4 w-1/3 flex items-center gap-2">
                <Search />
                <input
                  type="text"
                  placeholder="Suche nach Kampagne / QR-Code..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 border-none py-2 focus:outline-none"
                />
              </div>
            </div>
          </section>

          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Kampagne</th>
                <th className="py-2 px-3">QR-Code</th>
                <th className="py-2 px-3">Scans</th>
                <th className="py-2 px-3">Eindeutige Scans</th>
                <th className="py-2 px-3">Letzter Scan</th>
              </tr>
            </thead>
            <tbody>
              {customerQRStats
                .filter(
                  (c) =>
                    c.CampaignName?.toLowerCase().includes(
                      search.toLowerCase()
                    ) || c.QRCode?.toLowerCase().includes(search.toLowerCase())
                )
                .map((c, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{c.CampaignName}</td>
                    <td className="py-2 px-3 text-blue-600 underline break-all">
                      <a
                        href={c.QRCode}
                        target="_blank"
                        rel="noopener noreferrer">
                        {c.QRCode}
                      </a>
                    </td>
                    <td className="py-2 px-3">{Number(c.Scans) || 0}</td>
                    <td className="py-2 px-3">{Number(c.UniqueScans) || 0}</td>
                    <td className="py-2 px-3">{formatDate(c.LastScan)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
}

export default CustomerQr;
