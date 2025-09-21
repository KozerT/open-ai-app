
import "dotenv/config";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import OpenAI from "openai";

const openai = new OpenAI();
const rl = createInterface({ input, output });

let conversationHistory =
  "You are a helpful AI assistant. Be conversational, friendly, and remember what user tells you throghout our chat.\n\n";

console.log("🤖 AI SEARCH CHAT");
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

    const stream = await openai.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
        stream: true,
        tools: [{type: "web_search_preview" }] //  tools would be called by ai
  });

  let aiResponse = "";

  for await (const event of stream) {
    if (event.type === "response.output_text.delta") {
      process.stdout.write(event.delta);
      aiResponse += event.delta;
    } else if (event.type === 'response.web_search_call.searching') {
        process.stdout.write("Searching the web for the answer...\n")
    } else if (event.type === 'response.web_search_call.completed') {
        process.stdout.write("Done\n")
    }
  }

  console.log("\n\n");

  conversationHistory += `Assistant: ${aiResponse}\n\n`;
}

rl.close();