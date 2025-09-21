import "dotenv/config";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import OpenAI from "openai";

const openai = new OpenAI();
const rl = createInterface({ input, output });

let conversationHistory =
  "You are an AI assistant. Be friendly, concise and remember what user tells you throghout our chat.\n\n";

console.log("🤖 AI Bot ");
console.log("💡 Type 'exit' or 'quit' to end chat\n");

while (true) {
  const userMessage = await rl.question("You: ");

  if (
    userMessage.toLowerCase() === "exit" ||
    userMessage.toLowerCase() === "quit"
  ) {
    console.log("\n🤖 Thanks for chatting! Bye!");
    break;
  }

  conversationHistory += `User: ${userMessage}\n`;
  const prompt = conversationHistory + "Assistant: ";

  console.log("\n🤖 AI:");
}
