"use client";

import React from "react";

interface ChatsLayoutProps {
  children: React.ReactNode;
}

export default function ChatsLayout({ children }: ChatsLayoutProps) {
  return (
    <div className="chat-fullscreen">
      {children}
      <style jsx>{`
        .chat-fullscreen {
          width: 100vw;
          height: 100vh;
          margin: 0;
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: none;
        }
      `}</style>
    </div>
  );
}
