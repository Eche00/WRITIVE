import React, { useState } from "react";

const BASE_URL = "https://40fe56c82e49.ngrok-free.app";

const CreateCustomerModal = ({ setCreateModal, fetchCustomers }) => {
  const [loading, setLoading] = useState(false);

  const [customerData, setCustomerData] = useState({
    KontaktName: "",
    Firma: "",
    EmailAdresse: "",
    Handynr: "",
    Anrede: "",
    Geburtstag: "",
    MusterAdresse: "",
    is_active: true, // always true
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "is_active") return;

    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/customers/new`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(customerData),
      });

      const data = await res.json();

      if (res.ok) {
        fetchCustomers();
        setCreateModal(false);
      } else {
        if (data.message === "Email bereits vorhanden.") {
          setError("Diese E-Mail-Adresse existiert bereits.");
        } else {
          setError(data.message || "Ein Fehler ist aufgetreten.");
        }
      }
    } catch (err) {
      console.error("Create failed:", err);
      setError("Ein Serverfehler ist aufgetreten. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <section className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative h-fit overflow-scroll">
        <div className="w-full relative h-[280px] overflow-scroll">
          <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
            Neuen Kunden erstellen
          </h2>

          <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
            {Object.keys(customerData).map((key) => {
              if (key === "is_active") return null;

              return (
                <div key={key}>
                  <label className="font-semibold block mb-1 capitalize">
                    {key}:
                  </label>

                  {key === "Anrede" ? (
                    <select
                      name="Anrede"
                      value={customerData.Anrede}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded">
                      <option value="" disabled hidden>
                        -- auswählen --
                      </option>
                      <option value="Frau">Frau</option>
                      <option value="Herr">Herr</option>
                    </select>
                  ) : (
                    <input
                      type={key === "Geburtstag" ? "date" : "text"}
                      name={key}
                      value={customerData[key]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-4 border-t border-gray-200 pt-6">
          <button
            onClick={() => setCreateModal(false)}
            className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
            Abbrechen
          </button>
          <button
            disabled={loading}
            onClick={handleSubmit}
            className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
            {loading ? "Lädt..." : "Erstellen"}
          </button>
        </div>

        {error && (
          <div className="text-red-600 mt-4 text-sm font-medium text-center">
            {error}
          </div>
        )}
      </section>
    </div>
  );
};

export default CreateCustomerModal;
