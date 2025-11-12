import getCurrentUser from "@/actions/getCurrentUser";
import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import prismadb from "@/lib/prismaDB/prismadb";
import { categorySchema, ICreateCategoryDto } from "@/validations/category";

import { NextRequest, NextResponse } from "next/server";

// CORS Handler
export async function OPTIONS(req: NextRequest) {
  const headers = CorsHandler(req);
  return new NextResponse(null, { status: 204, headers }); // 204 No Content is more appropriate for OPTIONS
}

/**
 * POST - Create a New Product
 * @method POST
 * @route ~/api/stores
 * @access private
 */

export async function POST(req: NextRequest) {
  const headers = CorsHandler(req);

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401, headers });
  }

  try {
    const body = (await req.json()) as ICreateCategoryDto;
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      const errorMessages = validation.error.errors.map((err) => err.message);
      return new NextResponse(
        JSON.stringify({ message: errorMessages.join(", ") }),
        { status: 400, headers: CorsHandler(req) },
      );
    }

    const {
      nameEn,
      nameAr,
      titleAr,
      titleEn,
      subtitleAr,
      subtitleEn,
      imageUrl,
      bgImage,
      isFeatured,
      
      isArchived,
    } = validation.data;

    // Generate slug from titleEn
    const slug = nameEn
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const category = await prismadb.category.create({
      data: {
        nameEn,
        slug,
        nameAr,
        titleAr,
        titleEn,
        subtitleAr,
        subtitleEn,
        imageUrl,
        bgImage,
        isFeatured,
        isArchived,
      },
    });

    return new NextResponse(JSON.stringify(category), { status: 201, headers });
  } catch (error) {
    console.error("[CATEGORY_POST_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500, headers });
  }
}

/**
 * GET - Fetch Products for a Store
 * @method GET
 * @route ~/api/stores
 * @access private
 */

export async function GET(req: NextRequest) {
  const headers = CorsHandler(req);

  try {
    const { searchParams } = new URL(req.url);
    const isFeatured = searchParams.get("isFeatured");

    const category = await prismadb.category.findMany({
      where: {
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!category.length) {
      return new NextResponse("No products found", { status: 404, headers });
    }

    return new NextResponse(JSON.stringify(category), { status: 200, headers });
  } catch (error) {
    console.error("[PRODUCTS_GET_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500, headers });
  }
}
