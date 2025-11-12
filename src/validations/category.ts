import * as z from "zod";

export const categorySchema = z.object({
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),

  slug: z.string().optional(),

  titleEn: z.string().min(1),
  titleAr: z.string().min(1),

  subtitleEn: z.string().min(1),
  subtitleAr: z.string().min(1),

  imageUrl: z.string().min(1),
  bgImage: z.string().min(1),

  isHero: z.boolean().default(false).optional(),
  isBanner: z.boolean().default(false).optional(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});

export interface ICreateCategoryDto {
  id: string;
  nameEn: string;
  nameAr: string;

  slug: string;

  titleEn: string;
  titleAr: string;

  subtitleEn: string;
  subtitleAr: string;

  imageUrl: string;
  bgImage?: string;

  isHero?: boolean;
  isBanner?: boolean;
  isFeatured?: boolean;
  isArchived?: boolean;

  createdAt: string;
}
