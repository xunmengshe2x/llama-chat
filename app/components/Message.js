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

  return (
    <div
      className="flex gap-x-4 mb-8 hover:translate-x-1 transition-transform duration-300 ease-in-out"
    >
      {isUser ? (
        <span className="text-xl sm:text-2xl pt-4" title="user">
          👤
        </span>
      ) : (
        <span className="text-xl sm:text-2xl pt-4" title="AI">
          🧠
        </span>
      )}

      <div className={`${containerClass} flex flex-col text-sm sm:text-base flex-1 gap-y-4 mt-1 p-5 rounded-lg shadow-sm dark:shadow-kojima-inner border border-transparent dark:border-kojima-gray/50 backdrop-blur-sm transition-all duration-300`}>
        {message.split("\n").map(
          (text, index) =>
            text.length > 0 && (
              <span key={index} className="min-w-0 dark:text-apple-text-primary">
                {text}
              </span>
            )
        )}
      </div>
    </div>
  );
};

export default Message;
