import React, { useState, useEffect } from 'react';
import JobCard from './components/JobCard';
import JobDetail from './components/JobDetail';
import ChatBot from './components/ChatBot';

const formatDate = (dateString) => {
  if (!dateString) return 'Recently posted';
  
  try {
    const jobDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - jobDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    
    return jobDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch (e) {
    return dateString;
  }
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastSearchQuery, setLastSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const searchJobs = async (title, page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:8080/api/v1/jobs/search_by_keyword?resultsPerPage=20&keyword=${encodeURIComponent(title)}&page=${page}`);
      if (!response.ok) {
        throw new Error(`error_${response.status}`);
      }
      const data = await response.json();
      
      // Transform backend data to match frontend structure
      const transformedJobs = data.map((job, index) => ({
        id: job.id || `${title}-${page}-${index}`,
        company: job.company?.display_name || job.company?.value || 'Unknown Company',
        title: job.title || 'Job Title',
        location: job.location?.display_name || 'Location TBD',
        postedAt: formatDate(job.created),
        description: job.description || 'No description available',
        tags: [job.contract_time || 'Full-time'].filter(Boolean),
        salaryMin: job.salary_min || job.salary_min,
        salaryMax: job.salary_max || job.salary_max,
        redirectUrl: job.redirect_url
      }));
      
      // If less than 20 results, we've reached the end
      setHasMore(transformedJobs.length === 20);

      if (page === 1) {
        setJobs(transformedJobs);
      } else {
        setJobs(prev => [...prev, ...transformedJobs]);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      let userMessage = 'We had trouble loading jobs. Please try again.';
      
      if (err.message === 'error_500') {
        userMessage = 'We encountered an issue processing your request.';
      } else if (err.message === 'error_400') {
        userMessage = 'Please check your search terms and try again.';
      } else if (err.message === 'error_404') {
        userMessage = 'No results found for your search. Try different keywords.';
      }
      
      setError(userMessage);
      if (page === 1) {
        setJobs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLastSearchQuery(searchQuery);
      setCurrentPage(1);
      setHasMore(true);
      searchJobs(searchQuery, 1);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore && lastSearchQuery) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      searchJobs(lastSearchQuery, nextPage);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredJobs = jobs.filter((job) => {
    const query = searchQuery.toLowerCase();
    return (
      job.title.toLowerCase().includes(query) ||
      job.company.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.scrollHeight - 500;
      
      if (scrollPosition >= threshold && hasMore && !loading && lastSearchQuery) {
        loadMore();
      }

      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, lastSearchQuery, currentPage]);

  const selectedJob = jobs.find((job) => job.id === selectedJobId);

  if (selectedJobId && selectedJob) {
    return (
      <div className="app">
        <JobDetail 
          job={selectedJob} 
          onBack={() => setSelectedJobId(null)} 
        />
        <ChatBot />
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">Job Listings</h1>
        <p className="subtitle">Explore open roles</p>
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            className="search-bar"
            placeholder="Search by job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="search-button" disabled={loading}>
            Search
          </button>
        </form>
      </header>

      <main className="list">
        {jobs.length === 0 && loading && <p className="loading">Loading jobs...</p>}
        {error && <p className="error">{error}</p>}
        {filteredJobs.length > 0 && (
          filteredJobs.map((job) => (
            <JobCard 
              job={job} 
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
            />
          ))
        )}
        {jobs.length > 0 && loading && <p className="loading">Loading more jobs...</p>}
        {!error && filteredJobs.length === 0 && jobs.length > 0 && (
          <p className="no-results">No jobs found matching your search.</p>
        )}
      </main>

      {showScrollTop && (
        <button 
          className="scroll-to-top" 
          onClick={scrollToTop}
          title="Back to top"
        >
          ↑
        </button>
      )}

      <ChatBot />
    </div>
  );
}
