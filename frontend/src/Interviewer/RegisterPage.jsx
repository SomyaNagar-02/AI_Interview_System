import React, { useState } from "react";
import "./RegisterPage.css";

const InterviewerRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    organization: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.organization.trim())
      newErrors.organization = "Organization is required";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[0-9\s-]{7,15}$/.test(formData.phone))
      newErrors.phone = "Invalid phone number";

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
      alert("Registration successful!");
      // Submit to backend here
    }
  };

  return (
    <div class="Registerpage-bg">
    <div className="registration-root">
      <form className="registration-form" onSubmit={handleSubmit} noValidate>
        <h2>Register Here</h2>

        <label htmlFor="fullName">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
        />
        {errors.fullName && <p className="error">{errors.fullName}</p>}

        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <label htmlFor="location">Location</label>
        <input
          id="location"
          name="location"
          type="text"
          placeholder="City, State or Country"
          value={formData.location}
          onChange={handleChange}
        />
        {errors.location && <p className="error">{errors.location}</p>}

        <label htmlFor="organization">Organization</label>
        <input
          id="organization"
          name="organization"
          type="text"
          placeholder="Your company or institution"
          value={formData.organization}
          onChange={handleChange}
        />
        {errors.organization && <p className="error">{errors.organization}</p>}

        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          name="phone"
          type="text"
          placeholder="+1 234 567 8901"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
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

export default InterviewerRegistration;