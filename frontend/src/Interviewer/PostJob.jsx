import "./PostJob.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    location: "",
    description: "",
    skillsRequired: [],
    experienceRequired: "",
    salaryRange: "",
    jobType: "full-time",
    atsCriteria: {
      keywords: [],
      minScore: 50,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "minScore") {
      setForm((prev) => ({
        ...prev,
        atsCriteria: { ...prev.atsCriteria, minScore: Number(value) },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- Skills tag input ---
  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skillsRequired.includes(skill)) {
      setForm((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill],
      }));
    }
    setSkillInput("");
  };
  const removeSkill = (s) =>
    setForm((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((x) => x !== s),
    }));

  // --- ATS Keywords tag input ---
  const addKeyword = () => {
    const kw = keywordInput.trim();
    if (kw && !form.atsCriteria.keywords.includes(kw)) {
      setForm((prev) => ({
        ...prev,
        atsCriteria: {
          ...prev.atsCriteria,
          keywords: [...prev.atsCriteria.keywords, kw],
        },
      }));
    }
    setKeywordInput("");
  };
  const removeKeyword = (k) =>
    setForm((prev) => ({
      ...prev,
      atsCriteria: {
        ...prev.atsCriteria,
        keywords: prev.atsCriteria.keywords.filter((x) => x !== k),
      },
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("/api/v1/job/addJob", form, {
        withCredentials: true,
      });
      console.log("Job posted:", res.data);
      navigate("/recruiter");
    } catch (err) {
      console.error("Error posting job:", err);
      setError(err.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page-wrapper">
      <div className="post-job-container">
        <div className="post-job-header">
          <h1 className="post-job-title">Post a New Job</h1>
          <p className="post-job-subtitle">
            Share a new opportunity with applicants on the platform.
          </p>
        </div>

        <form className="post-job-form" onSubmit={handleSubmit}>

          {/* ── Row 1: Title + Job Type ── */}
          <div className="post-job-row">
            <div className="post-job-field">
              <label>Job Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>
            <div className="post-job-field">
              <label>Job Type *</label>
              <select name="jobType" value={form.jobType} onChange={handleChange} required>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* ── Row 2: Company + Location ── */}
          <div className="post-job-row">
            <div className="post-job-field">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                placeholder="e.g. SelectX Labs"
              />
            </div>
            <div className="post-job-field">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Remote / Bangalore"
              />
            </div>
          </div>

          {/* ── Row 3: Experience + Salary ── */}
          <div className="post-job-row">
            <div className="post-job-field">
              <label>Experience Required</label>
              <input
                type="text"
                name="experienceRequired"
                value={form.experienceRequired}
                onChange={handleChange}
                placeholder="e.g. 2+ years / Fresher"
              />
            </div>
            <div className="post-job-field">
              <label>Salary Range</label>
              <input
                type="text"
                name="salaryRange"
                value={form.salaryRange}
                onChange={handleChange}
                placeholder="e.g. ₹8–12 LPA / Not Disclosed"
              />
            </div>
          </div>

          {/* ── Description ── */}
          <div className="post-job-field">
            <label>Job Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe responsibilities, requirements, and what makes this role exciting."
            />
          </div>

          {/* ── Skills Required (tag input) ── */}
          <div className="post-job-field">
            <label>Skills Required</label>
            <div className="tag-input-wrapper">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and press Enter"
              />
              <button type="button" className="tag-add-btn" onClick={addSkill}>Add</button>
            </div>
            {form.skillsRequired.length > 0 && (
              <div className="tag-list">
                {form.skillsRequired.map((s) => (
                  <span key={s} className="tag">
                    {s}
                    <button type="button" onClick={() => removeSkill(s)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── ATS Criteria ── */}
          <div className="post-job-section-label">ATS Screening Criteria</div>

          <div className="post-job-field">
            <label>ATS Keywords</label>
            <div className="tag-input-wrapper">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addKeyword(); } }}
                placeholder="Type a keyword and press Enter"
              />
              <button type="button" className="tag-add-btn" onClick={addKeyword}>Add</button>
            </div>
            {form.atsCriteria.keywords.length > 0 && (
              <div className="tag-list">
                {form.atsCriteria.keywords.map((k) => (
                  <span key={k} className="tag tag-keyword">
                    {k}
                    <button type="button" onClick={() => removeKeyword(k)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="post-job-field">
            <label>Minimum ATS Score: <strong>{form.atsCriteria.minScore}</strong></label>
            <input
              type="range"
              name="minScore"
              min="0"
              max="100"
              step="5"
              value={form.atsCriteria.minScore}
              onChange={handleChange}
              className="range-slider"
            />
            <div className="range-labels">
              <span>0</span><span>50</span><span>100</span>
            </div>
          </div>

          {error && <div className="post-job-error">{error}</div>}

          <button type="submit" className="post-job-button" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
