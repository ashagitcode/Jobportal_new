// import React, { useState } from 'react';
// import './JsProfileOverview.css';
// import { ProfileCard } from './ProfileCard';
// import fileIcon from '../assets/Employer/fileIcon.png';
// import threedots from '../assets/ThreeDots.png';
// import Arrow from '../assets/UpArrow.png';
// import { Footer } from '../Components-LandingPage/Footer';
// import { EHeader } from './EHeader';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useJobs } from '../JobContext';

// export const JsProfileOverview = () => {
//   const { Alluser, startConversation } = useJobs(); 
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);

//   const currentUser = Alluser?.find((user) => String(user.id) === String(id));
//   console.log(currentUser)

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   // const handleConnect = () => {
//   //   if (currentUser) {
      
//   //     addChatToSidebar(id);
      
//   //     navigate(`/Job-portal/employer-chat/${id}`);
//   //   }
//   // };

//   const handleConnect = async () => {
//     if (currentUser) {
//       try {
//         const conversationId = await startConversation(currentUser.id);
//         navigate(`/Job-portal/employer-chat/${conversationId}`);
//       } catch (error) {
//         console.error("Failed to start conversation:", error);
//       }
//     }
//   };

//   // if (!currentUser) {
//   //   return <div className="profile-wrapper"><h3>User Profile Not Found</h3></div>;
//   // }

// if (!currentUser) {
//     return (
//       <>
//         <EHeader />
//         <div className="profile-wrapper">
//           <div className="profile-container">
//             <h3>User Profile Not Found</h3>
//             <p>Loading or user with ID {id} does not exist.</p>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   // Extract user data safely
//   const userData = currentUser.user || {};
//   const profile = currentUser;
  
//   const fullName = currentUser.full_name || 
//                    userData.full_name || 
//                    userData.username || 
//                    "User";
  
//   const resumeFileName = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
  
//   // Format date
//   const uploadDate = profile.resume_updated_at || 
//                      profile.updated_at || 
//                      new Date().toISOString();
  
//   const formattedDate = new Date(uploadDate).toLocaleDateString('en-GB', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric'
//   });

//   // Get education details
//   const education = profile.education || profile.educations || [];
//   const highestQual = Array.isArray(education) && education.length > 0 
//     ? education[0]?.degree || "No education details provided"
//     : "No education details provided";

//   // Get skills
//   const skills = profile.skills || [];
//   const skillsList = Array.isArray(skills) ? skills : [];

//   // Get experience
//   const experience = profile.experience || profile.work_experience || [];
//   const experienceEntries = Array.isArray(experience) ? experience : [];

//   // Get preferences/ready to work
//   const readyToWork = profile.preferences?.ready || 
//                       profile.ready_to_work || 
//                       "Yes";

  

//   // return (
//   //   <>
//   //     <EHeader />
//   //     <div className="profile-wrapper">
//   //       <div className="profile-container">
//   //         <div className="page-header">
//   //           <h1>{currentUser.profile?.fullName}'s Profile Overview</h1>
//   //         </div>

//   //         <div className="profile-card-placeholder">
//   //           <ProfileCard user={currentUser} />
//   //         </div>

//   //         <div className="resume-section">
//   //           <h3>Resume</h3>
//   //           <div className="resume-box">
//   //             <div className="resume-info">
//   //               <img src={fileIcon} alt="PDF Icon" className="POverview-Resume-File-icon" />
//   //               <div className="file-details">
//   //                 <p className="file-name">{(currentUser.profile?.fullName || "User")}_Resume.pdf</p>
//   //                 <p className="file-meta">Uploaded on: {currentUser.uploadDate || "24 Oct, 2023"}</p>
//   //               </div>
//   //             </div>
//   //             <img src={threedots} alt="Menu" className="POverview-icon-more" />
//   //           </div>
//   //         </div>

//   //         <div className="qualifications-section">
//   //           <div className="dropdown-header" onClick={toggleDropdown}>
//   //             <div>
//   //               <h3>Qualifications</h3>
//   //               <p className="sub-text">View skills and work experience.</p>
//   //             </div>
//   //             <img 
//   //               src={Arrow} 
//   //               alt="Arrow" 
//   //               className={`arrow-icon ${isOpen ? '' : 'rotate'}`} 
//   //             />
//   //           </div>

//   //           {isOpen && (
//   //             <div className="dropdown-content">
//   //               <div className="info-block">
//   //                 <div className="block-header"><h4>Education</h4></div>
//   //                 <p>{currentUser.education?.highestQual || "No education details provided"}</p>
//   //               </div>

//   //               <div className="info-block">
//   //                 <div className="block-header"><h4>Skills</h4></div>
//   //                 <ul className="skills-list">
//   //                   {currentUser.skills && currentUser.skills.length > 0 ? (
//   //                     currentUser.skills.map((skill, index) => <li key={index}>{skill}</li>)
//   //                   ) : (<li>No skills listed</li>)}
//   //                 </ul>
//   //               </div>

//   //               <div className="info-block">
//   //                 <div className="block-header"><h4>Experience</h4></div>
//   //                 <div className="faded-text">
//   //                   {currentUser.experience?.entries && currentUser.experience.entries.length > 0 ? (
//   //                     currentUser.experience.entries.map((exp) => (
//   //                       <div key={exp.id}><strong>{exp.title}</strong> at {exp.company}</div>
//   //                     ))
//   //                   ) : ("Fresher")}
//   //                 </div>
//   //               </div>
//   //             </div>
//   //           )}
//   //         </div>

//   //         <div className="ready-to-work">
//   //           <div className="toggle-content"><h4>Ready to work</h4></div>
//   //           <div className="toggle-content">
//   //             <p className="block-header">{currentUser.preferences[0]?.ready}</p>
//   //           </div>
//   //         </div>
//   //         {console.log(currentUser.preferences[0].ready)}
          
//   //         <div className="footer-text">
//   //           <button className='FindTalent-btn-view' onClick={handleConnect}>
//   //             Chat with {currentUser.profile?.fullName}
//   //           </button>
//   //         </div>
//   //       </div>
//   //     </div>
//   //     <Footer />
//   //   </>
//   // );



// return (
//     <>
//       <EHeader />
//       <div className="profile-wrapper">
//         <div className="profile-container">
//           <div className="page-header">
//             <h1>{fullName}'s Profile Overview</h1>
//           </div>

//           <div className="profile-card-placeholder">
//             <ProfileCard user={currentUser} />
//           </div>

//           <div className="resume-section">
//             <h3>Resume</h3>
//             <div className="resume-box">
//               <div className="resume-info">
//                 <img src={fileIcon} alt="PDF Icon" className="POverview-Resume-File-icon" />
//                 <div className="file-details">
//                   <p className="file-name">{resumeFileName}</p>
//                   <p className="file-meta">Uploaded on: {formattedDate}</p>
//                 </div>
//               </div>
//               <img src={threedots} alt="Menu" className="POverview-icon-more" />
//             </div>
//           </div>

//           <div className="qualifications-section">
//             <div className="dropdown-header" onClick={toggleDropdown}>
//               <div>
//                 <h3>Qualifications</h3>
//                 <p className="sub-text">View skills and work experience.</p>
//               </div>
//               <img 
//                 src={Arrow} 
//                 alt="Arrow" 
//                 className={`arrow-icon ${isOpen ? '' : 'rotate'}`} 
//               />
//             </div>

//             {isOpen && (
//               <div className="dropdown-content">
//                 <div className="info-block">
//                   <div className="block-header"><h4>Education</h4></div>
//                   <p>{highestQual}</p>
//                   {Array.isArray(education) && education.length > 1 && (
//                     <div className="additional-education">
//                       {education.slice(1).map((edu, idx) => (
//                         <p key={idx} className="faded-text">{edu.degree} from {edu.institution}</p>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="info-block">
//                   <div className="block-header"><h4>Skills</h4></div>
//                   <ul className="skills-list">
//                     {skillsList.length > 0 ? (
//                       skillsList.map((skill, index) => (
//                         <li key={index}>
//                           {typeof skill === 'string' ? skill : skill.name || skill.skill}
//                         </li>
//                       ))
//                     ) : (
//                       <li>No skills listed</li>
//                     )}
//                   </ul>
//                 </div>

//                 <div className="info-block">
//                   <div className="block-header"><h4>Experience</h4></div>
//                   <div className="faded-text">
//                     {experienceEntries.length > 0 ? (
//                       experienceEntries.map((exp, idx) => (
//                         <div key={idx} className="experience-item">
//                           <strong>{exp.title || exp.job_title}</strong> at {exp.company || exp.company_name}
//                           {exp.duration && <span> • {exp.duration}</span>}
//                         </div>
//                       ))
//                     ) : (
//                       "Fresher"
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="ready-to-work">
//             <div className="toggle-content"><h4>Ready to work</h4></div>
//             <div className="toggle-content">
//               <p className="block-header">{readyToWork}</p>
//             </div>
//           </div>
          
//           <div className="footer-text">
//             <button className='FindTalent-btn-view' onClick={handleConnect}>
//               Chat with {fullName}
//             </button>
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };





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

export const JsProfileOverview = () => {
  const { Alluser, startConversation, loading } = useJobs();  // ← Line 11: loading add cheyi
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Loading check - add this after useState (around line 16)
  if (loading) {
    return (
      <>
        <EHeader />
        <div className="profile-wrapper">
          <div className="profile-container">
            <h3>Loading...</h3>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentUser = Alluser?.find((user) => String(user.id) === String(id));
  console.log("currentUser:", currentUser);  // Line ~24

  // Add null check before accessing properties (after currentUser find)
  if (!currentUser) {
    return (
      <>
        <EHeader />
        <div className="profile-wrapper">
          <div className="profile-container">
            <h3>User Profile Not Found</h3>
            <p>Loading or user with ID {id} does not exist.</p>
            <p>Alluser length: {Alluser?.length}</p>  {/* Debug info */}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Now safe to access currentUser properties (add this after null check)
  console.log("Full currentUser object:", {
    id: currentUser.id,
    user: currentUser.user,
    user_id: currentUser.user_id,
    full_name: currentUser.full_name
  });

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // const handleConnect = async () => {
  //   if (currentUser) {
  //     try {
  //       // Get the actual user ID from nested user object
  //       const actualUserId = currentUser.user?.id || currentUser.user_id;
        
  //       console.log("Profile ID:", currentUser.id);
  //       console.log("Actual User ID:", actualUserId);
        
  //       const initialMessage = prompt(`Send a message to start conversation with ${fullName}:`, "Hi, I'm interested in your profile");
        
  //       if (initialMessage === null) return;
  //       if (!initialMessage.trim()) {
  //         alert("Please enter a message");
  //         return;
  //       }
        
  //       // Send the actual User ID, not Profile ID
  //       const conversationId = await startConversation(actualUserId, initialMessage);
  //       navigate(`/Job-portal/employer-chat/${conversationId}`);
  //     } catch (error) {
  //       console.error("Failed to start conversation:", error);
  //       alert(error.response?.data?.error || "Failed to start conversation");
  //     }
  //   }
  // };



  // JsProfileOverview.jsx - handleConnect
const handleConnect = async () => {
  if (currentUser) {
    try {
      // Get the actual user ID from nested user object
      const actualUserId = currentUser.user?.id || currentUser.user_id;
      
      console.log("Profile ID:", currentUser.id);
      console.log("Actual User ID:", actualUserId);
      
      // Don't modify actualUserId - send it directly
      const initialMessage = prompt(`Send a message to start conversation with ${fullName}:`, "Hi, I'm interested in your profile");
      
      if (initialMessage === null) return;
      if (!initialMessage.trim()) {
        alert("Please enter a message");
        return;
      }
      
      // Send actualUserId directly (should be 4 in your case)
      const conversationId = await startConversation(actualUserId, initialMessage);
      navigate(`/Job-portal/employer-chat/${conversationId}`);
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert(error.response?.data?.error || "Failed to start conversation");
    }
  }
};

  // Extract user data safely (after null check)
  const userData = currentUser.user || {};
  const profile = currentUser;
  
  const fullName = currentUser.full_name || 
                   userData.full_name || 
                   userData.username || 
                   "User";
  
  const resumeFileName = `${fullName.replace(/\s+/g, '_')}_Resume.pdf`;
  
  // Format date
  const uploadDate = profile.resume_updated_at || 
                     profile.updated_at || 
                     new Date().toISOString();
  
  const formattedDate = new Date(uploadDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // Get education details
  const education = profile.education || profile.educations || [];
  const highestQual = Array.isArray(education) && education.length > 0 
    ? education[0]?.degree || "No education details provided"
    : "No education details provided";

  // Get skills
  const skills = profile.skills || [];
  const skillsList = Array.isArray(skills) ? skills : [];

  // Get experience
  const experience = profile.experience || profile.work_experience || [];
  const experienceEntries = Array.isArray(experience) ? experience : [];

  // Get preferences/ready to work
  const readyToWork = profile.preferences?.ready || 
                      profile.ready_to_work || 
                      "Yes";

  return (
    <>
      <EHeader />
      <div className="profile-wrapper">
        <div className="profile-container">
          <div className="page-header">
            <h1>{fullName}'s Profile Overview</h1>
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
                  <p className="file-name">{resumeFileName}</p>
                  <p className="file-meta">Uploaded on: {formattedDate}</p>
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
                  <p>{highestQual}</p>
                  {Array.isArray(education) && education.length > 1 && (
                    <div className="additional-education">
                      {education.slice(1).map((edu, idx) => (
                        <p key={idx} className="faded-text">{edu.degree} from {edu.institution}</p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="info-block">
                  <div className="block-header"><h4>Skills</h4></div>
                  <ul className="skills-list">
                    {skillsList.length > 0 ? (
                      skillsList.map((skill, index) => (
                        <li key={index}>
                          {typeof skill === 'string' ? skill : skill.name || skill.skill}
                        </li>
                      ))
                    ) : (
                      <li>No skills listed</li>
                    )}
                  </ul>
                </div>

                <div className="info-block">
                  <div className="block-header"><h4>Experience</h4></div>
                  <div className="faded-text">
                    {experienceEntries.length > 0 ? (
                      experienceEntries.map((exp, idx) => (
                        <div key={idx} className="experience-item">
                          <strong>{exp.title || exp.job_title}</strong> at {exp.company || exp.company_name}
                          {exp.duration && <span> • {exp.duration}</span>}
                        </div>
                      ))
                    ) : (
                      "Fresher"
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="ready-to-work">
            <div className="toggle-content"><h4>Ready to work</h4></div>
            <div className="toggle-content">
              <p className="block-header">{readyToWork}</p>
            </div>
          </div>
          
          <div className="footer-text">
            <button className='FindTalent-btn-view' onClick={handleConnect}>
              Chat with {fullName}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};