import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
    //     useEffect(() => {

    //         const userType = localStorage.getItem("user_type");


    //         const fetchAll = async () => {
    //             const token = localStorage.getItem("access");
    //             //  const userType = localStorage.getItem("user_type");
    //             //  console.log("User type from localStorage:", userType)  

    //             if (!token) {
    //                 setLoading(false);
    //                 return; // 🚫 Don't call backend without token
    //             }

    //             console.log("Token:", token)
    //             try {
    //                 const jobsRes = await api.get("/jobs/");
    //                 const savedRes = await api.get("/jobs/saved/");
    //                 const appliedRes = await api.get("/jobs/applied/");

    //                 setJobs(jobsRes.data);
    //                 setSavedJobs(savedRes.data);     // backend saved objects
    //                 setAppliedJobs(appliedRes.data);
    // //-----------------------------------------------
    //                await fetchChats(); 
    // //---------------------------------------------------------
    //                 //     const userType = localStorage.getItem("user_type");
    //                 // console.log("User type from localStorage:", userType)   

    //                 if (userType === 'jobseeker') {
    //                     // Fetch the logged-in jobseeker profile
    //                     const currentUserRes = await api.get("/profile/jobseeker/");
    //                     setCurrentUser(currentUserRes.data);
    //                     setAlluser([]); // Jobseekers don't need to see other users

    //                 } else if (userType === 'employer') {
    //                     console.log("User type from localStorage:", userType)
    //                     // CORRECTED: Fetch ALL jobseekers using the jobseekers endpoint
    //                     const allJobseekersRes = await api.get("/jobseekers/");
    //                     console.log("All jobseekers response:", allJobseekersRes.data);

    //                     // Handle the response properly
    //                     if (Array.isArray(allJobseekersRes.data)) {
    //                         setAlluser(allJobseekersRes.data);
    //                     } else if (allJobseekersRes.data && allJobseekersRes.data.results) {
    //                         // If paginated
    //                         setAlluser(allJobseekersRes.data.results);
    //                     } else {
    //                         setAlluser([]);
    //                     }

    //                     // Fetch employer profile
    //                     const employerRes = await api.get("/profile/employer/");
    //                     setCurrentUser(employerRes.data);
    //                 }


    //                 // backend applied objects
    //             } catch (err) {
    //                 console.error("Error loading jobs data", err);

    //                 // 401 error వస్తే - redirect to login
    //                 if (err.response?.status === 401) {
    //                     localStorage.clear();
    //                     window.location.href = "/login";
    //                 }
    //             } finally {
    //                 setLoading(false);
    //             }
    //         };

    //         fetchAll();
    //     }, []);


    // In JobContext.js - Update the fetchAll function

    useEffect(() => {
        const userType = localStorage.getItem("user_type");

        const fetchAll = async () => {
            const token = localStorage.getItem("access");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const jobsRes = await api.get("jobs/");
                const savedRes = await api.get("jobs/saved/");
                const appliedRes = await api.get("jobs/applied/");

                setJobs(jobsRes.data);
                setSavedJobs(savedRes.data);
                setAppliedJobs(appliedRes.data);

                await fetchChats();

                if (userType === 'jobseeker') {
                    const currentUserRes = await api.get("profile/jobseeker/");
                    setCurrentUser(currentUserRes.data);
                    setAlluser([]);
                } else if (userType === 'employer') {
                    console.log("Fetching jobseekers...");
                    const allJobseekersRes = await api.get("jobseekers/");
                    console.log("Jobseekers response:", allJobseekersRes.data);

                    // Handle the response - it should be an array of JobSeekerProfile objects
                    let jobseekers = [];
                    if (Array.isArray(allJobseekersRes.data)) {
                        jobseekers = allJobseekersRes.data;
                    } else if (allJobseekersRes.data && allJobseekersRes.data.results) {
                        jobseekers = allJobseekersRes.data.results;
                    }

                    // Transform data to have consistent structure
                    const transformedUsers = jobseekers.map(profile => ({
                        ...profile,
                        // Add convenience accessors
                        full_name: profile.full_name || profile.user?.full_name || "Unknown",
                        email: profile.user?.email || "N/A",
                        profile: profile // Keep original profile data
                    }));

                    setAlluser(transformedUsers);

                    // Fetch employer profile
                    const employerRes = await api.get("profile/employer/");
                    setCurrentUser(employerRes.data);
                }
            } catch (err) {
                console.error("Error loading data", err);
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
    // const [chats, setChats] = useState([
    //     {
    //         id: 1,
    //         name: "Employer",
    //         role: "employer",
    //         messages: []
    //     },
    //     {
    //         id: 2,
    //         name: "jobseeker",
    //         role: "jobseeker",
    //         messages: []
    //     }
    // ]); 

    const [chats, setChats] = useState([])

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
    // const fetchChats = async () => {
    //     try {
    //         const response = await api.get("/chat/conversations/");
    //         console.log('chats API response:',response.data);
    //         setChats(response.data);
    //     } catch (err) {
    //         console.error("Error fetching chats:", err);
    //     }
    // };

    // const fetchMessages=async(conversationId)=>{
    //     try{
    //         console.log("fetching messages for:",conversationId);
    //         const res=await api.get(`/chat/conversations/${conversationId}/messages/`);
    //         setChats(prev=>prev.map(chat=>chat.id===conversationId?{...chat,messages:res.data}:chat));
    //     }catch(err){
    //         console.error("Error fetching messages:",err)
    //     }
    // }




    // const sendMessage = async (conversationId, message) => {
    //     try {
    //         const response = await api.post("/chat/messages/send/", {
    //             conversation: conversationId,
    //             content:message
    //         });

    //         setChats(prev => prev.map(chat =>
    //             chat.id === conversationId
    //                 ? { ...chat, messages: [...(chat.messages || []), response.data] }
    //                 : chat
    //         ));

    //         return { success: true, data: response.data };
    //     } catch (err) {
    //         console.error("Error sending message:", err);
    //         return { success: false, error: err.response?.data };
    //     }
    // };



    // const startConversation=async(userId)=>{
    //     try{
    //         const res= await api.post("/chat/employer/initiate/",{jobseeker_id:userId})
    //         console.log("startConversation response:",res)
    //         const conversationId=res.data.conversation_id;

    //         addChatToSidebar(userId)
    //         await fetchChats()




    //         return conversationId;
    //         // navigate(`/Job-portal/employer-chat/${conversationId}`)

    //     }catch(err){
    //         console.log("Error starting conversation:",err)
    //     }

    // }

    // const addChatToSidebar = (userId) => {
    //     setActiveSidebarUsers(prev =>
    //         prev.includes(userId) ? prev : [...prev, userId]
    //     );
    // };

    // In JobContext.js

    // const fetchChats = async () => {
    //     try {
    //         const response = await api.get("/chat/conversations/");
    //         console.log('Chats API response:', response.data);

    //         // Transform the data to include messages array if needed
    //         const chatsWithMessages = response.data.map(chat => ({
    //             ...chat,
    //             messages: chat.messages || [] // Initialize empty messages array
    //         }));

    //         setChats(chatsWithMessages);
    //     } catch (err) {
    //         console.error("Error fetching chats:", err);
    //     }
    // };



    // In JobContext.js
    // const fetchChats = useCallback(async () => {
    //     try {
    //         const response = await api.get("chat/conversations/");
    //         console.log('Chats API response:', response.data);

    //         // Transform the data to include messages array if needed
    //         const chatsWithMessages = response.data.map(chat => ({
    //             ...chat,
    //             messages: chat.messages || []
    //         }));

    //         setChats(chatsWithMessages);
    //         return chatsWithMessages;
    //     } catch (err) {
    //         console.error("Error fetching chats:", err);
    //         throw err;
    //     }
    // }, []); // Empty dependency array   


    // In JobContext.jsx - Update the fetchChats function

const fetchChats = useCallback(async () => {
    try {
        const token = localStorage.getItem('access');
        const userType = localStorage.getItem('user_type');
        const currentUserId = parseInt(localStorage.getItem('user_id'), 10);
        
        console.log("📞 Fetching chats for:", { userType, currentUserId });
        
        const response = await api.get("chat/conversations/");
        console.log('📞 Chats API response:', response.data);

        // Don't filter here - store ALL conversations
        // The filtering should happen in the component based on current user
        const chatsWithMessages = response.data.map(chat => ({
            ...chat,
            messages: chat.messages || []
        }));

        console.log("📞 All conversations stored:", chatsWithMessages.length);
        setChats(chatsWithMessages);
        return chatsWithMessages;
    } catch (err) {
        console.error("🔴 Error fetching chats:", err);
        throw err;
    }
}, []);

    const fetchMessages = async (conversationId) => {
        try {
            console.log("Fetching messages for conversation:", conversationId);
            const res = await api.get(`chat/conversations/${conversationId}/messages/`);
            console.log("Messages response:", res.data);

            // Update the specific conversation with messages
            setChats(prev => prev.map(chat =>
                chat.id === conversationId
                    ? { ...chat, messages: res.data }
                    : chat
            ));

            return res.data;
        } catch (err) {
            console.error("Error fetching messages:", err);
            throw err;
        }
    };

    // const sendMessage = async (conversationId, content) => {
    //     try {
    //         const response = await api.post("chat/messages/send/", {
    //             conversation: conversationId,
    //             content: content
    //         });

    //         console.log("Send message response:", response.data);

    //         // Update the conversation with the new message
    //         setChats(prev => prev.map(chat =>
    //             chat.id === conversationId
    //                 ? {
    //                     ...chat,
    //                     messages: [...(chat.messages || []), response.data],
    //                     last_message: response.data
    //                 }
    //                 : chat
    //         ));

    //         return { success: true, data: response.data };
    //     } catch (err) {
    //         console.error("Error sending message:", err);
    //         return { success: false, error: err.response?.data };
    //     }
    // };

// JobContext.jsx లో ఈ function ని update చేయండి
// const sendMessage = async (conversationId, content) => {
//   try {
//     console.log("📤 Sending message to API:", { conversationId, content });
    
//     const response = await api.post("chat/messages/send/", {
//       conversation: conversationId,
//       content: content
//     });

//     console.log("📥 API Response:", response.data);
//     console.log("📥 Response status:", response.status);

//     // Update the conversation with the new message
//     setChats(prev => {
//       console.log("📥 Previous chats:", prev);
      
//       const updated = prev.map(chat =>
//         chat.id === conversationId
//           ? {
//               ...chat,
//               messages: [...(chat.messages || []), response.data],
//               last_message: response.data
//             }
//           : chat
//       );
      
//       console.log("📥 Updated chats:", updated);
//       return updated;
//     });

//     return { success: true, data: response.data };
//   } catch (err) {
//     console.error("🔴 Error sending message:", err);
//     console.error("🔴 Error response:", err.response?.data);
//     return { success: false, error: err.response?.data };
//   }
// };  

// JobContext.jsx లో sendMessage function ని ఇలా update చేయండి

// JobContext.jsx - Complete sendMessage function

const sendMessage = async (conversationId, content) => {
  try {
    console.log("📤 Sending message to API:", { conversationId, content });
    
    // Get current user ID directly from localStorage
    const userId = parseInt(localStorage.getItem('user_id'), 10);
    console.log("📤 Current User ID from localStorage:", userId);
    
    if (!userId) {
      throw new Error("Current user ID not found in localStorage");
    }
    
    // Find the conversation
    const conversation = chats.find(c => c.id === conversationId);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    
    // Find the other participant (jobseeker)
    const receiver = conversation.participants?.find(p => p.id !== userId);
    
    if (!receiver) {
      console.error("Participants:", conversation.participants);
      throw new Error("Receiver not found in conversation");
    }
    
    console.log("📤 Receiver ID:", receiver.id);
    
    // Send with receiver_id (what backend expects)
    const response = await api.post("chat/messages/send/", {
      receiver_id: receiver.id,  // 👈 This is the fix!
      content: content
    });

    console.log("📥 API Response:", response.data);

    // Update the conversation with the new message
    setChats(prev => prev.map(chat =>
      chat.id === conversationId
        ? { 
            ...chat, 
            messages: [...(chat.messages || []), response.data],
            last_message: response.data 
          }
        : chat
    ));

    return { success: true, data: response.data };
  } catch (err) {
    console.error("🔴 Error sending message:", err);
    console.error("🔴 Error response:", err.response?.data);
    return { success: false, error: err.response?.data };
  }
};

    // const startConversation = async (userId) => {
    //     try {
    //         console.log("Starting conversation with user:", userId);
    //         const res = await api.post("/chat/employer/initiate/", {
    //             jobseeker_id: userId
    //         });

    //         console.log("Start conversation response:", res.data);
    //         const conversationId = res.data.conversation_id;

    //         // Add user to sidebar
    //         setActiveSidebarUsers(prev => 
    //             prev.includes(userId) ? prev : [...prev, userId]
    //         );

    //         // Fetch updated chats
    //         await fetchChats();

    //         return conversationId;
    //     } catch (err) {
    //         console.error("Error starting conversation:", err);
    //         throw err;
    //     }
    // };


    // In JobContext.jsx - update only the startConversation function
    // JobContext.jsx - startConversation function first line lo
    // In JobContext.jsx - update startConversation
    // JobContext.jsx - update startConversation
    const startConversation = useCallback(async (userId, message) => {
        try {
            console.log("startConversation called with:", {
                userId,
                userIdType: typeof userId,
                message
            });

            // ❌ REMOVE this whole block - it's causing the issue
            // // If userId is from Profile (like 3), find the actual User ID
            // let actualUserId = userId;

            // // Check if this ID exists in Alluser and get the user.id
            // const userProfile = Alluser.find(u => u.id === userId);
            // if (userProfile && userProfile.user?.id) {
            //     actualUserId = userProfile.user.id;
            //     console.log("Found user.id from profile:", actualUserId);
            // }

            // ✅ Just use the userId directly (it should already be the correct User ID)
            const jobseekerId = parseInt(userId, 10);
            console.log("Sending jobseeker_id:", jobseekerId);

            // Make sure URL has leading slash
            const res = await api.post("/chat/employer/initiate/", {
                jobseeker_id: jobseekerId,
                message: message
            });

            console.log("API Response:", res.data);
            return res.data.conversation_id;

        } catch (err) {
            console.error("Error response:", err.response?.data);
            throw err;
        }
    }, []); // Remove Alluser dependency

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
            await api.post("jobs/save/", { job_id: jobId });

            const savedRes = await api.get("jobs/saved/");
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
            await api.post("jobs/apply/", formData);

            const appliedRes = await api.get("jobs/applied/");
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
            const response = await api.post("jobs/create/", jobData);
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
            fetchMessages,
            sendMessage,
            startConversation,
            addChatToSidebar,
            postJob,
            getFormattedDate
        }}>
            {children}
        </JobContext.Provider>
    );
};

export const useJobs = () => useContext(JobContext);

