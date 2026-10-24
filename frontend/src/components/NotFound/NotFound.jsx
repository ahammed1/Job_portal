import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container py-5 text-center">
      <h1 className="display-4 fw-bold">404 - Page Not Found</h1>
      <Link to="/" className="btn btn-primary mt-3">
        RETURN TO HOME PAGE
      </Link>
    </div>
  );
};

export default NotFound;