import "./ApplicantsList.css";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios"; 


export default function ApplicantsList() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    // replace this block with real API call when backend is ready
    

    
    axios
      .get(`/api/v1/application/job/${jobId}`)
      .then((res) => setApplicants(res.data.data || []))
      .catch((err) => console.error("Fetch applicants error:", err));
    
  }, [jobId]);

  return (
    <div className="applicant-list-container">
      <h2>Applicants for Job #{jobId}</h2>

      {applicants.length === 0 && <p>No applicants have applied yet.</p>}

      {applicants.map((applicant) => (
        <div key={applicant.id} className="applicant-card">
          <h3>{applicant.name}</h3>
          <p>Experience: {applicant.experience}</p>
          <Link to={`/recruiter/applicant/view/${applicant.id}`}>
            View Resume
          </Link>
        </div>
      ))}
    </div>
  );
}
