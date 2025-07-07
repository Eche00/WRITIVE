import React, { useEffect, useState } from "react";
import {
  Search,
  Delete,
  Edit,
  AddCircleOutline,
  Save,
  PlayArrow,
  CheckCircle,
  Cancel,
  History,
  Add,
  BarChart,
} from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const ProductionWorkflow = () => {
  const [productions, setProductions] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [page, setPage] = useState(1);
  const [editingProductionId, setEditingProductionId] = useState(null);
  const [editingProduction, setEditingProduction] = useState({});
  const [statusHistory, setStatusHistory] = useState([]);
  const [showStatusHistoryModal, setShowStatusHistoryModal] = useState(false);
  const [showProductionLogsModal, setShowProductionLogsModal] = useState(false);
  const [productionLogs, setProductionLogs] = useState([]);
  const [selectedProductionID, setSelectedProductionID] = useState(null);
  const [showProductionLogDetailModal, setShowProductionLogDetailModal] =
    useState(false);
  const [productionLogDetail, setProductionLogDetail] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduction, setNewProduction] = useState({
    ID: "",
    Produktionsnummer: "",
    ArtikelID: "",
    BrandID: "",
    StandardStueckzahl: "",
    GeaenderteStueckzahl: "",
    Status: "Data Received",
  });

  const fetchProductions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_URL}/production/?page=${page}&status=${statusFilter}&brand_id=${brandFilter}&search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const data = await res.json();
      setProductions(data?.productions || []);
    } catch (err) {
      console.error("Fetch production failed:", err);
    }
  };
  const handleCreateProduction = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/production/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(newProduction),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Creation failed.");
      }

      const data = await res.json();
      setShowCreateModal(false);
      setNewProduction({
        ID: "",
        Produktionsnummer: "",
        ArtikelID: "",
        BrandID: "",
        StandardStueckzahl: "",
        GeaenderteStueckzahl: "",
        Status: "Data Received",
      });
      fetchProductions(); // Refresh
    } catch (err) {
      console.log("❌ Failed to create production: " + err.message);
    }
  };

  const handleProductionShortcutAction = async (productionId, actionType) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/production/${productionId}/${actionType}`, // <-- switched ID and action
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Action failed.");
      }

      const data = await res.json();
      console.log(`${actionType} → success:`, data);
      fetchProductions(); // Refresh production list
    } catch (err) {
      console.error(`${actionType} → failed:`, err.message);
    }
  };

  const handleUpdateProduction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/production/edit/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(editingProduction),
      });
      setEditingProductionId(null);
      setEditingProduction({});
      fetchProductions();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDeleteProduction = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/production/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      fetchProductions();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const fetchProductionLogs = async (productionID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/production/${productionID}/logs`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error("Fehler beim Laden der Produktions-Logs");

      const data = await res.json();
      setProductionLogs(data);
      setSelectedProductionID(productionID);
      setShowProductionLogsModal(true);
    } catch (err) {
      console.error(err);
      // alert("Produktions-Logs konnten nicht geladen werden.");
    }
  };
  const fetchProductionLogByID = async (logID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/production/logs/${logID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error); // e.g., "Kein Produktions-Log-Eintrag"
        return;
      }

      setProductionLogDetail(data);
      setShowProductionLogDetailModal(true);
    } catch (err) {
      console.error(err);
      // alert("Fehler beim Laden des Produktions-Logs.");
    }
  };

  const fetchStatusHistory = async (productionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_URL}/production/${productionId}/status/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );
      const data = await res.json();
      setStatusHistory(data);
      setShowStatusHistoryModal(true);
    } catch (err) {
      console.error("Status History fetch failed:", err);
    }
  };
  const [statusCheck, setStatusCheck] = useState(null);
  const [showStatusCheckModal, setShowStatusCheckModal] = useState(false);
  const handleCheckProductionStatus = async (productionId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/production/${productionId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch production.");
      }

      const data = await res.json();
      setStatusCheck(data);
      setShowStatusCheckModal(true);
    } catch (err) {
      // alert("❌ Failed to fetch status: " + err.message);
      console.log(" Failed to fetch status: " + err.message);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, [page, statusFilter, brandFilter, search]);
  const handleExportProductionLogs = (format, productionId = null) => {
    const query = new URLSearchParams({ format });
    if (productionId) query.append("production_id", productionId);

    window.open(
      `${BASE_URL}/production/logs/export?${query.toString()}`,
      "_blank"
    );
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4 text-[#412666]">
          Produktionsübersicht
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="mb-4 bg-[#412666] text-white px-[24px] py-2 rounded-full hover:bg-[#341f4f] transition cursor-pointer">
          <Add /> Neue Produktion
        </button>
      </div>

      <div className="flex gap-3 mb-4 items-center justify-between">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Suche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-1/3 "
          />
          <input
            type="text"
            placeholder="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-4 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Brand ID"
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="border px-4 py-2 rounded"
          />
        </div>

        <button
          onClick={() => fetchProductions()}
          className="bg-[#412666] text-white px-[24px] py-2 rounded-full cursor-pointer">
          Filtern
        </button>
        <div className="flex gap-2">
          {["csv", "xlsx", "pdf"].map((fmt) => (
            <button
              key={fmt}
              onClick={() =>
                window.open(`${BASE_URL}/production/export/${fmt}`, "_blank")
              }
              className="px-3 py-1 border border-[#412666] rounded hover:bg-[#412666] hover:text-white transition-all">
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="text-[#412666] border-b border-gray-200">
          <tr>
            <th className="py-2 px-3">ID</th>
            <th className="py-2 px-3">Produktionsnummer</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {productions.map((p) => (
            <tr
              key={p.ID}
              className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-3">{p.ID}</td>
              <td className="py-2 px-3">
                {editingProductionId === p.ID ? (
                  <input
                    value={editingProduction.Produktionsnummer || ""}
                    onChange={(e) =>
                      setEditingProduction((prev) => ({
                        ...prev,
                        Produktionsnummer: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  p.Produktionsnummer
                )}
              </td>
              <td className="py-2 px-3">
                {editingProductionId === p.ID ? (
                  <input
                    value={editingProduction.Status || ""}
                    onChange={(e) =>
                      setEditingProduction((prev) => ({
                        ...prev,
                        Status: e.target.value,
                      }))
                    }
                    className="border px-2 py-1 rounded"
                  />
                ) : (
                  p.Status
                )}
              </td>
              <td className="p-2 flex gap-2 flex-wrap">
                {editingProductionId === p.ID ? (
                  <button onClick={() => handleUpdateProduction(p.ID)}>
                    <Save fontSize="small" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingProductionId(p.ID);
                      setEditingProduction({
                        Produktionsnummer: p.Produktionsnummer,
                        Status: p.Status,
                      });
                    }}
                    className="relative group cursor-pointer ">
                    <Edit fontSize="small" />
                    <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                      Bearbeiten
                    </span>
                  </button>
                )}
                <button
                  onClick={() => handleProductionShortcutAction(p.ID, "start")}
                  className="relative group cursor-pointer ">
                  <PlayArrow fontSize="small" />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Start
                  </span>
                </button>

                <button
                  onClick={() => handleProductionShortcutAction(p.ID, "cancel")}
                  className="relative group cursor-pointer ">
                  <Cancel fontSize="small" />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Abbrechen
                  </span>
                </button>
                <button
                  onClick={() =>
                    handleProductionShortcutAction(p.ID, "complete")
                  }
                  className="relative group cursor-pointer ">
                  <CheckCircle fontSize="small" />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    abschließen
                  </span>
                </button>
                <button
                  onClick={() => handleCheckProductionStatus(p.ID)}
                  className="relative group cursor-pointer ">
                  <span className=" h-1 w-1 px-2 bg-black rounded-full"></span>
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Status
                  </span>
                </button>

                <button
                  onClick={() => fetchProductionLogs(p.ID)}
                  title="Status-Historie anzeigen"
                  className="relative group cursor-pointer ">
                  <BarChart />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Protokolle
                  </span>
                </button>
                <button
                  onClick={() => fetchStatusHistory(p.ID)}
                  title="Status-Historie anzeigen"
                  className="relative group cursor-pointer ">
                  <History fontSize="small" />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Verlauf
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteProduction(p.ID)}
                  title="Status-Historie anzeigen"
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
      {showStatusHistoryModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Statusverlauf
            </h2>

            {statusHistory.length === 0 ? (
              <p className="text-center text-gray-500">
                Keine Daten verfügbar.
              </p>
            ) : (
              <div className="space-y-3 text-gray-700 text-sm max-h-[400px] overflow-y-auto pr-1">
                {statusHistory.map((entry, idx) => (
                  <div
                    key={idx}
                    className="border p-4 rounded-lg shadow-sm bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-semibold">Von:</span>
                      <span>{entry.old_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Zu:</span>
                      <span>{entry.new_status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Geändert von:</span>
                      <span>{entry.changed_by}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Zeitpunkt:</span>
                      <span>
                        {new Date(entry.timestamp).toLocaleString("de-DE")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => {
                setShowStatusHistoryModal(false);
                setStatusHistory([]);
              }}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Neue Produktion erstellen
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              {[
                ["ID", "ID"],
                ["Produktionsnummer", "Produktionsnummer"],
                ["Artikel-ID", "ArtikelID"],
                ["Brand-ID", "BrandID"],
                ["Standard Stückzahl", "StandardStueckzahl"],
                ["Geänderte Stückzahl", "GeaenderteStueckzahl"],
              ].map(([label, field]) => (
                <div key={field}>
                  <label className="block font-medium">{label}:</label>
                  <input
                    type="text"
                    className="w-full border px-2 py-1 rounded"
                    value={newProduction[field]}
                    onChange={(e) =>
                      setNewProduction({
                        ...newProduction,
                        [field]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={handleCreateProduction}
                className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
      {showStatusCheckModal && statusCheck && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold text-[#412666] mb-4 text-center">
              Aktueller Produktionsstatus
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">ID:</span>
                <span>{statusCheck.ID}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span>{statusCheck.Status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Gestartet:</span>
                <span>{statusCheck.ProduktionGestartet ? " Ja" : " Nein"}</span>
              </div>
              {statusCheck.ProduktionGestartetZeit && (
                <div className="flex justify-between">
                  <span className="font-semibold">Startzeit:</span>
                  <span>
                    {new Date(
                      statusCheck.ProduktionGestartetZeit
                    ).toLocaleString("de-DE")}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setShowStatusCheckModal(false);
                setStatusCheck(null);
              }}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showProductionLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Produktions-Logs (ID: {selectedProductionID})
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto text-sm text-gray-700">
              {productionLogs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Logs gefunden.
                </p>
              ) : (
                productionLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-1 cursor-pointer"
                    onClick={() => fetchProductionLogByID(log.id)}>
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
                      <strong>Kunde-ID:</strong> {log.kunde_id}
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
              {productionLogs.length >= 1 && (
                <div className="space-x-2 flex items-center justify-between">
                  <button
                    onClick={() => handleExportProductionLogs("csv")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere CSV
                  </button>

                  <button
                    onClick={() => handleExportProductionLogs("xlsx")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere XLSX
                  </button>

                  <button
                    onClick={() => handleExportProductionLogs("pdf")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere PDF
                  </button>

                  <button
                    onClick={() => handleExportProductionLogs("csv", "ID33")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere CSV (ID33)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowProductionLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showProductionLogDetailModal && productionLogDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Produktions-Log Detail (ID: {productionLogDetail.id})
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Aktion:</span>
                <span>{productionLogDetail.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Details:</span>
                <span>{productionLogDetail.details}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entität:</span>
                <span>{productionLogDetail.entity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entitäts-ID:</span>
                <span>{productionLogDetail.entity_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde-ID:</span>
                <span>{productionLogDetail.kunde_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">IP-Adresse:</span>
                <span>{productionLogDetail.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User-Agent:</span>
                <span className="break-words max-w-[60%]">
                  {productionLogDetail.user_agent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User ID:</span>
                <span>{productionLogDetail.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zeitstempel:</span>
                <span>
                  {new Date(productionLogDetail.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowProductionLogDetailModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductionWorkflow;
