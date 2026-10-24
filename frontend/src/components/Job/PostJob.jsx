import  { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";

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

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
  }

  const handleJobPost = async (e) => {
    e.preventDefault();
    const payload =
      salaryType === "Fixed Salary"
        ? { title, description, category, country, city, location, fixedSalary }
        : {
            title,
            description,
            category,
            country,
            city,
            location,
            salaryFrom,
            salaryTo,
          };

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/job/post",
        payload,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
      navigateTo("/job/getall");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error posting job");
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <h3 className="fw-bold mb-4">POST NEW JOB</h3>
      <form onSubmit={handleJobPost} className="d-flex flex-column gap-3">
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Job Title"
        />
        <select
          className="form-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Full Stack Development">Full Stack Development</option>
          <option value="MERN Stack Development">MERN Stack Development</option>
          <option value="Frontend Web Development">Frontend Web Development</option>
          <option value="Data Entry Operator">Data Entry Operator</option>
        </select>
        <input
          type="text"
          className="form-control"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Country"
        />
        <input
          type="text"
          className="form-control"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
        />
        <input
          type="text"
          className="form-control"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Full Location (at least 20 characters)"
        />
        <select
          className="form-select"
          value={salaryType}
          onChange={(e) => setSalaryType(e.target.value)}
        >
          <option value="default">Select Salary Type</option>
          <option value="Fixed Salary">Fixed Salary</option>
          <option value="Ranged Salary">Ranged Salary</option>
        </select>
        {salaryType === "Fixed Salary" && (
          <input
            type="number"
            className="form-control"
            placeholder="Enter Fixed Salary"
            value={fixedSalary}
            onChange={(e) => setFixedSalary(e.target.value)}
          />
        )}
        {salaryType === "Ranged Salary" && (
          <div className="d-flex gap-2">
            <input
              type="number"
              className="form-control"
              placeholder="Salary From"
              value={salaryFrom}
              onChange={(e) => setSalaryFrom(e.target.value)}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Salary To"
              value={salaryTo}
              onChange={(e) => setSalaryTo(e.target.value)}
            />
          </div>
        )}
        <textarea
          rows="5"
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Job Description (at least 30 characters)"
        />
        <button type="submit" className="btn btn-primary">
          Create Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;