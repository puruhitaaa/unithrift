import type {
  listingCategoryEnum,
  listingConditionEnum,
} from "@unithrift/db/schema";

// Re-export enums for frontend use
export type ListingCategory = (typeof listingCategoryEnum.enumValues)[number];
export type ListingCondition = (typeof listingConditionEnum.enumValues)[number];

export interface ListingUI {
  id: string;
  title: string;
  price: number;
  university: string; // Mapped from universityId for UI
  image: string; // Mapped from listingMedia for UI
  sellerAvatar: string; // Mapped from seller.image for UI
  condition?: ListingCondition;
  category?: ListingCategory;
  likes?: number; // UI specific
}

export interface CategoryUI {
  id: string;
  name: string;
  icon: string;
}
