import { useRoute } from "wouter";
import { useListCategories, useListProducts, useGetWishlist } from "@workspace/api-client-react";
import { ProductCard } from "@/components/ProductCard";

export function Category() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug;
  const { data: categories } = useListCategories();
  const cat = categories?.find((c) => c.slug === slug);
  const { data: products, isLoading } = useListProducts(cat ? { categoryId: cat.id, limit: 100 } : undefined, {
    query: { enabled: !!cat },
  });
  const { data: wishlist } = useGetWishlist();
  const wishlistIds = new Set((wishlist ?? []).map((w) => w.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-2">{cat?.name ?? "قسم"}</h1>
        <p className="text-muted-foreground">{products?.length ?? 0} منتج متوفر</p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products?.map((p) => (
            <ProductCard key={p.id} product={p} isWishlisted={wishlistIds.has(p.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
