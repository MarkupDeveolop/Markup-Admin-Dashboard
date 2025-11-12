import * as z from "zod";


export const brandsSchema = z.object({
  nameEn: z.string().min(2).max(500),
  nameAr: z.string().min(2).max(500),
  titleEn: z.string().min(2).max(500).optional(),
  titleAr: z.string().min(2).max(500).optional(),
  subtitleEn: z.string().min(2).max(500).optional(),
  subtitleAr: z.string().min(2).max(500).optional(),
  slug: z.string().optional(),
  imageUrl: z.string().min(0).optional(),
  
});



export interface BrandsDto {
  id: string;
  slug: string;
  nameEn: string; 
  nameAr: string; 
  titleEn: string; 
  titleAr: string; 
  subtitleEn: string; 
  subtitleAr: string; 

  imageUrl: string; 
}