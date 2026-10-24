import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) return;
    let active = true;
    axios.get(`${API_BASE_URL}/api/v1/job/${id}`, { withCredentials: true })
      .then((res) => { if (active) setJob(res.data.job || {}); })
      .catch((err) => { if (active) setError(err.response?.data?.message || "Unable to load this job."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, isAuthorized]);

  if (!isAuthorized) return <Navigate to="/login" replace />;

  return (
    <section className="container py-5" style={{ maxWidth: "900px" }}>
      <Link to="/job/getall" className="text-decoration-none">← Back to all jobs</Link>
      {loading ? <p className="mt-4 text-muted">Loading job details…</p> : error ? <div className="alert alert-danger mt-4">{error}</div> : (
        <article className="card border-0 shadow-sm p-4 p-md-5 mt-3">
          <span className="badge text-bg-primary align-self-start mb-3">{job.category || "Open position"}</span>
          <h1 className="fw-bold">{job.title}</h1>
          <p className="text-muted">{[job.city, job.country].filter(Boolean).join(", ")}</p>
          <hr />
          <h5 className="fw-bold">About this role</h5>
          <p style={{ whiteSpace: "pre-wrap" }}>{job.description}</p>
          <div className="row g-3 my-2">
            <div className="col-sm-6"><div className="bg-light rounded-3 p-3"><small className="text-muted d-block">Location</small><strong>{job.location || [job.city, job.country].filter(Boolean).join(", ") || "Not specified"}</strong></div></div>
            <div className="col-sm-6"><div className="bg-light rounded-3 p-3"><small className="text-muted d-block">Salary</small><strong>{job.fixedSalary ? job.fixedSalary : job.salaryFrom != null || job.salaryTo != null ? `${job.salaryFrom ?? "—"} - ${job.salaryTo ?? "—"}` : "Not specified"}</strong></div></div>
          </div>
          {user?.role === "Job Seeker" && <Link to={`/application/${job._id}`} className="btn btn-primary mt-3 align-self-start">Apply for this job →</Link>}
        </article>
      )}
    </section>
  );
};

export default JobDetails;
