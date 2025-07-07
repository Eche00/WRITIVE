import React, { useState, useEffect } from "react";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const UpdateCustomerModal = ({ customer, setEditModal, fetchCustomers }) => {
  const [customerData, setCustomerData] = useState({
    KontaktName: "",
    Vorname: "",
    Firma: "",
    EmailAdresse: "",
    Handynr: "",
    Anrede: "",
    Geburtstag: "",
    MusterAdresse: "",
    UStIdNr: "",
    is_active: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (customer) {
      setCustomerData({
        KontaktName: customer.KontaktName || "",
        Vorname: customer.Vorname || "",
        Firma: customer.Firma || "",
        EmailAdresse: customer.EmailAdresse || "",
        Handynr: customer.Handynr || "",
        Anrede: customer.Anrede || "",
        Geburtstag: customer.Geburtstag ? customer.Geburtstag.slice(0, 10) : "",
        MusterAdresse: customer.MusterAdresse || "",
        UStIdNr: customer.UStIdNr || "",
        is_active: customer.is_active ?? true,
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/customers/${customer.AutoID}`, {
        method: "PUT",
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
        setEditModal(false);
      } else {
        setError(data.message || "Ein Fehler ist aufgetreten.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    }
  };

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 ">
      <section className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative h-fit overflow-scroll">
        <div className="w-full relative h-[280px] overflow-scroll">
          <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
            Kunde aktualisieren
          </h2>

          <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
            {Object.keys(customerData).map((key) =>
              key !== "is_active" ? (
                <div key={key}>
                  <label className="font-semibold block mb-1 capitalize">
                    {key}:
                  </label>
                  <input
                    type={key === "Geburtstag" ? "date" : "text"}
                    name={key}
                    value={customerData[key]}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded"
                  />
                </div>
              ) : (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={customerData.is_active}
                    onChange={handleChange}
                  />
                  <label className="font-semibold">Aktiv</label>
                </div>
              )
            )}
          </div>
        </div>
        <div className="flex gap-4 border-t border-gray-200 pt-6">
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
        {error && (
          <div className="text-red-600 mt-4 text-sm font-medium text-center">
            {error}
          </div>
        )}
      </section>
    </div>
  );
};

export default UpdateCustomerModal;
