import { useContext } from "react";
import { Context } from "../../main";
import { Navigate, Link } from "react-router-dom";

const Home = () => {
  const { isAuthorized, user } = useContext(Context);
  if (!isAuthorized) return <Navigate to="/login" replace />;

  const isEmployer = user?.role === "Employer";
  const cards = isEmployer
    ? [
        { title: "Post a new job", description: "Create a job listing and reach candidates.", to: "/job/post", action: "Create listing", icon: "＋" },
        { title: "Manage your jobs", description: "Review your active listings and remove jobs you no longer need.", to: "/job/me", action: "Manage jobs", icon: "▤" },
        { title: "Applicant applications", description: "Review candidate details and attached resumes.", to: "/applications/me", action: "View applicants", icon: "♙" },
      ]
    : [
        { title: "Browse jobs", description: "Search roles by keyword, category, and location.", to: "/job/getall", action: "Explore jobs", icon: "⌕" },
        { title: "My applications", description: "Review applications you have submitted.", to: "/applications/me", action: "Track applications", icon: "▤" },
      ];

  return (
    <main className="container py-5">
      <section className="rounded-4 p-4 p-md-5 mb-5 text-white" style={{ background: "linear-gradient(120deg, #102a43, #176b87)" }}>
        <p className="text-uppercase fw-semibold small mb-2" style={{ letterSpacing: "0.16em" }}>Talviro • Your next step starts here</p>
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <h1 className="display-5 fw-bold mb-3">{isEmployer ? "Build your team with the right people." : "Find work that moves you forward."}</h1>
            <p className="lead mb-4">{isEmployer ? "Publish opportunities, manage your listings, and review candidate applications from one place." : "Discover opportunities, filter by what matters to you, and keep track of every application."}</p>
            <Link to={isEmployer ? "/job/post" : "/job/getall"} className="btn btn-light btn-lg fw-semibold">
              {isEmployer ? "Post a job" : "Browse open jobs"} <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="col-lg-4">
            <div className="bg-white bg-opacity-10 rounded-4 p-4">
              <p className="small mb-1">SIGNED IN AS</p>
              <h4 className="fw-bold mb-1">{user?.name || user?.firstName || "Talviro user"}</h4>
              <span className="badge text-bg-light text-dark">{user?.role || "Member"}</span>
            </div>
          </div>
        </div>
      </section>
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-3 gap-2">
        <div><p className="text-primary fw-semibold small mb-1">QUICK ACCESS</p><h2 className="fw-bold mb-0">{isEmployer ? "Employer workspace" : "Your job search"}</h2></div>
      </div>
      <div className="row g-4">
        {cards.map((card) => (
          <div className="col-md-6 col-xl-4" key={card.to}>
            <article className="card h-100 border-0 shadow-sm p-4">
              <div className="rounded-3 bg-light text-primary d-flex align-items-center justify-content-center mb-3" style={{ width: 48, height: 48, fontSize: 26 }}>{card.icon}</div>
              <h5 className="fw-bold">{card.title}</h5>
              <p className="text-muted flex-grow-1">{card.description}</p>
              <Link className="btn btn-outline-primary align-self-start" to={card.to}>{card.action} →</Link>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Home;
