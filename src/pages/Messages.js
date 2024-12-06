import React from "react";
import CustomNavbar from "../components/Navbar";
import "../styles/Messages.css";

function Messages() {
  return (
    <>
      <CustomNavbar />
      <div className="messages-content">
        <h2>Your Messages</h2>
        <p>Check your conversations here.</p>
      </div>
    </>
  );
}

export default Messages;
