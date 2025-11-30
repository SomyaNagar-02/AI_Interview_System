import React from "react";
import Navbar from "./Navbar";
import JobCard from "./JobCard";
import "./ApplicantDashboard.css";

const dummyJobs = [
  {
    _id: "1",
    title: "Frontend Developer",
    companyName: "Google",
    location: "Hyderabad",
    description: "Work on cutting-edge frontend systems using React.",
    jobType: "full-time",
    salaryRange: "12-18 LPA",
    experienceRequired: "1-2 years",
    createdAt: "2024-11-20",
  },
  {
    _id: "2",
    title: "Backend Engineer",
    companyName: "Microsoft",
    location: "Bangalore",
    description: "Backend development with Node.js & SQL.",
    jobType: "full-time",
    salaryRange: "15-20 LPA",
    experienceRequired: "2-3 years",
    createdAt: "2024-12-01",
  },
  {
    _id: "3",
    title: "UI/UX Designer",
    companyName: "Swiggy",
    location: "Remote",
    description: "Design modern app screens and dashboards.",
    jobType: "internship",
    salaryRange: "25k/month",
    experienceRequired: "Fresher",
    createdAt: "2024-12-10",
  },
  {
    _id: "4",
    title: "MERN Stack Developer",
    companyName: "Zomato",
    location: "Delhi",
    description: "Full-stack development using MERN stack.",
    jobType: "full-time",
    salaryRange: "10-15 LPA",
    experienceRequired: "1 year",
    createdAt: "2024-12-15",
  },
  {
    _id: "5",
    title: "Data Analyst",
    companyName: "Flipkart",
    location: "Pune",
    description: "Analyze datasets to generate insights.",
    jobType: "full-time",
    salaryRange: "8-12 LPA",
    experienceRequired: "0-1 year",
    createdAt: "2024-11-25",
  },
  {
    _id: "6",
    title: "React Intern",
    companyName: "TCS",
    location: "Mumbai",
    description: "Work with senior developers on UI tasks.",
    jobType: "internship",
    salaryRange: "15k/month",
    experienceRequired: "Fresher",
    createdAt: "2024-12-18",
  },
];

const ApplicantDashboard = () => {
  return (
    <div className="app-dashboard">
      <Navbar />

      <div className="jobs-grid">
        {dummyJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default ApplicantDashboard;


