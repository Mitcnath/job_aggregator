import React, { useState } from 'react';

export default function JobCard({ job, onClick }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveClick = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <div className="card" onClick={onClick}>
      <div className="row">
        <div className="company">{job.company}</div>
        <div className="date">{job.postedAt}</div>
      </div>

      <div className="title">{job.title}</div>
      <div className="location">{job.location}</div>

      <div className="description">{job.description}</div>

      <div className="tags">
        {job.tags.map((t) => (
          <span className="tag" key={t}>{t}</span>
        ))}
      </div>

      <div className="actions">
        <button className="apply">View</button>
        <button 
          className={`save-button ${isSaved ? 'saved' : ''}`}
          onClick={handleSaveClick}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
}
