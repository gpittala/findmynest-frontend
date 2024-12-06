import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { Tab, Tabs, Form, Button } from "react-bootstrap";
import { UserContext } from "../context/UserContext";
import "../styles/HomePage.css";

function HomePage() {
  const [key, setKey] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [institute, setInstitute] = useState("");
  const [universities, setUniversities] = useState([]);
  const { loginUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/api/universities")
      .then((response) => {
        setUniversities(response.data);
      })
      .catch((error) => {
        console.error("Error fetching universities:", error);
        alert("Failed to load universities. Please try again later.");
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });
      const userData = {
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
        mobile_number: response.data.user.mobile_number,
        university_id: response.data.user.university_id,
      };
      loginUser(userData);
      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      alert("Invalid email or password. Please try again.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/users/register", {
        name,
        email,
        password,
        mobile_number: mobile,
        university_id: institute,
      });
      alert("Registration successful! Please login.");
      setKey("login");
    } catch (error) {
      console.error(
        "Sign up failed:",
        error.response?.data?.message || error.message
      );
      alert("Registration failed. Please check your input and try again.");
    }
  };

  return (
    <div className="homepage">
      <div className="background-overlay">
        <div className="title-container">
          <h1 className="site-title">FindMyNest</h1>
          <p className="site-subtitle">
            Your perfect place is just a click away!
          </p>
        </div>
        <div className="auth-container">
          <h2 className="modal-title">Please Login To Continue</h2>
          <Tabs
            id="auth-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 auth-tabs"
          >
            <Tab eventKey="login" title="Sign In">
              <Form onSubmit={handleLogin} className="auth-form">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Username or email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Button type="submit" variant="success" className="w-100">
                  Sign In
                </Button>
              </Form>
            </Tab>
            <Tab eventKey="signup" title="Sign Up">
              <Form onSubmit={handleSignUp} className="auth-form">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Institute/Organization</Form.Label>
                  <Form.Control
                    as="select"
                    value={institute}
                    onChange={(e) => setInstitute(e.target.value)}
                    required
                  >
                    <option value="">Select Institute</option>
                    {universities.map((uni) => (
                      <option key={uni.id} value={uni.id}>
                        {uni.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Button type="submit" variant="success" className="w-100">
                  Sign Up
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
