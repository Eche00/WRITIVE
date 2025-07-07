import React, { useEffect, useState } from "react";
import {
  Article,
  BarChart,
  BrandingWatermark,
  Delete,
  Edit,
  NoteAdd,
  Search,
  Summarize,
  Visibility,
} from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import CreateBrandModal from "./CreateBrandModal";
import UpdateBrandModal from "./UpdateBrandModal";
import Articles from "./Articles";
import Categories from "./Categories";

const BRAND_BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

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
  const [brandSummary, setBrandSummary] = useState(null);
  const [showBrandSummaryModal, setShowBrandSummaryModal] = useState(false);
  const [singleBrand, setSingleBrand] = useState(null);
  const [showBrandModal, setShowBrandModal] = useState(false);
  // 1. Add state at the top of your component
  const [customerBrands, setCustomerBrands] = useState([]);
  const [showBrandsModal, setShowBrandsModal] = useState(false);
  const [kontingentSummary, setKontingentSummary] = useState(null);
  const [showKontingentModal, setShowKontingentModal] = useState(false);
  const [brandLogs, setBrandLogs] = useState([]);
  const [showBrandLogsModal, setShowBrandLogsModal] = useState(false);
  const [viewArticles, setViewarticles] = useState(false);
  const [showBrandLogModal, setShowBrandLogModal] = useState(false);
  const [brandLogDetail, setBrandLogDetail] = useState(null);

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
            b.Brandname.toLowerCase().includes(q) ||
            b.Firmenname.toLowerCase().includes(q) ||
            b.ID.toLowerCase().includes(q)
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
  const fetchBrandSummary = async (brandID) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BRAND_BASE_URL}/brands/summary/${brandID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      console.log("Brand Summary:", data);
      setBrandSummary(data);
      setShowBrandSummaryModal(true);
    } catch (err) {
      console.error("Failed to fetch brand summary:", err);
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
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BRAND_BASE_URL}/brands/by-customer/${kundeID}`,
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
      fetchBrands();
    } catch (err) {
      console.error("Delete brand failed:", err);
    }
  };

  const handleExport = (format) => {
    window.open(`${BRAND_BASE_URL}/brands/export?format=${format}`, "_blank");
  };
  const handleExportBrandLogs = (format, brandId = null) => {
    const query = new URLSearchParams({ format });
    if (brandId) query.append("brand_id", brandId);

    window.open(`${BASE_URL}/brands/logs/export?${query.toString()}`, "_blank");
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <h1 className="text-2xl font-bold mb-4">
        {viewArticles ? "Artikelverwaltung" : "Markenverwaltung"}
      </h1>
      {viewArticles ? (
        <Articles setViewarticles={setViewarticles} />
      ) : (
        <>
          <div className="flex flex-col justify-between  mb-4 gap-4">
            <section className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#412666] mb-4">
                Marken
              </h2>
              <div className="flex items-center gap-[10px] text-white text-[12px]">
                <button
                  onClick={() => setViewarticles(true)}
                  className=" py-[6px] px-[16px] border border-[#412666] text-[#412666] rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300">
                  Artikel anzeigen
                </button>

                <button
                  onClick={() => setCreateModal(true)}
                  className=" py-[6px] px-[16px] bg-[#412666] rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300">
                  Marke erstellen
                </button>
              </div>
            </section>

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

              <div className="flex gap-2">
                {["csv", "xlsx", "pdf"].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleExport(format)}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300">
                    {format.toUpperCase()} Export
                  </button>
                ))}
              </div>
            </section>
          </div>

          {loading ? (
            <div>
              <UserLoader />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-[#412666] border-b border-gray-200">
                <tr>
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Brandname</th>
                  <th className="py-2 px-3">Firma</th>
                  <th className="py-2 px-3">Kunde</th>
                  <th className="py-2 px-3">Kontingent</th>
                  <th className="py-2 px-3">Belegt</th>
                  <th className="py-2 px-3">Verbleibend</th>
                  <th className="py-2 px-3">Status</th>
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
                    <td className="py-2 px-3">{brand.Firmenname}</td>
                    <td className="py-2 px-3">{brand.KundeFirma}</td>
                    <td className="py-2 px-3">{brand.Kontingent}</td>
                    <td className="py-2 px-3">{brand.Belegt}</td>
                    <td className="py-2 px-3">{brand.Verbleibend}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                          brand.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                        <span className="w-2 h-2 bg-current rounded-full"></span>
                        {brand.is_active ? "Aktiv" : "Inaktiv"}
                      </span>
                    </td>
                    <td className="py-2 px-3 space-x-2">
                      <button
                        onClick={() => fetchSingleBrand(brand.ID)}
                        className="relative group cursor-pointer  text-[#4A90E2]">
                        <Visibility />{" "}
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Anzeigen
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedBrand(brand);
                          setEditModal(true);
                        }}
                        className="relative group cursor-pointer text-blue-700">
                        <Edit fontSize="small" />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Bearbeiten
                        </span>
                      </button>
                      <button
                        onClick={() => fetchArticlesByBrand(brand.ID)}
                        className="relative group cursor-pointer text-[#9B9B9B]">
                        <Article />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Artikel
                        </span>
                      </button>

                      <button
                        onClick={() => fetchBrandSummary(brand.ID)}
                        className="relative group cursor-pointer   text-[#50E3C2]">
                        <Summarize fontSize="small" />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Zusammenfassung
                        </span>
                      </button>
                      <button
                        onClick={() => fetchBrandsByCustomer(brand.ID)}
                        className="relative group cursor-pointer  text-green-700">
                        <BrandingWatermark />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Markenzusammenfassung
                        </span>
                      </button>
                      <button
                        onClick={() => fetchBrandKontingentSummary(brand.ID)}
                        className="relative group cursor-pointer  text-green-400">
                        <NoteAdd />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Kontingent Zusammenfassung
                        </span>
                      </button>
                      <button
                        onClick={() => fetchBrandLogs(brand.ID)}
                        className="relative group cursor-pointer  text-[#F5A623]">
                        <BarChart />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Protokolle
                        </span>
                      </button>

                      <button
                        onClick={() => handleDelete(brand.ID)}
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
          )}
        </>
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
      {showBrandSummaryModal && brandSummary && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Markenübersicht
            </h2>

            <div className="text-gray-700 text-sm space-y-3">
              <div className="flex justify-between">
                <span className="font-semibold">Marken-ID:</span>
                <span>{brandSummary.BrandID}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Anzahl der Artikel:</span>
                <span>{brandSummary.TotalArticles}</span>
              </div>
            </div>

            <button
              onClick={() => setShowBrandSummaryModal(false)}
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
                <span className="font-semibold">Firmenname:</span>
                <span>{singleBrand.Firmenname}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Brandname:</span>
                <span>{singleBrand.Brandname}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde:</span>
                <span>{singleBrand.Kunde}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kontingent:</span>
                <span>{singleBrand.Kontingent}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Belegt:</span>
                <span>{singleBrand.Belegt}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Verbleibend:</span>
                <span>{singleBrand.Verbleibend}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span
                  className={`font-medium ${
                    singleBrand.is_active ? "text-green-600" : "text-red-600"
                  }`}>
                  {singleBrand.is_active ? "Aktiv" : "Inaktiv"}
                </span>
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
                      <span className="font-semibold">Firma:</span>
                      <span>{brand.Firmenname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Kunde:</span>
                      <span>{brand.Kunde}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Kontingent:</span>
                      <span>{brand.Kontingent}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Belegt:</span>
                      <span>{brand.Belegt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Verbleibend:</span>
                      <span>{brand.Verbleibend}</span>
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
                <span>{kontingentSummary.Kontingent}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Belegt:</span>
                <span>{kontingentSummary.Belegt}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Verbleibend:</span>
                <span>{kontingentSummary.Verbleibend}</span>
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
                <div className="space-x-2 flex items-center justify-between">
                  <button
                    onClick={() => handleExportBrandLogs("csv")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                    Exportiere CSV
                  </button>

                  <button
                    onClick={() => handleExportBrandLogs("xls", "B011")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                    Exportiere XLS (B011)
                  </button>

                  <button
                    onClick={() => handleExportBrandLogs("pdf")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                    Exportiere PDF
                  </button>
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

      <Categories />
    </div>
  );
}

export default Brand;
