import getCurrentUser from "@/actions/getCurrentUser";
import { CorsHandler } from "@/lib/CorsHandler/CorsHndler";
import { generateSlug } from "@/lib/HandleSlug/slugfy";
import prismadb from "@/lib/prismaDB/prismadb";
import { axiosErrorHandler } from "@/utils";
import { FAQSchema, IFAQDto } from "@/validations/FAQ/FAQ";
import { NextRequest, NextResponse } from "next/server";

// CORS Handler
export async function OPTIONS(req: NextRequest) {
  const headers = CorsHandler(req);
  return new NextResponse(null, { status: 204, headers }); // 204 No Content is more appropriate for OPTIONS
}

type PageProps = {
  params: Promise<{ fAQId: string; slug?: string }>;
};

export async function GET(req: NextRequest, { params }: PageProps) {
  try {
    if (!(await params).slug) {
      return new NextResponse("Brand ID and slug are required", {
        status: 400,
      });
    }

    const fAQ = await prismadb.fAQ.findUnique({
      where: {
        id: (await params).fAQId,
        slug: (await params).slug,
      },
    });

    if (!fAQ) {
      return new NextResponse("Product not found", { status: 404 });
    }

    const headers = CorsHandler(req);
    return NextResponse.json(history, { status: 200, headers });
  } catch (error) {
    axiosErrorHandler(error);
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
    const body = (await req.json()) as IFAQDto;

    // Validate input data using the schema
    const validation = FAQSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const slug = generateSlug(body.questionEn)
      ? generateSlug(body.questionEn)
      : generateSlug(body.questionAr, true);
    // const slugAr = generateSlug(body.nameAr, true);

    // Update product
    const fAQ = await prismadb.fAQ.update({
      where: {
        id: (await params).fAQId,
        slug: (await params).slug,
      },
      data: {
        ...body,
        slug,
      },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(fAQ, { headers });
  } catch (error) {
    axiosErrorHandler(error);
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
    const fAQ = await prismadb.fAQ.delete({
      where: { id: (await params).fAQId, slug: (await params).slug },
    });

    const headers = CorsHandler(req);
    return NextResponse.json(fAQ, { status: 200, headers });
  } catch (error) {
    axiosErrorHandler(error);
  }
}
