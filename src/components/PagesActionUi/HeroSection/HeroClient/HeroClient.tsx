"use client";
import Columns from "../Columns/Columns";
import HeroColumnType from "@/types/HeroColumnType";
import Heading from "@/components/common/Heading/Heading";
import { DataTable } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";

interface HeroClientProps {
  data: HeroColumnType[];
}

const HeroClient: React.FC<HeroClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Categories (${data.length})`}
          description="Mange Categories for your store "
        />

        {/* <Button
          className="bg-green-400"
          onClick={() => router.push(`/heroSection/new `)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button> */}
      </div>
      <Separator className="bg-slate-300" />

      <DataTable columns={Columns} data={data} searchKey="nameEn" />
      <Separator className="bg-slate-300" />

      {/* <Heading title="API" description="API calls for categories" />
      <Separator className="bg-slate-300" />

      <ApiList entityName="heroSection" entityIdName="heroSectionId" /> */}
    </>
  );
};

export default HeroClient;
