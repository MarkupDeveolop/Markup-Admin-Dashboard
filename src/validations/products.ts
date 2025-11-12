import { z } from "zod";


export const productSchema = z.object({
  titleEn: z.string()
    .min(2, { message: "English title must be at least 2 characters long" })
    .max(100, { message: "English title cannot exceed 100 characters" }),

  titleAr: z.string()
    .min(2, { message: "Arabic title must be at least 2 characters long" })
    .max(100, { message: "Arabic title cannot exceed 100 characters" }),

  subtitleEn: z.string()
    .min(2, { message: "English subtitle must be at least 2 characters long" }),

  subtitleAr: z.string()
    .min(2, { message: "Arabic subtitle must be at least 2 characters long" }),

  slug: z.string()
    .optional(),

  structureEn: z.string()
    .min(2, { message: "English structure must be at least 2 characters long" })
    .max(200, { message: "English structure cannot exceed 200 characters" })
    .trim(),

  structureAr: z.string()
    .min(2, { message: "Arabic structure must be at least 2 characters long" })
    .max(200, { message: "Arabic structure cannot exceed 200 characters" })
    .trim(),

  shelfLifeEn: z.string()
    .min(2, { message: "English shelf life must be at least 2 characters long" })
    .max(200, { message: "English shelf life cannot exceed 200 characters" })
    .trim(),

  shelfLifeAr: z.string()
    .min(2, { message: "Arabic shelf life must be at least 2 characters long" })
    .max(200, { message: "Arabic shelf life cannot exceed 200 characters" })
    .trim(),

  fillingEn: z.string()
    .min(2, { message: "English filling must be at least 2 characters long" })
    .max(200, { message: "English filling cannot exceed 200 characters" })
    .trim(),

  fillingAr: z.string()
    .min(2, { message: "Arabic filling must be at least 2 characters long" })
    .max(200, { message: "Arabic filling cannot exceed 200 characters" })
    .trim(),

  storageEn: z.string()
    .min(2, { message: "English storage must be at least 2 characters long" })
    .max(200, { message: "English storage cannot exceed 200 characters" })
    .trim(),

  storageAr: z.string()
    .min(2, { message: "Arabic storage must be at least 2 characters long" })
    .max(200, { message: "Arabic storage cannot exceed 200 characters" })
    .trim(),

  images: z.object({ url: z.string() })
    .array()
    .nonempty({ message: "At least one image is required" }),

  imageUrl: z.string()
    .min(0)
    .optional(),

  price: z.coerce.number()
    .min(0, { message: "Price must be a positive number" }),

  quantity: z.coerce.number()
    .min(0, { message: "Quantity cannot be negative" })
    .optional(),

  categoryId: z.coerce.string()
    .min(1, { message: "Category is required" }),

  brandId: z.coerce.string()
    .min(1, { message: "Brand is required" }),

  isBestSeller: z.boolean()
    .default(false)
    .optional(),

  isFeatured: z.boolean()
    .default(false)
    .optional(),

  isArchived: z.boolean()
    .default(false)
    .optional(),
});



export interface ICreateProductDto {
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;

  slug?: string;

  structureEn?: string;
  structureAr?: string;

  shelfLifeEn?: string;
  shelfLifeAr?: string;

  fillingEn?: string;
  fillingAr?: string;

  storageEn?: string;
  storageAr?: string;


  price: number;
  quantity: number;

  categoryId: string;
  brandId: string;

  images: { url: string }[];
  imageUrl: string;

  
  isFeatured?: boolean;
  isArchived?: boolean;
  createdAt: string;

}





// __________ Categoroies __________

export interface CategoryDto {
  id: string;
  slug:          string;   
  nameEn: string;
  nameAr: string;

  titleEn: string;
  titleAr: string;

  subtitleEn: string;
  subtitleAr: string;


  price: number;
  quantity: number;

  categoryId: string;
  productDetailsId: string;

  imageUrl: string;
  bgImage: string;

  
  isHero?: boolean;
  isBanner?: boolean;
  isFeatured?: boolean;
  isArchived?: boolean;
 
  createdAt: string;
}
