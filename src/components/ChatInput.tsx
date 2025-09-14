import { Send } from "lucide-react";
import { useRef } from "react";

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSend: () => void;
  disabled: boolean;
}

export default function ChatInput({ inputValue, setInputValue, onSend, disabled }: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={disabled}
          className="input-field"
        />
        <button
          onClick={onSend}
          disabled={disabled || inputValue.trim() === ""}
          className="send-button"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}
