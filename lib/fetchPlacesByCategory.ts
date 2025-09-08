"use server"

const fetchPlacesByCategory = async (category: string, lat:number, lng:number) => {
    console.log("catogory fr places : ", category)
    try {
      const res = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/category/${category}?access_token=${process.env.MAPBOX_API_KEY}`
      );

      if (!res.ok) {
        throw new Error(`Mapbox API error: ${res.statusText}`);
      }

      const data = await res.json();
    
      return data.features || [];
    } catch (err: any) {
    console.log(err," MapBoxes fetching nearby places")
      return [];
    } finally {
    }
  };

  export default fetchPlacesByCategory