"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Brand, Category, Images, Product } from "@prisma/client";
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
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "next/navigation";

import AlertModal from "@/components/Modals/alert-modal";
import ImageUpload from "@/components/ui/ImageUpload/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { productSchema } from "@/validations/products";
import { DOMAIN } from "@/lib/constains/constains";
import { useRouter } from "@/i18n/routing";
import Heading from "@/components/common/Heading/Heading";
import { axiosErrorHandler } from "@/utils";

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Images[];
      })
    | null;
  categories: Category[];
  brands: Brand[];
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  brands,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Product" : "Created Product";
  const description = initialData ? "Edit a Product" : "Add a New Product";
  const toastMessage = initialData ? "Product Updated" : "Product Created";
  const action = initialData ? "Save changes" : "Created Product";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          quantity: parseFloat(String(initialData?.quantity)),
        }
      : {
          titleEn: "",
          titleAr: "",
          subtitleEn: "",
          subtitleAr: "",

          structureEn: "Choclate Cake Bar",
          structureAr: "كيك بار شيكولاته",

          shelfLifeEn: "3-12 months",
          shelfLifeAr: "شهور 3-12",

          fillingEn: "Cacao",
          fillingAr: "كاكاو",

          storageEn: "Cool and Dry",
          storageAr: "مكان بارد و جاف",

          price: 0,
          quantity: 0,

          categoryId: "",
          brandId: "",
          images: [],
          imageUrl: "",
          isFeatured: false,
          isArchived: false,
        },
  });

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setLoading(true);

      if (initialData) {
        const response = await axios.patch(
          `${DOMAIN}/api/home/products/${params.slug}`,
          data
        );
        console.log("Update Response:", response.data);
      } else {
        const response = await axios.post(`${DOMAIN}/api/home/products`, data);
        console.log("Create Response:", response.data);
      }

      toast.success(toastMessage);
      router.push(`/home/products`);
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
      await axios.delete(`${DOMAIN}/api/home/products/${params.slug}`);
      router.refresh();
      router.push(`/home/products`);
      toast.success("Products Deleted.");
      router.refresh();
    } catch (error) {
      toast.error(
        "Make sure you removed all products and categories usning this billboard first."
      );
      axiosErrorHandler(error);
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
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3  gap-8">
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

          {/* ______ SubTitles _________ */}

          <div className="grid grid-cols-3  gap-8">
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

          {/* ______ Descriptions _________ */}

          <div className="grid grid-cols-3  gap-8">
            <FormField
              control={form.control}
              name="structureEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>structure-En</FormLabel>
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
              name="structureAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Structure-Ar</FormLabel>
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

          <div className="grid grid-cols-3  gap-8">
            <FormField
              control={form.control}
              name="shelfLifeEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ShelfLife-En</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="ShelfLife En"
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
              name="shelfLifeAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ShelfLife-Ar</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="ShelfLife Ar"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3  gap-8">
            <FormField
              control={form.control}
              name="fillingEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filling-En</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="fillingEn"
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
              name="fillingAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Filling-Ar</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="fillingAr"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-3  gap-8">
            <FormField
              control={form.control}
              name="storageEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>storage-En</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="storageEn"
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
              name="storageAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>storage-Ar</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="storageAr"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>

          {/* ______ Price and Category and Size _________ */}

          <div className="grid grid-cols-3  gap-8">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={String(field.value)}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a category"
                        />

                        <SelectContent className="bg-white">
                          {categories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={String(category.id)}
                            >
                              {category.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectTrigger>
                    </FormControl>
                  </Select>

                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brandId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brands</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={String(field.value)}
                    defaultValue={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a Brand"
                        />

                        <SelectContent className="bg-white">
                          {brands.map((brand) => (
                            <SelectItem key={brand.id} value={String(brand.id)}>
                              {brand.nameEn}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectTrigger>
                    </FormControl>
                  </Select>

                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-3  gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Price"
                      className="placeholder:text-gray-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={loading}
                        placeholder="Quantity"
                        className="placeholder:text-gray-500"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ___ Images Upload _______ */}

          <div className="grid grid-cols-3  gap-8">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Images</FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value.map((image) => image.url)}
                      onChange={(url) =>
                        field.onChange([...field.value, { url }])
                      }
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
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
                  <FormLabel>Category Product Image</FormLabel>
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

          {/* ______ Featured PPPPPP _________ */}

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
              name="isBestSeller"
              render={({ field }) => (
                <FormItem className="bg-slate-100 flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <div className="space-y-1 leading-none">
                    <FormLabel>Best Seller</FormLabel>

                    <FormDescription>
                      This product Is Best Seller
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

export default ProductForm;
