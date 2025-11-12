import { format } from "date-fns";

import prismadb from "@/lib/prismaDB/prismadb";
import CategoryColumnType from "@/types/categoryColmunType"; // Adjust the path based on your folder structure
import getCurrentUser from "@/actions/getCurrentUser";
import BrandClient from "@/components/PagesActionUi/Home/Brands/BrandClient/BrandClient";

const BrandsPage = async () => {
  const currentUser = await getCurrentUser();

  const brands = await prismadb.brand.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedBrands: CategoryColumnType[] = brands.map((item) => ({
    id: item.id,
    slug: item.slug,
    nameEn: item.nameEn,
    nameAr: item.nameAr,
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
            <BrandClient data={formatedBrands.reverse()} />
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
