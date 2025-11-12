"use client";

import { useState, useEffect } from "react";
import { getQRCodes, deleteQRCode } from "@/lib/QRCode/qr-api";
import {
  generateQRCode,
  downloadQRCode,
  qrTypeConfig,
} from "@/lib/QRCode/qr-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import * as Icons from "lucide-react";
import { Download, Edit, Trash2, Eye } from "lucide-react";
import { QRCode } from "@/types/QRCodeType";
import toast from "react-hot-toast";
import Image from "next/image";

interface QRListProps {
  brandQrCodeId: string;
  onEdit?: (qrCode: QRCode) => void;
  refreshTrigger?: number;
}

export function QRList({ brandQrCodeId, onEdit, refreshTrigger }: QRListProps) {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [viewQR, setViewQR] = useState<{
    id: string;
    image: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    loadQRCodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const loadQRCodes = async () => {
    try {
      setLoading(true);
      const data = await getQRCodes(brandQrCodeId);
      setQrCodes(data);

      const images: Record<string, string> = {};
      for (const qr of data) {
        try {
          const img = await generateQRCode(
            qr.content,
            qr.color,
            qr.logoUrl || undefined
          );
          images[qr.id] = img;
        } catch (err) {
          console.error(`Error generating QR for ${qr.id}:`, err);
        }
      }
      setQrImages(images);
    } catch (error) {
      console.error("Error loading QR codes:", error);
      toast.error("Failed to load QR codes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteQRCode(brandQrCodeId, deleteId);
      toast.success("QR code deleted successfully");
      loadQRCodes();
    } catch (error) {
      console.error("Error deleting QR code:", error);
      toast.error("Failed to delete QR code");
    } finally {
      setDeleteId(null);
    }
  };

  const handleDownload = (qr: QRCode) => {
    const image = qrImages[qr.id];
    if (image) {
      downloadQRCode(image, qr.title);
      toast.success("QR code downloaded!");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (qrCodes.length === 0) {
    return (
      <Card className="p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Icons.QrCode className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">No QR Codes Yet</h3>
            <p className="text-sm text-gray-500">
              Create your first QR code to get started
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {qrCodes.map((qr) => {
          const config = qrTypeConfig[qr.type];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const IconComponent = Icons[config.icon as keyof typeof Icons] as any;
          const createdDate = new Date(qr.createdAt).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            }
          );

          return (
            <Card
              key={qr.id}
              className="group overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 border-2"
            >
              <CardHeader className="pb-3 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant="secondary"
                    className="gap-1.5 font-medium"
                    style={{
                      backgroundColor: `${qr.color}15`,
                      color: qr.color,
                    }}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {config.label}
                  </Badge>

                  {qr.logoUrl && (
                    <div className="w-6 h-6 rounded bg-white border shadow-sm p-0.5 flex items-center justify-center">
                      <Image
                        src={qr.logoUrl}
                        alt="Logo"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                  )}
                </div>

                <CardTitle className="text-lg leading-tight line-clamp-2">
                  {qr.title}
                </CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  {createdDate}
                </p>
              </CardHeader>

              <CardContent className="space-y-3 pt-4">
                {qrImages[qr.id] && (
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-white rounded-lg p-4 border-2 flex items-center justify-center group-hover:border-primary/40 transition-all">
                    <Image
                      src={qrImages[qr.id]}
                      alt={qr.title}
                      width={400}
                      height={400}
                      className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setViewQR({
                        id: qr.id,
                        image: qrImages[qr.id],
                        title: qr.title,
                      })
                    }
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(qr)}
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit?.(qr)}
                    className="w-full"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteId(qr.id)}
                    className="w-full"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete QR Code</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this QR code? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View QR Dialog */}
      <AlertDialog open={!!viewQR} onOpenChange={() => setViewQR(null)}>
        <AlertDialogContent className="max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              {viewQR?.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Scan this QR code with your camera
            </AlertDialogDescription>
          </AlertDialogHeader>
          {viewQR && (
            <div className="aspect-square bg-gradient-to-br from-gray-50 to-white rounded-lg p-8 border-2 flex items-center justify-center">
              <Image
                src={viewQR.image}
                alt={viewQR.title}
                width={400}
                height={400}
                className="object-contain w-full h-full"
              />
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                viewQR &&
                handleDownload(qrCodes.find((q) => q.id === viewQR.id)!)
              }
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
