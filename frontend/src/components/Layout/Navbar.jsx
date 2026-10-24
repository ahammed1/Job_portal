import React, { useContext } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/v1/user/logout",
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      setIsAuthorized(true);
    }
  };

  if (!isAuthorized) return null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/">
        CareerConnect
      </Link>
      <div className="collapse navbar-collapse show">
        <ul className="navbar-nav ms-auto align-items-center gap-3">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/job/getall">
              All Jobs
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/applications/me">
              {user && user.role === "Employer"
                ? "Applicant's Applications"
                : "My Applications"}
            </Link>
          </li>
          {user && user.role === "Employer" && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/job/post">
                  Post New Job
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/job/me">
                  View Your Jobs
                </Link>
              </li>
            </>
          )}
          <li className="nav-item">
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;