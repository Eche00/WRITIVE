import React, { useEffect, useState } from "react";

function CustomerProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `https://716f-102-89-69-162.ngrok-free.app/${token}`,
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

    fetchProfile();
  }, [token]);

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>Failed to load profile.</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Customer Profile</h2>
      <ul className="space-y-2">
        <li>
          <strong>AutoID:</strong> {profile.AutoID}
        </li>
        <li>
          <strong>Email:</strong> {profile.EmailAdresse}
        </li>
        <li>
          <strong>Vorname:</strong> {profile.Vorname || "N/A"}
        </li>
        <li>
          <strong>Handynr:</strong> {profile.Handynr || "N/A"}
        </li>
        <li>
          <strong>Firma:</strong> {profile.Firma || "N/A"}
        </li>
        <li>
          <strong>KontaktName:</strong> {profile.KontaktName || "N/A"}
        </li>
        <li>
          <strong>Stückzahl Gebucht:</strong> {profile.GesamtStueckzahlGebucht}
        </li>
        <li>
          <strong>Stückzahl Abgeschickt:</strong>{" "}
          {profile.GesamtStueckzahlAbgeschickt}
        </li>
        <li>
          <strong>Erstellt am:</strong>{" "}
          {new Date(profile.ErstellungsDatum).toLocaleString()}
        </li>
        <li>
          <strong>Aktiv:</strong> {profile.is_active ? "Ja" : "Nein"}
        </li>
      </ul>
    </div>
  );
}

export default CustomerProfile;
