import getCurrentUser from "@/actions/getCurrentUser";
import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import prismadb from "@/lib/prismaDB/prismadb";
import { BrandQrCodeSchema, ICreateBrandQrcodeDto } from "@/validations/brandQrCode/brandQrcode";

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
    const body = (await req.json()) as ICreateBrandQrcodeDto;
    const validation = BrandQrCodeSchema.safeParse(body);

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
      imageUrl,
    } = validation.data;

   
    const brandQrCode = await prismadb.brandQrCode.create({
      data: {
        nameEn,
        nameAr,
        imageUrl,
      },
    });

    return new NextResponse(JSON.stringify(brandQrCode), { status: 201, headers });
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
    // const { searchParams } = new URL(req.url);
    // const isFeatured = searchParams.get("isFeatured");

    const brandQrCode = await prismadb.brandQrCode.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        qrcodes: true
      },
    });

    if (!brandQrCode.length) {
      return new NextResponse("No products found", { status: 404, headers });
    }

    return new NextResponse(JSON.stringify(brandQrCode), { status: 200, headers });
  } catch (error) {
    console.error("[PRODUCTS_GET_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500, headers });
  }
}
