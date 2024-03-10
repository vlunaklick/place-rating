import { Metadata } from "next"
import Link from "next/link"

import { UserAuthForm } from "@/components/login/user-auth-form"

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
}

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-neutral-50">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-neutral-900" />
          <div className="relative z-20 flex items-center text-lg font-medium tracking-tight text-white">
            Place Ratings
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg text-neutral-100 dark:text-neutral-200">
                &ldquo;Que no te lo cuenten, vivilo.&rdquo;
              </p>
              <footer className="text-sm text-neutral-100 dark:text-neutral-200">Marti god</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-black">
                Bienvenido a Place Ratings
              </h1>
              <p className="text-sm text-black">
                Inicia sesión o crea una cuenta para continuar.
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-black">
              Al continuar, aceptas nuestros{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Términos de servicio
              </Link>{" "}
              y{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Política de privacidad
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}