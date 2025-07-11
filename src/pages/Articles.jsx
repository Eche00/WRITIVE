import React, { useEffect, useState } from "react";
import {
  BarChart,
  Delete,
  Edit,
  Search,
  Visibility,
} from "@mui/icons-material";
import CreateArticleModal from "./CreateArticleModal";
import EditArticleModal from "./EditArticleModal";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const Articles = ({ setViewarticles }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [articleLogs, setArticleLogs] = useState([]);
  const [showArticleLogsModal, setShowArticleLogsModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showSingleLogModal, setShowSingleLogModal] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [search]);

  const fetchSingleArticle = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/products/${id}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setSelectedArticle(data);
      setShowArticleModal(true);
    } catch (err) {
      console.error("Error fetching article:", err);
    }
  };
  const fetchArticleLogs = async (artikelId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/products/${artikelId}/logs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setArticleLogs(data);
      setShowArticleLogsModal(true);
    } catch (err) {
      console.error("Fehler beim Laden der Logs:", err);
    }
  };

  const fetchSingleLog = async (logId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/products/logs/${logId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setSelectedLog(data);
      setShowSingleLogModal(true);
    } catch (err) {
      console.error("Fehler beim Abrufen des Protokolleintrags:", err);
    }
  };

  const handleDeleteArticle = async (id, payload) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/products/${id}/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });
      fetchArticles();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col  mb-4">
        <section className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#412666] mb-4">
            {" "}
            Artikel
          </h2>
          <div className="flex items-center gap-[10px] text-white text-[12px]">
            <button
              onClick={() => setViewarticles(false)}
              className=" py-[6px] px-[16px] border border-[#412666] text-[#412666] rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300">
              Marken
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className=" py-[6px] px-[16px] bg-[#412666] rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300">
              + Neuer Artikel
            </button>
          </div>
        </section>
        <section className="flex items-center justify-between">
          <div className="border border-[#412666] rounded-lg px-4 w-1/3 flex items-center gap-2">
            <Search />
            <input
              type="text"
              placeholder="Suche Artikel ID, Name oder Brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none py-2 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["csv", "xlsx", "pdf", "json"].map((format) => (
              <button
                key={format}
                onClick={() =>
                  window.open(
                    `${BASE_URL}/products/export?format=${format}`,
                    "_blank"
                  )
                }
                className="border border-[#412666] px-4 py-2 rounded text-sm hover:bg-[#412666] hover:text-white transition-all">
                {format.toUpperCase()}
              </button>
            ))}
          </div>
        </section>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="text-[#412666] border-b border-gray-200">
          <tr>
            <th className="py-2 px-3">Artikelname</th>
            <th className="py-2 px-3">Marken</th>
            <th className="py-2 px-3">Kunde</th>
            <th className="py-2 px-3">Stück/Monat</th>
            <th className="py-2 px-3">Format</th>
            <th className="py-2 px-3">Versand</th>
            <th className="py-2 px-3">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((a, index) => (
            <tr
              key={a.ID || index}
              className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-3">{a.Artikelname || "—"}</td>
              <td className="py-2 px-3">{a.Brandname || "—"}</td>
              <td className="py-2 px-3">{(a.KundeFirmenname || "—").trim()}</td>
              <td className="py-2 px-3">{a.StueckzahlProMonat || "—"}</td>
              <td className="py-2 px-3">{a.Format || "—"}</td>
              <td className="py-2 px-3">{a.Versandart || "—"}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => fetchSingleArticle(a.ID)}
                  className="relative group cursor-pointer  text-[#4A90E2]">
                  <Visibility />{" "}
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Anzeigen
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedArticle(a); // `article` is the current item in your list
                    setEditModalOpen(true);
                  }}
                  className="relative group cursor-pointer text-blue-700">
                  <Edit fontSize="small" />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Bearbeiten
                  </span>
                </button>
                <button
                  onClick={() => fetchArticleLogs(a.ID)}
                  className="relative group cursor-pointer  text-[#F5A623]">
                  <BarChart />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Protokolle anzeigen
                  </span>
                </button>
                <button
                  onClick={() => handleDeleteArticle(a.ID || a.id, a)}
                  className="relative group cursor-pointer text-red-500">
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
      {
        <CreateArticleModal
          showModal={showCreateModal}
          setShowModal={setShowCreateModal}
          onCreated={() => fetchArticles()}
        />
      }
      {
        <EditArticleModal
          showModal={editModalOpen}
          setShowModal={setEditModalOpen}
          artikel={selectedArticle}
          onUpdated={(updatedArtikel) => {
            setArticles((prevArticles) =>
              prevArticles.map((article) =>
                article.ID === updatedArtikel.ID ? updatedArtikel : article
              )
            );
          }}
        />
      }
      {showArticleModal && selectedArticle && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Artikeldetails
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-semibold">Artikelname:</span>{" "}
                {selectedArticle.Artikelname || "—"}
              </div>
              <div>
                <span className="font-semibold">Edition:</span>{" "}
                {selectedArticle.ArtikelBezeichnungName || "—"}
              </div>
              <div>
                <span className="font-semibold">Brand:</span>{" "}
                {selectedArticle.Brandname || "—"}
              </div>
              <div>
                <span className="font-semibold">Kategorie ID:</span>{" "}
                {selectedArticle.ArtikelKategorieID || "—"}
              </div>
              <div>
                <span className="font-semibold">Text:</span>{" "}
                {selectedArticle.Text || "—"}
              </div>
              <div>
                <span className="font-semibold">Variablen:</span>{" "}
                {selectedArticle.Variablen || "—"}
              </div>
              <div>
                <span className="font-semibold">Versandart:</span>{" "}
                {selectedArticle.Versandart || "—"}
              </div>
              <div>
                <span className="font-semibold">Frankierung:</span>{" "}
                {selectedArticle.Frankierung || "—"}
              </div>
              <div>
                <span className="font-semibold">Format:</span>{" "}
                {selectedArticle.Format || "—"}
              </div>
              <div>
                <span className="font-semibold">Musterdesign:</span>{" "}
                {selectedArticle.MusterkarteDesign || "—"}
              </div>
              <div>
                <span className="font-semibold">Stift:</span>{" "}
                {selectedArticle.Stift || "—"}
              </div>
              <div>
                <span className="font-semibold">Schrift:</span>{" "}
                {selectedArticle.Schrift || "—"}
              </div>
              <div>
                <span className="font-semibold">Stück/Monat:</span>{" "}
                {selectedArticle.StueckzahlProMonat || "—"}
              </div>
              <div>
                <span className="font-semibold">Zusatzinfos:</span>{" "}
                {selectedArticle.ZusatzInfos || "—"}
              </div>
              <div>
                <span className="font-semibold">Kunde:</span>{" "}
                {selectedArticle.KundeFirmenname?.trim() || "—"}
              </div>
              <div>
                <span className="font-semibold">Erstellt am:</span>{" "}
                {new Date(selectedArticle.created_at).toLocaleString("de-DE")}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={
                    selectedArticle.is_active
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }>
                  {selectedArticle.is_active ? "Aktiv" : "Inaktiv"}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowArticleModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showArticleLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Artikelprotokolle
            </h2>

            <div className="space-y-4 text-sm text-gray-700 max-h-[400px] overflow-y-auto pr-2">
              {articleLogs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Protokolle gefunden.
                </p>
              ) : (
                articleLogs.map((log) => (
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
                      <span className="font-semibold">Kunde ID:</span>
                      <span>{log.kunde_id}</span>
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
                      <span className="truncate">{log.user_agent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Benutzer ID:</span>
                      <span>{log.user_id}</span>
                    </div>
                    <button
                      onClick={() => fetchSingleLog(log.id)}
                      className=" w-full flex items-center justify-center cursor-pointer">
                      <Visibility fontSize="small" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowArticleLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showSingleLogModal && selectedLog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Protokolleintrag
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <strong>Aktion:</strong> {selectedLog.action}
              </p>
              <p>
                <strong>Details:</strong> {selectedLog.details}
              </p>
              <p>
                <strong>Entität:</strong> {selectedLog.entity}
              </p>
              <p>
                <strong>Entitäts-ID:</strong> {selectedLog.entity_id}
              </p>
              <p>
                <strong>Kunde ID:</strong> {selectedLog.kunde_id}
              </p>
              <p>
                <strong>Benutzer ID:</strong> {selectedLog.user_id}
              </p>
              <p>
                <strong>IP-Adresse:</strong> {selectedLog.ip_address}
              </p>
              <p>
                <strong>User-Agent:</strong> {selectedLog.user_agent}
              </p>
              <p>
                <strong>Zeitstempel:</strong>{" "}
                {new Date(selectedLog.timestamp).toLocaleString("de-DE")}
              </p>
            </div>

            <button
              onClick={() => setShowSingleLogModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Articles;
