import React, { useState } from "react";

const BASE_URL = "https://6902-102-89-68-78.ngrok-free.app";

// Replace this with your real category list or fetch from API
const VALID_CATEGORIES = [
  { id: 1, name: "Postkarten" },
  { id: 2, name: "Geburtstagskarten" },
  { id: 3, name: "Weihnachtskarten" },
];

const CreateArticleModal = ({ showModal, setShowModal, onCreated }) => {
  const [formData, setFormData] = useState({
    BrandID: "B011",
    Artikelname: "",
    Text: "",
    Variablen: "",
    MusterkarteDesign: "",
    Versandart: "",
    Frankierung: "",
    Stift: "",
    Schrift: "",
    Format: "",
    ZusatzInfos: "",
    StueckzahlProMonat: "",
    ArtikelBezeichnungName: "",
    ArtikelKategorieID: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      setLoading(false);
      return;
    }

    // Validation
    for (let key in formData) {
      if (formData[key] === "") {
        setMessage(`Field "${key}" cannot be empty.`);
        setLoading(false);
        return;
      }
    }

    const categoryId = Number(formData.ArtikelKategorieID);
    const validCategory = VALID_CATEGORIES.find((cat) => cat.id === categoryId);
    if (!validCategory) {
      setMessage("Invalid category selected.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      ArtikelKategorieID: categoryId,
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
        setMessage(data.message || "Article created successfully.");
        onCreated?.(data.artikel);
        setTimeout(() => setShowModal(false), 1500);
      } else {
        console.error("Error response:", res.status, data);
        setMessage(data.message || "Error while creating article.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
          Create Article
        </h2>

        <div className="grid grid-cols-2 gap-4 text-sm text-black">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="mb-1 font-medium">{key}</label>

              {key === "ArtikelKategorieID" ? (
                <select
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="border rounded px-2 py-1">
                  <option value="">Select category</option>
                  {VALID_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  name={key}
                  value={value}
                  onChange={handleChange}
                  type={key === "StueckzahlProMonat" ? "number" : "text"}
                  className="border rounded px-2 py-1"
                  placeholder={key}
                />
              )}
            </div>
          ))}
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
            {loading ? "Aktualisiere..." : "Aktualisieren"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateArticleModal;
