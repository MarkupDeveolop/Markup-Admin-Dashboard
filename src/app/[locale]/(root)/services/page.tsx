import { format } from "date-fns";

import prismadb from "@/lib/prismaDB/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import BrandsType from "@/types/BrandsType";
import ServicesClient from "@/components/PagesActionUi/Services/ServicesClient/ServicesClient";

const BrandsPage = async () => {
  const currentUser = await getCurrentUser();

  const services = await prismadb.services.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      serviceFeature: true

    }
  });

  const formatedBrands: BrandsType[] = services.map((item) => ({
    id: item.id,
    slug: item.slug,
    nameEn: item.nameEn,
    nameAr: item.nameAr,
    titleEn: item.nameEn,
    titleAr: item.nameAr,
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
            <ServicesClient data={formatedBrands.reverse()} />
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

export default BrandsPage;
