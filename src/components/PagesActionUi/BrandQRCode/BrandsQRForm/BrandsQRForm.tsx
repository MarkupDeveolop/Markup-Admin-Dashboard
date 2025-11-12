"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {  BrandQrCode } from "@prisma/client";
import { Trash } from "lucide-react";
import { useState } from "react";
import {
  Form,
  FormControl,
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

import { brandsSchema } from "@/validations/brands";
import { DOMAIN } from "@/lib/constains/constains";
import Heading from "@/components/common/Heading/Heading";
import { axiosErrorHandler } from "@/utils";
import { useRouter } from "@/i18n/routing";

type CategoryFormValues = z.infer<typeof brandsSchema>;

interface CategoryFormProps {
  initialData: BrandQrCode | null;
}

const BrandsQRForm: React.FC<CategoryFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Brand" : "Created Brand";
  const description = initialData ? "Edit a Brand" : "Add a New Brand";
  const toastMessage = initialData ? "Brand Updated" : "Brand Brand";
  const action = initialData ? "Save changes" : "Created Brand";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(brandsSchema),
    defaultValues: initialData || {
      nameEn: "",
      nameAr: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        const response = await axios.patch(
          `${DOMAIN}/api/brandQrCode/${params.brandQrCodeId}`,
          data
        );
        console.log("Update Response:", response.data);
      } else {
        const response = await axios.post(`${DOMAIN}/api/brandQrCode`, data);
        console.log("Create Response:", response.data);
      }

      toast.success(toastMessage);
      router.push(`/brandQrCode`);
      router.refresh();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      await axios.delete(`${DOMAIN}/api/brandQrCode/${params.brandQrCodeId}`);
      router.refresh();
      router.push(`/brandQrCode`);
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

export default BrandsQRForm;
