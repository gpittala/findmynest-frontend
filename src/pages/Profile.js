import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosConfig";
import "../styles/Profile.css";
import Layout from "../components/Layout";

function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    university_id: "",
  });
  const [universities, setUniversities] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || "",
        email: parsedUser.email || "",
        mobile_number: parsedUser.mobile_number || "",
        password: "",
        university_id: parsedUser.university_id || "",
      });

      axiosInstance
        .get("/api/universities")
        .then((response) => setUniversities(response.data))
        .catch((error) => console.error("Error fetching universities:", error));
    } else {
      window.location.href = "/";
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { ...formData };
      if (!updatedData.password) {
        delete updatedData.password;
      }
      const response = await axiosInstance.put(
        `/api/users/${user.id}`,
        updatedData
      );
      localStorage.setItem("currentUser", JSON.stringify(response.data));
      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
  };

  return (
    <Layout>
      <div className="profile-container">
        <h1 className="profile-title">Profile</h1>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Mobile Number</label>
            <input
              type="text"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={!editMode}
            />
          </div>
          <div className="form-group">
            <label>University</label>
            <select
              name="university_id"
              value={formData.university_id}
              onChange={handleInputChange}
              disabled={!editMode}
            >
              <option value="">Select University</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>
          {editMode ? (
            <>
              <button
                type="button"
                className="btn-cancel"
                onClick={toggleEditMode}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save Changes
              </button>
            </>
          ) : (
            <button type="button" className="btn-edit" onClick={toggleEditMode}>
              Edit Profile
            </button>
          )}
        </form>
      </div>
    </Layout>
  );
}

export default Profile;
