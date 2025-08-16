import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/inventory/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setItems(data.inventory || data); // Adjust if your API wraps results
    } catch (err) {
      console.error("Fehler beim Abrufen des Inventars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <h2 className="text-2xl font-bold text-[#412666] mb-5">Inventar</h2>
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
          <div className="flex items-center justify-between mb-6">
            Inventar
            <div className="flex items-center mb-4 border border-[#412666] rounded-lg px-4 py-2 w-1/3 gap-2">
              <Search className="text-[#412666]" />
              <input
                type="text"
                placeholder="Suche nach  Kategorie.."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-none focus:outline-none"
              />
            </div>
          </div>

          <table className="w-full text-sm text-left max-h-[200px] overflow-hidden">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Bezeichnung</th>
                <th className="py-2 px-3">Kategorie</th>
                <th className="py-2 px-3">Gesamtstückzahl</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && !loading ? (
                <tr>
                  <td colSpan={3} className="text-center p-4 text-gray-500">
                    Keine Daten gefunden.
                  </td>
                </tr>
              ) : (
                items.flatMap((item, catIdx) =>
                  item.Bezeichnungen.filter((bezeichnung) => {
                    const query = search.toLowerCase();
                    return (
                      bezeichnung.Wert.toLowerCase().includes(query) ||
                      item.Kategorie.toLowerCase().includes(query)
                    );
                  }).map((bezeichnung, idx) => (
                    <tr
                      key={`${catIdx}-${idx}`}
                      className="border-b border-gray-200 hover:bg-gray-50">
                      {/* Wert (shortened if needed) */}
                      <td className="py-2 px-3">{bezeichnung.Wert || "—"}</td>

                      {/* Kategorie */}
                      <td className="py-2 px-3">{item.Kategorie}</td>

                      {/* Gesamtstückzahl */}
                      <td className="py-2 px-3">
                        {bezeichnung.GesamtStueckzahl}
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default Inventory;
