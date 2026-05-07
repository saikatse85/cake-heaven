"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

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

          /* ✅ SIGNATURE SECTION */
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

          <!-- ✅ SIGNATURE SECTION -->
          <div class="signature">
            
            <!-- CUSTOMER -->
            <div class="sig-box">
              <div class="line"></div>
              <div class="label">Customer Signature</div>
              <p style="margin-top:5px;font-size:12px;">
                ${order.userName}
              </p>
            </div>

            <!-- SELLER -->
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

          {/* ✅ PRINT BUTTON (BOTTOM LEFT) */}
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
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
