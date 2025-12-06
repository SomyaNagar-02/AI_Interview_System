import "./ViewApplicant.css";

export default function ViewApplicant() {
  return (
    <div className="view-applicant-container">
      <h2>Applicant Details</h2>

      <p><b>Name:</b> John Doe</p>
      <p><b>Email:</b> johndoe@gmail.com</p>
      <p><b>Skills:</b> React, Node, MongoDB</p>

      <button className="resume-btn">Download Resume</button>
    </div>
  );
}
