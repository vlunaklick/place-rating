'use client'

import { CommentsForm } from "@/components/place/comment-form"
import { CommentsList } from "@/components/place/comments"
import { BurgerSelector, BurgersDisplay } from "@/components/place/stars"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import useSupabaseClient from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"

export default function Page({ params: {
  id
} }: { params: { id: string } }) {
  const supabase = useSupabaseClient()
  const [session, setSession] = useState(null)

  const { data: place, isLoading: isLoadingPlace, isError: isErrorPlace } = useQuery({ 
    queryKey: ['places', id],
    queryFn: async () => {
      const data = await supabase.from('places').select('*').eq('id', id)
      return data
    } 
  })

  const { data: stars, isLoading: isLoadingStars, isError: isErrorStars } = useQuery({
    queryKey: ['places', id, 'stars'],
    queryFn: async () => {
      const data = await supabase.from('stars').select().eq('place_id', id)
      return data
    }
  })

  const { data: comments, isLoading: isLoadingComments, isError: isErrorComments } = useQuery({
    queryKey: ['places', id, 'comments'],
    queryFn: async () => {
      const data = await supabase.from('comments').select(`
        *,
        profile:profiles(name, avatar_url)
      `).eq('place_id', id)
      return data
    },
  })

  useEffect(() => {
    supabase.auth.getUser().then((session) => {
      // @ts-ignore
      setSession(session.data.user)
    })
    // eslint-disable-next-line
  }, [])

  if (!isLoadingPlace && (isErrorPlace || !place || !place.data)) {
    return (
      <div className="flex justify-center items-center h-96">
        <h2 className="text-4xl font-bold">Error</h2>
      </div>
    )
  }

  return (
    <>
      <header className="flex flex-col">
        <div className="flex gap-2 items-center justify-between">
          <h2 className="text-4xl font-bold inline-flex items-center">Lugar:{'   '}
            {!isLoadingPlace && !isErrorPlace && 
              // @ts-ignore 
              place?.data[0]?.name && (
                place.data[0].name
            )}
          </h2>
          {isLoadingPlace && (
            <span className="inline-block ml-2">
              <Skeleton className="w-32 h-10" />
            </span>
          )}
        </div>

        <div className="flex gap-2 items-center mt-2">
          <p className="text-neutral-700 dark:text-neutral-300">
            Rating:
          </p>
          
          <BurgersDisplay stars={stars?.data || []} isLoading={isLoadingStars} isError={isErrorStars} />
        </div>

        {session && (
          <div className="flex gap-2 items-center mt-2">
            <p className="text-neutral-700 dark:text-neutral-300">
              Tu rating:
            </p>

            {
              // @ts-ignore
              <BurgerSelector id={id} userId={session?.id} />
            }
          </div>
        )}

        <a 
          // @ts-ignore
          href={`https://instagram.com/${place?.data[0]?.link}`}
          className="text-blue-500 items-start w-max p-0 h-auto dark:text-blue-400 mt-2"
          target="_blank"
          rel="noreferrer"
        >
          Redes
        </a>
      </header>

      <Separator />

      <section>
        <h3 className="text-2xl font-bold">Información</h3>
        <p>
          {!isLoadingPlace && !isErrorPlace && 
            // @ts-ignore 
            place?.data[0]?.description && (
              place.data[0].description
          )}
        </p>
        {isLoadingPlace && (
          <Skeleton className="w-96 h-10" />
        )}
      </section>
      
      <Separator />

      <section id="comments" className="mt-4 flex flex-col gap-4">
        <h3 className="text-xl font-bold">Comentarios ({comments?.data?.length})</h3>
        { //@ts-ignore
          session && <CommentsForm placeId={id} userId={session.id} />
        }
        <CommentsList comments={comments?.data || []} isLoading={isLoadingComments} isError={isErrorComments} />
      </section>
    </>
  )
}
