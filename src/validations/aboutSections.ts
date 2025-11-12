import { z } from "zod";

export const aboutSectionSchema = z.object({
  nameEn: z.string().min(2).max(100),
  nameAr: z.string().min(2).max(100),

  titleEn: z.string().min(2).max(100),
  titleAr: z.string().min(2).max(100),

  subtitleEn: z.string().min(2),
  subtitleAr: z.string().min(2),

  descEn: z.string().min(2),
  descAr: z.string().min(2),

  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  imageUrl: z.string().min(1).optional(),
  imageUrlBg: z.string().min(1).optional(),

  sectionItem: z
    .array(
      z.object({
        titleEn: z.string().min(2).max(1000),
        titleAr: z.string().min(2).max(1000),
        subtitleEn: z.string().min(2).max(1000),
        subtitleAr: z.string().min(2).max(1000),

        addNumber: z.string().min(2).max(100),
        imageUrl: z.string().min(1).optional(),
      }),
    )
    .max(10, "You can only add up to 10 items")
    .optional(),
});

// Type Handle History
export interface ICreateAboutSectionsDto {
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  descEn: string;
  descAr: string;
  sectionItem: sectionItem[];
  imageUrl: string;
  imageUrlBg: string;
  isFeatured: boolean;
  isArchived?: boolean;
  createdAt?: string;
}

export interface sectionItem {
  id: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;

  descriptionEn?: string;
  descriptionAr?: string;

  addNumber: string;
  imageUrl: string;
}
