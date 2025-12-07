import "./RecruiterProfile.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
export default function RecruiterProfile() {
  const [profile, setProfile] = useState(null);
  const [aboutText, setAboutText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/v1/recruiter/getRecruiterDetails",
          { withCredentials: true }
        );

        setProfile(res.data.data);
        setAboutText(res.data.data.description || "");
      } catch (err) {
        console.error("Profile fetch failed:", err);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put(
        "http://localhost:8000/api/v1/recruiter/editRecruiter",
        { description: aboutText },
        { withCredentials: true }
      );

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        await axios.post(
          "http://localhost:8000/api/v1/applicant/upload-profile-pic",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setProfile((prev) => ({ ...prev, description: aboutText }));
      setIsEditing(false);
      setImageFile(null);
      alert("Profile updated");
    } catch (err) {
      console.error("Saving failed:", err);
      alert("Update failed");
    }
  };
  const handleDelete = async () => {
  if (!window.confirm("Are you sure you want to delete your profile?")) return;

  try {
    await axios.delete(
      "http://localhost:8000/api/v1/recruiter/deleteProfile",
      { withCredentials: true }
    );
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");   
    localStorage.removeItem("role");
    alert("Profile deleted");
    navigate("/"); 
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Delete failed");
  }
};

  if (!profile) return <h2>Loading...</h2>;

  return (
    <div className="recruiter-page-wrapper">
      <div className="recruiter-container-main">
        <div className="recruiter-content-card">
          <div className="recruiter-header-section">
            <h1 className="recruiter-page-title">Recruiter Profile</h1>
            <button className="recruiter-back-button" onClick={() => navigate("/recruiter")}>
              ← Back to Dashboard
            </button>
          </div>

          <div className="recruiter-picture-section">
            <div className="recruiter-pic-wrapper">
              <div className="recruiter-pic-circle">
                {profile.companyName?.charAt(0)}
              </div>
            </div>
          </div>

          <div className="recruiter-basic-info">
            <h2 className="recruiter-name-display">{profile.companyName}</h2>
            <p className="recruiter-email-display">{profile.website}</p>
          </div>

          <div className="recruiter-divider" />

          <div className="recruiter-info-sections">
            <div className="recruiter-info-group">
              <label className="recruiter-info-label">About</label>
              <div className="recruiter-info-box">
                {isEditing ? (
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    className="edit-textarea"
                  />
                ) : (
                  <p className="recruiter-info-text">{profile.description}</p>
                )}
              </div>
            </div>

            <div className="recruiter-info-group">
              <label className="recruiter-info-label">Company Details</label>
              <div className="recruiter-info-box">
                <strong>Company:</strong> {profile.companyName}
                <br />
                <strong>Website:</strong> {profile.website}
              </div>
            </div>

            <div className="recruiter-action-buttons">
  {!isEditing ? (
    <>
      <button
        className="recruiter-btn-edit"
        onClick={() => setIsEditing(true)}
      >
        Edit Profile
      </button>

      <button
        className="recruiter-btn-delete"
        onClick={handleDelete}
      >
        <FaTrash /> Delete
      </button>
    </>
  ) : (
    <button className="recruiter-btn-secondary" onClick={handleSave}>
      Save Profile
    </button>
  )}
</div>
          </div>
        </div>
      </div>
    </div>
  );
}