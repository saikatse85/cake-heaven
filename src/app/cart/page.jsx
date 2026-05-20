"use client";

import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const [items, setItems] = useState([]);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const updatedCart = cart.map((item) => ({
      ...item,
      quantity: Number(item.quantity) || 1,
    }));

    setItems(updatedCart);
  }, [cart]);

  //increase quantity
  const increaseQty = (id) => {
    const updated = items.map((item) =>
      item._id === id
        ? { ...item, quantity: Number(item.quantity || 1) + 1 }
        : item,
    );
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  //decrease quantity
  const decreaseQty = (id) => {
    const updated = items.map((item) =>
      item._id === id && item.quantity > 1
        ? { ...item, quantity: Number(item.quantity || 1) - 1 }
        : item,
    );
    setItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  //TOTAL PRICE
  const total = items.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0,
  );

  //ORDER FUNCTION
  const handleOrderAll = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("Please login first");
        return;
      }

      //REQUIRED VALIDATION
      if (!phone || !address || !message) {
        Swal.fire({
          icon: "warning",
          title: "Missing Info",
          text: "Phone, Address and Message are required!",
        });
        return;
      }
      // PHONE VALIDATION
      if (!/^01[3-9]\d{8}$/.test(phone)) {
        Swal.fire({
          icon: "error",
          title: "Invalid Phone",
          text: "Enter valid 11-digit Bangladeshi number (01XXXXXXXXX)",
        });
        return;
      }

      for (const item of items) {
        await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: user.email,
            userName: user.name,

            phone: phone,
            address: address,
            message: message,

            cakeId: item._id,
            cakeName: item.name,
            image: item.image,

            size: item.size || "regular",
            flavor: item.flavor || "default",

            quantity: item.quantity,
            price: item.discountPrice || item.price,

            totalPrice: (item.discountPrice || item.price) * item.quantity,

            deliveryDate: new Date(),
          }),
        });
      }

      Swal.fire({
        icon: "success",
        title: "Order Placed 🎉",
        text: "All items ordered successfully!",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        clearCart();
        setItems([]);
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Order Failed ❌",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 text-black dark:text-white">
      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold mb-6"
      >
        Your Cart 🛒
      </motion.h1>

      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Your cart is empty</p>
      ) : (
        <>
          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {items.map((item) => (
              <motion.div
                key={item._id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center justify-between p-4 rounded-2xl 
                bg-white/40 dark:bg-zinc-800/40 
                backdrop-blur-lg 
                border border-white/30 dark:border-zinc-700/40 
                shadow-lg"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4">
                  <motion.img
                    src={item.image}
                    className="w-20 h-20 rounded-lg object-cover"
                    alt={item.name}
                    whileHover={{ scale: 1.05 }}
                  />

                  <div>
                    <h2 className="font-semibold">{item.name}</h2>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ৳{item?.discountPrice || item?.price} × {item.quantity}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="px-2 bg-pink-200 dark:bg-zinc-700 rounded"
                      >
                        -
                      </button>

                      <span>{Number(item.quantity) || 1}</span>

                      <button
                        onClick={() => increaseQty(item._id)}
                        className="px-2 bg-pink-200 dark:bg-zinc-700 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    removeFromCart(item._id);

                    const updated = items.filter(
                      (cartItem) => cartItem._id !== item._id,
                    );

                    setItems(updated);

                    localStorage.setItem("cart", JSON.stringify(updated));
                  }}
                  className="text-pink-500 hover:text-pink-600 transition"
                >
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </motion.div>

          {/* FOOTER */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 border-t border-zinc-300/40 dark:border-zinc-700/40 pt-4 flex flex-col gap-3"
          >
            <h2 className="text-xl font-bold text-right">Total: ৳{total}</h2>

            {/* NEW INPUT FIELDS */}
            <div className="space-y-3">
              <input
                type="text"
                placeholder="📞 Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/40 dark:bg-zinc-800/40 border border-white/30 text-sm"
              />

              <input
                type="text"
                placeholder="📍 Delivery Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/40 dark:bg-zinc-800/40 border border-white/30 text-sm"
              />

              <textarea
                placeholder="📝 Message for cake"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2 rounded-lg bg-white/40 dark:bg-zinc-800/40 border border-white/30 text-sm"
              />
            </div>

            {/* ORDER BUTTON */}
            <button
              onClick={handleOrderAll}
              className="bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl"
            >
              Place Order
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}
