import React, { useEffect, useState } from "react";
import { Add, Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import UserLoader from "../component/UserLoader";
import { BASE_URL } from "../lib/baseurl";
import { toast } from "react-hot-toast";

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [productions, setProductions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBuchungLogsModal, setShowBuchungLogsModal] = useState(false);
  const [buchungLogs, setBuchungLogs] = useState([]);
  const [selectedBuchungID, setSelectedBuchungID] = useState(null);
  const [showBuchungLogDetailModal, setShowBuchungLogDetailModal] =
    useState(false);
  const [buchungLogDetail, setBuchungLogDetail] = useState(null);
  const [logExportBuchungshistorieOpen, setLogExportBuchungshistorieOpen] =
    useState(false);
  const [newBooking, setNewBooking] = useState({
    Buchungstyp: "",
    Kategorie: "",
    Bezeichnung: "",
    CampaignID: "",
    ProduktionsID: "",
    Buchungswert: "",
    KundeID: "",
  });
  // Category-to-Bezeichnung mapping
  const bezeichnungOptions = {
    Briefmarken: [
      "0,70€",
      "0,85€",
      "1,10€",
      "1,00€",
      "0,95€",
      "1,60€",
      "ohne Frankierung",
      "1,80€",
    ],
    Format: [
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
    ],
    Karte: [
      "DIN-A6",
      "DIN-Lang",
      "Maxipostkarte",
      "Sonderformat",
      "US-DIN-Lang",
      "Umschlag C6",
      "Umschlag C5",
      "Umschlag C4",
      "A4-Briefpapier",
    ],
    Schrift: [
      "Coppenhagen",
      "Patricia/Amsterdam",
      "Anni/Paris",
      "Henrieta/Coppenhagen",
      "Vera/Koyoto",
      "Barbara/Berlin",
      "Dusan/Casablanca",
    ],
    Stift: [
      "Kugelschreiber blau",
      "Kugelschreiber schwarz",
      "Tintenroller blau",
      "Tintenroller schwarz",
      "Edding Gold",
      "Edding Weiß",
    ],
    Versandart: ["Paket Versand zum Kunden", "Dialogpost", "Briefkasten"],
  };
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatedBooking, setUpdatedBooking] = useState({
    Buchungstyp: "",
    Kategorie: "",
    Bezeichnung: "",
    Buchungswert: "",
  });
  const [openLogExportDropdown, setOpenLogExportDropdown] = useState(false);

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
  const fetchProductions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/production/?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setProductions(data?.productions || []);
    } catch (err) {
      console.error("Fetch production failed:", err);
    }
  };
  const fetchCustomers = async (query = "") => {
    try {
      const token = localStorage.getItem("token"); // or however you store the token
      const res = await fetch(`${BASE_URL}/customers/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // <-- this fixes it
        },
      });
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const fetchArticles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/products/?search=${search}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();

      // ✅ Correctly extract the articles array
      setArticles(data.articles);
      console.log("Fetched articles:", data.articles || []);
    } catch (err) {
      console.error("Error fetching articles:", err);
    }
  };
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/categories/?search=${search}`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/campaigns/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      let bodyData = {
        Buchungstyp: newBooking.Buchungstyp,
        CampaignID: newBooking.CampaignID,
        ProduktionsID: newBooking.ProduktionsID || null,
        KundeID: newBooking.KundeID,
      };

      if (newBooking.Kategorie) {
        bodyData.Kategorie = newBooking.Kategorie;
      }
      if (newBooking.Bezeichnung) {
        bodyData.Bezeichnung = newBooking.Bezeichnung;
      }

      if (newBooking.Buchungswert) {
        bodyData.Buchungswert = parseFloat(newBooking.Buchungswert);
      }

      const res = await fetch(`${BASE_URL}/buchungshistorie/`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Buchung erfolgreich erstellt.");
        setShowBookingForm(false);
        setNewBooking({
          Buchungstyp: "",
          Kategorie: "",
          Bezeichnung: "",
          CampaignID: "",
          ProduktionsID: "",
          Buchungswert: "",
          KundeID: "",
        });
        fetchBookings();
      } else {
        console.error("Buchung fehlgeschlagen:", data);
        toast.error("Fehler beim Erstellen der Buchung.");
      }
    } catch (err) {
      console.error("Buchungserstellung fehlgeschlagen:", err.message);
      toast.error("Serverfehler bei der Buchungserstellung.");
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
        // alert(data.error || "Unauthorized or booking not found");
        console.log(data.error || "Unauthorized or booking not found");
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
          Buchungstyp: updatedBooking.Buchungstyp,
          Kategorie: updatedBooking.Kategorie,
          Bezeichnung: updatedBooking.Bezeichnung,
          Buchungswert: parseFloat(updatedBooking.Buchungswert),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Buchung erfolgreich aktualisiert.");
        fetchBookings();
        setShowUpdateModal(false);
        setSelectedBooking(null);
      } else {
        console.error("Update failed:", data);
        toast.error(data.message || "Aktualisierung fehlgeschlagen.");
      }
    } catch (err) {
      console.error("Update error:", err.message);
      toast.error("Fehler beim Aktualisieren der Buchung.");
    }
  };

  const fetchBuchungshistorieLogs = async (buchungID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${BASE_URL}/buchungshistorie/${buchungID}/logs`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!res.ok)
        throw new Error("Fehler beim Laden der Buchungshistorie-Logs");

      const data = await res.json();
      setBuchungLogs(data);
      setSelectedBuchungID(buchungID);
      setShowBuchungLogsModal(true);
    } catch (err) {
      console.error(err);
      // alert("Logs konnten nicht geladen werden.");
    }
  };
  const fetchBuchungLogByID = async (logID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/buchungshistorie/logs/${logID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error); // Optional: handle any backend error messages
        return;
      }

      setBuchungLogDetail(data);
      setShowBuchungLogDetailModal(true);
    } catch (err) {
      console.error(err);
      // alert("Buchungslog konnte nicht geladen werden.");
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
      toast.success("Buchung erfolgreich gelöscht.");
      fetchBookings();
    } catch (err) {
      console.error("Error deleting booking:", err);
      toast.error("Fehler beim Löschen der Buchung.");
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchProductions();
    fetchCustomers();
    fetchArticles();
    fetchCategories();
    fetchCampaigns();
  }, []);

  const handleExport = async (format) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_URL}/buchungshistorie/export?format=${format}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download buchungshistorie file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `buchungshistorie.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      setLogExportBuchungshistorieOpen(false);
      toast.success(`Exported Buchungshistorie as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to export Buchungshistorie");
    }
  };

  const handleExportBuchungshistorieLogs = async (format) => {
    try {
      const token = localStorage.getItem("token");
      const query = new URLSearchParams({ format });
      if (selectedBuchungID) {
        query.append("production_id", selectedBuchungID);
      }

      const response = await fetch(
        `${BASE_URL}/buchungshistorie/logs/export?${query.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download logs file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedBuchungID}-logs.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        `Exported Buchungshistorie logs as ${format.toUpperCase()}`
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to export logs");
    }
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#412666]">
          Buchungshistorie
        </h2>
      </div>
      {loading ? (
        <section>
          <UserLoader />
        </section>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow border border-gray-100 w-fit xl:w-full flex flex-col gap-3">
          <div className="relative inline-block text-left">
            <button
              onClick={() =>
                setLogExportBuchungshistorieOpen(!logExportBuchungshistorieOpen)
              }
              className="border border-[#412666] px-4 py-2 rounded-lg text-sm text-[#412666] hover:bg-[#412666] hover:text-white transition-all duration-300">
              Buchungshistorie exportieren ▾
            </button>

            {logExportBuchungshistorieOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow z-50 p-2">
                {["csv", "xlsx", "pdf"].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white rounded-[10px] my-1 text-center transition-all">
                    {format.toUpperCase()} Exportieren
                  </button>
                ))}
              </div>
            )}
          </div>
          <section className="flex items-center justify-between">
            <div className="border border-[#412666] rounded-lg px-4 w-1/3 flex items-center gap-2 mb-4">
              <Search />
              <input
                type="text"
                placeholder="Suche  KundeID oder kampagneID..."
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

          <table className="w-full text-sm text-left text-nowrap">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Kampagne-ID</th>
                <th className="py-2 px-3">Kategorie</th>
                <th className="py-2 px-3">Buchungstyp</th>
                <th className="py-2 px-3">Buchungswert (€)</th>
                <th className="py-2 px-3">Produktions-ID</th>
                <th className="py-2 px-3">Bezeichnung</th>
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
                    (b.CampaignID?.toLowerCase() || "").includes(
                      search.toLowerCase()
                    ) ||
                    (b.Buchungstyp?.toLowerCase() || "").includes(
                      search.toLowerCase()
                    )
                )
                .map((b) => (
                  <tr
                    key={b.ID}
                    className={`
                      ${b.Buchungstyp == "Austrag" && "text-red-500"}  
                      ${
                        b.Buchungstyp == "vorgemerkt Austrag" && "text-gray-500"
                      }  
                      ${b.Buchungstyp == "Eintrag" && "text-green-700"}  
                    border-b border-gray-200 hover:bg-gray-50 font-bold`}>
                    <td className="py-2 px-3">{b.CampaignID || "—"}</td>
                    <td className="py-2 px-3">{b.Kategorie || "—"}</td>
                    <td className="py-2 px-3">{b.Buchungstyp || "—"}</td>
                    <td className="py-2 px-3"> {b.Buchungswert}</td>
                    <td className="py-2 px-3">{b.ProduktionsID || "—"}</td>
                    <td className="py-2 px-3">
                      {b.Bezeichnung?.slice(0, 30) || "—"}
                    </td>
                    <td className="py-2 px-3">
                      {b.Zeitstempel
                        ? new Date(b.Zeitstempel).toLocaleString("de-DE")
                        : "—"}
                    </td>
                    <td className="p-2 space-x-2">
                      <select
                        onChange={(e) => {
                          const action = e.target.value;
                          if (!action) return;

                          switch (action) {
                            case "view":
                              handleViewBooking(b.ID);
                              break;
                            case "edit":
                              setSelectedBooking(b);
                              setUpdatedBooking({
                                Bezeichnung: b.Bezeichnung,
                                Buchungswert: b.Buchungswert,
                              });
                              setShowUpdateModal(true);
                              break;
                            case "logs":
                              fetchBuchungshistorieLogs(b.ID);
                              setSelectedBuchungID(b.ID);
                              break;
                            case "delete":
                              deleteBooking(b.ID);
                              break;
                            default:
                              break;
                          }

                          e.target.selectedIndex = 0; // Reset selection
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-sm text-[#412666] bg-white cursor-pointer">
                        <option value="">Aktion wählen</option>
                        <option value="view">Anzeigen</option>
                        <option value="edit">Bearbeiten</option>
                        <option value="logs">Protokolle</option>
                        <option value="delete">Löschen</option>
                      </select>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </motion.div>
      )}
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
                <span>{bookingDetails.KundeID || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Artikel ID:</span>
                <span>{bookingDetails.CampaignID || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Bezeichnung:</span>
                <span>{bookingDetails.Bezeichnung || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kategorie:</span>
                <span>{bookingDetails.Kategorie || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Buchungstyp:</span>
                <span>{bookingDetails.Buchungstyp || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Produktions-ID:</span>
                <span>{bookingDetails.ProduktionsID || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Buchungswert:</span>
                <span>
                  €{" "}
                  {Number(bookingDetails.Buchungswert).toLocaleString("de-DE")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Bezeichnung:</span>
                <span>{bookingDetails.Bezeichnung || "—"}</span>
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

            <div className="space-y-4 text-sm text-gray-700">
              {/* KundeID Dropdown */}
              <select
                className="w-full border px-4 py-2 rounded"
                value={newBooking.KundeID}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    KundeID: e.target.value,
                  }))
                }>
                <option value="">— Kunde wählen —</option>
                {customers
                  .filter((c) => !c.ID?.toLowerCase().startsWith("admin"))
                  .map((c) => (
                    <option key={c.ID} value={c.ID}>
                      {c.ID} - {c.KontaktName}
                    </option>
                  ))}
              </select>

              {/* Campaigns Dropdown */}
              <select
                className="w-full border px-4 py-2 rounded"
                value={newBooking.CampaignID}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    CampaignID: e.target.value,
                  }))
                }>
                <option value="">— Kampagne wählen —</option>
                {campaigns
                  .filter((a) => a.id?.startsWith(newBooking.KundeID))
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.id} - {a.Artikelname}
                    </option>
                  ))}
              </select>

              {/* ProduktionsID Dropdown */}
              <select
                className="w-full border px-4 py-2 rounded"
                value={newBooking.ProduktionsID}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    ProduktionsID: e.target.value,
                  }))
                }>
                <option value="">— Produktion wählen —</option>
                {productions
                  .filter((p) => p.ID?.startsWith(newBooking.CampaignID))
                  .map((p) => (
                    <option key={p.ID} value={p.ID}>
                      {p.ID} - {p.Produktionsnummer}
                    </option>
                  ))}
              </select>
              {/* Buchungstyp */}
              <select
                value={newBooking.Buchungstyp}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    Buchungstyp: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded text-sm text-[#412666] bg-white cursor-pointer">
                <option value="">Buchungstyp wählen</option>
                <option value="Eintrag">Eintrag</option>
                <option value="Austrag">Austrag</option>
              </select>

              {/* Kategorie Dropdown */}
              <select
                value={newBooking.Kategorie}
                onChange={(e) => {
                  const selectedKategorie = e.target.value;
                  setNewBooking((prev) => ({
                    ...prev,
                    Kategorie: selectedKategorie,
                    Bezeichnung: "", // Reset Bezeichnung when category changes
                  }));
                }}
                className="w-full border px-4 py-2 rounded text-sm text-[#412666] bg-white cursor-pointer">
                <option value="">Kategorie wählen</option>
                {Object.keys(bezeichnungOptions).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Bezeichnung */}
              <select
                value={newBooking.Bezeichnung}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    Bezeichnung: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded text-sm text-[#412666] bg-white cursor-pointer">
                <option value="">Bezeichnung wählen</option>
                {(bezeichnungOptions[newBooking.Kategorie] || []).map(
                  (option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  )
                )}
              </select>

              {/* Buchungswert */}
              <input
                type="number"
                placeholder="Buchungswert"
                value={newBooking.Buchungswert}
                onChange={(e) =>
                  setNewBooking((prev) => ({
                    ...prev,
                    Buchungswert: Number(e.target.value),
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
                Erstellen
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
                <label className="block font-medium">Buchungstyp:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={updatedBooking.Buchungstyp}
                  onChange={(e) =>
                    setUpdatedBooking((prev) => ({
                      ...prev,
                      Buchungstyp: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block font-medium">Kategorie:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={updatedBooking.Kategorie}
                  onChange={(e) =>
                    setUpdatedBooking((prev) => ({
                      ...prev,
                      Kategorie: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block font-medium">Bezeichnung:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={updatedBooking.Bezeichnung}
                  onChange={(e) =>
                    setUpdatedBooking((prev) => ({
                      ...prev,
                      Bezeichnung: e.target.value,
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
                className="w-full bg-[#412666] text-white py-2 rounded-lg transition cursor-pointer">
                Aktualisieren
              </button>
            </div>
          </div>
        </div>
      )}

      {showBuchungLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Buchungshistorie-Logs (ID: {selectedBuchungID})
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto text-sm text-gray-700">
              {buchungLogs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Logs gefunden.
                </p>
              ) : (
                buchungLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-1 cursor-pointer"
                    onClick={() => fetchBuchungLogByID(log.id)}>
                    <div>
                      <strong>Aktion:</strong> {log.action}
                    </div>
                    <div>
                      <strong>Details:</strong> {log.details}
                    </div>
                    <div>
                      <strong>Entität:</strong> {log.entity}
                    </div>
                    <div>
                      <strong>Entitäts-ID:</strong> {log.entity_id}
                    </div>
                    <div>
                      <strong>Zeitstempel:</strong>{" "}
                      {new Date(log.timestamp).toLocaleString("de-DE")}
                    </div>
                    <div>
                      <strong>IP-Adresse:</strong> {log.ip_address || "—"}
                    </div>
                    <div>
                      <strong>Kunde-ID:</strong> {log.kunde_id ?? "—"}
                    </div>
                    <div>
                      <strong>User-Agent:</strong> {log.user_agent || "—"}
                    </div>
                    <div>
                      <strong>User ID:</strong> {log.user_id}
                    </div>
                  </div>
                ))
              )}
              {buchungLogs.length >= 1 && (
                <div className="relative inline-block text-left">
                  <button
                    onClick={() =>
                      setOpenLogExportDropdown(!openLogExportDropdown)
                    }
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm text-[#412666] hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere Logs ▾
                  </button>

                  {openLogExportDropdown && (
                    <div className="absolute left-0 top-[-150px] mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow z-50 p-2">
                      {["csv", "xlsx", "pdf"].map((format) => (
                        <button
                          key={format}
                          onClick={() => {
                            handleExportBuchungshistorieLogs(format);
                            setOpenLogExportDropdown(false); // Close dropdown
                          }}
                          className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                          Exportiere {format.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowBuchungLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showBuchungLogDetailModal && buchungLogDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Buchungs-Log Detail (ID: {buchungLogDetail.id})
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Aktion:</span>
                <span>{buchungLogDetail.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Details:</span>
                <span>{buchungLogDetail.details}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entität:</span>
                <span>{buchungLogDetail.entity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entitäts-ID:</span>
                <span>{buchungLogDetail.entity_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde-ID:</span>
                <span>{buchungLogDetail.kunde_id ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">IP-Adresse:</span>
                <span>{buchungLogDetail.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User-Agent:</span>
                <span className="break-words max-w-[60%]">
                  {buchungLogDetail.user_agent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User ID:</span>
                <span>{buchungLogDetail.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zeitstempel:</span>
                <span>
                  {new Date(buchungLogDetail.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowBuchungLogDetailModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Booking;
