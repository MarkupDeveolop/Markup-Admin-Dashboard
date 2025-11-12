import getCurrentUser from "@/actions/getCurrentUser";
import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import prismadb from "@/lib/prismaDB/prismadb";
import { ICreateProductDto, productSchema } from "@/validations/products";
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
    const body = (await req.json()) as ICreateProductDto;

    // Validate input data
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ message: validation.error.errors[0].message }),
        { status: 400, headers },
      );
    }

    const slug = body.titleEn
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    // Create product
    const product = await prismadb.product.create({
      data: {
        ...body,
        slug,
        images: {
          createMany: {
            data: body.images.map((image) => ({ url: image.url })),
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(product), { status: 201, headers });
  } catch (error) {
    console.error("[PRODUCTS_POST_ERROR]:", error);
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
    const categoryId = searchParams.get("categoryId") || undefined;
    
    const slug = searchParams.get("slug") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    // Fetch products
    const products = await prismadb.product.findMany({
      where: {
        categoryId,
        
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
        category: {
          slug,
        },

       

      },
      include: {
        images: true,
       
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!products.length) {
      return new NextResponse("No products found", { status: 404, headers });
    }

    return new NextResponse(JSON.stringify(products), { status: 200, headers });
  } catch (error) {
    console.error("[PRODUCTS_GET_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500, headers });
  }
}
