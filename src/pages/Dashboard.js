import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import Layout from "../components/Layout";
import "../styles/Dashboard.css";

function Dashboard() {
  const [universityListings, setUniversityListings] = useState([]);
  const [universityName, setUniversityName] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      axiosInstance
        .get(`/api/universities/${parsedUser.university_id}`)
        .then((response) => setUniversityName(response.data.name))
        .catch((error) =>
          console.error("Error fetching university name:", error)
        );

      axiosInstance
        .get(`/api/listings?university_id=${parsedUser.university_id}`)
        .then((response) => setUniversityListings(response.data.slice(0, 4)))
        .catch((error) => console.error("Error fetching listings:", error));
    } else {
      navigate("/");
    }
  }, [navigate]);

  const firstName = user?.name?.split(" ")[0] || "Guest";

  return (
    <Layout>
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome to FindMyNest</h1>
          <p className="personalized-greeting">
            Hello, {firstName}! Here's what's new today:
          </p>
        </div>

        <div className="things-to-consider">
          <h2>Things to Consider Before Renting:</h2>
          <ul>
            <li>Inspect the property thoroughly before signing.</li>
            <li>Check the neighborhood for convenience and safety.</li>
            <li>Understand the lease agreement fully.</li>
            <li>Budget for rent, utilities, and extra costs.</li>
            <li>Ensure all amenities are functional before moving in.</li>
          </ul>
        </div>

        <div className="recent-listings">
          <h2>
            Most Recent Listings near {universityName || "Your University"}:
          </h2>
          <div className="listings-grid">
            {universityListings.length > 0 ? (
              universityListings.map((listing) => (
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
              ))
            ) : (
              <p className="no-listings">
                No listings available at the moment.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
