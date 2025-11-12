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
  return new NextResponse(null, { status: 204, headers });
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
    const body = (await req.json()) as IFAQDto;

    // Validate input data
    const validation = FAQSchema.safeParse(body);
    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ message: validation.error.errors[0].message }),
        { status: 400, headers }
      );
    }

    const slug = generateSlug(body.questionEn) ? generateSlug(body.questionEn) : generateSlug(body.questionAr, true);
    // const slugAr = generateSlug(body.nameAr, true);

    // Create product
    const fAQ = await prismadb.fAQ.create({
      data: {
        ...body,
        slug,
      },
    });

    return new NextResponse(JSON.stringify(fAQ), { status: 201, headers });
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
    const fAQ = await prismadb.fAQ.findMany({ 
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!fAQ.length) {
      return new NextResponse("No products found", { status: 404, headers });
    }

    return new NextResponse(JSON.stringify(fAQ), { status: 200, headers });
  } catch (error) {
    axiosErrorHandler(error)
  }
}

