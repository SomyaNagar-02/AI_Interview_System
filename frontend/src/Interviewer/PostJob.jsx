import "./PostJob.css";
import axios from "axios";
import {useState} from 'react';
export default function PostJob() {
    const [form, setForm] = useState({
  title: "",
  companyName: "",
  location: "",
  description: "",
});

    const handleChange = (e) => {
  setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
};
    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
  "http://localhost:8000/api/v1/job/addJob",
  {
    ...form,
    skillsRequired: [],           
    experienceRequired: "0 years",
    salaryRange: "Not Specified",
    jobType: "full-time",
    atsCriteria: {
      keywords: [],
      minScore: 50
    }
  },
  { withCredentials: true }
);

    alert("Job posted successfully!");
    console.log("JOB:", res.data);

  } catch (err) {
    console.error("Error posting job:", err);
    alert("Failed to post job");
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

        <form className="post-job-form"  onSubmit={handleSubmit}>
          <div className="post-job-field">
            <label>Job Title</label>
            <input type="text" name= "title" onChange={handleChange} placeholder="e.g. Frontend Developer" />
          </div>

          <div className="post-job-field">
            <label>Company Name</label>
            <input type="text" name="companyName" onChange={handleChange} placeholder="e.g. SelectX Labs" />
          </div>

          <div className="post-job-field">
            <label>Location</label>
            <input type="text" name="location" onChange={handleChange} placeholder="e.g. Remote / Bangalore" />
          </div>

          <div className="post-job-field">
            <label>Job Description</label>
            <textarea
              onChange={handleChange} name="description" placeholder="Describe responsibilities, required skills, and experience."
            ></textarea>
          </div>

          <button type="submit" className="post-job-button">
            Post Job
          </button>
        </form>
      </div>
    </div>
  );
}
