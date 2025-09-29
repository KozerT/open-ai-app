import "dotenv/config";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import OpenAI from "openai";

const openai = new OpenAI();
const rl = createInterface({ input, output });

// Model that decided which tools to use
const tools: OpenAI.Responses.Tool[] = [
  {
    type: "function",
    name: "get_account_balance",
    description: "Get the balance of a user's account",
    parameters: {
      type: "object",
      properties: {
        account_type: {
          type: "string",
          description: "The type of account: checking, savings, credit",
        },
      },
      required: ["account_type"],
      additionalProperties: false,
    },
    strict: true,
  },
];

const userFinanceData = {
  checking: {
    balance: 1000.45,
    account_number: "1234567890",
  },
  savings: {
    balance: 2000.23,
    account_number: "1234567800",
  },
  credit: {
    balance: -3000.99,
    account_number: "1234507800",
    credit_limit: 10000,
  },
};

type GetAccountBalanceArgs = {
  account_type: string;
};

type FunctoinArgs = GetAccountBalanceArgs;

const executeFunction = (name: string, args: FunctoinArgs): string => {
  if ("get_account_balance" === name) {
    const accountType = args.account_type.toLocaleLowerCase();
    const account =
      userFinanceData[accountType as keyof typeof userFinanceData];

    if (!account) {
      return "Account type not found. Available: checking, savings, credit.";
    }

    if ("credit" === accountType) {
      const creditAccount = account as (typeof userFinanceData)["credit"];
      const available = creditAccount.credit_limit + creditAccount.balance;

      return `Credit Card (${creditAccount.account_number}):
      Balance: $${creditAccount.balance.toFixed(2)}
      Available credit: $${available.toFixed(2)}
      `;
    } else {
      return `${accountType} Account (${
        account.account_number
      }): $${account.balance.toFixed(2)}`;
    }
  }

  return "Unknown function";
};

let conversationHistory: any[] = [
  {
    role: "system",
    content:
      "You are a personal finance assistant. Help users understand their finances by providing helpful financial insights.",
  },
];

console.log("🏦 Personal Finance Assistant");
console.log("💡 Ask me anything about finances!");
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

  // Add user message to conversation
  conversationHistory.push({
    role: "user",
    content: userMessage,
  });

  console.log("\n🤖 AI:");

  // Basic chat response (no tools yet)
  const response = await openai.responses.create({
    model: "gpt-4o",
    input: conversationHistory,
    // TODO: Enable function calling by adding tools parameter
    // - Uncomment tools: tools to give AI access to functions
    tools,
  });

  // Simple response without function calling

  conversationHistory = conversationHistory.concat(response.output);

  // TODO: Add function calling detection and execution
  // - Filter response.output for function_call items
  // - Loop through function calls and execute each one
  // - Add function results back to conversation history
  // - Make second API call to get AI's final response with tool results
  const functionCalls = response.output.filter(
    (item) => item.type === "function_call"
  );

  if (functionCalls.length > 0) {
    console.log("🔨 Using tools...");

    for (const functionCall of functionCalls) {
      const args = JSON.parse(functionCall.arguments);
      const result = executeFunction(functionCall.name, args);
      console.log(`📄 ${functionCall.name}: ${result}`);

      conversationHistory.push({
        type: "function_call_output",
        call_id: functionCall.call_id,
        output: result,
      });
    }

    console.log("\n🤖 AI:");

    const finalResponse = await openai.responses.create({
      model: "gpt-4o",
      input: conversationHistory,
      tools,
    });

    console.log(finalResponse.output_text);

    conversationHistory = conversationHistory.concat(finalResponse.output);
  } else {
    console.log(response.output_text);
  }

  console.log("\n");
}

rl.close();
