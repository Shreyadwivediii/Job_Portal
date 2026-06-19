import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import JobCard from "../components/JobCard";
import "./Jobs.css";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("all");

  const getJobs = async () => {
    try {
      const res = await api.get("/job/get");
      setJobs(res.data.jobs || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load jobs");
    }
  };

  const getAppliedJobs = async () => {
    try {
      const res = await api.get("/application/get");

      const applications = res.data.applications || [];

      const ids = applications.map((app) => {
        return app.job?._id || app.job;
      });

      setAppliedJobIds(ids);
    } catch (error) {
      console.log("Applied jobs error:", error);
    }
  };

  const handleApply = async (jobId) => {
    if (appliedJobIds.includes(jobId)) {
      toast.info("You have already applied for this job");
      return;
    }

    try {
      const res = await api.get(`/application/apply/${jobId}`);

      toast.success(res.data.message || "Applied successfully");
      setAppliedJobIds((prev) => [...prev, jobId]);
    } catch (error) {
      const msg = error.response?.data?.message || "Apply failed";

      if (msg.toLowerCase().includes("already")) {
        setAppliedJobIds((prev) => [...prev, jobId]);
        toast.info("You have already applied for this job");
      } else {
        toast.error(msg);
      }
    }
  };

  const resetFilters = () => {
    setSearch("");
    setJobType("all");
  };

  const filteredJobs = jobs.filter((job) => {
    const text = search.toLowerCase();

    const matchesSearch =
      job.title?.toLowerCase().includes(text) ||
      job.company?.name?.toLowerCase().includes(text) ||
      job.location?.toLowerCase().includes(text);

    const matchesJobType =
      jobType === "all" ||
      job.jobType?.toLowerCase() === jobType.toLowerCase();

    return matchesSearch && matchesJobType;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await getJobs();
      await getAppliedJobs();
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="jobs-loading">Loading jobs...</div>;
  }

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1>Available Jobs</h1>
        <p>Find and apply to jobs that match your profile.</p>
      </div>

      <div className="jobs-filter-box">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, company or location"
        />

        <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
          <option value="all">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <button onClick={resetFilters}>Reset</button>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="empty-jobs">
          <h2>No jobs found</h2>
          <p>Try changing your search or filters.</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              isApplied={appliedJobIds.includes(job._id)}
              onApply={handleApply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;