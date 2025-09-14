import React, { useState } from "react";
import "../App.scss";

interface PredefinedPromptsProps {
  onPromptSelect: (prompt: string) => void;
}

const initialPrompts = [
  "Current tech trends",
  "Latest news",
  "Cybersecurity updates",
];

export const PredefinedPrompts: React.FC<PredefinedPromptsProps> = ({ onPromptSelect }) => {
  const [prompts, setPrompts] = useState(initialPrompts);

  const handleClick = (prompt: string) => {
    onPromptSelect(prompt); 
    setPrompts([]);
  };

  if (prompts.length === 0) return null;

  return (
    <div className="predefined-prompts">
      {prompts.map((prompt, index) => (
        <button
          key={index}
          className="prompt-button"
          onClick={() => handleClick(prompt)}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
