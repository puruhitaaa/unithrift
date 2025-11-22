import type { CategoryUI, ListingUI } from "../types/ui";

export const TOP_SELLERS: ListingUI[] = [
  {
    id: "1",
    title: "Vintage Camera Collection",
    price: 120,
    university: "Photography Club",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D",
    sellerAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    likes: 42,
  },
  {
    id: "2",
    title: "Designer Furniture Set",
    price: 350,
    university: "Art & Design School",
    image:
      "https://images.unsplash.com/photo-1541085929911-dea736e9287b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TW9kZXJuJTIwU2NhbmRpbmF2aWFuJTIwZnVybml0dXJlfGVufDB8fDB8fHww",
    sellerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    likes: 38,
  },
  {
    id: "3",
    title: "Rare Book Collection",
    price: 85,
    university: "Literature Department",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNsYXNzcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    sellerAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    likes: 56,
  },
  {
    id: "4",
    title: "Limited Edition Sneakers",
    price: 150,
    university: "Sports Department",
    image:
      "https://images.unsplash.com/photo-1558898452-e5c989f41b27?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8UmV0YWlsJTIwc2hvcHBpbmclMjBib3V0aXF1ZXxlbnwwfHwwfHx8MA%3D%3D",
    sellerAvatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    likes: 29,
  },
];

export const FRESH_FINDS: ListingUI[] = [
  {
    id: "1",
    title: "MacBook Pro 2020",
    price: 850,
    university: "Stanford University",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRlY2hub2xvZ3l8ZW58MHx8MHx8fDA%3D",
    sellerAvatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    condition: "GOOD",
    category: "Electronics",
  },
  {
    id: "2",
    title: "Organic Chemistry Textbook",
    price: 45,
    university: "UC Berkeley",
    image:
      "https://images.unsplash.com/photo-1629652487043-fb2825838f8c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2Nob29sJTIwc3VwcGxpZXN8ZW58MHx8MHx8fDA%3D",
    sellerAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    condition: "LIKE_NEW",
    category: "Books",
  },
  {
    id: "3",
    title: "IKEA Desk Lamp",
    price: 25,
    university: "UCLA",
    image:
      "https://images.unsplash.com/photo-1541085929911-dea736e9287b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8TW9kZXJuJTIwU2NhbmRpbmF2aWFuJTIwZnVybml0dXJlfGVufDB8fDB8fHww",
    sellerAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    condition: "GOOD", // Mapped from Excellent to closest enum
    category: "Furniture",
  },
  {
    id: "4",
    title: "Vintage Band T-Shirt",
    price: 20,
    university: "NYU",
    image:
      "https://images.unsplash.com/photo-1685883785814-42d0b197ae64?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VCUyMHNoaXJ0cyUyMGZhc2hpb24lMjBhcHBhcmVsfGVufDB8fDB8fHww",
    sellerAvatar:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjh8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
    condition: "GOOD",
    category: "Clothing",
  },
];

export const CATEGORIES: CategoryUI[] = [
  { id: "clothing", name: "Clothing", icon: "👕" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "furniture", name: "Furniture", icon: "🪑" },
  { id: "stationery", name: "Stationery", icon: "✏️" },
  { id: "other", name: "Other", icon: "📦" },
];
