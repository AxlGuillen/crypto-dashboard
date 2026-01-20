import { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string
  change?: number
  icon: LucideIcon
  loading?: boolean
}

/**
 * Displays a statistics card with title, value, optional change percentage, and icon
 *
 * @param props - Component props
 * @param props.title - Card title displayed in header
 * @param props.value - Main value to display
 * @param props.change - Optional percentage change (positive/negative coloring applied)
 * @param props.icon - Lucide icon component to display
 * @param props.loading - If true, shows skeleton placeholder
 * @returns Stat card component or skeleton if loading
 */
export function StatCard({ title, value, change, icon: Icon, loading }: StatCardProps) {
  if (loading) {
    return <StatCardSkeleton />
  }

  const isPositive = change !== undefined && change >= 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <p
            className={cn(
              "mt-1 text-xs",
              isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            {isPositive ? "+" : ""}
            {change.toFixed(2)}% in 24h
          </p>
        )}
      </CardContent>
    </Card>
  )
}

/**
 * Skeleton placeholder for StatCard while loading
 *
 * @returns Skeleton stat card component
 */
export function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-3 w-20" />
      </CardContent>
    </Card>
  )
}
