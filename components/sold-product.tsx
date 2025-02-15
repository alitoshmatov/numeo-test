import { Product } from "@/lib/types";
import Image from "next/image";

export default function SoldProduct({
  product,
  price,
}: {
  product: Product;
  price: number;
}) {
  return (
    <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg max-w-md">
      <div className="relative w-20 h-20 mr-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover rounded-md w-full h-full"
        />
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold text-green-600 mb-1">SOLD!</h3>
        <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
        <p className="font-semibold">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
