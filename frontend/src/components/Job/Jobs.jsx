import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized) {
      navigateTo("/login");
      return;
    }
    axios
      .get("http://localhost:4000/api/v1/job/getall", {
        withCredentials: true,
      })
      .then((res) => {
        setJobs(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [isAuthorized]);

  return (
    <section className="container py-5">
      <h2 className="fw-bold mb-4">ALL AVAILABLE JOBS</h2>
      <div className="row g-4">
        {jobs.jobs &&
          jobs.jobs.map((element) => (
            <div className="col-md-4" key={element._id}>
              <div className="card h-100 shadow-sm p-3">
                <h5 className="fw-bold">{element.title}</h5>
                <p className="text-muted mb-1">{element.category}</p>
                <p className="small">{element.country}</p>
                <Link
                  to={`/job/${element._id}`}
                  className="btn btn-outline-primary btn-sm mt-auto"
                >
                  Job Details
                </Link>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Jobs;