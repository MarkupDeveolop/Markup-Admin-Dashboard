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


type PageProps = {
  params: Promise<{ categoriesId: string;  slug?: string}>;
};


export async function GET(
  request: NextRequest,
  { params }: PageProps
) {
  try {
    // Validate the slug parameter
    if (!(await params).slug) {
      return NextResponse.json(
        { error: "Category slug is required" },
        { status: 400 }
      );
    }

    // Fetch the category from the database
    const category = await prismadb.category.findUnique({
      where: {
        id: (await params).categoriesId,
        slug: (await params).slug,
      },
      select: {
        id: true,
        slug: true,
        titleAr: true,
        titleEn: true,
        nameAr: true,
        nameEn: true,
        subtitleAr: true,
        subtitleEn: true,
        imageUrl: true,
        bgImage: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Handle CORS and return the successful response
    const headers = CorsHandler(request);
    return NextResponse.json(category, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[CATEGORY_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle PATCH Request to update product
 */

export async function PATCH(
  req: NextRequest,
  { params }: PageProps
) {
  const currentUser = await getCurrentUser();

  // Authentication check
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = (await req.json()) as ICreateCategoryDto;

    // Validate input data using the schema
    const validation = categorySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
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

    const category = await prismadb.category.update({
      where: {
        id: (await params).categoriesId,
        slug: (await params).slug,
      },
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
      select: {
        id: true,
        slug: true,
        nameAr: true,
        nameEn: true,
        titleAr: true,
        titleEn: true,
        subtitleAr: true,
        subtitleEn: true,
        imageUrl: true,
        bgImage: true,
      },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(category, { headers });
  } catch (error) {
    console.error("[PRODUCTS_PATCH_ERROR]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * Handle DELETE Request to remove product
 */

export async function DELETE(
  req: NextRequest,
  { params }: PageProps
) {
  const currentUser = await getCurrentUser();

  // Authentication check (ensure user is logged in)
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Attempt to delete the product (no user restriction)
    const category = await prismadb.category.delete({
      where: { id: (await params).categoriesId, slug: (await params).slug,  },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(category, { status: 200, headers });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[PRODUCT_DELETE_ERROR]", error.message);
    const headers = CorsHandler(req);
    return new NextResponse(
      `Error: ${error.message || "Internal Server Error"}`,
      {
        status: 500,
        headers,
      }
    );
  }
}
