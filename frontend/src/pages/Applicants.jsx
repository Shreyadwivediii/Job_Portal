import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import "./AdminDashboard.css";

function Applicants() {
  const { id } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getApplicants = async () => {
    try {
      const res = await api.get(`/application/${id}/applicants`);

      console.log("Applicants response:", res.data);

      const data = res.data.job?.applications || res.data.applications || [];

      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Applicants fetch error:", error);
      toast.error(error.response?.data?.message || "Failed to load applicants");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      const res = await api.post(`/application/status/${applicationId}/update`, {
        status,
      });

      toast.success(res.data.message || "Status updated");
      getApplicants();
    } catch (error) {
      console.log("Status update error:", error);
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  useEffect(() => {
    getApplicants();
  }, [id]);

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-header">
          <h1>Loading applicants...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Job Applicants</h1>
        <p>View student profile, resume and application status.</p>
      </div>

      <div className="admin-card">
        {applications.length === 0 ? (
          <p className="empty-admin">No applicants yet.</p>
        ) : (
          <div className="applicants-list">
            {applications.map((application) => {
              const applicant =
                application.applicant ||
                application.user ||
                application.userId ||
                {};

              const profile = applicant.profile || {};

              const skills = Array.isArray(profile.skills)
                ? profile.skills
                : profile.skills
                ? profile.skills.split(",")
                : [];

              return (
                <div className="applicant-card" key={application._id}>
                  <div className="applicant-info">
                    <h3>{applicant.fullname || applicant.name || "Student Name"}</h3>

                    <p>Email: {applicant.email || "No email"}</p>
                    <p>Phone: {applicant.phoneNumber || "No phone number"}</p>

                    <p className="applicant-bio">
                      Bio: {profile.bio || "No bio added"}
                    </p>

                    <div className="applicant-skills">
                      {skills.length === 0 ? (
                        <span>No skills added</span>
                      ) : (
                        skills.map((skill, index) => (
                          <span key={index}>{skill.trim()}</span>
                        ))
                      )}
                    </div>

                    {profile.resume ? (
                      <a
                        className="resume-link"
                        href={profile.resume}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Resume
                      </a>
                    ) : (
                      <p className="no-resume">No resume uploaded</p>
                    )}

                    <span className={`status-badge ${application.status}`}>
                      Status: {application.status || "pending"}
                    </span>
                  </div>

                  <div className="applicant-actions">
                    <button
                      className="accept-btn"
                      onClick={() => updateStatus(application._id, "accepted")}
                    >
                      Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() => updateStatus(application._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Applicants;