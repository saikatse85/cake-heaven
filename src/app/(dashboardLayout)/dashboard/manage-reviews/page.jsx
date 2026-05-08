"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ManageReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedComment, setEditedComment] = useState("");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(6);

  // Load Reviews
  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  // Delete Review
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Review?",
      text: "This review will be removed permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ec4899",
    });

    if (!result.isConfirmed) return;

    const res = await fetch(`/api/reviews/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setReviews((prev) => prev.filter((review) => review._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted Successfully",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  // Approve Review
  const handleApprove = async (id) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "approved",
      }),
    });

    if (res.ok) {
      setReviews((prev) =>
        prev.map((review) =>
          review._id === id ? { ...review, status: "approved" } : review,
        ),
      );

      Swal.fire({
        icon: "success",
        title: "Review Approved",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  // Start Edit
  const handleEdit = (review) => {
    setEditingId(review._id);
    setEditedComment(review.comment);
  };

  // Save Edit
  const handleSave = async (id) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        comment: editedComment,
      }),
    });

    if (res.ok) {
      setReviews((prev) =>
        prev.map((review) =>
          review._id === id ? { ...review, comment: editedComment } : review,
        ),
      );

      setEditingId(null);

      Swal.fire({
        icon: "success",
        title: "Review Updated",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  };

  // pagination logic
  const totalPages = Math.ceil(reviews.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedReviews = reviews.slice(startIndex, startIndex + perPage);

  return (
    <div
      className="
      p-6 min-h-screen space-y-6
      bg-gradient-to-br
      from-pink-200/60 via-rose-100/50 to-pink-300/60
      dark:from-[#1a0f14]
      dark:via-[#2a121c]
      dark:to-[#14080d]
      text-black dark:text-white
    "
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        Manage Reviews ⭐
      </motion.h1>

      {/* PAGE SIZE */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Show:</span>

        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="border p-1 rounded text-sm bg-white dark:bg-zinc-800"
        >
          <option value={6}>6</option>
          <option value={9}>9</option>
          <option value={12}>12</option>
          <option value={15}>15</option>
        </select>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {paginatedReviews.map((review, index) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className="
              rounded-2xl
              bg-pink-100/40 dark:bg-pink-500/10
              backdrop-blur-2xl
              border border-pink-200/40 dark:border-pink-400/10
            "
            >
              <CardContent className="p-5 space-y-4">
                <div>
                  <h2 className="font-bold text-lg">{review.userName}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {review.cakeName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-semibold">Rating:</span>
                  <span className="text-yellow-500">⭐ {review.rating}</span>
                </div>

                {editingId === review._id ? (
                  <Textarea
                    value={editedComment}
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{review.comment}</p>
                )}

                <div className="flex items-center justify-between">
                  <span
                    className={`
                    text-xs px-3 py-1 rounded-full
                    ${
                      review.status === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-black"
                    }
                  `}
                  >
                    {review.status || "pending"}
                  </span>

                  <div className="flex gap-2">
                    {editingId === review._id ? (
                      <Button
                        onClick={() => handleSave(review._id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleEdit(review)}
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        Edit
                      </Button>
                    )}

                    <Button
                      onClick={() => handleApprove(review._id)}
                      className="bg-pink-500 hover:bg-pink-600"
                    >
                      Approve
                    </Button>

                    <Button
                      onClick={() => handleDelete(review._id)}
                      variant="destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-4 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-pink-500 text-white rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`px-3 py-1 rounded ${
              currentPage === num
                ? "bg-pink-600 text-white"
                : "bg-white dark:bg-zinc-800"
            }`}
          >
            {num}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-pink-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
