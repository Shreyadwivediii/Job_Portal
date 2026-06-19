import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api/api";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
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
      const res = await api.post("/user/register", input);

      toast.success(res.data.message || "Signup successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Signup</h2>
        <p className="subtitle">Create your JobPortal account</p>

        <form className="auth-form" onSubmit={submitHandler}>
          <input
            type="text"
            name="fullname"
            value={input.fullname}
            onChange={changeHandler}
            placeholder="Full Name"
            required
          />

          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeHandler}
            placeholder="Email"
            required
          />

          <input
            type="text"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeHandler}
            placeholder="Phone Number"
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
            Signup
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;