import prisma from "@/lib/prisma";
import ProductsClient from "@/components/ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let dbProducts: any[] = [];
  let categories: any[] = [];

  try {
    const [dbProductsRaw, dbCategories] = await Promise.all([
      prisma.product.findMany({
        include: { categories: true },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.category.findMany({
        orderBy: { name: 'asc' }
      })
    ]);

    dbProducts = dbProductsRaw.map(p => ({
      id: p.id,
      name: p.name,
      categories: p.categories.map((c: any) => c.name),
      brand: "القدس",
      image: p.image || "/placeholder.svg",
      isNew: p.isNew,
      description: p.description || "",
    }));
    categories = dbCategories;
  } catch (error) {
    console.error("Database connection error:", error);
    // Return empty state - the UI handles empty products gracefully
  }

  return (
    <ProductsClient 
      initialProducts={dbProducts} 
      categories={categories} 
    />
  );
}
