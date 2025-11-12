import { format } from "date-fns";
import prismadb from "@/lib/prismaDB/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import BrandQRClient from "@/components/PagesActionUi/BrandQRCode/BrandQRClient/BrandQRClient";
import BrandQRCodeType from "@/types/BrandQRCodeType";

const BrandQrCodePage = async () => {
  const currentUser = await getCurrentUser();

  const brandQrCode = await prismadb.brandQrCode.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      qrcodes: true
    }
  });

  const formatedBrandQRCode: BrandQRCodeType[] = brandQrCode.map((item) => ({
    id: item.id,
    nameEn: item.nameEn,
    nameAr: item.nameAr,
    position: item.position,
    imageUrl: item.imageUrl,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  const isMangement =
    currentUser?.role === "OWNER" ||
    currentUser?.role === "MANAGER" ||
    currentUser?.role === "ADMIN";

  return (
    <>
      {isMangement ? (
        <div className="flex-col w-full">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <BrandQRClient data={formatedBrandQRCode} />
          </div>
        </div>
      ) : (
        <div className="px-8 text-blue-500 py-5">
          You Are Not A Manger To Showing Data
        </div>
      )}
    </>
  );
};

export default BrandQrCodePage;
