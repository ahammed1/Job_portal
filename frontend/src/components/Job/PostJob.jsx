import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const PostJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFrom, setSalaryFrom] = useState("");
  const [salaryTo, setSalaryTo] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [salaryType, setSalaryType] = useState("default");
  const [submitting, setSubmitting] = useState(false);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleJobPost = async (e) => {
    e.preventDefault();
    if (salaryType === "default") { toast.error("Please select a salary type."); return; }
    const payload = salaryType === "Fixed Salary"
      ? { title, description, category, country, city, location, fixedSalary: Number(fixedSalary) }
      : { title, description, category, country, city, location, salaryFrom: Number(salaryFrom), salaryTo: Number(salaryTo) };
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/v1/job/post`, payload, { withCredentials: true });
      toast.success(res.data.message || "Job posted successfully");
      navigateTo("/job/me");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error posting job");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthorized) return <Navigate to="/login" replace />;
  if (user?.role !== "Employer") return <Navigate to="/" replace />;

  return (
    <section className="container py-5" style={{ maxWidth: "760px" }}>
      <button type="button" className="btn btn-link px-0 text-decoration-none" onClick={() => navigateTo(-1)}>← Back</button>
      <div className="card border-0 shadow-sm p-4 p-md-5">
        <p className="text-primary fw-semibold small mb-1">EMPLOYER WORKSPACE</p>
        <h2 className="fw-bold mb-2">Post a new job</h2>
        <p className="text-muted mb-4">Share the details candidates need to decide if this role is right for them.</p>
        <form onSubmit={handleJobPost} className="row g-3">
          <div className="col-12"><label className="form-label">Job title</label><input required minLength="3" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Frontend Developer" /></div>
          <div className="col-12"><label className="form-label">Category</label><select required className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Select category</option><option>Full Stack Development</option><option>MERN Stack Development</option><option>Frontend Web Development</option><option>Data Entry Operator</option><option>Data Science</option><option>Backend Development</option><option>UI/UX Design</option></select></div>
          <div className="col-md-6"><label className="form-label">Country</label><input required className="form-control" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" /></div>
          <div className="col-md-6"><label className="form-label">City</label><input required className="form-control" value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" /></div>
          <div className="col-12"><label className="form-label">Full location</label><input required minLength="20" className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Enter the full location (at least 20 characters)" /></div>
          <div className="col-12"><label className="form-label">Salary type</label><select required className="form-select" value={salaryType} onChange={(e) => setSalaryType(e.target.value)}><option value="default">Select salary type</option><option value="Fixed Salary">Fixed salary</option><option value="Ranged Salary">Salary range</option></select></div>
          {salaryType === "Fixed Salary" && <div className="col-12"><label className="form-label">Annual salary</label><input required min="0" type="number" className="form-control" value={fixedSalary} onChange={(e) => setFixedSalary(e.target.value)} placeholder="Enter salary" /></div>}
          {salaryType === "Ranged Salary" && <><div className="col-md-6"><label className="form-label">Salary from</label><input required min="0" type="number" className="form-control" value={salaryFrom} onChange={(e) => setSalaryFrom(e.target.value)} /></div><div className="col-md-6"><label className="form-label">Salary to</label><input required min="0" type="number" className="form-control" value={salaryTo} onChange={(e) => setSalaryTo(e.target.value)} /></div></>}
          <div className="col-12"><label className="form-label">Job description</label><textarea required minLength="30" rows="6" className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Responsibilities, requirements, and benefits…" /></div>
          <div className="col-12"><button disabled={submitting} type="submit" className="btn btn-primary btn-lg w-100">{submitting ? "Publishing…" : "Publish job"}</button></div>
        </form>
      </div>
    </section>
  );
};

export default PostJob;
