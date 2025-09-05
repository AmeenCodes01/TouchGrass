import { useState } from "react";
import OpenAI from "openai";

// const client = new OpenAI({apiKey:process.env.NEXT_PUBLIC_OPENAI_API_KEY,dangerouslyAllowBrowser: true });
// console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY," openAI KEY", client)
export function useAdventureQuestion() {
  const [question, setQuestion] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateAdventureQuestion = async (category: string) => {
    setLoading(true);
    setError(null);
    try {
      const prompt = `
You are an adventure game master. 
The user selects a real-world location category (for example: supermarket, bus stop, park, café). 
Your job is to generate a short, fun, and practical question or challenge that can only be answered by physically being there and observing the environment. 

Guidelines:
- Keep it playful, no more than 1–2 sentences. 
- Use real-world details the user can notice (e.g., colors, signs, objects, numbers, ads, people, surroundings). 
- Vary the type of challenge: observation, counting, describing, or interaction. 
- Avoid questions that require private or sensitive info.
- Make it feel like a micro-adventure.

Category: "${category}"
`;
    //   const res = await client.responses.create({
    //     model:"gpt-4.1",
    //     input: prompt,
        
    //   })

    //   if (!res.ok) {
    //     throw new Error(`OpenAI API error: ${res.statusText}`);
    //   }

    //   const output = res.output_text || "No question generated.";
    //   setQuestion(output);
    //   return output;

    } catch (err: any) {
      setError(err.message || "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { question, loading, error, generateAdventureQuestion };
}
