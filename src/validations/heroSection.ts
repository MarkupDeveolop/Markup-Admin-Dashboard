import * as z from "zod";


export const heroSectionSchema = z.object({
  nameEn: z.string().min(2).max(100),
  nameAr: z.string().min(2).max(100),
  titleEn: z.string().min(2),
  titleAr: z.string().min(2),
  subtitleEn: z.string().min(2).optional(),
  subtitleAr: z.string().min(2).optional(),
  descEn: z.string().min(2).optional(),
  descAr: z.string().min(2).optional(),
  imageUrl: z.string().optional(),
  bgUrl: z.string().optional(),
  
});



export interface IHeroDto {
  id: string;
  slug: string;

  nameEn: string;
  nameAr: string;

  titleEn: string;
  titleAr: string;

  subtitleEn: string;
  subtitleAr: string;

  descEn: string;
  descAr: string;

  imageUrl?: string;
  bgUrl?: string;

  isFeatured?: boolean;
  isArchived?: boolean;
  createdAt: string;
}
