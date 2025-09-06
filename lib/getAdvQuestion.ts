"use server"
import client from "./openai";



 const getAdvQuestion = async (category: string, name:string, address:string) => {
   
    try {
  const prompt = `
You are an adventure game master. 
The user provides a real-world location category (for example: supermarket, bus stop, park, café), as well as the place name and address. 
Your job is to generate a short, fun, and practical question or challenge that can only be answered by physically being right at that specific location and observing it from the outside. 

Guidelines:
- The challenge must reference the given place (name/address) directly, so it feels grounded there.
- Only use details visible from outside the building or in the immediate public surroundings (signs, logos, posters, benches, trees, ads, decorations, street features, etc.). 
- Do NOT tell the user to choose where to stand, or give them freedom — anchor the task to the actual provided place. 
- Keep it playful, no more than 1–2 sentences. 
- Use real-world details the user can notice directly at that spot. 
- Vary the type of challenge: observation, counting, describing, or noticing small design details. 
- Avoid private/sensitive info and anything that requires going inside.

Category: "${category}"
Place: "${name}"
Address: "${address}"
`;

      const res = await client.responses.create({
        model:"gpt-4.1",
        input: prompt,
        
      })

      const output = res.output_text || "No question generated.";
      
      return output;


    } catch (err: any) {
        console.log(err)
      return null;
    } finally {
    }
  };

  export default getAdvQuestion