import MessageBubble from "./MessageBubble";
interface TypingIndicatorProps {
  isLoading: boolean;
}

function TypingIndicator({ isLoading }: TypingIndicatorProps) {
  return (
    <div className="typing-indicator">
      <div className="typing-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">
        {isLoading ? "Connecting..." : "AI is typing..."}
      </span>
    </div>
  );
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export default function ChatMessages({ messages, isTyping, isLoading, messagesEndRef }: ChatMessagesProps) {
  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} {...msg} />
      ))}

      {(isTyping || isLoading) && (
        <TypingIndicator isLoading={isLoading} />
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
