"use client";
import { ColumnDef } from "@tanstack/react-table";

import CellActon from "../CellAction/cell-action";
import Image from "next/image";
import HeroColumnType from "@/types/HeroColumnType";

const Columns: ColumnDef<HeroColumnType>[] = [
  {
    accessorKey: "nameEn",
    header: "NameEn",
  },

  {
    accessorKey: "nameAr",
    header: "NameAr",
  },

  {
    accessorKey: "bgUrl",
    header: "Category Image",
    cell: ({ row }) =>
      row.original.bgUrl ? (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
          <Image
            src={row.original.bgUrl}
            layout="fill"
            objectFit="cover"
            alt="Partner Image"
          />
        </div>
      ) : (
        <span className="text-gray-500">No Image</span>
      ),
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },

  {
    id: "actions",
    cell: ({ row }) => <CellActon data={row.original} />,
  },
];

export default Columns;
