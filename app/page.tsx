"use client";

import { Chat } from "@/components/chat";
import { Products } from "@/components/products";

export default function Home() {
  return (
    <main className="min-h-screen flex">
      {/* Products section */}
      <div className="w-1/2 p-4 sm:p-8 border-r">
        <Products />
      </div>

      {/* Chat section */}
      <div className="w-1/2 p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-xl h-[calc(100vh-4rem)]">
          <Chat />
        </div>
      </div>
    </main>
  );
}
