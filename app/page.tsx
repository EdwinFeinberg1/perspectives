"use client";
import Image from "next/image";
import logo from "./assets/logo.png";
import { useChat } from "ai/react";
import { Message } from "ai";

import LoadingBubble from "./components/LoadingBubble";
import PromptSuggestionRow from "./components/promptSuggestionRow";
import Bubble from "./components/bubble";

const Home = () => {
  const {
    append,
    isLoading,
    messages,
    input,
    handleInputChange,
    handleSubmit,
  } = useChat();

  const noMessages = !messages || messages.length === 0;

  const handlePrompt = (promptText) => {
    const msg: Message = {
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    };
    append(msg);
  };
  return (
    <main>
      <Image src={logo} width="250" alt="Perspectives.ai" />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              Don’t wander in uncertainty. Tap into Perspectives.ai and discover
              the wisdom that’s guided seekers for centuries—then explore four
              faiths in one unified experience.
            </p>
            <br />
            <PromptSuggestionRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me anything about Judaism..."
        />
        <input type="submit" value="Send" />
      </form>
    </main>
  );
};
export default Home;
