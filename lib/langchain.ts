// lib/langchain.ts
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";

export function getOpenAIChatModel() {
    return new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        model: "gpt-4o-mini",
        temperature: 0.3,
    });
}

export function getOpenAIEmbeddings() {
    return new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
        model: "text-embedding-3-large",
    });
}
