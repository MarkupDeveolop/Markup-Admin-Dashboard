import { z } from "zod";

export const newsArticaleSchema = z.object({
  slug: z.string().optional(),

  nameEn: z.string().min(2).max(100),
  nameAr: z.string().min(2).max(100),

  titleEn: z.string().min(2).max(100),
  titleAr: z.string().min(2).max(100),
  subtitleEn: z.string().min(2),
  subtitleAr: z.string().min(2),
  descEn: z.string().min(2),
  descAr: z.string().min(2),

  timeEn: z.string().min(2),
  timeAr: z.string().min(2),
  articaleCategoryId: z.coerce.string().min(0),

  articaleImages: z.object({ url: z.string() }).array(),
  imageUrl: z.string().min(0).optional(),


  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
});


export interface ICreateNewsArticaleDto {
  slug?: string;
  authorEmail?: string; // Changed from 'author' to match Prisma model
  
  articaleCategoryId: string;

  nameEn: string;
  nameAr: string;

  titleEn: string;
  titleAr: string;

  subtitleEn: string;
  subtitleAr: string;

  descEn: string; // Made optional to match Prisma model
  descAr: string; // Made optional to match Prisma model

  timeEn: string; // Made optional to match Prisma model
  timeAr: string; // Made optional to match Prisma model

  articaleImages: { url: string }[];
  imageUrl: string; // Made optional to match Prisma model

  isFeatured: boolean;
  isArchived: boolean;
  createdAt: Date | string; // Prisma will handle DateTime
}