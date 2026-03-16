import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './EmployerDashboard.css'
import DashboardIC from '../assets/Employer/DashboardIC.png'
import PostJobs from '../assets/Employer/PostJob.png'
import Mypost from '../assets/Employer/JOBPOST.png'
import Applicant from '../assets/Employer/Group.png'
import Billing from '../assets/Employer/Billing.png'
import Logout from '../assets/Employer/Elogout.png'
import Profile from '../assets/Employer/Esettings.png'
import { EHeader } from './EHeader'
import { Footer } from '../Components-LandingPage/Footer'
import Shortlist from '../assets/Employer/EShortlist.png'
import InterviewS from '../assets/Employer/EInterviewS.png'
import ActiveJobs from '../assets/Employer/EActiveJobs.png'
import Find from '../assets/icon_search.png'
import TotalAPP from '../assets/Employer/ETotalAPP.png'
import Close from '../assets/Employer/close.png'
import ClockImage from '../assets/Employer/ClockImage.gif'
import jobpost from '../assets/Employer/JOBPOST.png'
// import { Header } from '../Components-LandingPage/Header'
// import { JHeader } from '../Components-Jobseeker/JHeader'
import { PostedJobs } from './PostedJobs'
import { ViewApplicants } from './ViewApplicants'
import { useJobs } from '../JobContext'
import { FindTalent } from './FindTalent'
import { PostJobForm } from './PostJobForm'
import { PostJobPreview } from './PostJobPreview'
 
 
export const EmployerDashboard = () => {
 
    const getJobStats = (jobId) => {
        const jobApplicants = Alluser.filter(user =>
            user.appliedJobs?.some(aj => aj.id === jobId)
        );
 
       
       
        const getCountByStatus = (statusList) => {
            return jobApplicants.filter(user => {
                const jobInfo = user.appliedJobs.find(aj => aj.id === jobId);
                return statusList.includes(jobInfo?.status);
            }).length;
        };
 
        return {
            total: jobApplicants.length,
            new: getCountByStatus(["Application Submitted"]),
            reviewed: getCountByStatus(["Resume Screening", "Recruiter Review", "Shortlisted"]),
            hired: getCountByStatus(["Interview Called"]),
            rejected: getCountByStatus(["Rejected"])
        };
    };
 
    const navigate = useNavigate();
 
    const { jobs, chats } = useJobs();
    const [activeMenu, setActiveMenu] = useState(null);
    const employer = chats.find(chat => chat.role === "employer");
    const employerName = employer ? employer.name : "Employer";
    const initialLetter = employerName.charAt(0).toUpperCase();
 
    const [activetab, setActiveTab] = useState('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
 
    const toggleMenu = (id) => {
        setActiveMenu(activeMenu === id ? null : id);
    };
 
 
    const handlePostaJobClick = () => {
        navigate('/Job-portal/Employer/PostJob');
    };
 
 
 
    const location = useLocation();
    const fromVerify = location.state?.fromVerify || false;
    const [isVerifying, setIsVerifying] = useState(fromVerify);
 
    useEffect(() => {
        if (fromVerify) {
            const timer = setTimeout(() => {
                setIsVerifying(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [fromVerify]);
 
    const ToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }
 
    return (
        <>
            <EHeader />
            <div className='container1'>
                {isSidebarOpen ? (
                    <div className='EAside'>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center", alignItems: "center", marginTop: "35px", marginBottom: "35px" }}>
                                <h3 style={{ color: "snow", margin: "25px", fontWeight: "900" }}>{employerName}</h3>
                                <img src={Close} width={10} style={{ backgroundColor: "white", padding: '5px', margin: "25px", borderRadius: "30px" }} onClick={() => ToggleSidebar()} />
                            </div>
                            <h3 className='Aside-Title'>Overview</h3>
                            <div className='ENavbar'>
                                <div onClick={() => !isVerifying && setActiveTab('Dashboard')} className={activetab === 'Dashboard' ? "Active" : 'Navbox'} >
                                    <img src={DashboardIC} height={15} width={15} alt="Dashboard" />
                                   
                                    <div className='Enav-item'>Dashboard</div>
                                </div>
                                <div
                                    onClick={() => !isVerifying && (
                                        setActiveTab('Post a Job')
                                        // navigate('/Job-portal/Employer/PostJob')
                                    )}
                                    className={activetab === 'Post a Job' ? "Active" : 'Navbox'}
                                >
                                    <img src={PostJobs} height={15} width={15} alt="Post a Job" />
                                    <div className='Enav-item'>Post a Job</div>
                                </div>
 
                                <div onClick={() => !isVerifying && setActiveTab('My job post')} className={activetab === 'My job post' ? "Active" : 'Navbox'} >
                                    <img src={Mypost} height={15} width={15} alt="My Job Post" />
                                    <div className='Enav-item'>My Job Post</div>
                                </div>
                                <div onClick={() => !isVerifying && setActiveTab('Find a Talent')} className={activetab === 'Find a Talent' ? "Active" : 'Navbox'} >
                                    <img src={Find} height={15} width={15} alt="My Job Post" />
                                    <div className='Enav-item'>Find a Talent</div>
                                </div>
                                <div onClick={() => !isVerifying && setActiveTab('Analytics')} className={activetab === 'Analytics' ? "Active" : 'Navbox'} >
                                    <img src={Applicant} height={15} width={15} alt="Analytics" />
                                    <div className='Enav-item'>Analytics</div>
                                </div>
                                <div onClick={() => !isVerifying && setActiveTab('Billing')} className={activetab === 'Billing' ? "Active" : 'Navbox'} >
                                    <img src={Billing} height={15} width={15} alt="Billing" />
                                    <div className='Enav-item'>Billing</div>
                                </div>
                            </div>
                            <h3 className='Aside-Title'>Settings</h3>
                            <div className='ENavbar'>
                                <div onClick={() => !isVerifying && setActiveTab('My Profile')} className={activetab === 'My Profile' ? "Active" : 'Navbox'} >
                                    <img src={Profile} height={15} width={15} alt="My Profile" />
                                    <div className='Enav-item'>My Profile</div>
                                </div>
                                <div onClick={() => !isVerifying && setActiveTab('Logout')} className={activetab === 'Logout' ? "Active" : 'Navbox'} >
                                    <img src={Logout} height={15} width={15} alt="Logout" />
                                    <div className='Enav-item'>Logout</div>
                                </div>
                            </div>
                        </div>
                    </div>)
                    : (
                        <div className='EAside2'>
                            <div>
                                <div style={{ display: "flex", flexDirection: "column-reverse", justifyContent: "space-between", alignItems: "center", textAlign: "center", marginTop: "15px", padding: "5px" }}>
                                    <div className='EE-Name'><h3 style={{ margin: "15px", fontSize: "22px" }}>{initialLetter}</h3></div>
                                    <img src={jobpost} width={30} style={{ padding: '5px' }} onClick={() => ToggleSidebar()} />
                                </div>
 
                                <div className='ENavbar1' style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div onClick={() => !isVerifying && setActiveTab('Dashboard')} className={activetab === 'Dashboard' ? "Active1" : 'Navbox1'} >
                                        <img src={DashboardIC} height={20} width={20} alt="Dashboard" />
                                    </div>
                                    <div onClick={() => !isVerifying && (
                                        setActiveTab('Post a Job')
                                        // navigate('/Job-portal/Employer/PostJob')
                                    )} className={activetab === 'Post a Job' ? "Active1" : 'Navbox1'} >
                                        <img src={PostJobs} height={20} width={20} alt="Post a Job" />
                                    </div>
                                    <div onClick={() => !isVerifying && setActiveTab('My job post')} className={activetab === 'My job post' ? "Active1" : 'Navbox1'} >
                                        <img src={Mypost} height={20} width={20} alt="My Job Post" />
                                    </div>
                                    <div onClick={() => !isVerifying && setActiveTab('Find a Talent')} className={activetab === 'Find a Talent' ? "Active1" : 'Navbox1'} >
                                        <img src={Applicant} height={20} width={20} alt="Analytics" />
                                    </div>
                                    <div onClick={() => !isVerifying && setActiveTab('Analytics')} className={activetab === 'Analytics' ? "Active1" : 'Navbox1'} >
                                        <img src={Applicant} height={20} width={20} alt="Analytics" />
                                    </div>
                                    <div onClick={() => !isVerifying && setActiveTab('Billing')} className={activetab === 'Billing' ? "Active1" : 'Navbox1'} >
                                        <img src={Billing} height={20} width={20} alt="Billing" />
                                    </div>
                                    <div onClick={() => !isVerifying && setActiveTab('My Profile')} className={activetab === 'My Profile' ? "Active1" : 'Navbox1'} >
                                        <img src={Profile} height={20} width={20} alt="My Profile" />
                                    </div>
                                    <div onClick={() => !isVerifying && setActiveTab('Logout')} className={activetab === 'Logout' ? "Active1" : 'Navbox1'} >
                                        <img src={Logout} height={20} width={20} alt="Logout" />
                                    </div>
                                </div>
 
                                <div className='ENavbar'>
 
                                </div>
 
                            </div>
                        </div>
                    )}
 
                <div className={isSidebarOpen ? 'Emainsec' : 'Emainsec2'}>
 
                    {activetab === 'Dashboard' && (
                        <>
                            {isVerifying ? (
 
                                <div className="pending-main-section">
                                    <div className='Welcome-Note'>
                                        <div>
                                            <h2>Hi {employerName},</h2>
                                            <p style={{ fontWeight: "600" }}>Here's, What's Going on... </p>
                                        </div>
                                    </div>
                                    <div className="pending-section">
                                        <img
                                            src={ClockImage}
                                            alt="pending"
                                            className="pending-icon"
                                        />
                                        <h2>Pending Verification</h2>
                                    </div>
 
                                </div>
                            ) : (
                                <>
                                    <div className='Welcome-Note'>
                                        <div>
                                            <h2>Hi {employerName},</h2>
                                            <p style={{ fontWeight: "600" }}>Here's, What's Going on... </p>
                                        </div>
                                        <button className='post-job-btn' onClick={handlePostaJobClick}>+ Post a Job</button>
                                    </div>
 
                                    <div className='E-DashB-Over-View'>
                                        <h2 style={{ marginLeft: "40px" }}>OverView</h2>
                                        <div className='EDashB-Application-Counts'>
                                            <div className='E-DashB-No-Counts'>
                                                <div><img src={ActiveJobs} width={40} alt="" /></div>
                                                <div><p>0</p><p className='E-job-status'>Active Jobs</p></div>
                                            </div>
                                            <div className='E-DashB-No-Counts'>
                                                <div><img src={TotalAPP} width={40} alt="" /></div>
                                                <div><p>0</p><p className='E-job-status'>Total Applicants</p></div>
                                            </div>
                                            <div className='E-DashB-No-Counts'>
                                                <div><img src={Shortlist} width={40} alt="" /></div>
                                                <div><p>0</p><p className='E-job-status'>ShortListed</p></div>
                                            </div>
                                            <div className='E-DashB-No-Counts'>
                                                <div><img src={InterviewS} width={40} alt="" /></div>
                                                <div><p>0</p><p className='E-job-status'>Interview Schedules</p></div>
                                            </div>
                                        </div>
                                    </div>
 
                                    {/* Recently posted jobs */}
 
                                    <div className='ERecent-Post-Cont'>
                                        <h3 style={{ marginleft: "40px" }}>Recently Posted Jobs</h3>
                                        <div className='ERecent-Post-Table-Container'>
                                            <div className="dashboard-job-header">
                                                <span>Job Title</span>
                                                <span>Applicants</span>
                                                <span>Reviewed</span>
                                                <span>Shortlisted</span>
                                                <span>Scheduled</span>
                                                <span></span>
                                            </div>
 
                                            {jobs.length > 0 ? (
                                                [...jobs].slice(0, 5).map((job) => (
                                                    <div key={job.id} className="dashboard-job-row">
                                                        <div className="dashboard-job-info">
                                                            <strong>{job.jobTitle || job.title}</strong>
                                                            <small>Created on: {job.postedDate || job.posted}</small>
                                                        </div>
                                                        <span className="count-badge">{job.applicants || 0}</span>
                                                        <span className="count-badge">{job.reviewed || 0}</span>
                                                        <span className="count-badge">{job.shortlisted || 0}</span>
                                                        <span className="count-badge">{job.scheduled || 0}</span>
                                                        <div className="dashboard-job-actions">
                                                            <button
                                                                className="view-app-link"
                                                                onClick={() => {
                                                                    setSelectedJob(job);
                                                                    setActiveTab('ViewApplicants');
                                                                }}
                                                            >
                                                                View applicants
                                                            </button>
 
                                                            <div className="menu-dots-icon">
                                                                <span className="dots-icon" onClick={() => toggleMenu(job.id)}>⋮</span>
                                                                {activeMenu === job.id && (
                                                                    <div className="postedjobs-dropdown" style={{ top: '30px', right: '0' }}>
                                                                        <button onClick={() => navigate('/Job-portal/Employer/EditJob', { state: job })}>Edit</button>
                                                                        <button className="delete-opt">Delete</button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="no-jobs-posted">
                                                    <p>No jobs posted yet.</p>
                                                    <button className='post-job-btn' onClick={handlePostaJobClick}>+ Post a Job</button>
                                                </div>
                                            )}
 
                                            {jobs.length > 0 && (
                                                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                                    <button
                                                        className="view-more-link"
                                                        onClick={() => setActiveTab('My job post')}
                                                    >
                                                        View more...
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
 
                    {activetab === 'Notifications' && (
                        <h1>Notifications Section</h1>)}
                    {activetab === 'Chats' && (
                        <h1>Chats</h1>)}
                    {activetab === 'Post a Job' && (
                        <PostJobForm/>
                    )}
                    {activetab === 'My job post' && (
                        <PostedJobs
                            onViewApplicants={(job) => {
                                setSelectedJob(job);
                                setActiveTab('ViewApplicants');
                            }}
                        />
                    )}
                    {activetab === 'ViewApplicants' && (
                        <ViewApplicants
                            job={selectedJob}
                            onBack={() => setActiveTab('My job post')}
                        />
                    )}
                    {activetab === 'Find a Talent' && (
                        <>
                            <FindTalent />
                        </>)}
                    {activetab === 'Analytics' && (
                        <h1>Analytics</h1>)}
                    {activetab === 'Billing' && (
                        <h1>Interview Section</h1>)}
                    {activetab === 'My Profile' && (
                        <h1>My Profile Section</h1>)}
                    {activetab === 'Logout' && (
                        <h1>Logout Section</h1>)}
 
                </div>
 
            </div>
            <Footer />
        </>
    );
};