export const PRODUCT_IMAGE_FALLBACKS = [
  "/images/product-1.png",
  "/images/product-2.png",
  "/images/product-3.png",
  "/images/product-4.png",
  "/images/product-5.png",
  "/images/product-6.png",
  "/images/product-7.png",
  "/images/product-8.png",
];

export const getProductImage = (index: number) => {
  return PRODUCT_IMAGE_FALLBACKS[index % PRODUCT_IMAGE_FALLBACKS.length];
};

export const HERO_BG_FALLBACK = "/images/hero-bg.png";
