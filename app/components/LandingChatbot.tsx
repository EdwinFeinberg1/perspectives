"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { Send, ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

import Bubble from "./Chatbot/Bubble";
import LoadingBubble from "./Chatbot/LoadingBubble";
import PromptSuggestionRow from "./Chatbot/PromptSuggestionRow";

type ModelName = "RabbiGPT" | "BuddhaGPT" | "PastorGPT";

const apiRoute = (m: ModelName) =>
  m === "RabbiGPT"
    ? "/api/chat/judaism"
    : m === "BuddhaGPT"
    ? "/api/chat/buddha"
    : "/api/chat/christianity";

const BADGE: Record<ModelName, string> = {
  RabbiGPT: "✡️",
  BuddhaGPT: "☸️",
  PastorGPT: "✝️",
};

const LandingChatbot: React.FC = () => {
  const router = useRouter();
  const [selectedModel, setSelectedModel] = useState<ModelName>("RabbiGPT");
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);
  const [alternativePerspectives, setAlternativePerspectives] = useState<
    Record<ModelName, string | null>
  >({
    RabbiGPT: null,
    BuddhaGPT: null,
    PastorGPT: null,
  });
  const [isLoadingPerspectives, setIsLoadingPerspectives] = useState<
    Record<ModelName, boolean>
  >({
    RabbiGPT: false,
    BuddhaGPT: false,
    PastorGPT: false,
  });
  const [sidePanelsVisible, setSidePanelsVisible] = useState(false);

  const {
    messages,
    isLoading,
    input,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({
    id: `landing-${selectedModel.toLowerCase()}`,
    api: apiRoute(selectedModel),
  });

  // Get the other two models
  const otherModels = Object.keys(BADGE).filter(
    (m) => m !== selectedModel
  ) as Array<ModelName>;

  // Extract content from the unique stream format we're getting
  const extractContentFromStreamResponse = (rawText: string): string => {
    // Check if it's empty
    if (!rawText || rawText.trim() === "") {
      return "No response received";
    }

    console.log("Raw response sample:", rawText.substring(0, 100));

    // Handle the format with 'f:' prefix and numbered tokens (like BuddhaGPT responses)
    if (rawText.startsWith("f:{")) {
      try {
        // Extract all numbered tokens: 0:"content"
        const tokenMatches = Array.from(rawText.matchAll(/\d+:"([^"]*)"/g));

        if (tokenMatches && tokenMatches.length > 0) {
          // Join all extracted content parts
          return tokenMatches.map((match) => match[1]).join("");
        }
      } catch (err) {
        console.error("Error parsing f: format:", err);
      }
    }

    // Try handling as a series of SSE events (data: lines)
    if (rawText.includes("data: ")) {
      try {
        const dataLines = rawText
          .split("\n")
          .filter(
            (line) => line.startsWith("data: ") && !line.includes("[DONE]")
          );

        if (dataLines.length > 0) {
          let extractedContent = "";

          for (const line of dataLines) {
            const content = line.substring("data: ".length);

            // Try parsing as JSON if possible
            try {
              const jsonData = JSON.parse(content);
              if (jsonData.choices && jsonData.choices[0]) {
                if (
                  jsonData.choices[0].delta &&
                  jsonData.choices[0].delta.content
                ) {
                  extractedContent += jsonData.choices[0].delta.content;
                } else if (
                  jsonData.choices[0].message &&
                  jsonData.choices[0].message.content
                ) {
                  extractedContent += jsonData.choices[0].message.content;
                }
              } else if (jsonData.text) {
                extractedContent += jsonData.text;
              }
            } catch {
              // If not valid JSON, just add the content
              extractedContent += content;
            }
          }

          if (extractedContent) {
            return extractedContent;
          }
        }
      } catch (err) {
        console.error("Error parsing SSE format:", err);
      }
    }

    // If we got here, return the raw text after cleaning
    return rawText
      .replace(/^f:\{.*?\}/, "") // Remove f: header
      .replace(/\d+:"([^"]*)"/g, "$1") // Try to clean numbered tokens
      .replace(/e:\{.*?\}/g, "") // Remove e: footer
      .replace(/d:\{.*?\}/g, ""); // Remove d: footer
  };

  const fetchAlternativePerspective = useCallback(
    async (modelName: ModelName, question: string) => {
      if (!question) return;

      setIsLoadingPerspectives((prev) => ({
        ...prev,
        [modelName]: true,
      }));

      try {
        console.log(
          `Fetching perspective for ${modelName} with question: ${question.substring(
            0,
            30
          )}...`
        );

        const response = await fetch(apiRoute(modelName), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: question }],
          }),
        });

        console.log(`Response status for ${modelName}: ${response.status}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch response: ${response.statusText}`);
        }

        // We'll collect the entire response and process it at the end
        let fullResponseText = "";
        const reader = response.body?.getReader();

        if (!reader) {
          throw new Error("Response body is not readable");
        }

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log(`Stream complete for ${modelName}`);
              break;
            }

            // Just append the raw chunks - we'll process the whole thing at the end
            const chunk = new TextDecoder().decode(value);
            fullResponseText += chunk;
          }
        } catch (err) {
          console.error(`Error reading stream for ${modelName}:`, err);
          throw err;
        } finally {
          reader.releaseLock();
        }

        // Process the complete response to extract the actual content
        const processedText =
          extractContentFromStreamResponse(fullResponseText);

        // Debug
        console.log(
          `Processed response for ${modelName} (${processedText.length} chars)`,
          processedText.substring(0, 150) +
            (processedText.length > 150 ? "..." : "")
        );

        // Update state with the processed response
        setAlternativePerspectives((prev) => ({
          ...prev,
          [modelName]:
            processedText ||
            `No readable content was received from ${modelName}`,
        }));
      } catch (error) {
        console.error(`Error fetching ${modelName} perspective:`, error);
        setAlternativePerspectives((prev) => ({
          ...prev,
          [modelName]: `Failed to generate this perspective: ${error.message}`,
        }));
      } finally {
        setIsLoadingPerspectives((prev) => ({
          ...prev,
          [modelName]: false,
        }));
      }
    },
    [] // No dependencies needed
  );

  // First fix: Use a ref to track whether we should update
  const hasLastQuestionRef = React.useRef(false);

  useEffect(() => {
    // Only run this effect when messages change
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.role === "assistant" && !hasLastQuestionRef.current) {
        // Find the last user message
        for (let i = messages.length - 2; i >= 0; i--) {
          if (messages[i].role === "user") {
            setLastQuestion(messages[i].content);
            hasLastQuestionRef.current = true;
            break;
          }
        }
      }
    }
  }, [messages]);

  // Reset the perspective states when the model changes
  useEffect(() => {
    setAlternativePerspectives({
      RabbiGPT: null,
      BuddhaGPT: null,
      PastorGPT: null,
    });
    setIsLoadingPerspectives({
      RabbiGPT: false,
      BuddhaGPT: false,
      PastorGPT: false,
    });
    hasLastQuestionRef.current = false;
  }, [selectedModel]);

  // Separate effect to handle fetching perspectives on panel toggle
  const fetchPerspectivesRef = React.useRef(false);

  useEffect(() => {
    // Only fetch when sidePanels become visible and we haven't fetched yet
    if (sidePanelsVisible && lastQuestion && !fetchPerspectivesRef.current) {
      fetchPerspectivesRef.current = true;

      otherModels.forEach((model) => {
        if (!alternativePerspectives[model] && !isLoadingPerspectives[model]) {
          fetchAlternativePerspective(model, lastQuestion);
        }
      });
    }

    // Reset the fetch flag when panels are hidden
    if (!sidePanelsVisible) {
      fetchPerspectivesRef.current = false;
    }
  }, [
    sidePanelsVisible,
    lastQuestion,
    otherModels,
    alternativePerspectives,
    isLoadingPerspectives,
    fetchAlternativePerspective,
  ]);

  const sendPrompt = (p: string) =>
    append({ id: crypto.randomUUID(), role: "user", content: p });

  const goToFullChat = () => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
    sessionStorage.setItem("chatModel", selectedModel);
    router.push("/chats");
  };

  // Simplified toggle function
  const toggleSidePanels = () => {
    // Reset the fetch flag when toggling to ensure perspectives are fetched when needed
    if (!sidePanelsVisible) {
      fetchPerspectivesRef.current = false;
    }
    setSidePanelsVisible((prev) => !prev);
  };

  // Keep track of the latest assistant message
  const latestAssistantMessageIndex = React.useMemo(() => {
    if (messages.length === 0) return -1;

    // Find the index of the last assistant message
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") {
        return i;
      }
    }
    return -1;
  }, [messages]);

  return (
    <Card className="h-full flex flex-col overflow-hidden border-sky-700 rounded-[10px] shadow-xl border border-[rgba(64,122,214,0.15)]">
      <CardHeader className="px-4 py-3 flex flex-row justify-between items-center space-y-0 bg-slate-950">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-36 justify-between bg-slate-800">
                {selectedModel}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                >
                  <path
                    d="M4.93179 5.43179C4.75605 5.60753 4.75605 5.89245 4.93179 6.06819C5.10753 6.24392 5.39245 6.24392 5.56819 6.06819L7.49999 4.13638L9.43179 6.06819C9.60753 6.24392 9.89245 6.24392 10.0682 6.06819C10.2439 5.89245 10.2439 5.60753 10.0682 5.43179L7.81819 3.18179C7.73379 3.0974 7.61933 3.04999 7.49999 3.04999C7.38064 3.04999 7.26618 3.0974 7.18179 3.18179L4.93179 5.43179ZM10.0682 9.56819C10.2439 9.39245 10.2439 9.10753 10.0682 8.93179C9.89245 8.75606 9.60753 8.75606 9.43179 8.93179L7.49999 10.8636L5.56819 8.93179C5.39245 8.75606 5.10753 8.75606 4.93179 8.93179C4.75605 9.10753 4.75605 9.39245 4.93179 9.56819L7.18179 11.8182C7.26618 11.9026 7.38064 11.95 7.49999 11.95C7.61933 11.95 7.73379 11.9026 7.81819 11.8182L10.0682 9.56819Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedModel("RabbiGPT")}>
                RabbiGPT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedModel("BuddhaGPT")}>
                BuddhaGPT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedModel("PastorGPT")}>
                PastorGPT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button onClick={goToFullChat} className="w-28 bg-slate-950">
          Full Chat
        </Button>
      </CardHeader>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1"
        key={sidePanelsVisible ? "with-side-panels" : "without-side-panels"}
      >
        <ResizablePanel
          id="main-panel"
          defaultSize={sidePanelsVisible ? 50 : 100}
          minSize={30}
        >
          <CardContent className="h-full overflow-y-auto p-4 space-y-4 bg-slate-950">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground bg-slate-950">
                <p>Select a model and start chatting</p>
              </div>
            ) : (
              <>
                {messages.map((m, index) => (
                  <React.Fragment key={m.id || index}>
                    <Bubble
                      message={{
                        content: m.content,
                        role: m.role as "user" | "assistant",
                      }}
                      model={selectedModel}
                    />
                    {/* Show Perspectives button after the latest assistant message */}
                    {index === latestAssistantMessageIndex &&
                      m.role === "assistant" && (
                        <div className="ml-2 mb-4">
                          <Button
                            onClick={toggleSidePanels}
                            variant="outline"
                            size="sm"
                            className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600"
                          >
                            {sidePanelsVisible ? (
                              <>
                                Hide Perspectives <ChevronRight size={14} />
                              </>
                            ) : (
                              <>
                                Show Perspectives <ChevronLeft size={14} />
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                  </React.Fragment>
                ))}
                {isLoading && (
                  <div className="flex justify-center">
                    <LoadingBubble />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </ResizablePanel>

        {sidePanelsVisible && (
          <>
            <ResizableHandle withHandle />

            <ResizablePanel id="side-panel" defaultSize={50} minSize={30}>
              <ResizablePanelGroup direction="vertical">
                {otherModels.map((model, index) => (
                  <React.Fragment key={model}>
                    {index > 0 && <ResizableHandle withHandle />}
                    <ResizablePanel>
                      <CardContent className="h-full overflow-y-auto p-4 bg-slate-950 border-l border-slate-800">
                        <div className="mb-4 flex items-center">
                          <span className="mr-2 text-lg">{BADGE[model]}</span>
                          <h3 className="font-semibold text-white">{model}</h3>
                        </div>

                        {isLoadingPerspectives[model] ? (
                          <div className="flex justify-center items-center h-32">
                            <LoadingBubble />
                          </div>
                        ) : alternativePerspectives[model] ? (
                          <div className="p-3 rounded-md bg-slate-900 text-white">
                            {alternativePerspectives[model]}
                          </div>
                        ) : (
                          <div className="text-slate-400 italic">
                            Perspective not available yet
                          </div>
                        )}
                      </CardContent>
                    </ResizablePanel>
                  </React.Fragment>
                ))}
              </ResizablePanelGroup>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>

      <CardFooter className="flex flex-col p-0 bg-slate-950">
        <div className="w-full p-2 h-16 overflow-hidden">
          <PromptSuggestionRow
            model={selectedModel}
            onPromptClick={sendPrompt}
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex w-full px-4 py-4 mb-2 bg-slate-950 rounded-lg shadow-sm mx-2 my-2"
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask me anything..."
            className="flex-1 bg-slate-950 border-none text-white rounded-md"
          />
          <Button type="submit" className="ml-2 bg-slate-950" size="icon">
            <Send size={18} />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default LandingChatbot;
