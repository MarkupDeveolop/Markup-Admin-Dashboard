"use client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus, Video } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import Heading from "@/components/common/Heading/Heading";
import ListGroupAction from "../ListGroupAction/ListGroupAction";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosErrorHandler } from "@/utils";
import { useState } from "react";
import BrandQRCodeType from "@/types/BrandQRCodeType";
import { DOMAIN } from "@/lib/constains/constains";
import Link from "@/components/common/Link";

interface BrandQRClientProps {
  data: BrandQRCodeType[];
}

const BrandQRClient: React.FC<BrandQRClientProps> = ({ data }) => {
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
      await axios.put(`/api/brandQrCode/reorder`, {
        list: updateData,
      });
      toast.success("Chapters reordered successfully!");
      router.refresh();
    } catch {
      toast.error("Failed to reorder chapters.");
    }
  };

  // Handle edit click
  const handleEdit = (id: string) => {
    router.push(`/brandQrCode/${id}`);
  };

  // Handle edit click
  const handleQRCode = (id: string) => {
    router.push(`/brandQrCode/${id}/qrCode`);
  };

  // Handle delete click
  const onDelete = async (id: string) => {
    try {
      setLoading(true);
      await axios.delete(`${DOMAIN}/api/brandQrCode/${id}`);
      router.refresh();
      router.push(`/brandQrCode`);
      toast.success("Category Deleted.");
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Heading
          title={`QR Code Brands (${data.length})`}
          description="Manage brand QR codes for your store."
        />

        <div className="flex items-center gap-8">
          <Link
            target="blank"
            href={`https://drive.google.com/file/d/1rEHtqCpPubo98dWkTtVHQxfQ9oQVp2VZ/view?usp=drive_link`}
          >
            <Button className="bg-red-700 hover:bg-red-900">
              <Video className="mr-2 h-4 w-4" />
              Explanation Feature
            </Button>
          </Link>

          <Button className="" onClick={() => router.push(`/brandQrCode/new`)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>
      </div>

      <Separator className="bg-slate-300" />

      {/* List (draggable) */}
      <ListGroupAction
        items={data}
        onEdit={handleEdit}
        onDelete={onDelete}
        QRCode={handleQRCode}
        onReorder={handleReorder}
      />
    </div>
  );
};

export default BrandQRClient;
