import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";

const CustomerCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/campaigns/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setCampaigns(data || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="p-4 md:w-[80%] w-full mx-auto text-black flex flex-col h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[42px] font-bold font-mono text-[#412666]">
          KAMPAGNEN
        </h2>
      </div>

      {loading ? (
        <UserLoader />
      ) : campaigns.length === 0 ? (
        <p className="text-gray-500">Keine Kampagnen gefunden.</p>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow border border-gray-100 w-fit xl:w-full">
          <div className="border border-[#412666] rounded-lg px-4 w-full md:w-1/3 flex items-center gap-2 mb-4">
            <Search />
            <input
              type="text"
              placeholder="Suche Kampagnenname oder Produkt..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none py-2 focus:outline-none bg-transparent"
            />
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Name</th>
                <th className="py-2 px-3">Produkt</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Startdatum</th>
                <th className="py-2 px-3">Enddatum</th>
                <th className="py-2 px-3">QR-Code</th>
              </tr>
            </thead>
            <tbody>
              {campaigns
                .filter(
                  (c) =>
                    c.name?.toLowerCase().includes(search.toLowerCase()) ||
                    c.product?.toLowerCase().includes(search.toLowerCase())
                )
                .map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{c.id}</td>
                    <td className="py-2 px-3">{c.name}</td>
                    <td className="py-2 px-3">{c.product || "N/A"}</td>
                    <td className="py-2 px-3">{c.status || "Aktiv"}</td>
                    <td className="py-2 px-3">
                      {c.start_date
                        ? new Date(c.start_date).toLocaleDateString("de-DE")
                        : new Date(c.created_at).toLocaleDateString("de-DE")}
                    </td>
                    <td className="py-2 px-3">
                      {c.end_date
                        ? new Date(c.end_date).toLocaleDateString("de-DE")
                        : "-"}
                    </td>
                    <td className="py-2 px-3">
                      <a
                        href={c.qr_code}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline break-all">
                        QR-Link
                      </a>
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

export default CustomerCampaigns;
