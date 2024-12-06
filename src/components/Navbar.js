import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { Nav, Navbar, Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function CustomNavbar() {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(); // Clear user session
    navigate("/"); // Redirect to homepage
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>{user ? `Hello, ${user.name}` : "Welcome"}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/dashboard">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/browse">
              Browse
            </Nav.Link>
            <Nav.Link as={Link} to="/post">
              Post
            </Nav.Link>
            <Nav.Link as={Link} to="/mylistings">
              MyListings
            </Nav.Link>
            <Nav.Link as={Link} to="/messages">
              Messages
            </Nav.Link>
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
