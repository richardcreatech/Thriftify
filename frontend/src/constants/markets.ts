export type Market = {
  id: string;
  name: string;
  description: string;
  image: string;
};

export const markets: Market[] = [
  {
    id: "market-1",
    name: "The Style Room",
    description: "Fashion and lifestyle finds.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
  },
  {
    id: "market-2",
    name: "Tech Haven",
    description: "Discover gadgets and electronics.",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
  },
  {
    id: "market-3",
    name: "The Book Nook",
    description: "Books for curious minds.",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
  },
  {
    id: "market-4",
    name: "Glow Space",
    description: "Beauty and skincare essentials.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500",
  },
];