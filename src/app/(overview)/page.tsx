'use client'

import { ListPlaces } from "@/components/home/list-places"
import { buttonVariants } from "@/components/ui/button"
import useSupabaseClient from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Session } from "inspector"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Home() {
  const supabase = useSupabaseClient()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession()
      .then((se) => {
        // @ts-ignore
        setSession(prevState => se.data.session) // Update the argument type to se.data.session
        return
      })
  }, [])

  return (
    <>
      <header className="flex justify-between items-center">
        <h2 className="text-4xl font-bold">Últimos lugares</h2>

        {session && (
          <Link href="/places/create" className={cn(buttonVariants({ variant: "secondary" }))}>
            Añadir lugar +
          </Link>
        )}
      </header>

      <ListPlaces />
    </>
  )
}
