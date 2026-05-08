"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import ReviewModal from "./ReviewModal";

export default function OrderDetailsModal({ order, onClose }) {
  const [openReview, setOpenReview] = useState(false);

  if (!order) return null;

  // TRACKING STEPS
  const steps = [
    "pending",
    "confirmed",
    "processing",
    "out_for_delivery",
    "delivered",
  ];

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>Order Voucher</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            background: #fff;
            color: #000;
          }
          .box {
            max-width: 600px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 10px;
          }
          img {
            width: 100%;
            height: 250px;
            object-fit: cover;
            border-radius: 10px;
          }
          h2 {
            color: #ec4899;
            text-align: center;
          }
          p {
            margin: 6px 0;
            font-size: 14px;
          }
          .row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            flex-wrap: wrap;
          }

          .signature {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
            gap: 40px;
          }

          .sig-box {
            width: 45%;
            text-align: center;
          }

          .line {
            margin-top: 50px;
            border-top: 1px solid #000;
          }

          .label {
            margin-top: 5px;
            font-size: 13px;
            font-weight: bold;
          }

          .footer {
            text-align: center;
            font-size: 12px;
            margin-top: 20px;
          }
        </style>
      </head>

      <body>
        <div class="box">
          <h2>🍰 Cake Order Voucher</h2>

          <img src="${order.image}" />

          <div class="row">
            <p><b>Cake:</b> ${order.cakeName}</p>
            <p><b>User:</b> ${order.userName}</p>
          </div>

          <div class="row">
            <p><b>Phone:</b> ${order.phone}</p>
            <p><b>Email:</b> ${order.userEmail}</p>
          </div>

          <div class="row">
            <p><b>Size:</b> ${order.size}</p>
            <p><b>Flavor:</b> ${order.flavor}</p>
          </div>

          <div class="row">
            <p><b>Qty:</b> ${order.quantity}</p>
            <p><b>Price:</b> $${order.price}</p>
          </div>

          <div class="row">
            <p><b>Total:</b> $${order.totalPrice}</p>
            <p><b>Payment:</b> ${order.paymentMethod}</p>
          </div>

          <p><b>Delivery Date:</b> ${order.deliveryDate}</p>
          <p><b>Status:</b> ${order.status}</p>

          <p><b>Message:</b> ${order.message || "N/A"}</p>
          <p><b>Address:</b> ${order.address || "N/A"}</p>

          <hr />

          <div class="signature">

            <div class="sig-box">
              <div class="line"></div>
              <div class="label">Customer Signature</div>
              <p style="margin-top:5px;font-size:12px;">
                ${order.userName}
              </p>
            </div>

            <div class="sig-box">
              <div class="line"></div>
              <div class="label">Seller Signature</div>
              <p style="margin-top:5px;font-size:12px;">
                Cake Heaven Admin
              </p>
            </div>

          </div>

          <p class="footer">
            Thank you for ordering from Cake Heaven 🎂
          </p>
        </div>

        <script>
          window.print();
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="
            w-full max-w-2xl 
            rounded-3xl 
            bg-white/20 dark:bg-zinc-900/30 
            backdrop-blur-2xl 
            border border-white/20 
            shadow-2xl 
            p-6 space-y-4
            text-black dark:text-white
            relative
          "
        >
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-pink-500">Order Details</h2>

            <button
              onClick={onClose}
              className="px-3 py-1 bg-pink-500 text-white rounded"
            >
              Close
            </button>
          </div>

          {/* IMAGE */}
          <img
            src={order.image}
            className="w-full h-48 object-cover rounded-xl"
          />

          {/* INFO GRID */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p>
              <b>Cake:</b> {order.cakeName}
            </p>

            <p>
              <b>User:</b> {order.userName}
            </p>

            <p>
              <b>Phone:</b> {order.phone}
            </p>

            <p>
              <b>Email:</b> {order.userEmail}
            </p>

            <p>
              <b>Size:</b> {order.size}
            </p>

            <p>
              <b>Flavor:</b> {order.flavor}
            </p>

            <p>
              <b>Qty:</b> {order.quantity}
            </p>

            <p>
              <b>Price:</b> ${order.price}
            </p>

            <p>
              <b>Total:</b> ${order.totalPrice}
            </p>

            <p>
              <b>Payment:</b> {order.paymentMethod}
            </p>

            <p>
              <b>Delivery:</b> {order.deliveryDate}
            </p>

            <p>
              <b>Status:</b> {order.status}
            </p>
          </div>

          {/* ORDER TRACKING BAR */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-pink-500">Order Tracking</h3>

            <div className="flex flex-wrap gap-2">
              {steps.map((step, index) => {
                const active = steps.indexOf(order.status) >= index;

                return (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      px-3 py-1 rounded-full text-xs font-semibold
                      transition-all duration-300 shadow
                      ${
                        active
                          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                          : "bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-300"
                      }
                    `}
                  >
                    {step.replaceAll("_", " ")}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* EXTRA */}
          <p className="text-sm">
            <b>Message:</b> {order.message}
          </p>

          <p className="text-sm">
            <b>Address:</b> {order.address}
          </p>

          <p className="text-sm text-blue-500 break-all">
            <b>Design:</b> {order.design || "N/A"}
          </p>

          <p className="text-sm text-blue-500 break-all">
            <b>Reference:</b> {order.referenceImage || "N/A"}
          </p>

          {/* TRACKING TIMELINE */}
          <div className="mt-4 space-y-3">
            <h3 className="text-sm font-bold text-pink-500">
              Tracking Timeline
            </h3>

            {order?.trackingHistory?.length > 0 ? (
              order.trackingHistory.map((track, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="
                    border-l-4 border-pink-500
                    pl-4 py-2
                    bg-white/10 dark:bg-zinc-800/30
                    rounded-r-xl
                  "
                >
                  <p className="font-semibold capitalize text-sm">
                    {track.status.replaceAll("_", " ")}
                  </p>

                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {track.message}
                  </p>

                  <p className="text-[11px] text-gray-400 mt-1">
                    {new Date(track.time).toLocaleString()}
                  </p>
                </motion.div>
              ))
            ) : (
              <p className="text-xs text-gray-400">No tracking updates yet</p>
            )}
          </div>

          {/* REVIEW BUTTON AFTER DELIVERY */}
          {order.status === "delivered" && !order.reviewed && (
            <button
              onClick={() => setOpenReview(true)}
              className="
                absolute bottom-4 right-4
                px-4 py-2
                bg-gradient-to-r from-yellow-400 to-orange-500
                text-white text-sm rounded-xl
                shadow-lg hover:scale-105 transition
              "
            >
              ⭐ Share Review
            </button>
          )}

          {/* PRINT BUTTON */}
          <button
            onClick={handlePrint}
            className="
              absolute bottom-4 left-4
              px-4 py-2 
              bg-gradient-to-r from-pink-500 to-rose-500 
              text-white text-sm rounded-xl
              shadow-lg hover:scale-105 transition
            "
          >
            🖨 Print Voucher
          </button>

          {/* REVIEW MODAL */}
          <ReviewModal
            isOpen={openReview}
            onClose={() => setOpenReview(false)}
            cake={{
              _id: order.cakeId,
              name: order.cakeName,
              image: order.image,
            }}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
