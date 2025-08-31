import React, { useState, useEffect } from "react";
import { BASE_URL } from "../lib/baseurl";
import { toast } from "react-hot-toast";

const EditArticleModal = ({
  fetchArticles,
  showModal,
  setShowModal,
  artikel,
  onUpdated,
}) => {
  const [formData, setFormData] = useState({
    BrandID: "",
    KampaignID: "",
    Artikelname: "",
    Text: "",
    Variablen: "",
    Versandart: "",
    Frankierung: "",
    Stift: "",
    Schrift: "",
    Format: "",
    ZusatzInfos: "",
    StueckzahlProMonat: "",
    MusterkarteDesign: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  useEffect(() => {
    console.log("Artikel data:", artikel);

    if (artikel) {
      const {
        BrandID,
        KampaignID,
        Artikelname,
        Text,
        Variablen,
        Versandart,
        Frankierung,
        Stift,
        Schrift,
        Format,
        ZusatzInfos,
        StueckzahlProMonat,
        MusterkarteDesign,
      } = artikel;

      setFormData({
        BrandID: BrandID || "",
        KampaignID: KampaignID || "-",
        Artikelname: Artikelname || "",
        Text: Text || "",
        Variablen: Variablen || "-",
        Versandart: Versandart || "-",
        Frankierung: Frankierung || "-",
        Stift: Stift || "",
        Schrift: Schrift || "",
        Format: Format || "",
        ZusatzInfos: ZusatzInfos || "",
        StueckzahlProMonat: StueckzahlProMonat?.toString() || "",
        MusterkarteDesign: MusterkarteDesign || "",
      });
    }
  }, [artikel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "StueckzahlProMonat" ? value.replace(/\D/g, "") : value,
    }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("No token found. Please log in.");
      toast.error("Kein Token gefunden. Bitte einloggen.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      StueckzahlProMonat: Number(formData.StueckzahlProMonat),
    };

    try {
      const res = await fetch(`${BASE_URL}/products/${artikel.ID}/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Artikel erfolgreich aktualisiert.");
        toast.success(data.message || "Artikel erfolgreich aktualisiert.");
        onUpdated?.(data.artikel);
        fetchArticles?.();
        setTimeout(() => setShowModal(false), 1500);
      } else {
        console.error("Error response:", res.status, data);
        setMessage(data.message || "Fehler beim Aktualisieren des Artikels.");
        toast.error(data.message || "Fehler beim Aktualisieren des Artikels.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("Serverfehler. Bitte erneut versuchen.");
      toast.error("Serverfehler. Bitte erneut versuchen.");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal || !artikel) return null;
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
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
          Edit Article
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-black">
          {/* BrandID */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">BrandID</label>
            <input
              name="BrandID"
              value={formData.BrandID}
              disabled
              className="border rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* KampaignID */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">KampaignID</label>
            <input
              name="KampaignID"
              value={formData.KampaignID}
              disabled
              className="border rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Use dropdowns and inputs similar to Create Page */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Artikelname</label>
            <input
              name="Artikelname"
              value={formData.Artikelname}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Variablen</label>
            <input
              name="Variablen"
              value={formData.Variablen}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Versandart</label>
            <select
              name="Versandart"
              value={formData.Versandart}
              onChange={handleChange}
              className="border rounded px-2 py-1">
              <option value="">Select Versandart</option>
              {VERSANDART_OPTIONS?.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

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

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Format</label>
            <select
              name="Format"
              value={formData.Format}
              onChange={handleChange}
              className="border rounded px-2 py-1">
              <option value="">Select Format</option>
              {FORMAT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">ZusatzInfos</label>
            <input
              name="ZusatzInfos"
              value={formData.ZusatzInfos}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            />
          </div>

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

          {/* MusterkarteDesign Upload */}
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
            onClick={handleUpdate}
            className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
            {loading ? "Aktualisiere..." : "Aktualisieren"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditArticleModal;
