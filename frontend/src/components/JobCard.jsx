import { useNavigate } from "react-router-dom";

function JobCard({ job, isApplied, onApply }) {
  const navigate = useNavigate();

  return (
    <div className="job-card">
      <div className="job-card-top">
        <div className="company-logo">
          {job.company?.logo ? (
            <img src={job.company.logo} alt="company" />
          ) : (
            <span>{job.company?.name?.charAt(0) || "C"}</span>
          )}
        </div>

        <div>
          <h2>{job.title}</h2>
          <p>{job.company?.name || "Company Name"}</p>
        </div>
      </div>

      <div className="job-tags">
        <span>{job.location || "Remote"}</span>
        <span>{job.jobType || "Full Time"}</span>
        <span>{job.salary ? `${job.salary} LPA` : "Not disclosed"}</span>
      </div>

      <p className="job-description">
        {job.description?.length > 120
          ? job.description.slice(0, 120) + "..."
          : job.description || "No description available."}
      </p>

      <div className="job-actions">
        <button
          className="details-btn"
          onClick={() => navigate(`/description/${job._id}`)}
        >
          Details
        </button>

        <button
          className={isApplied ? "applied-btn" : "apply-btn"}
          disabled={isApplied}
          onClick={() => onApply(job._id)}
        >
          {isApplied ? "Applied" : "Apply Now"}
        </button>
      </div>
    </div>
  );
}

export default JobCard;