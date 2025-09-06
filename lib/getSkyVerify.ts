"use server"
import fs from "fs";
import client from "./openai";


export async function getSkyVerify(imageUrl: string, secretCode: string){


    
    const response = await client.responses.create({
        model: "gpt-4.1-mini",
        input: [
            {
                role: "user",
                content: [
{
  type: "input_text",
  text: `
You are a validator. The user uploads a photo of the sky with a piece of paper showing a handwritten code. 
You will be given a code to check.

Steps:
1. Confirm if the photo shows the sky in the background.
2. Check if the handwritten text on the paper contains the given code.
3. Respond in JSON with two fields:
   {
     "sky": true/false,
     "codeMatch": true/false
   }
Only return valid JSON, nothing else.

Code to match: "${secretCode}"
`
}
,                              { type: "input_image", image_url: imageUrl, detail:"auto" },

                ],
            },
        ],
    });
   try {
    const jsonStr = response.output_text;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse response:", e);
    return { sky: false, codeMatch: false };
  }

}