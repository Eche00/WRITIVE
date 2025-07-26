import React, { useEffect, useState } from "react";
import { Search, Sync, Add, SyncAlt } from "@mui/icons-material";
import { BASE_URL } from "../lib/baseurl";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";

const QRCodeProcessing = () => {
  const [qrScans, setQrScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedQRCode, setSelectedQRCode] = useState(null);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [geoTags, setGeoTags] = useState(null);
  const [showGeoTagsModal, setShowGeoTagsModal] = useState(false);
  const [qrScanLocations, setQrScanLocations] = useState([]);
  const [showScanLocationsModal, setShowScanLocationsModal] = useState(false);
  const [customerQRStats, setCustomerQRStats] = useState([]);
  const [showCustomerQRStatsModal, setShowCustomerQRStatsModal] =
    useState(false);

  const fetchQRScans = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/qrplanet/all`, {
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
      setQrScans(data?.result?.qrcodes || []);
      console.log("✅ QR Codes loaded:", data?.result?.qrcodes);
    } catch (err) {
      console.error("Error loading QR scans:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQRScans();
  }, []);

  const fetchQrStatistics = async (qrId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/qrplanet/statistics/${qrId}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });

      if (!res.ok)
        throw new Error("Fehler beim Abrufen der QR-Code-Statistiken");

      const data = await res.json();
      setSelectedQRCode(data.result);
      setShowStatisticsModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Statistik konnte nicht geladen werden");
    }
  };
  const fetchGeoTags = async () => {
    const token = localStorage.getItem("token");
    console.log("hello");

    try {
      const res = await fetch(`${BASE_URL}/qrplanet/geotags`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Fehler beim Abrufen der Geotags");

      const data = await res.json();
      setGeoTags(data.result);
      console.log("DATA" + Object.keys(data.result));
      setShowGeoTagsModal(true);
    } catch (err) {
      console.error(err);
      console.error("Geotags konnten nicht geladen werden");
    }
  };
  const fetchQrScanLocations = async (qrId) => {
    try {
      const token = localStorage.getItem("token"); // Adjust based on your auth flow

      const res = await fetch(`${BASE_URL}/qrplanet/${qrId}/scans/locations`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Fehler beim Abrufen der Scan-Locations");

      const data = await res.json();
      setQrScanLocations(data.result.geotags);
      setShowScanLocationsModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Scan-Locations konnten nicht geladen werden");
    }
  };
  const fetchCustomerQRStatistics = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${BASE_URL}/qrplanet/customer/qr-statistics`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        credentials: "include",
      });

      if (!res.ok) throw new Error("Fehler beim Abrufen der QR-Statistiken");

      const data = await res.json();
      setCustomerQRStats(data.campaigns || []);
      setShowCustomerQRStatsModal(true);
    } catch (err) {
      console.error(err);
      console.error("Kampagnen-Statistiken konnten nicht geladen werden");
    }
  };

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className="mt-10">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-xl font-semibold mb-2 text-[#412666]">
            QR-Code-Verarbeitung
          </h3>
          <button
            className=" bg-[#412666] text-white px-4 py-2 rounded-full hover:bg-[#341f4f] transition cursor-pointer"
            onClick={fetchGeoTags}>
            Alle Geo-Tags
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
          <section className="mb-6">
            <div className="flex justify-between items-center">
              <div className="border border-[#412666] rounded-lg px-4 w-1/3 flex items-center gap-2">
                <Search />
                <input
                  type="text"
                  placeholder="Suche nach QR-ID / Titel..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 border-none py-2 focus:outline-none"
                />
              </div>
              <button
                className=" bg-[#412666] text-white px-4 py-2 rounded-full hover:bg-[#341f4f] transition cursor-pointer"
                onClick={fetchCustomerQRStatistics}>
                Kunden-QR-Statistiken
              </button>
            </div>
          </section>

          <table className="w-full text-sm text-left text-nowrap">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">QR-ID</th>
                <th className="py-2 px-3">Titel</th>
                <th className="py-2 px-3">Scans</th>
                <th className="py-2 px-3">Unique Besucher</th>
                <th className="py-2 px-3">URL</th>
                <th className="py-2 px-3">Erstellt am</th>
                <th className="py-2 px-3">Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {qrScans
                .filter(
                  (q) =>
                    q.id.toLowerCase().includes(search.toLowerCase()) ||
                    q.title?.toLowerCase().includes(search.toLowerCase())
                )
                .map((qr) => (
                  <tr
                    key={qr.id}
                    className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3 font-mono">{qr.id}</td>
                    <td className="py-2 px-3">{qr.title || "-"}</td>
                    <td className="py-2 px-3">{qr.scans}</td>
                    <td className="py-2 px-3">{qr.uniquevisitors}</td>
                    <td className="py-2 px-3 text-blue-600 underline break-all">
                      <a
                        href={qr.url}
                        target="_blank"
                        rel="noopener noreferrer">
                        {qr.url}
                      </a>
                    </td>
                    <td className="py-2 px-3">
                      {new Date(qr.creationdate).toLocaleString()}
                    </td>
                    <td className="p-2">
                      <td className="p-2 flex gap-2 flex-wrap">
                        <select
                          onChange={(e) => {
                            const action = e.target.value;
                            if (!action) return;

                            switch (action) {
                              case "statistics":
                                fetchQrStatistics(qr.id);
                                break;
                              case "scanLocations":
                                fetchQrScanLocations(qr.id);
                                break;
                              default:
                                break;
                            }

                            e.target.selectedIndex = 0; // Reset dropdown
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm text-[#412666] bg-white cursor-pointer">
                          <option value="">Aktion wählen</option>
                          <option value="statistics">Statistik anzeigen</option>
                          <option value="scanLocations">
                            Scan Locations anzeigen
                          </option>
                        </select>
                      </td>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </motion.div>
      )}
      {showStatisticsModal && selectedQRCode && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#412666] mb-4 text-center">
              QR-Code Statistik
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <strong>ID:</strong> {selectedQRCode.id}
              </div>
              <div>
                <strong>URL:</strong> {selectedQRCode.url}
              </div>
              <div>
                <strong>Short URL:</strong> {selectedQRCode.shorturl}
              </div>
              <div>
                <strong>QR Bild:</strong>{" "}
                <a
                  href={selectedQRCode.qr}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline">
                  Anzeigen
                </a>
              </div>
              <div>
                <strong>Erstellt am:</strong> {selectedQRCode.creationdate}
              </div>
              <div>
                <strong>Erste Anfrage:</strong>{" "}
                {selectedQRCode.firstrequestdate}
              </div>
              <div>
                <strong>Letzte Anfrage:</strong>{" "}
                {selectedQRCode.lastrequestdate}
              </div>
              <div>
                <strong>Gesamte Anfragen:</strong> {selectedQRCode.requestcount}
              </div>
              <div>
                <strong>Einzigartige Besucher:</strong>{" "}
                {selectedQRCode.uniqevisitors}
              </div>
              <div>
                <strong>Anfragen pro Tag:</strong> {selectedQRCode.callsperday}
              </div>
              <div>
                <strong>Tage zwischen erster und letzter Anfrage:</strong>{" "}
                {selectedQRCode.daysbetweenfirstandlastrequest}
              </div>
              <div>
                <strong>Tage seit Erstellung:</strong>{" "}
                {selectedQRCode.dayssincecreated}
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2">
              Anfragen Details
            </h3>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm sm:text-xs text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-[#412666]">
                  <tr>
                    <th className="p-3 whitespace-nowrap">Datum</th>
                    <th className="p-3 whitespace-nowrap">Uhrzeit</th>
                    <th className="p-3 whitespace-nowrap">Stadt</th>
                    <th className="p-3 whitespace-nowrap">Region</th>
                    <th className="p-3 whitespace-nowrap">Gerät</th>
                    <th className="p-3 whitespace-nowrap">OS</th>
                    <th className="p-3 whitespace-nowrap">Browser</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedQRCode.requests.map((req, i) => (
                    <tr
                      key={i}
                      className="border-b hover:bg-gray-50 text-gray-700">
                      <td className="p-3">{req.requestdate}</td>
                      <td className="p-3">{req.localscantime}</td>
                      <td className="p-3">{req.city}</td>
                      <td className="p-3">{req.region}</td>
                      <td className="p-3">{req.brand || req.model || "—"}</td>
                      <td className="p-3">{`${req.os} ${req.osversion}`}</td>
                      <td className="p-3">{`${req.browser} ${req.browserversion}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowStatisticsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}

      {showGeoTagsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#412666] text-center mb-4">
              QR GeoTags Statistik
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <b>QR:</b> {geoTags.qr}
              </div>
              <div>
                <b>URL:</b> {geoTags.url}
              </div>
              <div>
                <b>Typ:</b> {geoTags.type}
              </div>
              <div>
                <b>Short URL:</b> {geoTags.shorturl}
              </div>
              <div>
                <b>Besuche:</b> {geoTags.uniqevisitors}
              </div>
              <div>
                <b>Erstellt am:</b> {geoTags.creationdate}
              </div>
              <div>
                <b>Anzahl Anfragen:</b> {geoTags.requestcount}
              </div>
              <div>
                <b>Erste Anfrage:</b> {geoTags.firstrequestdate}
              </div>
              <div>
                <b>Letzte Anfrage:</b> {geoTags.lastrequestdate}
              </div>
              <div>
                <b>Tage seit Erstellung:</b> {geoTags.dayssincecreated}
              </div>
            </div>

            <h3 className="text-lg font-semibold mt-6 mb-2 text-[#412666]">
              Einzelne Geo-Requests
            </h3>

            <div className="overflow-auto">
              <table className="w-full text-xs text-left border border-gray-200">
                <thead className="bg-gray-100 text-[#412666]">
                  <tr>
                    <th className="p-2">Zeit</th>
                    <th className="p-2">Browser</th>
                    <th className="p-2">Gerät</th>
                    <th className="p-2">OS</th>
                    <th className="p-2">Stadt</th>
                    <th className="p-2">Region</th>
                    <th className="p-2">Land</th>
                  </tr>
                </thead>
                <tbody>
                  {geoTags?.requests?.map((r, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="p-2">{`${r.requestdate} ${r.localscantime}`}</td>
                      <td className="p-2">{`${r.browser} ${r.browserversion}`}</td>
                      <td className="p-2">{r.model || "—"}</td>
                      <td className="p-2">{`${r.os} ${r.osversion}`}</td>
                      <td className="p-2">{r.city}</td>
                      <td className="p-2">{r.region}</td>
                      <td className="p-2">{r.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowGeoTagsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded hover:bg-[#341f4f] transition">
              Schließen
            </button>
          </div>
        </div>
      )}

      {showScanLocationsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-2 sm:px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#412666] text-center mb-4">
              Scan Locations Übersicht
            </h2>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm sm:text-xs text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-[#412666]">
                  <tr>
                    <th className="p-3 whitespace-nowrap">QR</th>
                    <th className="p-3 whitespace-nowrap">URL</th>
                    <th className="p-3 whitespace-nowrap">Gerät</th>
                    <th className="p-3 whitespace-nowrap">Adresse</th>
                    <th className="p-3 whitespace-nowrap">Latitude</th>
                    <th className="p-3 whitespace-nowrap">Longitude</th>
                    <th className="p-3 whitespace-nowrap">Scan Datum</th>
                  </tr>
                </thead>
                <tbody>
                  {qrScanLocations.map((scan, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 text-gray-700">
                      <td className="p-3 break-all">{scan.qr}</td>
                      <td className="p-3 break-all">{scan.url}</td>
                      <td className="p-3">{scan.device || "—"}</td>
                      <td className="p-3">{scan.location.address || "—"}</td>
                      <td className="p-3">{scan.location.lat || "—"}</td>
                      <td className="p-3">{scan.location.lng || "—"}</td>
                      <td className="p-3">{scan.scandate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowScanLocationsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition">
              Schließen
            </button>
          </div>
        </div>
      )}

      {showCustomerQRStatsModal && customerQRStats && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#412666] text-center mb-4">
              QR Kampagnen-Statistiken
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-xs text-left border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 text-[#412666]">
                  <tr>
                    <th className="p-3 whitespace-nowrap">Kampagne</th>
                    <th className="p-3 whitespace-nowrap">QR-Code</th>
                    <th className="p-3 whitespace-nowrap">Letzter Scan</th>
                    <th className="p-3 whitespace-nowrap">Scans</th>
                    <th className="p-3 whitespace-nowrap">Eindeutige Scans</th>
                  </tr>
                </thead>
                <tbody>
                  {customerQRStats.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-gray-50 text-gray-700">
                      <td className="p-3">{item.CampaignName}</td>
                      <td className="p-3">
                        <a
                          href={item.QRCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline break-all">
                          {item.QRCode}
                        </a>
                      </td>
                      <td className="p-3">{item.LastScan}</td>
                      <td className="p-3">{item.Scans}</td>
                      <td className="p-3">{item.UniqueScans}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => setShowCustomerQRStatsModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeProcessing;
