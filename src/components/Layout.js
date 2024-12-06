import React from "react";
import Navbar from "./Navbar";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar />
      <div className="content-container">{children}</div>
    </div>
  );
};

export default Layout;
