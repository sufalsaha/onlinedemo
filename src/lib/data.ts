import { PlatformName } from "../../generated/prisma";

export interface BusinessCard {
  id: string;
  name: string;
  rating: number;
  logo: string | null;
  about: string;
  productTag: string[];
  reviewCount: number;
  platforms: { name: PlatformName; url: string; }[];
  proudReview?: ProudReview[];
  featured?: boolean;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface ProudReview {
  id: string;
  reviewerName: string;
  authorLocation: string;
  rating: number;
  Message: string;
}
export interface Data {
  category: string;
  slug: string;
  categoryId: string;
  cards: BusinessCard[];
}

export interface Review {
  id: string;
  reviewerName: string;
  businessName: string;
  quote: string;
  authorTitle: string;
}

export const categories: Category[] = [
  { id: "all", label: "All", icon: "" },
  { id: "agriculture", label: "Agriculture", icon: "agriculture" },
  // { id: "tshirt", label: "T-shirt", icon: "shirt" },
  // { id: "shoes", label: "Shoes", icon: "shoes" },
  // { id: "health-beauty", label: "Health & Beauty", icon: "health" },
  // { id: "furniture-store", label: "Furniture Store", icon: "furniture" },
  // { id: "electronics", label: "Electronics", icon: "electronics" },
  // { id: "organic-food", label: "Organic Food", icon: "organicfood" },
  // { id: "food-grocery", label: "Food & Grocery", icon: "foodgrocery" },
  // { id: "books-education", label: "Books & Education", icon: "education" },
  // { id: "pet-products", label: "Pet products", icon: "pet" },
  // { id: "baby-dress", label: "Baby Dress", icon: "babydress" },
  // { id: "baby-foods", label: "Baby Foods", icon: "babyfood" },
];

export const data: Data[] = [
  {
    category: "Agriculture",
    slug: "agriculture",
    categoryId: "agriculture",
    cards: [
      {
        id: "wd-1",
        name: "Dream Electronics And Machinery",
        logo: "/dream-electronics-andmachinery.jpeg",
        about:
          "ড্রিম ইলেকট্রনিক্স অ্যান্ড মেশিনারি আধুনিক চায়না কৃষি মেশিনারি ও মানসম্মত যন্ত্রপাতি সরবরাহের একটি নির্ভরযোগ্য প্রতিষ্ঠান। গুণগত মানের পণ্য ও বিশ্বস্ত সেবার মাধ্যমে প্রতিষ্ঠানটি গ্রাহকের আস্থা অর্জন করে আসছে।",
        rating: 0,
        reviewCount: 0,
        productTag: ["ভুট্টা এড়ানো মেশিন", "খড় ঘাস ও দানাদার বানানো মেশিন"],
        platforms: [
          {
            name: "facebook",
            url: "https://www.facebook.com/DreamElectronicsAndMachinery",
          },
          {
            name: "youtube",
            url: "https://www.youtube.com/@Dreamelectronicsandmachinery",
          },
        ],
        proudReview: [
          {
            id: "string",
            reviewerName: "string",
            authorLocation: "string",
            rating: 9,
            Message: "string",
          },
        ],
      },
      {
        id: "wd-2",
        name: "Dream Electronics And Machinery",
        logo: "/dream-electronics-andmachinery.jpeg",
        about:
          "ড্রিম ইলেকট্রনিক্স অ্যান্ড মেশিনারি আধুনিক চায়না কৃষি মেশিনারি ও মানসম্মত যন্ত্রপাতি সরবরাহের একটি নির্ভরযোগ্য প্রতিষ্ঠান। গুণগত মানের পণ্য ও বিশ্বস্ত সেবার মাধ্যমে প্রতিষ্ঠানটি গ্রাহকের আস্থা অর্জন করে আসছে।",
        rating: 5,
        reviewCount: 4543,
        productTag: [],
        platforms: [
          {
            name: "facebook",
            url: "https://www.facebook.com/DreamElectronicsAndMachinery",
          },
        ],
        proudReview: [],
      },
      {
        id: "wd-3",
        name: "Dream Electronics And Machinery",
        logo: "/dream-electronics-andmachinery.jpeg",
        about:
          "ড্রিম ইলেকট্রনিক্স অ্যান্ড মেশিনারি আধুনিক চায়না কৃষি মেশিনারি ও মানসম্মত যন্ত্রপাতি সরবরাহের একটি নির্ভরযোগ্য প্রতিষ্ঠান। গুণগত মানের পণ্য ও বিশ্বস্ত সেবার মাধ্যমে প্রতিষ্ঠানটি গ্রাহকের আস্থা অর্জন করে আসছে।",
        rating: 5,
        reviewCount: 4543,
        productTag: [],
        platforms: [
          {
            name: "facebook",
            url: "https://www.facebook.com/DreamElectronicsAndMachinery",
          },
        ],
        proudReview: [],
      },
      // {
      //   id: "wd-2",
      //   name: "16anaastha2",
      //   rating: 4,
      //   reviewCount: "4,543",
      //   platforms: ["facebook", "youtube", "instagram"],
      // },
      // {
      //   id: "wd-3",
      //   name: "16anaastha3",
      //   rating: 5,
      //   reviewCount: "4,543",
      //   platforms: ["facebook", "youtube", "twitter"],
      // },
      // {
      //   id: "wd-4",
      //   name: "16anaastha4",
      //   rating: 5,
      //   reviewCount: "4,543",
      //   platforms: ["facebook", "youtube", "instagram", "twitter"],
      // },
      // {
      //   id: "wd-5",
      //   name: "16anaastha5",
      //   rating: 5,
      //   reviewCount: "4,543",
      //   platforms: ["facebook", "youtube", "instagram", "twitter"],
      // },
      // {
      //   id: "wd-6",
      //   name: "16anaastha6",
      //   rating: 5,
      //   reviewCount: "4,543",
      //   platforms: ["facebook", "youtube", "instagram", "twitter"],
      // },
      // {
      //   id: "wd-7",
      //   name: "16anaastha7",
      //   rating: 5,
      //   reviewCount: "4,543",
      //   platforms: ["facebook", "youtube", "instagram", "twitter"],
      // },
    ],
  },
  // {
  //   category: "T-shirt",
  //   slug: "t-shirt",
  //   categoryId: "tshirt",
  //   cards: [
  //     {
  //       id: "ts-1",
  //       name: "16anaastha8",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //     {
  //       id: "ts-2",
  //       name: "16anaastha9",
  //       rating: 4,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram"],
  //     },
  //     {
  //       id: "ts-3",
  //       name: "16anaastha10",
  //       rating: 4,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram"],
  //     },
  //     {
  //       id: "ts-4",
  //       name: "16anaastha11",
  //       rating: 4,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram"],
  //     },
  //     {
  //       id: "ts-5",
  //       name: "16anaastha12",
  //       rating: 4,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram"],
  //     },
  //     {
  //       id: "ts-6",
  //       name: "16anaastha13",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube"],
  //     },
  //     {
  //       id: "ts-7",
  //       name: "16anaastha14",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //   ],
  // },
  // {
  //   category: "Shoes",
  //   slug: "shoes",
  //   categoryId: "shoes",
  //   cards: [
  //     {
  //       id: "sh-1",
  //       name: "16anaastha15",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //     {
  //       id: "sh-2",
  //       name: "16anaastha16",
  //       rating: 4,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram"],
  //     },
  //     {
  //       id: "sh-3",
  //       name: "16anaastha17",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook"],
  //     },
  //     {
  //       id: "sh-4",
  //       name: "16anaastha18",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //     {
  //       id: "sh-5",
  //       name: "16anaastha19",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //     {
  //       id: "sh-6",
  //       name: "16anaastha20",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //     {
  //       id: "sh-7",
  //       name: "16anaastha21",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //     {
  //       id: "sh-8",
  //       name: "16anaastha22",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //     {
  //       id: "sh-9",
  //       name: "16anaastha23",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //     {
  //       id: "sh-10",
  //       name: "16anaastha24",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //     {
  //       id: "sh-11",
  //       name: "16anaastha25",
  //       rating: 5,
  //       reviewCount: "4,543",
  //       platforms: ["facebook", "youtube", "instagram", "twitter"],
  //     },
  //   ],
  // },
];

export const reviews: Review[] = [
  {
    id: "r1",
    reviewerName: "Robert David",
    businessName: "RIO Super Mart",
    quote:
      "With a team of 10, we were drowning in copy-pasting between Messenger, Excel, and couriers. ProtonicAI removed all of that. Orders go straight from chat to Steadfast without anyone touching a spreadsheet.",
    authorTitle: "Dr. Omar Faruk\nCEO of Rio Super Mart",
  },
  {
    id: "r2",
    reviewerName: "Robert David",
    businessName: "RIO Super Mart",
    quote:
      "With a team of 10, we were drowning in copy-pasting between Messenger, Excel, and couriers. ProtonicAI removed all of that. Orders go straight from chat to Steadfast without anyone touching a spreadsheet.",
    authorTitle: "Dr. Omar Faruk\nCEO of Rio Super Mart",
  },
];
