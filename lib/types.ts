export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  year: number;
  imageUrl: string;
}
