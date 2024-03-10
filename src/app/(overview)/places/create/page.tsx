'use client'

import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useSupabaseClient from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { IconFidgetSpinner } from "@tabler/icons-react"
import { revalidatePath } from "next/cache"
import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

export default function Page() {
  const supabase = useSupabaseClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    e.persist()
    const formData = new FormData(e.currentTarget)

    const name = formData.get('name')
    const description=  formData.get('description')
    const link = formData.get('link')

    if (link && (link.toString().includes(' '))) {
      setError('El link no debe contener espacios')
      setIsLoading(false)
      return
    }

    try {
      const { data, error, status } = await supabase.from('places').insert({
        name,
        description,
        link
      })

      if (error || status !== 201) {
        setError('Ha ocurrido un error. Intente de nuevo más tarde')
      } else {
        setError(null)
        Array.from(e.target as HTMLFormElement).forEach(
          (field: any) => field.type !== 'submit' && (field.value = '')
        )

        toast.success('Lugar añadido correctamente', {
          description: `El lugar ${name} ha sido añadido correctamente.`
        })
      }
    } catch (e) { 
      setError('Ha ocurrido un error. Intente de nuevo más tarde')
    }    

    setIsLoading(false)
  }

  return (
    <>
      <header className="flex justify-between items-center">
        <h2 className="text-4xl font-bold">Añadir lugar a la lista</h2>
      </header>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" name="name" type="text" placeholder="McDonalds" disabled={isLoading} />

        <Label htmlFor="description">Descripción</Label>
        <Input id="description" name="description" type="text" placeholder="Comida rápida" disabled={isLoading} />

        <Label htmlFor="link">Instagram</Label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">@</span>
          <Input id="link" name="link" type="text" placeholder="mcdonalds_arg" disabled={isLoading} />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <IconFidgetSpinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'Añadir lugar'
          )}{" "}
        </Button>
      </form>

      <Link href="/" className={cn(buttonVariants({ variant: 'outline' }))}>
        Volver al inicio
      </Link>

      {error && <p className="text-red-500 text-xs">{error}</p>}
    </>
  )
}
