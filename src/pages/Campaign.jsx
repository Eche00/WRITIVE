// Campaign.jsx
import React, { useEffect, useState } from "react";
import { Search, Add } from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";
import { toast } from "react-hot-toast";

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
  const [showCampaignLogsModal, setShowCampaignLogsModal] = useState(false);
  const [campaignLogs, setCampaignLogs] = useState([]);
  const [selectedCampaignID, setSelectedCampaignID] = useState(null);
  const [showCampaignLogDetailModal, setShowCampaignLogDetailModal] =
    useState(false);
  const [campaignLogDetail, setCampaignLogDetail] = useState(null);
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false);
  const [openExportDropdown, setOpenExportDropdown] = useState(false);
  const [logExportOpenCampaign, setLogExportOpenCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    BrandID: "",
    Name: "",
    QRCode: "",
    Format: "",
    BuchungsKontingent: 0,
  });

  // fetch and store valid articles
  const [brands, setBrands] = useState([]);
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
  const fetchBrands = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCampaigns();
    fetchBrands();
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
        QRCode: selectedCampaign.qr_code,
        Format: selectedCampaign.Format,
        BuchungsKontingent: selectedCampaign.BuchungsKontingent,
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
        toast.success("Kampagne erfolgreich erstellt.");
        setShowCreateCampaignModal(false);

        setNewCampaign({
          BrandID: "",
          Name: "",
          QRCode: "",
          Format: "",
          BuchungsKontingent: 0,
        });

        fetchCampaigns();
      } else {
        console.error(
          "Fehler beim Erstellen der Kampagne:",
          data?.message || data
        );
        toast.error(data?.message || "Fehler beim Erstellen der Kampagne.");
      }
    } catch (err) {
      console.error("Netzwerkfehler beim Erstellen der Kampagne:", err);
      toast.error("Netzwerkfehler beim Erstellen der Kampagne.");
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

    const payload = {
      Name: updatedCampaign.Name || "",
      QRCode: updatedCampaign.QRCode || "",
      Format: updatedCampaign.Format || "",
      BuchungsKontingent: updatedCampaign.BuchungsKontingent || 0,
    };

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
        toast.success("Kampagne erfolgreich aktualisiert.");
        setShowUpdateCampaignModal(false);
        fetchCampaigns();
      } else {
        console.error("Update error:", data);
        toast.error(
          data.message || "Aktualisierung der Kampagne fehlgeschlagen."
        );
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Fehler beim Aktualisieren der Kampagne.");
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
        toast.success("Batch erfolgreich hinzugefügt.");
        setShowAddBatchModal(false);
        setBatchQuantity(0);
        setBatchStatus("pending");
        setBatches(true);
      } else {
        console.error("Batch add error:", data);
        toast.error(data.message || "Fehler beim Hinzufügen des Batches.");
      }
    } catch (err) {
      console.error("Batch network error:", err);
      toast.error("Netzwerkfehler beim Hinzufügen des Batches.");
    }
  };

  const fetchCampaignLogs = async (campaignID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/campaigns/${campaignID}/logs`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (!data.logs || !Array.isArray(data.logs)) {
        console.log("Keine Kampagnen-Logs gefunden.");
        return;
      }

      setCampaignLogs(data.logs);
      setSelectedCampaignID(data.campaign_id);
      setShowCampaignLogsModal(true);
    } catch (err) {
      console.error(err);
      // alert("Fehler beim Abrufen der Kampagnen-Logs.");
    }
  };
  const fetchCampaignLogByID = async (logID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/campaigns/logs/${logID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      if (data.error) {
        console.log(data.error); // e.g. "Kein Kampagnen-Log."
        return;
      }

      setCampaignLogDetail(data);
      setShowCampaignLogDetailModal(true);
    } catch (err) {
      console.error(err);
      // alert("Fehler beim Abrufen des Kampagnen-Logs.");
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
      toast.success("Kampagne erfolgreich gelöscht.");
      fetchCampaigns();
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      toast.error("Fehler beim Löschen der Kampagne.");
    }
  };

  const handleExport = (format) => {
    window.open(`${BASE_URL}/campaigns/export/${format}`, "_blank");
  };
  const handleExportCampaignLogs = (format) => {
    const query = new URLSearchParams({ format });

    window.open(
      `${BASE_URL}/campaigns/logs/export?${query.toString()}`,
      "_blank"
    );
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className=" flex items-center justify-between gap-[10px]">
        <h1 className="text-2xl font-bold mb-4 text-[#412666]"> Kampagnen</h1>

        <div className="flex items-center gap-[10px] text-white text-[12px]">
          <button
            onClick={() => setShowCreateCampaignModal(true)}
            className=" py-[6px] px-[16px] bg-[#412666] rounded-full cursor-pointer hover:scale-[102%] transition-all duration-300">
            <Add /> Neue Kampagne
          </button>
        </div>
      </div>
      {loading ? (
        <section>
          <UserLoader />
        </section>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}>
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

            <div className="relative inline-block text-left">
              <button
                onClick={() => setOpenExportDropdown(!openExportDropdown)}
                className="border border-[#412666] px-4 py-2 rounded-lg text-sm text-[#412666] hover:bg-[#412666] hover:text-white transition-all duration-300 cursor-pointer">
                Exportieren ▾
              </button>

              {openExportDropdown && (
                <div className="absolute mt-2 w-48 right-0 bg-white border border-gray-200 rounded-lg shadow z-50 p-2">
                  {["csv", "xlsx", "pdf"].map((format) => (
                    <button
                      key={format}
                      onClick={() => {
                        handleExport(format);
                        setOpenExportDropdown(false); // Close dropdown after action
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 text-center cursor-pointer">
                      {format.toUpperCase()} Exportieren
                    </button>
                  ))}
                </div>
              )}
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
                  <th className="py-2 px-3">Start</th>
                  <th className="py-2 px-3">QR-code</th>
                  <th className="py-2 px-3">Format</th>
                  <th className="py-2 px-3">Kontingent</th>
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
                    <td className="py-2 px-3">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString()
                        : new Date(c.created_at).toLocaleDateString()}
                    </td>

                    <td className="py-2 px-3 capitalize  text-blue-500 underline cursor-pointer">
                      <a href={c.qr_code}>{c.qr_code}</a>
                    </td>
                    <td className="py-2 px-3">{c.Format}</td>
                    <td className="py-2 px-3">{c.BuchungsKontingent}</td>

                    <td className="py-2 px-3 space-x-2">
                      <select
                        onChange={(e) => {
                          const action = e.target.value;
                          if (!action) return;

                          switch (action) {
                            case "view":
                              fetchSingleCampaign(c.id);
                              break;
                            case "edit":
                              setSelectedCampaign(c);
                              setShowUpdateCampaignModal(true);
                              break;
                            case "logs":
                              fetchCampaignLogs(c.id);
                              break;
                            case "delete":
                              handleDelete(c.id);
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
                        <option value="logs">Protokolle</option>
                        <option value="delete">Löschen</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </motion.div>
      )}
      {showCreateCampaignModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative h-fit">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Neue Kampagne erstellen
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <label className="block font-medium">Brand ID:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={newCampaign.BrandID}
                  onChange={(e) =>
                    setNewCampaign((prev) => ({
                      ...prev,
                      BrandID: e.target.value,
                    }))
                  }>
                  <option value="">-- Brand ID --</option>
                  {brands.map((brand) => (
                    <option key={brand.ID} value={brand.ID}>
                      {brand.ID} - {brand.Brandname}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium">Name:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={newCampaign.Name}
                  onChange={(e) =>
                    setNewCampaign((prev) => ({
                      ...prev,
                      Name: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block font-medium">QR Code URL:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={newCampaign.QRCode}
                  onChange={(e) =>
                    setNewCampaign((prev) => ({
                      ...prev,
                      QRCode: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Format:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={newCampaign.Format}
                  onChange={(e) =>
                    setNewCampaign((prev) => ({
                      ...prev,
                      Format: e.target.value,
                    }))
                  }>
                  <option value="">-- Select Format --</option>
                  <option value="DIN A6 KARTE">DIN A6 KARTE</option>
                  <option value="DIN A6 POSTKARTE">DIN A6 POSTKARTE</option>
                  <option value="DIN LANG KARTE">DIN LANG KARTE</option>
                  <option value="DIN LANG POSTKARTE">DIN LANG POSTKARTE</option>
                  <option value="MAXI POSTKARTE">MAXI POSTKARTE</option>
                  <option value="DIN A6 KARTE +KUVERT">
                    DIN A6 KARTE +KUVERT
                  </option>
                  <option value="DIN LANG KARTE +KUVERT">
                    DIN LANG KARTE +KUVERT
                  </option>
                  <option value="C6 KUVERT">C6 KUVERT</option>
                  <option value="DIN LANG KUVERT">DIN LANG KUVERT</option>
                  <option value="DIN A4 BRIEF">DIN A4 BRIEF</option>
                  <option value="DIN A4 BRIEF +KUVERT">
                    DIN A4 BRIEF +KUVERT
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-medium">BuchungsKontingent:</label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={newCampaign.BuchungsKontingent}
                  onChange={(e) =>
                    setNewCampaign((prev) => ({
                      ...prev,
                      BuchungsKontingent: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
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
                <span className="font-semibold">QR Code:</span>
                <a
                  href={singleCampaign.qr_code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 truncate max-w-[60%] hover:underline">
                  {singleCampaign.qr_code}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Erstellt am:</span>
                <span>
                  {new Date(singleCampaign.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zuletzt aktualisiert:</span>
                <span>
                  {new Date(singleCampaign.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Format:</span>
                <span>{singleCampaign.Format}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">BuchungsKontingent:</span>
                <span>{singleCampaign.BuchungsKontingent}</span>
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
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kampagne aktualisieren
            </h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <label className="block font-medium">ID:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded bg-gray-100 cursor-not-allowed"
                  value={updatedCampaign.id}
                  readOnly
                />
              </div>
              <div>
                <label className="block font-medium">Name:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={updatedCampaign.Name}
                  onChange={(e) =>
                    setUpdatedCampaign((prev) => ({
                      ...prev,
                      Name: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium">QR Code URL:</label>
                <input
                  type="text"
                  className="w-full border px-2 py-1 rounded"
                  value={updatedCampaign.QRCode}
                  onChange={(e) =>
                    setUpdatedCampaign((prev) => ({
                      ...prev,
                      QRCode: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Format:</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={updatedCampaign.Format}
                  onChange={(e) =>
                    setUpdatedCampaign((prev) => ({
                      ...prev,
                      Format: e.target.value,
                    }))
                  }>
                  <option value="">-- Select Format --</option>
                  <option value="DIN A6 KARTE">DIN A6 KARTE</option>
                  <option value="DIN A6 POSTKARTE">DIN A6 POSTKARTE</option>
                  <option value="DIN LANG KARTE">DIN LANG KARTE</option>
                  <option value="DIN LANG POSTKARTE">DIN LANG POSTKARTE</option>
                  <option value="MAXI POSTKARTE">MAXI POSTKARTE</option>
                  <option value="DIN A6 KARTE +KUVERT">
                    DIN A6 KARTE +KUVERT
                  </option>
                  <option value="DIN LANG KARTE +KUVERT">
                    DIN LANG KARTE +KUVERT
                  </option>
                  <option value="C6 KUVERT">C6 KUVERT</option>
                  <option value="DIN LANG KUVERT">DIN LANG KUVERT</option>
                  <option value="DIN A4 BRIEF">DIN A4 BRIEF</option>
                  <option value="DIN A4 BRIEF +KUVERT">
                    DIN A4 BRIEF +KUVERT
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-medium">BuchungsKontingent:</label>
                <input
                  type="number"
                  className="w-full border px-2 py-1 rounded"
                  value={updatedCampaign.BuchungsKontingent}
                  onChange={(e) =>
                    setUpdatedCampaign((prev) => ({
                      ...prev,
                      BuchungsKontingent: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6 bg-white z-50">
              <button
                onClick={() => setShowUpdateCampaignModal(false)}
                className="w-full border border-[#412666] text-[#412666] py-2 rounded-lg hover:bg-gray-100 transition cursor-pointer">
                Abbrechen
              </button>
              <button
                onClick={() => handleUpdateCampaign(updatedCampaign.id)}
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
      {showCampaignLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kampagnen-Logs (ID: {selectedCampaignID})
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto text-sm text-gray-700">
              {campaignLogs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Logs gefunden.
                </p>
              ) : (
                campaignLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-1 cursor-pointer"
                    onClick={() => fetchCampaignLogByID(log.id)}>
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
              {campaignLogs.length >= 1 && (
                <div className="relative inline-block text-left">
                  <button
                    onClick={() =>
                      setLogExportOpenCampaign(!logExportOpenCampaign)
                    }
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm text-[#412666] hover:bg-[#412666] hover:text-white transition-all duration-300">
                    Exportiere Logs ▾
                  </button>

                  {logExportOpenCampaign && (
                    <div className="absolute left-0 -top-42 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow z-50 p-2">
                      <button
                        onClick={() => handleExportCampaignLogs("csv")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere CSV
                      </button>
                      <button
                        onClick={() => handleExportCampaignLogs("xlsx")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere XLSX
                      </button>
                      <button
                        onClick={() => handleExportCampaignLogs("pdf")}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-[#412666] hover:text-white transition-all duration-200 rounded-[10px] my-1 cursor-pointer text-center">
                        Exportiere PDF
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCampaignLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showCampaignLogDetailModal && campaignLogDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Kampagnen-Log Detail (ID: {campaignLogDetail.id})
            </h2>

            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex justify-between">
                <span className="font-semibold">Aktion:</span>
                <span>{campaignLogDetail.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Details:</span>
                <span>{campaignLogDetail.details}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entität:</span>
                <span>{campaignLogDetail.entity}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Entitäts-ID:</span>
                <span>{campaignLogDetail.entity_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kunde-ID:</span>
                <span>{campaignLogDetail.kunde_id ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">IP-Adresse:</span>
                <span>{campaignLogDetail.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User-Agent:</span>
                <span className="break-words max-w-[60%]">
                  {campaignLogDetail.user_agent}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">User ID:</span>
                <span>{campaignLogDetail.user_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Zeitstempel:</span>
                <span>
                  {new Date(campaignLogDetail.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCampaignLogDetailModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaign;
