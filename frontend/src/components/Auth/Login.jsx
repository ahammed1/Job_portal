import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/v1/user/login`, { email, password, role }, {
        headers: { "Content-Type": "application/json" }, withCredentials: true,
      });
      toast.success(data.message || "Login successful");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthorized) return <Navigate to="/" replace />;

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <div className="card border-0 shadow-sm p-4 p-md-5">
        <p className="text-primary fw-semibold small mb-1">WELCOME BACK</p>
        <h2 className="mb-2 fw-bold">Login to CareerConnect</h2>
        <p className="text-muted mb-4">Sign in to continue to your workspace.</p>
        <form onSubmit={handleLogin}>
          <div className="mb-3"><label className="form-label">Login as</label><select required className="form-select" value={role} onChange={(e) => setRole(e.target.value)}><option value="">Select role</option><option value="Employer">Employer</option><option value="Job Seeker">Job Seeker</option></select></div>
          <div className="mb-3"><label className="form-label">Email address</label><input required type="email" className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="mb-4"><label className="form-label">Password</label><input required type="password" className="form-control" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button disabled={submitting} type="submit" className="btn btn-primary w-100 mb-3">{submitting ? "Signing in…" : "Login"}</button>
          <Link to="/register" className="d-block text-center">Don't have an account? Register</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
