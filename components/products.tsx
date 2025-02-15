"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  year: number;
  imageUrl: string;
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
      <h2 className="text-2xl font-bold mb-4 flex-none">Antique Products</h2>
      <div className="overflow-y-auto flex-1 -mx-4 px-4">
        <div className="grid grid-cols-2 gap-4 pr-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="aspect-square mb-2">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-lg line-clamp-1">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">${product.price}</span>
                <span className="text-gray-500">Year: {product.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
