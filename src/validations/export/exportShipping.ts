import * as z from "zod";

export const ExportShippingSchema = z.object({
  slug: z.string().optional(),
  imageUrl: z.string().min(1),

  titleEn: z.string().min(1),
  titleAr: z.string().min(1),

  subtitleEn: z.string().min(1),
  subtitleAr: z.string().min(1),

  durationEn: z.string().min(1),
  durationAr: z.string().min(1),

  capacityEn: z.string().min(1),
  capacityAr: z.string().min(1),

  costEn: z.string().min(1),
  costAr: z.string().min(1),
});




export interface ICreateExportShippingDto {
  id: string;
  slug: string;

  imageUrl: string;
  
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;

  durationEn: string;
  durationAr: string;

  capacityEn: string;
  capacityAr: string;

  costEn: string;
  costAr: string;

  createdAt: string;
}



