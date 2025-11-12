import * as z from "zod";

export const BrandFeatureSchema = z.object({
  imageUrl: z.string().min(0).optional(), 
  titleEn: z.string().min(0).optional(),
  titleAr: z.string().min(0).optional(),
  featureEn: z.string().min(0).optional(),
  featureAr: z.string().min(0).optional(),
});


export const BrandSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1),
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  brandFeature: z.array(BrandFeatureSchema).optional(),
});




export interface IBrandFeatureDto {
  id?: string;
  titleEn: string;
  titleAr: string;
  featureEn: string;
  featureAr: string;
  imageUrl: string;
}

export interface IBrandDto {
  id?: string;
  imageUrl: string;
  titleEn: string;
  titleAr: string;
  nameEn: string;
  nameAr: string;
  brandFeature: IBrandFeatureDto[];
  createdAt?: string;
  updatedAt?: string;
}
