import React, { useEffect, useState } from "react";
import { Delete, Edit, Search, Save, Add, BarChart } from "@mui/icons-material";

const BASE_URL = "https://40fe56c82e49.ngrok-free.app";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [showCategoryLogsModal, setShowCategoryLogsModal] = useState(false);
  const [categoryLogs, setCategoryLogs] = useState([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState(null);
  const [showCategoryLogDetailModal, setShowCategoryLogDetailModal] =
    useState(false);
  const [categoryLogDetail, setCategoryLogDetail] = useState(null);

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

  const handleAddCategory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/categories/`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ Name: newCategory }),
      });
      const data = await res.json();
      if (data.category) {
        setNewCategory("");
        fetchCategories();
      } else {
        // alert(data.error || "Fehler beim Erstellen.");
        console.log(data.error || "Fehler beim Erstellen.");
      }
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ Name: editingName }),
      });
      setEditingId(null);
      setEditingName("");
      fetchCategories();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  const fetchCategoryLogs = async (categoryID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/categories/${categoryID}/logs`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error("Fehler beim Abrufen der Kategorie-Logs");

      const data = await res.json();
      setCategoryLogs(data);
      setSelectedCategoryID(categoryID);
      setShowCategoryLogsModal(true);
    } catch (err) {
      console.error(err);
      // alert("Kategorie-Logs konnten nicht geladen werden.");
    }
  };
  const fetchCategoryLogByID = async (logID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/categories/logs/${logID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error("Fehler beim Abrufen des Kategorie-Logs");

      const data = await res.json();
      setCategoryLogDetail(data);
      setShowCategoryLogDetailModal(true);
    } catch (err) {
      console.error(err);
      // alert("Kategorie-Log konnte nicht geladen werden.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      fetchCategories();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [search]);
  const handleExportCategoryLogs = (format, categoryId = null) => {
    const query = new URLSearchParams({ format });
    if (categoryId) query.append("category_id", categoryId);

    window.open(
      `${BASE_URL}/categories/logs/export?${query.toString()}`,
      "_blank"
    );
  };
  const handleExport = (format) => {
    window.open(`${BASE_URL}/categories/export/${format}`, "_blank");
  };
  const [openFormats, setOpenFormats] = useState(false);
  const formats = ["csv", "xlsx", "pdf"];

  const [openCustom, setOpenCustom] = useState(false);
  const handleClick = (format, categoryID = null) => {
    handleExportCategoryLogs(format, categoryID);
    setOpenCustom(false);
  };
  const addCategoryEntry = async (categoryId, value = "0,70€") => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/categories/${categoryId}/entries`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ Wert: value }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Fehler beim Hinzufügen");

      alert(data.message || "Eintrag erfolgreich hinzugefügt.");
    } catch (err) {
      console.error(err);
      alert("Fehler beim Hinzufügen des Eintrags.");
    }
  };

  const [categoryEntries, setCategoryEntries] = useState([]);
  const [showCategoryEntriesModal, setShowCategoryEntriesModal] =
    useState(false);

  const fetchCategoryEntries = async (categoryId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/categories/${categoryId}/entries`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok)
        throw new Error("Fehler beim Abrufen der Kategorie-Einträge");

      const data = await res.json();
      setCategoryEntries(data); // set to state
      setSelectedCategoryID(categoryId);
      setShowCategoryEntriesModal(true); // open modal
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategoryEntry = async (entryId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/categories/entries/${entryId}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Fehler beim Löschen");

      // Refresh entries after deletion
      setCategoryEntries((prev) => prev.filter((e) => e.ID !== entryId));
      log("Eintrag erfolgreich gelöscht.");
    } catch (err) {
      console.error("Delete failed:", err);
      log("Fehler beim Löschen des Eintrags.");
    }
  };
  const [groupedEntries, setGroupedEntries] = useState({});
  const [showGroupedEntriesModal, setShowGroupedEntriesModal] = useState(false);

  const fetchGroupedEntries = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/categories/entries/grouped`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok)
        throw new Error("Fehler beim Abrufen der gruppierten Einträge");

      const data = await res.json();
      setGroupedEntries(data);
      setShowGroupedEntriesModal(true);
    } catch (err) {
      console.error("Error fetching grouped entries:", err);
    }
  };
  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <h1 className="text-2xl font-bold mb-4 text-[#412666]">Kategorien</h1>

      <div className="flex gap-2 items-center mb-4">
        <div className="flex border border-[#412666] rounded px-3 items-center w-1/3">
          <Search />
          <input
            type="text"
            placeholder="Suche nach Kategorien..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 py-2 px-2 focus:outline-none"
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
        <button
          onClick={fetchGroupedEntries}
          className="bg-[#412666] text-white px-6 py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
          Gruppierte Einträge anzeigen
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Neue Kategorie hinzufügen"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <button
          onClick={handleAddCategory}
          className="bg-[#412666] text-white px-4 py-2 rounded-full hover:bg-[#341f4f] flex items-center gap-1  cursor-pointer">
          <Add fontSize="small" /> Hinzufügen
        </button>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="text-[#412666] border-b border-gray-200">
          <tr>
            <th className="py-2 px-3">Kategorie ID</th>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Artikelanzahl</th>
            <th className="py-2 px-3">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr
              key={cat.ID}
              className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-3">{cat.ID}</td>
              <td className="py-2 px-3">
                {editingId === cat.ID ? (
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                  />
                ) : (
                  cat.Name
                )}
              </td>
              <td className="py-2 px-3">{cat.AnzahlArtikel}</td>
              <td className="py-2 px-3 text-center flex items-center gap-2">
                {editingId === cat.ID && (
                  <p
                    className="text-[#412666] font-bold cursor-pointer"
                    onClick={() => handleUpdateCategory(cat.ID)}>
                    {" "}
                    Speichern
                  </p>
                )}
                <select
                  onChange={(e) => {
                    const action = e.target.value;
                    if (!action) return;

                    switch (action) {
                      case "edit":
                        setEditingId(cat.ID);
                        setEditingName(cat.Name);
                        break;
                      case "save":
                        handleUpdateCategory(cat.ID);
                        break;
                      case "logs":
                        fetchCategoryLogs(cat.ID);
                        break;
                      case "addEntry":
                        addCategoryEntry(cat.ID);
                        break;
                      case "viewEntries":
                        fetchCategoryEntries(cat.ID);
                        break;
                      case "delete":
                        handleDeleteCategory(cat.ID);
                        break;
                      default:
                        break;
                    }

                    e.target.selectedIndex = 0;
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm text-[#412666] bg-white cursor-pointer">
                  <option value="" hidden>
                    Aktion wählen
                  </option>
                  {editingId === cat.ID ? (
                    <option value="save">Speichern</option>
                  ) : (
                    <option value="edit">Bearbeiten</option>
                  )}
                  <option value="logs">Protokolle</option>
                  <option value="addEntry">Eintrag hinzufügen</option>
                  <option value="viewEntries">Einträge anzeigen</option>

                  <option value="delete">Löschen</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showCategoryEntriesModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kategorie-Einträge (ID: {selectedCategoryID})
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto text-sm text-gray-700">
              {categoryEntries.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Einträge gefunden.
                </p>
              ) : (
                categoryEntries.map((entry) => (
                  <div
                    key={entry.ID}
                    className="border rounded-lg p-3 bg-gray-50 shadow-sm">
                    <div className="flex justify-between">
                      <strong>ID:</strong>
                      <span>{entry.ID}</span>
                    </div>
                    <div className="flex justify-between">
                      <strong>Wert:</strong>
                      <span>{entry.Wert}</span>
                    </div>
                    <span
                      className="flex w-full items-center justify-center text-red-600 cursor-pointer"
                      onClick={() => deleteCategoryEntry(entry.ID)}>
                      Löschen
                    </span>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowCategoryEntriesModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}

      {showCategoryLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 text-wrap">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kategorie-Logs (ID: {selectedCategoryID})
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto text-sm text-gray-700">
              {categoryLogs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Logs gefunden.
                </p>
              ) : (
                categoryLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-1 cursor-pointer"
                    onClick={() => fetchCategoryLogByID(log.id)}>
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
              {categoryLogs.length >= 1 && (
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setOpenCustom(!openCustom)}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm text-[#412666] hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportieren ▾
                  </button>

                  {openCustom && (
                    <div className="absolute left-0 -top-58 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow z-50 p-2">
                      <button
                        onClick={() => handleClick("csv")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere CSV
                      </button>
                      <button
                        onClick={() => handleClick("xlsx")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere XLSX
                      </button>
                      <button
                        onClick={() => handleClick("pdf")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere PDF
                      </button>
                      <button
                        onClick={() => handleClick("csv", 1)}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere CSV (Kategorie 1)
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCategoryLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showCategoryLogDetailModal && categoryLogDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 text-wrap">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kategorie-Log Detail (ID: {categoryLogDetail.id})
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Aktion:</span>
                <span>{categoryLogDetail.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Details:</span>
                <span>{categoryLogDetail.details}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entität:</span>
                <span>{categoryLogDetail.entity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entitäts-ID:</span>
                <span>{categoryLogDetail.entity_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde-ID:</span>
                <span>{categoryLogDetail.kunde_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">IP-Adresse:</span>
                <span>{categoryLogDetail.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User-Agent:</span>
                <span className="break-words max-w-[60%]">
                  {categoryLogDetail.user_agent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User ID:</span>
                <span>{categoryLogDetail.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zeitstempel:</span>
                <span>
                  {new Date(categoryLogDetail.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCategoryLogDetailModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showGroupedEntriesModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl w-full relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Gruppierte Kategorie-Einträge
            </h2>

            {Object.keys(groupedEntries).length === 0 ? (
              <p className="text-center text-gray-500">Keine Daten gefunden.</p>
            ) : (
              <div className="space-y-6 text-sm text-gray-700">
                {Object.entries(groupedEntries).map(([category, values]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold text-[#412666] border-b pb-1 mb-2">
                      {category}
                    </h3>
                    {values.length === 0 ? (
                      <p className="text-gray-400 italic">Keine Einträge</p>
                    ) : (
                      <ul className="list-disc list-inside space-y-1">
                        {values.map((value, idx) => (
                          <li key={idx}>{value}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowGroupedEntriesModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
