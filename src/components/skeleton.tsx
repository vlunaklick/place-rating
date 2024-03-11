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

export const CommentSkeleton = () => {
  return (
    <article className="p-6 text-base bg-white rounded-lg dark:bg-neutral-900 border dark:border-neutral-800">
      <header className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-5 w-12" />
        </div>
      </header>

      <Skeleton className="h-16 w-full" />

      {/* <footer className="flex items-center mt-4 space-x-4">
      </footer> */}
    </article>
  )
}

export const CommentsSkeletons = () => {
  return (
    <div className="grid gap-5">
      <CommentSkeleton />
      <CommentSkeleton />
      <CommentSkeleton />
    </div>
  )
}