import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import "../styles/MyListings.css";
import Layout from "../components/Layout";

function MyListings() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      axiosInstance
        .get(`/api/listings/user/${parsedUser.id}`)
        .then((response) => setListings(response.data))
        .catch((error) => console.error("Error fetching listings:", error));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleEditClick = (listingId) => {
    navigate(`/editlisting/${listingId}`);
  };

  const handleViewClick = (listingId) => {
    navigate(`/listings/${listingId}`);
  };

  const handleDeleteClick = async (listingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/api/listings/${listingId}`);
      alert("Listing deleted successfully!");
      // Refresh the list after deletion
      setListings((prev) => prev.filter((listing) => listing.id !== listingId));
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("Failed to delete the listing. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="my-listings-container">
        <h1 className="title">My Listings</h1>
        <div className="listings-grid">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <div key={listing.id} className="listing-card">
                <img
                  src={
                    listing.photos && listing.photos.length > 0
                      ? `http://localhost:9000${listing.photos[0].photo_url}`
                      : "/placeholder.jpg"
                  }
                  alt={listing.title}
                  className="listing-image"
                />
                <div className="listing-info">
                  <h3>{listing.title}</h3>
                  <p>{listing.address}</p>
                  <p>
                    <strong>${listing.monthly_rent}/mo</strong>
                  </p>
                  <p>
                    {listing.bedrooms} Bed | {listing.bathrooms} Bath
                  </p>
                  <div className="listing-actions">
                    <button
                      className="btn-view"
                      onClick={() => handleViewClick(listing.id)}
                    >
                      View
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(listing.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClick(listing.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-listings">No listings found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default MyListings;
