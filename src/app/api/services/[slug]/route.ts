import getCurrentUser from "@/actions/getCurrentUser";
import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import { generateSlug } from "@/lib/HandleSlug/slugfy";
import prismadb from "@/lib/prismaDB/prismadb";
import { axiosErrorHandler } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { IServiceDto, ServiceSchema } from "@/validations/Services/services";

// ✅ Handle OPTIONS (CORS)
export async function OPTIONS(req: NextRequest) {
  const headers = CorsHandler(req);
  return new NextResponse(null, { status: 204, headers });
}

type PageProps = {
  params: Promise<{ serviceId: string; slug?: string }>;
};

/**
 * ✅ GET - Fetch a single export service by ID and slug
 */
export async function GET(req: NextRequest, { params }: PageProps) {
  try {
    const { serviceId, slug } = await params;
    if (!serviceId || !slug) {
      return new NextResponse("Export Service ID and slug are required", {
        status: 400,
      });
    }

    const services = await prismadb.services.findUnique({
      where: { id: serviceId, slug },
      include: { serviceFeature: true },
    });

    if (!services) {
      return new NextResponse("Export service not found", { status: 404 });
    }

    const headers = CorsHandler(req);
    return NextResponse.json(services, { status: 200, headers });
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
    const { serviceId, slug } = await params;
    const body = (await req.json()) as IServiceDto;

    // ✅ Validate data
    const validation = ServiceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const newSlug =
      generateSlug(body.titleEn) || generateSlug(body.titleAr, true);

    // ✅ Update main service
    const updatedService = await prismadb.services.update({
      where: { id: serviceId, slug },
      data: {
        imageUrl: body.imageUrl,
        titleEn: body.titleEn,
        titleAr: body.titleAr,
        nameEn: body.nameEn,
        nameAr: body.nameAr,
        slug: newSlug,

        // ✅ Replace features (delete old and recreate)
        serviceFeature: {
          deleteMany: {}, // removes all previous features
          create: body.serviceFeature.map((feature) => ({
            nameEn: feature.nameEn,
            nameAr: feature.nameAr,
            titleEn: feature.titleEn,
            titleAr: feature.titleAr,
            imageUrl: feature.imageUrl,
          })),
        },
      },
      include: { serviceFeature: true },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(updatedService, { status: 200, headers });
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
    const { serviceId, slug } = await params;

    // ✅ Delete main service (cascade deletes features if set in Prisma)
    const deletedService = await prismadb.services.delete({
      where: { id: serviceId, slug },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(deletedService, { status: 200, headers });
  } catch (error) {
    axiosErrorHandler(error);
  }
}
