import React, { useEffect, useState } from "react";
import { Search } from "@mui/icons-material";
import { BASE_URL } from "../lib/baseurl";

const CustomerAmazonReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/amazon_reviews/`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="p-4 md:w-[80%] w-full mx-auto text-black flex flex-col h-fit">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#412666]">
          Amazon Bewertungen
        </h2>
        <div className="flex gap-2">
          {["csv", "xlsx", "pdf"].map((format) => (
            <button
              key={format}
              onClick={() =>
                window.open(
                  `${BASE_URL}/amazon_reviews/export?format=${format}`,
                  "_blank"
                )
              }
              className="px-3 py-1 border border-[#412666] rounded hover:bg-[#412666] hover:text-white transition-all">
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-[#412666] rounded-lg px-4 w-full md:w-1/3 flex items-center gap-2 mb-4">
        <Search />
        <input
          type="text"
          placeholder="Suche Produkt, Kampagne oder ASIN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-none py-2 focus:outline-none bg-transparent"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Lädt Bewertungen...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">Keine Bewertungen gefunden.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[#412666] border-b border-gray-200">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Produkt</th>
                <th className="py-2 px-3">Kampagne</th>
                <th className="py-2 px-3">ASIN</th>
                <th className="py-2 px-3">Link</th>
                <th className="py-2 px-3">Bewertung</th>
                <th className="py-2 px-3">Anzahl</th>
                <th className="py-2 px-3">Erfasst am</th>
              </tr>
            </thead>
            <tbody>
              {reviews
                .filter(
                  (r) =>
                    r.product?.toLowerCase().includes(search.toLowerCase()) ||
                    r.campaign?.toLowerCase().includes(search.toLowerCase()) ||
                    r.asin?.toLowerCase().includes(search.toLowerCase())
                )
                .map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-2 px-3">{r.id}</td>
                    <td className="py-2 px-3">{r.product}</td>
                    <td className="py-2 px-3">{r.campaign}</td>
                    <td className="py-2 px-3">{r.asin}</td>
                    <td className="py-2 px-3">
                      <a
                        href={r.product_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs">
                        Zum Produkt
                      </a>
                    </td>
                    <td className="py-2 px-3">{r.star_rating} ★</td>
                    <td className="py-2 px-3">{r.review_count}</td>
                    <td className="py-2 px-3">
                      {new Date(r.fetched_at).toLocaleString("de-DE")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerAmazonReviews;
