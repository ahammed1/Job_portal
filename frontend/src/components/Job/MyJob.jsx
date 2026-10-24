import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { Link, Navigate } from "react-router-dom";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized || user?.role !== "Employer") return;
    let active = true;
    axios.get(`${API_BASE_URL}/api/v1/job/getmyjobs`, { withCredentials: true })
      .then((res) => { if (active) setMyJobs(Array.isArray(res.data.myJobs) ? res.data.myJobs : []); })
      .catch((error) => toast.error(error.response?.data?.message || "Failed to load jobs"))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isAuthorized, user?.role]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job listing? This action cannot be undone.")) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/v1/job/delete/${jobId}`, { withCredentials: true });
      toast.success(res.data.message || "Job deleted");
      setMyJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (!isAuthorized) return <Navigate to="/login" replace />;
  if (user?.role !== "Employer") return <Navigate to="/" replace />;

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
        <div><p className="text-primary fw-semibold small mb-1">EMPLOYER WORKSPACE</p><h2 className="fw-bold mb-1">Manage your jobs</h2><p className="text-muted mb-0">Review and manage the listings you've published.</p></div>
        <Link to="/job/post" className="btn btn-primary">＋ Post a job</Link>
      </div>
      {loading ? <p className="text-muted">Loading your job listings…</p> : myJobs.length === 0 ? (
        <div className="border rounded-4 text-center p-5"><h5 className="fw-bold">No job listings yet</h5><p className="text-muted">Publish your first opportunity to start receiving applications.</p><Link to="/job/post" className="btn btn-primary">Create your first job</Link></div>
      ) : <div className="row g-4">{myJobs.map((job) => (
        <div className="col-md-6 col-xl-4" key={job._id}><article className="card h-100 border-0 shadow-sm p-4">
          <span className="badge text-bg-primary align-self-start mb-3">{job.category || "General"}</span><h5 className="fw-bold">{job.title}</h5>
          <p className="text-muted small">{[job.city, job.country].filter(Boolean).join(", ")}</p><p className="text-muted flex-grow-1">{job.description?.length > 160 ? `${job.description.slice(0, 160)}…` : job.description}</p>
          <div className="d-flex gap-2 mt-auto"><Link to={`/job/${job._id}`} className="btn btn-outline-primary btn-sm">View</Link><button onClick={() => handleDeleteJob(job._id)} className="btn btn-outline-danger btn-sm">Delete job</button></div>
        </article></div>
      ))}</div>}
    </section>
  );
};

export default MyJobs;
