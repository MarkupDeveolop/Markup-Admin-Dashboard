import { format } from "date-fns";
import prismadb from "@/lib/prismaDB/prismadb";
import { formater } from "@/lib/utils/utils";
import ProductColumnType from "@/types/ProductColmunType";
import getCurrentUser from "@/actions/getCurrentUser";
import ProductClient from "@/components/PagesActionUi/Home/Products/ProductClient/ProductClient";

const ProductsPage = async () => {
  const currentUser = await getCurrentUser();

  const isMangement =
    currentUser &&
    ["OWNER", "MANAGER", "ADMIN", "AdminOne"].includes(currentUser.role);

  if (!isMangement) {
    return (
      <div className="px-8 text-blue-500 py-5">
        You are not authorized to view this data.
      </div>
    );
  }

  const products = await prismadb.product.findMany({
    include: {
      
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formatedProducts: ProductColumnType[] = products.map((item) => ({
    id: item.id,
    slug: item.slug,
    titleEn: item.titleEn,
    titleAr: item.titleAr,
    isBestSeller: item.isBestSeller,

    isFeatured: item.isFeatured,
    isArchived: item.isArchived,

    price: formater.format(item.price),
    
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formatedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
