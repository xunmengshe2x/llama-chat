import ReactMarkdown from 'react-markdown';
import { formatMarkdown } from '../utils/markdown';

const Message = ({ message, isUser }) => {
  let containerClass = "bg-gray-100 dark:bg-kojima-gray";
  if (isUser) {
    containerClass = "bg-white dark:bg-apple-dark-elevated";
  }

  if (Array.isArray(message)) {
    message = message.join("");
  }

  if (!message || message === "") {
    return null;
  }

  // Format the markdown content, including tables
  const formattedMessage = formatMarkdown(message);

  return (
    <div
      className="flex gap-x-3 mb-4 hover:translate-x-1 transition-transform duration-300 ease-in-out"
    >
      {isUser ? (
        <span className="text-xl sm:text-2xl pt-1" title="user">
          👤
        </span>
      ) : (
        <span className="text-xl sm:text-2xl pt-1" title="AI">
          🧠
        </span>
      )}

      <div className={`${containerClass} flex flex-col text-sm sm:text-base flex-1 gap-y-2 p-4 rounded-lg shadow-sm dark:shadow-kojima-inner border border-transparent dark:border-kojima-gray/50 backdrop-blur-sm transition-all duration-300`}>
        <ReactMarkdown className="markdown-content dark:text-apple-text-primary">
          {formattedMessage}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default Message;
