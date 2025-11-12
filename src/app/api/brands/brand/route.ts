import getCurrentUser from "@/actions/getCurrentUser";
import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import { generateSlug } from "@/lib/HandleSlug/slugfy";
import prismadb from "@/lib/prismaDB/prismadb";
import { axiosErrorHandler } from "@/utils";
import { BrandSchema, IBrandDto } from "@/validations/brands/brands";

import { NextRequest, NextResponse } from "next/server";

// ✅ Handle CORS preflight requests
export async function OPTIONS(req: NextRequest) {
  const headers = CorsHandler(req);
  return new NextResponse(null, { status: 204, headers });
}

/**
 * POST - Create a new Export Service
 * @method POST
 * @route ~/api/export-services
 * @access private (requires logged-in user)
 */
export async function POST(req: NextRequest) {
  const headers = CorsHandler(req);

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401, headers });
  }

  try {
    const body = (await req.json()) as IBrandDto;

    // ✅ Validate input data
    const validation = BrandSchema.safeParse(body);
    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ message: validation.error.errors[0].message }),
        { status: 400, headers }
      );
    }

    const slug = generateSlug(body.titleEn)
      ? generateSlug(body.titleEn)
      : generateSlug(body.titleAr, true);

    // ✅ Create the Export Service with nested features
    const brand = await prismadb.brand.create({
      data: {
        slug,
         ...body,
        brandFeature: {
          create: body.brandFeature.map((feature) => ({
            titleEn: feature.titleEn,
            titleAr: feature.titleAr,
            featureEn: feature.featureEn,
            featureAr: feature.featureAr,
            imageUrl: feature.imageUrl,
          })),
        },
      },
      include: {
        brandFeature: true,
      },
    });

    return new NextResponse(JSON.stringify(brand), {
      status: 201,
      headers,
    });
  } catch (error) {
    console.error("[EXPORT_SERVICES_POST_ERROR]:", error);
    return new NextResponse("Internal Server Error", { status: 500, headers });
  }
}

/**
 * GET - Fetch all Export Services
 * @method GET
 * @route ~/api/export-services
 * @access public
 */
export async function GET(req: NextRequest) {
  const headers = CorsHandler(req);

  try {
    const brand = await prismadb.brand.findMany({
      include: {
        brandFeature: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!brand.length) {
      return new NextResponse("No export services found", {
        status: 404,
        headers,
      });
    }

    return new NextResponse(JSON.stringify(brand), {
      status: 200,
      headers,
    });
  } catch (error) {
    return axiosErrorHandler(error);
  }
}
