import prisma from "@/lib/prisma";
import ProductsClient from "@/components/ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  // Fetch real products and categories from DB
  const [dbProductsRaw, categories] = await Promise.all([
    prisma.product.findMany({
      include: { categories: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
  ]);

  // Map them to match the expected format
  const dbProducts = dbProductsRaw.map(p => ({
    id: p.id,
    name: p.name,
    categories: p.categories.map(c => c.name),
    brand: "القدس", // Default for now, as brand is not in schema
    price: p.price,
    image: p.image || "/placeholder.png",
  }));

  return (
    <ProductsClient 
      initialProducts={dbProducts} 
      categories={categories.map(c => c.name)} 
    />
  );
}

