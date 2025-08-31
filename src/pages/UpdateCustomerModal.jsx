import React, { useState, useEffect } from "react";
import { BASE_URL } from "../lib/baseurl";
import { toast } from "react-hot-toast";

const UpdateCustomerModal = ({ customer, setEditModal, fetchCustomers }) => {
  const [customerData, setCustomerData] = useState({
    KontaktName: "",
    Firma: "",
    EmailAdresse: "",
    Handynr: "",
    Anrede: "",
    MusterAdresse: "",
    GesamtStueckzahlAbgeschickt: 0,
    GesamtStueckzahlGebucht: 0,
    is_active: true,
  });

  const [error, setError] = useState(null);
  // DISPLAY DETAILS CUSTOMER TO UPDATE
  useEffect(() => {
    if (customer) {
      setCustomerData({
        KontaktName: customer.KontaktName || "",
        Firma: customer.Firma || "",
        EmailAdresse: customer.EmailAdresse || "",
        Handynr: customer.Handynr || "",
        Anrede: customer.Anrede || "",
        MusterAdresse: customer.MusterAdresse || "",
        GesamtStueckzahlAbgeschickt: customer.GesamtStueckzahlAbgeschickt || 0,
        GesamtStueckzahlGebucht: customer.GesamtStueckzahlGebucht || 0,
        is_active: customer.is_active ?? true,
      });
    }
  }, [customer]);

  // HANDLING CHANGING OF THE CUSTOMER DETAILS
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "is_active") return;

    setCustomerData((prev) => ({
      ...prev,
      [name]: name.includes("GesamtStueckzahl") ? parseInt(value) || 0 : value,
    }));
  };

  // HANDLING THE SUBMISSION OF UPDATED INFO
  const handleSubmit = async () => {
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/customers/${customer.ID}`, {
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
        toast.success("Kundendaten erfolgreich aktualisiert!");
      } else {
        setError(data.message || "Ein Fehler ist aufgetreten.");
        toast.error(data.message || "Aktualisierung fehlgeschlagen.");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setError("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
      toast.error("Ein Fehler ist aufgetreten. Bitte versuche es erneut.");
    }
  };

  if (!customer) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 ">
      <section className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative h-fit overflow-scroll">
        <div className="w-full relative h-[280px] overflow-scroll pb-7">
          <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
            Kunde aktualisieren
          </h2>

          <div className="grid grid-cols-1 gap-4 text-sm text-gray-700">
            {Object.keys(customerData).map((key) => {
              if (key === "is_active") {
                return (
                  <input
                    key={key}
                    type="hidden"
                    name="is_active"
                    value={customerData.is_active}
                  />
                );
              }

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
                      type={
                        key === "GesamtStueckzahlAbgeschickt" ||
                        key === "GesamtStueckzahlGebucht"
                          ? "number"
                          : "text"
                      }
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
