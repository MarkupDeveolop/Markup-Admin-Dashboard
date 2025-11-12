"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, List, Plus } from "lucide-react";
import { QRCode } from "@/types/QRCodeType";
import { QRForm } from "@/components/PagesActionUi/QRCode/qr-form";
import { QRList } from "@/components/PagesActionUi/QRCode/qr-list";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import BrandQRCodeType from "@/types/BrandQRCodeType";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";

export default function Home() {
  const params = useParams();
  const brandQrCodeId = params.brandQrCodeId as string;
  const [brand, setBrand] = useState<BrandQRCodeType | null>(null);
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("create");
  const [editingQR, setEditingQR] = useState<QRCode | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const res = await fetch(`/api/brandQrCode/${brandQrCodeId}`);
        if (!res.ok) return;
        const data = await res.json();
        setBrand(data);
      } catch {
      }
    };
    if (brandQrCodeId) loadBrand();
  }, [brandQrCodeId]);

  const handleEdit = (qr: QRCode) => {
    setEditingQR(qr);
    setActiveTab("create");
  };

  const handleSuccess = () => {
    setEditingQR(null);
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab("manage");
  };

  const handleCancel = () => {
    setEditingQR(null);
  };

  return (
    <div className=" w-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        
        <div className="mb-6 flex items-center justify-between">
         

          {brand?.imageUrl && (
            <div className="flex items-center gap-3">
      <div className="w-[40px] md:w-[50px] lg:w-[70px] bg-white p-2 rounded-lg flex items-center justify-center shadow-md dark:shadow-lg shadow-blue-300 dark:shadow-gray-500 ">
                <Image
                  src={brand.imageUrl}
                  alt={`${brand.nameEn} logo`}
                  width={400}
                  height={400}
                  className="w-full object-contain"
                />
              </div>
              <div className="">
                <h2 className="text-md  font-semibold text-slate-800">
                {brand.nameEn}
              </h2>
              <p className="text-sm   text-gray-800">
                QR Code Manager
              </p>
              </div>
              
            </div>
          )}
           <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
              <TabsTrigger value="create" className="text-base">
                <Plus className="w-4 h-4 mr-2" />
                Create
              </TabsTrigger>
              <TabsTrigger value="manage" className="text-base">
                <List className="w-4 h-4 mr-2" />
                Brand QR Codes
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="create" className="mt-0">
            <QRForm
              brandQrCodeId={brandQrCodeId}
              initialData={
                editingQR
                  ? {
                      id: editingQR.id,
                      brandQrCodeId: brandQrCodeId,
                      title: editingQR.title,
                      type: editingQR.type,
                      content: editingQR.content,
                      color: editingQR.color,
                      logo_url: editingQR.logoUrl || undefined,
                    }
                  : undefined
              }
              onSuccess={handleSuccess}
              onCancel={editingQR ? handleCancel : undefined}
            />
          </TabsContent>

          <TabsContent value="manage" className="mt-0">
            <QRList
              brandQrCodeId={brandQrCodeId}
              onEdit={handleEdit}
              refreshTrigger={refreshTrigger}
            />
          </TabsContent>
        </Tabs>

        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Built with Next.js, Prisma, MongoDB, and Tailwind CSS</p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}
