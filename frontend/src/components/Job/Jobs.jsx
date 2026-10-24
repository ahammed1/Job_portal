import { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return;
    }
    let active = true;
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/api/v1/job/getall`, { withCredentials: true })
      .then((res) => {
        if (active) setJobs(Array.isArray(res.data.jobs) ? res.data.jobs : []);
      })
      .catch((err) => {
        if (active) setError(err.response?.data?.message || "Could not load jobs. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [isAuthorized, navigateTo]);

  const categories = useMemo(
    () => ["All", ...new Set(jobs.map((job) => job.category).filter(Boolean))],
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const place = location.trim().toLowerCase();
    return jobs.filter((job) => {
      const searchable = [job.title, job.category, job.description, job.city, job.country, job.location]
        .filter(Boolean).join(" ").toLowerCase();
      const jobPlace = [job.city, job.country, job.location].filter(Boolean).join(" ").toLowerCase();
      return (!query || searchable.includes(query)) &&
        (category === "All" || job.category === category) &&
        (!place || jobPlace.includes(place));
    });
  }, [jobs, search, category, location]);

  return (
    <section className="container py-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
        <div>
          <p className="text-primary fw-semibold mb-1">CAREERCONNECT</p>
          <h2 className="fw-bold mb-1">Explore opportunities</h2>
          <p className="text-muted mb-0">Find a role that matches your skills and goals.</p>
        </div>
        <span className="badge text-bg-light border fs-6">{filteredJobs.length} jobs found</span>
      </div>

      <div className="card border-0 shadow-sm p-3 p-md-4 mb-4">
        <div className="row g-3">
          <div className="col-lg-5">
            <label className="form-label fw-semibold" htmlFor="job-search">Search jobs</label>
            <input id="job-search" className="form-control" value={search}
              onChange={(e) => setSearch(e.target.value)} placeholder="Job title, skills, or keyword" />
          </div>
          <div className="col-lg-3">
            <label className="form-label fw-semibold" htmlFor="job-category">Category</label>
            <select id="job-category" className="form-select" value={category}
              onChange={(e) => setCategory(e.target.value)}>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
          <div className="col-lg-4">
            <label className="form-label fw-semibold" htmlFor="job-location">Location</label>
            <input id="job-location" className="form-control" value={location}
              onChange={(e) => setLocation(e.target.value)} placeholder="City or country" />
          </div>
        </div>
        <div className="text-end mt-3">
          <button className="btn btn-outline-secondary btn-sm" onClick={() => {
            setSearch(""); setCategory("All"); setLocation("");
          }}>Clear filters</button>
        </div>
      </div>

      {loading && <p className="text-muted">Loading available jobs…</p>}
      {!loading && error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && filteredJobs.length === 0 && (
        <div className="text-center border rounded-4 p-5">
          <h5 className="fw-bold">No matching jobs</h5>
          <p className="text-muted mb-3">Try changing your search or filters.</p>
          <button className="btn btn-outline-primary" onClick={() => {
            setSearch(""); setCategory("All"); setLocation("");
          }}>Show all jobs</button>
        </div>
      )}
      <div className="row g-4">
        {!loading && !error && filteredJobs.map((job) => (
          <div className="col-md-6 col-xl-4" key={job._id}>
            <article className="card h-100 border-0 shadow-sm p-4">
              <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                <span className="badge text-bg-primary-subtle text-primary">{job.category || "General"}</span>
                <span className="small text-muted">{[job.city, job.country].filter(Boolean).join(", ")}</span>
              </div>
              <h5 className="fw-bold">{job.title}</h5>
              <p className="text-muted flex-grow-1">{job.description?.length > 135 ? `${job.description.slice(0, 135)}…` : job.description}</p>
              <p className="small mb-3"><strong>Location:</strong> {job.location || [job.city, job.country].filter(Boolean).join(", ") || "Not specified"}</p>
              <Link to={`/job/${job._id}`} className="btn btn-outline-primary mt-auto">View job details <span aria-hidden="true">→</span></Link>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Jobs;
