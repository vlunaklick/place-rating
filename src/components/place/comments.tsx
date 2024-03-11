'use client'

import useSupabaseClient from "@/lib/supabase/client"
import { useMutation, useQueryClient } from "react-query"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { type Session } from '@supabase/auth-helpers-nextjs'
import { IconDots, IconTrash } from "@tabler/icons-react"
import { CommentsSkeletons } from "../skeleton"

export const CommentsList = ({ comments, isLoading, isError }: { comments: any, isLoading: boolean, isError: boolean }) => {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()

  const deleteMutation = useMutation({
    mutationFn: async (comment: any) => {
      const { error } = await supabase.from('comments').delete().eq('id', comment.id)

      if (error) return
      return comment.place_id
    },
    onSuccess: (placeId: any) => {
      queryClient.invalidateQueries({
        queryKey: ['places', placeId, 'comments']
      })
    }
  })

  if (isLoading) {
    return <CommentsSkeletons />
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-4xl font-bold">No se pudieron cargar los comentarios.</p>
      </div>
    )
  }

  const sortedComments = comments.sort((a: any, b: any) => {
    // @ts-ignore
    return new Date(b.inserted_at) - new Date(a.inserted_at)
  })

  const handleDelete = async (comment: any) => {
    await deleteMutation.mutateAsync(comment)
  }

  return (
    <div className="grid gap-5">
      {
        sortedComments.map((comment: any) => (
          <Comment key={comment.id} comment={comment} handleDelete={() => handleDelete(comment)} />
        ))
      }
    </div>
  )
}

export const Comment = ({ comment, handleDelete }: { comment: any, handleDelete: () => void }) => {
  const supabase = useSupabaseClient()
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()

      setSession(data.session)
    }

    getSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <article className="p-6 text-base bg-white rounded-lg dark:bg-neutral-900 border dark:border-neutral-800">
      <header className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Avatar className="h-9 w-9">
            <AvatarImage alt={comment.profile?.name} src={comment.profile?.avatar_url} />
            <AvatarFallback>
             {comment.profile?.name && comment.profile?.name[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <p className="inline-flex items-center text-sm text-neutral-900 dark:text-white font-semibold">{comment.profile?.name}</p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
          <time dateTime={comment.inserted_at} title={comment.inserted_at}>{new Date(comment.inserted_at).toLocaleString()}</time>
          </p>
        </div>

        {session && session?.user.id === comment.user_id && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IconDots className="stroke-neutral-600 dark:stroke-neutral-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className="text-red-500 dark:text-red-400 flex gap-2 hover:text-red-600 dark:hover:text-red-500 focus:text-red-600 dark:focus:text-red-500 cursor-pointer" onClick={handleDelete}>
                <IconTrash />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>  
        )}
      </header>

      <p className="text-neutral-600 dark:text-neutral-300">{comment.content}</p>

      {/* <footer className="flex items-center mt-4 space-x-4">
      </footer> */}
    </article>
  )
}