import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  isStreaming?: boolean;
}

export default function MessageBubble({ text, sender, timestamp, isStreaming }: MessageBubbleProps) {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className={`message ${sender === "user" ? "user-message" : "bot-message"}`}>
      <div className="message-content">
        <div className="message-text">
          <ReactMarkdown>{text}</ReactMarkdown>
          {isStreaming && <span className="typing-cursor">|</span>}
        </div>
        <div className="message-time">{formatTime(timestamp)}</div>
      </div>
    </div>
  );
}
