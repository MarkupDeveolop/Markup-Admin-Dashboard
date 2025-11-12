import ProductForm from "@/components/PagesActionUi/Home/Products/ProductForm/ProductForm";
import prismadb from "@/lib/prismaDB/prismadb";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const ProductPage = async ({ params }: PageProps) => {
  const product = await prismadb.product.findUnique({
    where: {
      slug: (await params).slug,
    },
    include: {
      images: true,
      
    },
  });

  const categories = await prismadb.category.findMany();
  const brands = await prismadb.brand.findMany();

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          brands={brands}
        />
      </div>
    </div>
  );
};

export default ProductPage;
