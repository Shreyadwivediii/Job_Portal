import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import "./Jobs.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyApplications = async () => {
    try {
      const res = await api.get("/application/get");

      const data = res.data.applications || [];
      setApplications(data);
    } catch (error) {
      console.log("My applications error:", error);
      toast.error(error.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyApplications();
  }, []);

  if (loading) {
    return <div className="jobs-loading">Loading applications...</div>;
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1>My Applications</h1>
        <p>Track all jobs you have applied for.</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-jobs">
          <h2>No applications yet</h2>
          <p>Apply to jobs and they will appear here.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => {
            const job = application.job || application.jobId || {};
            const company = job.company || {};

            return (
              <div className="application-card" key={application._id}>
                <div>
                  <h2>{job.title || "Job Title"}</h2>
                  <p>{company.name || "Company Name"}</p>

                  <div className="job-tags">
                    <span>{job.location || "Remote"}</span>
                    <span>{job.jobType || "Full-time"}</span>
                    <span>
                      {job.salary ? `${job.salary} LPA` : "Not disclosed"}
                    </span>
                  </div>
                </div>

                <span
                  className={`application-status ${
                    application.status || "pending"
                  }`}
                >
                  {application.status || "pending"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyApplications;