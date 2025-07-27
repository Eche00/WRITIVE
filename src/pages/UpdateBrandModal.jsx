import React, { useState, useEffect } from "react";
import { BASE_URL } from "../lib/baseurl";
import { toast } from "react-hot-toast";

const UpdateBrandModal = ({ brand, setEditModal, fetchBrands }) => {
  const [brandData, setBrandData] = useState({
    Brandname: "",
    BuchungsKontingent: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brand) {
      setBrandData({
        Brandname: brand.Brandname || "",
        BuchungsKontingent: brand.BuchungsKontingent || 0,
      });
    }
  }, [brand]);

  // HANDLING CHANGING OF THE CUSTOMER DETAILS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrandData((prev) => ({ ...prev, [name]: value }));
  };

  // HANDLING THE SUBMISSION OF UPDATED INFO
  const handleSubmit = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/brands/${brand.ID}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(brandData),
      });

      const data = await res.json();

      if (res.status === 200) {
        fetchBrands();
        setEditModal(false);
        toast.success("Marke erfolgreich aktualisiert!");
      } else {
        setError(data.error);
        toast.error(data.error || "Aktualisierung fehlgeschlagen.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      toast.error("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    }
  };

  if (!brand) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative">
        <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
          Marke aktualisieren
        </h2>

        <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
          <div>
            <label className="font-semibold block mb-1">Markenname:</label>
            <input
              type="text"
              name="Brandname"
              value={brandData.Brandname}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="font-semibold block mb-1">
              Buchungskontingent:
            </label>
            <input
              type="number"
              name="BuchungsKontingent"
              value={brandData.BuchungsKontingent}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
            />
          </div>
        </div>

        {error && (
          <div className="text-red-600 mt-4 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => setEditModal(false)}
            className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            Abbrechen
          </button>
          <button
            onClick={handleSubmit}
            className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
            Aktualisieren
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateBrandModal;
