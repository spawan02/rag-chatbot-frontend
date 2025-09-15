import { useState, useEffect, useRef } from "react";
import { chatAPI } from "./services/api";
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import "./App.scss";
import ChatMessages from "./components/ChatMessages";
import { PredefinedPrompts } from "./components/PredefinedPrompts";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isStreaming?: boolean;
}

function App() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [showPrompts, setShowPrompts] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      setIsLoading(true);

      let storedSessionId = sessionStorage.getItem("sessionId");
      if (!storedSessionId) {
          storedSessionId = await chatAPI.startSession();
          sessionStorage.setItem("sessionId", storedSessionId);
      }

      setSessionId(storedSessionId);

      const history = await chatAPI.getHistory(storedSessionId);
      if (history.length > 0) {
        const historyMessages: Message[] = history.flatMap((item, index) => [
          { id: `user-${index}`, text: item.query, sender: "user", timestamp: new Date() },
          { id: `bot-${index}`, text: item.answer, sender: "bot", timestamp: new Date() },
        ]);
        setMessages((prev) => [prev[0], ...historyMessages]);
      }
    } catch (error) {
      console.error("Failed to initialize session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateTyping = (text: string, messageId: string) => {
    setIsTyping(true);
    let currentText = "";
    let currentIndex = 0;

    const typeInterval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex++];
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, text: currentText, isStreaming: true } : msg
          )
        );
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        setMessages((prev) =>
          prev.map((msg) => (msg.id === messageId ? { ...msg, isStreaming: false } : msg))
        );
      }
    }, 10);
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text ?? inputValue.trim(); 
    if (!messageText || isTyping || !sessionId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
    };
 
    setMessages((prev) => [...prev, userMessage]);
    if (!text) {
        setInputValue("");
    }
    try {
      setIsTyping(true);
      const botMessageId = (Date.now() + 1).toString();

      const botMessage: Message = {
        id: botMessageId,
        text: "",
        sender: "bot",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, botMessage]);

      const response = await chatAPI.sendMessage(sessionId, messageText);
      simulateTyping(response, botMessageId);
    } catch (error: any) {
      let errorMessage: string;

      if (error?.response?.data?.error === "Invalid session ID") {
        errorMessage = "Your session expired. Please reset and try again.";
      } else if (error?.status === 503) {
        errorMessage = "The AI model is overloaded. Please try again.";
      } else {
        errorMessage = "Something went wrong. Please try again.";
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.isStreaming
            ? {
                ...msg,
                text: errorMessage,
                isStreaming: false,
              }
            : msg
        )
      );
      } finally {
          setIsTyping(false);
      }
    };

  const handleResetSession = async () => {
    if (!sessionId) return;
    if (!window.confirm("Are you sure you want to reset the chat session?")) return;

    try {
      setIsLoading(true);
      await chatAPI.resetSession(sessionId);

      sessionStorage.removeItem("sessionId");

      const newSessionId = await chatAPI.startSession();
      sessionStorage.setItem("sessionId", newSessionId);
      setSessionId(newSessionId);

      setMessages([
        {
          id: "1",
          text: "Hello! I'm your AI assistant. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
      setInputValue("");
      setShowPrompts(true);
    } catch (error) {
      console.error("Failed to reset session:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="chat-app">
      <ChatHeader onReset={handleResetSession} />
      <ChatMessages
        messages={messages}
        isTyping={isTyping}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />
    {showPrompts && (
      <PredefinedPrompts
        onPromptSelect={(prompt) => {
          handleSendMessage(prompt);
          setShowPrompts(false);
        }}
      />
      )}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSend={handleSendMessage}
        disabled={isTyping || isLoading || !sessionId}
      />
    </div>
  );
}

export default App;
