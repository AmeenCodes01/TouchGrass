import Timer from "./components/Timer";
import NearMystery from "./components/NearMystery";
import ToDo from "./components/ToDo";
import Moon from "./components/Moon";
import IntroDialog from "./components/IntroDialog";



async function Page() {
  const mapboxApiKey = process.env.MAPBOX_API_KEY;
  try {
    const resCategory = await fetch(`https://api.mapbox.com/search/searchbox/v1/list/category?access_token=${mapboxApiKey}`);

    if (!resCategory.ok) {
      throw new Error("Network response was not ok");
    }

    const categories = await resCategory.json();

    // The data is now available here
    //console.log(categories?.listItems?.slice(0, 20));

    // of the selected category, get nearby places. but this is server function. so dummy fr now. 

   
  


    return (
      <div style={{
    //    backgroundImage:  `url(clouds.jpeg)`
      }} className=" w-full flex flex-col  bg-gradient-to-tr from-sky-300 via-blue-100 to-blue-400 gap-4 items-center md:items-start  justify-center min-h-screen p-2 pb-8 gap-16 sm:p-8">
     <IntroDialog/>

       <div className="bg-transparent flex md:flex-row flex-col w-full gap-8  ">
        <div className="border-2 h-fit rounded-md">
          <Timer />
        </div>
        <div className="border-2 rounded-2xl  w-fit h-fit rounded-md">
          <NearMystery categories={categories?.listItems?.slice(0, 20)} />
        </div>
        <div className=" w-fit h-fit ml-auto flex ">
          <Moon/>

        </div>
        </div> 

      <div>
        <ToDo/>
      </div>

      </div>
    );
  } catch (err) {
    console.error("Error fetching API:", err);
    // You can return a fallback UI here
    return <div>Error loading data.</div>;
  }

}

export default Page