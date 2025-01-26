import React, { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConversations, setFilteredConversations] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);

      axiosInstance
        .get(`/api/messages/conversations/${storedUser.id}`)
        .then((response) => {
          setConversations(response.data);
          setFilteredConversations(response.data);
        })
        .catch((error) => console.error("Error fetching conversations:", error));
    }
  }, []);

  useEffect(() => {
    if (currentConversation) {
      socket.emit("joinConversation", currentConversation);

      socket.on("newMessage", (message) => {
        if (message.conversationId === currentConversation) {
          setChatHistory((prev) => [...prev, message]);
        }
      });
    }

    return () => {
      socket.off("newMessage");
    };
  }, [currentConversation]);

  const createOrOpenConversation = useCallback(async (user2Id) => {
    try {
      const response = await axiosInstance.post("/api/messages/conversation", {
        user1Id: user.id,
        user2Id,
      });
      const { conversationId } = response.data;
      setCurrentConversation(conversationId);
      handleConversationClick(conversationId);
    } catch (error) {
      console.error("Error creating/opening conversation:", error);
    }
  }, [user]);

  useEffect(() => {
    if (location.state?.user2Id) {
      createOrOpenConversation(location.state.user2Id);
    }
  }, [location.state, createOrOpenConversation]);

  const handleConversationClick = (conversationId) => {
    setCurrentConversation(conversationId);

    axiosInstance
      .get(`/api/messages/conversation/${conversationId}`)
      .then((response) => setChatHistory(response.data))
      .catch((error) =>
        console.error("Error fetching conversation history:", error)
      );
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && currentConversation) {
      const messageData = {
        conversationId: currentConversation,
        content: newMessage,
      };

      socket.emit("sendMessage", messageData);
      setChatHistory((prev) => [
        ...prev,
        { content: newMessage, createdAt: new Date() },
      ]);
      setNewMessage("");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredConversations(
      conversations.filter((conv) =>
        conv.name.toLowerCase().includes(term)
      )
    );
  };

  return (
    <Layout>
      <div className="messages-container row">
        <div className="conversations-column col-md-4 bg-light border-end">
          <div className="conversations-header d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
            <h5 className="mb-0">Messages</h5>
            <button className="btn btn-primary btn-sm">Filters</button>
          </div>
          <div className="p-3">
            <input
              type="text"
              className="form-control mb-3"
              placeholder="Search conversations"
              value={searchTerm}
              onChange={handleSearch}
            />
            <ul className="list-group">
              {filteredConversations.map((conversation) => (
                <li
                  key={conversation.id}
                  className={`list-group-item list-group-item-action ${
                    currentConversation === conversation.id ? "active" : ""
                  }`}
                  onClick={() => handleConversationClick(conversation.id)}
                >
                  <strong>{conversation.name}</strong>
                  <small className="text-muted d-block">
                    Last message preview
                  </small>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="chat-column col-md-8 d-flex flex-column">
          {currentConversation ? (
            <>
              <div className="chat-header px-3 py-2 bg-light border-bottom">
                <h6 className="mb-0">
                  {
                    conversations.find(
                      (conv) => conv.id === currentConversation
                    )?.name
                  }
                </h6>
              </div>
              <div className="chat-window flex-grow-1 p-3 overflow-auto bg-white">
                {chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`chat-message mb-2 ${
                      message.sender_id === user.id ? "sent" : "received"
                    }`}
                  >
                    <div className={`p-2 rounded ${message.sender_id === user.id ? "bg-primary text-white" : "bg-secondary text-white"}`}>
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
                <button className="btn btn-primary" onClick={handleSendMessage}>
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
    </Layout>
  );
}

export default Messages;
