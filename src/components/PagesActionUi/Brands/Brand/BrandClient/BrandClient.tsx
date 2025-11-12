"use client";
import { Separator } from "@/components/ui//separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import Heading from "@/components/common/Heading/Heading";
import BrandListGroupAction from "../BrandListGroupAction/BrandListGroupAction";
import { DOMAIN } from "@/lib/constains/constains";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosErrorHandler } from "@/utils";
import { useState } from "react";
import BrandsType from "@/types/BrandsType";

interface BrandsClientProps {
  data: BrandsType[];
}

const BrandClient: React.FC<BrandsClientProps> = ({ data }) => {
const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [open, setOpen] = useState(false);

  // Handle item reorder (you can connect this to a mutation or API call)
  const handleReorder = async (
    updateData: { id: string; position: number }[]
  ) => {
    console.log("Reordered items:", updateData);
    try {
      await axios.put(`/api/brands/brand/reorder`, {
        list: updateData,
      });
      toast.success("Chapters reordered successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to reorder chapters.");
    }
  };

  // Handle edit click
  const handleEdit = (slug: string) => {
    router.push(`/brands/brand/${slug}`);
  };

  // Handle delete click
  const onDelete = async (slug: string) => {
    try {
      setLoading(true);
      await axios.delete(`${DOMAIN}/api/brands/brand/${slug}`);
      router.refresh();
      router.push(`/brands/brand`);
      toast.success("brand Deleted.");
      router.refresh();
    } catch (error) {
      toast.error(
        "Make sure you removed all products and categories usning this category first."
      );
      axiosErrorHandler(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Our Brands (${data.length})`}
          description="Mange Brands for your store "
        />

        <Button
          className=""
          onClick={() => router.push(`/brands/brand/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator className="bg-slate-300" />
      
            {/* List (draggable) */}
            <BrandListGroupAction
              items={data}
              onEdit={handleEdit}
              onDelete={onDelete}
              onReorder={handleReorder}
            />
      <Separator className="bg-slate-300" />

    </>
  );
};

export default BrandClient;
