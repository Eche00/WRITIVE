import React, { useEffect, useState } from "react";
import {
  PersonOutline,
  PhoneAndroid,
  Cake,
  Home,
  Campaign,
  ShoppingCart,
  Send,
  Event,
  CheckCircle,
  Search,
} from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";
function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productions, setProductions] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/customers/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    fetchProfile();
    fetchProductions();
  }, []);
  return (
    <div className="p-4 lg:w-[90%] w-full mx-auto text-black flex flex-col h-fit text-nowrap overflow-scroll ">
      <div className=" w-full ">
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
              className="bg-white p-4 w-fit max-h-[600px] overflow-scroll rounded-xl shadow border border-gray-100">
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
                    {/* <th className="py-2 px-3">Status</th> */}
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
                        "Quality Check Started":
                          "text-yellow-600 bg-yellow-100",
                        "Quality Check Completed":
                          "text-yellow-800 bg-yellow-200",
                        "Ready for Shipment": "text-cyan-700 bg-cyan-100",
                        Shipped: "text-sky-600 bg-sky-100",
                        "Order Completed": "text-green-700 bg-green-100",
                      };

                      return (
                        <React.Fragment key={p.ID}>
                          {/* Main Row */}
                          <tr className=" border-gray-100 hover:bg-gray-50 transition-all">
                            <td className="py-4 px-3">{p.ID}</td>
                            <td className="py-4 px-3">{p.ArtikelName}</td>
                            <td className="py-4 px-3">{p.BrandName}</td>
                            <td className="py-4 px-3">{p.KundeName}</td>
                            {/* <td className="py-4 px-3">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold bg-opacity-20 ${
                                      statusColorMap[p.Status] ||
                                      "text-gray-600 bg-gray-100"
                                    }`}>
                                    {p.Status}
                                  </span>
                                </td> */}
                            <td className="py-2 px-3">
                              {p.GeaenderteStueckzahl}
                            </td>
                            <td className="py-2 px-3">
                              {p.GepruefteStueckzahl}
                            </td>
                            <td className="py-2 px-3">
                              {new Date(p.ErstellungsDatum).toLocaleString(
                                "de-DE"
                              )}
                            </td>
                          </tr>

                          {/* Stepper Row */}
                          <tr className="border-b-1 border-[#412666] ">
                            <td colSpan={8} className="px-3 pb-5 pt-2">
                              <div className="flex items-center justify-between overflow-x-auto py-2 px-1 space-x-4">
                                {allSteps.map((step, index) => {
                                  const isLast = index === allSteps.length - 1;

                                  return (
                                    <div
                                      key={step}
                                      className="flex flex-col items-center relative min-w-[120px] group ">
                                      {/* Connector line */}
                                      {!isLast && (
                                        <div
                                          className={`absolute top-[10px] left-1/2 w-full h-0.5 z-10 transform -translate-x-1/2 ${
                                            isCompleted(index)
                                              ? "bg-[#412666]"
                                              : "bg-gray-300"
                                          }`}
                                        />
                                      )}

                                      {/* Dot */}
                                      <div
                                        className={`w-5 h-5 rounded-full flex items-center justify-center mb-2 z-10 ${
                                          isCompleted(index) || isCurrent(index)
                                            ? "bg-[#412666]"
                                            : "bg-gray-300"
                                        }`}>
                                        {isCompleted(index) ||
                                        isCurrent(index) ? (
                                          <CheckCircle
                                            fontSize="small"
                                            className="text-white"
                                          />
                                        ) : (
                                          <div className="w-2 h-2 bg-white rounded-full" />
                                        )}
                                      </div>
                                      {/* Label */}
                                      <div
                                        className={`text-xs text-center mr-10 ${
                                          p.Status === "Order Completed" &&
                                          isLast
                                            ? "text-[#412666] text-2xl font-extrabold"
                                            : "text-gray-700 font-bold"
                                        } max-w-[110px] group-hover:text-[#412666] cursor-pointer `}>
                                        {step}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-w-3xl mx-auto mt-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Profile Image or Placeholder */}
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#412666] to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-inner">
                  {profile?.KontaktName?.charAt(0) ||
                    profile?.EmailAdresse?.charAt(0) ||
                    "K"}
                </div>

                {/* Basic Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1">
                    {profile?.KontaktName || "Unbekannter Kunde"}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile?.Firma || "Firma nicht angegeben"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {profile?.EmailAdresse}
                  </p>
                  <div className="mt-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                        profile?.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                      {profile?.is_active ? "Aktiv" : "Inaktiv"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 text-[15px] text-gray-800 dark:text-gray-200">
                <div className="flex items-start gap-3">
                  <PersonOutline className="text-blue-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                      Kunden-ID
                    </p>
                    <p className="font-medium">{profile?.ID}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneAndroid className="text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                      Handy
                    </p>
                    <p className="font-medium">{profile?.Handynr || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Cake className="text-pink-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                      Geburtstag
                    </p>
                    <p className="font-medium">
                      {new Date(profile?.Geburtstag).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Home className="text-yellow-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                      Adresse
                    </p>
                    <p className="font-medium">
                      {profile?.MusterAdresse || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Campaign className="text-purple-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                      Aktive Kampagne
                    </p>
                    <p className="font-medium">
                      {profile?.AktiveKampagne || "Keine"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShoppingCart className="text-indigo-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                      Gesamt Gebucht
                    </p>
                    <p className="font-medium">
                      {profile?.GesamtStueckzahlGebucht}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Send className="text-red-400 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                      Gesamt Abgeschickt
                    </p>
                    <p className="font-medium">
                      {profile?.GesamtStueckzahlAbgeschickt}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Event className="text-teal-500 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">
                      Erstellt am
                    </p>
                    <p className="font-medium">
                      {new Date(profile?.ErstellungsDatum).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
}

export default CustomerProfile;
