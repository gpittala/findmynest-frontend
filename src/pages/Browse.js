import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Browse.css";

function BrowseListings() {
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/api/universities")
      .then((response) => setUniversities(response.data))
      .catch((error) => console.error("Error fetching universities:", error));
  }, []);
  console.log(universities);
  const handleSearch = () => {
    if (selectedUniversity) {
      axiosInstance
        .get(`/api/listings?university_id=${selectedUniversity}`)
        .then((response) => setListings(response.data))
        .catch((error) =>
          console.error("Error fetching listings for university:", error)
        );
    }
  };

  return (
    <Layout>
      <div className="browse-listings-content">
        <div className="search-bar">
          <h1 className="search-title">Find your perfect place.</h1>
          <div className="search-input-group">
            <select
              className="form-select"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
            >
              <option value="" disabled>
                Select a University
              </option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        <div className="listings-section">
          {listings.length > 0 ? (
            <div className="listings-grid">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="listing-card"
                  onClick={() => navigate(`/listings/${listing.id}`)}
                >
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-listings">No listings available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default BrowseListings;
