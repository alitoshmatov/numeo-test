"use client";

import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ProductCard({
  product,
  isSmall,
}: {
  product: Product;
  isSmall?: boolean;
}) {
  return (
    <div
      key={product.id}
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
    >
      <div className="aspect-square mb-2">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <h3 className={cn("font-semibold", isSmall ? "text-sm" : "text-lg")}>
        {product.name}
      </h3>
      {!isSmall ? (
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
      ) : null}
      <div className="flex justify-between items-center">
        <span className="font-bold text-lg">${product.price}</span>
        <span className="text-gray-500">Year: {product.year}</span>
      </div>
    </div>
  );
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="bg-blue-50 p-4 rounded-lg mb-4 flex-none">
        <h3 className="font-semibold mb-2">How to use:</h3>
        <p className="text-gray-600">
          Some notes:
          <br />- Can negotiate till 20% discount
          <br />- Ask for suggestion or to show products
          <br />- When deal is confirmed closes the deal by showing "Sold!" Card
          <br />- Special case you get 30% deal if you compliment the seller 3
          times
          <br />- You can provide image for appraisal
          <br />
          <span className="bg-red-200 text-red-800 p-1 rounded-md">
            Warning: Local storage only - image uploads will slow down model
            response
          </span>
        </p>
      </div>
      {/* <h2 className="text-2xl font-bold mb-4 flex-none">Antique Products</h2> */}
      <div className="overflow-y-auto flex-1 -mx-4 px-4">
        <div className="grid grid-cols-2 gap-4 pr-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
