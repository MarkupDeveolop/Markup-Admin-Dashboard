/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Category } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "next/navigation";
import AlertModal from "@/components/Modals/alert-modal";

import ImageUpload from "@/components/ui/ImageUpload/ImageUpload";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "@/i18n/routing";
import { categorySchema } from "@/validations/category";
import { DOMAIN } from "@/lib/constains/constains";
import Heading from "@/components/common/Heading/Heading";
import { axiosErrorHandler } from "@/utils";

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData: Category | null;
}

const CategoriesForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Category" : "Created Category";
  const description = initialData ? "Edit a Category" : "Add a New Category";
  const toastMessage = initialData ? "Category Updated" : "Category Created";
  const action = initialData ? "Save changes" : "Created Category";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      nameEn: "",
      nameAr: "",
      titleEn: "",
      titleAr: "",
      subtitleEn: "",
      subtitleAr: "",
      imageUrl: "",
      bgImage: "",
      isFeatured: false,
      isArchived: false,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        const response = await axios.patch(
          `${DOMAIN}/api/home/categories/${params.slug}`,
          data
        );
        console.log("Update Response:", response.data);
      } else {
        const response = await axios.post(
          `${DOMAIN}/api/home/categories`,
          data
        );
        console.log("Create Response:", response.data);
      }
      toast.success(toastMessage);
      router.push(`/home/categories`);
      router.refresh();
    } catch (error: any) {
      console.error("API Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //______ Delete Store  __________
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${DOMAIN}/api/home/categories/${params.slug}`);
      router.refresh();
      router.push(`/home`);
      toast.success("Category Deleted.");
      router.refresh();
    } catch (error) {
      toast.error(
        "Make sure you removed all products and categories usning this category first."
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

        {initialData && (
          <Button
            disabled={loading}
            className="bg-red-700 p-1 rounded-md text-white hover:bg-slate-600"
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4 " />
          </Button>
        )}
      </div>
      <Separator className="bg-gray-300" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" space-y-8 w-full"
        >
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
                      placeholder="Category Name-En"
                      className=" placeholder:text-gray-500"
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
                      placeholder="Category Name-Ar"
                      className=" placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="titleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>title-En</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category title-En"
                      className=" placeholder:text-gray-500"
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
                  <FormLabel>title-Ar</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category title-Ar"
                      className=" placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="subtitleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>subtitle-En</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category subtitle-En"
                      className=" placeholder:text-gray-500"
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
                  <FormLabel>subtitle-Ar</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Category subtitle-Ar"
                      className=" placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="bgImage"
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
                  <FormLabel>Products Image</FormLabel>
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

          <div className="grid grid-cols-2  gap-8">
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="bg-slate-100 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormLabel>Featured</FormLabel>

                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="bg-slate-100 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field?.value}
                      onCheckedChange={field?.onChange}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived</FormLabel>

                    <FormDescription>
                      This product will not appear on anyware in the store
                    </FormDescription>
                  </div>
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

export default CategoriesForm;
