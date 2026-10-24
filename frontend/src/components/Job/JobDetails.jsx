import  { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();
  const { isAuthorized, user } = useContext(Context);

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return;
    }
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch(() => {
        navigateTo("/notfound");
      });
  }, [id, isAuthorized]);

  return (
    <section className="container py-5">
      <h3 className="fw-bold mb-4">Job Details</h3>
      <div className="card p-4 shadow-sm">
        <p><strong>Title:</strong> {job.title}</p>
        <p><strong>Category:</strong> {job.category}</p>
        <p><strong>Country:</strong> {job.country}</p>
        <p><strong>City:</strong> {job.city}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Description:</strong> {job.description}</p>
        <p>
          <strong>Salary:</strong>{" "}
          {job.fixedSalary ? (
            <span>{job.fixedSalary}</span>
          ) : (
            <span>
              {job.salaryFrom} - {job.salaryTo}
            </span>
          )}
        </p>
        {user && user.role !== "Employer" && (
          <Link to={`/application/${job._id}`} className="btn btn-success mt-2">
            Apply Now
          </Link>
        )}
      </div>
    </section>
  );
};

export default JobDetails;
