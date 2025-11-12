"use client";
import * as z from "zod";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, MinusCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Heading from "@/components/common/Heading/Heading";
import AlertModal from "@/components/Modals/alert-modal";

import { DOMAIN } from "@/lib/constains/constains";
import { useRouter } from "@/i18n/routing";
import { axiosErrorHandler } from "@/utils";
import ImageUpload from "@/components/ui/ImageUpload/ImageUpload";
import { ServiceSchema } from "@/validations/Services/services";

type ServiceFormValues = z.infer<typeof ServiceSchema>;

interface ServiceFormProps {
  initialData: ServiceFormValues | null;
}

const ServicesForm: React.FC<ServiceFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit services" : "Create services";
  const description = initialData
    ? "Edit the selected services details."
    : "Add a new service entry.";
  const toastMessage = initialData
    ? "services updated successfully."
    : "services created successfully.";
  const action = initialData ? "Save Changes" : "Create services";

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(ServiceSchema),
    defaultValues: initialData || {
      imageUrl: "",
      titleEn: "",
      titleAr: "",
      nameEn: "",
      nameAr: "",
      serviceFeature: [
        {
          imageUrl: "",
          titleEn: "",
          titleAr: "",
          nameEn: "",
          nameAr: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "serviceFeature",
  });

  const onSubmit = async (data: ServiceFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`${DOMAIN}/api/services/${params.slug}`, data);
      } else {
        await axios.post(`${DOMAIN}/api/services`, data);
      }

      toast.success(toastMessage);
      router.push(`/services`);
      router.refresh();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      axiosErrorHandler(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${DOMAIN}/api/services/${params.slug}`);
      toast.success("Export service deleted successfully.");
      router.push(`/export/services`);
      router.refresh();
    } catch (error) {
      axiosErrorHandler(error);
      toast.error("Please remove related dependencies before deleting.");
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

      <div className="flex items-center justify-between mb-6">
        <Heading title={title} description={description} />
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Separator className="mb-8 bg-gray-300" />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-10 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border"
        >
          {/* Basic info */}

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (English)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter English title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title (Arabic)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="أدخل العنوان بالعربية"
                      dir="rtl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="titleEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (English)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter English Subtitle"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titleAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle (Arabic)</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="أدخل الوصف بالعربية"
                      dir="rtl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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

          {/* Features List */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Features</h3>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-5 bg-slate-50 shadow-md p-4 rounded-lg"
              >
                <div className="">
                  <FormField
                    control={form.control}
                    name={`serviceFeature.${index}.imageUrl`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Background Section</FormLabel>
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

                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="mt-2"
                    onClick={() => remove(index)}
                  >
                    <MinusCircle className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
                <div className="">
                  <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`serviceFeature.${index}.nameEn`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feature (English)</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Enter English feature"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`serviceFeature.${index}.nameAr`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Feature (Arabic)</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="أدخل الميزة بالعربية"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`serviceFeature.${index}.titleEn`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>title (English)</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Enter English title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`serviceFeature.${index}.titleAr`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>title (Arabic)</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="أدخل الميزة بالعربية"
                            dir="rtl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                
                </div>

                
              </div>
            ))}

            </div>
            
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  nameEn: "",
                  nameAr: "",
                  titleEn: "",
                  titleAr: "",
                  imageUrl: "",
                })
              }
            >
              <PlusCircle className="h-4 w-4 mr-2" /> Add Feature
            </Button>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              disabled={loading}
              className="bg-slate-800 text-white hover:bg-slate-700 px-6 py-2 rounded-lg"
            >
              {action}
            </Button>
          </div>
        </form>
      </Form>

      <Separator className="mt-10 bg-gray-300" />
    </>
  );
};

export default ServicesForm;
