import CategoriesForm from "@/components/PagesActionUi/Home/Categories/CategoryForm/CategoryForm";
import prismadb from "@/lib/prismaDB/prismadb";


type PageProps = {
  params: Promise<{ slug: string }>;
};

const CategoryPage = async ({ params }: PageProps) => {
  const category = await prismadb.category.findUnique({
    where: {
      slug: (await params).slug,
    },
  });

  console.log("CAT", category);

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesForm initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
