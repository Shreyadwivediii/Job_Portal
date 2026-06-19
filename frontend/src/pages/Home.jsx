import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Find Your <span>Dream Job</span> With JobPortal
          </h1>

          <p>
            Search jobs from top companies, apply easily, and track your
            application status from one simple platform.
          </p>

          <div className="hero-buttons">
            <Link to="/jobs" className="primary-btn">
              Browse Jobs
            </Link>

            <Link to="/signup" className="secondary-btn">
              Create Account
            </Link>
          </div>

          <div className="stats-box">
            <div className="stat-card">
              <h2>100+</h2>
              <p>Job Openings</p>
            </div>

            <div className="stat-card">
              <h2>50+</h2>
              <p>Companies</p>
            </div>

            <div className="stat-card">
              <h2>500+</h2>
              <p>Students</p>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <h2>Why use JobPortal?</h2>

          <div className="feature-item">
            <h3>Easy Job Search</h3>
            <p>Find jobs based on role, location, salary and job type.</p>
          </div>

          <div className="feature-item">
            <h3>Quick Apply</h3>
            <p>Apply to jobs with one click and avoid duplicate applications.</p>
          </div>

          <div className="feature-item">
            <h3>Track Status</h3>
            <p>Check whether your application is pending, accepted or rejected.</p>
          </div>
        </div>
      </section>

      <section className="home-section">
        <h2>How It Works</h2>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Signup as a student or recruiter based on your role.</p>
          </div>

          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Apply or Post Jobs</h3>
            <p>Students apply for jobs, recruiters create companies and post jobs.</p>
          </div>

          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Track Progress</h3>
            <p>Applicants can track status and recruiters can manage candidates.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;