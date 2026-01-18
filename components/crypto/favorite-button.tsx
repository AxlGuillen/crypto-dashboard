"use client"

import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FavoriteButtonProps {
  isFavorite: boolean
  onToggle: () => void
  size?: "sm" | "default" | "lg"
  showLabel?: boolean
  className?: string
}

export function FavoriteButton({
  isFavorite,
  onToggle,
  size = "default",
  showLabel = false,
  className,
}: FavoriteButtonProps) {
  const iconSizes = {
    sm: "h-4 w-4",
    default: "h-5 w-5",
    lg: "h-6 w-6",
  }

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "icon" : size}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      className={cn(
        "group transition-all duration-200",
        size === "sm" && "h-8 w-8",
        className
      )}
      aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Star
        className={cn(
          iconSizes[size],
          "transition-all duration-200",
          isFavorite
            ? "fill-yellow-400 text-yellow-400 scale-110"
            : "text-muted-foreground group-hover:text-yellow-400 group-hover:scale-110"
        )}
      />
      {showLabel && (
        <span className="ml-2">
          {isFavorite ? "En favoritos" : "Agregar a favoritos"}
        </span>
      )}
    </Button>
  )
}
