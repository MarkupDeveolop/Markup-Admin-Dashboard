import * as z from "zod";


export const FAQSchema = z.object({
  id: z.string().optional(),
  questionEn: z.string().min(1),
  questionAr: z.string().min(1),
  answerEn: z.string().min(1),
  answerAr: z.string().min(1),
  imageUrl: z.string().min(1),
  bgUrl: z.string().min(1),

});





export interface IFAQDto {
  id?: string;
  imageUrl: string;
  bgUrl: string;
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
  createdAt?: string;
  updatedAt?: string;
}
