import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    setRole(localStorage.getItem("role") || "");
  }, [location.pathname]);

  const logoutHandler = async () => {
    try {
      await api.get("/user/logout");
    } catch (error) {
      console.log("Logout error:", error);
    }

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setRole("");

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        JobPortal
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>

        {isLoggedIn && role === "student" && (
          <>
            <Link to="/jobs">Jobs</Link>
            <Link to="/my-applications">My Applications</Link>
            <Link to="/profile">Profile</Link>  
          </>
        )}

        {isLoggedIn && role === "recruiter" && (
          <>
            <Link to="/admin">Dashboard</Link>
          </>
        )}

        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={logoutHandler}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;