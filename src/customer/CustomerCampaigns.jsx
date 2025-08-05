import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";

const CustomerCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showProductionDetailModal, setShowProductionDetailModal] =
    useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/production/grouped_by_campaign`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setCampaigns(data);
      console.log(data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);
  const statusColorMap = {
    "Data Received": "text-red-600 bg-red-100",
    "Data Preparation": "text-orange-600 bg-orange-100",
    "In Progress": "text-blue-600 bg-blue-100",
    "Production Started": "text-purple-600 bg-purple-100",
    "Production Completed": "text-indigo-600 bg-indigo-100",
    "Quality Check Started": "text-yellow-600 bg-yellow-100",
    "Quality Check Completed": "text-yellow-800 bg-yellow-200",
    "Ready for Shipment": "text-cyan-700 bg-cyan-100",
    Shipped: "text-sky-600 bg-sky-100",
    "Order Completed": "text-green-700 bg-green-100",
  };
  return (
    <div className="p-4 md:w-[80%] w-full mx-auto text-black flex flex-col h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[42px] font-bold font-mono text-[#412666]">
          KAMPAGNEN/BATCHES
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
              placeholder="Suche Kampagnenname..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none py-2 focus:outline-none bg-transparent"
            />
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200 uppercase">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Artikel</th>
                <th className="py-2 px-3">BrandName</th>
                <th className="py-2 px-3">Kunde</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Startdatum</th>
                <th className="py-2 px-3">Versand</th>
                <th className="py-2 px-3">Credits</th>
                <th className="py-2 px-3">productions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns
                .filter((c) =>
                  c.campaign_name?.toLowerCase().includes(search.toLowerCase())
                )
                .map((c) => (
                  <React.Fragment key={c.id}>
                    <tr className="bg-gray-100 w-full">
                      <td
                        colSpan={8}
                        className="py-4 px-3 font-medium text-xl text-[#412666] uppercase">
                        <p>{c.campaign_name}</p>
                      </td>
                      <td
                        colSpan={8}
                        className="py-4 px-3 font-medium text-xl text-[#412666] uppercase flex items-center gap-[10px] justify-end">
                        <span>Restguthaben: </span> <p>{c.remaining_credits}</p>
                      </td>
                    </tr>

                    {c.productions.map((p) => (
                      <tr
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedProduction(p);
                          setShowProductionDetailModal(true);
                        }}>
                        <td className="py-2 px-3">{p.ID}</td>
                        <td className="py-2 px-3">{p.ArtikelName}</td>
                        <td className="py-2 px-3">{p.BrandName}</td>
                        <td className="py-2 px-3">{p.KundeName}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold bg-opacity-20 ${
                              statusColorMap[p.Status] ||
                              "text-gray-600 bg-gray-100"
                            }`}>
                            {p.Status}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          {p.DatenAufbereitungStartZeit
                            ? new Date(
                                p.DatenAufbereitungStartZeit
                              ).toLocaleDateString("de-DE")
                            : "-"}
                        </td>
                        <td className="py-2 px-3">
                          {p.gep_SendoutDatum
                            ? new Date(p.gep_SendoutDatum).toLocaleDateString(
                                "de-DE"
                              )
                            : "-"}
                        </td>
                        <td className="py-2 px-3">{c.booked_credits}</td>
                        <td className="py-2 px-3">{c.produced}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </motion.div>
      )}
      {showProductionDetailModal && selectedProduction && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 text-wrap">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Produktions-Details (ID: {selectedProduction.ID})
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Artikel:</span>
                <span>{selectedProduction.ArtikelName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Brand:</span>
                <span>{selectedProduction.BrandName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde:</span>
                <span>{selectedProduction.KundeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span>{selectedProduction.Status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Standard Stückzahl:</span>
                <span>{selectedProduction.StandardStueckzahl}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Datenaufbereitung Start:</span>
                <span>
                  {selectedProduction.DatenAufbereitungStartZeit
                    ? new Date(
                        selectedProduction.DatenAufbereitungStartZeit
                      ).toLocaleString()
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Versand geplant:</span>
                <span>
                  {selectedProduction.gep_SendoutDatum
                    ? new Date(
                        selectedProduction.gep_SendoutDatum
                      ).toLocaleString()
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Produktion abgeschlossen:</span>
                <span>
                  {selectedProduction.ProduktionAbgeschlossenZeit
                    ? new Date(
                        selectedProduction.ProduktionAbgeschlossenZeit
                      ).toLocaleString()
                    : "-"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowProductionDetailModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerCampaigns;
