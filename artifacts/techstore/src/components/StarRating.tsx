import { Star, StarHalf } from "lucide-react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  className?: string;
  starClassName?: string;
}

export function StarRating({ rating, maxStars = 5, className = "", starClassName = "w-4 h-4" }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className={`fill-yellow-400 text-yellow-400 ${starClassName}`} />
      ))}
      {hasHalfStar && <StarHalf className={`fill-yellow-400 text-yellow-400 ${starClassName}`} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className={`text-muted-foreground ${starClassName}`} />
      ))}
    </div>
  );
}
