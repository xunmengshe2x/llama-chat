import Replicate from "replicate";
import { ReplicateStream, StreamingTextResponse } from "ai";
export const runtime = "edge";

const VERSIONS = {
  "yorickvp/llava-13b":
    "e272157381e2a3bf12df3a8edd1f38d1dbd736bbb7437277c8b34175f8fce358",
  "nateraw/salmonn":
    "ad1d3f9d2bd683628242b68d890bef7f7bd97f738a7c2ccbf1743a594c723d83",
};

// Validate input parameters
const validateParams = (params) => {
  if (!params) throw new Error("No parameters provided");

  // Validate model parameters
  if (params.maxTokens && (params.maxTokens < 1 || params.maxTokens > 4096)) {
    throw new Error("maxTokens must be between 1 and 4096");
  }
  if (params.temperature && (params.temperature < 0 || params.temperature > 1)) {
    throw new Error("temperature must be between 0 and 1");
  }
  if (params.topP && (params.topP < 0 || params.topP > 1)) {
    throw new Error("topP must be between 0 and 1");
  }

  // Validate prompt
  if (!params.prompt || typeof params.prompt !== 'string') {
    throw new Error("prompt must be a non-empty string");
  }

  // Validate file URLs if present
  if (params.image && typeof params.image !== 'string') {
    throw new Error("image must be a valid URL string");
  }
  if (params.audio && typeof params.audio !== 'string') {
    throw new Error("audio must be a valid URL string");
  }
};

export async function POST(req) {
  try {
    const params = await req.json();
    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for");

    if (!ip) {
      console.error("IP address is null");
      return new Response("IP address could not be retrieved", { status: 500 });
    }

    // Validate input parameters
    validateParams(params);

    // Only use environment variable for API token
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      return new Response("API configuration error", { status: 500 });
    }

    params.replicateClient = new Replicate({
      auth: apiToken,
      userAgent: "llama-chat",
    });

    let response;
    if (params.image) {
      response = await runLlava(params);
    } else if (params.audio) {
      response = await runSalmonn(params);
    } else {
      response = await runLlama(params);
    }

    // Convert the response into a friendly text-stream
    const stream = await ReplicateStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("API Error:", error);
    return new Response(error.message, { status: 400 });
  }
}

async function runLlama({
  replicateClient,
  model,
  prompt,
  systemPrompt,
  maxTokens,
  temperature,
  topP,
}) {
  console.log("running llama");
  console.log("model", model);
  console.log("maxTokens", maxTokens);

  let input;
  if (model.includes("claude")) {
    // For Claude, use the prompt directly as it's already formatted
    input = {
      prompt: prompt,
      max_tokens: Math.max(1024, maxTokens), // Claude requires minimum 1024
      temperature: temperature,
      top_p: topP,
    };
  } else {
    try {
      // Check if the prompt is a JSON string containing message history
      const parsedPrompt = JSON.parse(prompt);
      if (parsedPrompt.messages && Array.isArray(parsedPrompt.messages)) {
        input = {
          prompt: `${prompt}`,
          max_new_tokens: maxTokens,
          ...(model.includes("llama3")
            ? { max_tokens: maxTokens }
            : { max_new_tokens: maxTokens }),
          temperature: temperature,
          repetition_penalty: 1,
          top_p: topP,
        };
      }
    } catch (e) {
      // If not JSON, use regular prompt format
      input = {
        prompt: `${prompt}`,
        max_new_tokens: maxTokens,
        ...(model.includes("llama3")
          ? { max_tokens: maxTokens }
          : { max_new_tokens: maxTokens }),
        temperature: temperature,
        repetition_penalty: 1,
        top_p: topP,
      };
    }
  }

  console.log("Sending input to model:", input);

  return await replicateClient.predictions.create({
    model: model,
    stream: true,
    input: input,
  });
}

async function runLlava({ replicateClient, prompt, maxTokens, temperature, topP, image }) {
  console.log("running llava");

  return await replicateClient.predictions.create({
    stream: true,
    input: {
      prompt: `${prompt}`,
      top_p: topP,
      temperature: temperature,
      max_tokens: maxTokens,
      image: image,
    },
    version: VERSIONS["yorickvp/llava-13b"],
  });
}

async function runSalmonn({ replicateClient, prompt, maxTokens, temperature, topP, audio }) {
  console.log("running salmonn");

  return await replicate.predictions.create({
    stream: true,
    input: {
      prompt: `${prompt}`,
      top_p: topP,
      temperature: temperature,
      max_length: maxTokens,
      wav_path: audio,
    },
    version: VERSIONS["nateraw/salmonn"],
  });
}
