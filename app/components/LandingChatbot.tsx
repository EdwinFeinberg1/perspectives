"use client";

import React, { useState } from "react";
import { useChat } from "ai/react";
import { Message } from "ai";
import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import PromptSuggestionRow from "./Chatbot/PromptSuggestionRow";
import { useRouter } from "next/navigation";

const LandingChatbot: React.FC = () => {
  const router = useRouter();
  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({ id: "landing-chat" });
  const [selectedModel, setSelectedModel] = useState<string>("RabbiGPT");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

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

  const handleGoToFullChat = () => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
    router.push("/chats");
  };

  return (
    <div className="landing-chatbot">
      <div className="menubar">
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
              className="full-chat-button"
              onClick={handleGoToFullChat}
            >
              Full Chat
            </button>
          </div>
        </form>
      </div>
      <style jsx global>{`
        .landing-chatbot {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background: linear-gradient(
            125deg,
            #0f1218 0%,
            #1a1f2c 50%,
            #252b38 100%
          );
          box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.5);
          overflow: hidden;
          font-family: "SF Pro Display", "Montserrat", "Roboto", "Segoe UI",
            sans-serif;
          font-weight: 500;
          letter-spacing: 0.01em;
          position: relative;
          transition: all 0.3s ease;
          border-radius: 10px;
        }
        .menubar {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
          background: #1a1f2c;
          backdrop-filter: none;
          border-bottom: 1px solid rgba(255, 215, 125, 0.1);
        }
        .model-selector {
          position: relative;
        }
        .model-button {
          padding: 10px 20px;
          background: linear-gradient(135deg, #1a1f2c, #252b38);
          color: #e6c682;
          border: 1px solid rgba(255, 215, 125, 0.3);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        .model-button:hover {
          background: linear-gradient(135deg, #1d2333, #2c3446);
          border-color: rgba(255, 215, 125, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
        }
        .model-dropdown {
          position: absolute;
          top: 110%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 5px;
          background: #1a1f2c;
          backdrop-filter: none;
          border: 1px solid rgba(255, 215, 125, 0.2);
          border-radius: 14px;
          overflow: hidden;
          z-index: 10;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
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
          padding: 20px;
          background-image: radial-gradient(
              circle at 20% 30%,
              rgba(37, 43, 56, 0.4) 0%,
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 70%,
              rgba(25, 30, 40, 0.4) 0%,
              transparent 50%
            );
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
          background: rgba(25, 29, 40, 0.7);
          backdrop-filter: blur(16px);
          color: #f0f0f0;
          border-radius: 18px;
          padding: 16px 24px;
          margin: 14px 0;
          line-height: 1.5;
          letter-spacing: 0.01em;
          box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.03);
          position: relative;
          max-width: 85%;
          font-weight: 600;
          font-family: "Roboto", sans-serif;
        }
        .bubble.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #ecd286 0%, #d5b46e 100%);
          color: #23282e;
          box-shadow: 0 6px 24px rgba(213, 180, 110, 0.3);
          border: none;
          border-bottom-right-radius: 4px;
          margin-left: auto;
        }
        .bubble.assistant {
          align-self: flex-start;
          background: rgba(25, 29, 40, 0.7);
          color: #f0f0f0;
          border-bottom-left-radius: 4px;
          margin-right: auto;
        }
        .loading-container {
          display: flex;
          justify-content: center;
          margin: 16px 0;
        }
        .input-container {
          position: relative;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          flex-direction: column;
          background: rgba(18, 21, 29, 0.9);
          backdrop-filter: blur(20px);
          z-index: 10;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .input-container.centered {
          position: relative;
          border-radius: 20px;
          border: 1px solid rgba(255, 215, 125, 0.15);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          margin: 0 auto 20px;
          max-width: 85%;
          background: rgba(25, 29, 40, 0.9);
        }
        .suggestions {
          padding: 8px 16px 0;
          background: transparent;
          border-top: 1px solid rgba(255, 215, 125, 0.08);
        }
        .prompt-suggestion-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 4px 0 8px;
          scrollbar-width: none;
          justify-content: center;
        }
        .prompt-suggestion-row::-webkit-scrollbar {
          display: none;
        }
        .prompt-suggestion-button {
          background: linear-gradient(135deg, #ecd286 0%, #d5b46e 100%);
          color: #23282e;
          border: none;
          border-radius: 14px;
          padding: 6px 14px;
          font-weight: 600;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(213, 180, 110, 0.2);
          flex-shrink: 0;
          font-family: "Roboto", sans-serif;
          font-size: 13px;
        }
        .prompt-suggestion-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(213, 180, 110, 0.3);
        }
        .input-form {
          display: flex;
          padding: 16px;
          background: transparent;
          align-items: center;
          width: 100%;
        }
        .input-box {
          flex: 1;
          padding: 12px 16px;
          background: rgba(25, 29, 40, 0.7);
          color: #f0f0f0;
          border: 1px solid rgba(255, 215, 125, 0.15);
          border-radius: 14px;
          font-family: inherit;
          font-weight: 500;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1),
            inset 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        .input-box:focus {
          outline: none;
          border-color: rgba(255, 215, 125, 0.5);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15),
            0 0 0 3px rgba(255, 215, 125, 0.1);
        }
        .input-box::placeholder {
          color: rgba(240, 240, 240, 0.5);
          font-weight: 400;
        }
        .input-form button {
          margin-left: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #ecd286 0%, #d5b46e 100%);
          color: #23282e;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(213, 180, 110, 0.2);
        }
        .input-form button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(213, 180, 110, 0.3);
        }
        .input-form button:active {
          transform: translateY(0);
        }
        .input-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .full-chat-button {
          background: #374151 !important;
          color: #e6c682 !important;
        }
        .full-chat-button:hover {
          background: #4b5563 !important;
        }
      `}</style>
    </div>
  );
};

export default LandingChatbot;
