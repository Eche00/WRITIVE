import React, { useEffect, useState } from "react";
import { Search, Visibility } from "@mui/icons-material";
import UserLoader from "../component/UserLoader";
import { motion } from "framer-motion";
import { BASE_URL } from "../lib/baseurl";
import { CheckCircle } from "@mui/icons-material";

const CustomerCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showProductionDetailModal, setShowProductionDetailModal] =
    useState(false);
  const [selectedProduction, setSelectedProduction] = useState(null);
  const [showProductionStatusModal, setShowProductionStatusModal] =
    useState(false);
  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/production/grouped_by_campaign`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setCampaigns(data);
      console.log(data);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);
  const statusColorMap = {
    "Data Received": "text-red-600 bg-red-100",
    "Data Preparation": "text-orange-600 bg-orange-100",
    "In Progress": "text-blue-600 bg-blue-100",
    "Production Started": "text-purple-600 bg-purple-100",
    "Production Completed": "text-indigo-600 bg-indigo-100",
    "Quality Check Started": "text-yellow-600 bg-yellow-100",
    "Quality Check Completed": "text-yellow-800 bg-yellow-200",
    "Ready for Shipment": "text-cyan-700 bg-cyan-100",
    Shipped: "text-sky-600 bg-sky-100",
    "Order Completed": "text-green-700 bg-green-100",
  };

  const allSteps = [
    "Data Received",
    "Data Preparation",
    "In Progress",
    "Production Started",
    "Production Completed",
    "Quality Check Started",
    "Quality Check Completed",
    "Ready for Shipment",
    "Shipped",
    "Order Completed",
  ];
  const statusIndex = allSteps.indexOf(selectedProduction?.Status);

  const isCompleted = (index) => index < statusIndex;
  const isCurrent = (index) => index === statusIndex;

  return (
    <div className="p-4 md:w-[80%] w-full mx-auto text-black flex flex-col h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[42px] font-bold font-mono text-[#412666]">
          KAMPAGNEN/BATCHES
        </h2>
      </div>

      {loading ? (
        <UserLoader />
      ) : campaigns.length === 0 ? (
        <p className="text-gray-500">Keine Kampagnen gefunden.</p>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="bg-white p-4 rounded-xl shadow border border-gray-100 w-fit xl:w-full">
          <div className="border border-[#412666] rounded-lg px-4 w-full md:w-1/3 flex items-center gap-2 mb-4">
            <Search />
            <input
              type="text"
              placeholder="Suche Kampagnenname..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none py-2 focus:outline-none bg-transparent"
            />
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200 uppercase">
              <tr>
                <th className="py-2 px-3">BrandName</th>
                <th className="py-2 px-3">Artikel</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">BATCHGRÖẞE</th>
                <th className="py-2 px-3">Erstellt</th>
                <th className="py-2 px-3 flex items-center justify-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {campaigns
                .filter((c) =>
                  c.campaign_name?.toLowerCase().includes(search.toLowerCase())
                )
                .map((c) => (
                  <React.Fragment key={c.id}>
                    <tr className="bg-gray-100 w-full">
                      <td
                        colSpan={8}
                        className="py-4 px-3 font-medium text-xl text-[#412666] uppercase">
                        <p>
                          Buchung {c.campaign_name} - {c.campaign_id}
                        </p>
                      </td>
                      <td
                        colSpan={8}
                        className="py-4 px-3 font-medium text-xl text-[#412666] uppercase flex items-center gap-[10px] justify-end">
                        <span>Credits gebucht: </span> <p>{c.display}</p>
                      </td>
                    </tr>

                    {c.productions.map((p) => (
                      <tr
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        key={p.ID}>
                        <td className="py-2 px-3">{p.BrandName}</td>
                        <td className="py-2 px-3">{p.ArtikelName}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold bg-opacity-20 ${
                              statusColorMap[p.Status] ||
                              "text-gray-600 bg-gray-100"
                            }`}>
                            {p.Status}
                          </span>
                        </td>
                        <td className="py-2 px-3">{p.GepruefteStueckzahl}</td>
                        <td className="py-2 px-3">
                          {p.ErstellungsDatum
                            ? new Date(p.ErstellungsDatum).toLocaleDateString(
                                "de-DE"
                              )
                            : "-"}
                        </td>
                        <td className="py-2 px-3 flex items-center justify-center">
                          <span
                            value="status"
                            onClick={() => {
                              setShowProductionStatusModal(true),
                                setSelectedProduction(p);
                            }}>
                            <Visibility />
                            {/* <span>Status anzeigen</span> */}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </motion.div>
      )}
      {showProductionDetailModal && selectedProduction && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 text-wrap">
          <section className="bg-white p-6 rounded-xl shadow-lg max-w-xl w-full h-fit relative flex flex-col">
            <div className="w-full   overflow-y-auto max-h-[70vh]">
              <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
                Produktions-Details (ID: {selectedProduction.ID})
              </h2>

              <div className="space-y-3 text-sm text-gray-700">
                {[
                  { label: "Artikel", value: selectedProduction.ArtikelName },
                  { label: "Artikel-ID", value: selectedProduction.ArtikelID },
                  { label: "Brand", value: selectedProduction.BrandName },
                  { label: "Brand-ID", value: selectedProduction.BrandID },
                  { label: "Kunde", value: selectedProduction.KundeName },
                  { label: "Kunde-ID", value: selectedProduction.KundeID },
                  { label: "Status", value: selectedProduction.Status },
                  {
                    label: "Standard Stückzahl",
                    value: selectedProduction.StandardStueckzahl,
                  },
                  {
                    label: "Geänderte Stückzahl",
                    value: selectedProduction.GeaenderteStueckzahl,
                  },
                  {
                    label: "Geprüfte Stückzahl",
                    value: selectedProduction.GepruefteStueckzahl,
                  },
                  {
                    label: "Clean Cards",
                    value: selectedProduction.CleanCards,
                  },
                  {
                    label: "Versendet",
                    value: selectedProduction.Versendet ? "Ja" : "Nein",
                  },
                  {
                    label: "Versandbereit",
                    value: selectedProduction.Versandbereit ? "Ja" : "Nein",
                  },
                  {
                    label: "Daten Aufbereitung gestartet",
                    value: selectedProduction.DatenAufbereitungStart
                      ? "Ja"
                      : "Nein",
                  },
                  {
                    label: "Daten aufbereitet",
                    value: selectedProduction.DatenAufbereitet ? "Ja" : "Nein",
                  },
                  {
                    label: "Genug Material",
                    value: selectedProduction.GenugMaterial ? "Ja" : "Nein",
                  },
                  {
                    label: "Qualitätskontrolle durchgeführt",
                    value: selectedProduction.QualitaetskontrolleDurchgefuehrt
                      ? "Ja"
                      : "Nein",
                  },
                  {
                    label: "Qualitätskontrolle gestartet",
                    value: selectedProduction.QualitaetskontrolleGestartet
                      ? "Ja"
                      : "Nein",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="font-semibold">{item.label}:</span>
                    <span>{item.value || "-"}</span>
                  </div>
                ))}

                {/* Date fields */}
                {[
                  {
                    label: "Datenaufbereitung Startzeit",
                    value: selectedProduction.DatenAufbereitungStartZeit,
                  },
                  {
                    label: "Datenaufbereitung Fertig",
                    value: selectedProduction.DatenAufbereitetZeit,
                  },
                  {
                    label: "Produktion gestartet",
                    value: selectedProduction.ProduktionGestartetZeit,
                  },
                  {
                    label: "Produktion abgeschlossen",
                    value: selectedProduction.ProduktionAbgeschlossenZeit,
                  },
                  {
                    label: "Qualitätskontrolle Start",
                    value: selectedProduction.QualitaetskontrolleGestartetZeit,
                  },
                  {
                    label: "Qualitätskontrolle Ende",
                    value:
                      selectedProduction.QualitaetskontrolleDurchgefuehrtZeit,
                  },
                  {
                    label: "Versandbereit Zeit",
                    value: selectedProduction.VersandbereitZeit,
                  },
                  {
                    label: "Versendet Zeit",
                    value: selectedProduction.VersendetZeit,
                  },
                  {
                    label: "Erstellungsdatum",
                    value: selectedProduction.ErstellungsDatum,
                  },
                  {
                    label: "Geplanter Produktionsstart",
                    value: selectedProduction.gep_Produktionsstart,
                  },
                  {
                    label: "Geplantes Versanddatum",
                    value: selectedProduction.gep_SendoutDatum,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="font-semibold">{item.label}:</span>
                    <span>
                      {item.value ? new Date(item.value).toLocaleString() : "-"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowProductionDetailModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </section>
        </div>
      )}
      {showProductionStatusModal && selectedProduction && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4 text-wrap">
          <section className="bg-white p-6 rounded-xl shadow-lg max-w-[90%] w-full h-fit relative flex flex-col">
            <div className="w-full   overflow-y-auto max-h-[70vh]">
              <h2 className="text-xl font-bold text-[#412666] mb-4 text-center">
                Produktions-Status (ID: {selectedProduction.ID})
              </h2>
              <div className="flex items-center justify-between overflow-x-auto py-2 px-1 space-x-4">
                {allSteps.map((step, index) => {
                  const isLast = index === allSteps.length - 1;

                  return (
                    <div
                      key={step}
                      className="flex flex-col items-center relative min-w-[120px] group">
                      {/* Connector Line */}
                      {!isLast && (
                        <div
                          className={`absolute top-[10px] left-1/2 w-full h-0.5 z-10 transform -translate-x-1/2 ${
                            isCompleted(index) ? "bg-[#412666]" : "bg-gray-300"
                          }`}
                        />
                      )}

                      {/* Dot */}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center mb-2 z-10 ${
                          isCompleted(index) || isCurrent(index)
                            ? "bg-[#412666]"
                            : "bg-gray-300"
                        }`}>
                        {isCompleted(index) || isCurrent(index) ? (
                          <CheckCircle
                            fontSize="small"
                            className="text-white"
                          />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>

                      {/* Label */}
                      <div
                        className={`text-xs text-center mr-10 ${
                          selectedProduction?.Status === "Order Completed" &&
                          isLast
                            ? "text-[#412666] text-2xl font-extrabold"
                            : "text-gray-700 font-bold"
                        } max-w-[110px] group-hover:text-[#412666] cursor-pointer text-nowrap`}>
                        {step}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => setShowProductionStatusModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </section>
        </div>
      )}
    </div>
  );
};

export default CustomerCampaigns;
