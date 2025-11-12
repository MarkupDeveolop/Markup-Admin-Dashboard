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


type PageProps = {
  params: Promise<{ brandQrCodeId: string}>;
};


export async function GET(
  request: NextRequest,
  { params }: PageProps
) {
  try {
    // Validate the slug parameter
    if (!(await params).brandQrCodeId) {
      return NextResponse.json(
        { error: "Category slug is required" },
        { status: 400 }
      );
    }

    // Fetch the category from the database
    const brandQrCode = await prismadb.brandQrCode.findUnique({
      where: {
        id: (await params).brandQrCodeId,
      },
      include: {
        qrcodes: true
      },
     
    });

    if (!brandQrCode) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Handle CORS and return the successful response
    const headers = CorsHandler(request);
    return NextResponse.json(brandQrCode, {
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
    const body = (await req.json()) as ICreateBrandQrcodeDto;

    // Validate input data using the schema
    const validation = BrandQrCodeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const {
      nameEn,
      nameAr,
      
      imageUrl,
      
    } = validation.data;

    

    const brandQrCode = await prismadb.brandQrCode.update({
      where: {
        id: (await params).brandQrCodeId,
      },
      data: {
        nameEn,
        nameAr,
        imageUrl,
      },
     
    });

    const headers = CorsHandler(req);
    return NextResponse.json(brandQrCode, { headers });
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
    const brandQrCode = await prismadb.brandQrCode.delete({
      where: { id: (await params).brandQrCodeId },
      include: {
        qrcodes: true
      },
      
    });

    const headers = CorsHandler(req);
    return NextResponse.json(brandQrCode, { status: 200, headers });
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
