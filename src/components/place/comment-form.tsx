import { useMutation, useQueryClient } from "react-query"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"
import useSupabaseClient from "@/lib/supabase/client"

export const CommentsForm = ({ placeId, userId }: { placeId: string, userId: string }) => {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()

  const addCommentMutation = useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await supabase.from('comments').insert({
        place_id: placeId,
        user_id: userId,
        content: text
      })

      if (error) return

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['places', placeId, 'comments'])
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const text = formData.get('content') as string

    if (!text) return
    addCommentMutation.mutateAsync(text).then(() => {})
    e.currentTarget.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Textarea name="content" placeholder="Escribe un comentario" />
      <Button type="submit">Comentar</Button>
    </form>
  )
}