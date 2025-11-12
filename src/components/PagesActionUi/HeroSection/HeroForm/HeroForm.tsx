"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "next/navigation";
import AlertModal from "@/components/Modals/alert-modal";

import ImageUpload from "@/components/ui/ImageUpload/ImageUpload";
import { Input } from "@/components/ui/input";
import { DOMAIN } from "@/lib/constains/constains";
import { useRouter } from "@/i18n/routing";
import { HeroSection } from "@prisma/client";
import { heroSectionSchema } from "@/validations/heroSection";
import { axiosErrorHandler } from "@/utils";
import Heading from "@/components/common/Heading/Heading";

type HeroFormValues = z.infer<typeof heroSectionSchema>;

interface HeroFormProps {
  initialData: HeroSection | null;
}

const HeroForm: React.FC<HeroFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Hero Section" : "Create Hero Section";
  const description = initialData
    ? "Edit the hero section"
    : "Add a new hero section";
  const toastMessage = initialData
    ? "Hero Section updated"
    : "Hero Section created";
  const action = initialData ? "Save changes" : "Create Hero Section";

  const form = useForm<HeroFormValues>({
    resolver: zodResolver(heroSectionSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          nameEn: "",
          nameAr: "",
          titleEn: "",
          titleAr: "",
          subtitleEn: "",
          subtitleAr: "",
          descEn: "",
          descAr: "",
          imageUrl: "",
          bgUrl: "",
        },
  });

  const onSubmit = async (data: HeroFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        const response = await axios.patch(
          `${DOMAIN}/api/heroSection/${params.slug}`,
          data
        );
        console.log("Update Response:", response.data);
      } else {
        const response = await axios.post(`${DOMAIN}/api/heroSection`, data);
        console.log("Create Response:", response.data);
      }

      toast.success(toastMessage);
      router.push(`/heroSection`);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Delete Hero Section
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${DOMAIN}/api/heroSection/${params.slug}`);
      router.push(`/heroSection`);
      toast.success("Hero Section deleted.");
      router.refresh();
    } catch (error) {
      toast.error(
        "Make sure you removed all hero sections and categories using this hero section first."
      );
      axiosErrorHandler(error)
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <div className="flex items-center justify-between w-full">
        <Heading title={title} description={description} />

        {/* {initialData && (
          <Button
            disabled={loading}
            className="bg-red-700 p-1 rounded-md text-white hover:bg-slate-600"
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4 " />
          </Button>
        )} */}
      </div>
      <Separator className="bg-gray-300" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {/* Name Fields */}
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name-En</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Name En"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name-Ar</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Name Ar"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          {/* Title Fields */}
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="titleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title-En</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Title En"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titleAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title-Ar</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Title Ar"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          {/* Subtitle Fields */}
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="subtitleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle-En</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Subtitle En"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitleAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle-Ar</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Subtitle Ar"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          {/* Description Fields */}
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="descEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description-En</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Description En"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description-Ar</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Description Ar"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="bgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={loading}
            className="ml-auto bg-slate-800 text-white hover:bg-slate-600"
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator className="bg-gray-300" />
    </>
  );
};

export default HeroForm;
