import Navbar from "@/components/Shared/Navbar";
import React from "react";

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar></Navbar>
      <div className="min-h-[64vh]">{children}</div>
    </div>
  );
};

export default Layout;
