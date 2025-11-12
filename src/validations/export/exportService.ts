import * as z from "zod";

export const ExportFeatureSchema = z.object({
  featureEn: z.string().min(1),
  featureAr: z.string().min(1),
});


export const ExportServiceSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().min(1), // e.g. "Package", "Truck"
  titleEn: z.string().min(1),
  titleAr: z.string().min(1),
  subtitleEn: z.string().min(1),
  subtitleAr: z.string().min(1),
  features: z.array(ExportFeatureSchema).min(1),
});




export interface IExportFeatureDto {
  id?: string;
  featureEn: string;
  featureAr: string;
}

export interface IExportServiceDto {
  id?: string;
  imageUrl: string;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  features: IExportFeatureDto[];
  createdAt?: string;
  updatedAt?: string;
}
