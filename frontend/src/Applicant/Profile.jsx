import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/v1/applicant/me", { withCredentials: true })
      .then((res) => setProfile(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  if (!profile) {
    return <h2 style={{ marginTop: "40px", textAlign: "center" }}>Loading profile...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "850px",
        margin: "40px auto",
        background: "#fff",
        padding: "40px 30px",
        borderRadius: "25px",
        boxShadow: "0px 10px 40px rgba(99, 102, 241, 0.15)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "30px",
          color: "#1a1a1a",
        }}
      >
        Profile Details
      </h2>

      <div style={{ display: "grid", gap: "20px" }}>
        {/* Full Name */}
        <Field label="Full Name" value={user?.name} />

        {/* Email */}
        <Field label="Email" value={user?.email} />

        {/* Phone */}
        <Field label="Phone Number" value={user?.contact || "Not added"} />

        {/* Location */}
        <Field label="Location" value={profile.location || "Not added"} />

        {/* Country */}
        <Field label="Country" value={profile.country || "Not added"} />

        {/* Date of Birth */}
        <Field label="Date of Birth" value={profile.dob || "Not added"} />

        {/* Skills */}
        <Field
          label="Skills"
          value={profile.skills?.length > 0 ? profile.skills.join(", ") : "Not added"}
        />

        {/* Summary */}
        <Field label="Professional Summary" value={profile.summary || "Not added"} />

        {/* Experience */}
        <Field label="Experience" value={profile.experience || "Not added"} />

        {/* Education */}
        <Field label="Education" value={profile.education || "Not added"} />

        {/* LinkedIn */}
        <Field label="LinkedIn Profile" value={profile.linkedin || "Not added"} />
      </div>

      {/* EDIT PROFILE BUTTON */}
      <a
        href="/EditProfile"
        style={{
          display: "block",
          width: "100%",
          background: "linear-gradient(135deg, #6366f1, #a855f7)",
          padding: "12px",
          textAlign: "center",
          borderRadius: "12px",
          marginTop: "30px",
          color: "#fff",
          fontWeight: "600",
          fontSize: "17px",
          textDecoration: "none",
        }}
      >
        Edit Profile
      </a>
    </div>
  );
}

/* Extra Component for Clean UI */
function Field({ label, value }) {
  return (
    <div>
      <p style={{ fontSize: "15px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" }}>
        {label}
      </p>
      <div
        style={{
          width: "100%",
          padding: "12px",
          borderRadius: "10px",
          background: "#f8fafc",
          border: "1px solid #d1d5db",
          fontSize: "15.5px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

