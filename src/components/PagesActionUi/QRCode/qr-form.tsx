"use client";
import { useState, useEffect } from "react";
import {
  qrTypeConfig,
  formatQRContent,
  generateQRCode,
} from "@/lib/QRCode/qr-utils";
import { createQRCode, updateQRCode } from "@/lib/QRCode/qr-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import * as Icons from "lucide-react";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { QRCodeType } from "@/types/QRCodeType";
import Image from "next/image";
import ImageUpload from "@/components/ui/ImageUpload/ImageUpload";

interface QRFormProps {
  brandQrCodeId: string;
  initialData?: {
    id: string;
    brandQrCodeId: string;
    title: string;
    type: QRCodeType;
    content: string;
    color: string;
    logo_url?: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PRESET_COLORS = [
  "#0066FF",
  "#FF3B30",
  "#34C759",
  "#FF9500",
  "#AF52DE",
  "#000000",
  "#FF2D55",
  "#5856D6",
];

// 🧭 Define type groups outside component for performance
const typeGroups = {
  general: ["url", "email", "phone", "sms"] as QRCodeType[],
  social: [
    "whatsapp",
    "instagram",
    "facebook",
    "twitter",
    "linkedin",
    "youtube",
    "tiktok",
  ] as QRCodeType[],
  other: ["location"] as QRCodeType[],
};

export function QRForm({
  brandQrCodeId,
  initialData,
  onSuccess,
  onCancel,
}: QRFormProps) {
  const [selectedType, setSelectedType] = useState<QRCodeType>(
    initialData?.type ?? "url"
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [color, setColor] = useState(initialData?.color || "#0066FF");
  const [logoPreview, setLogoPreview] = useState(initialData?.logo_url || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrPreview, setQrPreview] = useState<string>("");

  // 🔁 Live preview generation (debounced)
  useEffect(() => {
    if (!content.trim()) {
      setQrPreview("");
      return;
    }

    const generatePreview = async () => {
      try {
        const formattedContent = formatQRContent(selectedType, content);
        const preview = await generateQRCode(
          formattedContent,
          color,
          logoPreview || undefined
        );
        setQrPreview(preview);
      } catch (error) {
        console.error("Error generating preview:", error);
      }
    };

    const debounce = setTimeout(generatePreview, 400);
    return () => clearTimeout(debounce);
  }, [content, selectedType, color, logoPreview]);

  // 🧾 Save QR Code
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsGenerating(true);
    try {
      const formattedContent = formatQRContent(selectedType, content);
      const payload = {
        title,
        type: selectedType,
        content: formattedContent,
        color,
        logoUrl: logoPreview || "",
      };

      if (initialData?.id) {
        await updateQRCode(brandQrCodeId, { id: initialData.id, ...payload });
        toast.success("QR code updated successfully!");
      } else {
        await createQRCode(brandQrCodeId, payload);
        toast.success("QR code created successfully!");
      }

      // Reset fields after save
      setTitle("");
      setContent("");
      setColor("#0066FF");
      setLogoPreview("");
      onSuccess?.();
    } catch (error) {
      console.error("Error saving QR code:", error);
      toast.error("Failed to save QR code");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {initialData ? "Edit QR Code" : "Create New QR Code"}
          </CardTitle>
          <CardDescription>
            Customize your QR code with colors, logos, and styles.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome QR Code"
                required
              />
            </div>

            <Separator />

            {/* Type Selector */}
            <div className="space-y-3">
              <Label className="text-base">QR Code Type</Label>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>

                {Object.entries(typeGroups).map(([groupName, types]) => (
                  <TabsContent
                    key={groupName}
                    value={groupName}
                    className="mt-4"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {types.map((type) => {
                        const config = qrTypeConfig[type];
                        const IconComponent =
                          (Icons[
                            config.icon as keyof typeof Icons
                          ] as React.ComponentType<{
                            className?: string;
                          }>) || Icons.HelpCircle;

                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setSelectedType(type)}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:scale-105 hover:shadow-md ${
                              selectedType === type
                                ? "border-primary bg-primary/10 shadow-sm"
                                : "border-gray-200 hover:border-primary/50"
                            }`}
                          >
                            <IconComponent
                              className={`w-6 h-6 mb-2 ${
                                selectedType === type ? "text-primary" : ""
                              }`}
                            />
                            <span className="text-sm font-medium text-center">
                              {config.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label htmlFor="content">
                Enter your {qrTypeConfig[selectedType].label.toLowerCase()} *
              </Label>
              <Input
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={qrTypeConfig[selectedType].placeholder}
                required
              />
            </div>

            <Separator />

            {/* Style */}
            <div className="space-y-3">
              <Label className="text-base">Customize Style</Label>

              {/* Color Picker */}
              <div className="space-y-2">
                <Label htmlFor="color" className="text-sm">
                  QR Code Color
                </Label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {PRESET_COLORS.map((presetColor) => (
                    <button
                      key={presetColor}
                      type="button"
                      onClick={() => setColor(presetColor)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                        color === presetColor
                          ? "border-primary ring-2 ring-primary/30"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: presetColor }}
                      title={presetColor}
                    />
                  ))}
                </div>
                <div className="flex gap-3 items-center">
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-20 h-10 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#0066FF"
                    className="flex-1 font-mono"
                  />
                </div>
              </div>

              {/* Logo Upload */}
              <div className="space-y-2">
                <Label className="text-sm">Brand Logo (Optional)</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Upload your brand logo to embed it inside the QR code.
                </p>

                <ImageUpload
                  value={logoPreview ? [logoPreview] : []}
                  onChange={(url) => setLogoPreview(url)}
                  onRemove={() => setLogoPreview("")}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isGenerating}
                className="flex-1"
                size="lg"
              >
                {isGenerating
                  ? "Saving..."
                  : initialData
                  ? "Update QR Code"
                  : "Create QR Code"}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  size="lg"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <div className="lg:sticky lg:top-8 h-fit">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">Live Preview</CardTitle>
            <CardDescription>See how your QR code will look</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 flex items-center justify-center border-2 border-dashed min-h-[320px]">
              {qrPreview ? (
                <Image
                  src={qrPreview}
                  alt="QR Code Preview"
                  className="w-full h-full object-contain"
                  width={400}
                  height={400}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Icons.QrCode className="w-16 h-16 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Enter content to see preview</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
