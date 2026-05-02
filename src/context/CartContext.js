"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const getCartKey = (uid) => `cart_${uid}`;

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);

  // Load cart when user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // ✅ handle logout properly
        setUserId(null);
        setCart([]);
        return;
      }

      const uid = currentUser.uid;
      setUserId(uid);

      const savedCart = localStorage.getItem(getCartKey(uid));
      setCart(savedCart ? JSON.parse(savedCart) : []);
    });

    return () => unsubscribe();
  }, []);

  // Save cart per user
  const saveCart = (uid, data) => {
    localStorage.setItem(getCartKey(uid), JSON.stringify(data));
  };

  // ADD TO CART
  const addToCart = (product) => {
    if (!userId) {
      console.log("User not logged in");
      return;
    }

    setCart((prev) => {
      const exists = prev.find((item) => item._id === product._id);

      let updated;

      if (exists) {
        updated = prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updated = [...prev, { ...product, quantity: 1 }];
      }

      saveCart(userId, updated); // ✅ use helper

      return updated;
    });
  };

  // REMOVE ITEM
  const removeFromCart = (id) => {
    if (!userId) return;

    setCart((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      saveCart(userId, updated);
      return updated;
    });
  };

  // CLEAR CART (logout / order use)
  const clearCart = () => {
    if (!userId) return;

    localStorage.removeItem(getCartKey(userId));
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);