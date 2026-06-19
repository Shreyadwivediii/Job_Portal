import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [adminJobs, setAdminJobs] = useState([]);

  const [companyName, setCompanyName] = useState("");

  const [jobInput, setJobInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    experienceLevel: "",
    position: "",
    companyId: "",
  });

  const [editingJobId, setEditingJobId] = useState(null);

  const [editInput, setEditInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    experienceLevel: "",
    position: "",
  });

  const getCompanies = async () => {
    try {
      const res = await api.get("/company/get");

      const data = res.data.companies || res.data.company || [];
      const finalCompanies = Array.isArray(data) ? data : [data];

      setCompanies(finalCompanies);

      if (finalCompanies.length > 0) {
        setJobInput((prev) => ({
          ...prev,
          companyId: prev.companyId || finalCompanies[0]._id,
        }));
      }
    } catch (error) {
      console.log("Company fetch error:", error);
    }
  };

  const getAdminJobs = async () => {
    try {
      const res = await api.get("/job/getadminjobs");
      setAdminJobs(res.data.jobs || []);
    } catch (error) {
      console.log("Admin jobs fetch error:", error);
    }
  };

  const companySubmitHandler = async (e) => {
    e.preventDefault();

    if (!companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      const res = await api.post("/company/register", {
        companyName,
      });

      toast.success(res.data.message || "Company created");

      setCompanyName("");
      getCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || "Company create failed");
    }
  };

  const jobChangeHandler = (e) => {
    setJobInput({
      ...jobInput,
      [e.target.name]: e.target.value,
    });
  };

  const jobSubmitHandler = async (e) => {
    e.preventDefault();

    if (!jobInput.companyId) {
      toast.error("Please create/select a company first");
      return;
    }

    const salaryNumber = Number(jobInput.salary);
    const experienceNumber = Number(jobInput.experienceLevel);
    const positionNumber = Number(jobInput.position);

    if (Number.isNaN(salaryNumber)) {
      toast.error("Salary must be a number");
      return;
    }

    if (Number.isNaN(experienceNumber)) {
      toast.error("Experience must be a number");
      return;
    }

    if (Number.isNaN(positionNumber)) {
      toast.error("Position must be a number");
      return;
    }

    try {
      const payload = {
        title: jobInput.title,
        description: jobInput.description,
        requirements: jobInput.requirements,
        salary: salaryNumber,
        location: jobInput.location,
        jobType: jobInput.jobType,
        experienceLevel: experienceNumber,
        position: positionNumber,
        companyId: jobInput.companyId,
      };

      const res = await api.post("/job/post", payload);

      toast.success(res.data.message || "Job posted successfully");

      setJobInput({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full-time",
        experienceLevel: "",
        position: "",
        companyId: companies[0]?._id || "",
      });

      getAdminJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Job post failed");
    }
  };

  const startEditJob = (job) => {
    setEditingJobId(job._id);

    setEditInput({
      title: job.title || "",
      description: job.description || "",
      requirements: Array.isArray(job.requirements)
        ? job.requirements.join(", ")
        : job.requirements || "",
      salary: job.salary || "",
      location: job.location || "",
      jobType: job.jobType || "Full-time",
      experienceLevel: job.experienceLevel || "",
      position: job.position || "",
    });
  };

  const editChangeHandler = (e) => {
    setEditInput({
      ...editInput,
      [e.target.name]: e.target.value,
    });
  };

  const updateJobHandler = async (e) => {
    e.preventDefault();

    const salaryNumber = Number(editInput.salary);
    const experienceNumber = Number(editInput.experienceLevel);
    const positionNumber = Number(editInput.position);

    if (Number.isNaN(salaryNumber)) {
      toast.error("Salary must be a number");
      return;
    }

    if (Number.isNaN(experienceNumber)) {
      toast.error("Experience must be a number");
      return;
    }

    if (Number.isNaN(positionNumber)) {
      toast.error("Position must be a number");
      return;
    }

    try {
      const payload = {
        title: editInput.title,
        description: editInput.description,
        requirements: editInput.requirements,
        salary: salaryNumber,
        location: editInput.location,
        jobType: editInput.jobType,
        experienceLevel: experienceNumber,
        position: positionNumber,
      };

      const res = await api.put(`/job/update/${editingJobId}`, payload);

      toast.success(res.data.message || "Job updated successfully");

      setEditingJobId(null);
      getAdminJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Job update failed");
    }
  };

  const deleteJobHandler = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/job/delete/${jobId}`);

      toast.success(res.data.message || "Job deleted successfully");

      if (editingJobId === jobId) {
        setEditingJobId(null);
      }

      getAdminJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Job delete failed");
    }
  };

  useEffect(() => {
    getCompanies();
    getAdminJobs();
  }, []);
  const totalCompanies = companies.length;
  const totalJobs = adminJobs.length;

  const totalApplicants = adminJobs.reduce((total, job) => {
  return total + (job.applications?.length || 0);
  }, 0);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Recruiter Dashboard</h1>
        <p>Create your company and post jobs for students.</p>
      </div>
      <div className="dashboard-stats">
        <div className="dashboard-stat-card">
            <h2>{totalCompanies}</h2>
            <p>Total Companies</p>
        </div>

        <div className="dashboard-stat-card">
            <h2>{totalJobs}</h2>
            <p>Posted Jobs</p>
        </div>

        <div className="dashboard-stat-card">
            <h2>{totalApplicants}</h2>
            <p>Total Applicants</p>
        </div>
        </div>

      <div className="admin-grid">
        <div>
          <div className="admin-card">
            <h2>Create Company</h2>

            <form className="admin-form" onSubmit={companySubmitHandler}>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company name"
              />

              <button className="admin-btn" type="submit">
                Create Company
              </button>
            </form>
          </div>

          <div className="admin-card company-list">
            <h2>Your Companies</h2>

            {companies.length === 0 ? (
              <p className="empty-admin">No company created yet.</p>
            ) : (
              companies.map((company) => (
                <div className="company-item" key={company._id}>
                  {company.name || company.companyName}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="admin-card">
          <h2>Post New Job</h2>

          <form className="admin-form" onSubmit={jobSubmitHandler}>
            <select
              name="companyId"
              value={jobInput.companyId}
              onChange={jobChangeHandler}
              required
            >
              <option value="">Select Company</option>

              {companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.name || company.companyName}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="title"
              value={jobInput.title}
              onChange={jobChangeHandler}
              placeholder="Job title"
              required
            />

            <textarea
              name="description"
              value={jobInput.description}
              onChange={jobChangeHandler}
              placeholder="Job description"
              required
            />

            <textarea
              name="requirements"
              value={jobInput.requirements}
              onChange={jobChangeHandler}
              placeholder="Requirements, comma separated"
              required
            />

            <input
              type="number"
              name="salary"
              value={jobInput.salary}
              onChange={jobChangeHandler}
              placeholder="Salary in LPA e.g. 8"
              required
            />

            <input
              type="text"
              name="location"
              value={jobInput.location}
              onChange={jobChangeHandler}
              placeholder="Location e.g. Remote / Bangalore"
              required
            />

            <select
              name="jobType"
              value={jobInput.jobType}
              onChange={jobChangeHandler}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>

            <input
              type="number"
              name="experienceLevel"
              value={jobInput.experienceLevel}
              onChange={jobChangeHandler}
              placeholder="Experience in years e.g. 0"
              required
            />

            <input
              type="number"
              name="position"
              value={jobInput.position}
              onChange={jobChangeHandler}
              placeholder="Number of positions"
              required
            />

            <button className="admin-btn" type="submit">
              Post Job
            </button>
          </form>
        </div>
      </div>

      {editingJobId && (
        <div className="admin-card" style={{ marginTop: "24px" }}>
          <h2>Edit Job</h2>

          <form className="admin-form" onSubmit={updateJobHandler}>
            <input
              type="text"
              name="title"
              value={editInput.title}
              onChange={editChangeHandler}
              placeholder="Job title"
              required
            />

            <textarea
              name="description"
              value={editInput.description}
              onChange={editChangeHandler}
              placeholder="Job description"
              required
            />

            <textarea
              name="requirements"
              value={editInput.requirements}
              onChange={editChangeHandler}
              placeholder="Requirements comma separated"
              required
            />

            <input
              type="number"
              name="salary"
              value={editInput.salary}
              onChange={editChangeHandler}
              placeholder="Salary in LPA"
              required
            />

            <input
              type="text"
              name="location"
              value={editInput.location}
              onChange={editChangeHandler}
              placeholder="Location"
              required
            />

            <select
              name="jobType"
              value={editInput.jobType}
              onChange={editChangeHandler}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>

            <input
              type="number"
              name="experienceLevel"
              value={editInput.experienceLevel}
              onChange={editChangeHandler}
              placeholder="Experience in years"
              required
            />

            <input
              type="number"
              name="position"
              value={editInput.position}
              onChange={editChangeHandler}
              placeholder="Number of positions"
              required
            />

            <div className="edit-form-actions">
              <button className="admin-btn" type="submit">
                Update Job
              </button>

              <button
                type="button"
                className="cancel-edit-btn"
                onClick={() => setEditingJobId(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-card" style={{ marginTop: "24px" }}>
        <h2>Your Posted Jobs</h2>

        {adminJobs.length === 0 ? (
          <p className="empty-admin">No jobs posted yet.</p>
        ) : (
          <div className="admin-jobs-list">
            {adminJobs.map((job) => (
              <div className="admin-job-card" key={job._id}>
                <h3>{job.title}</h3>

                <p>
                  {job.company?.name || "Company"} • {job.location}
                </p>

                <div className="admin-job-tags">
                  <span>{job.jobType}</span>
                  <span>{job.salary} LPA</span>
                  <span>{job.position} Positions</span>
                  <span>
                    {job.experienceLevel === 0 ||
                    job.experienceLevel === "0"
                      ? "Fresher"
                      : `${job.experienceLevel} Years`}
                  </span>
                </div>

                <button
                  className="view-applicants-btn"
                  onClick={() =>
                    navigate(`/admin/jobs/${job._id}/applicants`)
                  }
                >
                  View Applicants
                </button>

                <div className="admin-job-actions">
                  <button
                    className="edit-job-btn"
                    onClick={() => startEditJob(job)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-job-btn"
                    onClick={() => deleteJobHandler(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;