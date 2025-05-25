"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import ChatForm from "./components/ChatForm";
import MessageGroup from "./components/MessageGroup";
import SlideOver from "./components/SlideOver";
import EmptyState from "./components/EmptyState";
import QueuedSpinner from "./components/QueuedSpinner";
import CallToAction from "./components/CallToAction";
import { Cog6ToothIcon } from "@heroicons/react/20/solid";
import { useCompletion } from "ai/react";
import { Toaster, toast } from "react-hot-toast";
import { LlamaTemplate, Llama3Template } from "../src/prompt_template";

import { countTokens } from "./src/tokenizer.js";

const MODELS = [
  {
    id: "anthropic/claude-4-sonnet",
    name: "Claude 4 Sonnet",
    shortened: "Claude 4",
    emoji: "🧠",
    description: "Anthropic's Claude 4 Sonnet - powerful reasoning and coding",
  }
];

const llamaTemplate = LlamaTemplate();
const llama3Template = Llama3Template();

const generatePrompt = (template, systemPrompt, messages) => {
  // For Claude models, we don't need to use a template
  if (template === null) {
    const chat = messages.map((message) => ({
      role: message.isUser ? "user" : "assistant",
      content: message.text,
    }));

    // Return just the last user message as the prompt
    // System prompt is handled separately for Claude
    const lastUserMessage = messages[messages.length - 1];
    return lastUserMessage.text;
  }

  const chat = messages.map((message) => ({
    role: message.isUser ? "user" : "assistant",
    content: message.text,
  }));

  return template([
    {
      role: "system",
      content: systemPrompt,
    },
    ...chat,
  ]);
};

const metricsReducer = (state, action) => {
  switch (action.type) {
    case "START":
      return { startedAt: new Date() };
    case "FIRST_MESSAGE":
      return { ...state, firstMessageAt: new Date() };
    case "COMPLETE":
      return { ...state, completedAt: new Date() };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
};

export default function HomePage() {
  const MAX_TOKENS = 8192;
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(false);

  //   Llama params
  const [model, setModel] = useState(MODELS[0]); // default to Claude 4 Sonnet
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful assistant."
  );
  const [temp, setTemp] = useState(0.75);
  const [topP, setTopP] = useState(0.9);
  const [maxTokens, setMaxTokens] = useState(800);

  //  Llava params
  const [image, setImage] = useState(null);

  // Salmonn params
  const [audio, setAudio] = useState(null);

  const [metrics, dispatch] = useReducer(metricsReducer, {
    startedAt: null,
    firstMessageAt: null,
    completedAt: null,
  });

  const { complete, completion, setInput, input, isLoading } = useCompletion({
    api: "/api",
    body: {
      model: model.id,
      systemPrompt: systemPrompt,
      temperature: parseFloat(temp),
      topP: parseFloat(topP),
      maxTokens: parseInt(maxTokens),
      image: image,
      audio: audio,
    },
    id: "chat",
    onError: (e) => {
      const errorText = e.toString();
      console.error(`Error converted to text: ${errorText}`);
      setError(e);
      setStarting(false);
    },
    onResponse: (response) => {
      setStarting(false);
      setError(null);
      dispatch({ type: "FIRST_MESSAGE" });
    },
    onFinish: () => {
      dispatch({ type: "COMPLETE" });
      setStarting(false);
    },
  });

  // Load messages from localStorage on initial render
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatHistory');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      localStorage.removeItem('chatHistory');
    }
  }, []);

  // Save messages to localStorage whenever they change or when completion changes
  useEffect(() => {
    if (Array.isArray(messages)) {
      // Create a copy of messages
      let messageHistory = [...messages];

      // If there's a completion and the last message isn't from the assistant,
      // add the completion as an assistant message
      if (completion && completion.trim() &&
        (messageHistory.length === 0 || messageHistory[messageHistory.length - 1].isUser)) {
        messageHistory.push({
          text: completion,
          isUser: false
        });
      }

      // Only save if we have messages
      if (messageHistory.length > 0) {
        localStorage.setItem('chatHistory', JSON.stringify(messageHistory));
      } else {
        localStorage.removeItem('chatHistory');
      }
    }
  }, [messages, completion]);

  const clearHistory = () => {
    setMessages([]);
    setInput('');
    setError(null);
    setStarting(false);
    // Clear localStorage
    localStorage.removeItem('chatHistory');
    // Reset the metrics
    dispatch({ type: "START" });
  };

  const handleFileUpload = (file) => {
    if (file) {
      // determine if file is image or audio
      if (
        ["audio/mpeg", "audio/wav", "audio/ogg"].includes(
          file.originalFile.mime
        )
      ) {
        setAudio(file.fileUrl);
        setModel(MODELS[5]);
        toast.success(
          "You uploaded an audio file, so you're now speaking with Salmonn."
        );
      } else if (["image/jpeg", "image/png"].includes(file.originalFile.mime)) {
        setImage(file.fileUrl);
        setModel(MODELS[4]);
        toast.success(
          "You uploaded an image, so you're now speaking with Llava."
        );
      } else {
        toast.error(
          `Sorry, we don't support that file type (${file.originalFile.mime}) yet. Feel free to push a PR to add support for it!`
        );
      }
    }
  };

  const setAndSubmitPrompt = (newPrompt) => {
    handleSubmit(newPrompt);
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    setSystemPrompt(event.target.systemPrompt.value);
  };

  const handleSubmit = async (userMessage) => {
    // Prevent empty messages
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim() === '') {
      return;
    }

    setStarting(true);
    setError(null);
    const SNIP = "<!-- snip -->";

    const messageHistory = [...messages];
    if (completion && completion.trim()) {
      messageHistory.push({
        text: completion,
        isUser: false,
      });
    }
    messageHistory.push({
      text: userMessage,
      isUser: true,
    });

    setMessages(messageHistory);

    // For Claude models, format messages properly
    if (model.id.includes("claude")) {
      const formattedMessages = messageHistory.map(msg => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.text.trim()
      })).filter(msg => msg.content !== '');

      if (formattedMessages.length === 0) {
        setStarting(false);
        return;
      }

      // Format conversation for Claude
      const conversationString = formattedMessages
        .map(msg => `${msg.role === 'user' ? 'Human: ' : 'Assistant: '}${msg.content}`)
        .join('\n\n');

      complete(conversationString + '\n\nAssistant: ');
    } else {
      let prompt = generatePrompt(
        model.name.includes("Llama 3") ? llama3Template : llamaTemplate,
        systemPrompt,
        messageHistory
      );

      // Check if we exceed max tokens and truncate the message history if so.
      while (countTokens(prompt) > MAX_TOKENS) {
        if (messageHistory.length < 3) {
          setError(
            "Your message is too long. Please try again with a shorter message."
          );
          return;
        }
        // Remove the third message from history, keeping the original exchange.
        messageHistory.splice(1, 2);
        prompt = `${SNIP}\n${generatePrompt(
          llamaTemplate,
          systemPrompt,
          messageHistory
        )}\n`;
      }

      complete(prompt);
    }

    dispatch({ type: "START" });
  };

  useEffect(() => {
    if (messages?.length > 0 || completion?.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, completion]);

  return (
    <div className="flex flex-col h-screen">
      <CallToAction />
      <nav className="pt-2 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="pr-3 font-semibold text-gray-500">Chat with</div>
          <div className="font-semibold text-gray-500 sm:text-center flex items-center">
            <div className="flex items-center bg-gray-900 rounded-md shadow-sm px-3 py-2 text-white">
              <span className="mr-2">{model.emoji}</span>
              <span>{model.name}</span>
            </div>
            <button
              type="button"
              className="ml-2 inline-flex items-center p-2 text-sm font-semibold text-white bg-gray-900 rounded-md shadow-sm hover:bg-gray-800"
              onClick={() => setOpen(true)}
            >
              <Cog6ToothIcon
                className="w-5 h-5 text-gray-300 group-hover:text-white"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-white bg-gray-900 rounded-md shadow-sm hover:bg-gray-800 transition-colors"
          >
            Clear Chat
          </button>
        )}
      </nav>

      <Toaster position="top-left" reverseOrder={false} />

      <SlideOver
        open={open}
        setOpen={setOpen}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        handleSubmit={handleSettingsSubmit}
        temp={temp}
        setTemp={setTemp}
        maxTokens={maxTokens}
        setMaxTokens={setMaxTokens}
        topP={topP}
        setTopP={setTopP}
        models={MODELS}
        size={model}
        setSize={setModel}
      />

      <div className="flex-grow overflow-auto px-4 pt-2">
        <div className="max-w-4xl mx-auto">
          <EmptyState setPrompt={setAndSubmitPrompt} setOpen={setOpen} />

          <MessageGroup messages={messages} completion={completion} />

          {starting && <QueuedSpinner />}

          <div ref={bottomRef} />
        </div>
      </div>

      <ChatForm
        prompt={input}
        setPrompt={setInput}
        onSubmit={handleSubmit}
        handleFileUpload={handleFileUpload}
        completion={completion}
        metrics={metrics}
        disabled={starting || isLoading}
      />

      {error && <div className="text-red-500 max-w-4xl mx-auto px-4">{error.toString()}</div>}
    </div>
  );
}
