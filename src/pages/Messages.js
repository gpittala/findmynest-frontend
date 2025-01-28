import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "../styles/Messages.css";
import Layout from "../components/Layout";
import axiosInstance from "../api/axiosConfig";

const socket = io("http://localhost:9000");

function Messages() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUserName, setTargetUserName] = useState("");

  const chatWindowRef = useRef(null); // Reference to the chat window

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);
      fetchConversations(storedUser.id);
    }
  }, []);

  const fetchConversations = async (userId) => {
    try {
      const response = await axiosInstance.get(`/api/messages/conversations/${userId}`);
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const handleConversationClick = async (conversation) => {
    setCurrentConversation(conversation.conversation_id);
    setTargetUserName(conversation.other_user_name);

    try {
      const response = await axiosInstance.get(
        `/api/messages/conversation/${conversation.conversation_id}`
      );
      setChatHistory(response.data);
      socket.emit("joinConversation", conversation.conversation_id);
      scrollToBottom(); // Scroll to bottom after loading messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentConversation) {
      const messageData = {
        conversationId: currentConversation,
        senderId: user.id,
        content: newMessage,
      };

      try {
        await axiosInstance.post("/api/messages", messageData);
        setChatHistory((prev) => [
          ...prev,
          { ...messageData, created_at: new Date().toISOString() },
        ]);
        socket.emit("sendMessage", messageData);
        setNewMessage("");
        scrollToBottom(); // Scroll to bottom after sending a message
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (message.conversationId === currentConversation) {
        setChatHistory((prev) => [...prev, message]);
        scrollToBottom(); // Scroll to bottom on receiving a new message
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [currentConversation]);

  const scrollToBottom = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom(); // Ensure messages are scrolled to the bottom on mount
  }, [chatHistory]);

  return (
    <Layout>
      <div className="messages-page">
        <div className="messages-container row mx-0">
          {/* Conversations Column */}
          <div className="conversations-column col-md-4 bg-light border-end">
            <div className="conversations-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
              <h5 className="mb-0">Messages</h5>
            </div>
            <div className="p-3 overflow-auto">
              <ul className="list-group">
                {conversations.map((conversation) => (
                  <li
                    key={conversation.conversation_id}
                    className={`list-group-item list-group-item-action ${
                      currentConversation === conversation.conversation_id
                        ? "active"
                        : ""
                    }`}
                    onClick={() => handleConversationClick(conversation)}
                  >
                    <strong>{conversation.other_user_name}</strong>
                    <small className="text-muted d-block text-truncate">
                      {conversation.last_message || ""}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chat Column */}
          <div className="chat-column col-md-8 d-flex flex-column">
            {currentConversation ? (
              <>
                <div className="chat-header px-3 py-2 bg-light border-bottom">
                  <h6 className="mb-0 fw-bold">{targetUserName}</h6>
                </div>
                <div
                  className="chat-window flex-grow-1 p-3 overflow-auto bg-white"
                  ref={chatWindowRef}
                >
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`chat-message mb-2 ${
                        user.id === message.sender_id ? "sent" : "received"
                      }`}
                    >
                      <div
                        className={`p-2 rounded ${
                          user.id === message.sender_id
                            ? "bg-primary text-white"
                            : "bg-secondary text-white"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="chat-input d-flex p-3 bg-light border-top">
                  <input
                    type="text"
                    className="form-control me-2"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center mt-5 text-muted">
                Select a conversation to start chatting.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Messages;
