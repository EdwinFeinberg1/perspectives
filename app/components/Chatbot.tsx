"use client";

import React, { useState } from "react";
import { useChat } from "ai/react";
import { Message } from "ai";
import Bubble from "./bubble";
import LoadingBubble from "./LoadingBubble";
import PromptSuggestionRow from "./promptSuggestionRow";

const Chatbot: React.FC = () => {
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

  return (
    <div className="chatbot">
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
      <div className="chat-body">
        {messages.map((message, index) => (
          <Bubble key={message.id || index} message={message} />
        ))}
        {isLoading && (
          <div className="loading-container">
            <LoadingBubble />
          </div>
        )}
      </div>
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
        <button type="submit">Send</button>
      </form>
      <style jsx global>{`
        .chatbot {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
          background-color: #000000;
          overflow: hidden;
          font-family: "Roboto", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .menubar {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
          background-color: #000000;
          border-bottom: 1px solid rgba(221, 195, 154, 0.3);
          backdrop-filter: blur(5px);
        }
        .model-selector {
          position: relative;
        }
        .model-button {
          padding: 10px 20px;
          background-color: #000000;
          color: #ddc39a;
          border: 1px solid rgba(221, 195, 154, 0.5);
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.5px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(13, 12, 8, 0.3);
        }
        .model-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(13, 12, 8, 0.4);
          border-color: #ddc39a;
        }
        .model-dropdown {
          position: absolute;
          top: 110%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 5px;
          background-color: #000000;
          border: 1px solid rgba(221, 195, 154, 0.3);
          border-radius: 12px;
          overflow: hidden;
          z-index: 10;
          box-shadow: 0 8px 16px rgba(13, 12, 8, 0.3);
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
          color: #ddc39a;
          cursor: pointer;
          letter-spacing: 0.3px;
          transition: all 0.15s ease;
          position: relative;
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
          background-color: rgba(13, 12, 8, 0.6);
        }
        .dropdown-item:hover:after {
          width: 80%;
        }
        .dropdown-item.active {
          color: #ddc39a;
          font-weight: 700;
          background-color: rgba(13, 12, 8, 0.8);
        }
        .chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          scroll-behavior: smooth;
        }
        .chat-body::-webkit-scrollbar {
          width: 6px;
        }
        .chat-body::-webkit-scrollbar-track {
          background: rgba(221, 195, 154, 0.05);
          border-radius: 6px;
        }
        .chat-body::-webkit-scrollbar-thumb {
          background: rgba(221, 195, 154, 0.3);
          border-radius: 6px;
        }
        .bubble {
          background-color: #ddc39a;
          color: #0d0c08;
          border-radius: 18px;
          padding: 12px 16px;
          margin: 16px 0;
          max-width: 80%;
          font-weight: 600;
          letter-spacing: 0.2px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          animation: bubbleIn 0.3s ease;
          position: relative;
        }
        @keyframes bubbleIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .bubble.user {
          align-self: flex-end;
          border-bottom-right-radius: 4px;
          margin-left: auto;
        }
        .bubble.assistant {
          align-self: flex-start;
          border-bottom-left-radius: 4px;
          margin-right: auto;
          background-color: rgba(221, 195, 154, 0.9);
        }
        .loading-container {
          display: flex;
          justify-content: center;
          margin: 16px 0;
        }
        .suggestions {
          padding: 12px 16px;
          background-color: #000000;
          border-top: 1px solid rgba(221, 195, 154, 0.3);
        }
        .input-form {
          display: flex;
          padding: 16px;
          background-color: #000000;
          border-top: 1px solid rgba(221, 195, 154, 0.3);
          align-items: center;
        }
        .input-box {
          flex: 1;
          padding: 12px 16px;
          background-color: rgba(221, 195, 154, 0.05);
          color: #ddc39a;
          border: 1px solid rgba(221, 195, 154, 0.3);
          border-radius: 12px;
          font-family: inherit;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .input-box:hover {
          border-color: rgba(221, 195, 154, 0.5);
        }
        .input-box::placeholder {
          color: rgba(221, 195, 154, 0.5);
          font-weight: 500;
        }
        .input-box:focus {
          outline: none;
          border-color: #ddc39a;
          box-shadow: 0 0 0 3px rgba(221, 195, 154, 0.2);
        }
        .input-form button {
          margin-left: 12px;
          padding: 12px 20px;
          background-color: #ddc39a;
          border: none;
          border-radius: 12px;
          color: #0d0c08;
          cursor: pointer;
          font-weight: 700;
          letter-spacing: 0.5px;
          transition: all 0.2s ease;
          box-shadow: 0 2px 8px rgba(221, 195, 154, 0.2);
        }
        .input-form button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(221, 195, 154, 0.3);
        }
        .input-form button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
