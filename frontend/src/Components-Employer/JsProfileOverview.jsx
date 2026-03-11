import React, { useState } from 'react';
import './JsProfileOverview.css';
import { ProfileCard } from './ProfileCard';
import fileIcon from '../assets/Employer/fileIcon.png';
import threedots from '../assets/ThreeDots.png';
import Arrow from '../assets/UpArrow.png';
import { Footer } from '../Components-LandingPage/Footer';
import { EHeader } from './EHeader';
import { useParams, useNavigate } from 'react-router-dom';
import { useJobs } from '../JobContext';
// ===== INTEGRATION CODE START =====
import { useEffect } from 'react'; // Add this import if not already present
import api from '../api/axios';

export const JsProfileOverview = () => {
  const { Alluser, addChatToSidebar } = useJobs(); 
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);


  // ===== INTEGRATION CODE START =====
  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const fetchUserFromAPI = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        const response = await api.get(`/profile/jobseeker/${id}/`);
        setApiUser(response.data);
        setApiError(null);
      } catch (err) {
        console.log('API fetch failed, falling back to context', err);
        setApiError(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserFromAPI();
    }
  }, [id]);
  // ===== INTEGRATION CODE END =====

  

  const currentUser = Alluser?.find((user) => String(user.id) === String(id));
  console.log(currentUser)

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleConnect = () => {
    if (currentUser) {
      
      addChatToSidebar(id);
      
      navigate(`/Job-portal/employer-chat/${id}`);
    }
  };


  // ===== INTEGRATION CODE START =====
  // Use API data if available, otherwise fall back to context data
  const displayUser = apiUser || currentUser;
  
  if (loading) {
    return (
      <>
        <EHeader />
        <div className="profile-wrapper">
          <div className="profile-container">
            <h3>Loading profile...</h3>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  // ===== INTEGRATION CODE END =====

  if (!currentUser) {
    return <div className="profile-wrapper"><h3>User Profile Not Found</h3></div>;
  }

  return (
    <>
      <EHeader />
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="page-header">
            <h1>{currentUser.profile?.fullName}'s Profile Overview</h1>
          </div>

          <div className="profile-card-placeholder">
            <ProfileCard user={currentUser} />
          </div>

          <div className="resume-section">
            <h3>Resume</h3>
            <div className="resume-box">
              <div className="resume-info">
                <img src={fileIcon} alt="PDF Icon" className="POverview-Resume-File-icon" />
                <div className="file-details">
                  <p className="file-name">{(currentUser.profile?.fullName || "User")}_Resume.pdf</p>
                  <p className="file-meta">Uploaded on: {currentUser.uploadDate || "24 Oct, 2023"}</p>
                </div>
              </div>
              <img src={threedots} alt="Menu" className="POverview-icon-more" />
            </div>
          </div>

          <div className="qualifications-section">
            <div className="dropdown-header" onClick={toggleDropdown}>
              <div>
                <h3>Qualifications</h3>
                <p className="sub-text">View skills and work experience.</p>
              </div>
              <img 
                src={Arrow} 
                alt="Arrow" 
                className={`arrow-icon ${isOpen ? '' : 'rotate'}`} 
              />
            </div>

            {isOpen && (
              <div className="dropdown-content">
                <div className="info-block">
                  <div className="block-header"><h4>Education</h4></div>
                  <p>{currentUser.education?.highestQual || "No education details provided"}</p>
                </div>

                <div className="info-block">
                  <div className="block-header"><h4>Skills</h4></div>
                  <ul className="skills-list">
                    {currentUser.skills && currentUser.skills.length > 0 ? (
                      currentUser.skills.map((skill, index) => <li key={index}>{skill}</li>)
                    ) : (<li>No skills listed</li>)}
                  </ul>
                </div>

                <div className="info-block">
                  <div className="block-header"><h4>Experience</h4></div>
                  <div className="faded-text">
                    {currentUser.experience?.entries && currentUser.experience.entries.length > 0 ? (
                      currentUser.experience.entries.map((exp) => (
                        <div key={exp.id}><strong>{exp.title}</strong> at {exp.company}</div>
                      ))
                    ) : ("Fresher")}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ready-to-work">
            <div className="toggle-content"><h4>Ready to work</h4></div>
            <div className="toggle-content">
              <p className="block-header">{currentUser.preferences[0]?.ready}</p>
            </div>
          </div>
          {console.log(currentUser.preferences[0].ready)}
          
          <div className="footer-text">
            <button className='FindTalent-btn-view' onClick={handleConnect}>
              Chat with {currentUser.profile?.fullName}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};