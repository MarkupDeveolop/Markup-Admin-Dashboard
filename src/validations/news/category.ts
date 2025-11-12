import * as z from "zod";

export const articaleCategorySchema = z.object({
  slug: z.string().optional(),
  nameEn: z.string().min(2).max(500),
  nameAr: z.string().min(2).max(500),
  titleEn: z.string().min(2).max(500),
  titleAr: z.string().min(2).max(500),
  imageUrl: z.string().min(0).optional(),
  iconImage: z.string().min(0).optional(),
});

export interface IArticaleCategoryDto {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  imageUrl: string;
  iconImage: string;
  isFeatured?: boolean;
  isArchived?: boolean;
  createdAt: string;
}
