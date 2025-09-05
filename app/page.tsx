import Timer from "./components/Timer";
import NearMystery from "./components/NearMystery";

export async function generateAdventureQuestion(category: string): Promise<string> {
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

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: prompt,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.output[0].content[0].text as string;
}




async function Home() {
  const mapboxApiKey = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
  console.log(mapboxApiKey, " apikey")
  try {
    const resCategory = await fetch(`https://api.mapbox.com/search/searchbox/v1/list/category?access_token=${mapboxApiKey}`);

    if (!resCategory.ok) {
      throw new Error("Network response was not ok");
    }

    const categories = await resCategory.json();

    // The data is now available here
    //console.log(categories?.listItems?.slice(0, 20));

    // of the selected category, get nearby places. but this is server function. so dummy fr now. 

    // const getPlacesQuestion= async (category:string)=>{
    const category = "grocery"
    try {
      const resPlaces = await fetch(`https://api.mapbox.com/search/searchbox/v1/category/${category}?access_token=${mapboxApiKey}`);

      if (!resCategory.ok) {
        throw new Error("Network response was not ok");
      }

      const places = await resPlaces.json();

      console.log(places, " places")
    } catch (e) {
      console.log(e)
    }
    //  }

    // dummy getting openAI question 

    const prompt = `
You are an adventure game master. 
The user selects a real-world location category (for example: supermarket, bus stop, park, café). 
Your job is to generate a short, fun, and practical question or challenge that can only be answered by physically being there and observing the environment. 

Guidelines:
- Keep it playful, no more than 1–2 sentences. 
- Use real-world details the user can notice (e.g., colors, signs, objects, numbers, ads, people, surroundings). 
- Vary the type of challenge: observation, counting, describing. 
- Avoid questions that require private or sensitive info.
- Make it feel like a micro-adventure.

Category: "${category}"
`;


    return (
      <div className="font-sans flex flex-col gap-4 items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
        <div className="border-2 rounded-md">
          <Timer />
        </div>
        <div className="border-2 rounded-md">
          <NearMystery categories={categories?.listItems?.slice(0, 20)} />
        </div>
      </div>
    );
  } catch (err) {
    console.error("Error fetching API:", err);
    // You can return a fallback UI here
    return <div>Error loading data.</div>;
  }

}

export default Home