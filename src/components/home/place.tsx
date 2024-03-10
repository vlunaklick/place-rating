'use client'

import { useQuery } from "react-query"
import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"
import useSupabaseClient from "@/lib/supabase/client"
import { IconBurger, IconMessage2 } from "@tabler/icons-react"
import { Skeleton } from "../ui/skeleton"

export const Place = ({ id, name, description, link }: { id: string, name: string, description: string, link: string }) => {
  const supabase = useSupabaseClient()
  const { data: countComments, isLoading: isLoadingCountComments, isError: isErrorCountComments } = useQuery({ 
    queryKey: ['posts', id, 'comments'], 
    queryFn: async () => {
      const data = await supabase.from('comments').select().eq('place_id', id)
      return data
    } 
  })

  const { data: stars, isLoading: isLoadingStars, isError: isErrorStars } = useQuery({ 
    queryKey: ['posts', id, 'stars'], 
    queryFn: async () => {
      const data = await supabase.from('stars').select().eq('place_id', id)
      return data
    } 
  })

  return (
    <article className="flex flex-col gap-2 border p-4 rounded-md dark:border-neutral-700">
      <header className="flex gap-2 items-center">
        <h3 className="text-xl font-bold mr-auto">{name}</h3>
        <BurgersDisplay stars={stars?.data || []} isLoading={isLoadingStars} isError={isErrorStars} />
        <div className="flex gap-2 items-center ml-4">
          <IconMessage2 size={20} className="stroke-neutral-500" />
          {isLoadingCountComments && <Skeleton className="w-5 h-5" />}
          {isErrorCountComments && '0'}
          {!isLoadingCountComments && !isErrorCountComments && countComments?.data?.length}
        </div>
      </header>

      <p className="text-neutral-700 dark:text-neutral-300">{description}</p>
      <a 
        href={`https://instagram.com/${link}`}
        className={cn(
          buttonVariants({ variant: "link" }), 
          "text-blue-500 items-start w-max p-0 h-auto dark:text-blue-400"
        )}
        target="_blank"
        rel="noreferrer"
      >
        Redes
      </a>
    </article>
  )
}

const BurgersDisplay = ({ stars, isLoading, isError }: { stars: any, isLoading: boolean, isError: boolean }) => {

  if (isLoading || isError) {
    return (
      <div className="flex gap-2 items-center">
        <div className="flex">
          <IconBurger size={20} color="gray" />
          <IconBurger size={20} color="gray" />
          <IconBurger size={20} color="gray" />
          <IconBurger size={20} color="gray" />
          <IconBurger size={20} color="gray" />
        </div>
        {isLoading && <Skeleton className="w-5 h-5" />}
        {isError && '0'}
      </div>
    )
  }

  const calculateTotalStars = (stars: any) => {
    if (!stars) return 0
    if (stars.length === 0) return 0

    return stars?.reduce((acc: number, star: any) => acc + star.stars, 0) / stars?.length
  }

  const totalStars = calculateTotalStars(stars)
  
  const fullBurgers = Math.floor(totalStars)
  const halfBurger = totalStars % 1 !== 0 ? (
    <div style={{ position: 'relative' }}>
      <IconBurger size={20} color="gray" />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
        <IconBurger size={20} color="currentColor" />
      </div>
    </div>
  ) : null
  const emptyBurgers = 5 - Math.ceil(totalStars)

  return (
    <div className="flex gap-2 items-center">
      <div className="flex">
        {[...Array(fullBurgers)].map((_, i) => (
          <IconBurger key={i} size={20} color="currentColor" />
        ))}
        {halfBurger}
        {[...Array(emptyBurgers)].map((_, i) => (
          <IconBurger key={i + fullBurgers} size={20} className="stroke-neutral-500" />
        ))}
      </div>
      <span>{Number.isInteger(totalStars) ? totalStars : totalStars.toFixed(2)}</span>
    </div>
  )
}