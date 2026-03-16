import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import '../Components-Employer/Chatbox.css';
import { useJobs } from '../JobContext';
import api from '../api/axios';

export const JMessenger = () => {
    
    const { chats, setChats, addNotification, fetchMessages } = useJobs();

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const scrollRef = useRef(null);
    
    // Get current user ID from localStorage
    const currentUserId = useMemo(() => {
        const id = localStorage.getItem('user_id');
        return id ? parseInt(id, 10) : null;
    }, []);

    console.log("🔍 Current User ID:", currentUserId);

    // Get ALL conversations where current user is participant
    const myConversations = useMemo(() => {
        if (!chats || !chats.length || !currentUserId) {
            return [];
        }
        
        return chats.filter(chat => {
            return chat.participants?.some(p => p.id === currentUserId);
        });
    }, [chats, currentUserId]);

    // DEBUG: Log all conversations with their details
    console.log(" ALL CONVERSATIONS:", myConversations.map(c => ({
        id: c.id,
        employer: c.participants?.find(p => p.id !== currentUserId)?.username,
        jobseeker_can_reply: c.jobseeker_can_reply,
        messagesCount: c.messages?.length || 0,
        lastMessage: c.messages?.[c.messages.length - 1]?.content
    })));

    // Set first conversation as selected by default
    useEffect(() => {
        if (myConversations.length > 0 && !selectedConversationId) {
            setSelectedConversationId(myConversations[0].id);
        }
    }, [myConversations, selectedConversationId]);

    // Get selected conversation
    const selectedConversation = useMemo(() => {
        if (!selectedConversationId) return null;
        return myConversations.find(c => c.id === selectedConversationId);
    }, [myConversations, selectedConversationId]);

    // Get the OTHER participant (employer) for selected conversation
    const otherParticipant = useMemo(() => {
        if (!selectedConversation || !currentUserId) return null;
        return selectedConversation.participants?.find(p => p.id !== currentUserId);
    }, [selectedConversation, currentUserId]);

    // Check if jobseeker can reply
    const canReply = useMemo(() => {
        return selectedConversation?.jobseeker_can_reply === true;
    }, [selectedConversation]);

    // DEBUG: Log selected conversation details
    console.log(" SELECTED CONVERSATION:", {
        id: selectedConversation?.id,
        employer: otherParticipant?.username,
        jobseeker_can_reply: selectedConversation?.jobseeker_can_reply,
        canReply: canReply,
        messages: selectedConversation?.messages?.length
    });

    // Load messages when conversation changes
    useEffect(() => {
        if (!selectedConversation?.id) return;
        
        const loadMessages = async () => {
            const hasMessages = selectedConversation.messages && selectedConversation.messages.length > 0;
            
            if (!hasMessages) {
                setLoading(true);
                try {
                    await fetchMessages(selectedConversation.id);
                } finally {
                    setLoading(false);
                }
            }
        };
        
        loadMessages();
    }, [selectedConversation?.id, fetchMessages]);

    // Manual refresh function to check backend status
    const checkConversationStatus = async () => {
        if (!selectedConversation?.id) return;
        
        try {
            console.log("🔍 Checking conversation status from backend...");
            const response = await api.get(`/chat/conversations/${selectedConversation.id}/`);
            console.log("📥 Backend conversation data:", response.data);
            
            if (response.data.jobseeker_can_reply !== selectedConversation.jobseeker_can_reply) {
                console.log("🔄 Updating jobseeker_can_reply from", selectedConversation.jobseeker_can_reply, "to", response.data.jobseeker_can_reply);
                
                setChats(prev => prev.map(chat => 
                    chat.id === selectedConversation.id
                        ? { ...chat, jobseeker_can_reply: response.data.jobseeker_can_reply }
                        : chat
                ));
            }
        } catch (error) {
            console.error("Error checking status:", error);
        }
    };

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedConversation?.messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        
        if (!input.trim() || !canReply || !selectedConversation || !otherParticipant || sending) return;

        const messageText = input;
        setInput("");
        setSending(true);

        // Optimistic update
        const tempMessage = {
            id: `temp-${Date.now()}`,
            content: messageText,
            sender: currentUserId,
            timestamp: new Date().toISOString(),
            is_temp: true
        };

        setChats(prev => prev.map(chat => 
            chat.id === selectedConversation.id
                ? { 
                    ...chat, 
                    messages: [...(chat.messages || []), tempMessage]
                  }
                : chat
        ));

        try {
            console.log("📤 Sending message to:", otherParticipant.username);
            const response = await api.post("/chat/messages/send/", {
                receiver_id: otherParticipant.id,
                content: messageText
            });

            console.log("📥 Message sent successfully:", response.data);

            // Replace temp message with real one
            setChats(prev => prev.map(chat => 
                chat.id === selectedConversation.id
                    ? { 
                        ...chat, 
                        messages: chat.messages.map(m => 
                            m.id === tempMessage.id ? response.data : m
                        )
                      }
                    : chat
            ));

            // After sending message, check if status changed
            setTimeout(checkConversationStatus, 500);

        } catch (error) {
            console.error(" Failed to send message:", error);
            
            setChats(prev => prev.map(chat => 
                chat.id === selectedConversation.id
                    ? { 
                        ...chat, 
                        messages: chat.messages.filter(m => m.id !== tempMessage.id)
                      }
                    : chat
            ));
            
            alert(error.response?.data?.error || "Failed to send message");
        } finally {
            setSending(false);
        }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return "";
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const getEmployerName = (conversation) => {
        if (!conversation || !currentUserId) return "Employer";
        const employer = conversation.participants?.find(p => p.id !== currentUserId);
        return employer?.username || employer?.full_name || "Employer";
    };

    const getLastMessage = (conversation) => {
        if (!conversation.messages || conversation.messages.length === 0) {
            return "No messages yet";
        }
        const lastMsg = conversation.messages[conversation.messages.length - 1];
        return lastMsg.content?.length > 30 
            ? lastMsg.content.substring(0, 30) + "..." 
            : lastMsg.content;
    };

    // Add manual refresh button for testing
    const handleManualRefresh = () => {
        checkConversationStatus();
    };

    if (!myConversations.length) {
        return (
            <div className="messages-container">
                <div className="EChat-Mainsec">
                    <div style={{ 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center", 
                        height: "100vh"
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <h3>No Messages</h3>
                            <p>Waiting for employers to start conversations.</p>
                        </div>
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
                            <h2 style={{ color: "#007bff", textAlign: "center" }}>
                                Messages ({myConversations.length})
                            </h2>
                        </div>
                        
                        {myConversations.map(conversation => {
                            const isSelected = selectedConversationId === conversation.id;
                            const employerName = getEmployerName(conversation);
                            const lastMessage = getLastMessage(conversation);
                            
                            return (
                                <div
                                    key={conversation.id}
                                    className={`sidebar-item ${isSelected ? 'active' : ''}`}
                                    onClick={() => {
                                        console.log("📱 Selected:", employerName);
                                        setSelectedConversationId(conversation.id);
                                    }}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                                        <strong>{employerName}</strong>
                                        <p style={{ fontSize: '11px', margin: '2px 0', color: '#666' }}>
                                            {lastMessage}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <small style={{ fontSize: '9px', color: '#999' }}>
                                                {conversation.jobseeker_can_reply ? '● Active' : '○ Waiting'}
                                            </small>
                                            <small style={{ fontSize: '9px', color: '#999' }}>
                                                {conversation.messages?.length || 0} msgs
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* Manual refresh button */}
                        {/* <button 
                            onClick={handleManualRefresh}
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '10px',
                                backgroundColor: '#f0f0f0',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Refresh Status
                        </button> */}
                    </div>
                </div>

                {/* Right Chat Area */}
                <div className="web-main-chat">
                    {selectedConversation ? (
                        <>
                            {/* <header className="web-chat-header" style={{ 
                                padding: "15px 20px",
                                borderBottom: "1px solid #eee",
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <strong>{getEmployerName(selectedConversation)}</strong>
                                    <p style={{ 
                                        fontSize: '12px', 
                                        margin: '5px 0 0', 
                                        color: canReply ? '#28a745' : '#ffc107'
                                    }}>
                                        Status: {canReply ? 'You can reply' : 'Waiting for employer'}
                                    </p>
                                    <p style={{ fontSize: '10px', color: '#999' }}>
                                        jobseeker_can_reply: {String(selectedConversation.jobseeker_can_reply)}
                                    </p>
                                </div>
                                <button onClick={handleManualRefresh}>
                                    Refresh
                                </button>
                            </header> */}    

                            <header className="web-chat-header" style={{ 
    padding: "15px 20px",
    borderBottom: "1px solid #eee"
}}>
    <div>
        <strong>{getEmployerName(selectedConversation)}</strong>
        <p style={{ 
            fontSize: '12px', 
            margin: '5px 0 0', 
            color: canReply ? '#28a745' : '#ffc107'
        }}>
            {canReply ? 'You can reply' : 'Waiting for employer'}
        </p>
    </div>
</header>

                            <div className="web-chat-window" ref={scrollRef}>
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        Loading messages...
                                    </div>
                                ) : selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                                    selectedConversation.messages.map((msg) => {
                                        const isMe = msg.sender === currentUserId || msg.sender?.id === currentUserId;
                                        return (
                                            <div key={msg.id} className="web-msg-row">
                                                <div className={`web-bubble ${isMe ? 'web-me' : 'web-friend'}`}>
                                                    {msg.content}
                                                    <div style={{ 
                                                        fontSize: '10px', 
                                                        opacity: 0.7, 
                                                        marginTop: '4px'
                                                    }}>
                                                        {formatTime(msg.timestamp || msg.created_at)}
                                                        {!isMe && msg.sender && (
                                                            <span> • from employer</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                        No messages yet. Waiting for employer...
                                    </div>
                                )}
                            </div>

                            <form className="web-input-bar" onSubmit={handleSend}>
                                <input 
                                    className="web-text-input" 
                                    value={input} 
                                    disabled={!canReply || sending}  
                                    onChange={(e) => setInput(e.target.value)} 
                                    placeholder={
                                        !canReply 
                                            ? "Waiting for employer to reply..." 
                                            : sending 
                                                ? "Sending..." 
                                                : "Reply to employer..."
                                    } 
                                />
                                <button 
                                    type="submit" 
                                    disabled={!canReply || !input.trim() || sending} 
                                    className="web-send-button"
                                >
                                    {sending ? "SENDING..." : "SEND"}
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
                            <h3>Select a conversation</h3>
                            <p>Choose a chat from the sidebar to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JMessenger;