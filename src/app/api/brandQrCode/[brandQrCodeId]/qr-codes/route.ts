import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prismaDB/prismadb";
import { CorsHandler } from '@/lib/CorsHandler/CorsHndler';
import { axiosErrorHandler } from '@/utils';

export const dynamic = 'force-dynamic';


// ✅ Handle preflight requests
export async function OPTIONS(req: NextRequest) {
  const headers = CorsHandler(req);
  return new NextResponse(null, { status: 204, headers });
}


type PageProps = {
  params: Promise<{ brandQrCodeId: string}>;
};

// POST create new QR code
export async function POST(req: NextRequest, { params }: PageProps) {
    const headers = CorsHandler(req);

  try {
    const body = await req.json();
    const { title, type, content, color, logoUrl } = body;

    // ✅ Validate course
    const brandQrCode = await prisma.brandQrCode.findUnique({
      where: { id: (await params).brandQrCodeId },
    });

    if (!brandQrCode) {
      return new NextResponse("Course not found", { status: 404, headers });
    }

    const qrCode = await prisma.qRCode.create({
      data: {
        title,
        type,
        content,
        color: color || '#000000',
        brandQrCodeId: (await params).brandQrCodeId,
        logoUrl,
      },
    });

    return NextResponse.json(qrCode, { status: 201 });
  } catch (error) {
    console.error('Error creating QR code:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to create QR code', details: errorMessage },
      { status: 500 }
    );
  }
}




// GET all QR codes for a specific brand
export async function GET(req: NextRequest, { params }: PageProps) {
    const headers = CorsHandler(req);

  try {
    const brandQrCodeId = (await params).brandQrCodeId;
    
    // Validate brandQrCode exists
    const brandQrCode = await prisma.brandQrCode.findUnique({
      where: { id: brandQrCodeId },
    });

    if (!brandQrCode) {
      return new NextResponse("Brand QR Code not found", { status: 404, headers });
    }

    const qrCodes = await prisma.qRCode.findMany({
      where: {
        brandQrCodeId: brandQrCodeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

   return new NextResponse(JSON.stringify(qrCodes), {
      status: 200,
      headers,
    });
  } catch (error) {
    axiosErrorHandler(error);
  }
}