import React from 'react';
import './ProfileCard.css'; 
import call from '../assets/Employer/Call.png'
import Mail from '../assets/Employer/Email.png'
import Location from '../assets/Employer/Location.png'
import { useNavigate } from 'react-router-dom';


export const ProfileCard = ({ user, showActions = false }) => {
  const navigate = useNavigate();
  console.log("profile card user data:",user)
  if (!user) return null;

  // Access profile data correctly
  const profile=user;  // JobSeekerProfile object
  const userData=user.user || {}; // Nested user object

  const fullName = user.full_name   ||   userData.full_name || 
                   userData.username ||  "Unknown";
  const initials = fullName
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const jobTitle = profile.current_job_title ||  profile.currentJobTitle ||  "N/A";
  const experience = profile.experience_years ||   profile.total_experience_years || "0";

  const email = userData.email || "N/A";
  const phone = profile.phone ||  userData.phone || "N/A";
  const city = profile.city || "N/A";
  const state = profile.state || "N/A";


  // Get resume updated date
  const resumeUpdated = profile.resume_updated_at || 
                        profile.updated_at || 
                        new Date().toISOString();

  const daysAgo = Math.floor((new Date() - new Date(resumeUpdated)) / (1000 * 60 * 60 * 24));
  const resumeText = daysAgo < 1 ? "Today" : `${daysAgo} days ago`;

  const handleViewProfile = () => {
    navigate(`/Job-portal/Employer/FindTalent/ProfileOverview/${user.id}`);
  };

  return (
    <div className="FindTalent-profile-card-container">
      <div className="FindTalent-card-header">
        <div className="FindTalent-name-and-title">
          <h1 className="FindTalent-name">{fullName}</h1>
          <p className="FindTalent-job-title">{jobTitle} • {experience} yrs</p>
        </div>

        <div className="FindTalent-profile-image-container">
          <span className="FindTalent-profile-initials">{initials}</span>
        </div>
      </div>

      <div className="FindTalent-contact-info-container">
        <div className="FindTalent-contact-item">
          <img src={Mail} alt="Email" className="FindTalent-info-icon" />
          <span>{email}</span>
        </div>
        <div className="FindTalent-contact-item">
          <img src={call} alt="Phone" className="FindTalent-info-icon" />
          <span>{phone}</span>
        </div>
        <div className="FindTalent-contact-item">
          <img src={Location} alt="Location" className="FindTalent-info-icon" />
          <span>{city}, {state&&`${state}`}</span>
        </div>
      </div>

      {showActions && (
        <div className="FindTalent-card-bottom">
          <p className="FindTalent-timestamp">Resume updated:{resumeText}</p>
          <div className="FindTalent-actions">
            <button className="FindTalent-btn-save">Save</button>
            <button
              onClick={handleViewProfile}
              className="FindTalent-btn-view"
            >
              View profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};