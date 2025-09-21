import "dotenv/config";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI(); // to load keys from the .env vars


const FeedbackSchema = z.object({
    sentiment: z.enum(["positive", "neutral", "negative"]),
    summary: z.string(),
    customer_name: z.string()
})

const emailExample = `
From: Tomas Eddisson <tomas.eddisson@gmail.com>
Subject: Excellent Experience with the kolibrium.dev Library!

Hello Kolibrium.dev Team,

I wanted to send a quick note to express how impressed I am with your library.

I recently integrated kolibrium.dev into a new project, and the entire experience has been fantastic. The documentation is incredibly clear and the API is intuitive, which allowed me to get up and running in a fraction of the time I had anticipated.

The performance is excellent, and the library solved a major challenge we were facing with state synchronization.

Thank you for creating such a high-quality, developer-friendly tool. Keep up the phenomenal work!

Best regards,
A Happy Developer
`

const response = await openai.responses.parse({
    model: "gpt-4o-mini",
    input: [ 
        //system
        {
            role: "system",
            content:'You are a customer support. Extract key information from customer emails and respond in the requested format  '
        },
        //user
        {
            role: "user",
            content: emailExample
        },    
//assistant
     
    ], 
    text: {
        format: zodTextFormat(
            FeedbackSchema,
            "feedback_extraction"
        
        ),
    }
})

const feedback = response.output_parsed;

console.log('/n Here is the output')
console.log(JSON.stringify(feedback, null, 2));