import getCurrentUser from "@/actions/getCurrentUser";
import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import prismadb from "@/lib/prismaDB/prismadb";
import { ICreateProductDto, productSchema } from "@/validations/products";
import { NextRequest, NextResponse } from "next/server";



type PageProps = {
  params: Promise<{ productId?: string; slug?: string }>;
};


// CORS Handler
export async function OPTIONS(req: NextRequest) {
  const headers = CorsHandler(req);
  return new NextResponse(null, { status: 204, headers }); // 204 No Content is more appropriate for OPTIONS
}

export async function GET(
  req: NextRequest,
  { params }: PageProps
) {
  try {
    if (!(await params).slug) {
      return new NextResponse("ProductId is required", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: {
        id: (await params).productId,
        slug: (await params).slug,
      },
      include: {
        images: true,
       
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const headers = CorsHandler(req);
    return NextResponse.json(product, { status: 200, headers });
  } catch (error) {
    console.log("[PRODUCT_GET_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
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
    const body = (await req.json()) as ICreateProductDto;

    // Validate input data using the schema
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const slug = body.titleEn
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Update product
    const product = await prismadb.product.update({
      where: {
        id: (await params).productId,
        slug: (await params).slug,
      },
      data: {
        ...body,
        slug,
        images: {
          deleteMany: {},
          createMany: {
            data: body.images.map((image) => ({ url: image.url })),
          },
        },
      },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(product, { headers });
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
    const product = await prismadb.product.delete({
      where: { id: (await params).productId, slug: (await params).slug },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(product, { status: 200, headers });
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
