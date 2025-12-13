import "./ApplicantsList.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ApplicantsList() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const res = await axios.get(
          `/api/v1/recruiter/getAppliedCand`,  
          { params: { jobId } }               // backend expects jobId in query
        );
        const jobs = res.data.data || [];
console.log(jobs)
        // Backend returns array of jobs, each with applicants list
        if (jobs.length > 0) {
          setApplicants(jobs[0].applicants || []);
        } else {
          setApplicants([]);
        }
      } catch (err) {
        console.error("Fetch applicants error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (loading) return <p>Loading applicants...</p>;

  return (
    <div className="applicant-list-container">
      <h2>Applicants for Job #{jobId}</h2>

      {applicants.length === 0 && <p>No applicants have applied yet.</p>}

      {applicants.map((item) => (
        <div key={item.applicationId} className="applicant-card">
          
          {/* USER BASIC INFO */}
          <h3>{item.user?.name || "No Name"}</h3>
          <p>Email: {item.user?.email}</p>

          {/* PROFILE INFO */}
          <p>Experience: {item.profile?.experience || "N/A"}</p>
          <p>Skills: {item.profile?.skills || "N/A"}</p>

          {/* ATS INFO */}
          <p>ATS Score: {item.atsScore}</p>
          <p>ATS Result: {item.atsResult}</p>

          {/* Resume Link */}
          <Link 
            to={`/api/applicant/resume/${item.resumeUrl}`} 
            className="resume-link"
          >
            View Resume
          </Link>
        </div>
      ))}
    </div>
  );
}
