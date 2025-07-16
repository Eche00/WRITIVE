import React, { useState, useEffect } from "react";

const BASE_URL = "https://cb49a05985a8.ngrok-free.app";

const CreateArticleModal = ({ showModal, setShowModal, onCreated }) => {
  const [formData, setFormData] = useState({
    BrandID: "",
    KampagneID: "",
    Artikelname: "",
    Text: "",
    StueckzahlProMonat: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [brands, setBrands] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

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
      setLoading(false);
      return;
    }

    for (let key in formData) {
      if (!formData[key]) {
        setMessage(`Field "${key}" cannot be empty.`);
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
        onCreated?.(data.artikel);
        setTimeout(() => setShowModal(false), 1500);
      } else {
        setMessage(data.message || "Fehler beim Erstellen des Artikels.");
      }
    } catch (err) {
      console.error("Netzwerkfehler:", err);
      setMessage("Serverfehler. Bitte erneut versuchen.");
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-black">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key} className="flex flex-col">
              <label className="mb-1 font-medium">{key}</label>
              {key === "BrandID" ? (
                <select
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="border rounded px-2 py-1">
                  <option value="">Select brand</option>
                  {brands.map((brand) => (
                    <option key={brand.ID} value={brand.ID}>
                      {brand.ID} - {brand.Brandname}
                    </option>
                  ))}
                </select>
              ) : key === "KampagneID" ? (
                <select
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="border rounded px-2 py-1">
                  <option value="">Select campaign</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} - {c.name}
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
            {loading ? "Wird erstellt..." : "Erstellen"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateArticleModal;
