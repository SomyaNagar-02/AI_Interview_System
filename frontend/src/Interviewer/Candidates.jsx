import React from 'react';
import './Candidates.css';

export function Candidates() {
  return (
    <div className="candidates-page">
      <h1>Candidates</h1>
      <div className="filters-bar">
        <input type="text" placeholder="Search by name..." className="search-input" />
        <select className="filter-select">
          <option>Filter by Job</option>
          <option>Frontend Developer</option>
          <option>Backend Engineer</option>
        </select>
      </div>
      <div className="candidates-table">
        <div className="candidate-row">
          <span className="candidate-name">John Doe</span>
          <span>Frontend Developer</span>
          <span className="status interview-scheduled">Interview Scheduled</span>
          <a href="#">View Profile</a>
        </div>
        <div className="candidate-row">
          <span className="candidate-name">Jane Smith</span>
          <span>Backend Engineer</span>
          <span className="status selected">Selected</span>
          <a href="#">View Profile</a>
        </div>
      </div>
    </div>
  );
}
