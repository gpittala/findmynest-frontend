import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import "../styles/Post.css";
import Layout from "../components/Layout";

function PostListing({ isEdit = false }) {
  const [user, setUser] = useState(null);
  const [universities, setUniversities] = useState([]);
  const [formData, setFormData] = useState({
    university_id: "",
    title: "",
    building_name: "",
    building_type: "Apartment",
    address: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    monthly_rent: "",
    security_deposit: "",
    lease_type: "lease",
    lease_duration: 1,
    sq_feet: "",
    amenities: "",
    fees_policies: "",
    contact_email: "",
    contact_mobile: "",
  });
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);
      axiosInstance
        .get("/api/universities")
        .then((response) => setUniversities(response.data))
        .catch((error) => console.error("Error fetching universities:", error));

      if (isEdit && id) {
        axiosInstance
          .get(`/api/listings/${id}`)
          .then((response) => {
            const { listing, photos } = response.data;
            setFormData({
              university_id: listing.university_id,
              title: listing.title,
              building_name: listing.building_name,
              building_type: listing.building_type,
              address: listing.address,
              description: listing.description,
              bedrooms: listing.bedrooms,
              bathrooms: listing.bathrooms,
              monthly_rent: listing.monthly_rent,
              security_deposit: listing.security_deposit,
              lease_type: listing.lease_type,
              lease_duration: listing.lease_duration,
              sq_feet: listing.sq_feet,
              amenities: listing.amenities,
              fees_policies: listing.fees_policies,
              contact_email: listing.contact_email,
              contact_mobile: listing.contact_mobile,
            });
            setExistingPhotos(photos);
          })
          .catch((error) =>
            console.error("Error fetching listing details:", error)
          );
      }
    } else {
      navigate("/");
    }
  }, [navigate, isEdit, id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos((prev) => [...prev, ...files]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleExistingPhotoRemove = async (photo) => {
    try {
      await axiosInstance.delete(`/api/listings/${id}/photos`, {
        data: { photo_url: photo.photo_url },
      });
      setExistingPhotos((prev) =>
        prev.filter((p) => p.photo_url !== photo.photo_url)
      );
      alert("Photo removed successfully!");
    } catch (error) {
      console.error("Error removing photo:", error);
      alert("Failed to remove photo. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address.trim()) {
      alert("Address is required!");
      return;
    }

    const listingData = {
      ...formData,
      user_id: user.id,
      availability: "available",
    };

    const formDataToSend = new FormData();
    Object.entries(listingData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    photos.forEach((photo) => formDataToSend.append("photos", photo));

    try {
      if (isEdit) {
        const response = await axiosInstance.put(
          `/api/listings/${id}`,
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Listing updated successfully!");
        navigate(`/listings/${response.data.id}`);
      } else {
        const response = await axiosInstance.post(
          "/api/listings",
          formDataToSend,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Listing created successfully!");
        navigate(`/listings/${response.data.id}`);
      }
    } catch (error) {
      console.error(
        isEdit ? "Error updating listing:" : "Error creating listing:",
        error
      );
      alert("Failed to save listing. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="post-listing-container">
        <h1 className="title">
          {isEdit ? "Edit Listing" : "Create a Listing"}
        </h1>
        <form className="post-listing-form" onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="form-group">
            <label>University</label>
            <select
              name="university_id"
              value={formData.university_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Building Name</label>
            <input
              type="text"
              name="building_name"
              value={formData.building_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Building Type</label>
            <select
              name="building_type"
              value={formData.building_type}
              onChange={handleInputChange}
            >
              <option>Apartment</option>
              <option>House</option>
              <option>Studio</option>
              <option>Condo</option>
              <option>Townhome</option>
            </select>
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Bedrooms</label>
            <select
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleInputChange}
            >
              {[...Array(10).keys()].map((n) => (
                <option key={n + 1} value={n + 1}>
                  {n + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Bathrooms</label>
            <select
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleInputChange}
            >
              {[...Array(10).keys()].map((n) => (
                <option key={n + 1} value={n + 1}>
                  {n + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Monthly Rent</label>
            <input
              type="number"
              name="monthly_rent"
              value={formData.monthly_rent}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Security Deposit</label>
            <input
              type="number"
              name="security_deposit"
              value={formData.security_deposit}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Lease Type</label>
            <select
              name="lease_type"
              value={formData.lease_type}
              onChange={handleInputChange}
            >
              <option>lease</option>
              <option>sublease</option>
            </select>
          </div>
          <div className="form-group">
            <label>Lease Duration (Months)</label>
            <select
              name="lease_duration"
              value={formData.lease_duration}
              onChange={handleInputChange}
            >
              {[...Array(12).keys()].map((n) => (
                <option key={n + 1} value={n + 1}>
                  {n + 1}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Square Feet</label>
            <input
              type="number"
              name="sq_feet"
              value={formData.sq_feet}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Amenities</label>
            <input
              type="text"
              name="amenities"
              value={formData.amenities}
              onChange={handleInputChange}
              placeholder="AC, Parking"
            />
          </div>
          <div className="form-group">
            <label>Fees & Policies</label>
            <textarea
              name="fees_policies"
              value={formData.fees_policies}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label>Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Mobile</label>
            <input
              type="tel"
              name="contact_mobile"
              value={formData.contact_mobile}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Upload Photos</label>
            <input type="file" multiple onChange={handleFileChange} />
            <div className="photo-preview">
              {photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <span>{photo.name}</span>
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="remove-photo"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {isEdit && existingPhotos.length > 0 && (
            <div className="form-group">
              <label>Existing Photos</label>
              <div className="photo-preview">
                {existingPhotos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <span>{photo.photo_url.split("/").pop()}</span>
                    <button
                      type="button"
                      onClick={() => handleExistingPhotoRemove(photo)}
                      className="remove-photo"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {isEdit ? "Save Changes" : "Post Listing"}
            </button>
            {isEdit && (
              <button
                type="button"
                className="btn-discard"
                onClick={() => navigate(-1)}
              >
                Discard
              </button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
}

export default PostListing;
