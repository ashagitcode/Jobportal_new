import React, { createContext, useState, useContext, useEffect } from 'react';
// import { JobList } from './JobList';
import api from "./api/axios";

const JobContext = createContext();

export const JobProvider = ({ children }) => {
    // Total JobList
    const [jobs, setJobs] = useState([]);

    // States to Toggle online status in chats
    const [onlineStatus, setOnlineStatus] = useState("yes");

    // Jobs to show when Applied
    const [appliedJobs, setAppliedJobs] = useState([]);

    // Jobs to show when Saved
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // ADD THESE MISSING STATE VARIABLES:
    const [notificationsData, setNotificationsData] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [Alluser, setAlluser] = useState([]); // For user profiles
    const [currentUser, setCurrentUser] = useState(null);
    const [activeSidebarUsers, setActiveSidebarUsers] = useState([]);




    // 🔹 Load everything from backend
    useEffect(() => {

        const userType = localStorage.getItem("user_type");
        

        const fetchAll = async () => {
            const token = localStorage.getItem("access");
            //  const userType = localStorage.getItem("user_type");
            //  console.log("User type from localStorage:", userType)  

            if (!token) {
                setLoading(false);
                return; // 🚫 Don't call backend without token
            }

            console.log("Token:", token)
            try {
                const jobsRes = await api.get("/jobs/");
                const savedRes = await api.get("/jobs/saved/");
                const appliedRes = await api.get("/jobs/applied/");

                setJobs(jobsRes.data);
                setSavedJobs(savedRes.data);     // backend saved objects
                setAppliedJobs(appliedRes.data);

                //     const userType = localStorage.getItem("user_type");
                // console.log("User type from localStorage:", userType)   

                if (userType === 'jobseeker') {
                    // Fetch the logged-in jobseeker profile
                    const currentUserRes = await api.get("/profile/jobseeker/");
                    setCurrentUser(currentUserRes.data);
                    setAlluser([]); // Jobseekers don't need to see other users

                } else if (userType === 'employer') {
                    console.log("User type from localStorage:", userType)
                    // CORRECTED: Fetch ALL jobseekers using the jobseekers endpoint
                    const allJobseekersRes = await api.get("/jobseekers/");
                    console.log("All jobseekers response:", allJobseekersRes.data);

                    // Handle the response properly
                    if (Array.isArray(allJobseekersRes.data)) {
                        setAlluser(allJobseekersRes.data);
                    } else if (allJobseekersRes.data && allJobseekersRes.data.results) {
                        // If paginated
                        setAlluser(allJobseekersRes.data.results);
                    } else {
                        setAlluser([]);
                    }

                    // Fetch employer profile
                    const employerRes = await api.get("/profile/employer/");
                    setCurrentUser(employerRes.data);
                }


                // backend applied objects
            } catch (err) {
                console.error("Error loading jobs data", err);

                // 401 error వస్తే - redirect to login
                if (err.response?.status === 401) {
                    localStorage.clear();
                    window.location.href = "/login";
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);







    // Using Id to Toggle Menu in Notification Window
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Chats/messages between Employer and Jobseeker 1:1;
    const [chats, setChats] = useState([
        {
            id: 1,
            name: "Employer",
            role: "employer",
            messages: []
        },
        {
            id: 2,
            name: "jobseeker",
            role: "jobseeker",
            messages: []
        }
    ]);

    // Toggle End Conversation Logic In Employer Chat Window
    const [isChatEnded, setIsChatEnded] = useState(false);



    // NotificationData previously passed from AfterLoginLanding page
    // const [notificationsData, setNotificationsData] = useState([{
    //     id: Date.now(),
    //     text: "Welcome to Job Portal",
    //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //     isRead: false,
    // }]);

    // // New Messages Notification Logic
    // const [showNotification, setShowNotification] = useState(false);

    // // to add NewNotification in NotificationData 
    // const addNotification = (text) => {
    //     const newNotif = {
    //         id: Date.now(),
    //         text: text,
    //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //         isRead: false
    //     };
    //     setNotificationsData(prev => [newNotif, ...prev]);
    // };


    // const getFormattedDate = () => {
    //     return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    // };

    // ADD NOTIFICATION FUNCTIONS:
    const addNotification = async (text) => {
        try {
            // If you have a notifications endpoint
            // const response = await api.post("/notifications/", { text });
            // setNotificationsData(prev => [response.data, ...prev]);

            // Or just do local notification for now
            const newNotif = {
                id: Date.now(),
                text: text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isRead: false
            };
            setNotificationsData(prev => [newNotif, ...prev]);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
        } catch (err) {
            console.error("Error adding notification:", err);
        }
    };

    const markNotificationRead = async (notificationId) => {
        try {
            // await api.patch(`/notifications/${notificationId}/read/`);
            setNotificationsData(prev =>
                prev.map(notif =>
                    notif.id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };


    // ADD THIS UTILITY FUNCTION:
    const getFormattedDate = () => {
        return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };


    // ADD CHAT FUNCTIONS:
    const fetchChats = async () => {
        try {
            const response = await api.get("/chat/conversations/");
            setChats(response.data);
        } catch (err) {
            console.error("Error fetching chats:", err);
        }
    };

    const sendMessage = async (conversationId, content) => {
        try {
            const response = await api.post("/chat/messages/send/", {
                conversation_id: conversationId,
                content
            });

            setChats(prev => prev.map(chat =>
                chat.id === conversationId
                    ? { ...chat, messages: [...(chat.messages || []), response.data] }
                    : chat
            ));

            return { success: true, data: response.data };
        } catch (err) {
            console.error("Error sending message:", err);
            return { success: false, error: err.response?.data };
        }
    };

    const addChatToSidebar = (userId) => {
        setActiveSidebarUsers(prev =>
            prev.includes(userId) ? prev : [...prev, userId]
        );
    };

















    // 🔹 Check if job saved
    const isJobSaved = (jobId) => {
        return savedJobs.some(item =>
            item.job ? item.job.id === jobId : item.id === jobId
        );
    };

    // 🔹 Check if job applied
    const isJobApplied = (jobId) => {
        const activeApplication = appliedJobs.find(item =>
            (
                item.job
                    ? Number(item.job.id) === Number(jobId)
                    : Number(item.id) === Number(jobId)
            ) &&
            item.status?.toLowerCase() !== "withdrawn"
        );

        return !!activeApplication;
    };

    // 🔹 Save job (Backend integrated)
    const saveJob = async (jobId) => {
        try {
            await api.post("/jobs/save/", { job_id: jobId });

            const savedRes = await api.get("/jobs/saved/");
            setSavedJobs(savedRes.data);


            // Show notification
            addNotification(isJobSaved(jobId) ? "Job saved!" : "Job removed from saved");

            return true;
        } catch (err) {
            // if (err.response?.status === 400) {
            //     return "already";
            // }
            throw err;
        }
    };

    // 🔹 Apply job (Backend integrated)
    const applyForJob = async (jobId, formData) => {
        try {
            await api.post("/jobs/apply/", formData);

            const appliedRes = await api.get("/jobs/applied/");
            setAppliedJobs(appliedRes.data);

            // Update job applicants count in jobs list
            setJobs(prevJobs =>
                prevJobs.map(job =>
                    job.id === jobId
                        ? { ...job, applicants: (job.applicants || 0) + 1 }
                        : job
                )
            );

            addNotification("Successfully applied to job!");

            return true;
        } catch (err) {
            if (err.response?.status === 409) {

                addNotification("You have already applied to this job");
                return "already";
            }
            addNotification("Failed to apply for job");
            throw err;
        }
    };

    // const applyForJob = (originalJob) => {
    //     const newAppliedJob = {
    //         ...originalJob,
    //         appliedDate: `Applied on ${getFormattedDate()}`,
    //         status: { text: 'Hiring in Progress', type: 'progress' },
    //         // other 2 options for Status:
    //         // status= {text: 'Reviewing Application', type: 'reviewing'},
    //         // status= {text: 'Hiring Done', type: 'done'},
    //         applicationStatus: [
    //             { label: 'Application Submitted', sub: "Your profile, resume, and cover letter have successfully entered the company's database, and an acknowledgment has been sent.", status: 'completed' },
    //             { label: 'Resume Screening', sub: "Your resume is currently being reviewed...", status: 'pending' },
    //             { label: 'Recruiter Review', sub: "A hiring manager manually reviews your specific experience...", status: 'pending' },
    //             { label: 'Shortlisted', sub: "You have passed the initial review stages...", status: 'pending' },
    //             { label: 'Interview Called', sub: "The hiring team has officially reached out...", status: 'pending' },
    //         ]
    //     };
    //     setAppliedJobs((prev) => [...prev, newAppliedJob]);
    //     setJobs((prev) => prev.filter((j) => j.id !== originalJob.id));
    //     setSavedJobs((prev) => prev.filter((j) => j.id !== originalJob.id));
    //     alert(`Successfully applied to ${originalJob.title} at ${originalJob.company}!`);
    // };

    // const toggleSaveJob = (originalJob) => {
    //     if (isJobSaved(originalJob.id)) {
    //         setSavedJobs((prev) => prev.filter((j) => j.id !== originalJob.id));
    //     } else {
    //         const newSavedJob = {
    //             ...originalJob,
    //             savedDate: `Saved on ${getFormattedDate()}`
    //         };
    //         setSavedJobs((prev) => [...prev, newSavedJob]);
    //     }
    // };




    // ADD POST JOB FUNCTION (for employers):
    const postJob = async (jobData) => {
        try {
            const response = await api.post("/jobs/create/", jobData);
            setJobs(prev => [response.data, ...prev]);
            addNotification(`Job "${response.data.title}" posted successfully!`);
            return { success: true, data: response.data };
        } catch (err) {
            console.error("Error posting job:", err);
            addNotification("Failed to post job");
            return { success: false, error: err.response?.data };
        }
    };




    return (
        <JobContext.Provider value={{
            jobs,
            appliedJobs,
            setAppliedJobs,
            savedJobs,
            loading,
            chats,
            setChats,
            setJobs,
            onlineStatus,
            setOnlineStatus,
            isJobSaved,
            isJobApplied,
            saveJob,

            applyForJob,
            isChatEnded,
            setIsChatEnded,
            // setNotificationsData,
            //addNotification,
            //notificationsData,
            //showNotification,
            //setShowNotification,
            activeMenuId,
            setActiveMenuId,
            // ADD THESE NEW ITEMS
            notificationsData,
            setNotificationsData,
            showNotification,
            setShowNotification,
            Alluser,
            setAlluser,
            currentUser,
            setCurrentUser,
            activeSidebarUsers,
            setActiveSidebarUsers,

            // ADD THESE NEW FUNCTIONS
            addNotification,
            markNotificationRead,
            fetchChats,
            sendMessage,
            addChatToSidebar,
            postJob,
            getFormattedDate
        }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobs = () => useContext(JobContext);

