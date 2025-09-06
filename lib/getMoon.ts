"use server"

export const getMoon = async()=> {
  const options = {
  method: 'GET',
  headers: {
'X-RapidAPI-Key': process.env.MOON_KEY!,
    'X-RapidAPI-Host': 'moon-phase.p.rapidapi.com'
  }
};

try {
  const response = await fetch('https://moon-phase.p.rapidapi.com/advanced', options);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  const data = await response.json();
  console.log(data);
  return data
} catch (error) {
  console.error(error);
}

}