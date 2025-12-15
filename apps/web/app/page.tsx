
import { getApiClient } from '@/lib/api';

type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
};

// Mark this component as dynamic because it fetches data that might not be static
// and Next.js 14+ is aggressive about static generation.
export const dynamic = 'force-dynamic';

async function getProducts(): Promise<Product[]> {
  // In a real scenario, this would be a fetch to the public endpoint
  // We can use fetch directly or our axios client.
  // Since it's a server component, we can fetch directly.
  try {
    const res = await fetch('http://localhost:3001/products', { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-8">E-Commerce Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-green-600 font-bold mt-2">${product.price}</p>
            {/* Add to cart button would go here, needing a client component wrapper */}
          </div>
        ))}
      </div>
    </main>
  );
}
