import React, { useState, useEffect } from "react";
import { BASE_URL } from "../lib/baseurl";
import { toast } from "react-hot-toast";

const CreateArticleModal = ({ showModal, setShowModal, onCreated }) => {
  const [formData, setFormData] = useState({
    BrandID: "",
    KampagneID: "",
    Artikelname: "",
    Text: "",
    Variablen: "",
    Versandart: "",
    Frankierung: "",
    Stift: "",
    Schrift: "",
    Format: "",
    ZusatzInfos: "",
    Sonstige_Infos: "",
    StueckzahlProMonat: "",
    MusterkarteDesign: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [brands, setBrands] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/brands/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/campaigns/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchCampaigns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "StueckzahlProMonat" ? value.replace(/\D/g, "") : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("No token found. Please log in.");
      toast.error("Kein Token gefunden. Bitte einloggen.");
      setLoading(false);
      return;
    }

    const requiredFields = Object.keys(formData).filter(
      (key) =>
        key !== "ZusatzInfos" &&
        key !== "Sonstige_Infos" &&
        key !== "MusterkarteDesign"
    );

    for (let key of requiredFields) {
      if (!formData[key]) {
        setMessage(`Field "${key}" cannot be empty.`);
        toast.error(`Feld "${key}" darf nicht leer sein.`);
        setLoading(false);
        return;
      }
    }

    const payload = {
      ...formData,
      StueckzahlProMonat: Number(formData.StueckzahlProMonat),
    };

    try {
      const res = await fetch(`${BASE_URL}/products/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Artikel erfolgreich erstellt.");
        toast.success(data.message || "Artikel erfolgreich erstellt.");
        onCreated?.(data.artikel);
        setFormData({
          BrandID: "",
          KampagneID: "",
          Artikelname: "",
          Text: "",
          Variablen: "",
          Versandart: "",
          Frankierung: "",
          Stift: "",
          Schrift: "",
          Format: "",
          ZusatzInfos: "",
          Sonstige_Infos: "",
          StueckzahlProMonat: "",
          MusterkarteDesign: "",
        });
        setUploading(false);
        setUploadMessage("");
        setTimeout(() => setShowModal(false), 1500);
      } else {
        setMessage(data.message || "Fehler beim Erstellen des Artikels.");
        toast.error(data.message || "Fehler beim Erstellen des Artikels.");
      }
    } catch (err) {
      console.error("Netzwerkfehler:", err);
      setMessage("Serverfehler. Bitte erneut versuchen.");
      toast.error("Serverfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };
  // Sync Format with selected campaign
  useEffect(() => {
    if (!formData.KampagneID) return;
    const selected = campaigns.find(
      (c) => String(c.id) === String(formData.KampagneID)
    );
    if (selected) {
      console.log("Selected campaign details:", selected);
      setSelectedCampaign(selected);
      setFormData((prev) => ({
        ...prev,
        Format: selected.Format || "", // auto-fill Format
      }));
    }
  }, [formData.KampagneID, campaigns]);

  if (!showModal) return null;

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    setUploading(true);
    setUploadMessage("");

    try {
      const res = await fetch(`${BASE_URL}/products/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: formDataUpload,
      });

      const data = await res.json();

      if (res.ok) {
        setFormData((prev) => ({
          ...prev,
          MusterkarteDesign: data.filename,
        }));
        setUploadMessage(data.message || "Upload erfolgreich.");
        toast.success(data.message || "Upload erfolgreich.");
      } else {
        setUploadMessage(data.message || "Fehler beim Hochladen.");
        toast.error(data.message || "Fehler beim Hochladen.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadMessage("Fehler beim Upload.");
      toast.error("Fehler beim Upload.");
    } finally {
      setUploading(false);
    }
  };

  const FORMAT_OPTIONS = [
    "DIN A6 KARTE",
    "DIN A6 POSTKARTE",
    "DIN LANG KARTE",
    "DIN LANG POSTKARTE",
    "MAXI POSTKARTE",
    "DIN A6 KARTE +KUVERT",
    "DIN LANG KARTE +KUVERT",
    "C6 KUVERT",
    "DIN LANG KUVERT",
    "DIN A4 BRIEF",
    "DIN A4 BRIEF +KUVERT",
  ];

  const VERSANDART_OPTIONS = [
    "Paket Versand zum Kunden",
    "Dialogpost",
    "Briefkasten",
  ];

  const STIFT_OPTIONS = [
    "Kugelschreiber blau",
    "Kugelschreiber schwarz",
    "Tintenroller blau",
    "Tintenroller schwarz",
    "Edding Gold",
    "Edding Weiß",
  ];

  const SCHRIFT_OPTIONS = [
    "Coppenhagen",
    "Patricia/Amsterdam",
    "Anni/Paris",
    "Henrieta/Coppenhagen",
    "Vera/Koyoto",
    "Barbara/Berlin",
    "Dusan/Casablanca",
  ];

  const FRANKIERUNG_OPTIONS = [
    "0,70€",
    "0,85€",
    "1,10€",
    "1,00€",
    "0,95€",
    "1,60€",
    "ohne Frankierung",
    "1,80€",
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
          Create Article
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-black">
          {/* Brand */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">BrandID</label>
            <select
              name="BrandID"
              value={formData.BrandID}
              onChange={handleChange}
              className="border rounded px-2 py-1">
              <option value="">Select brand</option>
              {brands.map((b) => (
                <option key={b.ID} value={b.ID}>
                  {b.ID} - {b.Brandname}
                </option>
              ))}
            </select>
          </div>

          {/* Campaign */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">KampagneID</label>
            <select
              name="KampagneID"
              value={formData.KampagneID}
              onChange={handleChange}
              className="border rounded px-2 py-1">
              <option value="">Select campaign</option>
              {campaigns
                .filter((c) => c.id.startsWith(formData.BrandID))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Artikelname */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Artikelname</label>
            <input
              name="Artikelname"
              value={formData.Artikelname}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          </div>

          {/* Variablen */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Variablen</label>
            <input
              name="Variablen"
              value={formData.Variablen}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          </div>

          {/* Versandart */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Versandart</label>
            <select
              name="Versandart"
              value={formData.Versandart}
              onChange={handleChange}
              className="border rounded px-2 py-1">
              <option value="">Select Versandart</option>
              {VERSANDART_OPTIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Frankierung */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Frankierung</label>
            <select
              name="Frankierung"
              value={formData.Frankierung}
              onChange={handleChange}
              className="border rounded px-2 py-1">
              <option value="">Select Frankierung</option>
              {FRANKIERUNG_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Stift */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Stift</label>
            <select
              name="Stift"
              value={formData.Stift}
              onChange={handleChange}
              className="border rounded px-2 py-1">
              <option value="">Select Stift</option>
              {STIFT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Schrift */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Schrift</label>
            <select
              name="Schrift"
              value={formData.Schrift}
              onChange={handleChange}
              className="border rounded px-2 py-1">
              <option value="">Select Schrift</option>
              {SCHRIFT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Format</label>
            <input
              type="text"
              name="Format"
              value={formData.Format}
              className="border rounded px-2 py-1"
              readOnly
            />
          </div>

          {/* ZusatzInfos */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">ZusatzInfos</label>
            <input
              name="ZusatzInfos"
              value={formData.ZusatzInfos}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          </div>

          {/* Sonstige_Infos */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Sonstige_Infos</label>
            <input
              name="Sonstige_Infos"
              value={formData.Sonstige_Infos}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          </div>

          {/* Stückzahl */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">StueckzahlProMonat</label>
            <input
              name="StueckzahlProMonat"
              value={formData.StueckzahlProMonat}
              onChange={handleChange}
              type="number"
              className="border rounded px-2 py-1"
            />
          </div>

          {/* MusterkarteDesign */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">
              MusterkarteDesign (PDF upload)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="border rounded px-2 py-1"
            />
            {uploading && (
              <p className="text-xs text-gray-500 mt-1">Hochladen...</p>
            )}
            {uploadMessage && (
              <p className="text-xs text-green-600 mt-1">{uploadMessage}</p>
            )}
            {formData.MusterkarteDesign && (
              <p className="text-xs text-gray-700 mt-1">
                Gespeichert als: <strong>{formData.MusterkarteDesign}</strong>
              </p>
            )}
          </div>
        </div>
        {/* Text */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Text</label>
          <textarea
            name="Text"
            value={formData.Text}
            onChange={handleChange}
            className="border rounded px-2 py-1"
          />
        </div>

        {message && (
          <p className="text-center mt-4 text-sm font-medium text-gray-600">
            {message}
          </p>
        )}

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            Abbrechen
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
            {loading ? "Wird erstellt..." : "Erstellen"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateArticleModal;
