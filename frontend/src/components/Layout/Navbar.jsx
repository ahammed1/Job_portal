import React, { useContext } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const Navbar = () => {
  const { isAuthorized, setIsAuthorized, setUser, user } = useContext(Context);
  const navigateTo = useNavigate();
  const isEmployer = user?.role === "Employer";

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/user/logout`, { withCredentials: true });
      toast.success(response.data.message || "Logged out successfully");
      setIsAuthorized(false);
      setUser({});
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  if (!isAuthorized) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3 px-lg-4">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">Talviro</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#talviroNav" aria-controls="talviroNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="talviroNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/job/getall">Browse Jobs</Link></li>
            {isEmployer ? (
              <>
                <li className="nav-item"><Link className="nav-link" to="/job/post">Post a Job</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/job/me">Manage Jobs</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/applications/me">Applicants</Link></li>
              </>
            ) : (
              <li className="nav-item"><Link className="nav-link" to="/applications/me">My Applications</Link></li>
            )}
            <li className="nav-item ms-lg-2">
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
