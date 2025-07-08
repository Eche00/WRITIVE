import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

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
        <h2 className="text-xl font-semibold text-[#412666]">Kampagnen</h2>
        <div className="flex gap-2">
          {["csv", "xlsx", "pdf"].map((format) => (
            <button
              key={format}
              onClick={() =>
                window.open(
                  `${BASE_URL}/campaigns/export?format=${format}`,
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
          placeholder="Suche Kampagnenname oder Produkt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-none py-2 focus:outline-none bg-transparent"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Lädt Kampagnen...</p>
      ) : campaigns.length === 0 ? (
        <p className="text-gray-500">Keine Kampagnen gefunden.</p>
      ) : (
        <div className="overflow-x-auto">
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
                    <td className="py-2 px-3">{c.product}</td>
                    <td className="py-2 px-3">{c.status}</td>
                    <td className="py-2 px-3">
                      {new Date(c.start_date).toLocaleDateString("de-DE")}
                    </td>
                    <td className="py-2 px-3">
                      {new Date(c.end_date).toLocaleDateString("de-DE")}
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
        </div>
      )}
    </div>
  );
};

export default CustomerCampaigns;
