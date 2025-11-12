"use client";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/ui/data-table";
import ProductColumnType from "@/types/ProductColmunType";
import { useRouter } from "@/i18n/routing";
import Heading from "@/components/common/Heading/Heading";
import Colums from "../Colums/Colums";


interface ProductClientProps {
  data: ProductColumnType[];
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Products (${data.length})`}
          description="Mange billdboards for your store "
        />

        <Button
          className="bg-green-400"
          onClick={() => router.push(`/home/products/product/new `)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator className="bg-slate-300" />

      <DataTable columns={Colums} data={data} searchKey="titleEn" />
      
    </>
  );
};

export default ProductClient;
