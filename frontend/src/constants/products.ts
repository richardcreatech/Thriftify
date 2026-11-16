
export type Product = {
  id: string;
  name: string;
  price: number;
  condition: string;
  category: string;
  image: string;
  marketId: string;
};

export const products: Product[] = [
  // THE STYLE ROOM — market-1
  {
    id: "1",
    name: "Classic Sneakers",
    price: 35000,
    condition: "New",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    marketId: "market-1",
  },
  {
    id: "2",
    name: "Wireless Headphones",
    price: 22000,
    condition: "New",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    marketId: "market-1",
  },
  {
    id: "3",
    name: "Leather Handbag",
    price: 28000,
    condition: "Like New",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500",
    marketId: "market-1",
  },
  {
    id: "4",
    name: "Classic Wristwatch",
    price: 18000,
    condition: "Good",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    marketId: "market-1",
  },
  {
    id: "5",
    name: "Denim Jacket",
    price: 25000,
    condition: "Like New",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=500",
    marketId: "market-1",
  },

  // TECH HAVEN — market-2
  {
    id: "6",
    name: "Wireless Earbuds",
    price: 18000,
    condition: "New",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500",
    marketId: "market-2",
  },
  {
    id: "7",
    name: "Digital Camera",
    price: 125000,
    condition: "Good",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500",
    marketId: "market-2",
  },
  {
    id: "8",
    name: "Gaming Controller",
    price: 32000,
    condition: "Like New",
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500",
    marketId: "market-2",
  },
  {
    id: "9",
    name: "Mechanical Keyboard",
    price: 45000,
    condition: "New",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500",
    marketId: "market-2",
  },
  {
    id: "10",
    name: "Smart Watch",
    price: 38000,
    condition: "Good",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    marketId: "market-2",
  },

  // THE BOOK NOOK — market-3
  {
    id: "11",
    name: "The Great Gatsby",
    price: 4500,
    condition: "Good",
    category: "Books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    marketId: "market-3",
  },
  {
    id: "12",
    name: "Creative Journals",
    price: 6500,
    condition: "New",
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500",
    marketId: "market-3",
  },
  {
    id: "13",
    name: "Art of Reading",
    price: 7000,
    condition: "Like New",
    category: "Books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    marketId: "market-3",
  },
  {
    id: "14",
    name: "Study Desk Lamp",
    price: 12000,
    condition: "Good",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500",
    marketId: "market-3",
  },
  {
    id: "15",
    name: "Minimalist Notebook",
    price: 3500,
    condition: "New",
    category: "Stationery",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=500",
    marketId: "market-3",
  },

  // GLOW SPACE — market-4
  {
    id: "16",
    name: "Skincare Essentials",
    price: 15000,
    condition: "New",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=500",
    marketId: "market-4",
  },
  {
    id: "17",
    name: "Perfume Collection",
    price: 22000,
    condition: "New",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500",
    marketId: "market-4",
  },
  {
    id: "18",
    name: "Makeup Brush Set",
    price: 8500,
    condition: "New",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
    marketId: "market-4",
  },
  {
    id: "19",
    name: "Vanity Mirror",
    price: 18000,
    condition: "Like New",
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=500",
    marketId: "market-4",
  },
  {
    id: "20",
    name: "Body Lotion",
    price: 9500,
    condition: "New",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=500",
    marketId: "market-4",
  },
];
