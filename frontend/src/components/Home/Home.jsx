import  { useContext } from "react";
import { Context } from "../../main";
import { Navigate, Link } from "react-router-dom";

const Home = () => {
  const { isAuthorized } = useContext(Context);
  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }
  return (
    <section className="container py-5 text-center">
      <h1 className="display-5 fw-bold mb-3">
        Find a Job That Suits Your Interests and Skills
      </h1>
      <p className="lead text-muted mb-4">
        Browse open roles, submit applications with your resume, and manage postings in one place.
      </p>
      <Link to="/job/getall" className="btn btn-primary btn-lg">
        Browse All Jobs
      </Link>
    </section>
  );
};

export default Home;