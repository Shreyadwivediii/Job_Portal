import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api/api";
import "./Profile.css";

function Profile() {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null,
  });

  const [resumeName, setResumeName] = useState("");

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      setInput({
        fullname: savedUser.fullname || "",
        email: savedUser.email || "",
        phoneNumber: savedUser.phoneNumber || "",
        bio: savedUser.profile?.bio || "",
        skills: Array.isArray(savedUser.profile?.skills)
          ? savedUser.profile.skills.join(", ")
          : savedUser.profile?.skills || "",
        file: null,
      });

      setResumeName(savedUser.profile?.resumeOriginalName || "");
    }
  }, []);

  const changeHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const fileHandler = (e) => {
    setInput({
      ...input,
      file: e.target.files[0],
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);

    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      const res = await api.post("/user/profile/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message || "Profile updated successfully");

      const updatedUser =
        res.data.user || {
          ...JSON.parse(localStorage.getItem("user")),
          fullname: input.fullname,
          email: input.email,
          phoneNumber: input.phoneNumber,
          profile: {
            bio: input.bio,
            skills: input.skills.split(",").map((skill) => skill.trim()),
            resumeOriginalName: input.file?.name || resumeName,
          },
        };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (input.file) {
        setResumeName(input.file.name);
      }
    } catch (error) {
      console.log("Profile update error:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>View and update your personal details, skills and resume.</p>
      </div>

      <div className="profile-card">
        <form className="profile-form" onSubmit={submitHandler}>
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
            type="number"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeHandler}
            placeholder="Phone Number"
            required
          />

          <textarea
            name="bio"
            value={input.bio}
            onChange={changeHandler}
            placeholder="Short bio"
          />

          <textarea
            name="skills"
            value={input.skills}
            onChange={changeHandler}
            placeholder="Skills e.g. HTML, CSS, JavaScript, React"
          />

          {resumeName && (
            <p className="resume-text">
              Current Resume: <span>{resumeName}</span>
            </p>
          )}

          <div className="file-box">
            <label>Upload New Resume</label>
            <input type="file" accept=".pdf" onChange={fileHandler} />  
          </div>

          <button className="profile-btn" type="submit">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;