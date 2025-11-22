import type { ItemDetail } from "~/types/item-detail";

// Mock data for the item detail - to be replaced with API call later
export const mockItemData: ItemDetail = {
  id: "1",
  title: "MacBook Pro 2020",
  price: 850,
  condition: "good",
  category: "electronics",
  university: "Stanford University",
  description:
    "Selling my MacBook Pro 2020 in good condition. Comes with original charger. Battery health at 85%. Perfect for college work and light design work. No scratches on the screen.",
  images: [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsYXNzcm9vbXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1659070953831-dd4fa16222fb?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFNjaG9vbCUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nfGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1743485753941-5d515a62628d?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fExvY2FsJTIwbWFya2V0JTIwc3RyZWV0JTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
  ],
  seller: {
    name: "Alex Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.8,
    itemsSold: 24,
    university: "Stanford University",
  },
  location: "Student Union Building",
  postedDate: "2 days ago",
};
