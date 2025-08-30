import React, { useEffect, useState } from "react";
import {
  PersonOutline,
  PhoneAndroid,
  Cake,
  Home,
  Campaign,
  ShoppingCart,
  Send,
  CheckCircle,
  Search,
  Countertops,
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
    <div className="p-4 lg:w-[90%] w-full lg:mx-auto text-black flex flex-col h-fit text-nowrap overflow-hidden ">
      <div className=" w-full ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[42px] font-bold font-mono text-[#412666]">
            KUNDE
          </h2>
        </div>

        {loading ? (
          <UserLoader />
        ) : (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 max-w-4xl mt-10 mx-auto">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              {/* Profile Image / Placeholder */}
              <div className="relative w-32 h-32 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-500 text-white text-4xl font-bold shadow-lg ring-4 ring-indigo-200 dark:ring-indigo-800">
                {profile?.KontaktName?.charAt(0) ||
                  profile?.EmailAdresse?.charAt(0) ||
                  "K"}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {profile?.KontaktName || "Unbekannter Kunde"}
                </h2>
                <p className="text-base text-gray-500 dark:text-gray-400 mt-1">
                  {profile?.Firma || "Firma nicht angegeben"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile?.EmailAdresse}
                </p>

                <div className="mt-4">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                      profile?.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                    {profile?.is_active ? "Aktiv" : "Inaktiv"}
                  </span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-[15px] text-gray-800 dark:text-gray-200">
              {[
                {
                  icon: <PersonOutline className="w-5 h-5 text-blue-500" />,
                  label: "Kunden-ID",
                  value: profile?.ID,
                },
                {
                  icon: <PhoneAndroid className="w-5 h-5 text-green-500" />,
                  label: "Handy",
                  value: profile?.Handynr || "N/A",
                },
                {
                  icon: <Cake className="w-5 h-5 text-pink-500" />,
                  label: "Geburtstag",
                  value: profile?.Geburtstag
                    ? new Date(profile?.Geburtstag).toLocaleDateString()
                    : "N/A",
                },
                {
                  icon: <Home className="w-5 h-5 text-yellow-500" />,
                  label: "Adresse",
                  value: profile?.MusterAdresse || "N/A",
                },
                {
                  icon: <Campaign className="w-5 h-5 text-purple-500" />,
                  label: "Aktive Kampagne",
                  value:
                    Array.isArray(profile?.AktiveKampagne) &&
                    profile.AktiveKampagne.length
                      ? profile.AktiveKampagne
                      : ["Keine"],
                },
                {
                  icon: <ShoppingCart className="w-5 h-5 text-indigo-500" />,
                  label: "Gesamt Gebucht",
                  value: profile?.GesamtStueckzahlGebucht,
                },
                {
                  icon: <Send className="w-5 h-5 text-red-500" />,
                  label: "Gesamt Abgeschickt",
                  value: profile?.GesamtStueckzahlAbgeschickt,
                },
                {
                  icon: <Countertops className="w-5 h-5 text-teal-500" />,
                  label: "Verbleibend",
                  value: profile?.Gesamtverbleibend,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {item.label}
                    </p>
                    <p className="text-base font-semibold">
                      {Array.isArray(item.value) ? (
                        <div className="flex flex-wrap gap-2">
                          {item.value.map((kampagne, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-md bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-sm font-medium">
                              {kampagne}
                            </span>
                          ))}
                        </div>
                      ) : (
                        item.value
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default CustomerProfile;
