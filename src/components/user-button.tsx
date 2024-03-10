'use server'

import { createSupabaseServerClient } from "@/lib/supabase/server"
import getUserSession from "@/lib/user-session"
import { Button, buttonVariants } from "./ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { redirect } from 'next/navigation'

export const UserButton = async () => {
  const { data } = await getUserSession()

  const logoutAction = async () => {
    'use server'
    const supabase = await createSupabaseServerClient()
    await supabase.auth.signOut()

    redirect('/login')
  }

  if (data.session === null) {
    return (
      <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "xs" }))}>
        Login
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage alt={data.session.user.user_metadata.full_name} src={data.session.user.user_metadata.avatar_url} />
            <AvatarFallback>
              {data.session.user.user_metadata.full_name[0]}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{data.session.user.user_metadata.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {data.session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {/* @ts-expect-error Server Component */}
          <form action={logoutAction} className="flex w-full items-start">
            <button className="w-full text-start">
              Logout
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}