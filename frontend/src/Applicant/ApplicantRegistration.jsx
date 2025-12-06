import React, { useState } from "react";
import "./ApplicantRegistration.css";

const ApplicantRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    phone: "",
    experience: "",
    skills: "",
    profilePic: null,
    password: "",
    confirmPassword: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "profilePic") {
      const file = files[0];
      setFormData({ ...formData, profilePic: file });

      if (file) {
        setPreviewImage(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    )
      newErrors.email = "Invalid email address";

    if (!formData.location.trim()) newErrors.location = "Location is required";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";

    if (!formData.experience.trim())
      newErrors.experience = "Experience is required";

    if (!formData.skills.trim())
      newErrors.skills = "Skills cannot be empty";

    if (!formData.profilePic)
      newErrors.profilePic = "Profile picture is required";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password should be at least 6 characters";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Applicant Registered Successfully!");
      // send to backend API later
    }
  };

  return (
    <div className="register-bg">
      <div className="registration-wrapper">
        <form className="registration-card" onSubmit={handleSubmit} noValidate>
          <h2>Applicant Registration</h2>
          <p>Please fill in your details</p>

          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <label>Location</label>
          <input
            type="text"
            name="location"
            placeholder="City, Country"
            value={formData.location}
            onChange={handleChange}
          />
          {errors.location && <p className="error">{errors.location}</p>}

          <label>Phone Number</label>
          <input
            type="text"
            name="phone"
            placeholder="+1 234 567 890"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <p className="error">{errors.phone}</p>}

          <label>Years of Experience</label>
          <input
            type="number"
            name="experience"
            placeholder="e.g., 2"
            value={formData.experience}
            onChange={handleChange}
          />
          {errors.experience && <p className="error">{errors.experience}</p>}

          <label>Skills (comma-separated)</label>
          <input
            type="text"
            name="skills"
            placeholder="React, Java, SQL"
            value={formData.skills}
            onChange={handleChange}
          />
          {errors.skills && <p className="error">{errors.skills}</p>}

          <label>Upload Profile Picture</label>
          <input type="file" name="profilePic" accept="image/*" onChange={handleChange} />
          {errors.profilePic && <p className="error">{errors.profilePic}</p>}

          {previewImage && (
            <img className="preview-img" src={previewImage} alt="preview" />
          )}

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <p className="error">{errors.confirmPassword}</p>
          )}

          <button type="submit" className="register-btn">Register</button>
        </form>
      </div>
    </div>
  );
};

export default ApplicantRegistration;
