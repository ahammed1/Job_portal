import { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, Navigate } from "react-router-dom";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/$/, "");

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthorized) return;
    let active = true;
    const endpoint = user?.role === "Employer"
      ? `${API_BASE_URL}/api/v1/application/employer/getall`
      : `${API_BASE_URL}/api/v1/application/jobseeker/getall`;
    axios.get(endpoint, { withCredentials: true })
      .then((res) => { if (active) setApplications(Array.isArray(res.data.applications) ? res.data.applications : []); })
      .catch((error) => toast.error(error.response?.data?.message || "Error loading applications"))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [isAuthorized, user?.role]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/v1/application/delete/${id}`, { withCredentials: true });
      toast.success(res.data.message || "Application deleted");
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (!isAuthorized) return <Navigate to="/login" replace />;
  const isEmployer = user?.role === "Employer";

  return (
    <section className="container py-5">
      <p className="text-primary fw-semibold small mb-1">CAREERCONNECT</p>
      <h2 className="fw-bold mb-2">{isEmployer ? "Applicant applications" : "My applications"}</h2>
      <p className="text-muted mb-4">{isEmployer ? "Review the candidates who applied to your job listings." : "Keep track of the jobs you've applied for."}</p>
      {loading ? <p className="text-muted">Loading applications…</p> : applications.length === 0 ? (
        <div className="border rounded-4 p-5 text-center"><h5 className="fw-bold">No applications found</h5><p className="text-muted">{isEmployer ? "Applications for your job posts will appear here." : "Find a role that fits you and send your first application."}</p>{!isEmployer && <Link to="/job/getall" className="btn btn-primary">Browse jobs</Link>}</div>
      ) : (
        <div className="row g-4">
          {applications.map((item) => (
            <div className="col-md-6" key={item._id}>
              <article className="card h-100 border-0 shadow-sm p-4">
                <h5 className="fw-bold">{item.name || "Applicant"}</h5>
                <p className="mb-1"><strong>Email:</strong> {item.email}</p>
                <p className="mb-1"><strong>Phone:</strong> {item.phone}</p>
                <p className="mb-1"><strong>Address:</strong> {item.address}</p>
                {item.coverLetter && <><strong className="mt-2">Cover letter</strong><p style={{ whiteSpace: "pre-wrap" }}>{item.coverLetter}</p></>}
                {item.resume?.url && <a href={item.resume.url} target="_blank" rel="noreferrer" className="btn btn-outline-secondary btn-sm align-self-start mb-2">View resume</a>}
                {!isEmployer && <button className="btn btn-outline-danger btn-sm align-self-start mt-auto" onClick={() => deleteApplication(item._id)}>Delete application</button>}
              </article>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyApplications;
