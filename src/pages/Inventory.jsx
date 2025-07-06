import React, { useEffect, useState } from "react";
import {
  Delete,
  Edit,
  Visibility,
  FileDownload,
  Search,
  Add,
  MoveUp,
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
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/inventory`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          Buchung: newInventory.Buchung,
          Kategorie: newInventory.Kategorie,
          Bezeichnung: newInventory.Bezeichnung,
          ArtikelID: newInventory.ArtikelID,
          ProduktionID: newInventory.ProduktionID,
          Buchungswert: parseFloat(newInventory.Buchungswert),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message || "Inventar erfolgreich erstellt.");
        setShowInventoryForm(false);
        setNewInventory({
          Buchung: "",
          Kategorie: "",
          Bezeichnung: "",
          ArtikelID: "",
          ProduktionID: "",
          Buchungswert: "",
        });
        fetchInventory(); // Optional: Refresh inventory list
      } else {
        console.error("Inventory creation error:", data);
      }
    } catch (err) {
      console.error("Inventory creation failed:", err.message);
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
        alert(data.message || "Bewegung erfolgreich abgeschlossen");
        setShowMoveModal(false);
        setMoveData({ MoveQuantity: "", ProduktionID: "" });
        fetchInventory(); // Refresh inventory list
      } else {
        alert(data.error || "Fehler bei der Bewegung");
        console.error("Move failed:", data);
      }
    } catch (err) {
      console.error("Move request failed:", err.message);
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
    </div>
  );
};

export default Inventory;
