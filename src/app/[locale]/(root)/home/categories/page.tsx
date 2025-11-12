import { format } from "date-fns";

import prismadb from "@/lib/prismaDB/prismadb";
import getCurrentUser from "@/actions/getCurrentUser";
import CategoriesClient from "@/components/PagesActionUi/Home/Categories/CategoryClient/CategoryClient";
import CategoryColumnType from "@/types/categoryColmunType";

const CategoriesPage = async () => {
  const currentUser = await getCurrentUser();

  const categories = await prismadb.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedCategories: CategoryColumnType[] = categories.map((item) => ({
    id: item.id,
    slug: item.slug,
    nameEn: item.nameEn,
    nameAr: item.nameAr,
    imageUrl: item.imageUrl,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
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
            <CategoriesClient data={formatedCategories.reverse()} />
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

export default CategoriesPage;
