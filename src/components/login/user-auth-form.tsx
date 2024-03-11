"use client"

import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import {IconBrandGoogle, IconFidgetSpinner } from '@tabler/icons-react'
import useSupabaseClient from "@/lib/supabase/client"
import { useState } from "react"
import { getURL } from "@/lib/get-url-redirect"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const supabase = useSupabaseClient()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    
    supabase.auth.signInWithOAuth({ 
      provider: "google",
      options: {
        redirectTo: getURL(),
      }
    }).then(() => {
      setIsLoading(false)
    })
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Button variant="outline" type="button" disabled={isLoading} onClick={onSubmit}>
        {isLoading ? (
          <IconFidgetSpinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <IconBrandGoogle className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  )
}