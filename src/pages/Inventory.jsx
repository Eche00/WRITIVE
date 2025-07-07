import React, { useEffect, useState } from "react";
import {
  Delete,
  Edit,
  Visibility,
  FileDownload,
  Search,
  Add,
  MoveUp,
  BarChart,
} from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const Inventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedInventory, setSelectedInventory] = useState(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [newInventory, setNewInventory] = useState({
    Buchung: "",
    Kategorie: "",
    Bezeichnung: "",
    ArtikelID: "",
    ProduktionID: "",
    Buchungswert: "",
  });
  const [showUpdateInventoryModal, setShowUpdateInventoryModal] =
    useState(false);
  const [updatedInventory, setUpdatedInventory] = useState({
    ArtikelID: "",
    Bezeichnung: "",
    Buchung: "",
    Kategorie: "",
    ProduktionID: "",
    Buchungswert: 0,
  });
  const [showInventoryLogsModal, setShowInventoryLogsModal] = useState(false);
  const [inventoryLogs, setInventoryLogs] = useState([]);
  const [selectedInventoryID, setSelectedInventoryID] = useState(null);
  const [showInventoryLogDetailModal, setShowInventoryLogDetailModal] =
    useState(false);
  const [inventoryLogDetail, setInventoryLogDetail] = useState(null);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/inventory/?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setItems(data.inventory || data); // Adjust if your API wraps results
    } catch (err) {
      console.error("Fehler beim Abrufen des Inventars:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [search]);

  const fetchSingleInventory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/inventory/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setSelectedInventory(data);
      setShowInventoryModal(true);
    } catch (err) {
      console.error("Fehler beim Abrufen des Inventars:", err);
    }
  };

  const handleCreateInventory = async () => {
    const {
      Buchung,
      Kategorie,
      Bezeichnung,
      ArtikelID,
      ProduktionID,
      Buchungswert,
    } = newInventory;

    if (!ArtikelID || !ProduktionID) {
      console.log("ArtikelID und ProduktionID dürfen nicht leer sein.");
      // alert("ArtikelID und ProduktionID dürfen nicht leer sein.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/inventory/`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          Buchung,
          Kategorie,
          Bezeichnung,
          ArtikelID,
          ProduktionID,
          Buchungswert: parseFloat(Buchungswert),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // alert(data.message || "Inventar erfolgreich erstellt.");
        setShowInventoryForm(false);
        setNewInventory({
          Buchung: "",
          Kategorie: "",
          Bezeichnung: "",
          ArtikelID: "",
          ProduktionID: "",
          Buchungswert: "",
        });
        fetchInventory();
      } else {
        console.error("Inventory creation error:", data);
        // alert(data.error || "Fehler beim Erstellen des Inventars.");
      }
    } catch (err) {
      console.error("Inventory creation failed:", err.message);
      // alert("Netzwerkfehler beim Erstellen des Inventars.");
    }
  };

  const handleUpdateInventory = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/inventory/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          Buchung: updatedInventory.Buchung,
          Kategorie: updatedInventory.Kategorie,
          Bezeichnung: updatedInventory.Bezeichnung,
          ArtikelID: updatedInventory.ArtikelID,
          ProduktionID: updatedInventory.ProduktionID,
          Buchungswert: parseFloat(updatedInventory.Buchungswert),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        fetchInventory(); // refresh table
        setShowUpdateInventoryModal(false);
        setSelectedInventory(null);
      } else {
        console.error("Update failed:", data);
      }
    } catch (err) {
      console.error("Update error:", err.message);
    }
  };

  const [showMoveModal, setShowMoveModal] = useState(false);
  const [moveData, setMoveData] = useState({
    MoveQuantity: "",
    ProduktionID: "",
  });

  const handleMoveInventory = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/inventory/move/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          MoveQuantity: parseFloat(moveData.MoveQuantity),
          ProduktionID: moveData.ProduktionID,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // alert(data.message || "Bewegung erfolgreich abgeschlossen");
        setShowMoveModal(false);
        setMoveData({ MoveQuantity: "", ProduktionID: "" });
        fetchInventory(); // Refresh inventory list
      } else {
        // alert(data.error || "Fehler bei der Bewegung");
        console.error("Move failed:", data);
      }
    } catch (err) {
      console.error("Move request failed:", err.message);
    }
  };
  const fetchInventoryLogs = async (inventoryID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/inventory/${inventoryID}/logs`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error("Fehler beim Abrufen der Inventar-Logs");

      const data = await res.json();
      setInventoryLogs(data);
      setSelectedInventoryID(inventoryID);
      setShowInventoryLogsModal(true);
    } catch (err) {
      console.error(err);
      // alert("Inventar-Logs konnten nicht geladen werden.");
    }
  };
  const fetchInventoryLogByID = async (logID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/inventory/logs/${logID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error); // e.g. "Kein Inventar-Log."
        return;
      }

      setInventoryLogDetail(data);
      setShowInventoryLogDetailModal(true);
    } catch (err) {
      console.error(err);
      // alert("Fehler beim Abrufen des Inventar-Logs.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/inventory/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      fetchInventory();
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
    }
  };
  const handleExportInventoryLogs = (format) => {
    const query = new URLSearchParams({ format });

    window.open(
      `${BASE_URL}/inventory/logs/export?${query.toString()}`,
      "_blank"
    );
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#412666]">Inventar</h2>
        <div className="flex items-center gap-2">
          {["csv", "xlsx", "pdf"].map((format) => (
            <button
              key={format}
              onClick={() =>
                window.open(`${BASE_URL}/inventory/export?format=${format}`)
              }
              className="flex items-center gap-1 px-3 py-1 border border-[#412666] rounded hover:bg-[#412666] hover:text-white text-sm">
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <section className=" flex items-center justify-between">
        <div className="flex items-center mb-4 border border-[#412666] rounded-lg px-4 py-2 w-1/3 gap-2">
          <Search className="text-[#412666]" />
          <input
            type="text"
            placeholder="Suche nach Bezeichnung, Kategorie, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-none focus:outline-none"
          />
        </div>
        <button
          onClick={() => setShowInventoryForm(true)}
          className="py-[6px] px-[16px] bg-[#412666] text-white rounded-full hover:scale-105 transition-all duration-300 cursor-pointer">
          <Add /> Neuer Eintrag
        </button>
      </section>

      <table className="w-full text-sm text-left">
        <thead className="text-[#412666] border-b border-gray-200">
          <tr>
            <th className="py-2 px-3">ArtikelID</th>
            <th className="py-2 px-3">Bezeichnung</th>
            <th className="py-2 px-3">Buchung</th>
            <th className="py-2 px-3">Kategorie</th>
            <th className="py-2 px-3">ProduktionID</th>
            <th className="py-2 px-3">Buchungswert (€)</th>
            <th className="py-2 px-3">Zeit</th>
            <th className="py-2 px-3">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && !loading ? (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                Keine Daten gefunden.
              </td>
            </tr>
          ) : (
            items
              .filter((item) => {
                const query = search.toLowerCase();
                return (
                  item.Bezeichnung?.toLowerCase().includes(query) ||
                  item.Kategorie?.toLowerCase().includes(query) ||
                  String(item.ArtikelID).includes(query)
                );
              })
              .map((item) => (
                <tr
                  key={item.ID}
                  className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-3">{item.ArtikelID}</td>
                  <td className="py-2 px-3">{item.Bezeichnung}</td>
                  <td className="py-2 px-3">{item.Buchung}</td>
                  <td className="py-2 px-3">{item.Kategorie}</td>
                  <td className="py-2 px-3">{item.ProduktionID}</td>
                  <td className="py-2 px-3">{item.Buchungswert}</td>
                  <td className="py-2 px-3">
                    {new Date(item.Buchungszeit).toLocaleString("de-DE")}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => fetchSingleInventory(item.ID)}
                      className="relative group cursor-pointer ">
                      <Visibility />{" "}
                      <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Anzeigen
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInventory(item); // `item` is the inventory row
                        setUpdatedInventory({
                          ArtikelID: item.ArtikelID,
                          Bezeichnung: item.Bezeichnung,
                          Buchung: item.Buchung,
                          Kategorie: item.Kategorie,
                          ProduktionID: item.ProduktionID,
                          Buchungswert: item.Buchungswert,
                        });
                        setShowUpdateInventoryModal(true);
                      }}
                      className="relative group cursor-pointer">
                      <Edit fontSize="small" />
                      <span className="absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Bearbeiten
                      </span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInventory(item);
                        setShowMoveModal(true);
                      }}
                      className="relative group cursor-pointer">
                      <MoveUp fontSize="small" />
                      <span className="absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Bewegen
                      </span>
                    </button>

                    <button
                      onClick={() => fetchInventoryLogs(item.ID)}
                      className="relative group cursor-pointer ">
                      <BarChart />
                      <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Protokolle
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(item.ID)}
                      className="relative group cursor-pointer ">
                      <Delete fontSize="small" />
                      <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                        Löschen
                      </span>
                    </button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
      {showInventoryModal && selectedInventory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Inventar-Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold">ArtikelID:</span>{" "}
                {selectedInventory.ArtikelID}
              </div>
              <div>
                <span className="font-semibold">Bezeichnung:</span>{" "}
                {selectedInventory.Bezeichnung}
              </div>
              <div>
                <span className="font-semibold">Buchung:</span>{" "}
                {selectedInventory.Buchung}
              </div>
              <div>
                <span className="font-semibold">Kategorie:</span>{" "}
                {selectedInventory.Kategorie}
              </div>
              <div>
                <span className="font-semibold">ProduktionID:</span>{" "}
                {selectedInventory.ProduktionID}
              </div>
              <div>
                <span className="font-semibold">Buchungswert (€):</span>{" "}
                {selectedInventory.Buchungswert}
              </div>
              <div>
                <span className="font-semibold">Buchungszeit:</span>{" "}
                {new Date(selectedInventory.Buchungszeit).toLocaleString(
                  "de-DE"
                )}
              </div>
            </div>

            <button
              onClick={() => setShowInventoryModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showInventoryForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Neue Inventarbuchung
            </h2>

            <div className="space-y-4 text-sm">
              <input
                type="text"
                placeholder="ArtikelID (z. B. A001)"
                value={newInventory.ArtikelID}
                onChange={(e) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    ArtikelID: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Bezeichnung"
                value={newInventory.Bezeichnung}
                onChange={(e) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    Bezeichnung: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Buchung (z. B. Zugang)"
                value={newInventory.Buchung}
                onChange={(e) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    Buchung: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Kategorie (z. B. Verpackung)"
                value={newInventory.Kategorie}
                onChange={(e) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    Kategorie: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="text"
                placeholder="ProduktionID (z. B. P2025-001-A)"
                value={newInventory.ProduktionID}
                onChange={(e) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    ProduktionID: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded"
              />
              <input
                type="number"
                placeholder="Buchungswert (€)"
                value={newInventory.Buchungswert}
                onChange={(e) =>
                  setNewInventory((prev) => ({
                    ...prev,
                    Buchungswert: e.target.value,
                  }))
                }
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowInventoryForm(false)}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={handleCreateInventory}
                className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
      {showUpdateInventoryModal && selectedInventory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Inventar aktualisieren
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              {[
                "ArtikelID",
                "Bezeichnung",
                "Buchung",
                "Kategorie",
                "ProduktionID",
                "Buchungswert",
              ].map((field) => (
                <div key={field}>
                  <label className="block font-medium">{field}:</label>
                  <input
                    type={field === "Buchungswert" ? "number" : "text"}
                    className={`w-full border px-2 py-1 rounded ${
                      field === "ArtikelID"
                        ? "bg-gray-100 cursor-not-allowed"
                        : ""
                    }`}
                    value={updatedInventory[field]}
                    readOnly={field === "ArtikelID"}
                    onChange={(e) =>
                      setUpdatedInventory((prev) => ({
                        ...prev,
                        [field]:
                          field === "Buchungswert"
                            ? parseFloat(e.target.value)
                            : e.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowUpdateInventoryModal(false)}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={() => handleUpdateInventory(selectedInventory.ID)}
                className="w-full bg-[#412666] text-white py-2 rounded-lg  transition cursor-pointer">
                Aktualisieren
              </button>
            </div>
          </div>
        </div>
      )}
      {showMoveModal && selectedInventory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Bestand bewegen
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <label className="block font-medium">Neue ProduktionID:</label>
                <input
                  type="text"
                  value={moveData.ProduktionID}
                  onChange={(e) =>
                    setMoveData((prev) => ({
                      ...prev,
                      ProduktionID: e.target.value,
                    }))
                  }
                  className="w-full border px-2 py-1 rounded"
                  placeholder="z. B. P2025-001-B"
                />
              </div>

              <div>
                <label className="block font-medium">Menge zum Bewegen:</label>
                <input
                  type="number"
                  value={moveData.MoveQuantity}
                  onChange={(e) =>
                    setMoveData((prev) => ({
                      ...prev,
                      MoveQuantity: e.target.value,
                    }))
                  }
                  className="w-full border px-2 py-1 rounded"
                  placeholder="z. B. 50"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setShowMoveModal(false);
                  setMoveData({ MoveQuantity: "", ProduktionID: "" });
                }}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={() => handleMoveInventory(selectedInventory.ID)}
                className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
                Bewegen
              </button>
            </div>
          </div>
        </div>
      )}
      {showInventoryLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Inventar-Logs (ID: {selectedInventoryID})
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto text-sm text-gray-700">
              {inventoryLogs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Logs gefunden.
                </p>
              ) : (
                inventoryLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-1 cursor-pointer"
                    onClick={() => fetchInventoryLogByID(log.id)}>
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
                      <strong>Kunde-ID:</strong> {log.kunde_id ?? "—"}
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
              {inventoryLogs.length >= 1 && (
                <div className="space-x-2 flex items-center justify-between">
                  <button
                    onClick={() => handleExportInventoryLogs("csv")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all">
                    Exportiere CSV
                  </button>

                  <button
                    onClick={() => handleExportInventoryLogs("xlsx")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all">
                    Exportiere XLSX
                  </button>

                  <button
                    onClick={() => handleExportInventoryLogs("pdf")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all">
                    Exportiere PDF
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowInventoryLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showInventoryLogDetailModal && inventoryLogDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Inventar-Log Detail (ID: {inventoryLogDetail.id})
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Aktion:</span>
                <span>{inventoryLogDetail.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Details:</span>
                <span>{inventoryLogDetail.details}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entität:</span>
                <span>{inventoryLogDetail.entity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entitäts-ID:</span>
                <span>{inventoryLogDetail.entity_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde-ID:</span>
                <span>{inventoryLogDetail.kunde_id ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">IP-Adresse:</span>
                <span>{inventoryLogDetail.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User-Agent:</span>
                <span className="break-words max-w-[60%]">
                  {inventoryLogDetail.user_agent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User ID:</span>
                <span>{inventoryLogDetail.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zeitstempel:</span>
                <span>
                  {new Date(inventoryLogDetail.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowInventoryLogDetailModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
