'use client'

import { Place } from "./place"
import useSupabaseClient from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export const ListPlaces = () => {
  const supabase = useSupabaseClient()
  const [places, setPlaces] = useState<any[] | null>([])

  useEffect(() => {
    const fetchPlaces = async () => {
      const { data } = await supabase.from('places').select().order('inserted_at', { ascending: false })
      setPlaces(data)
    }

    fetchPlaces()
  }, [])

  if (!places) {
    return null
  }

  if (places.length === 0) {
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

