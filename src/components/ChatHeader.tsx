import { RotateCcw, MessageCircle } from "lucide-react";

interface ChatHeaderProps {
  onReset: () => void;
}

export default function ChatHeader({ onReset }: ChatHeaderProps) {
  return (
    <header className="chat-header">
      <div className="header-content">
        <div className="header-info">
          <MessageCircle className="header-icon" />
          <h1>AI Assistant</h1>
        </div>
        <button
          className="reset-button"
          onClick={onReset}
          title="Reset Session"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </header>
  );
}
