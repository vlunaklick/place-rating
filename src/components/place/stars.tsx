'use client'

import { useEffect, useState } from 'react'
import { IconBurger } from "@tabler/icons-react"
import { useMutation, useQuery, useQueryClient } from 'react-query'
import useSupabaseClient from '@/lib/supabase/client'

export const BurgerSelector = ({ id, userId }: { id: string, userId: string}) => {
  const queryClient = useQueryClient()
  const supabase = useSupabaseClient()
  const [mouted, setMounted] = useState(false)
  const [selectedBurgers, setSelectedBurgers] = useState(0)
  const [lastClicked, setLastClicked] = useState<number | null>(null)

  useQuery({
    queryKey: ['stars', id, userId],
    queryFn: async () => {
      const { data, error } = await supabase.from('stars').select().eq('place_id', id).eq('user_id', userId)
      if (error) return
      return data
    },
    onSuccess: (data) => {
      if (data && data.length > 0) {
        setSelectedBurgers(Number(data[0].stars))
      }

    }
  })

  const editBurgerMutation = useMutation({
    mutationFn: async (value: number) => {
      const { data, error } = await supabase.from('stars').select().eq('place_id', id).eq('user_id', userId)

      if (error) return
      
      if (data.length === 0) {
        await supabase.from('stars').insert({
          place_id: id,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          stars: value
        })
      }

      if (data.length > 0) {
        await supabase.from('stars').update({ stars: value }).eq('place_id', id).eq('user_id', userId)
      }

      return value
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['places', id])
    }
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  if (supabase.auth.getUser() === null) return null

  if (!mouted) return null

  const handleBurgerClick = async (index: number) => {
    if (lastClicked === null || lastClicked !== index) {
      setLastClicked(index)
      setSelectedBurgers(index)
      await editBurgerMutation.mutateAsync(index)
    } else if (lastClicked === index) {
      setLastClicked(null)
      setSelectedBurgers(index - 0.5)
      await editBurgerMutation.mutateAsync(index - 0.5)
    }
  }

  const fullBurgers = Math.floor(selectedBurgers)
  const halfBurger = selectedBurgers % 1 !== 0 ? (
    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleBurgerClick(fullBurgers)}>
      <IconBurger size={20} color="gray" />
      <div style={{ position: 'absolute', top: 0, left: 0, width: '50%', overflow: 'hidden' }}>
        <IconBurger size={20} color="currentColor" />
      </div>
    </div>
  ) : null
  const emptyBurgers = 5 - Math.ceil(selectedBurgers)

  return (
    <div className="flex">
      {[...Array(fullBurgers)].map((_, i) => (
        <div 
          key={i} 
          onClick={() => handleBurgerClick(i)}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <IconBurger size={20} color="currentColor" />
        </div>
      ))}
      {halfBurger}
      {[...Array(emptyBurgers)].map((_, i) => (
        <div 
          key={i + fullBurgers + 1} 
          onClick={() => handleBurgerClick(i + fullBurgers + 1)}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <IconBurger size={20} color="gray" />
        </div>
      ))}
    </div>
  )
}

export const BurgersDisplay = ({ stars, isLoading, isError }: { stars: any, isLoading: boolean, isError: boolean }) => {
  if (isLoading || isError) {
    return (
      <div className="flex gap-2 items-center">
        <div className="flex">
          <IconBurger size={20} className="stroke-neutral-500 dark:stroke-neutral-400" />
          <IconBurger size={20} className="stroke-neutral-500 dark:stroke-neutral-400" />
          <IconBurger size={20} className="stroke-neutral-500 dark:stroke-neutral-400" />
          <IconBurger size={20} className="stroke-neutral-500 dark:stroke-neutral-400" />
          <IconBurger size={20} className="stroke-neutral-500 dark:stroke-neutral-400" />
        </div>
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
          <IconBurger key={i + fullBurgers} size={20} className="stroke-neutral-500 dark:stroke-neutral-400" />
        ))}
      </div>
    </div>
  )
}