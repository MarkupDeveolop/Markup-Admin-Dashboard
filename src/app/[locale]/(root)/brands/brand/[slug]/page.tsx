import BrandForm from "@/components/PagesActionUi/Brands/Brand/BrandForm/BrandForm";
import prismadb from "@/lib/prismaDB/prismadb";


type PageProps = {
  params: Promise<{ slug: string }>;
};


const BrandPage = async ({ params }: PageProps) => {
 
  const brand = await prismadb.brand.findUnique({
    where: {
      slug: (await params).slug,
    },

    include: {
      brandFeature: true
    }
  });

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BrandForm initialData={brand} />
      </div>
    </div>
  );
};

export default BrandPage;
