export type Locale = "en" | "fr";

export type ProductAudience = "WOMEN" | "MEN" | "UNISEX";

export interface ProductDTO {
  id: string;
  slug: string;
  nameEn: string;
  nameFr: string;
  descriptionEn: string;
  descriptionFr: string;
  audience: ProductAudience;
  priceCents: number;
  compareAtCents: number | null;
  currency: string;
  images: string[];
  sizes: string[];
  colors: string[];
  fabric: string | null;
  madeToOrder: boolean;
  leadTimeDays: number | null;
  stock: number;
  featured: boolean;
  published: boolean;
  categoryId: string | null;
  category?: { id: string; slug: string; nameEn: string; nameFr: string } | null;
  createdAt: string;
}

export interface CartLine {
  productId: string;
  slug: string;
  nameEn: string;
  nameFr: string;
  unitCents: number;
  currency: string;
  image: string | null;
  size: string | null;
  color: string | null;
  quantity: number;
  stock: number;
}
