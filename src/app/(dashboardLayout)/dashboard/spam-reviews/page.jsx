"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function SpamReviewsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("/api/reviews?status=spam")
      .then((res) => res.json())
      .then((data) => setReviews(data));
  }, []);

  const handleApprove = async (id) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "approved",
      }),
    });

    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r._id !== id));

      Swal.fire({
        icon: "success",
        title: "Review Approved",
      });
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/reviews/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r._id !== id));

      Swal.fire({
        icon: "success",
        title: "Review Deleted",
      });
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">🚨 Spam Reviews</h1>

      {reviews.map((review) => (
        <div key={review._id} className="border rounded-xl p-4 space-y-2">
          <h2 className="font-semibold">{review.userName}</h2>

          <p>{review.comment}</p>

          <div className="flex gap-2">
            <button
              onClick={() => handleApprove(review._id)}
              className="bg-green-500 text-white px-4 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => handleDelete(review._id)}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
