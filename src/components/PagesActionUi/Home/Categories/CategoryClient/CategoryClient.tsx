"use client";
import { Separator } from "@/components/ui//separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import Columns from "../Columns/Columns";
import CategoryColumnType from "@/types/categoryColmunType";
import { useRouter } from "@/i18n/routing";
import Heading from "@/components/common/Heading/Heading";

interface CategoryClientProps {
  data: CategoryColumnType[];
}

const CategoriesClient: React.FC<CategoryClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Categories (${data.length})`}
          description="Mange Categories for your store "
        />

        <Button
          className="bg-green-400"
          onClick={() => router.push(`/home/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator className="bg-slate-300" />

      <DataTable  columns={Columns} data={data} searchKey="nameEn" />

      {/* <Heading title="API" description="API calls for categories" />
      <Separator className="bg-slate-300" />

      <ApiList entityName="categories" entityIdName="categoryId" /> */}
    </>
  );
};

export default CategoriesClient;
