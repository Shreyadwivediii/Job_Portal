import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import "./Jobs.css";

function JobDescription() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const getJobDetails = async () => {
    try {
      const res = await api.get(`/job/get/${id}`);
      setJob(res.data.job);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load job");
    }
  };

  const getAppliedJobs = async () => {
    try {
      const res = await api.get("/application/get");

      const applications = res.data.applications || [];

      const found = applications.some((app) => {
        const jobId = app.job?._id || app.job;
        return jobId === id;
      });

      setIsApplied(found);
    } catch (error) {
      console.log("Applied jobs error:", error);
    }
  };

  const handleApply = async () => {
    if (isApplied) {
      toast.info("You have already applied for this job");
      return;
    }

    try {
      const res = await api.get(`/application/apply/${id}`);

      toast.success(res.data.message || "Applied successfully");
      setIsApplied(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Apply failed");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await getJobDetails();
      await getAppliedJobs();
      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) {
    return <div className="jobs-loading">Loading job details...</div>;
  }

  if (!job) {
    return <div className="jobs-loading">Job not found</div>;
  }

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : job.requirements?.split(",") || [];

  return (
    <div className="job-description-page">
      <div className="job-detail-card">
        <div className="job-detail-top">
          <div className="job-title-box">
            <div className="detail-company-logo">
              {job.company?.logo ? (
                <img src={job.company.logo} alt="company-logo" />
              ) : (
                <span>{job.company?.name?.charAt(0) || "C"}</span>
              )}
            </div>

            <div>
              <h1>{job.title}</h1>
              <p>{job.company?.name || "Company Name"}</p>
            </div>
          </div>

          <button
            className={
              isApplied
                ? "applied-btn detail-apply-btn"
                : "apply-btn detail-apply-btn"
            }
            disabled={isApplied}
            onClick={handleApply}
          >
            {isApplied ? "Applied" : "Apply Now"}
          </button>
        </div>

        <div className="job-tags detail-tags">
          <span>{job.location || "Remote"}</span>
          <span>{job.jobType || "Full-time"}</span>
          <span>{job.salary} LPA</span>
          <span>
            {job.experienceLevel === 0 || job.experienceLevel === "0"
              ? "Fresher"
              : `${job.experienceLevel} Years`}
          </span>
          <span>{job.position || "1"} Position</span>
        </div>

        <div className="detail-section">
          <h2>Job Description</h2>
          <p>{job.description || "No description provided."}</p>
        </div>

        <div className="detail-section">
          <h2>Requirements</h2>

          <div className="requirements-list">
            {requirements.map((item, index) => (
              <span key={index}>{item.trim()}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDescription;