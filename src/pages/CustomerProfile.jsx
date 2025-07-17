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
} from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";

function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://65e435ef7c7e.ngrok-free.app/customers/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

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
  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <div>Failed to load profile.</div>;

  return (
    <div>
      {loading ? (
        <UserLoader />
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
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
                {profile.KontaktName || "Unbekannter Kunde"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.Firma || "Firma nicht angegeben"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {profile.EmailAdresse}
              </p>
              <div className="mt-3">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold shadow-sm ${
                    profile.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {profile.is_active ? "Aktiv" : "Inaktiv"}
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
                <p className="font-medium">{profile.ID}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <PhoneAndroid className="text-green-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  Handy
                </p>
                <p className="font-medium">{profile.Handynr || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Cake className="text-pink-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  Geburtstag
                </p>
                <p className="font-medium">
                  {new Date(profile.Geburtstag).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Home className="text-yellow-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  Adresse
                </p>
                <p className="font-medium">{profile.MusterAdresse || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Campaign className="text-purple-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  Aktive Kampagne
                </p>
                <p className="font-medium">
                  {profile.AktiveKampagne || "Keine"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShoppingCart className="text-indigo-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  Gesamt Gebucht
                </p>
                <p className="font-medium">{profile.GesamtStueckzahlGebucht}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Send className="text-red-400 mt-1" />
              <div>
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  Gesamt Abgeschickt
                </p>
                <p className="font-medium">
                  {profile.GesamtStueckzahlAbgeschickt}
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
                  {new Date(profile.ErstellungsDatum).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default CustomerProfile;
