"use client";

import { useRef } from "react";
import Image from "next/image";
import Logo from "./assets/Logo.png";
import Chatbot from "./components/Chatbot";

export default function Home() {
  const chatbotRef = useRef<HTMLDivElement>(null);

  const scrollToChatbot = () => {
    chatbotRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <header className="site-header">
        <div className="logo-container">
          <Image
            src={Logo}
            alt="Perspectives.ai Logo"
            height={40}
            className="logo-image"
            priority
          />
        </div>

        <div className="header-buttons">
          <div className="social-buttons">
            <button className="social-button" aria-label="Facebook">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="social-button" aria-label="Twitter">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 3.00005C22.0424 3.67552 20.9821 4.19216 19.86 4.53005C19.2577 3.83756 18.4573 3.34674 17.567 3.12397C16.6767 2.90121 15.7395 2.95724 14.8821 3.2845C14.0247 3.61176 13.2884 4.19445 12.773 4.95376C12.2575 5.71308 11.9877 6.61238 12 7.53005V8.53005C10.2426 8.57561 8.50127 8.18586 6.93101 7.39549C5.36074 6.60513 4.01032 5.43868 3 4.00005C3 4.00005 -1 13 8 17C5.94053 18.398 3.48716 19.099 1 19C10 24 21 19 21 7.50005C20.9991 7.2215 20.9723 6.94364 20.92 6.67005C21.9406 5.66354 22.6608 4.39276 23 3.00005Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button className="social-button" aria-label="LinkedIn">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 9H2V21H6V9Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z"
                  stroke="#ddc39a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <button className="try-now-button" onClick={scrollToChatbot}>
            <span>Experience Now</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 12L12 19L5 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <div className="hero-section">
        <h1>Perspectives.ai</h1>
        <p>
          Experience profound insights from the world&apos;s spiritual
          traditions through our sophisticated AI assistants
        </p>
      </div>

      {/* the entire chat UI */}
      <div ref={chatbotRef} className="chatbot-container">
        <Chatbot />
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Raleway:wght@300;400;500;600&display=swap");

        html,
        body {
          margin: 0;
          padding: 0;
          background-color: #000000;
          color: #ddc39a;
          height: 100%;
          width: 100%;
          font-family: "Raleway", sans-serif;
          line-height: 1.6;
          font-weight: 300;
        }

        main {
          min-height: 100vh;
          width: 100%;
          background: #000000;
          background-image: radial-gradient(
              circle at 20% 30%,
              rgba(40, 35, 25, 0.2) 0%,
              rgba(0, 0, 0, 0) 50%
            ),
            radial-gradient(
              circle at 80% 20%,
              rgba(50, 45, 35, 0.1) 0%,
              rgba(0, 0, 0, 0) 50%
            );
          display: flex;
          flex-direction: column;
          position: relative;
        }

        * {
          box-sizing: border-box;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
          line-height: 1.2;
          font-family: "Playfair Display", serif;
          font-weight: 600;
        }

        .site-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 7%;
          height: 90px;
          width: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(221, 195, 154, 0.1);
          position: fixed;
          top: 0;
          left: 0;
          z-index: 100;
        }

        .logo-container {
          height: 40px;
          display: flex;
          align-items: center;
        }

        .logo-image {
          height: auto;
          width: auto;
          max-height: 40px;
          object-fit: contain;
        }

        .header-buttons {
          display: flex;
          align-items: center;
          gap: 36px;
        }

        .social-buttons {
          display: flex;
          gap: 18px;
        }

        .social-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(13, 12, 8, 0.3);
          border: 1px solid rgba(221, 195, 154, 0.15);
          color: #ddc39a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .social-button:hover {
          background-color: rgba(221, 195, 154, 0.05);
          transform: translateY(-3px);
          border-color: rgba(221, 195, 154, 0.4);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15),
            0 0 10px rgba(221, 195, 154, 0.1);
        }

        .try-now-button {
          padding: 12px 28px;
          background-color: rgba(221, 195, 154, 0.9);
          color: #000000;
          border: none;
          border-radius: 30px;
          font-weight: 500;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 0.6px;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15),
            0 0 15px rgba(221, 195, 154, 0.1);
        }

        .try-now-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2),
            0 0 20px rgba(221, 195, 154, 0.2);
          background-color: #ddc39a;
        }

        .hero-section {
          padding: 180px 7% 100px;
          text-align: center;
          margin: 0 auto;
          width: 100%;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: calc(100vh - 90px);
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(0, 0, 0, 0.9) 100%
          );
        }

        .hero-section h1 {
          font-size: 4.5rem;
          font-weight: 700;
          margin-bottom: 24px;
          color: #ddc39a;
          line-height: 1.1;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
        }

        .hero-section p {
          font-size: 1.3rem;
          color: rgba(221, 195, 154, 0.9);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.7;
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
        }

        .chatbot-container {
          flex: 1;
          min-height: 600px;
          max-height: 800px;
          width: 90%;
          max-width: 1200px;
          margin: 0 auto 80px;
          display: flex;
          flex-direction: column;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 50px rgba(221, 195, 154, 0.07);
          border: 1px solid rgba(221, 195, 154, 0.1);
          position: relative;
          z-index: 3;
        }

        @media (max-width: 768px) {
          .site-header {
            padding: 16px 5%;
            height: 70px;
          }

          .social-buttons {
            gap: 10px;
          }

          .social-button {
            width: 36px;
            height: 36px;
          }

          .try-now-button {
            padding: 10px 20px;
            font-size: 14px;
          }

          .hero-section {
            padding: 130px 5% 80px;
          }

          .hero-section h1 {
            font-size: 3.4rem;
          }

          .hero-section p {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </main>
  );
}
