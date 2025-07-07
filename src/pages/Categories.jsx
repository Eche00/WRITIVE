import React, { useEffect, useState } from "react";
import { Delete, Edit, Search, Save, Add, BarChart } from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

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

  return (
    <div className="w-full mt-10">
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
        <div className="flex gap-2">
          {["csv", "xlsx", "pdf"].map((fmt) => (
            <button
              key={fmt}
              onClick={() =>
                window.open(
                  `${BASE_URL}/categories/export?format=${fmt}`,
                  "_blank"
                )
              }
              className="px-3 py-1 border border-[#412666] rounded hover:bg-[#412666] hover:text-white transition-all">
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
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
              <td className="p-2 flex gap-2 justify-between">
                {editingId === cat.ID ? (
                  <button
                    onClick={() => handleUpdateCategory(cat.ID)}
                    className="text-green-600 cursor-pointer">
                    <Save fontSize="small" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(cat.ID);
                      setEditingName(cat.Name);
                    }}
                    className="text-blue-600 cursor-pointer">
                    <Edit fontSize="small" />
                  </button>
                )}
                <button
                  onClick={() => fetchCategoryLogs(cat.ID)}
                  className="relative group cursor-pointer ">
                  <BarChart />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Protokolle
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.ID)}
                  className="text-red-600 	 cursor-pointer">
                  <Delete fontSize="small" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showCategoryLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
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
                <div className="space-x-2 flex items-center justify-between">
                  <button
                    onClick={() => handleExportCategoryLogs("csv")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere CSV
                  </button>

                  <button
                    onClick={() => handleExportCategoryLogs("xlsx")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere XLSX
                  </button>

                  <button
                    onClick={() => handleExportCategoryLogs("pdf")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere PDF
                  </button>

                  <button
                    onClick={() => handleExportCategoryLogs("csv", 1)}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere CSV (Kategorie 1)
                  </button>
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
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
    </div>
  );
};

export default Categories;
