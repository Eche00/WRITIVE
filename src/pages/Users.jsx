import {
  Archive,
  BarChart,
  Delete,
  Edit,
  History,
  ListAlt,
  Search,
  Summarize,
  Unarchive,
  Visibility,
} from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import UserLoader from "../component/UserLoader";
import UpdateCustomerModal from "./UpdateCustomerModal";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const Users = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    AutoID: "",
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

  // user visibility
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // user summary
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [customerSummary, setCustomerSummary] = useState(null);

  // user logs
  const [logs, setLogs] = useState([]);
  const [showLogsModal, setShowLogsModal] = useState(false);

  // user history
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [statusHistory, setStatusHistory] = useState([]);

  // show archived
  const [showingArchived, setShowingArchived] = useState(false);
  const [hideArchived, setHideArchived] = useState(false);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedCustomerID, setSelectedCustomerID] = useState(null);
  const [showLogDetailModal, setShowLogDetailModal] = useState(false);
  const [auditLogDetail, setAuditLogDetail] = useState(null);

  const fetchCustomers = async (query = "") => {
    setLoading(true);
    setShowingArchived(false);

    try {
      const token = localStorage.getItem("token"); // or however you store the token
      const res = await fetch(
        `${BASE_URL}/customers/?status=active&search=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true", // <-- this fixes it
          },
        }
      );
      const data = await res.json();
      setCustomers(data.customers || []);
      setFiltered(data.customers || []);
      console.log("hello");
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };
  // fetch archived users
  const fetchArchivedCustomers = async () => {
    setHideArchived(false);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/customers/archived`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();

      // ✅ Add `is_archived: true` flag locally
      const archivedWithFlag = (data.archived_customers || []).map((c) => ({
        ...c,
        is_archived: true,
      }));

      setCustomers(archivedWithFlag);
      setFiltered(archivedWithFlag);
      setShowingArchived(true);
    } catch (err) {
      console.error("Error fetching archived customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [hideArchived]);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFiltered(
        customers.filter(
          (c) =>
            (c.EmailAdresse && c.EmailAdresse.toLowerCase().includes(q)) ||
            (c.KontaktName && c.KontaktName.toLowerCase().includes(q)) ||
            (c.AutoID && c.AutoID.toLowerCase().includes(q)) ||
            (c.Firma && c.Firma.toLowerCase().includes(q))
        )
      );
    } else {
      setFiltered(customers);
    }
  }, [search, customers]);

  const createCustomer = async () => {
    try {
      const res = await fetch(`${BASE_URL}/customers/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });
      const data = await res.json();
      fetchCustomers();
    } catch (err) {
      console.error("Create failed:", err);
    }
  };

  // fetching customer details
  const fetchCustomerDetails = async (id) => {
    try {
      const token = localStorage.getItem("token"); // retrieve saved token
      const res = await fetch(`${BASE_URL}/customers/${id}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setSelectedCustomer(data);
      setShowModal(true);
    } catch (err) {
      console.error("Detail fetch failed:", err);
    }
  };

  // handling archiving user
  const handleArchive = async (id) => {
    try {
      const token = localStorage.getItem("token"); // retrieve saved token
      await fetch(`${BASE_URL}/customers/${id}/archive`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  // handling restore
  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/customers/${id}/restore`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  // handling customer summary
  const fetchCustomerSummary = async (id) => {
    try {
      const token = localStorage.getItem("token"); // retrieve saved token
      const res = await fetch(`${BASE_URL}/customers/${id}/summary`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setCustomerSummary(data);
      setShowSummaryModal(true);
    } catch (err) {
      console.error("Summary fetch failed:", err);
    }
  };

  // handling user logs
  const fetchCustomerLogs = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/customers/${id}/logs`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setLogs(data);
      setShowLogsModal(true);
      console.log(data);
    } catch (err) {
      console.error("Log fetch failed:", err);
    }
  };

  // handling history
  // const fetchStatusHistory = async (id) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await fetch(`${BASE_URL}/customers/${id}/status-history`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //         "ngrok-skip-browser-warning": "true",
  //       },
  //     });
  //     const data = await res.json();
  //     setStatusHistory(data); // store history data
  //     setShowHistoryModal(true); // open modal
  //     console.log("Status History:", data);
  //   } catch (err) {
  //     console.error("Status History fetch failed:", err);
  //   }
  // };

  // handling user delete
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BASE_URL}/customers/${id}/permanent_delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      fetchCustomers();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAuditLogs = async (customerID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/customers/${customerID}/logs`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error("Fehler beim Laden der Logs");

      const data = await res.json();
      setAuditLogs(data);
      setSelectedCustomerID(customerID);
      setShowAuditLogsModal(true);
    } catch (err) {
      console.error(err);
    }
  };
  const fetchAuditLogByID = async (logID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/customers/logs/${logID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error("Fehler beim Abrufen des Log-Eintrags");

      const data = await res.json();
      setAuditLogDetail(data);
      setShowLogDetailModal(true);
    } catch (err) {
      console.error(err);
      // alert("Audit-Log konnte nicht geladen werden.");
    }
  };

  const handleExport = (format) => {
    window.open(`${BASE_URL}/customers/export/${format}`, "_blank");
  };

  const exportCustomerLogs = (format, kundeId = null) => {
    const query = new URLSearchParams({ format });
    if (kundeId) query.append("kunde_id", kundeId);

    window.open(
      `${BASE_URL}/customers/logs/export?${query.toString()}`,
      "_blank"
    );
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <h1 className="text-2xl font-bold mb-4 capitalize"> Nutzerseite</h1>

      {loading ? (
        <section>
          <UserLoader />
        </section>
      ) : (
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#412666] mb-4">
              Nutzer
            </h2>

            <div className="flex items-center gap-[10px] text-white text-[12px]">
              <button
                onClick={() => setHideArchived(true)}
                disabled={!showingArchived}
                className={`py-[6px] px-[16px] ${
                  !showingArchived
                    ? "bg-[#412666]"
                    : " border border-[#412666] text-[#412666]"
                } rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300`}>
                Aktiv Nutzer
              </button>
              <button
                onClick={fetchArchivedCustomers}
                disabled={showingArchived}
                className={`py-[6px] px-[16px] ${
                  showingArchived
                    ? "bg-[#412666]"
                    : " border border-[#412666] text-[#412666]"
                } rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300`}>
                Archiviert
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="border border-[#412666] rounded-lg px-4  w-1/3 focus:outline-none flex items-center gap-[10px]">
              <Search />
              <input
                type="text"
                placeholder="Suche nach Name, E-Mail, Firma oder ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className=" border-none focus:outline-none py-2 flex-1"
              />
            </div>
            <div className="flex gap-2">
              {["csv", "xls", "pdf"].map((format) => (
                <button
                  key={format}
                  onClick={() => handleExport(format)}
                  className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                  {format.toUpperCase()} Exportieren
                </button>
              ))}
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">AutoID</th>
                <th className="py-2 px-3">KontaktName</th>
                <th className="py-2 px-3">EmailAdresse</th>
                <th className="py-2 px-3">Firma</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.AutoID}
                  className="border-b hover:bg-gray-50 transition border-gray-200">
                  <td className="py-2 px-3">{c.AutoID}</td>
                  <td className="py-2 px-3">{c.KontaktName || "-"}</td>
                  <td className="py-2 px-3">{c.EmailAdresse}</td>
                  <td className="py-2 px-3">{c.Firma || "-"}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                        c.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}>
                      <span className="w-2 h-2 bg-current rounded-full"></span>
                      {c.is_active ? "abgeschlossen" : "inaktiv"}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center space-x-2">
                    <button
                      onClick={() => fetchCustomerDetails(c.AutoID)}
                      className="relative group cursor-pointer  text-[#4A90E2]">
                      <Visibility />{" "}
                      <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Anzeigen
                      </span>
                    </button>
                    {!c.is_archived && (
                      <button
                        onClick={() => {
                          setSelectedCustomer(c);
                          setEditModal(true);
                        }}
                        className="relative group cursor-pointer text-blue-700">
                        <Edit fontSize="small" />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Bearbeiten
                        </span>
                      </button>
                    )}
                    {!c.is_archived && (
                      <button
                        onClick={() => handleArchive(c.AutoID)}
                        className="relative group cursor-pointer text-[#9B9B9B]">
                        <Archive />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden ">
                          Archivieren
                        </span>
                      </button>
                    )}
                    {c.is_archived && (
                      <button
                        onClick={() => handleRestore(c.AutoID)}
                        className="relative group cursor-pointer text-[#9B9B9B]">
                        <Unarchive />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Wiederherstellen
                        </span>
                      </button>
                    )}

                    <button
                      onClick={() => fetchCustomerSummary(c.AutoID)}
                      className="relative group cursor-pointer   text-[#50E3C2]">
                      <Summarize />
                      <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Kundenzusammenfassung
                      </span>
                    </button>
                    <button
                      onClick={() => fetchCustomerLogs(c.AutoID)}
                      className="relative group cursor-pointer text-green-700">
                      <ListAlt />
                      <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Kundenprotokolle
                      </span>
                    </button>
                    {/* <button
                      onClick={() => fetchStatusHistory(c.AutoID)}
                      className="relative group cursor-pointer ">
                      <History />
                      <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Verlauf
                      </span>
                    </button> */}
                    <button
                      onClick={() => fetchAuditLogs(c.AutoID)}
                      className="relative group cursor-pointer  text-[#F5A623]">
                      <BarChart />
                      <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Protokolle
                      </span>
                    </button>
                    {c.is_archived && (
                      <button
                        onClick={() => handleDelete(c.AutoID)}
                        className="relative group cursor-pointer text-red-500 ">
                        <Delete />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Löschen
                        </span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* USER DETAIL MODAL  */}
      {showModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Nutzerdaten
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold">AutoID:</span>{" "}
                {selectedCustomer.AutoID}
              </div>
              <div>
                <span className="font-semibold">Anrede:</span>{" "}
                {selectedCustomer.Anrede || "—"}
              </div>
              <div>
                <span className="font-semibold">Vorname:</span>{" "}
                {selectedCustomer.Vorname || "—"}
              </div>
              <div>
                <span className="font-semibold">Kontaktname:</span>{" "}
                {selectedCustomer.KontaktName || "—"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {selectedCustomer.EmailAdresse}
              </div>
              <div>
                <span className="font-semibold">Firma:</span>{" "}
                {selectedCustomer.Firma || "—"}
              </div>
              <div>
                <span className="font-semibold">Handynr:</span>{" "}
                {selectedCustomer.Handynr || "—"}
              </div>
              <div>
                <span className="font-semibold">Geburtstag:</span>{" "}
                {selectedCustomer.Geburtstag || "—"}
              </div>
              <div>
                <span className="font-semibold">Adresse:</span>{" "}
                {selectedCustomer.MusterAdresse || "—"}
              </div>
              <div>
                <span className="font-semibold">USt-ID:</span>{" "}
                {selectedCustomer.UStIdNr || "—"}
              </div>
              <div>
                <span className="font-semibold">Erstellt am:</span>{" "}
                {selectedCustomer.ErstellungsDatum || "—"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>
                <span
                  className={
                    selectedCustomer.is_active
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }>
                  {selectedCustomer.is_active ? "Aktiv" : "Inaktiv"}
                </span>
              </div>
              <div>
                <span className="font-semibold">Abgeschickt:</span>{" "}
                {selectedCustomer.GesamtStueckzahlAbgeschickt}
              </div>
              <div>
                <span className="font-semibold">Gebucht:</span>{" "}
                {selectedCustomer.GesamtStueckzahlGebucht}
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {/* SUMMARY MODAL */}
      {showSummaryModal && customerSummary && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kundenzusammenfassung
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Artikel:</span>
                <span>{customerSummary.artikel_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Marken:</span>
                <span>{customerSummary.brand_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kampagnen:</span>
                <span>{customerSummary.campaign_count}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSummaryModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* LOGS MODAL */}
      {showLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kundenprotokolle
            </h2>

            <div className="space-y-4 text-sm text-gray-700 max-h-[400px] overflow-y-auto pr-2">
              {logs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Protokolle gefunden.
                </p>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-semibold">Aktion:</span>
                      <span className="capitalize">{log.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Details:</span>
                      <span>{log.details}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Entität:</span>
                      <span>
                        {log.entity} (ID: {log.entity_id})
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Zeitstempel:</span>
                      <span>
                        {new Date(log.timestamp).toLocaleString("de-DE")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">IP-Adresse:</span>
                      <span>{log.ip_address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">User-Agent:</span>
                      <span>{log.user_agent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">User ID:</span>
                      <span>{log.user_id}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* HISTORY MODAL  */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Statusverlauf
            </h2>

            <div className="space-y-4 text-sm text-gray-700 max-h-[400px] overflow-y-auto pr-2">
              {statusHistory.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Änderungen im Verlauf gefunden.
                </p>
              ) : (
                statusHistory.map((entry, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-semibold">Aktion:</span>
                      <span className="capitalize">{entry.action}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Details:</span>
                      <span>{entry.details}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Modell:</span>
                      <span>{entry.model}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Zeitstempel:</span>
                      <span>
                        {new Date(entry.timestamp).toLocaleString("de-DE")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowHistoryModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {/* UPDATE USER MODAL  */}
      {editModal && selectedCustomer && (
        <UpdateCustomerModal
          customer={selectedCustomer}
          setEditModal={setEditModal}
          fetchCustomers={fetchCustomers}
        />
      )}
      {showAuditLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Audit-Logs für Kunde {selectedCustomerID}
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto text-sm text-gray-700">
              {auditLogs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Logs gefunden.
                </p>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm space-y-1 cursor-pointer"
                    onClick={() => fetchAuditLogByID(log.entity_id)}>
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
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <strong>IP-Adresse:</strong> {log.ip_address}
                    </div>
                    <div>
                      <strong>User-Agent:</strong> {log.user_agent}
                    </div>
                    <div>
                      <strong>User ID:</strong> {log.user_id}
                    </div>
                  </div>
                ))
              )}
              {auditLogs.length >= 1 && (
                <div className="space-x-2 flex items-center justify-between">
                  <button
                    onClick={() => exportCustomerLogs("csv")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                    Exportiere CSV
                  </button>

                  <button
                    onClick={() => exportCustomerLogs("xls")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                    Exportiere XLS
                  </button>

                  <button
                    onClick={() => exportCustomerLogs("pdf", "K001")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                    Exportiere PDF (K001)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowAuditLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showLogDetailModal && auditLogDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Audit-Log Detail (ID: {auditLogDetail.id})
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Aktion:</span>
                <span>{auditLogDetail.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Details:</span>
                <span>{auditLogDetail.details}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entität:</span>
                <span>{auditLogDetail.entity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entitäts-ID:</span>
                <span>{auditLogDetail.entity_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde-ID:</span>
                <span>{auditLogDetail.kunde_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">IP-Adresse:</span>
                <span>{auditLogDetail.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User-Agent:</span>
                <span className="break-words max-w-[60%]">
                  {auditLogDetail.user_agent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User ID:</span>
                <span>{auditLogDetail.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zeitstempel:</span>
                <span>
                  {new Date(auditLogDetail.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowLogDetailModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
