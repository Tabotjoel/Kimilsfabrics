import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "kekiasally42@gmail.com";
  const adminName = process.env.SEED_ADMIN_NAME || "Sally";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "sallytj";

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  const categories = [
    { slug: "womens-gowns", nameEn: "Women's Gowns", nameFr: "Robes pour femmes" },
    { slug: "womens-everyday", nameEn: "Women's Everyday", nameFr: "Femme au quotidien" },
    { slug: "mens-suits", nameEn: "Men's Suits", nameFr: "Costumes pour hommes" },
    { slug: "mens-shirts", nameEn: "Men's Shirts", nameFr: "Chemises pour hommes" },
    { slug: "bridal", nameEn: "Bridal & Occasion", nameFr: "Mariage et occasions" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  const gowns = await prisma.category.findUniqueOrThrow({ where: { slug: "womens-gowns" } });
  const suits = await prisma.category.findUniqueOrThrow({ where: { slug: "mens-suits" } });
  const shirts = await prisma.category.findUniqueOrThrow({ where: { slug: "mens-shirts" } });
  const everyday = await prisma.category.findUniqueOrThrow({ where: { slug: "womens-everyday" } });
  const bridal = await prisma.category.findUniqueOrThrow({ where: { slug: "bridal" } });

  const placeholder = (seed: string) =>
    `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

  const products = [
    {
      slug: "aurelie-evening-gown",
      nameEn: "Aurélie Evening Gown",
      nameFr: "Robe de soirée Aurélie",
      descriptionEn:
        "A floor-length silhouette in burgundy silk, hand-finished with a fitted bodice and flowing skirt. Made to order to your measurements.",
      descriptionFr:
        "Une silhouette longue en soie bordeaux, finie à la main avec un corsage ajusté et une jupe fluide. Confectionnée sur mesure.",
      audience: "WOMEN" as const,
      priceCents: 42000,
      compareAtCents: null,
      images: [placeholder("photo-1595777457583-95e059d581b8"), placeholder("photo-1566174053879-31528523f8ae")],
      sizes: ["XS", "S", "M", "L", "XL", "Custom"],
      colors: ["Burgundy", "Emerald", "Black"],
      fabric: "Silk charmeuse",
      leadTimeDays: 21,
      stock: 5,
      featured: true,
      categoryId: gowns.id,
    },
    {
      slug: "adaeze-wrap-dress",
      nameEn: "Adaeze Wrap Dress",
      nameFr: "Robe portefeuille Adaeze",
      descriptionEn:
        "A tailored wrap dress for everyday elegance, cut from breathable cotton-blend fabric with a self-tie waist.",
      descriptionFr:
        "Une robe portefeuille ajustée pour une élégance quotidienne, taillée dans un tissu mélangé de coton respirant.",
      audience: "WOMEN" as const,
      priceCents: 18500,
      compareAtCents: 21000,
      images: [placeholder("photo-1539008835657-9e8e9680c956")],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Gold", "Ivory", "Terracotta"],
      fabric: "Cotton blend",
      leadTimeDays: 10,
      stock: 12,
      featured: true,
      categoryId: everyday.id,
    },
    {
      slug: "kwame-three-piece-suit",
      nameEn: "Kwame Three-Piece Suit",
      nameFr: "Costume trois-pièces Kwame",
      descriptionEn:
        "A sharply tailored three-piece suit in fine wool blend — jacket, waistcoat, and trousers cut to your exact measurements.",
      descriptionFr:
        "Un costume trois-pièces coupé avec précision dans un mélange de laine fine — veste, gilet et pantalon à vos mesures exactes.",
      audience: "MEN" as const,
      priceCents: 65000,
      compareAtCents: null,
      images: [placeholder("photo-1594938298603-c8148c4dae35"), placeholder("photo-1507679799987-c73779587ccf")],
      sizes: ["38R", "40R", "42R", "44R", "Custom"],
      colors: ["Charcoal", "Navy", "Burgundy pinstripe"],
      fabric: "Wool blend",
      leadTimeDays: 28,
      stock: 4,
      featured: true,
      categoryId: suits.id,
    },
    {
      slug: "obi-tailored-shirt",
      nameEn: "Obi Tailored Shirt",
      nameFr: "Chemise ajustée Obi",
      descriptionEn:
        "A crisp, tailored dress shirt with a modern slim fit, mother-of-pearl buttons, and reinforced stitching.",
      descriptionFr:
        "Une chemise habillée nette à coupe ajustée moderne, boutons en nacre et coutures renforcées.",
      audience: "MEN" as const,
      priceCents: 12500,
      compareAtCents: null,
      images: [placeholder("photo-1596755094514-f87e34085b2c")],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Sky Blue", "Gold pinstripe"],
      fabric: "Cotton poplin",
      leadTimeDays: 7,
      stock: 20,
      featured: false,
      categoryId: shirts.id,
    },
    {
      slug: "the-confidence-bridal-set",
      nameEn: "The Confidence Bridal Set",
      nameFr: "Ensemble nuptial « Confiance »",
      descriptionEn:
        "A bridal gown with detachable train and matching veil, hand-beaded bodice, designed to be worn with confidence.",
      descriptionFr:
        "Une robe de mariée avec traîne amovible et voile assorti, corsage perlé à la main, pensée pour être portée avec confiance.",
      audience: "WOMEN" as const,
      priceCents: 98000,
      compareAtCents: null,
      images: [placeholder("photo-1594736797933-d0401ba2fe65")],
      sizes: ["XS", "S", "M", "L", "Custom"],
      colors: ["Ivory", "Champagne"],
      fabric: "Silk & hand-beaded lace",
      leadTimeDays: 45,
      stock: 2,
      featured: true,
      categoryId: bridal.id,
    },
    {
      slug: "asha-tailored-blazer",
      nameEn: "Asha Tailored Blazer",
      nameFr: "Blazer ajusté Asha",
      descriptionEn:
        "A structured blazer for the boardroom or a night out, nipped at the waist with gold-tone buttons.",
      descriptionFr:
        "Un blazer structuré pour le bureau ou une soirée, cintré à la taille avec des boutons dorés.",
      audience: "WOMEN" as const,
      priceCents: 26500,
      compareAtCents: null,
      images: [placeholder("photo-1591369822096-ffd140ec948f")],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Camel", "Burgundy"],
      fabric: "Wool blend",
      leadTimeDays: 14,
      stock: 8,
      featured: false,
      categoryId: everyday.id,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        nameEn: p.nameEn,
        nameFr: p.nameFr,
        descriptionEn: p.descriptionEn,
        descriptionFr: p.descriptionFr,
        audience: p.audience,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents,
        images: JSON.stringify(p.images),
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        fabric: p.fabric,
        leadTimeDays: p.leadTimeDays,
        stock: p.stock,
        featured: p.featured,
        categoryId: p.categoryId,
      },
    });
  }

  console.log("Seed complete.");
  console.log(`Admin login → ${adminEmail} / (the password from SEED_ADMIN_PASSWORD)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
