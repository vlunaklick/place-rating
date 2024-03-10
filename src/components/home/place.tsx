'use client'

import { buttonVariants } from "../ui/button"
import { cn } from "@/lib/utils"

export const Place = ({ id, name, description, link }: { id: string, name: string, description: string, link: string }) => {

  return (
    <article className="flex flex-col gap-2 border p-4 rounded-md dark:border-neutral-700">
      <h3 className="text-xl font-bold">{name}</h3>
      <p>{description}</p>
      <a 
        href={`https://instagram.com/${link}`}
        className={cn(
          buttonVariants({ variant: "link" }), 
          "text-blue-500 items-start w-max p-0 h-auto")
        }
        target="_blank"
        rel="noreferrer"
      >
        Redes
      </a>

    </article>
  )
}