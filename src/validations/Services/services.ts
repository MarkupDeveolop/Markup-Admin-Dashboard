import * as z from "zod";

export const ServicesFeatureSchema = z.object({
  titleEn: z.string().min(0).optional(),
  titleAr: z.string().min(0).optional(),
  nameEn: z.string().min(0).optional(),
  nameAr: z.string().min(0).optional(),
  imageUrl: z.string().min(0).optional(), // e.g. "Package", "Truck"
});


export const ServiceSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1), // e.g. "Package", "Truck"
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  nameEn: z.string().min(1),
  nameAr: z.string().min(1),
  serviceFeature: z.array(ServicesFeatureSchema).min(1),
});




export interface IServicesFeatureDto {
  id?: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  imageUrl: string;
}

export interface IServiceDto {
  id?: string;
  imageUrl: string;
  titleEn: string;
  titleAr: string;
  nameEn: string;
  nameAr: string;
  serviceFeature: IServicesFeatureDto[];
  createdAt?: string;
  updatedAt?: string;
}
