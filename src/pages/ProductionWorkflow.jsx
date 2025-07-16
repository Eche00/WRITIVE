import React, { useEffect, useState } from "react";
import {
  Delete,
  Edit,
  PlayArrow,
  Add,
  BarChart,
  Visibility,
  LocationOn,
} from "@mui/icons-material";

const BASE_URL = "https://cb49a05985a8.ngrok-free.app";

const ProductionWorkflow = () => {
  const [productions, setProductions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [articles, setArticles] = useState([]);
  const [search, setSearch] = useState("");
  const [editingProductionId, setEditingProductionId] = useState(null);
  const [editingProduction, setEditingProduction] = useState({});
  const [showProductionLogsModal, setShowProductionLogsModal] = useState(false);
  const [productionLogs, setProductionLogs] = useState([]);
  const [showProductioneModal, setShowProductioneModal] = useState(false);
  const [selectedProductionID, setSelectedProductionID] = useState(null);
  const [showProductionLogDetailModal, setShowProductionLogDetailModal] =
    useState(false);
  const [productionLogDetail, setProductionLogDetail] = useState(null);
  const [statusModal, setStatusModal] = useState(false);
  const [statusInfo, setStatusInfo] = useState(null);
  const [progressModal, setProgressModal] = useState(false);
  const [progressProductionID, setProgressProductionID] = useState(null);
  const [statusInput, setStatusInput] = useState({});
  const [statusInputKey, setStatusInputKey] = useState(null);
  const statusInputMap = {
    "In Progress": "CleanDataPcs",
    "Quality Check Started": "CleanPcs",
  };

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduction, setNewProduction] = useState({
    KundeID: "",
    BrandID: "",
    CampaignID: "",
    ArtikelID: "",
    GeaenderteStueckzahl: "",
    StandardStueckzahl: "",
  });

  const fetchProductions = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/production/?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setProductions(data?.productions || []);
    } catch (err) {
      console.error("Fetch production failed:", err);
    }
  };
  const fetchCustomers = async (query = "") => {
    try {
      const token = localStorage.getItem("token"); // or however you store the token
      const res = await fetch(`${BASE_URL}/customers/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true", // <-- this fixes it
        },
      });
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };
  const fetchBrands = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/brands/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setBrands(data);
    } catch (err) {
      console.error("Failed to fetch brands:", err);
    }
  };
  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/campaigns/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };
  const fetchArticles = async () => {
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
    }
  };
  const fetchSingleProduct = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/production/${id}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setSelectedProductionID(data); // This is now production data
      setShowProductioneModal(true);
    } catch (err) {
      console.error("Error fetching production:", err);
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
        body: JSON.stringify({
          ...newProduction,
          GeaenderteStueckzahl: Number(newProduction.GeaenderteStueckzahl),
          StandardStueckzahl: Number(newProduction.StandardStueckzahl),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Creation failed.");
      }

      // Optional: Show message or update UI with data.production
      console.log("✅ Created:", data.production);

      setNewProduction({
        KundeID: "",
        BrandID: "",
        CampaignID: "",
        ArtikelID: "",
        GeaenderteStueckzahl: "",
        StandardStueckzahl: "",
      });

      setShowCreateModal(false);
      fetchProductions(); // Refresh list
    } catch (err) {
      console.log("❌ Failed to create production:", err.message);
    }
  };

  const handleUpdateProduction = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/production/edit/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          KundeID: editingProduction.KundeID,
          BrandID: editingProduction.BrandID,
          ArtikelID: editingProduction.ArtikelID,
          GeaenderteStueckzahl: Number(editingProduction.GeaenderteStueckzahl),
          StandardStueckzahl: Number(editingProduction.StandardStueckzahl),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Update failed.");
      }

      const data = await res.json();
      console.log("✅ Update success:", data.message);

      setEditingProductionId(null);
      setEditingProduction({});
      fetchProductions();
    } catch (err) {
      console.error("❌ Update failed:", err);
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
  const fetchProductionStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/production/${id}/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) throw new Error("Failed to fetch status");

      const data = await res.json();
      setStatusInfo(data);
      setStatusModal(true);
    } catch (err) {
      console.error("❌ Status check failed:", err);
    }
  };
  const openProgressModal = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/production/${id}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      const inputKey = data.requires_input
        ? statusInputMap[data.current_status]
        : null;

      setProgressProductionID(id);
      setStatusInputKey(inputKey);
      setStatusInput({});
      setProgressModal(true);
    } catch (err) {
      console.error("Failed to fetch status info:", err);
    }
  };

  const handleAdvanceStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${BASE_URL}/production/${progressProductionID}/status`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(statusInput),
        }
      );

      const data = await res.json();
      console.log(data.message || "Status aktualisiert");
      setProgressModal(false);
      setProgressProductionID(null);
      setStatusInput({});
      fetchProductions(); // Refresh list
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  useEffect(() => {
    fetchProductions();
    fetchCustomers();
    fetchBrands();
    fetchCampaigns();
    fetchArticles();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFiltered(
        productions.filter(
          (p) =>
            p.ArtikelName?.toLowerCase().includes(q) ||
            p.ID?.toLowerCase().includes(q) ||
            p.Status?.toLowerCase().includes(q)
        )
      );
    } else {
      setFiltered(productions);
    }
  }, [search, productions]);
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

      <div className="flex gap-3 mb-4 ">
        <div className="flex flex-1 gap-3 items-center">
          <input
            type="text"
            placeholder="Suche nach ID, Artikelname oder Status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-4 py-2 rounded w-1/3 "
          />
        </div>

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
            <th className="py-2 px-3">Artikelname</th>
            <th className="py-2 px-3">Status</th>
            <th className="py-2 px-3">Stückzahl (Standard / Geändert)</th>
            <th className="py-2 px-3">Zusatzinfos</th>
            <th className="py-2 px-3">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr
              key={p.ID}
              className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-3">{p.ID}</td>
              <td className="py-2 px-3">{p.ArtikelName}</td>
              <td className="py-2 px-3">{p.Status}</td>
              <td className="py-2 px-3">
                {p.StandardStueckzahl} / {p.GeaenderteStueckzahl}
              </td>
              <td className="py-2 px-3">{p.Zusatzinfos || "-"}</td>
              <td className="p-2 flex gap-2 flex-wrap">
                <button
                  onClick={() => fetchSingleProduct(p.ID)}
                  className="relative group cursor-pointer  text-[#4A90E2]">
                  <Visibility />{" "}
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Anzeigen
                  </span>
                </button>

                <button
                  onClick={() => {
                    setEditingProductionId(p.ID);
                    setEditingProduction({
                      Produktionsnummer: p.Produktionsnummer,
                      Status: p.Status,
                      KundeID: p.KundeID,
                      BrandID: p.BrandID,
                      ArtikelID: p.ArtikelID,
                      GeaenderteStueckzahl: p.GeaenderteStueckzahl,
                      StandardStueckzahl: p.StandardStueckzahl,
                    });
                  }}
                  className="relative group cursor-pointer ">
                  <Edit fontSize="small" />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Bearbeiten
                  </span>
                </button>

                <button
                  onClick={() => fetchProductionStatus(p.ID)}
                  className="relative group cursor-pointer ">
                  <LocationOn fontSize="small" />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Status prüfen
                  </span>
                </button>
                <button
                  onClick={() => openProgressModal(p.ID, p.requires_input)}
                  className="relative group cursor-pointer ">
                  <PlayArrow fontSize="small" />
                  <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                    Status fortschreiten
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
      {showProductioneModal && selectedProductionID && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full relative max-h-[95vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Produktionsdetails
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              {/* Basic Info */}
              <div>
                <span className="font-semibold">Artikelname:</span>{" "}
                {selectedProductionID.ArtikelName || "—"}
              </div>
              <div>
                <span className="font-semibold">Artikel ID:</span>{" "}
                {selectedProductionID.ArtikelID || "—"}
              </div>
              <div>
                <span className="font-semibold">Brand:</span>{" "}
                {selectedProductionID.BrandName || "—"}
              </div>
              <div>
                <span className="font-semibold">Brand ID:</span>{" "}
                {selectedProductionID.BrandID || "—"}
              </div>
              <div>
                <span className="font-semibold">Kunde:</span>{" "}
                {selectedProductionID.KundeName || "—"}
              </div>
              <div>
                <span className="font-semibold">Kunde ID:</span>{" "}
                {selectedProductionID.KundeID || "—"}
              </div>
              <div>
                <span className="font-semibold">Produktionsnummer:</span>{" "}
                {selectedProductionID.Produktionsnummer || "—"}
              </div>
              <div>
                <span className="font-semibold">Status:</span>{" "}
                {selectedProductionID.Status || "—"}
              </div>
              <div>
                <span className="font-semibold">Geänderte Stückzahl:</span>{" "}
                {selectedProductionID.GeaenderteStueckzahl || "—"}
              </div>
              <div>
                <span className="font-semibold">Standard Stückzahl:</span>{" "}
                {selectedProductionID.StandardStueckzahl || "—"}
              </div>
              <div>
                <span className="font-semibold">Genug Material:</span>{" "}
                <span
                  className={
                    selectedProductionID.GenugMaterial
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }>
                  {selectedProductionID.GenugMaterial ? "Ja" : "Nein"}
                </span>
              </div>
              <div>
                <span className="font-semibold">Zusatzinfos:</span>{" "}
                {selectedProductionID.Zusatzinfos || "—"}
              </div>
              <div>
                <span className="font-semibold">Aufbereitete Stückzahl:</span>{" "}
                {selectedProductionID.AufbereiteteStueckzahl || 0}
              </div>
              <div>
                <span className="font-semibold">Geprüfte Stückzahl:</span>{" "}
                {selectedProductionID.GepruefteStueckzahl || 0}
              </div>

              {/* Boolean and Timestamp flags */}
              <div>
                <span className="font-semibold">
                  Daten Aufbereitung gestartet:
                </span>{" "}
                {selectedProductionID.DatenAufbereitungStart ? "Ja" : "Nein"}
              </div>
              <div>
                <span className="font-semibold">Daten Aufbereitung Zeit:</span>{" "}
                {selectedProductionID.DatenAufbereitungStartZeit
                  ? new Date(
                      selectedProductionID.DatenAufbereitungStartZeit
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>
              <div>
                <span className="font-semibold">Daten Aufbereitet:</span>{" "}
                {selectedProductionID.DatenAufbereitet ? "Ja" : "Nein"}
              </div>
              <div>
                <span className="font-semibold">Daten Aufbereitet Zeit:</span>{" "}
                {selectedProductionID.DatenAufbereitetZeit
                  ? new Date(
                      selectedProductionID.DatenAufbereitetZeit
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>

              <div>
                <span className="font-semibold">Produktion gestartet:</span>{" "}
                {selectedProductionID.ProduktionGestartet ? "Ja" : "Nein"}
              </div>
              <div>
                <span className="font-semibold">Produktionsstart:</span>{" "}
                {selectedProductionID.Produktionsstart
                  ? new Date(
                      selectedProductionID.Produktionsstart
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>
              <div>
                <span className="font-semibold">Produktion abgeschlossen:</span>{" "}
                {selectedProductionID.ProduktionAbgeschlossen ? "Ja" : "Nein"}
              </div>
              <div>
                <span className="font-semibold">Produktionsende:</span>{" "}
                {selectedProductionID.Produktionsende
                  ? new Date(
                      selectedProductionID.Produktionsende
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>

              <div>
                <span className="font-semibold">
                  Qualitätskontrolle gestartet:
                </span>{" "}
                {selectedProductionID.QualitaetskontrolleGestartet
                  ? "Ja"
                  : "Nein"}
              </div>
              <div>
                <span className="font-semibold">
                  Qualitätskontrolle gestartet Zeit:
                </span>{" "}
                {selectedProductionID.QualitaetskontrolleGestartetZeit
                  ? new Date(
                      selectedProductionID.QualitaetskontrolleGestartetZeit
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>
              <div>
                <span className="font-semibold">
                  Qualitätskontrolle durchgeführt:
                </span>{" "}
                {selectedProductionID.QualitaetskontrolleDurchgefuehrt
                  ? "Ja"
                  : "Nein"}
              </div>
              <div>
                <span className="font-semibold">
                  Qualitätskontrolle durchgeführt Zeit:
                </span>{" "}
                {selectedProductionID.QualitaetskontrolleDurchgefuehrtZeit
                  ? new Date(
                      selectedProductionID.QualitaetskontrolleDurchgefuehrtZeit
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>

              <div>
                <span className="font-semibold">Versandbereit:</span>{" "}
                {selectedProductionID.Versandbereit ? "Ja" : "Nein"}
              </div>
              <div>
                <span className="font-semibold">Versandbereit Zeit:</span>{" "}
                {selectedProductionID.VersandbereitZeit
                  ? new Date(
                      selectedProductionID.VersandbereitZeit
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>
              <div>
                <span className="font-semibold">Versendet:</span>{" "}
                {selectedProductionID.Versendet ? "Ja" : "Nein"}
              </div>
              <div>
                <span className="font-semibold">Versendet Zeit:</span>{" "}
                {selectedProductionID.VersendetZeit
                  ? new Date(selectedProductionID.VersendetZeit).toLocaleString(
                      "de-DE"
                    )
                  : "—"}
              </div>

              {/* Gep timestamps */}
              <div>
                <span className="font-semibold">GEP Produktionsstart:</span>{" "}
                {selectedProductionID.gep_Produktionsstart
                  ? new Date(
                      selectedProductionID.gep_Produktionsstart
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>
              <div>
                <span className="font-semibold">GEP Sendout Datum:</span>{" "}
                {selectedProductionID.gep_SendoutDatum
                  ? new Date(
                      selectedProductionID.gep_SendoutDatum
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>

              <div>
                <span className="font-semibold">Abgeschlossen:</span>{" "}
                {selectedProductionID.Abgeschlossen ? "Ja" : "Nein"}
              </div>
              <div>
                <span className="font-semibold">Abgeschlossen Zeit:</span>{" "}
                {selectedProductionID.AbgeschlossenZeit
                  ? new Date(
                      selectedProductionID.AbgeschlossenZeit
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>

              {/* Final */}
              <div>
                <span className="font-semibold">Erstellt am:</span>{" "}
                {selectedProductionID.ErstellungsDatum
                  ? new Date(
                      selectedProductionID.ErstellungsDatum
                    ).toLocaleString("de-DE")
                  : "—"}
              </div>
            </div>

            <button
              onClick={() => setShowProductioneModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}

      {editingProductionId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Produktion bearbeiten
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              {/* KundeID */}
              <div>
                <label className="block font-medium">Kunde-ID:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                  value={editingProduction.KundeID}
                  readOnly
                />
              </div>

              {/* BrandID */}
              <div>
                <label className="block font-medium">Brand-ID:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                  value={editingProduction.BrandID}
                  readOnly
                />
              </div>

              {/* ArtikelID */}
              <div>
                <label className="block font-medium">Artikel-ID:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded bg-gray-100 text-gray-600 cursor-not-allowed"
                  value={editingProduction.ArtikelID}
                  readOnly
                />
              </div>

              {/* Standard Stückzahl */}
              <div>
                <label className="block font-medium">Standard Stückzahl:</label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={editingProduction.StandardStueckzahl}
                  onChange={(e) =>
                    setEditingProduction({
                      ...editingProduction,
                      StandardStueckzahl: e.target.value,
                    })
                  }
                />
              </div>

              {/* Geänderte Stückzahl */}
              <div>
                <label className="block font-medium">
                  Geänderte Stückzahl:
                </label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={editingProduction.GeaenderteStueckzahl}
                  onChange={(e) =>
                    setEditingProduction({
                      ...editingProduction,
                      GeaenderteStueckzahl: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setEditingProductionId(null);
                  setEditingProduction({});
                }}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={() => handleUpdateProduction(editingProductionId)}
                className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
                Aktualisieren
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-[600px] w-full relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 ">
              {/* KundeID Dropdown */}
              <div>
                <label className="block font-medium">Kunde-ID:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={newProduction.KundeID}
                  onChange={(e) =>
                    setNewProduction({
                      ...newProduction,
                      KundeID: e.target.value,
                    })
                  }>
                  <option value="">— Bitte wählen —</option>
                  {customers.map((c) => (
                    <option key={c.ID} value={c.ID}>
                      {c.ID}
                    </option>
                  ))}
                </select>
              </div>

              {/* BrandID Dropdown */}
              <div>
                <label className="block font-medium">Brand-ID:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={newProduction.BrandID}
                  onChange={(e) =>
                    setNewProduction({
                      ...newProduction,
                      BrandID: e.target.value,
                    })
                  }>
                  <option value="">— Bitte wählen —</option>
                  {brands.map((b) => (
                    <option key={b.ID} value={b.ID}>
                      {b.ID}
                    </option>
                  ))}
                </select>
              </div>

              {/* CampaignID Dropdown */}
              <div>
                <label className="block font-medium">Campaign-ID:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={newProduction.CampaignID}
                  onChange={(e) =>
                    setNewProduction({
                      ...newProduction,
                      CampaignID: e.target.value,
                    })
                  }>
                  <option value="">— Bitte wählen —</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id}
                    </option>
                  ))}
                </select>
              </div>

              {/* ArtikelID Dropdown */}
              <div>
                <label className="block font-medium">Artikel-ID:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={newProduction.ArtikelID}
                  onChange={(e) =>
                    setNewProduction({
                      ...newProduction,
                      ArtikelID: e.target.value,
                    })
                  }>
                  <option value="">— Bitte wählen —</option>
                  {articles.map((a) => (
                    <option key={a.ID} value={a.ID}>
                      {a.ID} - {a.Artikelname}
                    </option>
                  ))}
                </select>
              </div>

              {/* Standard Stückzahl */}
              <div>
                <label className="block font-medium">Standard Stückzahl:</label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={newProduction.StandardStueckzahl}
                  onChange={(e) =>
                    setNewProduction({
                      ...newProduction,
                      StandardStueckzahl: e.target.value,
                    })
                  }
                />
              </div>

              {/* Geänderte Stückzahl */}
              <div>
                <label className="block font-medium">
                  Geänderte Stückzahl:
                </label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={newProduction.GeaenderteStueckzahl}
                  onChange={(e) =>
                    setNewProduction({
                      ...newProduction,
                      GeaenderteStueckzahl: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-4 mt-6 w-full ">
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

      {progressModal && progressProductionID && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold text-[#412666] mb-4 text-center">
              Status fortschreiten
            </h2>

            {/* Optional input for CleanDataPcs or CleanPcs */}
            {(statusInputKey === "CleanDataPcs" ||
              statusInputKey === "CleanPcs") && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {statusInputKey === "CleanDataPcs"
                    ? "Gereinigte Datenstücke (CleanDataPcs)"
                    : "Gereinigte Stückzahl (CleanPcs)"}
                </label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={statusInput[statusInputKey] || ""}
                  onChange={(e) =>
                    setStatusInput({ [statusInputKey]: Number(e.target.value) })
                  }
                />
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setProgressModal(false);
                  setProgressProductionID(null);
                  setStatusInput({});
                }}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={handleAdvanceStatus}
                className="w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
                Weiter
              </button>
            </div>
          </div>
        </div>
      )}

      {statusModal && statusInfo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-xl font-bold text-[#412666] mb-4 text-center">
              Produktionsstatus
            </h2>

            <div className="space-y-2 text-gray-800 text-sm">
              <div>
                <span className="font-medium">Produktions-ID:</span>{" "}
                {statusInfo.production_id}
              </div>
              <div>
                <span className="font-medium">Aktueller Status:</span>{" "}
                {statusInfo.current_status}
              </div>
              <div>
                <span className="font-medium">Nächster Status:</span>{" "}
                {statusInfo.next_status || "—"}
              </div>
              <div>
                <span className="font-medium">Benötigt Eingabe:</span>{" "}
                {statusInfo.requires_input ? "Ja" : "Nein"}
              </div>
            </div>

            <button
              onClick={() => {
                setStatusModal(false);
                setStatusInfo(null);
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
                      <strong>Aktion:</strong> {log.action || "—"}
                    </div>
                    <div>
                      <strong>Details:</strong> {log.details || "—"}
                    </div>
                    <div>
                      <strong>Entität:</strong> {log.entity || "—"}
                    </div>
                    <div>
                      <strong>Entitäts-ID:</strong> {log.entity_id || "—"}
                    </div>
                    <div>
                      <strong>Zeitstempel:</strong>{" "}
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString("de-DE")
                        : "—"}
                    </div>
                    <div>
                      <strong>IP-Adresse:</strong> {log.ip_address || "—"}
                    </div>
                    <div>
                      <strong>Kunde-ID:</strong> {log.kunde_id || "—"}
                    </div>
                    <div>
                      <strong>User-Agent:</strong> {log.user_agent || "—"}
                    </div>
                    <div>
                      <strong>Benutzer-ID:</strong> {log.user_id || "—"}
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
