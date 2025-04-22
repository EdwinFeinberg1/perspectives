"use client";

import React, { useState, useEffect } from "react";
import { useChat } from "ai/react";
import { Message } from "ai";
import Bubble from "./Bubble";
import LoadingBubble from "./LoadingBubble";
import PromptSuggestionRow from "./PromptSuggestionRow";
import { useRouter } from "next/navigation";

interface ChatbotProps {
  initialMessages?: Message[];
}

const FullChat: React.FC<ChatbotProps> = ({ initialMessages }) => {
  const router = useRouter();
  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat();
  const [selectedModel, setSelectedModel] = useState<string>("RabbiGPT");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      initialMessages.forEach((msg) => append(msg));
    }
  }, [initialMessages]);

  const handlePromptClick = (promptText: string) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    append(msg);
  };

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setShowDropdown(false);
  };

  const handleNewChat = () => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
    router.push("/chats");
  };

  return (
    <div className="chatbot">
      <div className="menubar">
        <div className="menubar-content">
          <div className="app-branding">
            <span className="app-name">Perspectives</span>
          </div>
          <div className="model-selector">
            <button
              className="model-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedModel}
            </button>
            {showDropdown && (
              <div className="model-dropdown">
                <button
                  className={`dropdown-item ${
                    selectedModel === "RabbiGPT" ? "active" : ""
                  }`}
                  onClick={() => handleModelSelect("RabbiGPT")}
                >
                  RabbiGPT
                </button>
                <button
                  className={`dropdown-item ${
                    selectedModel === "BuddaGPT" ? "active" : ""
                  }`}
                  onClick={() => handleModelSelect("BuddaGPT")}
                >
                  BuddaGPT
                </button>
                <button
                  className={`dropdown-item ${
                    selectedModel === "ImamGPT" ? "active" : ""
                  }`}
                  onClick={() => handleModelSelect("ImamGPT")}
                >
                  ImamGPT
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={`chat-body ${messages.length === 0 ? "empty" : ""}`}>
        {messages.map((message, index) => (
          <Bubble key={message.id || index} message={message} />
        ))}
        {isLoading && (
          <div className="loading-container">
            <LoadingBubble />
          </div>
        )}
      </div>
      <div
        className={`input-container ${messages.length === 0 ? "centered" : ""}`}
      >
        <div className="suggestions">
          <PromptSuggestionRow onPromptClick={handlePromptClick} />
        </div>
        <form className="input-form" onSubmit={handleSubmit}>
          <input
            className="input-box"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
          />
          <div className="input-actions">
            <button type="submit">Send</button>
            <button
              type="button"
              className="new-chat-button"
              onClick={handleNewChat}
            >
              New Chat
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        .chatbot {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          flex: 1;
          background: #1a1e2d;
          overflow: hidden;
          font-family: "Inter", "SF Pro Display", "Roboto", system-ui,
            sans-serif;
          font-weight: 500;
          letter-spacing: 0;
          position: relative;
          transition: all 0.3s ease;
        }
        .menubar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0;
          height: 60px;
          background: #0f1117;
          backdrop-filter: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .menubar-content {
          width: 100%;
          max-width: 1024px;
          padding: 0 16px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .app-branding {
          display: flex;
          align-items: center;
        }
        .app-name {
          font-size: 18px;
          font-weight: 600;
          color: #e6c682;
          letter-spacing: 0.5px;
        }
        .model-selector {
          position: relative;
        }
        .model-button {
          padding: 8px 16px;
          background: #293040;
          color: #e6c682;
          border: 1px solid rgba(255, 215, 125, 0.2);
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .model-button:hover {
          background: #353f54;
          border-color: rgba(255, 215, 125, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .model-dropdown {
          position: absolute;
          top: 110%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 5px;
          background: #293040;
          backdrop-filter: none;
          border: 1px solid rgba(255, 215, 125, 0.15);
          border-radius: 8px;
          overflow: hidden;
          z-index: 10;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.2s ease;
          min-width: 160px;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .dropdown-item {
          display: block;
          width: 100%;
          padding: 12px 20px;
          text-align: left;
          background-color: #000000;
          border: none;
          color: #e6c682;
          cursor: pointer;
          letter-spacing: 0.02em;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          font-weight: 500;
        }
        .dropdown-item:after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 1px;
          background: #ddc39a;
          transition: all 0.2s ease;
          transform: translateX(-50%);
        }
        .dropdown-item:hover {
          background: rgba(255, 215, 125, 0.08);
        }
        .dropdown-item:hover:after {
          width: 80%;
        }
        .dropdown-item.active {
          background: rgba(255, 215, 125, 0.15);
          font-weight: 600;
        }
        .chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0 100px 0;
          max-width: 768px;
          width: 100%;
          margin: 0 auto;
          scroll-behavior: smooth;
          position: relative;
        }
        .chat-body.empty {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .chat-body::-webkit-scrollbar {
          width: 6px;
        }
        .chat-body::-webkit-scrollbar-track {
          background: rgba(221, 195, 154, 0.05);
          border-radius: 6px;
        }
        .chat-body::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 125, 0.3);
          border-radius: 10px;
        }
        .bubble {
          background: #293040;
          color: #f0f0f0;
          border-radius: 12px;
          padding: 16px 24px;
          margin: 14px 16px;
          line-height: 1.5;
          letter-spacing: 0.01em;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: none;
          position: relative;
          max-width: 85%;
          font-weight: 400;
          font-family: "Roboto", sans-serif;
        }
        .bubble.user {
          align-self: flex-end;
          background: #4e4a36;
          color: #f0f0f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: none;
          border-bottom-right-radius: 3px;
          margin-left: auto;
        }
        .bubble.assistant {
          align-self: flex-start;
          background: #293040;
          color: #f0f0f0;
          border-bottom-left-radius: 3px;
          margin-right: auto;
        }
        .loading-container {
          display: flex;
          justify-content: center;
          margin: 16px 0;
        }
        .suggestions {
          padding: 12px 16px;
          background: #161c28;
          border-top: 1px solid rgba(255, 215, 125, 0.08);
        }
        .prompt-suggestion-row {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding: 4px 0;
          scrollbar-width: none;
          justify-content: flex-start;
        }
        .prompt-suggestion-row::-webkit-scrollbar {
          display: none;
        }
        .prompt-suggestion-button {
          background: #2c3447;
          color: #e6c682;
          border: 1px solid rgba(255, 215, 125, 0.15);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
          font-family: "Roboto", sans-serif;
          height: 36px;
          display: flex;
          align-items: center;
        }
        .prompt-suggestion-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
          background: #3b4357;
          border-color: rgba(255, 215, 125, 0.3);
        }
        .input-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          background: #1a1e2d;
          z-index: 10;
          max-width: 800px;
          margin: 0 auto;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .input-container.centered {
          position: relative;
          border-radius: 12px;
          border: 1px solid rgba(255, 215, 125, 0.12);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          margin-bottom: 20vh;
          background: #1f2535;
          overflow: hidden;
        }

        .input-form {
          display: flex;
          flex-wrap: nowrap;
          padding: 16px;
          width: 100%;
          background: #1f2535;
          align-items: center;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .input-box {
          flex: 1;
          min-width: 0;
          padding: 12px 16px;
          background: #293040;
          height: 50px;
          color: #f0f0f0;
          border: 1px solid rgba(255, 215, 125, 0.15);
          border-radius: 10px;
          font-family: inherit;
          font-weight: 400;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .input-box:focus {
          outline: none;
          border-color: rgba(255, 215, 125, 0.5);
          box-shadow: 0 0 0 2px rgba(255, 215, 125, 0.1);
        }
        .input-box::placeholder {
          color: rgba(240, 240, 240, 0.5);
          font-weight: 400;
        }
        .input-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-left: 12px;
          flex-shrink: 0;
        }
        .input-form button {
          padding: 0 16px;
          background: #4e4a36;
          color: #e6c682;
          border: none;
          border-radius: 10px;
          height: 50px;
          cursor: pointer;
          font-weight: 500;
          font-size: 14px;
          letter-spacing: 0.01em;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          white-space: nowrap;
        }
        .input-form button:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          background: #5a573e;
        }
        .input-form button:active {
          transform: translateY(0);
        }
        .new-chat-button {
          background: #293040 !important;
          color: #e6c682;
          border: 1px solid rgba(255, 215, 125, 0.15) !important;
          min-width: 100px;
        }
        .new-chat-button:hover {
          background: #36425a !important;
        }

        @media (max-width: 640px) {
          .input-actions {
            gap: 6px;
            margin-left: 8px;
          }

          .input-form button {
            padding: 0 12px;
            font-size: 13px;
          }

          .new-chat-button {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default FullChat;
