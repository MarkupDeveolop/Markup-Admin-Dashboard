"use client";
import { Copy, Edit } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import AlertModal from "@/components/Modals/alert-modal";
import HeroColumnType from "@/types/HeroColumnType";
import { DOMAIN } from "@/lib/constains/constains";
import { axiosErrorHandler } from "@/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

interface CellActionProps {
  data: HeroColumnType;
}

const CellActon: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const onCopy = (slug: string) => {
    navigator.clipboard.writeText(slug);
    toast.success("Category Id Copied to the clipboard");
  };

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  //______ Delete Store  __________
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`${DOMAIN}/api/heroSection/${data.slug}`);
      router.refresh();
      router.push(`/heroSection`);
      toast.success("Category Deleted.");
      router.refresh();
    } catch (error) {
      toast.error(
        "Make sure you removed all products and heroSection usning this heroSection first."
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
          onClick={() => onCopy(data.slug as string)}
          title="Copy ID"
          className="hover:bg-slate-500"
        >
          <Copy className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/heroSection/${data.slug}`)}
          title="Edit"
          className="hover:bg-slate-300"
        >
          <Edit className="h-4 w-4" />
        </Button>

        {/* <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          title="Delete"
          className="text-red-600 hover:text-red-600 hover:bg-slate-500"
        >
          <Trash className="h-4 w-4" />
        </Button> */}
      </div>
    </>
  );
};

export default CellActon;
