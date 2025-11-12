import ServicesForm from "@/components/PagesActionUi/Services/ServicesForm/ServicesForm";
import prismadb from "@/lib/prismaDB/prismadb";


type PageProps = {
  params: Promise<{ slug: string }>;
};


const BrandPage = async ({ params }: PageProps) => {
 
  const services = await prismadb.services.findUnique({
    where: {
      slug: (await params).slug,
    },

    include: {
      serviceFeature: true
    }
  });

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ServicesForm initialData={services} />
      </div>
    </div>
  );
};

export default BrandPage;
