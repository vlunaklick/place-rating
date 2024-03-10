import { Skeleton } from "./ui/skeleton"

export const PlaceSkeleton = () => {
  return (
    <article className="flex flex-col gap-2 border p-4 rounded-md dark:border-neutral-700">
      <Skeleton className="h-7 w-24" />
      <Skeleton className="h-6 w-16" />
      <Skeleton className="h-5 w-12" />
    </article>
  )
}

export const PlacesSkeletons = () => {
  return (
    <div className="flex flex-col gap-4">
      <PlaceSkeleton />
      <PlaceSkeleton />
      <PlaceSkeleton />
    </div>
  )
}