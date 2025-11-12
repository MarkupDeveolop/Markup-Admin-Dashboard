"use client";
import {Edit, Trash} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import AlertModal from "@/components/Modals/alert-modal";
import ProductColumnType from "@/types/ProductColmunType";
import { useRouter } from "@/i18n/routing";
import { DOMAIN } from "@/lib/constains/constains";
import { axiosErrorHandler } from "@/utils";

interface CellActionProps {
  data: ProductColumnType;
}

const ProductCellActon: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  //______ Delete Store  __________
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${DOMAIN}/api/home/products/${data.slug}`);
      router.refresh();
      router.push(`/home/products`);
      toast.success("Product Deleted.");
      router.refresh();
    } catch (error) {
      toast.error(
        "Make sure you removed all products and categories usning this billboard first."
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

      <div className="flex items-center space-x-2">
       

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/home/products/${data.slug}`)}
          title="Edit"
          className="hover:bg-slate-300"
        >
          <Edit className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          title="Delete"
          className="text-red-600 hover:text-red-600 hover:bg-slate-500"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default ProductCellActon;
