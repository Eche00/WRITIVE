import { Search } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import UserLoader from "../component/UserLoader";
import UpdateCustomerModal from "./UpdateCustomerModal";
import CreateCustomerModal from "./CreateCustomerModal";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";
import toast from "react-hot-toast";

const Users = () => {
  const [customers, setCustomers] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [editModal, setEditModal] = useState(false);

  // user visibility
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // show archived
  const [showingArchived, setShowingArchived] = useState(false);
  const [hideArchived, setHideArchived] = useState(false);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);
  const [selectedCustomerID, setSelectedCustomerID] = useState(null);

  // FETCHING CUSTOMERS
  const fetchCustomers = async (query = "") => {
    setLoading(true);
    setShowingArchived(false);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_URL}/customers/?status=active&search=${query}`,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = await res.json();
      setCustomers(data.customers || []);
      setFiltered(data.customers || []);

      toast.success("Kunden erfolgreich abgerufen!");
    } catch (err) {
      console.error("Error fetching customers:", err);
      toast.error("Fehler beim Abrufen der Kunden.");
    } finally {
      setLoading(false);
    }
  };

  //  FETCHING ARCHIVED CUSTOMERS
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

      const archivedWithFlag = (data.archived_customers || []).map((c) => ({
        ...c,
        is_archived: true,
      }));

      setCustomers(archivedWithFlag);
      setFiltered(archivedWithFlag);
      setShowingArchived(true);

      toast.success("Archivierte Kunden erfolgreich geladen!");
    } catch (err) {
      console.error("Error fetching archived customers:", err);
      toast.error("Fehler beim Laden der archivierten Kunden.");
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
            (c.ID && c.ID.toLowerCase().includes(q)) ||
            (c.Firma && c.Firma.toLowerCase().includes(q))
        )
      );
    } else {
      setFiltered(customers);
    }
  }, [search, customers]);

  // FETCHING CUSTOMER DETAILS
  const fetchCustomerDetails = async (id) => {
    try {
      const token = localStorage.getItem("token");
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
      toast.success("Customer details loaded successfully!");
    } catch (err) {
      console.error("Detail fetch failed:", err);
      toast.error("Failed to load customer details.");
    }
  };

  // HANDLING ARCHIVE USERS
  const handleArchive = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/customers/${id}/archive`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      toast.success("Benutzer erfolgreich archiviert.");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Benutzer konnte nicht archiviert werden.");
    }
  };

  // HANDLING RESTORE USERS
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
      toast.success("Benutzer wurde erfolgreich wiederhergestellt.");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Benutzer konnte nicht wiederhergestellt werden.");
    }
  };

  // HANDLING DELETE USERS
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

      toast.success("Benutzer dauerhaft gelöscht.");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      toast.error("Benutzer konnte nicht gelöscht werden.");
    }
  };

  // HANDLING AUDIT FETCH FOR USERS
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

      if (!res.ok) {
        toast.error("Fehler beim Laden der Logs");
        throw new Error("Fehler beim Laden der Logs");
      }

      const data = await res.json();
      setAuditLogs(data);
      setSelectedCustomerID(customerID);
      setShowAuditLogsModal(true);
      toast.success("Logs erfolgreich geladen");
    } catch (err) {
      console.error(err);
      toast.error("Fehler beim Abrufen der Audit-Logs");
    }
  };

  // HANDLING EXPORT
  const handleExport = (format) => {
    window.open(`${BASE_URL}/customers/export/${format}`, "_blank");
  };

  // HANDLING EXPORTING USER LOGS
  const exportCustomerLogs = (format, kundeId = null) => {
    const query = new URLSearchParams({ format });
    if (kundeId) query.append("kunde_id", kundeId);

    window.open(
      `${BASE_URL}/customers/logs/export?${query.toString()}`,
      "_blank"
    );
  };
  const [openFormats, setOpenFormats] = useState(false);
  const formats = ["csv", "xls", "pdf"];
  const [openCustomLogs, setOpenCustomLogs] = useState(false);
  const handleClick = (format) => {
    if (format === "pdf") {
      exportCustomerLogs("pdf", "K001");
    } else {
      exportCustomerLogs(format);
    }
    setOpen(false);
  };
  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <h1 className="text-2xl font-bold mb-4 capitalize"> Nutzerseite</h1>

      {loading ? (
        <section>
          <UserLoader />
        </section>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow border border-gray-100 w-fit xl:w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#412666] mb-4">
              Nutzer
            </h2>

            <div className="flex items-center gap-[10px] text-white text-[12px]">
              <button
                onClick={() => setCreateModal(true)}
                className="bg-[#412666] text-white px-4 py-2 rounded-full hover:bg-[#341f4f] transition cursor-pointer">
                + Neuer Kunde
              </button>
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

            <div className="relative inline-block text-left">
              <button
                onClick={() => setOpenFormats(!openFormats)}
                className="border border-[#412666] px-4 py-2 rounded-lg text-sm text-[#412666] hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                Exportieren ▾
              </button>

              {openFormats && (
                <div className="absolute mt-2 w-48 right-0 bg-white border border-gray-200 rounded-lg shadow z-50 p-2 ">
                  {formats.map((format) => (
                    <button
                      key={format}
                      onClick={() => {
                        handleExport(format);
                        setOpenFormats(false); // close dropdown
                      }}
                      className="w-full  px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                      {format.toUpperCase()} Exportieren
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Kontaktname</th>
                <th className="py-2 px-3">E-Mail</th>
                <th className="py-2 px-3">Firma</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.ID}
                  className="border-b hover:bg-gray-50 transition border-gray-200">
                  <td className="py-2 px-3">{c.ID}</td>
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
                  <td className="py-2 px-3 text-center">
                    <select
                      onChange={(e) => {
                        const action = e.target.value;
                        if (!action) return;

                        switch (action) {
                          case "view":
                            fetchCustomerDetails(c.ID);
                            break;
                          case "edit":
                            setSelectedCustomer(c);
                            setEditModal(true);
                            break;
                          case "archive":
                            handleArchive(c.ID);
                            break;
                          case "restore":
                            handleRestore(c.ID);
                            break;
                          case "audit":
                            fetchAuditLogs(c.ID);
                            break;
                          case "delete":
                            handleDelete(c.ID);
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
                      {c.is_active ? (
                        <option value="archive">Archivieren</option>
                      ) : (
                        <option value="restore">Wiederherstellen</option>
                      )}

                      <option value="audit">Protokolle</option>
                      {!c.is_active && <option value="delete">Löschen</option>}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
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
                <span className="font-semibold">ID:</span>{" "}
                {selectedCustomer.ID || "—"}
              </div>
              <div>
                <span className="font-semibold">Anrede:</span>{" "}
                {selectedCustomer.Anrede || "—"}
              </div>
              <div>
                <span className="font-semibold">Kontaktname:</span>{" "}
                {selectedCustomer.KontaktName || "—"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {selectedCustomer.EmailAdresse || "—"}
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
                {selectedCustomer.Geburtstag
                  ? new Date(selectedCustomer.Geburtstag).toLocaleDateString(
                      "de-DE"
                    )
                  : "—"}
              </div>
              <div>
                <span className="font-semibold">Adresse:</span>{" "}
                {selectedCustomer.MusterAdresse || "—"}
              </div>
              <div>
                <span className="font-semibold">Erstellt am:</span>{" "}
                {selectedCustomer.ErstellungsDatum
                  ? new Date(selectedCustomer.ErstellungsDatum).toLocaleString(
                      "de-DE"
                    )
                  : "—"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
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
              <div>
                <span className="font-semibold">Gesamtverbleibend:</span>{" "}
                {selectedCustomer.Gesamtverbleibend}
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

      {/* CREATE CUSTOMER MODAL */}
      {createModal && (
        <CreateCustomerModal
          setCreateModal={setCreateModal}
          fetchCustomers={fetchCustomers}
        />
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 text-wrap">
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
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-sm space-y-1 cursor-pointer w-full ">
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
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setOpenCustomLogs(!openCustomLogs)}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm text-[#412666] hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere Logs ▾
                  </button>

                  {openCustomLogs && (
                    <div className="absolute left-0 -top-42 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow z-50 p-2">
                      <button
                        onClick={() => handleClick("csv")}
                        className="w-full  px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere CSV
                      </button>
                      <button
                        onClick={() => handleClick("xls")}
                        className="w-full  px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere XLS
                      </button>
                      <button
                        onClick={() => handleClick("pdf")}
                        className="w-full  px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere PDF (K001)
                      </button>
                    </div>
                  )}
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
    </div>
  );
};

export default Users;
