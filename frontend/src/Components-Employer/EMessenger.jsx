import React, { useState, useEffect, useRef, useMemo } from "react";
import "./Chatbox.css";
import { useJobs } from "../JobContext";
import api from '../api/axios';

export const EMessenger = () => {
  const {
    chats,
    setChats,
    Alluser,
    sendMessage,
    fetchMessages,
    fetchChats,
    addNotification,
    currentUser,
    activeSidebarUsers  // FIX: From hardcoded version
  } = useJobs();

  const [input, setInput] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  //  FIX: Add isChatEnded state from hardcoded version
  const [isChatEnded, setIsChatEnded] = useState({}); // Object to track per conversation
  const scrollRef = useRef(null);

  // Get current user ID
  const currentUserId = useMemo(() => {
    const id = localStorage.getItem('user_id');
    return id ? parseInt(id, 10) : null;
  }, []);

  // Fetch chats only once
  useEffect(() => {
    let isMounted = true;

    const loadChats = async () => {
      if (!initialLoadDone) {
        setSidebarLoading(true);
        try {
          await fetchChats();
          if (isMounted) setInitialLoadDone(true);
        } catch (error) {
          console.error("Error loading chats:", error);
        } finally {
          if (isMounted) setSidebarLoading(false);
        }
      }
    };

    loadChats();
    return () => { isMounted = false; };
  }, [fetchChats, initialLoadDone]);

  //  FIX: Updated mapping logic from integrated version
  const userConversationMap = useMemo(() => {
    if (!chats || !chats.length || !currentUserId) return {};

    const mapping = {};
    chats.forEach(chat => {
      const otherParticipant = chat.participants?.find(p => p.id !== currentUserId);
      if (otherParticipant) {
        mapping[otherParticipant.id] = chat.id;
      }
    });
    return mapping;
  }, [chats, currentUserId]);

  //  FIX: Updated sidebar users logic - combined both versions
  const sidebarUsers = useMemo(() => {
    if (!Alluser || !Alluser.length || !currentUserId) return [];

    // From integrated version - get users with chats
    const userIdsWithChats = Object.keys(userConversationMap).map(Number);

    // From hardcoded version - filter by activeSidebarUsers
    return Alluser.filter(user => {
      const actualUserId = user.user?.id || user.id;
      const hasChat = actualUserId && userIdsWithChats.includes(actualUserId);

      // Include if either has chat OR is in activeSidebarUsers
      return hasChat || activeSidebarUsers?.includes(parseInt(user.id));
    });
  }, [Alluser, userConversationMap, currentUserId, activeSidebarUsers]);

  // Get active conversation
  const activeConversationId = useMemo(() => {
    if (!selectedUserId || !Alluser || !userConversationMap) return null;

    const selectedUser = Alluser.find(u => u.id === selectedUserId);
    const actualUserId = selectedUser?.user?.id || selectedUser?.id;

    return actualUserId ? userConversationMap[actualUserId] : null;
  }, [selectedUserId, Alluser, userConversationMap]);

  const activeConversation = useMemo(() => {
    if (!activeConversationId || !chats) return null;
    return chats.find(c => c.id === activeConversationId);
  }, [activeConversationId, chats]);

  const selectedUser = useMemo(() => {
    if (!selectedUserId || !Alluser) return null;
    return Alluser.find(u => u.id === selectedUserId);
  }, [selectedUserId, Alluser]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages]);

  // Load messages
  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      if (!selectedUserId || !activeConversationId) return;

      const conversation = chats.find(c => c.id === activeConversationId);

      if (!conversation?.messages || conversation.messages.length === 0) {
        setLoading(true);
        try {
          await fetchMessages(activeConversationId);
        } catch (error) {
          console.error("Error loading messages:", error);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    loadMessages();

    return () => { isMounted = false; };
  }, [selectedUserId, activeConversationId, chats, fetchMessages]);

  // Poll for new messages
  useEffect(() => {
    if (!activeConversationId) return;

    let pollCount = 0;

    const pollNewMessages = async () => {
      pollCount++;
      // console.log(`🔄 Poll #${pollCount} for conversation ${activeConversationId}`);

      try {
        const response = await api.get(`/chat/conversations/${activeConversationId}/messages/`);
        const serverMessages = response.data;
        const currentMessages = activeConversation?.messages || [];

        const serverIds = serverMessages.map(m => m.id);
        const clientIds = currentMessages.map(m => m.id);

        const newMessages = serverMessages.filter(m => !clientIds.includes(m.id));

        if (newMessages.length > 0) {
          console.log(" New messages detected:", newMessages);

          setChats(prevChats => prevChats.map(chat =>
            chat.id === activeConversationId
              ? { ...chat, messages: serverMessages }
              : chat
          ));
        }
      } catch (error) {
        console.error(' Error polling messages:', error);
      }
    };

    const interval = setInterval(pollNewMessages, 3000);
    return () => clearInterval(interval);
  }, [activeConversationId, activeConversation?.messages, setChats]);

  //  FIX: Toggle chat end function from hardcoded version
  const toggleChatEnd = () => {
    setIsChatEnded(prev => ({
      ...prev,
      [activeConversationId]: !prev[activeConversationId]
    }));

    // Optional: Update backend
    // api.post(`/chat/conversations/${activeConversationId}/toggle-end/`);
  };

  const handleSelectUser = (userId) => {
    setSelectedUserId(userId);
  };

  //  FIX: Updated handleSend with hardcoded version features
  const handleSend = async (e) => {
    e.preventDefault();

    // Check if chat is ended
    if (isChatEnded[activeConversationId]) {
      alert("This conversation has ended. Please restart to send messages.");
      return;
    }

    if (!input.trim() || !activeConversationId) return;

    const messageText = input;
    console.log(" Sending message:", messageText);

    setInput("");

    try {
      const result = await sendMessage(activeConversationId, messageText);
      console.log(" Send result:", result);

      //  FIX: Add notification from hardcoded version
      if (result.success && addNotification) {
        const employerName = currentUser?.full_name || currentUser?.user?.full_name || "Employer";
        addNotification(`New message from ${employerName}`);
      }

    } catch (error) {
      console.error("Failed to send message:", error);
      alert(error.response?.data?.error || "Failed to send message");
    }
  };

  //  FIX: Get employer details from currentUser (like hardcoded currentEmployer)
  const getEmployerName = () => {
    return currentUser?.full_name || currentUser?.user?.full_name || "Employer";
  };

  const getParticipantName = (user) => {
    if (!user) return "Unknown";
    return user.full_name || user.user?.full_name || user.username || "User";
  };

  const getParticipantJobTitle = (user) => {
    if (!user) return "Job Seeker";
    return user.current_job_title || "Job Seeker";
  };

  // Manual refresh function
  // const refreshMessages = async () => {
  //   if (!activeConversationId) return;

  //   try {
  //     console.log("🔄 Manual refresh...");
  //     const response = await api.get(`/chat/conversations/${activeConversationId}/messages/`);

  //     setChats(prevChats => prevChats.map(chat =>
  //       chat.id === activeConversationId
  //         ? { ...chat, messages: response.data }
  //         : chat
  //     ));

  //     console.log(" Manual refresh complete");
  //   } catch (error) {
  //     console.error(" Refresh failed:", error);
  //   }
  // };

  if (sidebarLoading && !initialLoadDone) {
    return (
      <div className="messages-container">
        <div className="EChat-Mainsec">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            Loading conversations...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="EChat-Mainsec">
        {/* Left Sidebar */}
        <div className="E-chat-name">
          <div className="web-sidebar">
            <div className="sidebar-header">
              <h3 style={{ color: "#007bff", textAlign: "center" }}>
                Active Chats ({sidebarUsers.length})
              </h3>
            </div>

            {sidebarUsers.length > 0 ? (
              sidebarUsers.map(user => {
                const isSelected = selectedUserId === user.id;
                const actualUserId = user.user?.id || user.id;
                const conversationId = actualUserId ? userConversationMap[actualUserId] : null;
                const conversation = chats.find(c => c.id === conversationId);

                return (
                  <div
                    key={user.id}
                    className={`sidebar-item ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectUser(user.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                      <strong>{getParticipantName(user)}</strong>
                      <p style={{ fontSize: '11px', margin: 0, color: '#666' }}>
                        {getParticipantJobTitle(user)}
                      </p>
                      {conversation && (
                        <small style={{
                          fontSize: '9px',
                          marginTop: '2px',
                          color: conversation.jobseeker_can_reply ? '#28a745' : '#ffc107'
                        }}>
                          {conversation.jobseeker_can_reply ? '● Active' : '○ Waiting for reply'}
                        </small>
                      )}
                      {/*  FIX: Show chat ended status */}
                      {isChatEnded[conversationId] && (
                        <small style={{ fontSize: '9px', color: '#dc3545' }}>
                          ● Chat Ended
                        </small>
                      )}
                    </div>

                    {conversation?.unread_count > 0 && (
                      <span className="unread-badge">{conversation.unread_count}</span>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>
                No active chats
                <br />
                <small>Go to Find Talent to start a conversation</small>
              </div>
            )}
          </div>
        </div>

        {/* Right Chat Area */}
        <div className="web-main-chat">
          {selectedUser ? (
            <>
              {/*  FIX: Header with END CHAT button from hardcoded version */}
              <header className="web-chat-header" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 20px",
                borderBottom: "1px solid #eee"
              }}>
                <div>
                  <strong>{getParticipantName(selectedUser)}</strong>
                  <p style={{ fontSize: '12px', margin: '5px 0 0', color: '#666' }}>
                    {getParticipantJobTitle(selectedUser)}
                  </p>
                  {activeConversation && (
                    <p style={{
                      fontSize: '11px',
                      margin: '5px 0 0',
                      color: activeConversation.jobseeker_can_reply ? '#28a745' : '#ffc107'
                    }}>
                      Status: {activeConversation.jobseeker_can_reply ? 'Active' : 'Waiting for reply'}
                    </p>
                  )}
                </div>

                {/*  FIX: END CHAT button from hardcoded version */}
                <button
                  onClick={toggleChatEnd}
                  className={isChatEnded[activeConversationId] ? "E-Start-Convo-Button" : "E-End-Convo-Button"}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '600',
                    backgroundColor: isChatEnded[activeConversationId] ? '#28a745' : '#dc3545',
                    color: 'white'
                  }}
                >
                  {isChatEnded[activeConversationId] ? "RESTART" : "END CHAT"}
                </button>

                {/* Temporary refresh button */}
                {/* <button
                  onClick={refreshMessages}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginLeft: '10px'
                  }}
                >
                  Refresh
                </button> */}
              </header>

              <div className="web-chat-window" ref={scrollRef}>
                {loading ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    Loading messages...
                  </div>
                ) : activeConversation?.messages && activeConversation.messages.length > 0 ? (
                  activeConversation.messages.map((message) => {
                    const isEmployer = message.sender === currentUserId ||
                      message.sender?.id === currentUserId;
                    return (
                      <div key={message.id} className="web-msg-row">
                        <div className={`web-bubble ${isEmployer ? 'web-me' : 'web-friend'}`}>
                          {message.content}
                          <span className="message-time">
                            {new Date(message.timestamp || message.created_at).toLocaleTimeString([], {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                    No messages yet. Start the conversation!
                  </div>
                )}

                {/*  FIX: Chat ended message from hardcoded version */}
                {isChatEnded[activeConversationId] && (
                  <div style={{
                    textAlign: "center",
                    padding: "10px",
                    color: "#dc3545",
                    fontSize: "12px",
                    borderTop: "1px dashed #dc3545",
                    marginTop: "10px"
                  }}>
                    --- Conversation Ended ---
                  </div>
                )}
              </div>

              {/*  FIX: Input bar with disabled state when chat ended */}
              {/* <form className="web-input-bar" onSubmit={handleSend}>
                <input
                  className="web-text-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isChatEnded[activeConversationId] || !activeConversation?.jobseeker_can_reply}
                  placeholder={
                    isChatEnded[activeConversationId] 
                      ? "Chat ended. Click RESTART to continue." 
                      : !activeConversation?.jobseeker_can_reply 
                        ? "Waiting for jobseeker to reply..." 
                        : "Type a message..."
                  }
                />
                <button 
                  type="submit" 
                  className="web-send-button" 
                  disabled={!input.trim() || isChatEnded[activeConversationId] || !activeConversation?.jobseeker_can_reply}
                  style={{
                    backgroundColor: !input.trim() || isChatEnded[activeConversationId] || !activeConversation?.jobseeker_can_reply ? '#ccc' : '#007bff'
                  }}
                >
                  SEND
                </button>
              </form> */}

              <form className="web-input-bar" onSubmit={handleSend}>
                <input
                  className="web-text-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isChatEnded[activeConversationId]}  // Only disable if chat ended
                  placeholder={
                    isChatEnded[activeConversationId]
                      ? "Chat ended. Click RESTART to continue."
                      : "Type a message..."
                  }
                />
                <button
                  type="submit"
                  className="web-send-button"
                  disabled={!input.trim() || isChatEnded[activeConversationId]}
                  style={{
                    backgroundColor: !input.trim() || isChatEnded[activeConversationId] ? '#ccc' : '#007bff'
                  }}
                >
                  SEND
                </button>
              </form>
            </>
          ) : (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              color: '#888',
              flexDirection: 'column'
            }}>
              <h3>Chat Section</h3>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMessenger;