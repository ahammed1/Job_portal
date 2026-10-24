import  { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!isAuthorized || (user && user.role !== "Employer")) {
      navigateTo("/");
      return;
    }
    axios
      .get("http://localhost:4000/api/v1/job/getmyjobs", {
        withCredentials: true,
      })
      .then((res) => {
        setMyJobs(res.data.myJobs);
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Failed to load jobs");
      });
  }, [isAuthorized]);

  const handleDeleteJob = async (jobId) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/job/delete/${jobId}`,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setMyJobs((prev) => prev.filter((job) => job._id !== jobId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Your Posted Jobs</h2>
      {myJobs.length > 0 ? (
        <div className="row g-3">
          {myJobs.map((element) => (
            <div className="col-md-6" key={element._id}>
              <div className="card p-3 shadow-sm">
                <h5 className="fw-bold">{element.title}</h5>
                <p className="mb-1">{element.category} — {element.city}, {element.country}</p>
                <p className="small text-muted">{element.description}</p>
                <button
                  onClick={() => handleDeleteJob(element._id)}
                  className="btn btn-danger btn-sm align-self-start"
                >
                  Delete Job
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't posted any jobs yet.</p>
      )}
    </div>
  );
};

export default MyJobs;
