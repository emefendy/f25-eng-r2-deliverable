"use client";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface ChatbotResponse {
  response: string;
}

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

export default function SpeciesChatbot() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    // check if it's empty
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const userMessage: ChatMessage = { role: "user", content: trimmedMessage };
    setChatLog((prev) => [...prev, userMessage]);

    // set loading state
    setMessage("");
    setIsLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      // Call your API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from chatbot");
      }

      const data = (await response.json()) as ChatbotResponse;

      const botMessage: ChatMessage = { role: "bot", content: data.response };
      setChatLog((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling chatbot API:", error);

      const errorMessage: ChatMessage = {
        role: "bot",
        content: "Sorry, I encountered an error. Please try again.",
      };
      setChatLog((prev) => [...prev, errorMessage]);
    } finally {
      // Re-enable input
      setIsLoading(false);
    }
  };

  return (
    <>
      <TypographyH2>Species Chatbot</TypographyH2>
      <div className="mt-4 flex gap-4">
        <div className="mt-4 rounded-lg bg-foreground p-4 text-background">
          <TypographyP>
            Ask me anything about any species: habitat, diet, conservation status, and more! Simply type your question.
          </TypographyP>
        </div>
      </div>
      <div className="mx-auto mt-6">
        <div className="h-[400px] space-y-3 overflow-y-auto rounded-lg border border-border bg-muted p-4">
          {chatLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">Start chatting about a species!</p>
          ) : (
            chatLog.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] whitespace-pre-wrap rounded-2xl p-3 text-sm ${
                    msg.role === "user"
                      ? "rounded-br-none bg-primary text-primary-foreground"
                      : "rounded-bl-none border border-border bg-foreground text-primary-foreground"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="mt-4 flex flex-col items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit();
              }
            }}
            rows={1}
            placeholder="Ask about a species..."
            className="w-full resize-none overflow-hidden rounded border border-border bg-background p-2 text-sm text-foreground focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isLoading || !message.trim()}
            className="mt-2 rounded bg-primary px-4 py-2 text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Enter"}
          </button>
        </div>
      </div>
    </>
  );
}
