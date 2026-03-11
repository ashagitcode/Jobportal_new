import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import UserIcon from "../assets/Employer/User.png";
import { useJobs } from "../JobContext";
import "./ViewApplicants.css";

export const ViewApplicants = ({ job }) => {
  const { Alluser, updateApplicantStatus, addChatToSidebar } = useJobs();
  const [viewMode, setViewMode] = useState("list");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const statusOptions = [
    "Application Submitted",
    "Resume Screening",
    "Recruiter Review",
    "Shortlisted",
    "Interview Called",
    "Rejected"
  ];

  const applicantsForThisJob = Alluser.filter(user => 
    user.appliedJobs?.some(aj => aj.id === job?.id)
  );

  
  const calculateJobStats = () => {
    const getCount = (statusName) => {
      return applicantsForThisJob.filter(user => {
        const jobInfo = user.appliedJobs.find(aj => aj.id === job?.id);
        return jobInfo?.status === statusName;
      }).length;
    };

    return {
      total: applicantsForThisJob.length,
      shortlisted: getCount("Shortlisted"),
      rejected: getCount("Rejected")
    };
  };

  const stats = calculateJobStats();

  const handleStatusChange = (userId, newStatus) => {
    updateApplicantStatus(userId, job?.id, newStatus);
    if (selectedUser) {
      setSelectedUser(prev => ({ ...prev, status: newStatus }));
    }
  };

  const handleMessageUser = (userId) => {
    addChatToSidebar(userId); 
    navigate(`/Job-portal/employer-chat/${userId}`); 
  };

  const handleViewDetails = (user) => {
    const jobSpecificInfo = user.appliedJobs?.find(aj => aj.id === job?.id);
    setSelectedUser({ 
      ...user, 
      status: jobSpecificInfo?.status || "Application Submitted" 
    });
    setViewMode("detail");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedUser(null);
  };

  const getStatusClass = (status) => {
    const s = status?.toLowerCase() || 'pending';
    if (s === 'application submitted') return 'status-submitted';
    if (s === 'resume screening') return 'status-screening';
    if (s === 'recruiter review') return 'status-review';
    if (s === 'shortlisted') return 'status-shortlisted';
    if (s === 'interview called') return 'status-interview';
    if (s === 'rejected') return 'status-rejected';
    return 'status-pending';
  };

  // --- TABLE VIEW ---
  if (viewMode === "list") {
    return (
      <div className="view-applicants-page">
        <div className="main-card">
          <div className="header-section">
            <div className="title-group">
              <h2>Applicants for {job?.jobTitle}</h2>
              <p className="subtitle">{stats.total} Total Jobseekers applied</p>
            </div>
            {/* Optional: Add status badges here if needed */}
          </div>

          <table className="applicants-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Experience</th>
                <th>Status for this Job</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applicantsForThisJob.length > 0 ? (
                applicantsForThisJob.map((user) => {
                  const currentJobStatus = user.appliedJobs?.find(aj => aj.id === job?.id)?.status;
                  return (
                    <tr key={user.id}>
                      <td className="candidate-cell">
                        <img src={UserIcon} alt="avatar" className="table-avatar" />
                        <div className="name-stack">
                          <span className="name">{user.profile?.fullName || "N/A"}</span>
                          <span className="designation">{user.currentDetails?.jobTitle}</span>
                        </div>
                      </td>
                      <td>{user.currentDetails?.experience}</td>
                      <td>
                        <span className={`status-pill ${getStatusClass(currentJobStatus)}`}>
                          {currentJobStatus || "Application Submitted"}
                        </span>
                      </td>
                      <td>
                        <button className="view-link-btn" onClick={() => handleViewDetails(user)}>
                          View Application
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    No one has applied for this job yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // --- DETAIL VIEW ---
  return (
    <div className="view-applicants-page detail-view">
      <div className="detail-container">
        <div className="detail-header">
          <button className="back-btn" onClick={handleBack}> Back to Application</button>
          
          <div className="header-actions">
            <div className="status-selector-container">
              <span>Update Stage: </span>
              <select 
                className="status-dropdown-box"
                value={selectedUser.status}
                onChange={(e) => handleStatusChange(selectedUser.id, e.target.value)}
              >
                {statusOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="detail-layout">
          <div className="detail-left">
            <div className="profile-main-card">
              <img src={UserIcon} alt="Profile" className="detail-avatar" />
              <h3>{selectedUser.profile?.fullName}</h3>
              <p className="role-tag">{selectedUser.currentDetails?.jobTitle}</p>
              
              <div className="quick-info-list">
                <p><strong>Experience:</strong> {selectedUser.currentDetails?.experience}</p>
                <p><strong>Education:</strong> {selectedUser.education?.highestQual}</p>
                <p><strong>Current Loc:</strong> {selectedUser.currentDetails?.currentLocation}</p>
              </div>

              <div className="status-badge-container">
                 <p className="status-label">Application Stage:</p>
                 <span className={`status-pill large ${getStatusClass(selectedUser.status)}`}>
                    {selectedUser.status}
                 </span>
              </div>
            </div>
          </div>

          <div className="detail-right">
  <div className="tabs-bar">
    <span className="tab active">Profile Overview</span>
  </div>
  
  <div className="tab-pane">
    {/* Skills Section */}
    <div className="info-section">
      <h4>Skills</h4>
      <div className="skill-pills">
        {selectedUser.skills?.map((skill, i) => (
          <span key={i} className="skill-tag">{skill}</span>
        ))}
      </div>
    </div>

    {/* Resume & Documents Section */}
    <div className="info-section document-section">
      <h4>Resume & Documents</h4>
      <div className="resume-card">
        <div className="resume-info">
          <div className="file-details">
            <p className="file-name">{selectedUser.profile?.fullName}_Resume.pdf</p>
            <p className="file-size">{selectedUser.resume?.size || "1.2 MB"}</p>
          </div>
        </div>
        <button className="download-btn" onClick={() => alert("Downloading Resume...")}>
          Download Resume
        </button>
      </div>
    </div>

    {/* Cover Letter Section */}
    <div className="info-section">
      <h4>Cover Letter / Experience Summary</h4>
      <div className="cover-letter-box">
        <p>
          {selectedUser.experience?.entries?.[0]?.responsibilities || 
           "Dear Hiring Manager, I am highly interested in this position and believe my skills align with your requirements. I have a strong foundation in the required technologies and I am eager to contribute to your team."}
        </p>
      </div>
    </div>

    {/* Education Summary */}
    <div className="info-section">
      <h4>Education</h4>
      <div className="edu-item">
        <p><strong>{selectedUser.education?.highestQual}</strong></p>
        <p className="sub-text">{selectedUser.education?.graduations?.[0]?.college} | {selectedUser.education?.graduations?.[0]?.endYear}</p>
      </div>
    </div>
  </div>
</div>
        </div>

        <div className="message-action-footer">
            <button className="btn-message-center" onClick={() => handleMessageUser(selectedUser.id)}>
                Send Message to {selectedUser.profile?.fullName.split(' ')[0]}
            </button>
        </div>
      </div>
    </div>
  );
};