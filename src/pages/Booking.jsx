import React, { useEffect, useState } from "react";
import { Add, Delete, Edit, Search, Visibility } from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [newBooking, setNewBooking] = useState({
    KundeID: "",
    Firmenname: "",
    Buchungswert: "",
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState({
    Firmenname: "",
    Buchungswert: "",
  });

  const [showBookingForm, setShowBookingForm] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/buchungshistorie/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setBookings(data.bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/buchungshistorie`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          KundeID: newBooking.KundeID,
          Firmenname: newBooking.Firmenname,
          Buchungswert: parseFloat(newBooking.Buchungswert),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowBookingForm(false);
        setNewBooking({ KundeID: "", Firmenname: "", Buchungswert: "" });
        fetchBookings(); // Refresh table
      } else {
        console.error("Booking creation error:", data);
      }
    } catch (err) {
      console.error("Booking creation failed:", err.message);
    }
  };

  const handleViewBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/buchungshistorie/${bookingId}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setBookingDetails(data);
        setShowBookingModal(true);
      } else {
        alert(data.error || "Unauthorized or booking not found");
      }
    } catch (err) {
      console.error("Fetch booking failed:", err.message);
    }
  };

  const handleUpdateBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/buchungshistorie/${id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          Firmenname: updatedBooking.Firmenname,
          Buchungswert: parseFloat(updatedBooking.Buchungswert),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        fetchBookings(); // refresh table
        setShowUpdateModal(false);
        setSelectedBooking(null);
      } else {
        console.error("Update failed:", data);
      }
    } catch (err) {
      console.error("Update error:", err.message);
    }
  };

  const deleteBooking = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/buchungshistorie/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#412666]">
          Buchungshistorie
        </h2>
        <div className="flex gap-2">
          {["csv", "xlsx", "pdf"].map((format) => (
            <button
              key={format}
              onClick={() =>
                window.open(
                  `${BASE_URL}/buchungshistorie/export?format=${format}`,
                  "_blank"
                )
              }
              className="px-3 py-1 border border-[#412666] rounded hover:bg-[#412666] hover:text-white transition-all">
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <section className="flex items-center justify-between">
        <div className="border border-[#412666] rounded-lg px-4 w-1/3 flex items-center gap-2 mb-4">
          <Search />
          <input
            type="text"
            placeholder="Suche Firmenname oder KundeID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border-none py-2 focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="bg-[#412666] text-white px-[24px] py-2 rounded-full hover:bg-[#341f4f] cursor-pointer">
          <Add /> Neue Buchung
        </button>
      </section>

      <table className="w-full text-sm text-left">
        <thead className="text-[#412666] border-b border-gray-200">
          <tr>
            <th className="py-2 px-3">ID</th>
            <th className="py-2 px-3">KundeID</th>
            <th className="py-2 px-3">Firmenname</th>
            <th className="py-2 px-3">Buchungswert (€)</th>
            <th className="py-2 px-3">Zeitstempel</th>
            <th className="py-2 px-3">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {bookings
            .filter(
              (b) =>
                (b.KundeID?.toLowerCase() || "").includes(
                  search.toLowerCase()
                ) ||
                (b.Firmenname?.toLowerCase() || "").includes(
                  search.toLowerCase()
                )
            )
            .map((b) => (
              <tr
                key={b.ID}
                className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-3">{b.ID}</td>
                <td className="py-2 px-3">{b.KundeID}</td>
                <td className="py-2 px-3">{b.Firmenname}</td>
                <td className="py-2 px-3">€ {b.Buchungswert}</td>
                <td className="py-2 px-3">
                  {new Date(b.Zeitstempel).toLocaleString("de-DE")}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleViewBooking(b.ID)}
                    className="relative group cursor-pointer ">
                    <Visibility />{" "}
                    <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                      Anzeigen
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBooking(b); // b is the booking row
                      setUpdatedBooking({
                        Firmenname: b.Firmenname,
                        Buchungswert: b.Buchungswert,
                      });
                      setShowUpdateModal(true);
                    }}
                    className="relative group cursor-pointer ">
                    <Edit fontSize="small" />
                    <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                      Bearbeiten
                    </span>
                  </button>
                  <button
                    onClick={() => deleteBooking(b.ID)}
                    className="relative group cursor-pointer ">
                    <Delete fontSize="small" />
                    <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                      Löschen
                    </span>
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {showBookingModal && bookingDetails && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Buchungsdetails
            </h2>

            <div className="space-y-3 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Buchung ID:</span>
                <span>{bookingDetails.ID}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde ID:</span>
                <span>{bookingDetails.KundeID}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Firmenname:</span>
                <span>{bookingDetails.Firmenname}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Buchungswert:</span>
                <span>{bookingDetails.Buchungswert}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zeitstempel:</span>
                <span>
                  {new Date(bookingDetails.Zeitstempel).toLocaleString("de-DE")}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowBookingModal(false);
                setBookingDetails(null);
              }}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Neue Buchung
            </h2>

            <div className="space-y-4 text-sm">
              <input
                type="text"
                placeholder="KundeID"
                value={newBooking.KundeID}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    KundeID: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Firmenname"
                value={newBooking.Firmenname}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    Firmenname: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Buchungswert"
                value={newBooking.Buchungswert}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    Buchungswert: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowBookingForm(false)}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={handleCreateBooking}
                className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
                Aktualisieren
              </button>
            </div>
          </div>
        </div>
      )}
      {showUpdateModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Buchung aktualisieren
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <label className="block font-medium">Firmenname:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={updatedBooking.Firmenname}
                  onChange={(e) =>
                    setUpdatedBooking((prev) => ({
                      ...prev,
                      Firmenname: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium">Buchungswert (€):</label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={updatedBooking.Buchungswert}
                  onChange={(e) =>
                    setUpdatedBooking((prev) => ({
                      ...prev,
                      Buchungswert: parseFloat(e.target.value),
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowUpdateModal(false)}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={() => handleUpdateBooking(selectedBooking.ID)}
                className="w-full bg-[#412666] text-white py-2 rounded-lg  transition cursor-pointer">
                Aktualisieren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
