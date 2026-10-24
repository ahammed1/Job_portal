import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  const handleApplication = async (e) => {
    e.preventDefault();
    if (!resume) { toast.error("Please attach your resume."); return; }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/v1/application/post`, formData, { withCredentials: true });
      toast.success(data.message || "Application submitted");
      navigateTo("/applications/me");
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthorized) return <Navigate to="/login" replace />;
  if (user?.role === "Employer") return <Navigate to="/" replace />;

  return (
    <section className="container py-5" style={{ maxWidth: "680px" }}>
      <button type="button" className="btn btn-link px-0 text-decoration-none" onClick={() => navigateTo(-1)}>← Back</button>
      <div className="card border-0 shadow-sm p-4 p-md-5">
        <p className="text-primary fw-semibold small mb-1">JOB APPLICATION</p>
        <h2 className="fw-bold mb-2">Tell them about yourself</h2>
        <p className="text-muted mb-4">Complete your details and attach your resume to submit your application.</p>
        <form onSubmit={handleApplication} className="d-flex flex-column gap-3">
          <div><label className="form-label">Full name</label><input required type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" /></div>
          <div><label className="form-label">Email address</label><input required type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          <div><label className="form-label">Phone number</label><input required type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" /></div>
          <div><label className="form-label">Address</label><input required type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, country" /></div>
          <div><label className="form-label">Cover letter</label><textarea required className="form-control" rows="5" value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Why are you a good fit for this role?" /></div>
          <div><label className="form-label">Resume (PNG, JPG, WEBP)</label><input required type="file" className="form-control" accept=".webp,.jpg,.jpeg,.png" onChange={(e) => setResume(e.target.files?.[0] || null)} /></div>
          <button disabled={submitting} type="submit" className="btn btn-primary btn-lg">{submitting ? "Submitting…" : "Submit application"}</button>
        </form>
      </div>
    </section>
  );
};

export default Application;
