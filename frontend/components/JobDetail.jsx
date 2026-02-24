import React, { useState } from 'react';

export default function JobDetail({ job, onBack }) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="job-detail">
      <button className="back-button" onClick={onBack}>
        ← Back to listings
      </button>

      <div className="detail-container">
        <div className="detail-header">
          <div>
            <div className="detail-company">{job.company}</div>
            <h1 className="detail-title">{job.title}</h1>
            <div className="detail-meta">
              <span className="detail-location">📍 {job.location}</span>
              <span className="detail-posted">⏰ Posted {job.postedAt}</span>
            </div>
          </div>
          <button
            className={`save-button-large ${isSaved ? 'saved' : ''}`}
            onClick={() => setIsSaved(!isSaved)}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            {isSaved ? '❤️' : '🤍'}
          </button>
        </div>

        <div className="detail-section">
          <h2>Job Description</h2>
          <p className="detail-description">{job.description}</p>
        </div>

        <div className="detail-section">
          <h2>Requirements & Skills</h2>
          <div className="detail-tags">
            {job.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-actions">
          <button 
            className="apply-button-large"
            onClick={() => {
              if (job.redirectUrl) {
                window.open(job.redirectUrl, '_blank');
              }
            }}
            disabled={!job.redirectUrl}
            title={job.redirectUrl ? 'Apply to this job' : 'Application URL not available'}
          >
            Apply Now
          </button>
          <button className="back-button-secondary" onClick={onBack}>
            Back to listings
          </button>
        </div>
      </div>
    </div>
  );
}
