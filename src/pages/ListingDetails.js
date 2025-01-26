import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import "../styles/ListingDetails.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "../components/Layout";

function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get(`/api/listings/${id}`)
      .then((response) => {
        setListing(response.data.listing);
        setPhotos(response.data.photos);
        setUser(response.data.user);
      })
      .catch((error) => {
        console.error("Error fetching listing details:", error);
        navigate("/");
      });
  }, [id, navigate]);

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const startConversation = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser) {
        console.error("No logged-in user found");
        return;
      }

      const response = await axiosInstance.post("/api/messages/conversation", {
        user1Id: currentUser.id,
        user2Id: listing.user_id,
      });

      const { conversationId } = response.data;

      // Navigate to Messages page with the conversation started
      navigate("/messages", {
        state: { user2Id: listing.user_id, conversationId },
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  if (!listing) return <p>Loading...</p>;

  return (
    <Layout>
      <div className="listing-details">
        {/* Back Button */}
        <div className="container mt-3">
          <button
            className="btn btn-secondary back-button"
            onClick={() => navigate(-1)}
          >
            &#8592; Back
          </button>
        </div>
        {/* Main Content */}
        <div className="container-fluid mt-5 pt-5">
          {/* Image Carousel */}
          <div className="image-carousel position-relative">
            {photos.length > 0 ? (
              <>
                <button
                  className="carousel-btn btn btn-dark position-absolute top-50 start-0 translate-middle-y"
                  onClick={handlePrev}
                >
                  &#8249;
                </button>
                <img
                  src={`http://localhost:9000${photos[currentImageIndex].photo_url}`}
                  alt={`Listing ${currentImageIndex + 1}`}
                  className="img-fluid w-100"
                />
                <button
                  className="carousel-btn btn btn-dark position-absolute top-50 end-0 translate-middle-y"
                  onClick={handleNext}
                >
                  &#8250;
                </button>
                <div className="photo-count bg-dark text-white position-absolute bottom-0 end-0 p-2">
                  {currentImageIndex + 1} / {photos.length} Photos
                </div>
              </>
            ) : (
              <p className="text-center">No images available</p>
            )}
          </div>

          {/* Details Section */}
          <div className="details-section container mt-4">
            <h1>${listing.monthly_rent}/mo</h1>
            <h2>{listing.title}</h2>
            <p>
              {listing.address}{" "}
              {listing.building_name && `| ${listing.building_name}`}
            </p>
            <p>
              {listing.building_type} | {listing.bedrooms} Bed |{" "}
              {listing.bathrooms} Bath |{" "}
              {listing.availability ? "Available" : "Not Available"}
            </p>
            <hr />
            <h5>Overview</h5>
            <p>{listing.description}</p>
            <hr />
            {/* Amenities Section */}
            <h5>Amenities</h5>
            {listing.amenities ? (
              <ul className="amenities-list">
                {listing.amenities.split(",").map((amenity, index) => (
                  <li key={index}>{amenity.trim()}</li>
                ))}
              </ul>
            ) : (
              <p>No amenities listed.</p>
            )}
            <hr />

            {/* Fees & Policies Section */}
            <h5>Fees & Policies</h5>
            {listing.fees_policies ? (
              <p>{listing.fees_policies}</p>
            ) : (
              <p>No fees and policies listed.</p>
            )}
            <hr />
            <h5>Leasing Terms</h5>
            <p>
              Duration:{" "}
              {listing.lease_duration === 1
                ? `${listing.lease_duration} Month`
                : `${listing.lease_duration} Months`}
            </p>
            <p>Security Deposit: ${listing.security_deposit}</p>
            <hr />
            <h5>Contact</h5>
            <p>
              <strong>Name:</strong> {user?.name || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {listing.contact_email}
            </p>
            <p>
              <strong>Mobile:</strong> {listing.contact_mobile}
            </p>
            <button
              className="btn btn-primary"
              onClick={startConversation}
            >
              Message
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ListingDetails;
