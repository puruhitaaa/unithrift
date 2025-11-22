import type { ListingCategory, ListingCondition } from "./ui";

export interface ItemDetailSeller {
  name: string;
  avatar: string;
  rating: number;
  itemsSold: number;
  university: string;
}

export interface ItemDetail {
  id: string;
  title: string;
  price: number;
  condition: ListingCondition;
  category: ListingCategory;
  university: string;
  description: string;
  images: string[];
  seller: ItemDetailSeller;
  location: string;
  postedDate: string;
}
