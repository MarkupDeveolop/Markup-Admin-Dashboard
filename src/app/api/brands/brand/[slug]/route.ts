import getCurrentUser from "@/actions/getCurrentUser";
import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import { generateSlug } from "@/lib/HandleSlug/slugfy";
import prismadb from "@/lib/prismaDB/prismadb";
import { axiosErrorHandler } from "@/utils";
import { BrandSchema, IBrandDto } from "@/validations/brands/brands";
import { NextRequest, NextResponse } from "next/server";

// ✅ Handle OPTIONS (CORS)
export async function OPTIONS(req: NextRequest) {
  const headers = CorsHandler(req);
  return new NextResponse(null, { status: 204, headers });
}

type PageProps = {
  params: Promise<{ brandId: string; slug?: string }>;
};

/**
 * ✅ GET - Fetch a single export service by ID and slug
 */
export async function GET(req: NextRequest, { params }: PageProps) {
  try {
    const { slug } = await params;
    if ( !slug) {
      return new NextResponse("Export Service ID and slug are required", {
        status: 400,
      });
    }

    const brand = await prismadb.brand.findUnique({
      where: {  slug },
      include: { brandFeature: true },
    });

    if (!brand) {
      return new NextResponse("Export service not found", { status: 404 });
    }

    const headers = CorsHandler(req);
    return NextResponse.json(brand, { status: 200, headers });
  } catch (error) {
    axiosErrorHandler(error);
  }
}

/**
 * ✅ PATCH - Update an export service
 */
export async function PATCH(req: NextRequest, { params }: PageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { brandId, slug } = await params;
    const body = (await req.json()) as IBrandDto;

    // ✅ Validate data
    const validation = BrandSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const newSlug =
      generateSlug(body.titleEn) || generateSlug(body.titleAr, true);

    // ✅ Update main service
    const brand = await prismadb.brand.update({
      where: { id: brandId, slug },
      data: {
       ...body,
        slug: newSlug,
        brandFeature: {
          deleteMany: {}, // removes all previous features
          create: body.brandFeature.map((feature) => ({
            titleEn: feature.titleEn,
            titleAr: feature.titleAr,
            featureEn: feature.featureEn,
            featureAr: feature.featureAr,
            imageUrl: feature.imageUrl,
          })),
        },
      },
      include: { brandFeature: true },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(brand, { status: 200, headers });
  } catch (error) {
    axiosErrorHandler(error);
  }
}

/**
 * ✅ DELETE - Remove an export service
 */
export async function DELETE(req: NextRequest, { params }: PageProps) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { brandId, slug } = await params;

    // ✅ Delete main service (cascade deletes features if set in Prisma)
    const deletedbrand = await prismadb.brand.delete({
      where: { id: brandId, slug },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(deletedbrand, { status: 200, headers });
  } catch (error) {
    axiosErrorHandler(error);
  }
}
