import React from "react";
import "./HomePage.css";
import logo from '../assets/logo.png';


const featuresData = [
  {
    title: "AI-Powered Interviews",
    description:
      "Automate interview scheduling, assessments, and get detailed AI-generated candidate reports to make informed hiring decisions.",
    icon: "🤖",
  },
  {
    title: "Automated Resume Screening",
    description:
      "Use AI to screen and rank resumes quickly, reducing time spent by recruiters on manual sorting.",
    icon: "📄",
  },
  {
    title: "Coding & Voice Interview Integration",
    description:
      "Conduct technical interviews with real-time coding tests and AI-powered voice interview technology for insightful candidate evaluation.",
    icon: "🎙️",
  },
  {
    title: "Dashboard & Analytics",
    description:
      "Detailed dashboards to track applicant status, recruiter activity, and interview outcomes in one place.",
    icon: "📊",
  },
  {
    title: "Candidate Engagement Tools",
    description:
      "Interactive candidate portals and feedback systems that improve communication and candidate experience.",
    icon: "💬",
  },
  {
    title: "Customizable Interview Workflows",
    description:
      "Tailor interview processes to fit unique hiring criteria and streamline recruiter collaboration.",
    icon: "⚙️",
  },
];

export default function HomePage() {
  return (
    <div className="ehome-root">
      <header className="ehome-header">
        <img src={logo} alt="Logo" className="ehome-logo" />
        <nav className="ehome-nav">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>
          {/* <a href="#contact">Contact</a> */}
          <a href="/login" className="login-btn">Login</a>
        </nav>
      </header>

      <main className="ehome-main">
        <section className="ehome-hero">
          <h1>
            Revolutionize Hiring with{" "}
            <span className="brand-color">AI-Driven Interviews</span>
          </h1>
          <p>
            Automate your recruitment pipeline and empower candidates with personalized AI interviews and insights.
          </p>
          <a href="/signup" className="signup-btn">Get Started</a>
        </section>

        <section id="features" className="ehome-section">
          <h2 className="section-title">Features</h2>
          <div className="features-grid">
            {featuresData.map(({ title, description, icon }, idx) => (
              <div className="feature-card" key={idx}>
                <div className="feature-icon">{icon}</div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-desc">{description}</p>
              </div>
            ))}
          </div>
        </section>
        
        <section id="how-it-works" className="howworks-section">
  <h2>How it works</h2>
  <p className="howworks-lead">
    Our AI Interview System streamlines hiring for applicants and recruiters in just a few intuitive steps.
  </p>
  <div className="howworks-cards">
    <div className="howworks-card">
      <b>Create your profile</b>
      <p>
        Get started quickly as an applicant or selector, and build a detailed profile with your skills, experience, and preferences.
      </p>
    </div>
    <div className="howworks-card">
      <b>Search, Post, or Apply</b>
      <p>
        Recruiters post jobs and configure interview flows. Applicants browse listings and apply in one click.
      </p>
    </div>
    <div className="howworks-card">
      <b>Attend AI-driven Interviews</b>
      <p>
        Complete coding or voice interviews where AI evaluates, scores, and provides instant analytics.
      </p>
    </div>
    <div className="howworks-card">
      <b>Track status and get offers</b>
      <p>
        Applicants and selectors view results, get notifications, and manage selections through a unified dashboard.
      </p>
    </div>
  </div>
</section>


        <section id="about" className="ehome-section">
          <h2 className="section-title">About AI Interview System</h2>
          <p>
            Our AI-powered interview system is designed to simplify and enhance the hiring process by combining advanced artificial intelligence with intuitive assessment tools. The platform enables organizations to conduct smart, unbiased, and efficient interviews, saving time while ensuring fair candidate evaluation. With features like automated question generation, real-time analysis, and detailed performance insights, our system empowers recruiters to identify the best talent quickly and accurately. Whether for technical, behavioral, or aptitude-based interviews, our solution provides a seamless experience for both candidates and employers.
          </p>
        </section>
{/* 
        <section id="contact" className="ehome-section">
          <h2 className="section-title">Get In Touch</h2>
          <p>Email: support@aiinterviewsystem.com</p>
          <p>Phone: +1 987 654 3210</p>
        </section> */}
      </main>

      <footer className="ehome-footer">
        &copy; 2025 AI Interview System. All rights reserved.
      </footer>
    </div>
  );
}