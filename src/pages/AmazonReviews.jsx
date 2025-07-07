// AmazonReviews.jsx
import React, { useEffect, useState } from "react";
import {
  Visibility,
  Delete,
  Edit,
  Search,
  AddComment,
  Summarize,
  Comment,
  AddCommentOutlined,
} from "@mui/icons-material";

const BASE_URL = "https://716f-102-89-69-162.ngrok-free.app";

const AmazonReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [singleReview, setSingleReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [asin, setAsin] = useState("");
  const [campaignID, setCampaignID] = useState("");
  const [fetchResult, setFetchResult] = useState(null);
  const [loadingReview, setLoadingReview] = useState(false);
  const [editingReview, setEditingReview] = useState(null); // holds the review being edited
  const [editFields, setEditFields] = useState({
    StarRating: "",
    ReviewText: "",
    CampaignID: "",
  });
  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/amazon_reviews/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleReview = async (reviewID) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/amazon_reviews/${reviewID}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });

      const data = await res.json();
      console.log("Single Amazon Review:", data);
      setSingleReview(data);
      setShowReviewModal(true);
    } catch (err) {
      console.error("Failed to fetch review details:", err);
    }
  };
  // null
  const fetchAndStoreAmazonReview = async () => {
    setLoadingReview(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/amazon_reviews/fetch`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({
          ASIN: asin,
          CampaignID: campaignID,
        }),
      });
      const data = await res.json();

      console.log("Fetched Amazon Review:", data);
      setFetchResult(data.review || null);
    } catch (err) {
      console.error("Error fetching Amazon review:", err);
    } finally {
      setLoadingReview(false);
    }
  };

  const updateAmazonReview = async (reviewID, updatedFields) => {
    const token = localStorage.getItem("token");

    // Optional: Clean and ensure required fields exist
    const payload = {
      StarRating: updatedFields.StarRating ?? null,
      ReviewText: updatedFields.ReviewText || "",
      CampaignID: updatedFields.CampaignID || "",
    };

    console.log("Updating Amazon review with payload:", payload);

    try {
      const response = await fetch(`${BASE_URL}/amazon_reviews/${reviewID}`, {
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
        fetchReviews(); // Refresh list
      } else {
        console.error("Update error:", data);
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  // now
  const [reviewComments, setReviewComments] = useState([]);
  const [showCommentsModal, setShowCommentsModal] = useState(false);

  const fetchReviewComments = async (reviewID) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${BASE_URL}/amazon_reviews/${reviewID}/comments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      console.log("Comments fetched:", data);

      return data; // returns an array (could be empty if no comments)
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };
  const handleShowComments = async (reviewID) => {
    const comments = await fetchReviewComments(reviewID);
    setReviewComments(comments); // make sure you define this in state
    setShowCommentsModal(true);
  };
  //  another now
  const [selectedComment, setSelectedComment] = useState(null);
  const [showSingleCommentModal, setShowSingleCommentModal] = useState(false);
  const [editText, setEditText] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [commentTargetReviewID, setCommentTargetReviewID] = useState(null);

  const handleAddComment = async () => {
    const token = localStorage.getItem("token");
    setEditLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/amazon_reviews/${commentTargetReviewID}/comment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            Text: newCommentText,
            ParentID: null,
          }),
        }
      );

      const data = await res.json();
      console.log("Kommentar hinzugefügt:", data);

      // Refresh comment list
      const updated = await fetchReviewComments(commentTargetReviewID);
      setReviewComments(updated);

      // Close modal
      setNewCommentText("");
      setShowAddCommentModal(false);
      setEditLoading(false);
    } catch (err) {
      console.error("Fehler beim Hinzufügen des Kommentars:", err);
      setEditLoading(false);
    }
  };

  const handleEditComment = async (commentID, reviewID) => {
    setEditLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${BASE_URL}/amazon_reviews/comment/${commentID}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({
            Text: editText,
          }),
        }
      );

      const data = await res.json();
      console.log("Comment updated:", data);
      setShowSingleCommentModal(false);
      setEditLoading(false);
    } catch (err) {
      console.error("Edit error:", err);
      setEditLoading(false);
    }
  };

  const handleDeleteComment = async (commentID) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${BASE_URL}/amazon_reviews/comment/${commentID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      const data = await res.json();
      console.log("Comment deleted:", data);
      setShowSingleCommentModal(false);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${BASE_URL}/amazon_reviews/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
      });
      fetchReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const handleExport = (format) => {
    window.open(`${BASE_URL}/amazon_reviews/export?format=${format}`, "_blank");
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = reviews.filter(
    (r) =>
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.asin.toLowerCase().includes(search.toLowerCase()) ||
      r.campaign.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 md:w-[80%] w-fit overflow-scroll mx-auto text-black flex flex-col h-fit ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[#412666]">
          Amazon Rezensionen
        </h2>
        <div className="flex gap-2">
          {["csv", "xlsx", "pdf"].map((format) => (
            <button
              key={format}
              onClick={() => handleExport(format)}
              className="border border-[#412666] px-4 py-2 rounded text-sm hover:bg-[#412666] hover:text-white transition-all">
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center mb-4 border border-[#412666] rounded-lg px-4 w-1/3 gap-2">
        <Search />
        <input
          type="text"
          placeholder="Suche nach Produkt, ASIN oder Kampagne..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="py-2 w-full focus:outline-none"
        />
      </div>
      <div className="mb-6 border border-[#412666] rounded-lg p-4 w-full md:w-2/3 bg-white shadow-sm">
        <h3 className="text-md font-semibold text-[#412666] mb-2">
          Neue Rezension abrufen
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="ASIN z.B. B08KHFZN9P"
            value={asin}
            onChange={(e) => setAsin(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            placeholder="Kampagnen-ID z.B. CMP123"
            value={campaignID}
            onChange={(e) => setCampaignID(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <button
            onClick={fetchAndStoreAmazonReview}
            disabled={loadingReview}
            className="bg-[#412666] text-white px-4 py-2 rounded hover:bg-[#341f4f] transition w-full md:w-auto">
            {loadingReview ? "Lädt..." : "Abrufen"}
          </button>
        </div>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="text-[#412666] border-b border-gray-200">
          <tr>
            <th className="py-2 px-3">Produkt</th>
            <th className="py-2 px-3">ASIN</th>
            <th className="py-2 px-3">Kampagne</th>
            <th className="py-2 px-3">Sterne</th>
            <th className="py-2 px-3">Rezension</th>
            <th className="py-2 px-3">Datum</th>
            <th className="py-2 px-3">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr
              key={r.id}
              className="border-b border-gray-200 hover:bg-gray-50">
              <td className="py-2 px-3">{r.product}</td>
              <td className="py-2 px-3">{r.asin}</td>
              <td className="py-2 px-3">{r.campaign}</td>
              <td className="py-2 px-3">{r.star_rating}</td>
              <td className="py-2 px-3 line-clamp-2">{r.review_text}</td>
              <td className="py-2 px-3">
                {new Date(r.fetched_at).toLocaleDateString()}
              </td>
              <td className="p-2 space-x-2">
                <a
                  className="text-blue-600 underline"
                  onClick={() => fetchSingleReview(r.id)}>
                  <Visibility fontSize="small" />
                </a>
                <button
                  className="cursor-pointer"
                  onClick={() => {
                    setEditingReview(r);
                    setEditFields({
                      StarRating: r.star_rating,
                      ReviewText: r.review_text,
                      CampaignID: r.campaign,
                    });
                  }}>
                  <Edit fontSize="small" />
                </button>
                <button
                  onClick={() => handleShowComments(r.id)}
                  className="text-blue-500 hover:underline"
                  title="Kommentare ansehen">
                  <Comment fontSize="small" />
                </button>
                <button
                  onClick={() => {
                    setCommentTargetReviewID(r.id);
                    setNewCommentText("");
                    setShowAddCommentModal(true);
                  }}
                  title="Kommentar hinzufügen"
                  className="text-green-600 hover:underline">
                  <AddCommentOutlined fontSize="small" />
                </button>

                <button
                  onClick={() => handleDelete(r.id)}
                  className="cursor-pointer">
                  <Delete fontSize="small" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showReviewModal && singleReview && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl w-full relative">
            <h2 className="text-2xl font-bold text-[#412666] mb-4 text-center">
              Amazon Rezension
            </h2>

            <div className="space-y-4 text-sm text-gray-700 max-h-[400px] overflow-y-auto pr-2">
              <div className="flex justify-between">
                <span className="font-semibold">ASIN:</span>
                <span>{singleReview.asin}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Produkt:</span>
                <span>{singleReview.product || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Kampagne:</span>
                <span>{singleReview.campaign}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Bewertungsanzahl:</span>
                <span>{singleReview.review_count}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Sternebewertung:</span>
                <span>{singleReview.star_rating}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Rezensionstext:</span>
                <span className="max-w-[60%] truncate">
                  {singleReview.review_text}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Produktlink:</span>
                <a
                  href={singleReview.product_link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline max-w-[60%] truncate">
                  {singleReview.product_link}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Abgerufen am:</span>
                <span>{singleReview.fetched_at?.split("T")[0]}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewModal(false)}
              className="mt-6 w-full bg-[#412666] text-white py-2 rounded-lg hover:bg-[#341f4f] transition cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {fetchResult && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow-sm text-sm space-y-2">
          <h3 className="text-lg font-semibold text-[#412666] mb-2">
            Abgerufene Rezension:
          </h3>
          <div>
            <strong>Produkt:</strong> {fetchResult.product}
          </div>
          <div>
            <strong>ASIN:</strong> {fetchResult.asin}
          </div>
          <div>
            <strong>Kampagne:</strong> {fetchResult.campaign}
          </div>
          <div>
            <strong>Sterne:</strong> {fetchResult.star_rating}
          </div>
          <div>
            <strong>Bewertung:</strong> {fetchResult.review_text}
          </div>
          <div>
            <strong>Produktlink:</strong>{" "}
            <a
              className="text-blue-600 underline"
              href={fetchResult.product_link}
              target="_blank">
              {fetchResult.product_link}
            </a>
          </div>
          <div>
            <strong>Abgerufen am:</strong>{" "}
            {fetchResult.fetched_at?.split("T")[0]}
          </div>
        </div>
      )}
      {editingReview && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold text-[#412666]">
              Rezension bearbeiten
            </h2>
            <input
              className="border p-2 w-full"
              placeholder="Sternebewertung"
              type="number"
              value={editFields.StarRating}
              onChange={(e) =>
                setEditFields({
                  ...editFields,
                  StarRating: parseFloat(e.target.value),
                })
              }
            />
            <textarea
              className="border p-2 w-full"
              placeholder="Rezensionstext"
              value={editFields.ReviewText}
              onChange={(e) =>
                setEditFields({ ...editFields, ReviewText: e.target.value })
              }
            />
            <input
              className="border p-2 w-full"
              placeholder="Kampagnen-ID"
              value={editFields.CampaignID}
              onChange={(e) =>
                setEditFields({ ...editFields, CampaignID: e.target.value })
              }
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  updateAmazonReview(editingReview.id, editFields);
                  setEditingReview(null);
                }}
                className="bg-[#412666] text-white px-4 py-2 rounded">
                Speichern
              </button>
              <button
                onClick={() => setEditingReview(null)}
                className="border px-4 py-2 rounded">
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
      {showCommentsModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <section className="bg-white p-4 rounded-lg max-w-lg w-full space-y-2">
            <div className="w-full space-y-2 h-[280px] overflow-scroll">
              <h2 className="text-xl font-semibold text-[#412666]">
                Kommentare
              </h2>
              {reviewComments.length === 0 ? (
                <p className="text-gray-500">Keine Kommentare vorhanden.</p>
              ) : (
                <ul className="space-y-2">
                  {reviewComments.map((comment) => (
                    <li
                      key={comment.id}
                      className=" rounded-md p-[10px] bg-gray-200 ">
                      <p className="text-sm text-gray-800">{comment.text}</p>
                      <p className="text-xs text-gray-400">
                        Von: {comment.author} am{" "}
                        {new Date(comment.created_at).toLocaleString()}
                      </p>
                      <span
                        className=" w-full flex items-center justify-center pt-4 cursor-pointer"
                        onClick={() => {
                          setSelectedComment(comment);
                          setEditText(comment.text);
                          setShowSingleCommentModal(true);
                          setShowCommentsModal(false);
                        }}>
                        <Visibility />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => setShowCommentsModal(false)}
              className="mt-4 bg-[#412666] text-white px-4 py-4 rounded w-full cursor-pointer">
              Schließen
            </button>
          </section>
        </div>
      )}
      {showSingleCommentModal && selectedComment && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg w-full max-w-lg space-y-4">
            <h2 className="text-lg font-semibold text-[#412666]">
              Kommentar verwalten
            </h2>
            <p className="text-sm text-gray-700">{selectedComment.text}</p>
            <p className="text-xs text-gray-500">
              Von: {selectedComment.author}
            </p>

            {/* Edit field */}
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Kommentar bearbeiten"
            />

            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded w-full cursor-pointer"
                onClick={() => handleDeleteComment(selectedComment.id)}>
                Löschen
              </button>
              <button
                onClick={() =>
                  handleEditComment(
                    selectedComment.id,
                    selectedComment.reviewID
                  )
                }
                disabled={editLoading}
                className="w-full  bg-[#412666] text-white py-2 rounded hover:bg-[#341f4f] cursor-pointer">
                {editLoading ? "Aktualisierung..." : "Aktualisieren"}
              </button>
            </div>

            <button
              onClick={() => setShowSingleCommentModal(false)}
              className="mt-4 w-full bg-gray-300 py-2 rounded cursor-pointer">
              Schließen
            </button>
          </div>
        </div>
      )}
      {showAddCommentModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
            <h2 className="text-xl font-bold text-[#412666] text-center">
              Kommentar hinzufügen
            </h2>
            <textarea
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Schreibe deinen Kommentar hier..."
              rows={4}
            />
            <div className="flex justify-end gap-2"></div>
            <div className="flex gap-2 justify-end">
              <button
                className="px-4 py-2 border border-[#412666] text-[#412666] rounded w-full cursor-pointer"
                onClick={() => setShowAddCommentModal(false)}>
                Abbrechen
              </button>
              <button
                onClick={handleAddComment}
                disabled={editLoading}
                className="w-full  bg-[#412666] text-white py-2 rounded hover:bg-[#341f4f] cursor-pointer">
                {editLoading ? "Kommentar hinzufügen..." : "Hinzufügen"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmazonReviews;
