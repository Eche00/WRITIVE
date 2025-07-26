import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";

const CustomerBooking = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProductions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/production/`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setProductions(data.productions || []);
    } catch (err) {
      console.error("Fehler beim Laden der Produktionen:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductions();
  }, []);

  return (
    <div className="p-4 md:w-[80%] w-full mx-auto text-black flex flex-col h-fit overflow-scroll">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[42px] font-bold font-mono text-[#412666]">
          PRODUKTIONSUBERSICHT
        </h2>
      </div>

      {loading ? (
        <UserLoader />
      ) : (
        <section className=" flex flex-col items-center justify-center w-fit">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="bg-white p-4 rounded-xl shadow border border-gray-100 w-fit xl:w-full">
            <div className="border border-[#412666] rounded-lg px-4 w-full md:w-1/2 flex items-center gap-2 mb-4">
              <Search />
              <input
                type="text"
                placeholder="Suche Artikel, Brand oder Kunde..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-none py-2 focus:outline-none bg-transparent"
              />
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-[#412666] border-b border-gray-200">
                <tr>
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Artikel</th>
                  <th className="py-2 px-3">Brand</th>
                  <th className="py-2 px-3">Kunde</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Geprüft</th>
                  <th className="py-2 px-3">Aufbereitet</th>
                  <th className="py-2 px-3">Erstellt am</th>
                </tr>
              </thead>
              <tbody>
                {productions
                  .filter((p) =>
                    (p.ArtikelName + p.BrandName + p.KundeName)
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((p) => {
                    const allSteps = [
                      "Data Received",
                      "Data Preparation",
                      "In Progress",
                      "Production Started",
                      "Production Completed",
                      "Quality Check Started",
                      "Quality Check Completed",
                      "Ready for Shipment",
                      "Shipped",
                      "Order Completed",
                    ];
                    const stepIndex = allSteps.indexOf(p.Status);
                    const isCurrent = (index) => index === stepIndex;
                    const isCompleted = (index) => index < stepIndex;

                    const statusColorMap = {
                      "Data Received": "text-red-600 bg-red-100",
                      "Data Preparation": "text-orange-600 bg-orange-100",
                      "In Progress": "text-blue-600 bg-blue-100",
                      "Production Started": "text-purple-600 bg-purple-100",
                      "Production Completed": "text-indigo-600 bg-indigo-100",
                      "Quality Check Started": "text-yellow-600 bg-yellow-100",
                      "Quality Check Completed":
                        "text-yellow-800 bg-yellow-200",
                      "Ready for Shipment": "text-cyan-700 bg-cyan-100",
                      Shipped: "text-sky-600 bg-sky-100",
                      "Order Completed": "text-green-700 bg-green-100",
                    };

                    return (
                      <React.Fragment key={p.ID}>
                        {/* Main Row */}
                        <tr className=" border-gray-100 hover:bg-gray-50 transition-all py-2 border-b">
                          <td className="py-4 px-3">{p.ID}</td>
                          <td className="py-4 px-3">{p.ArtikelName}</td>
                          <td className="py-4 px-3">{p.BrandName}</td>
                          <td className="py-4 px-3">{p.KundeName}</td>
                          <td className="py-4 px-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold bg-opacity-20 ${
                                statusColorMap[p.Status] ||
                                "text-gray-600 bg-gray-100"
                              }`}>
                              {p.Status}
                            </span>
                          </td>
                          <td className="py-2 px-3">
                            {p.GeaenderteStueckzahl}
                          </td>
                          <td className="py-2 px-3">{p.GepruefteStueckzahl}</td>
                          <td className="py-2 px-3">
                            {new Date(p.ErstellungsDatum).toLocaleString(
                              "de-DE"
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
              </tbody>
            </table>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default CustomerBooking;
