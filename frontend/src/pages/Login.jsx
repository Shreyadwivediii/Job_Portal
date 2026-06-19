import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const changeHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/user/login", input);

      toast.success(res.data.message || "Login successful");

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", input.role);
      if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

      if (input.role === "student") {
        navigate("/jobs");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        <p className="subtitle">Welcome back to JobPortal</p>

        <form className="auth-form" onSubmit={submitHandler}>
          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeHandler}
            placeholder="Email"
            required
          />

          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeHandler}
            placeholder="Password"
            required
          />

          <select name="role" value={input.role} onChange={changeHandler}>
            <option value="student">Student</option>
            <option value="recruiter">Recruiter</option>
          </select>

          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>

        <p className="auth-footer">
          New user? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;