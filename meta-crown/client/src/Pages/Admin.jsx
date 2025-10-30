import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import "../Styles/Admin.css";

const Admin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAndFetchMessages = async () => {
      const userId = localStorage.getItem("user_id");
      const isAdmin = localStorage.getItem("is_admin") === "true";
      
      if (!userId || !isAdmin) {
        // Not authorized, redirect to dashboard
        navigate("/dashboard");
        return;
      }

      setIsAuthorized(true);

      try {
        const response = await fetch(`${API_BASE}/api/admin/messages?user_id=${userId}`);
        if (response.ok) {
          const messagesData = await response.json();
          setMessages(messagesData);
        } else if (response.status === 403) {
          // Not authorized
          navigate("/dashboard");
          return;
        } else {
          console.error("Failed to fetch messages:", response.status);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetchMessages();
  }, [navigate]);

  const handleDeleteMessage = async (messageId) => {
    // Confirmation dialog to prevent accidental deletion
    if (!window.confirm("Are you sure you want to mark this message as read? This will delete it permanently from the database.")) {
      return;
    }

    const userId = localStorage.getItem("user_id");
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: parseInt(userId) }),
      });

      if (response.ok) {
        // Remove the message from local state immediately
        setMessages(prevMessages =>
          prevMessages.filter(msg => msg.message_id !== messageId)
        );
        // Close the message details panel if this message was being viewed
        setSelectedMessage(null);
      } else {
        console.error("Failed to delete message:", response.status);
        alert("Failed to delete message. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Error deleting message. Please try again.");
    }
  };

  const handleMarkAsReadOnly = async (messageId) => {
    const userId = localStorage.getItem("user_id");
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/messages/${messageId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: parseInt(userId) }),
      });

      if (response.ok) {
        // Update local state to mark as read
        setMessages(prevMessages =>
          prevMessages.map(msg =>
            msg.message_id === messageId ? { ...msg, is_read: true } : msg
          )
        );
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isAuthorized || loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          {loading ? "Loading..." : "Checking authorization..."}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1>Admin Dashboard</h1>
        <h2>Contact Messages ({messages.length})</h2>
        
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No messages found.</p>
          </div>
        ) : (
          <div className="messages-container">
            <div className="messages-list">
              {messages.map((message) => (
                <div
                  key={message.message_id}
                  className={`message-item ${!message.is_read ? 'unread' : ''} ${
                    selectedMessage?.message_id === message.message_id ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setSelectedMessage(message);
                    // Mark as read when opening if not already read
                    if (!message.is_read) {
                      handleMarkAsReadOnly(message.message_id);
                    }
                  }}
                >
                  <div className="message-header">
                    <div className="message-from">
                      <strong>{message.name}</strong>
                      <span className="message-email">({message.email})</span>
                    </div>
                    <div className="message-date">{formatDate(message.created_at)}</div>
                    {!message.is_read && <div className="unread-indicator"></div>}
                  </div>
                  <div className="message-subject">{message.subject}</div>
                  <div className="message-preview">
                    {message.message.substring(0, 100)}
                    {message.message.length > 100 && "..."}
                  </div>
                </div>
              ))}
            </div>

            {selectedMessage && (
              <div className="message-details">
                <div className="message-details-header">
                  <h3>{selectedMessage.subject}</h3>
                  <div className="message-actions">
                    <button
                      className="mark-read-btn"
                      onClick={() => handleDeleteMessage(selectedMessage.message_id)}
                    >
                      Mark as Read
                    </button>
                    <button
                      className="close-btn"
                      onClick={() => setSelectedMessage(null)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
                
                <div className="message-details-info">
                  <div className="info-row">
                    <strong>From:</strong> {selectedMessage.name} ({selectedMessage.email})
                  </div>
                  <div className="info-row">
                    <strong>Date:</strong> {formatDate(selectedMessage.created_at)}
                  </div>
                  <div className="info-row">
                    <strong>Status:</strong> {selectedMessage.is_read ? 'Read' : 'New'}
                  </div>
                </div>
                
                <div className="message-details-content">
                  <h4>Message:</h4>
                  <div className="message-text">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;