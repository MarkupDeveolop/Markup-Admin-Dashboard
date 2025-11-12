import getCurrentUser from "@/actions/getCurrentUser";
import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import prismadb from "@/lib/prismaDB/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { heroSectionSchema, IHeroDto } from "@/validations/heroSection";
import { axiosErrorHandler } from "@/utils";

type PageProps = {
  params: Promise<{ slug?: string }>;
};

// CORS Handler
export async function OPTIONS(req: NextRequest) {
  const headers = CorsHandler(req);
  return new NextResponse(null, { status: 204, headers }); // 204 No Content is more appropriate for OPTIONS
}

export async function GET(request: NextRequest, { params }: PageProps) {
  try {
    // Validate the slug parameter
    if (!params) {
      return NextResponse.json(
        { error: "Category slug is required" },
        { status: 400 }
      );
    }

    // Fetch the category from the database
    const heroSection = await prismadb.heroSection.findUnique({
      where: {
        slug: (await params).slug,
      },
      select: {
        id: true,
        slug: true,
        titleAr: true,
        titleEn: true,
       
        imageUrl: true,
        bgUrl: true,
      },
    });

    if (!heroSection) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Handle CORS and return the successful response
    const headers = CorsHandler(request);
    return NextResponse.json(heroSection, {
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

export async function PATCH(req: NextRequest, { params }: PageProps) {
  const currentUser = await getCurrentUser();

  // Authentication check
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = (await req.json()) as IHeroDto;

    // Validate input data using the schema
    const validation = heroSectionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    const slug = body.nameEn
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const heroSection = await prismadb.heroSection.update({
      where: {
        slug: (await params).slug,
      },
      data: {
        ...body,
        slug,
      },
      select: {
        id: true,
        slug: true,
        
        titleAr: true,
        titleEn: true,
        imageUrl: true,
        bgUrl: true,
      },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(heroSection, { headers });
  } catch (error) {
    console.error("[PRODUCTS_PATCH_ERROR]:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

/**
 * Handle DELETE Request to remove product
 */

export async function DELETE(req: NextRequest, { params }: PageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    // Attempt to delete the product (no user restriction)
    const heroSection = await prismadb.heroSection.delete({
      where: { slug: (await params).slug },
    });
    const headers = CorsHandler(req);
    return NextResponse.json(heroSection, { status: 200, headers });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    axiosErrorHandler(error);
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
