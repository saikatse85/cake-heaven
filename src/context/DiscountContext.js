"use client";

import { createContext, useContext, useState } from "react";

const DiscountContext = createContext();

export function DiscountProvider({ children }) {
  const [discount, setDiscount] = useState(0);

  return (
    <DiscountContext.Provider value={{ discount, setDiscount }}>
      {children}
    </DiscountContext.Provider>
  );
}

export function useDiscount() {
  return useContext(DiscountContext);
}
