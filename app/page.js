"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import ChatForm from "./components/ChatForm";
import Message from "./components/Message";
import SlideOver from "./components/SlideOver";
import EmptyState from "./components/EmptyState";
import QueuedSpinner from "./components/QueuedSpinner";
import CallToAction from "./components/CallToAction";
import Dropdown from "./components/Dropdown";
import { Cog6ToothIcon, CodeBracketIcon } from "@heroicons/react/20/solid";
import { useCompletion } from "ai/react";
import { Toaster, toast } from "react-hot-toast";
import { LlamaTemplate, Llama3Template } from "../src/prompt_template";
import TokenForm from "./components/TokenForm";

import { countTokens } from "./src/tokenizer.js";

const MODELS = [
  {
    id: "anthropic/claude-4-sonnet",
    name: "Claude 4 Sonnet",
    shortened: "Claude 4",
    emoji: "🧠",
    description: "Anthropic's Claude 4 Sonnet - powerful reasoning and coding",
    new: true,
  },
  {
    id: "meta/meta-llama-3.1-405b-instruct",
    name: "Meta Llama 3.1 405B",
    shortened: "405B",
    emoji: "🦙",
    description: "The most accurate, powerful next generation Llama.",
    new: true,
  },
  {
    id: "meta/meta-llama-3-70b-instruct",
    name: "Meta Llama 3 70B",
    shortened: "70B",
    emoji: "🦙",
    description: "The strong, flexible medium-size Llama.",
    new: true,
  },
  {
    id: "meta/meta-llama-3-8b-instruct",
    name: "Meta Llama 3 8B",
    shortened: "8B",
    emoji: "🦙",
    description: "The fastest and cheapest Llama.",
    new: true,
  },
  {
    id: "meta/llama-2-70b-chat",
    name: "Meta Llama 2 70B",
    shortened: "70B",
    emoji: "🦙",
    description: "The most accurate, powerful Llama 2",
  },
  {
    id: "meta/llama-2-13b-chat",
    name: "Meta Llama 2 13B",
    shortened: "13B",
    emoji: "🦙",
    description: "Faster and cheaper Llama 2 at the expense of accuracy.",
  },
  {
    id: "meta/llama-2-7b-chat",
    name: "Meta Llama 2 7B",
    shortened: "7B",
    emoji: "🦙",
    description: "The smallest, fastest Llama 2 chat model.",
  },
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
  const [tokenFormVisible, setTokenFormVisible] = useState(false);
  const [replicateApiToken, setReplicateApiToken] = useState(null);

  const handleTokenSubmit = (e) => {
    e.preventDefault();
    const token = e.target[0].value
    console.log({token});
    localStorage.setItem("replicate_api_token", token);
    setReplicateApiToken(token);
    setTokenFormVisible(false);
  };

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

  const { complete, completion, setInput, input } = useCompletion({
    api: "/api",
    body: {
      replicateApiToken,
      model: model.id,
      systemPrompt: systemPrompt,
      temperature: parseFloat(temp),
      topP: parseFloat(topP),
      maxTokens: parseInt(maxTokens),
      image: image,
      audio: audio,
    },
    onError: (e) => {
      const errorText = e.toString();
      console.error(`Error converted to text: ${errorText}`);
      setError(e);
    },
    onResponse: (response) => {
      setStarting(false);
      setError(null);
      dispatch({ type: "FIRST_MESSAGE" });
    },
    onFinish: () => {
      dispatch({ type: "COMPLETE" });
    },
  });

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
    setReplicateApiToken(event.target.replicateApiToken.value);
    localStorage.setItem("replicate_api_token", event.target.replicateApiToken.value);
  };

  const handleSubmit = async (userMessage) => {
    setStarting(true);
    const SNIP = "<!-- snip -->";

    const messageHistory = [...messages];
    if (completion.length > 0) {
      messageHistory.push({
        text: completion,
        isUser: false,
      });
    }
    messageHistory.push({
      text: userMessage,
      isUser: true,
    });

    // Generate initial prompt and calculate tokens
    let prompt;
    
    // For Claude models, we handle the prompt differently
    if (model.id.includes("claude")) {
      prompt = generatePrompt(null, systemPrompt, messageHistory);
    } else {
      prompt = `${generatePrompt(
        model.name.includes("Llama 3") ? llama3Template : llamaTemplate,
        systemPrompt,
        messageHistory
      )}\n`;
    }

    console.log(prompt);

    // Check if we exceed max tokens and truncate the message history if so.
    // Skip this for Claude as it handles context differently
    if (!model.id.includes("claude")) {
      while (countTokens(prompt) > MAX_TOKENS) {
        if (messageHistory.length < 3) {
          setError(
            "Your message is too long. Please try again with a shorter message."
          );

          return;
        }

        // Remove the third message from history, keeping the original exchange.
        messageHistory.splice(1, 2);

        // Recreate the prompt
        prompt = `${SNIP}\n${generatePrompt(
          llamaTemplate,
          systemPrompt,
          messageHistory
        )}\n`;
      }
    }

    setMessages(messageHistory);

    dispatch({ type: "START" });

    complete(prompt);
  };

  useEffect(() => {
    if (messages?.length > 0 || completion?.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }

    if (localStorage.getItem("replicate_api_token")) {
      setReplicateApiToken(localStorage.getItem("replicate_api_token"));
      setTokenFormVisible(false);
    } else {
      setTokenFormVisible(true);
    }
  }, [messages, completion]);

  if (tokenFormVisible) {
    return <TokenForm handleTokenSubmit={handleTokenSubmit} />;
  }

  return (
    <div className="flex flex-col h-screen">
      <CallToAction />
      <nav className="pt-2 px-4 sm:px-8 flex items-center">
        <div className="pr-3 font-semibold text-gray-500">Chat with</div>
        <div className="font-semibold text-gray-500 sm:text-center">
          <Dropdown models={MODELS} selectedModel={model} setModel={setModel} />
        </div>
        <div className="flex-grow"></div>
        <div className="justify-end">
          <a
            className="inline-flex items-center px-3 py-2 mr-3 text-sm font-semibold text-gray-700 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            href="https://github.com/replicate/chat"
          >
            <CodeBracketIcon
              className="w-5 h-5 text-gray-500 sm:mr-2 group-hover:text-gray-900"
              aria-hidden="true"
            />{" "}
            <span className="hidden sm:inline">Clone on GitHub</span>
          </a>
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={( ) => setOpen(true)}
          >
            <Cog6ToothIcon
              className="w-5 h-5 text-gray-500 sm:mr-2 group-hover:text-gray-900"
              aria-hidden="true"
            />{" "}
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </nav>

      <Toaster position="top-left" reverseOrder={false} />

      <SlideOver
        open={open}
        setOpen={setOpen}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        replicateApiToken={replicateApiToken}
        setReplicateApiToken={setReplicateApiToken}
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

          {messages.map((message, index) => (
            <Message
              key={`message-${index}`}
              message={message.text}
              isUser={message.isUser}
            />
          ))}
          <Message message={completion} isUser={false} />

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
      />

      {error && <div className="text-red-500 max-w-4xl mx-auto px-4">{error.toString()}</div>}
    </div>
  );
}
