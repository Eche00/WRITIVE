import React, { useEffect, useState } from "react";
import { Delete, Edit, Search, Save, Add } from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

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
        alert(data.error || "Fehler beim Erstellen.");
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
                  onClick={() => handleDeleteCategory(cat.ID)}
                  className="text-red-600 	 cursor-pointer">
                  <Delete fontSize="small" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Categories;
