import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import Browse from "./pages/Browse";
import Post from "./pages/Post";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import { UserContext } from "./context/UserContext";
import ListingDetails from "./pages/ListingDetails";
import MyListings from "./pages/MyListings";

function App() {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={!user ? <HomePage /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/browse" element={user ? <Browse /> : <Navigate to="/" />} />
      <Route path="/post" element={user ? <Post /> : <Navigate to="/" />} />
      <Route path="/messages" element={user ? <Messages /> : <Navigate to="/" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/" />} />
      <Route path="/listings/:id" element={user ? <ListingDetails /> : <Navigate to="/" />} />
      <Route path="/mylistings" element={user ? <MyListings /> : <Navigate to="/" />} />
      <Route path="/editlisting/:id" element={user ? <Post isEdit={true} /> : <Navigate to="/" />} />
    </Routes>
  );
}

export default App;
