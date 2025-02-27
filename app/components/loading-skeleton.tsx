import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Skeleton } from "@/app/components/ui/skeleton"

export function TabsSkeleton() {
  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-center animate-pulse">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-10 w-24 rounded-lg" />
      ))}
      <Skeleton className="h-10 w-10 rounded-lg" />
    </div>
  )
}

export function CardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-10 flex-grow" />
              <Skeleton className="h-10 w-10" />
            </div>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function LoadingSpinner({ size = "medium" }: { size?: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  }

  return (
    <div className="flex justify-center items-center py-4">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
    </div>
  )
}

