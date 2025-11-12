import BrandsQRForm from "@/components/PagesActionUi/BrandQRCode/BrandsQRForm/BrandsQRForm";
import prismadb from "@/lib/prismaDB/prismadb";


type PageProps = {
  params: Promise<{ brandQrCodeId: string}>;
};

export default async function ProductPage({ params }: PageProps) {

  // For new brand creation
  if ((await params).brandQrCodeId === "new") {
    return (
      <div className="flex-col w-full">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BrandsQRForm initialData={null}  />
        </div>
      </div>
    );
  }

  const brandQrCode = await prismadb.brandQrCode.findUnique({
    where: {
      id: (await params).brandQrCodeId,
    },
    // include: {
      
    // },
  });

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BrandsQRForm initialData={brandQrCode}  />
      </div>
    </div>
  );
};

