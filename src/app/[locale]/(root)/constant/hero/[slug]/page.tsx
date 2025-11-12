import HeroForm from "@/components/PagesActionUi/HeroSection/HeroForm/HeroForm";
import prismadb from "@/lib/prismaDB/prismadb";


type PageProps = {
  params: Promise<{ slug?: string }>;
};

const SingleArticalePage = async ({ params }: PageProps) => {

  const heroSection = await prismadb.heroSection.findUnique({
    where: {
      slug: (await params).slug,
    },
  });

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <HeroForm initialData={heroSection} />
      </div>
    </div>
  );
};

export default SingleArticalePage;
