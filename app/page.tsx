import { Chat } from "@/components/chat";

export default function Home() {
  return (
    <main className="min-h-screen flex items-stretch">
      <div className="flex-1 p-4 sm:p-8 flex items-center justify-center">
        <div className="w-full max-w-xl h-[calc(100vh-4rem)]">
          <Chat />
        </div>
      </div>
    </main>
  );
}
