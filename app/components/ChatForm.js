import Metrics from "./Metrics";
import { useState, useRef, useEffect } from "react";

const ChatForm = ({ prompt, setPrompt, onSubmit, metrics, completion, disabled }) => {
  const [rows, setRows] = useState(1);
  const textareaRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    onSubmit(prompt);
    setPrompt("");
    setRows(1);
    // Refocus the textarea after submission
    textareaRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled) {
        handleSubmit(event);
      }
    } else if (event.key === "Enter" && event.shiftKey) {
      // Allow Shift+Enter to insert a newline
      // The textarea will automatically expand due to the autoResize function
    }
  };

  // Function to automatically resize the textarea based on content
  const autoResize = () => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto';

      // Calculate new height (with a max of 200px)
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = `${newHeight}px`;

      // Update rows state based on line count
      const lineCount = (prompt.match(/\n/g) || []).length + 1;
      setRows(Math.min(lineCount, 10));
    }
  };

  // Auto-resize when prompt changes
  useEffect(() => {
    autoResize();
  }, [prompt]);

  // Refocus textarea when it becomes enabled again
  useEffect(() => {
    if (!disabled && document.activeElement !== textareaRef.current) {
      textareaRef.current?.focus();
    }
  }, [disabled]);

  return (
    <div className="w-full bg-slate-100 dark:bg-kojima-black border-t dark:border-kojima-gray/30 backdrop-blur-md transition-all duration-300 py-4">
      <div className="container max-w-4xl mx-auto px-5">
        <Metrics
          startedAt={metrics.startedAt}
          firstMessageAt={metrics.firstMessageAt}
          completedAt={metrics.completedAt}
          completion={completion}
        />

        <form className="w-full flex kojima-border" onSubmit={handleSubmit}>
          <div className="kojima-border-content flex w-full">
            <textarea
              ref={textareaRef}
              autoComplete="off"
              autoFocus
              name="prompt"
              rows={rows}
              className={`flex-grow block w-full rounded-l-md border-0 py-2 px-3 text-gray-900 dark:text-apple-text-primary bg-white dark:bg-kojima-darkgray ring-1 ring-inset ring-gray-300 dark:ring-kojima-gray placeholder:text-gray-400 dark:placeholder:text-apple-text-quaternary focus:ring-2 focus:ring-inset focus:ring-apple-accent-blue dark:focus:ring-apple-accent-blue sm:leading-6 transition-all duration-200 resize-none overflow-hidden ${disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              placeholder={disabled ? "Please wait for AI to respond..." : "Send a message (Shift+Enter for new line)"}
              required={true}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            />
            <button
              className={`bg-apple-accent-blue items-center font-semibold text-white rounded-r-md px-5 py-3 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:scale-[0.98] ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-apple-accent-blue/90'
                }`}
              type="submit"
              disabled={disabled}
            >
              Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatForm;
