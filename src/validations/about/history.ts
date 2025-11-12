import * as z from "zod";

export const historySchema = z.object({
  slug: z.string().optional(),
  
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),

  subtitleEn: z.string().min(1),
  subtitleAr: z.string().min(1),
  year: z.string().min(1),

  imageUrl: z.string().min(1),

  isMajor: z.boolean().default(false).optional(),
});




export interface ICreateHistoryDto {
  id: string;
  slug: string;

  titleEn: string;
  titleAr: string;

  subtitleEn: string;
  subtitleAr: string;

  year: string;

  imageUrl: string;

  isMajor?: boolean;

  createdAt: string;
}



