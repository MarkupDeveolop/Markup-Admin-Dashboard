"use client";

import { ColumnDef } from "@tanstack/react-table";
import CategoryColumnType from "@/types/categoryColmunType"; // Adjust the path based on your folder structure
import CellActon from "../CellAction/cell-action";
import Image from "next/image";



const Columns: ColumnDef<CategoryColumnType>[] = [
  {
    accessorKey: "nameEn",
    header: "NameEn",
  },

  {
    accessorKey: "nameAr",
    header: "NameAr",
  },

  {
    accessorKey: "imageUrl",
    header: "Category Image",
    cell: ({ row }) =>
      row.original.imageUrl ? (
        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-300 shadow-sm">
          <Image
            src={row.original.imageUrl}
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
