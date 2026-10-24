import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

const Application = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [resume, setResume] = useState(null);

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  const handleApplication = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    formData.append("jobId", id);

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/application/post",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      toast.error(error.response?.data?.message || "Application failed");
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
  }

  return (
    <section className="container py-5" style={{ maxWidth: "600px" }}>
      <h3 className="fw-bold mb-4">Application Form</h3>
      <form onSubmit={handleApplication} className="d-flex flex-column gap-3">
        <input
          type="text"
          className="form-control"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="form-control"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Your Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          className="form-control"
          placeholder="Your Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <textarea
          className="form-control"
          rows="4"
          placeholder="Cover Letter..."
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />
        <div>
          <label className="form-label">Select Resume (PNG, JPG, WEBP)</label>
          <input
            type="file"
            className="form-control"
            accept=".webp, .jpg, .png"
            onChange={(e) => setResume(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Send Application
        </button>
      </form>
    </section>
  );
};

export default Application;
