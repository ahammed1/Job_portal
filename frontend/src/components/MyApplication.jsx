import  { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyApplications = () => {
  const { user, isAuthorized } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/");
      return;
    }
    const endpoint =
      user && user.role === "Employer"
        ? "http://localhost:4000/api/v1/application/employer/getall"
        : "http://localhost:4000/api/v1/application/jobseeker/getall";

    axios
      .get(endpoint, { withCredentials: true })
      .then((res) => {
        setApplications(res.data.applications);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error loading applications");
      });
  }, [isAuthorized, user]);

  const deleteApplication = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">
        {user && user.role === "Job Seeker"
          ? "My Applications"
          : "Applications From Job Seekers"}
      </h2>
      {applications.length <= 0 ? (
        <h4>No Applications Found</h4>
      ) : (
        <div className="row g-4">
          {applications.map((element) => (
            <div className="col-md-6" key={element._id}>
              <div className="card p-3 shadow-sm">
                <p><strong>Name:</strong> {element.name}</p>
                <p><strong>Email:</strong> {element.email}</p>
                <p><strong>Phone:</strong> {element.phone}</p>
                <p><strong>Address:</strong> {element.address}</p>
                <p><strong>Cover Letter:</strong> {element.coverLetter}</p>
                {element.resume && element.resume.url && (
                  <a
                    href={element.resume.url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-secondary btn-sm mb-2 align-self-start"
                  >
                    View Resume Image
                  </a>
                )}
                {user && user.role === "Job Seeker" && (
                  <button
                    className="btn btn-danger btn-sm align-self-start"
                    onClick={() => deleteApplication(element._id)}
                  >
                    Delete Application
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyApplications;
