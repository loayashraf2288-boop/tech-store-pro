import { Link } from "wouter";
import { Heart, ShoppingCart } from "lucide-react";
import { Product, useToggleWishlist, useAddToCart, getGetWishlistQueryKey, getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "./StarRating";
import { toast } from "sonner";
import { getProductImage } from "@/lib/constants";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
  isWishlisted?: boolean;
}

export function ProductCard({ product, isWishlisted = false }: ProductCardProps) {
  const queryClient = useQueryClient();
  const toggleWishlist = useToggleWishlist();
  const addToCart = useAddToCart();

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist.mutate(
      { data: { productId: product.id } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetWishlistQueryKey() });
          toast.success(isWishlisted ? "تم الإزالة من المفضلة" : "تم الإضافة للمفضلة");
        }
      }
    );
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart.mutate(
      { data: { productId: product.id, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
          toast.success("تم الإضافة إلى السلة");
        }
      }
    );
  };

  const discountBadge = product.discountPercent 
    ? `خصم ${product.discountPercent}%` 
    : product.isNew 
      ? "جديد" 
      : null;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden flex flex-col h-full hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] hover:border-primary/30 transition-all"
    >
      {/* Badges & Wishlist */}
      <div className="absolute top-3 inset-x-3 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          {discountBadge && (
            <Badge variant="default" className="bg-primary hover:bg-primary text-primary-foreground font-bold px-2 py-0.5 shadow-md">
              {discountBadge}
            </Badge>
          )}
          {product.isBestSeller && (
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/20 font-bold px-2 py-0.5 shadow-sm border border-amber-500/30">
              الأكثر مبيعاً
            </Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-colors ${
            isWishlisted ? 'text-destructive border-destructive/30' : 'text-muted-foreground hover:text-destructive border-border'
          }`}
          onClick={handleToggleWishlist}
          disabled={toggleWishlist.isPending}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Image */}
      <Link href={`/product/${product.id}`} className="aspect-square bg-muted/30 relative overflow-hidden flex items-center justify-center p-6">
        <img 
          src={product.images?.[0] || getProductImage(product.id)} 
          alt={product.name} 
          className="w-full h-full object-contain mix-blend-normal group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          {product.categoryName && (
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-md">
              {product.categoryName}
            </span>
          )}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <StarRating rating={product.rating} starClassName="w-3 h-3" />
            <span>({product.reviewCount})</span>
          </div>
        </div>

        <Link href={`/product/${product.id}`} className="block group-hover:text-primary transition-colors">
          <h3 className="font-bold leading-tight line-clamp-2" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-black text-lg">{product.price} ج.م</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through decoration-destructive/50 font-medium">
                {product.originalPrice} ج.م
              </span>
            )}
          </div>
          
          <Button 
            size="icon" 
            className="rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            onClick={handleAddToCart}
            disabled={addToCart.isPending || product.stock <= 0}
            title="أضف للسلة"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
