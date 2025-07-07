import React, { useEffect, useState } from "react";
import { Search, Sync, Add, SyncAlt } from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const QRCodeProcessing = () => {
  const [qrScans, setQrScans] = useState([]);
  const [syncData, setSyncData] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [syncSearch, setSyncSearch] = useState("");
  const [syncedSearch, setSyncedSearch] = useState("");
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [qrStats, setQrStats] = useState(null);
  const [showQRScanLogsModal, setShowQRScanLogsModal] = useState(false);
  const [qrScanLogs, setQRScanLogs] = useState([]);
  const [showQRScanLogDetailModal, setShowQRScanLogDetailModal] =
    useState(false);
  const [qrScanLogDetail, setQRScanLogDetail] = useState(null);

  const [newScan, setNewScan] = useState({
    CampaignID: "",
    DeviceID: "",
    Location: "",
    qr_code: "",
  });

  const fetchQRScans = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/qr-scans/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      setQrScans(data);
      console.log(data);
    } catch (err) {
      console.error("Fehler beim Abrufen der QR-Scans:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSyncData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/qr-scans/sync`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setSyncData(data.data);
    } catch (err) {
      console.error("Fehler beim Abrufen der Sync-Daten:", err);
    }
  };
  const [syncedScans, setSyncedScans] = useState([]);

  const fetchSyncedScans = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/qr-scans/sync_panel`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      if (!res.ok) {
        throw new Error("Fehler beim Abrufen synchronisierter Scans.");
      }

      const data = await res.json();
      setSyncedScans(data);
    } catch (err) {
      console.error(err);
      // alert("Fehler beim Laden der synchronisierten Scans.");
    }
  };

  // const fetchStats = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const res = await fetch(`${BASE_URL}/qr-scans/stats`, {
  //       headers: {
  //         Authorization: "Bearer " + token,
  //         "Content-Type": "application/json",
  //         "ngrok-skip-browser-warning": "true",
  //       },
  //     });
  //     const data = await res.json();
  //     setStats(data);
  //   } catch (err) {
  //     console.error("Fehler beim Abrufen der Statistiken:", err);
  //   }
  // };

  useEffect(() => {
    fetchQRScans();
    fetchSyncData();
    fetchStats();
    fetchSyncedScans();
  }, []);

  const simulateScan = async () => {
    const { CampaignID, DeviceID, Location, qr_code } = newScan;

    // Validate required fields
    if (!CampaignID || !DeviceID || !Location || !qr_code) {
      console.log("Bitte fülle alle Felder aus.");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/qr-scans/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          CampaignID: CampaignID.trim(),
          DeviceID: DeviceID.trim(),
          Location: Location.trim(),
          qr_code: qr_code.trim(), // Make sure it's a string
        }),
      });

      const result = await res.json();

      if (result.status === "success") {
        console.log(result.message); // "QR-Scan verarbeitet"
        fetchQRScans(); // Refresh list
        setNewScan({
          CampaignID: "",
          DeviceID: "",
          Location: "",
          qr_code: "",
        });
      } else if (result.message === "Scan bereits registriert") {
        console.log("⚠️ Dieser Scan wurde bereits registriert.");
      } else if (result.message === "Ungültiger QR-Code") {
        console.log(" Ungültiger QR-Code.");
      } else {
        console.log("Fehler: " + result.message);
      }
    } catch (err) {
      console.error("Fehler beim Simulieren des Scans:", err);
      console.log(
        "Netzwerkfehler oder Serverproblem beim Senden des QR-Scans."
      );
    }
  };

  const syncByCampaign = async (campaignID) => {
    try {
      const token = localStorage.getItem("token");

      console.log("Trying to sync for campaignID:", campaignID);

      const idsToSync = qrScans
        .filter(
          (scan) =>
            (scan.CampaignID || "").trim().toLowerCase() ===
              (campaignID || "").trim().toLowerCase() &&
            (scan.Synced === false || scan.Synced === "false")
        )
        .map((scan) => scan.ID);

      console.log("Matching unsynced scans:", idsToSync);

      // if (idsToSync.length === 0) {
      //   return alert("Keine QR-Codes für diese Kampagne zum Synchronisieren.");
      // }

      const res = await fetch(`${BASE_URL}/qr-scans/sync_bulk`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ sync_ids: idsToSync }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log(data.message);
        fetchQRScans();
        fetchSyncData();
      } else {
        console.log(data.message || "Fehler beim Synchronisieren.");
      }
    } catch (err) {
      console.error("Synchronisierungsfehler:", err);
      console.log("Fehler beim Synchronisieren.");
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/qr-scans/stats`, {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setStats(data); // Already done
      setQrStats(data); // Save full stats response
    } catch (err) {
      console.error("Fehler beim Abrufen der Statistiken:", err);
    }
  };

  const fetchQRScanLogs = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/qr-scans/logs`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      if (!Array.isArray(data)) {
        console.log("Fehler beim Abrufen der QR-Scan Logs.");
        return;
      }

      setQRScanLogs(data);
      setShowQRScanLogsModal(true);
    } catch (err) {
      console.error(err);
      // alert("Netzwerkfehler beim Laden der QR-Scan Logs.");
    }
  };
  const fetchQRScanLogByID = async (logID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/qr-scans/logs/${logID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();

      //  Invalid or missing log
      if (data?.message === "404 Not Found") {
        console.log("QR-Scan-Log-Eintrag wurde nicht gefunden.");
        return;
      }

      if (data?.entity !== "QRScan") {
        console.log("Ungültige Entität – kein QR-Scan-Log.");
        return;
      }

      // ✅ Valid
      setQRScanLogDetail(data);
      setShowQRScanLogDetailModal(true);
    } catch (err) {
      console.error(err);
      // alert("Fehler beim Abrufen des QR-Scan Logs.");
    }
  };
  const handleExportQRScanLogs = (format) => {
    const query = new URLSearchParams({ format });

    window.open(`${BASE_URL}/qr-scans/logs/export/${format}`, "_blank");
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className="mt-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-xl font-semibold mb-2 text-[#412666]">
            Synchronisierungsstatistik
          </h3>
          <button
            onClick={() => setShowStatsModal(true)}
            className="mt-4 bg-[#412666] text-white px-4 py-2 rounded-full hover:bg-[#341f4f] transition cursor-pointer">
            Detaillierte QR-Statistiken anzeigen
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-start hover:shadow-2xl hover:scale-[105%] transition-all duration-300 cursor-pointer">
            <p className="text-sm">Gesamte Scans</p>
            <h4 className="text-xl font-bold">{stats.total}</h4>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-start hover:shadow-2xl hover:scale-[105%] transition-all duration-300 cursor-pointer">
            <p className="text-sm">Synchronisiert</p>
            <h4 className="text-xl font-bold text-green-600">{stats.synced}</h4>
          </div>
          <div className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm flex justify-between items-start hover:shadow-2xl hover:scale-[105%] transition-all duration-300 cursor-pointer">
            <p className="text-sm">Ausstehend</p>
            <h4 className="text-xl font-bold text-red-500">{stats.pending}</h4>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4  mb-6 space-y-2">
        <h3 className="text-lg font-semibold text-[#412666]">
          QR-Code simulieren
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ">
          <input
            type="text"
            placeholder="Kampagnen-ID"
            className="border border-gray-200 p-2 rounded"
            value={newScan.CampaignID}
            onChange={(e) =>
              setNewScan({ ...newScan, CampaignID: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Geräte-ID"
            className="border border-gray-200 p-2 rounded"
            value={newScan.DeviceID}
            onChange={(e) =>
              setNewScan({ ...newScan, DeviceID: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Standort"
            className="border border-gray-200 p-2 rounded"
            value={newScan.Location}
            onChange={(e) =>
              setNewScan({ ...newScan, Location: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="QR-Code"
            className="border border-gray-200 p-2 rounded"
            value={newScan.qr_code}
            onChange={(e) =>
              setNewScan({ ...newScan, qr_code: e.target.value })
            }
          />
        </div>
        <button
          onClick={simulateScan}
          className="bg-[#412666] text-white px-4 py-2 rounded-full hover:scale-[102%] transition-all cursor-pointer">
          <Add className="mr-1" /> Scan simulieren
        </button>
      </div>
      <>
        <section className="mb-6">
          <h2 className="text-lg font-bold text-[#412666] mb-2">
            QR Code Verarbeitung
          </h2>
          <div className="flex justify-between items-center">
            <div className="border border-[#412666] rounded-lg px-4 w-1/3 flex items-center gap-2">
              <Search />
              <input
                type="text"
                placeholder="Suche nach Gerät oder Standort..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border-none py-2 focus:outline-none"
              />
            </div>

            <button
              onClick={fetchQRScanLogs}
              className="bg-[#412666] text-white px-4 py-2 rounded-full hover:scale-[102%] transition-all cursor-pointer">
              <Sync className="mr-1" /> QR-Scan-Protokolle anzeigen
            </button>
          </div>
        </section>

        <table className="w-full text-sm text-left">
          <thead className="text-[#412666] border-b border-gray-200">
            <tr>
              <th className="py-2 px-3">Kampagne-ID</th>
              <th className="py-2 px-3">Kampagne</th>
              <th className="py-2 px-3">Gerät</th>
              <th className="py-2 px-3">Standort</th>
              <th className="py-2 px-3">Gescannt am</th>
              <th className="py-2 px-3">Synchronisiert</th>
            </tr>
          </thead>
          <tbody>
            {qrScans
              .filter(
                (s) =>
                  s.DeviceID.toLowerCase().includes(search.toLowerCase()) ||
                  s.Location.toLowerCase().includes(search.toLowerCase())
              )
              .map((scan) => (
                <tr
                  key={scan.ID}
                  className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-3">{scan.CampaignID}</td>
                  <td className="py-2 px-3">{scan.Campaign}</td>
                  <td className="py-2 px-3">{scan.DeviceID}</td>
                  <td className="py-2 px-3">{scan.Location}</td>
                  <td className="py-2 px-3">
                    {new Date(scan.ScannedAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-3">
                    {scan.Synced ? (
                      <span className="text-green-600 font-semibold"> Ja</span>
                    ) : (
                      <span className="text-red-500 font-semibold"> Nein</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </>

      {/* QR-Scans zur Synchronisation */}
      <section className="mt-10 mb-6">
        <h2 className="text-xl font-bold text-[#412666] mb-2">
          QR-Scans zur Synchronisation
        </h2>
        <div className="flex justify-between items-center mb-3">
          <div className="border border-[#412666] rounded-lg px-4 w-1/3 flex items-center gap-2">
            <Search />
            <input
              type="text"
              placeholder="Suche nach Kampagne..."
              value={syncSearch}
              onChange={(e) => setSyncSearch(e.target.value)}
              className="flex-1 border-none py-2 focus:outline-none"
            />
          </div>
        </div>

        {syncData.length === 0 ? (
          <p className="text-sm text-gray-600">
            Keine Daten zum Synchronisieren gefunden.
          </p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Kampagnen-ID</th>
                <th className="py-2 px-3">Scan-Anzahl</th>
                <th className="py-2 px-3">Letzter Scan</th>
                <th className="py-2 px-3">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {syncData
                .filter((item) =>
                  item.CampaignID.toLowerCase().includes(
                    syncSearch.toLowerCase()
                  )
                )
                .map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{item.CampaignID}</td>
                    <td className="py-2 px-3">{item.ScanCount}</td>
                    <td className="py-2 px-3">
                      {new Date(item.ScannedAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => syncByCampaign(item.CampaignID)}
                        className="bg-[#412666] text-white text-xs px-3 py-1 rounded hover:bg-[#5c3b91] transition cursor-pointer">
                        <SyncAlt />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>

      {showStatsModal && qrStats && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              QR-Scan Statistiken
            </h2>

            <div className="space-y-4 text-sm text-gray-700 max-h-[400px] overflow-y-auto pr-2">
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
                <div className="flex justify-between">
                  <span className="font-semibold">Gesamte Scans:</span>
                  <span>{qrStats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Synchronisiert:</span>
                  <span className="text-green-600">{qrStats.synced}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Ausstehend:</span>
                  <span className="text-red-500">{qrStats.pending}</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50">
                <h3 className="font-semibold mb-2">Scans nach Datum</h3>
                {qrStats.labels.map((label, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{label}</span>
                    <span>{qrStats.values[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowStatsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      <section className="mt-10 mb-6">
        <h2 className="text-xl font-bold text-[#412666] mb-2">
          Bereits synchronisierte QR-Scans
        </h2>

        <div className="flex justify-between items-center mb-3">
          <div className="border border-[#412666] rounded-lg px-4 w-1/3 flex items-center gap-2">
            <Search />
            <input
              type="text"
              placeholder="Suche nach Kampagne..."
              value={syncedSearch}
              onChange={(e) => setSyncedSearch(e.target.value)}
              className="flex-1 border-none py-2 focus:outline-none"
            />
          </div>
        </div>

        {syncedScans.length === 0 ? (
          <p className="text-sm text-gray-600">
            Keine synchronisierten Scans gefunden.
          </p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">Kampagne</th>
                <th className="py-2 px-3">Gerät</th>
                <th className="py-2 px-3">Standort</th>
                <th className="py-2 px-3">Gescannt am</th>
              </tr>
            </thead>
            <tbody>
              {syncedScans
                .filter((scan) =>
                  (scan.Campaign || "")
                    .toLowerCase()
                    .includes(syncedSearch.toLowerCase())
                )
                .map((scan) => (
                  <tr
                    key={scan.ID}
                    className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{scan.Campaign}</td>
                    <td className="py-2 px-3">{scan.DeviceID}</td>
                    <td className="py-2 px-3">{scan.Location}</td>
                    <td className="py-2 px-3">
                      {new Date(scan.ScannedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </section>
      {showQRScanLogsModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              QR-Scan Logs
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto text-sm text-gray-700">
              {qrScanLogs.length === 0 ? (
                <p className="text-center text-gray-500">
                  Keine Logs gefunden.
                </p>
              ) : (
                qrScanLogs.map((log) => (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm space-y-1 cursor-pointer"
                    onClick={() => fetchQRScanLogByID(log.id)}>
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
              {qrScanLogs.length >= 1 && (
                <div className="space-x-2 flex items-center justify-between">
                  <button
                    onClick={() => handleExportQRScanLogs("csv")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all">
                    Exportiere CSV
                  </button>

                  <button
                    onClick={() => handleExportQRScanLogs("xlsx")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all">
                    Exportiere XLSX
                  </button>

                  <button
                    onClick={() => handleExportQRScanLogs("pdf")}
                    className="border border-[#412666] px-4 py-2 rounded-lg text-sm hover:bg-[#412666] hover:text-white transition-all">
                    Exportiere PDF
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowQRScanLogsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showQRScanLogDetailModal && qrScanLogDetail && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              QR-Scan Log Details
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <strong>Aktion:</strong> {qrScanLogDetail.action}
              </div>
              <div>
                <strong>Details:</strong> {qrScanLogDetail.details}
              </div>
              <div>
                <strong>Entität:</strong> {qrScanLogDetail.entity}
              </div>
              <div>
                <strong>Entitäts-ID:</strong> {qrScanLogDetail.entity_id}
              </div>
              <div>
                <strong>ID:</strong> {qrScanLogDetail.id}
              </div>
              <div>
                <strong>IP-Adresse:</strong> {qrScanLogDetail.ip_address}
              </div>
              <div>
                <strong>Kunde-ID:</strong> {qrScanLogDetail.kunde_id ?? "—"}
              </div>
              <div>
                <strong>Timestamp:</strong>{" "}
                {new Date(qrScanLogDetail.timestamp).toLocaleString()}
              </div>
              <div>
                <strong>User-Agent:</strong> {qrScanLogDetail.user_agent}
              </div>
              <div>
                <strong>User ID:</strong> {qrScanLogDetail.user_id}
              </div>
            </div>

            <button
              onClick={() => setShowQRScanLogDetailModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeProcessing;
