import * as z from "zod";

export const AchievementsSchema = z.object({
  slug: z.string().optional(),
  achiveNumber: z.string().min(1),
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),

  subtitleEn: z.string().min(1),
  subtitleAr: z.string().min(1),

  imageUrl: z.string().min(1),

});




export interface ICreateAchievementsDto {
  id: string;
  slug: string;
  achiveNumber: string;

  titleEn: string;
  titleAr: string;

  subtitleEn: string;
  subtitleAr: string;

  imageUrl: string;


  createdAt: string;
}



