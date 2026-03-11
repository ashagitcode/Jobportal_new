import React, { useState, useEffect, useRef } from "react";
import "./Chatbox.css";
import { useJobs } from "../JobContext";
import api from "../api/axios";


//***EMessenger//

export const EMessenger = () => {
  
  const { chats, setChats, isChatEnded, setIsChatEnded, Alluser, activeSidebarUsers, addNotification } = useJobs(); //From JobContext

  const [input, setInput] = useState("");

  const [selectedId, setSelectedId] = useState(null);




  // *** Changed: replaced chats state with conversations loaded from API
  const [conversations, setConversations] = useState([]);
  // *** Changed: replaced activeChat messages with messages loaded from API
  const [messages, setMessages] = useState([]);

  // *** Changed: renamed selectedId to selectedConversationId for clarity
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // const [input, setInput] = useState("");
  // *** Added: loading and error states for network requests
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  
  

  const scrollRef = useRef(null);

//   const toggleChatEnd = () => {
//   setChats(prev => prev.map(chat => 
//     chat.id === selectedId ? { ...chat, isChatEnded: !chat.isChatEnded } : chat
//   ));
// };
//   // Sidebar filter logic 
//   const sidebarDisplayUsers = Alluser.filter(user =>
//     activeSidebarUsers.includes(parseInt(user.id))
//   );

//   // Active chat and user details
//   const activeChat = chats.find(c => parseInt(c.id) === selectedId);

//   const activeUser = Alluser.find(u => parseInt(u.id) === selectedId);

//   // Auto scroll logic
//   useEffect(() => {
//     if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//   }, [activeChat?.messages]);

//   const handleSend = (e) => {
//     e.preventDefault();
//     if (!input.trim() || isChatEnded || !selectedId) return;

//     const employerReply = {
//       id: Date.now(),
//       text: input,
//       sender: "employer",
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     };

//     setChats(prev => prev.map(chat =>
//       chat.id === selectedId ? { ...chat, messages: [...chat.messages, employerReply] } : chat
//     ));

//     if (addNotification) {
//       addNotification(`Employer Sent a Message: ${input}`, selectedId);
//     }

//     setInput("");
//   };




// *** Added: fetch conversations from backend API instead of using context chats
  const fetchConversations = async () => {
    setLoadingConversations(true);
    setError(null);
    try {
      const response = await api.get("/chat/conversations/");
      setConversations(response.data);
    } catch (err) {
      setError("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  // *** Added: fetch messages for the selected conversation from backend API
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    setLoadingMessages(true);
    setError(null);
    try {
      const response = await api.get(`/chat/conversations/${conversationId}/messages/`);
      setMessages(response.data);
    } catch (err) {
      setError("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  // *** Added: On mount, fetch conversations once
  useEffect(() => {
    fetchConversations();
  }, []);

  // *** Added: Fetch messages each time selectedConversationId changes
  useEffect(() => {
    fetchMessages(selectedConversationId);
  }, [selectedConversationId]);

  // *** Same as old: Scroll chat window to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  // *** Changed: handleSend sends message to backend API instead of local state update
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedConversationId) return;

    const messagePayload = {
      conversation: selectedConversationId,
      text: input,
    };

    try {
      const response = await api.post("/chat/messages/send/", messagePayload);
      setMessages((prevMessages) => [...prevMessages, response.data]);

      if (addNotification) {
        addNotification(`Employer Sent a Message: ${input}`, selectedConversationId);
      }

      setInput("");
    } catch (err) {
      setError("Failed to send message");
    }
  };

  // *** Changed: sidebar users filtered based on conversation user ids loaded from API
  const conversationUserIds = conversations.map(
    (conv) => conv.user_id || conv.participant_id
  );
  const sidebarDisplayUsers = Alluser.filter(
    (user) =>
      conversationUserIds.includes(parseInt(user.id)) &&
      activeSidebarUsers.includes(parseInt(user.id))
  );


  return (
    <>
      <div className="messages-container">
        <div className="EChat-Mainsec">
          <div className="E-chat-name">
            <div className="web-sidebar">
              <div className="sidebar-header">
                <h3 style={{ color: "#007bff", textAlign: "center" }}>Active Chats</h3>
              </div>
              {sidebarDisplayUsers.length > 0 ? (
                sidebarDisplayUsers.map(user => (
                  <div
                    key={user.id}
                    className={`sidebar-item ${selectedId === parseInt(user.id) ? 'active' : ''}`}
                    onClick={() => setSelectedId(parseInt(user.id))}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <strong>{user.profile.fullName}</strong>
                      <p style={{ fontSize: '11px', margin: 0 }}>{user.currentDetails?.jobTitle}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', color: '#888', textAlign: 'center' }}>No active chats</div>
              )}
            </div>
          </div>

          <div className="web-main-chat">
            {selectedId ? (
              <>
                <header className="web-chat-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{activeUser?.profile?.fullName}</strong>
                  <button
                    onClick={toggleChatEnd}
                    className={activeChat?.isChatEnded ? "E-Start-Convo-Button" : "E-End-Convo-Button"}
                  >
                    {activeChat?.isChatEnded  ? "RESTART" : "END CHAT"}
                  </button>
                </header>

                <div className="web-chat-window" ref={scrollRef}>
                  {activeChat.messages?.map((m) => (
                    <div key={m.id} className="web-msg-row">
                      <div className={`web-bubble ${m.sender === 'employer' ? 'web-me' : 'web-friend'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                  {activeChat?.isChatEnded && <div className="chat-end-label">--- Conversation Ended ---</div>}
                </div>

                <form className="web-input-bar" onSubmit={handleSend}>
                  <input
                    className="web-text-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={activeChat?.isChatEnded }
                    placeholder="Type a message..."
                  />
                  <button type="submit" className="web-send-button" disabled={activeChat?.isChatEnded}>SEND</button>
                </form>
              </>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888', flexDirection: 'column' }}>
                <h3>Chat Section</h3>
                <p>Connect with a job seeker to start a conversation.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};