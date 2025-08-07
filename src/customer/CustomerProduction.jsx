import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
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
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProductions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/campaigns/campaign_stats`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setProductions(data);
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
          AUSWERTUNG KAMPAGNEN / PRODUKTE
        </h2>
      </div>

      {loading ? (
        <UserLoader />
      ) : (
        <section className=" flex flex-col items-center justify-center w-full">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="bg-white p-4 rounded-xl shadow border border-gray-100 w-fit xl:w-full">
            <h2 className="text-[24px] font-bold font-mono text-[#412666] uppercase mb-2">
              Auswertung gruppiert nach Kampagnen / nach Produkten
            </h2>
            <div className="border border-[#412666] rounded-lg px-4 w-full md:w-1/2 flex items-center gap-2 mb-4">
              <Search />
              <input
                type="text"
                placeholder="Suche KampagneName..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-none py-2 focus:outline-none bg-transparent"
              />
            </div>
            <table className="w-full text-sm text-left">
              <thead className="text-[#412666] border-b border-gray-200 uppercase text-nowrap">
                <tr>
                  <th className="py-2 px-3">Bild</th>
                  <th className="py-2 px-3">Produkt/kampagne</th>
                  <th className="py-2 px-3">Karten</th>
                  <th className="py-2 px-3">scans</th>
                  <th className="py-2 px-3">Conversional Rate</th>
                </tr>
              </thead>

              <tbody>
                {productions
                  .filter((p) =>
                    p.KampagneName.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((p) => (
                    <tr
                      className=" border-gray-100 hover:bg-gray-50 transition-all py-2 border-b"
                      key={p.KampagneID}>
                      <td className="py-4 px-3">
                        <img
                          src={
                            p.Format === "DIN A6 KARTE"
                              ? Format1
                              : p.Format === "DIN A6 POSTKARTE"
                              ? Format2
                              : p.Format === "DIN LANG KARTE"
                              ? Format3
                              : p.Format === "DIN LANG POSTKARTE"
                              ? Format4
                              : p.Format === "MAXI POSTKARTE"
                              ? Format5
                              : p.Format === "DIN A6 KARTE +KUVERT"
                              ? Format6
                              : p.Format === "C6 KUVERT"
                              ? Format7
                              : p.Format === "DIN LANG KUVERT"
                              ? Format8
                              : p.Format === "DIN A4 BRIEF"
                              ? Format9
                              : p.Format === "DIN A4 BRIEF +KUVERT"
                              ? Format10
                              : Format11
                          }
                          alt={p.Format}
                          className="w-[50px] h-[40px] object-cover"
                        />{" "}
                      </td>
                      <td className="py-4 px-3 flex flex-col">
                        <span className=" font-extrabold">
                          {p.KampagneName}
                        </span>
                        <span className=" text-gray-500">{p.Format}</span>
                      </td>
                      <td className="py-4 px-3">{p.UsedCredits}</td>
                      <td className="py-4 px-3">{p.Scans}</td>
                      <td className="py-4 px-3 w-40">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className="bg-green-500 h-4 rounded-full"
                              style={{ width: `${p.ConversionRate}%` }}></div>
                          </div>
                          <span className="text-sm font-medium ">
                            {p.ConversionRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default CustomerBooking;
