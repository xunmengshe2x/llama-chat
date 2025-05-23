const EmptyState = ({ setPrompt, setOpen }) => {
  return (
    <div className="py-8 sm:py-14 px-4 sm:px-0 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-apple-text-primary kojima-gradient-text">
        Neural Interface
      </h1>
      <p className="text-lg text-gray-600 dark:text-apple-text-secondary mb-8">
        Powered by Claude 4 Sonnet and other advanced AI models
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto mb-8">
        <div 
          onClick={() => setPrompt("Explain quantum computing in simple terms")}
          className="kojima-card dark:bg-kojima-gray hover:scale-[1.02] cursor-pointer transition-all duration-300 ease-in-out"
        >
          <h3 className="font-medium text-gray-900 dark:text-apple-text-primary mb-1">Quantum Computing</h3>
          <p className="text-sm text-gray-500 dark:text-apple-text-tertiary">Explain quantum computing in simple terms</p>
        </div>
        
        <div 
          onClick={() => setPrompt("Write a short story about a robot discovering emotions")}
          className="kojima-card dark:bg-kojima-gray hover:scale-[1.02] cursor-pointer transition-all duration-300 ease-in-out"
        >
          <h3 className="font-medium text-gray-900 dark:text-apple-text-primary mb-1">Creative Writing</h3>
          <p className="text-sm text-gray-500 dark:text-apple-text-tertiary">Write a story about a robot discovering emotions</p>
        </div>
        
        <div 
          onClick={() => setPrompt("Create a Python function to generate Fibonacci numbers")}
          className="kojima-card dark:bg-kojima-gray hover:scale-[1.02] cursor-pointer transition-all duration-300 ease-in-out"
        >
          <h3 className="font-medium text-gray-900 dark:text-apple-text-primary mb-1">Coding Help</h3>
          <p className="text-sm text-gray-500 dark:text-apple-text-tertiary">Create a Python function for Fibonacci numbers</p>
        </div>
        
        <div 
          onClick={() => setOpen(true)}
          className="kojima-card dark:bg-kojima-gray hover:scale-[1.02] cursor-pointer transition-all duration-300 ease-in-out"
        >
          <h3 className="font-medium text-gray-900 dark:text-apple-text-primary mb-1">Customize</h3>
          <p className="text-sm text-gray-500 dark:text-apple-text-tertiary">Adjust settings and system prompt</p>
        </div>
      </div>
      
      <div className="text-sm text-gray-500 dark:text-apple-text-tertiary">
        <p>Type a message or select a suggestion to begin</p>
      </div>
    </div>
  );
};

export default EmptyState;
