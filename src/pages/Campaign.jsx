// Campaign.jsx
import React, { useEffect, useState } from "react";
import {
  Visibility,
  Delete,
  Edit,
  Search,
  Summarize,
  NoteAdd,
  Article,
  BarChart,
  BrandingWatermark,
  Timeline,
  Add,
} from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import CampaignBatches from "./CampaignBatches";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const Campaign = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [singleCampaign, setSingleCampaign] = useState(null);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showUpdateCampaignModal, setShowUpdateCampaignModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [updatedCampaign, setUpdatedCampaign] = useState({});
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [timelineData, setTimelineData] = useState([]);
  const [timelineCampaignID, setTimelineCampaignID] = useState(null);
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [batchCampaignID, setBatchCampaignID] = useState(null);
  const [batchQuantity, setBatchQuantity] = useState(0);
  const [batchStatus, setBatchStatus] = useState("pending");
  const [batches, setBatches] = useState(false);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    ID: "",
    ArtikelID: "",
    Name: "",
    Description: "",
    StartDate: "",
    EndDate: "",
    CreditsUsed: 0,
    Status: "draft",
    ExpectedScans: 0,
    ConversionGoal: 0,
    StarRatingGoal: 0,
    QRCode: "",
  });

  // fetch and store valid articles
  const [articles, setArticles] = useState([]);
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/campaigns/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setCampaigns(data);
      setFiltered(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchArticles = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/products/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setArticles(data.articles);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setArticles([]); // fallback to empty array
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchArticles();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFiltered(
        campaigns.filter(
          (c) =>
            c.name?.toLowerCase().includes(q) ||
            c.id?.toLowerCase().includes(q) ||
            c.status?.toLowerCase().includes(q)
        )
      );
    } else {
      setFiltered(campaigns);
    }
  }, [search, campaigns]);
  useEffect(() => {
    if (selectedCampaign) {
      setUpdatedCampaign({
        id: selectedCampaign.id,
        Name: selectedCampaign.name,
        Description: selectedCampaign.description,
        ArtikelID: selectedCampaign.ArtikelID || "", // ensure this is passed
        StartDate: selectedCampaign.start_date,
        EndDate: selectedCampaign.end_date,
        CreditsUsed: selectedCampaign.credits_used,
        Status: selectedCampaign.status,
        ExpectedScans: selectedCampaign.expected_scans,
        ConversionGoal: selectedCampaign.conversion_goal,
        StarRatingGoal: selectedCampaign.star_rating_goal,
        QRCode: selectedCampaign.qr_code,
      });
    }
  }, [selectedCampaign]);
  const handleCreateCampaign = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/campaigns/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(newCampaign),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Kampagne erfolgreich erstellt!");
        setShowCreateCampaignModal(false);
        setNewCampaign({
          ID: "",
          ArtikelID: "",
          Name: "",
          Description: "",
          StartDate: "",
          EndDate: "",
          CreditsUsed: 0,
          Status: "draft",
          ExpectedScans: 0,
          ConversionGoal: 0,
          StarRatingGoal: 0,
          QRCode: "",
        });
        fetchCampaigns(); // reload list
      } else {
        console.error("Fehler beim Erstellen:", data);
        alert("Fehler beim Erstellen der Kampagne.");
      }
    } catch (err) {
      console.error("Netzwerkfehler:", err);
      alert("Netzwerkfehler beim Erstellen der Kampagne.");
    }
  };

  const fetchSingleCampaign = async (campaignID) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/campaigns/${campaignID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      console.log("Single Campaign Detail:", data);
      setSingleCampaign(data);
      setShowCampaignModal(true);
    } catch (err) {
      console.error("Failed to fetch campaign details:", err);
    }
  };

  const handleUpdateCampaign = async (campaignID) => {
    const token = localStorage.getItem("token");

    // Check for required fields
    const payload = {
      Name: updatedCampaign.Name || "",
      Description: updatedCampaign.Description || "",
      ArtikelID: updatedCampaign.ArtikelID || "",
      StartDate: updatedCampaign.StartDate || null,
      EndDate: updatedCampaign.EndDate || null,
      CreditsUsed: updatedCampaign.CreditsUsed ?? 0,
      Status: updatedCampaign.Status || "draft",
      ExpectedScans: updatedCampaign.ExpectedScans ?? 0,
      ConversionGoal: updatedCampaign.ConversionGoal ?? 0,
      StarRatingGoal: updatedCampaign.StarRatingGoal ?? 0,
      QRCode: updatedCampaign.QRCode || "",
    };

    console.log("Updating campaign with payload:", payload);

    try {
      const response = await fetch(`${BASE_URL}/campaigns/${campaignID}`, {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setShowUpdateCampaignModal(false);
        fetchCampaigns(); // reload list
      } else {
        console.error("Update error:", data);
      }
    } catch (error) {
      console.error("Update failed:", error);
      alert("Netzwerkfehler beim Aktualisieren der Kampagne.");
    }
  };
  const fetchCampaignTimeline = async (campaignID) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/campaigns/${campaignID}/timeline`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      if (res.ok) {
        setTimelineCampaignID(data.campaign_id);
        setTimelineData(data.timeline);
        setShowTimelineModal(true);
      } else {
        console.error("Timeline fetch error:", data);
        alert("Fehler beim Laden des Zeitplans.");
      }
    } catch (err) {
      console.error("Timeline fetch failed:", err);
      alert("Netzwerkfehler beim Laden des Kampagnen-Zeitplans.");
    }
  };
  const handleAddBatch = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${BASE_URL}/campaigns/${batchCampaignID}/add_batch`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            Quantity: batchQuantity,
            Status: batchStatus,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setShowAddBatchModal(false);
        setBatchQuantity(0);
        setBatchStatus("pending");
        setBatches(true);
      } else {
        console.error("Batch add error:", data);
      }
    } catch (err) {
      console.error("Batch network error:", err);
      alert("Netzwerkfehler beim Hinzufügen des Batches.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/campaigns/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
      });
      fetchCampaigns();
    } catch (err) {
      console.error("Failed to delete campaign:", err);
    }
  };
  const handleStatusUpdate = async (campaignID, newStatus) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/campaigns/${campaignID}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ Status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Status update failed:", data);
        return;
      }

      console.log("Status updated:", data);
      fetchCampaigns(); // Refresh list
    } catch (err) {
      console.error("Network error updating status:", err);
    }
  };

  const handleExport = (format) => {
    window.open(`${BASE_URL}/campaigns/export/${format}`, "_blank");
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className=" flex items-center justify-between gap-[10px]">
        <h1 className="text-2xl font-bold mb-4 text-[#412666]">
          {" "}
          {batches ? "Alle Batches" : "Kampagnen"}
        </h1>

        <div className="flex items-center gap-[10px] text-white text-[12px]">
          <button
            onClick={() => setBatches(!batches)}
            className=" py-[6px] px-[16px] border border-[#412666]  text-[#412666] rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300 ">
            {!batches ? "Batches" : "Kampagnen"}
          </button>

          {!batches && (
            <button
              onClick={() => setShowCreateCampaignModal(true)}
              className=" py-[6px] px-[16px] bg-[#412666] rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300">
              <Add /> Neue Kampagne
            </button>
          )}
        </div>
      </div>
      {batches ? (
        <CampaignBatches />
      ) : (
        <>
          <div className="flex justify-between mb-4 gap-4">
            <div className="flex border border-[#412666] rounded-lg px-4 w-1/3 items-center gap-2">
              <Search />
              <input
                type="text"
                placeholder="Suche nach Kampagne, ID oder Status..."
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
          </div>

          {loading ? (
            <UserLoader />
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-[#412666] border-b border-gray-200">
                <tr>
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Produkt</th>
                  <th className="py-2 px-3">Start</th>
                  <th className="py-2 px-3">Ende</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{c.id}</td>
                    <td className="py-2 px-3">{c.name}</td>
                    <td className="py-2 px-3">{c.product}</td>
                    <td className="py-2 px-3">
                      {new Date(c.start_date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3">
                      {new Date(c.end_date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 capitalize">{c.status}</td>
                    <td className="py-2 px-3 space-x-2">
                      <button
                        onClick={() => fetchSingleCampaign(c.id)}
                        className="relative group cursor-pointer ">
                        <Visibility />{" "}
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Anzeigen
                        </span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCampaign(c); // campaign is the object for that row
                          setShowUpdateCampaignModal(true);
                        }}
                        className="relative group cursor-pointer ">
                        <Edit fontSize="small" />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Bearbeiten
                        </span>
                      </button>
                      <select
                        value={c.status}
                        onChange={(e) =>
                          handleStatusUpdate(c.id, e.target.value)
                        }
                        className="border border-gray-200 rounded p-1 text-xs cursor-pointer">
                        {["draft", "active", "paused", "completed"].map(
                          (status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          )
                        )}
                      </select>
                      <button
                        onClick={() => fetchCampaignTimeline(c.id)}
                        className="relative group cursor-pointer ">
                        <Timeline fontSize="small" />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Línea de tiempo
                        </span>
                      </button>
                      <button
                        className="relative group cursor-pointer "
                        onClick={() => {
                          setBatchCampaignID(c.id);
                          setShowAddBatchModal(true);
                        }}>
                        <NoteAdd fontSize="small" />
                        <span className=" absolute top-[-30px] right-[15px] px-[15px] py-[6px] rounded-tl-[10px] rounded-tr-[10px] rounded-bl-[10px] bg-gray-400 text-white text-[12px] text-nowrap group-hover:block hidden">
                          Agregar lote
                        </span>
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
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
          )}
        </>
      )}
      {showCreateCampaignModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative h-fit">
            <div className="w-full relative h-[280px] overflow-scroll">
              <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
                Neue Kampagne erstellen
              </h2>

              <div className="space-y-4 text-sm text-gray-700">
                {[
                  "ID",
                  "Name",
                  "Description",
                  "StartDate",
                  "EndDate",
                  "CreditsUsed",
                  "Status",
                  "ExpectedScans",
                  "ConversionGoal",
                  "StarRatingGoal",
                  "QRCode",
                ].map((field) => (
                  <div key={field}>
                    <label className="block font-medium">{field}:</label>
                    <input
                      type={
                        [
                          "CreditsUsed",
                          "ExpectedScans",
                          "ConversionGoal",
                          "StarRatingGoal",
                        ].includes(field)
                          ? "number"
                          : field.toLowerCase().includes("date")
                          ? "datetime-local"
                          : "text"
                      }
                      className="w-full border px-2 py-1 rounded"
                      value={newCampaign[field]}
                      onChange={(e) =>
                        setNewCampaign((prev) => ({
                          ...prev,
                          [field]: [
                            "CreditsUsed",
                            "ExpectedScans",
                            "ConversionGoal",
                            "StarRatingGoal",
                          ].includes(field)
                            ? parseFloat(e.target.value)
                            : e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}

                <div>
                  <label className="block font-medium">ArtikelID:</label>
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={newCampaign.ArtikelID}
                    onChange={(e) =>
                      setNewCampaign((prev) => ({
                        ...prev,
                        ArtikelID: e.target.value,
                      }))
                    }>
                    <option value="">-- Wähle einen Artikel --</option>
                    {articles.map((article) => (
                      <option key={article.ID} value={article.ID}>
                        {article.ID} - {article.name || article.Bezeichnung}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6 bg-white z-50">
              <button
                onClick={() => setShowCreateCampaignModal(false)}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={handleCreateCampaign}
                className="w-full bg-[#412666] text-white py-2 rounded-lg transition cursor-pointer">
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      {showCampaignModal && singleCampaign && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kampagnendetails
            </h2>

            <div className="space-y-4 text-sm text-gray-700 max-h-[400px] overflow-y-auto pr-2">
              <div className="flex justify-between">
                <span className="font-semibold">Kampagnen-ID:</span>
                <span>{singleCampaign.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Name:</span>
                <span>{singleCampaign.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Produkt:</span>
                <span>{singleCampaign.product || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span>{singleCampaign.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Credits verwendet:</span>
                <span>{singleCampaign.credits_used}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Startdatum:</span>
                <span>{singleCampaign.start_date?.split("T")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Enddatum:</span>
                <span>{singleCampaign.end_date?.split("T")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Erwartete Scans:</span>
                <span>{singleCampaign.expected_scans || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Ziel-Bewertung:</span>
                <span>{singleCampaign.star_rating_goal || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Conversion-Ziel:</span>
                <span>{singleCampaign.conversion_goal || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">QR Code:</span>
                <span className="truncate max-w-[60%] text-blue-600">
                  {singleCampaign.qr_code || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Beschreibung:</span>
                <span>{singleCampaign.description || "—"}</span>
              </div>
            </div>

            <button
              onClick={() => setShowCampaignModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showUpdateCampaignModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative h-fit">
            <div className="w-full relative h-[280px] overflow-scroll">
              <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
                Kampagne aktualisieren
              </h2>

              <div className="space-y-4 text-sm text-gray-700">
                {[
                  "id",
                  "Name",
                  "Description",
                  "StartDate",
                  "EndDate",
                  "CreditsUsed",
                  "Status",
                  "ExpectedScans",
                  "ConversionGoal",
                  "StarRatingGoal",
                  "QRCode",
                ].map((field) => (
                  <div key={field}>
                    <label className="block font-medium">{field}:</label>
                    <input
                      type={
                        [
                          "CreditsUsed",
                          "ExpectedScans",
                          "ConversionGoal",
                          "StarRatingGoal",
                        ].includes(field)
                          ? "number"
                          : field.toLowerCase().includes("date")
                          ? "datetime-local"
                          : "text"
                      }
                      className={`w-full border px-2 py-1 rounded ${
                        field === "id" ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      value={updatedCampaign[field] || ""}
                      readOnly={field === "id"}
                      onChange={(e) =>
                        setUpdatedCampaign((prev) => ({
                          ...prev,
                          [field]: [
                            "CreditsUsed",
                            "ExpectedScans",
                            "ConversionGoal",
                            "StarRatingGoal",
                          ].includes(field)
                            ? parseFloat(e.target.value)
                            : e.target.value,
                        }))
                      }
                    />
                  </div>
                ))}

                {/* Custom ArtikelID dropdown */}
                <div>
                  <label className="block font-medium">ArtikelID:</label>
                  <select
                    className="w-full border px-2 py-1 rounded"
                    value={updatedCampaign.ArtikelID}
                    onChange={(e) =>
                      setUpdatedCampaign((prev) => ({
                        ...prev,
                        ArtikelID: e.target.value,
                      }))
                    }>
                    <option value="">-- Wähle einen Artikel --</option>
                    {articles?.map((article) => (
                      <option key={article.ID} value={article.ID}>
                        {article.ID} - {article.name || article.Bezeichnung}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6 bg-white z-50">
              <button
                onClick={() => setShowUpdateCampaignModal(false)}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={() => handleUpdateCampaign(selectedCampaign.id)}
                className="w-full bg-[#412666] text-white py-2 rounded-lg transition cursor-pointer">
                Aktualisieren
              </button>
            </div>
          </div>
        </div>
      )}
      {showTimelineModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kampagnen-Zeitplan – {timelineCampaignID}
            </h2>

            <div className="space-y-3 text-sm text-gray-700 max-h-[300px] overflow-y-auto pr-2">
              {timelineData.length > 0 ? (
                timelineData.map((entry, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded bg-gray-50 space-y-1 shadow-sm">
                    <p>
                      <strong>Batch-ID:</strong> {entry.batch_id}
                    </p>
                    <p>
                      <strong>Menge:</strong> {entry.quantity}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="capitalize">{entry.status}</span>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center">
                  Kein Zeitplan gefunden.
                </p>
              )}
            </div>

            <button
              onClick={() => setShowTimelineModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showAddBatchModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Batch hinzufügen – {batchCampaignID}
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <label className="block font-medium">Menge (Quantity):</label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={batchQuantity}
                  onChange={(e) => setBatchQuantity(parseInt(e.target.value))}
                />
              </div>

              <div>
                <label className="block font-medium">Status:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={batchStatus}
                  onChange={(e) => setBatchStatus(e.target.value)}>
                  {["pending", "active", "completed", "paused"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowAddBatchModal(false)}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={handleAddBatch}
                className="w-full bg-[#412666] text-white py-2 rounded-lg transition cursor-pointer">
                Hinzufügen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaign;
