const EmptyState = ({ setPrompt, setOpen }) => {
  return (
    <div className="py-8 sm:py-14 px-4 sm:px-0 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-apple-text-primary kojima-gradient-text">
        Neural Interface
      </h1>
      <p className="text-lg text-gray-600 dark:text-apple-text-secondary mb-8">
        Powered by Claude 4 Sonnet and other advanced AI models
      </p>

      <div className="text-sm text-gray-500 dark:text-apple-text-tertiary">
        <p>Type a message to begin</p>
      </div>
    </div>
  );
};

export default EmptyState;
