import Link from "next/link"
import { ThemeToggler } from "./theme-toggler"
import { UserButton } from "./user-button"

export const Nav = async () => { 
  return (
    <header className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center h-16">
      <Link href="/">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Place Rating
        </h1>
      </Link>

      <nav className="flex space-x-4 items-center">
        <ThemeToggler />
        {/* @ts-expect-error Server Component */}
        <UserButton />
      </nav>
    </header>
  )
}