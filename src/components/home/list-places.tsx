'use client'

import { Place } from "./place"
import useSupabaseClient from "@/lib/supabase/client"
import { useQuery } from "react-query"
import { PlacesSkeletons } from "../skeleton"

export const ListPlaces = () => {
  const supabase = useSupabaseClient()
  const { data: places, isLoading, isError } = useQuery({ 
    queryKey: ['posts'], 
    queryFn: async () => {
      const { data } = await supabase.from('places').select().order('inserted_at', { ascending: false })
      return data
    } 
  })

  if (isLoading) {
    return <PlacesSkeletons />
  }

  if (isError) {
    return <p>Hubo un error al cargar los lugares.</p>
  }

  if (places && places.length === 0) {
    return <p>No hay lugares agregados a la lista.</p>
  }

  return (
    <ol className="flex flex-col gap-4" reversed>
      {places?.map((place: any) => (
        <li key={place.id} className="flex flex-col gap-2">
          <Place {...place} />
        </li>
      ))}
    </ol>
  )
}

