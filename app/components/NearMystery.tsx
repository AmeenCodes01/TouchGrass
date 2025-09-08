"use client"
import React, { useEffect, useState } from 'react'
import useGetCoord from '../hooks/useGetCoord'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
   DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import usePersistState from '../hooks/usePersistState'
import fetchPlacesByCategory from '@/lib/fetchPlacesByCategory'
import getAdvQuestion from '@/lib/getAdvQuestion'
import { ArrowDown } from 'lucide-react'
import useGrass from '../store/useGrass'


function NearMystery({ categories }: { categories: any }) {

    const [category,setCategory]=usePersistState(null,"TCcategory")
    const {question,setQuestion}=useGrass(state=> state)
    const [places,setPlaces]=usePersistState(null, "TCplaces")
    const [loading,setLoading] = useState(false)
    const { coords, getLocation, error } = useGetCoord()
    useEffect(() => {
        getLocation()
    }, [])

 useEffect(() => {
    useGrass.persist.rehydrate();
  }, [])
    const handleAdventure = async () => {
        setLoading(true)
        
    // Step 1: fetch places
    const foundPlaces = await fetchPlacesByCategory(category?.canonical_id, coords?.lat, coords?.lng);
        console.log(foundPlaces, " foundPlaces")
    setPlaces(foundPlaces)
    if (foundPlaces.length > 0) {
        //select a random place. we will check if place prev done w convex id but fr now random.
        const selectedPlace = foundPlaces[Math.floor(Math.random() * foundPlaces.length)]
      // Step 2: generate a question for the category (or even specific place)
    const question =  await getAdvQuestion(category?.canonical_id,selectedPlace.properties.name, selectedPlace.properties.full_address );
    console.log(question)
    setQuestion(question)
    setLoading(false)
    }
  };

    return (
        <div className='flex flex-col gap-4 p-2 max-w-[400px] w-fit justify-center items-center'>

            <Button onClick={getLocation}>{coords ? "New Location":"Get My Location"}</Button>
            {coords && <p>Lat: {coords.lat}, Lng: {coords.lng}</p>}
            {error && <p>{error}</p>}

            <div>
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button variant={"outline"} className='border-2'>
                          {category ? category?.name:"  Choose Category  "} <ArrowDown/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {
                            categories?.map((c) => (

                                <DropdownMenuLabel
                                onClick={()=>setCategory(c)}
                                key={c.uuid}>{c.name}</DropdownMenuLabel>
                            ))
                        }

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
 <Button onClick={()=>handleAdventure()} 
    disabled={loading}
    >
                         {loading ?"Generating Question......" :"Generate Question" } 
                        </Button>



{question && !loading && (
        <p className="mt-6 text-md italic text-wrap font-lightbold">🗺️ Adventure Question: <br/> {question}</p>
      )} (click below on To-do to answer)
        </div>
    )
}

export default NearMystery