import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Dropdown = ({ models, selectedModel, setModel }) => {
  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white dark:bg-kojima-gray px-3 py-2 text-sm font-semibold text-gray-900 dark:text-apple-text-primary shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-kojima-gray/50 hover:bg-gray-50 dark:hover:bg-kojima-gray/80 transition-all duration-200"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
        >
          <span className="mr-1">{selectedModel.emoji}</span>
          {selectedModel.name}
          <ChevronDownIcon
            className="-mr-1 h-5 w-5 text-gray-400 dark:text-apple-text-tertiary"
            aria-hidden="true"
          />
        </button>
      </div>

      <div
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-kojima-darkgray shadow-lg dark:shadow-kojima ring-1 ring-black ring-opacity-5 dark:ring-kojima-gray/30 focus:outline-none transition-all duration-200 hidden group-focus-within:block"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
      >
        <div className="py-1" role="none">
          {models.map((model) => (
            <a
              key={model.id}
              onClick={() => setModel(model)}
              className={`${
                selectedModel.id === model.id
                  ? "bg-gray-100 dark:bg-kojima-gray text-gray-900 dark:text-apple-text-primary"
                  : "text-gray-700 dark:text-apple-text-secondary"
              } block px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-kojima-gray/80 transition-all duration-150`}
              role="menuitem"
              tabIndex="-1"
              id="menu-item-0"
            >
              <div className="flex items-center">
                <span className="mr-2">{model.emoji}</span>
                <div>
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs text-gray-500 dark:text-apple-text-tertiary">
                    {model.description}
                  </div>
                  {model.new && (
                    <span className="inline-flex items-center rounded-md bg-apple-accent-green/10 dark:bg-apple-accent-green/20 px-2 py-1 text-xs font-medium text-apple-accent-green dark:text-apple-accent-green">
                      New
                    </span>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
