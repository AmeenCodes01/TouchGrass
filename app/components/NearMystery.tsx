"use client"
import React, { useEffect } from 'react'
import useGetCoord from '../hooks/useGetCoord'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
   DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import usePersistState from '../hooks/usePersistState'
import { useMapboxPlaces } from '../hooks/useMapBoxPlaces'
import { useAdventureQuestion } from '../hooks/useAdventureQuestion'


function NearMystery({ categories }: { categories: any }) {

    const { places, loading: loadingPlaces, error: placesError, fetchPlacesByCategory } =
    useMapboxPlaces();

    const { question, loading: loadingQuestion, error: questionError, generateAdventureQuestion } =
    useAdventureQuestion();
    const [category,setCategory]=usePersistState(null,"TCcategory")

    const { coords, getLocation, error } = useGetCoord()
    useEffect(() => {
        getLocation()
    }, [])

    const handleAdventure = async () => {
    // Step 1: fetch places
    const foundPlaces = await fetchPlacesByCategory(category.canonical_id);

    if (foundPlaces.length > 0) {
      // Step 2: generate a question for the category (or even specific place)
      await generateAdventureQuestion(category.canonical_id);
    }
  };

    return (
        <div className='flex flex-col gap-4 p-2'>

            <Button onClick={getLocation}>Get My Location</Button>
            {coords && <p>Lat: {coords.lat}, Lng: {coords.lng}</p>}
            {error && <p>{error}</p>}

            <div>
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button>
                            Choose Category
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
 <Button onClick={()=>handleAdventure()}>
                           Generate Question
                        </Button>

 {placesError && <p className="text-red-500">{placesError}</p>}
      {questionError && <p className="text-red-500">{questionError}</p>}


{question && (
        <p className="mt-6 text-lg font-semibold">🗺️ Adventure Question: {question}</p>
      )}
        </div>
    )
}

export default NearMystery