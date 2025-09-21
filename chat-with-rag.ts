import "dotenv/config";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import OpenAI from "openai";

const openai = new OpenAI();
const rl = createInterface({ input, output });

interface DocumentChank { 
    content: string;
    //Metadata here helps  track the sources and just organize the info
    metadata: {
        filename: string;

    };
    embadding: number[];
}



let knowladgeBase: DocumentChank[] = []
//function that loads our md files from the knowladge base. At this point we are not creating any embeddings.
function loadKB(): Omit<DocumentChank, "embadding">[] {
    // 1.getting KB current process directory with the files, also joing to passes
    const kbDir = join(process.cwd(), "knowladge");
    //2. next we need to get all of the md files from that diretory 
    const files = readdirSync(kbDir).filter((file) => file.endsWith(".md"));

    const docs: Omit<DocumentChank, "embadding">[] = []

// The next step would be to iterate over every single file, get the data from the file, split it into
// chunks and add to this array of documents, and then return that.
    for (const file of files) {
      const content = readFileSync(join(kbDir, file), "utf8");
        //we need to spit into perfect chank of content 
        const chunkSize = 1000; // #of characters
        const chunks: string[] = [];

        for (let i = 0; i < content.length; i += chunkSize) {
            const slice = content.slice(i, i + chunkSize).trim();
            if (slice.length > 0) chunks.push(slice);          
        }

        if (chunks.length > 1) {
            const last = chunks[chunks.length - 1]!;

            if (last?.length < 200) {
                chunks[chunks.length - 2] = `${chunks[chunks.length - 2]} ${last}`;
                chunks.pop();
                
            }
        }

        chunks.forEach((chunk) => { 
            docs.push({
                content: chunk.trim(),
                metadata: {
                    filename: file,
                },
            });
            console.log(`${file} chunk length: ${chunk.length}`) 
        })
    }

    return docs;

}

async function createEmbeddings(texts: string[]): Promise<number[][]> {
    const reponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: texts,
    });
    return reponse.data.map((item) => item.embedding);
}


async function initKB(): Promise<void> {
    console.log("Loading knowladge base...")
    const docs = loadKB();

    const texts = docs.map((doc) => doc.content);
    const embeddings = await createEmbeddings(texts);

    knowladgeBase = docs.map((doc, index) => ({
        ...doc,
        embadding: embeddings[index]!   
    }))
       console.log(`✅ Knowladge bases ready with ${knowladgeBase.length} documents \n`)
}


let conversationHistory =
  "You are an AI assistant. Be friendly, concise and remember what user tells you throghout our chat.\n\n";

console.log("🤖 AI Bot ");
console.log("💡 Type 'exit' or 'quit' to end chat\n");

initKB();

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