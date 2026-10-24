import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { isAuthorized, setIsAuthorized } = useContext(Context);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/v1/user/register`, { name, phone, email, role, password }, {
        headers: { "Content-Type": "application/json" }, withCredentials: true,
      });
      toast.success(data.message || "Account created successfully");
      setIsAuthorized(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (isAuthorized) return <Navigate to="/" replace />;

  return (
    <div className="container py-5" style={{ maxWidth: "500px" }}>
      <div className="card border-0 shadow-sm p-4 p-md-5">
        <p className="text-primary fw-semibold small mb-1">JOIN CAREERCONNECT</p>
        <h2 className="mb-2 fw-bold">Create your account</h2>
        <p className="text-muted mb-4">Choose how you want to use the job portal.</p>
        <form onSubmit={handleRegister}>
          <div className="mb-3"><label className="form-label">Register as</label><select required className="form-select" value={role} onChange={(e) => setRole(e.target.value)}><option value="">Select role</option><option value="Employer">Employer</option><option value="Job Seeker">Job Seeker</option></select></div>
          <div className="mb-3"><label className="form-label">Full name</label><input required minLength="2" type="text" className="form-control" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="mb-3"><label className="form-label">Email address</label><input required type="email" className="form-control" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="mb-3"><label className="form-label">Phone number</label><input required type="tel" className="form-control" placeholder="Your phone number" value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
          <div className="mb-4"><label className="form-label">Password</label><input required minLength="8" type="password" className="form-control" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          <button disabled={submitting} type="submit" className="btn btn-primary w-100 mb-3">{submitting ? "Creating account…" : "Create account"}</button>
          <Link to="/login" className="d-block text-center">Already registered? Login</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
