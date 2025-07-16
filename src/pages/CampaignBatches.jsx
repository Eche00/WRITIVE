// CampaignBatches.jsx
import React, { useEffect, useState } from "react";
import UserLoader from "../component/UserLoader";
import { Search } from "@mui/icons-material";

const BASE_URL = "https://cb49a05985a8.ngrok-free.app";

const CampaignBatches = () => {
  const [batches, setBatches] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/campaigns/batches`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await res.json();
        setBatches(data.batches);
        setFiltered(data.batches);
      } catch (err) {
        console.error("Fehler beim Laden der Batches:", err);
        setBatches([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      setFiltered(
        batches.filter(
          (b) =>
            b.campaign_id.toLowerCase().includes(q) ||
            b.campaign_name.toLowerCase().includes(q) ||
            b.status.toLowerCase().includes(q) ||
            b.artikel.toLowerCase().includes(q)
        )
      );
    } else {
      setFiltered(batches);
    }
  }, [search, batches]);

  return (
    <div className="w-full">
      <div className="flex mb-4 gap-4">
        <div className="flex border border-[#412666] rounded-lg px-4 w-1/3 items-center gap-2">
          <Search />
          <input
            type="text"
            placeholder="Suche nach Kampagne, Artikel oder Status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="py-2 w-full focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <UserLoader />
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="text-[#412666] border-b border-gray-200">
            <tr>
              <th className="py-2 px-3">Batch-ID</th>
              <th className="py-2 px-3">Artikel</th>
              <th className="py-2 px-3">Kampagne</th>
              <th className="py-2 px-3">Kampagnen-ID</th>
              <th className="py-2 px-3">Menge</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr
                key={b.batch_id}
                className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-3">{b.batch_id}</td>
                <td className="py-2 px-3">{b.artikel}</td>
                <td className="py-2 px-3">{b.campaign_name}</td>
                <td className="py-2 px-3">{b.campaign_id}</td>
                <td className="py-2 px-3">{b.quantity}</td>
                <td className="py-2 px-3 capitalize">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CampaignBatches;
