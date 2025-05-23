import Metrics from "./Metrics";

const ChatForm = ({ prompt, setPrompt, onSubmit, metrics, completion, disabled }) => {
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (disabled) {
      return;
    }
    onSubmit(prompt);
    setPrompt("");
    event.target.rows = 1;
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <footer className="z-10 fixed bottom-0 left-0 right-0 bg-slate-100 dark:bg-kojima-black border-t dark:border-kojima-gray/30 backdrop-blur-md transition-all duration-300">
      <div className="container max-w-2xl mx-auto px-5 py-7">
        <Metrics
          startedAt={metrics.startedAt}
          firstMessageAt={metrics.firstMessageAt}
          completedAt={metrics.completedAt}
          completion={completion}
        />

        <form className="w-full flex kojima-border" onSubmit={handleSubmit}>
          <div className="kojima-border-content flex w-full">
            <input
              autoComplete="off"
              autoFocus
              name="prompt"
              className="flex-grow block w-full rounded-l-md border-0 py-1.5 text-gray-900 dark:text-apple-text-primary bg-white dark:bg-kojima-darkgray ring-1 ring-inset ring-gray-300 dark:ring-kojima-gray placeholder:text-gray-400 dark:placeholder:text-apple-text-quaternary focus:ring-2 focus:ring-inset focus:ring-apple-accent-blue dark:focus:ring-apple-accent-blue sm:leading-6 transition-all duration-200"
              placeholder="Send a message"
              required={true}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={(e) => {
                const lineCount = e.target.value.split("\n").length;
                e.target.rows = lineCount > 10 ? 10 : lineCount;
              }}
            />
            <button
              className="bg-apple-accent-blue hover:bg-apple-accent-blue/90 items-center font-semibold text-white rounded-r-md px-5 py-3 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg active:scale-[0.98]"
              type="submit"
              disabled={disabled}
            >
              Chat
            </button>
          </div>
        </form>
      </div>
    </footer>
  );
};

export default ChatForm;
