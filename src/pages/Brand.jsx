import React, { useEffect, useState } from "react";
import { Add, Search } from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import CreateBrandModal from "./CreateBrandModal";
import UpdateBrandModal from "./UpdateBrandModal";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";
import { toast } from "react-hot-toast";

function Brand() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showArticlesModal, setShowArticlesModal] = useState(false);
  const [articles, setArticles] = useState([]);
  const [singleBrand, setSingleBrand] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  // 1. Add state at the top of your component
  const [customerBrands, setCustomerBrands] = useState([]);
  const [showBrandsModal, setShowBrandsModal] = useState(false);
  const [kontingentSummary, setKontingentSummary] = useState(null);
  const [showKontingentModal, setShowKontingentModal] = useState(false);
  const [brandLogs, setBrandLogs] = useState([]);
  const [showBrandLogsModal, setShowBrandLogsModal] = useState(false);
  const [showBrandLogModal, setShowBrandLogModal] = useState(false);
  const [brandLogDetail, setBrandLogDetail] = useState(null);
  const [openFormats, setOpenFormats] = useState(false);
  const [openBrandExport, setOpenBrandExport] = useState(false);
  const BRAND_BASE_URL = BASE_URL;
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BRAND_BASE_URL}/brands/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setBrands(data);
      setFiltered(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFiltered(
        brands.filter(
          (b) =>
            b?.Brandname.toLowerCase().includes(q) ||
            b?.KundeFirma.toLowerCase().includes(q) ||
            b?.ID.toLowerCase().includes(q)
        )
      );
    } else {
      setFiltered(brands);
    }
  }, [search, brands]);

  const fetchArticlesByBrand = async (brandID) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BRAND_BASE_URL}/brands/by-brand/${brandID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setArticles(data);
      setShowArticlesModal(true);
    } catch (err) {
      console.error("Failed to fetch articles for brand:", err);
    }
  };
  const fetchSingleBrand = async (brandID) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BRAND_BASE_URL}/brands/${brandID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      console.log("Single Brand Detail:", data);
      setSingleBrand(data);
      setShowBrandModal(true);
    } catch (err) {
      console.error("Failed to fetch brand details:", err);
    }
  };
  const fetchBrandsByCustomer = async (kundeID) => {
    const kundeId = kundeID.slice(0, 3);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BRAND_BASE_URL}/brands/by-customer/${kundeId}`,
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
      setCustomerBrands(data); // Save to state
      setShowBrandsModal(true); // Open modal
      console.log("Brands for Customer:", data);
    } catch (err) {
      console.error("Failed to fetch brands for customer:", err);
    }
  };
  const fetchBrandKontingentSummary = async (brandID) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BRAND_BASE_URL}/brands/${brandID}/summary`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      console.log("Brand Kontingent Summary:", data);
      setKontingentSummary(data); // set data to state
      setShowKontingentModal(true); // open modal
    } catch (err) {
      console.error("Failed to fetch kontingent summary:", err);
    }
  };
  const fetchBrandLogs = async (brandID) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BRAND_BASE_URL}/brands/${brandID}/logs`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      console.log("Brand Logs:", data);
      setBrandLogs(data); // save to state
      setShowBrandLogsModal(true); // open modal
    } catch (err) {
      console.error("Failed to fetch brand logs:", err);
    }
  };
  const fetchBrandLogByID = async (logID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BRAND_BASE_URL}/brands/logs/${logID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error("Fehler beim Laden des Brand-Logs");

      const data = await res.json();
      setBrandLogDetail(data);
      setShowBrandLogModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`${BRAND_BASE_URL}/brands/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Marke erfolgreich gelöscht.");
      fetchBrands();
    } catch (err) {
      console.error("Delete brand failed:", err);
      toast.error("Fehler beim Löschen der Marke.");
    }
  };

  const handleExport = (format) => {
    window.open(`${BRAND_BASE_URL}/brands/export?format=${format}`, "_blank");
  };
  const handleExportBrandLogs = (format, brandId = null) => {
    const query = new URLSearchParams({ format });
    if (brandId) query.append("brand_id", brandId);

    window.open(
      `${BRAND_BASE_URL}/brands/logs/export?${query.toString()}`,
      "_blank"
    );
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <h1 className="text-2xl font-bold mb-4">Markenverwaltung</h1>
      {loading ? (
        <div>
          <UserLoader />
        </div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}>
          <div className="flex flex-col justify-between  mb-4 gap-4">
            <div className="flex items-center justify-between ">
              <h2 className="text-xl font-semibold text-[#412666] mb-4">
                Marken
              </h2>
              <button
                onClick={() => setCreateModal(true)}
                className=" py-[6px] px-[16px] bg-[#412666] rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300 text-white">
                <Add /> Marke erstellen
              </button>
            </div>

            <section className="flex items-center justify-between">
              <div className="border border-[#412666] rounded-lg px-4 w-1/3 flex items-center gap-2">
                <Search />
                <input
                  type="text"
                  placeholder="Suche nach Brand, Firma oder ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="py-2 w-full focus:outline-none"
                />
              </div>

              <div className="relative inline-block text-left">
                <button
                  onClick={() => setOpenFormats(!openFormats)}
                  className="border border-[#412666] px-4 py-2 rounded-lg text-sm text-[#412666] hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                  Exportieren ▾
                </button>

                {openFormats && (
                  <div className="absolute mt-2 w-48 right-0 bg-white border border-gray-200 rounded-lg shadow z-50 p-2">
                    {["csv", "xlsx", "pdf"].map((format) => (
                      <button
                        key={format}
                        onClick={() => {
                          handleExport(format);
                          setOpenFormats(false); // Close dropdown after click
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        {format.toUpperCase()} Exportieren
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Brandname</th>
                <th className="py-2 px-3">Kunde-ID</th>
                <th className="py-2 px-3">Kunde Firma</th>
                <th className="py-2 px-3">Kontingent</th>
                <th className="py-2 px-3">Gebuchte </th>
                <th className="py-2 px-3">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((brand) => (
                <tr
                  key={brand.ID}
                  className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-3">{brand.ID}</td>
                  <td className="py-2 px-3">{brand.Brandname}</td>
                  <td className="py-2 px-3">{brand.KundeID || "—"}</td>
                  <td className="py-2 px-3">{brand.KundeFirma || "—"}</td>
                  <td className="py-2 px-3">{brand.BuchungsKontingent}</td>
                  <td className="py-2 px-3">{brand.Belegt || 0}</td>

                  <td className="py-2 px-3 space-x-2">
                    <select
                      onChange={(e) => {
                        const action = e.target.value;
                        if (!action) return;

                        switch (action) {
                          case "view":
                            fetchSingleBrand(brand.ID);
                            break;
                          case "edit":
                            setSelectedBrand(brand);
                            setEditModal(true);
                            break;
                          case "articles":
                            fetchArticlesByBrand(brand.ID);
                            break;
                          case "summary":
                            fetchBrandsByCustomer(brand.ID);
                            break;
                          case "kontingent":
                            fetchBrandKontingentSummary(brand.ID);
                            break;
                          case "logs":
                            fetchBrandLogs(brand.ID);
                            break;
                          case "delete":
                            handleDelete(brand.ID);
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
                      <option value="articles">Artikel</option>
                      <option value="summary">Markenzusammenfassung</option>
                      <option value="kontingent">
                        Kontingent Zusammenfassung
                      </option>
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
      {createModal && (
        <CreateBrandModal
          createModal={createModal}
          setCreateModal={setCreateModal}
          fetchBrands={fetchBrands}
        />
      )}
      {editModal && selectedBrand && (
        <UpdateBrandModal
          brand={selectedBrand}
          setEditModal={setEditModal}
          fetchBrands={fetchBrands}
        />
      )}
      {/* ARTICLES MODAL */}
      {showArticlesModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Markenartikel
            </h2>

            <div className="space-y-4 text-sm text-gray-700 max-h-[400px] overflow-y-auto pr-2">
              {articles.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Artikel gefunden.
                </p>
              ) : (
                articles.map((article) => (
                  <div
                    key={article.ID}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-semibold">Artikelname:</span>
                      <span>{article.Artikelname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Marke:</span>
                      <span>{article.Brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Kunde:</span>
                      <span>{article.Kunde}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Stückzahl/Monat:</span>
                      <span>{article.StueckzahlProMonat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Versandart:</span>
                      <span>{article.Versandart}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Format:</span>
                      <span>{article.Format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Frankierung:</span>
                      <span>{article.Frankierung}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowArticlesModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}

      {showBrandModal && singleBrand && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Markendetails
            </h2>

            <div className="text-gray-700 text-sm space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold">Marken-ID:</span>
                <span>{singleBrand.ID}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Brandname:</span>
                <span>{singleBrand.Brandname}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde:</span>
                <span>{singleBrand.Kunde || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kontingent:</span>
                <span>{singleBrand.BuchungsKontingent}</span>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold">Archiviert:</span>
                <span>{singleBrand.Archiviert ? "Ja" : "Nein"}</span>
              </div>
            </div>

            <button
              onClick={() => setShowBrandModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* show all brands that a user has  */}
      {showBrandsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Marken dieses Kunden
            </h2>

            <div className="space-y-4 text-sm text-gray-700 max-h-[400px] overflow-y-auto pr-2">
              {customerBrands.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Marken gefunden.
                </p>
              ) : (
                customerBrands.map((brand) => (
                  <div
                    key={brand.ID}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-semibold">Brand ID:</span>
                      <span>{brand.ID}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Brandname:</span>
                      <span>{brand.Brandname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Kunde:</span>
                      <span>{brand.Kunde || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Kontingent:</span>
                      <span>{brand.BuchungsKontingent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Status:</span>
                      <span
                        className={
                          brand.is_active ? "text-green-600" : "text-red-600"
                        }>
                        {brand.is_active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Archiviert:</span>
                      <span>{brand.Archiviert ? "Ja" : "Nein"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowBrandsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}

      {showKontingentModal && kontingentSummary && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kontingentübersicht
            </h2>

            <div className="space-y-3 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span className="font-semibold">Brand ID:</span>
                <span>{kontingentSummary.ID}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Brandname:</span>
                <span>{kontingentSummary.Brandname}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kontingent:</span>
                <span>{kontingentSummary.BuchungsKontingent}</span>
              </div>
            </div>

            <button
              onClick={() => setShowKontingentModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showBrandLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Markenprotokolle
            </h2>

            <div className="space-y-4 text-sm text-gray-700 max-h-[400px] overflow-y-auto pr-2">
              {brandLogs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Protokolle gefunden.
                </p>
              ) : (
                brandLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50 cursor-pointer"
                    onClick={() => fetchBrandLogByID(log.id)}>
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
                      <span>{log.user_agent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">User ID:</span>
                      <span>{log.user_id}</span>
                    </div>
                  </div>
                ))
              )}
              {brandLogs.length >= 1 && (
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setOpenBrandExport(!openBrandExport)}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm text-[#412666] hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                    Exportieren ▾
                  </button>

                  {openBrandExport && (
                    <div className="absolute mt-2 w-56 left-0 top-[-150px] bg-white border border-gray-200 rounded-lg shadow z-50 p-2">
                      <button
                        onClick={() => {
                          handleExportBrandLogs("csv");
                          setOpenBrandExport(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 text-center">
                        CSV Exportieren
                      </button>

                      <button
                        onClick={() => {
                          handleExportBrandLogs("xls", "B011");
                          setOpenBrandExport(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 text-center">
                        XLS Exportieren (B011)
                      </button>

                      <button
                        onClick={() => {
                          handleExportBrandLogs("pdf");
                          setOpenBrandExport(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 text-center">
                        PDF Exportieren
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowBrandLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showBrandLogModal && brandLogDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Brand-Log Detail (ID: {brandLogDetail.id})
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Aktion:</span>
                <span>{brandLogDetail.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Details:</span>
                <span>{brandLogDetail.details}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entität:</span>
                <span>{brandLogDetail.entity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entitäts-ID:</span>
                <span>{brandLogDetail.entity_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde-ID:</span>
                <span>{brandLogDetail.kunde_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">IP-Adresse:</span>
                <span>{brandLogDetail.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User-Agent:</span>
                <span className="break-words max-w-[60%]">
                  {brandLogDetail.user_agent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User ID:</span>
                <span>{brandLogDetail.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zeitstempel:</span>
                <span>
                  {new Date(brandLogDetail.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowBrandLogModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Brand;
