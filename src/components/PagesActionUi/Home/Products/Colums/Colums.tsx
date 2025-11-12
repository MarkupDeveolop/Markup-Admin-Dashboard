"use client";
import { ColumnDef } from "@tanstack/react-table";
import ProductColumnType from "@/types/ProductColmunType";
import Image from "next/image";
import { CheckCircle, Circle, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ProductCellActon from "../ProductCallAction/ProductCellActon";

const Columns: ColumnDef<ProductColumnType>[] = [
  {
    accessorKey: "titleEn",
    header: "English Title",
    cell: ({ row }) => (
      <span className="font-medium line-clamp-1" title={row.original.titleEn}>
        {row.original.titleEn}
      </span>
    ),
  },
  {
    accessorKey: "images",
    header: "Image",
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        {row.original.images?.[0]?.url ? (
          <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <Image
              src={row.original.images[0].url}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              alt={`Product image for ${row.original.titleEn}`}
              priority={false}
            />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-md bg-gray-100 flex items-center justify-center">
            <span className="text-xs text-gray-500">No Image</span>
          </div>
        )}
      </div>
    ),
  },

  {
    accessorKey: "brand",
    header: "Brand",
    cell: ({ row }) => (
      <Badge className="capitalize bg-red-600">{row.original.brand}</Badge>
    ),
  },

  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <Badge className="capitalize">{row.original.category}</Badge>
    ),
  },

  {
    accessorKey: "isBestSeller",
    header: "Best Seller",
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        {row.original.isBestSeller ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium text-yellow-600">
              Bestseller
            </span>
          </div>
        ) : (
          <div className="text-xs text-red-400">-</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.isFeatured ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <Circle className="h-4 w-4 text-gray-300" />
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ProductCellActon data={row.original} />,
    header: "Actions",
  },
];

export default Columns;
