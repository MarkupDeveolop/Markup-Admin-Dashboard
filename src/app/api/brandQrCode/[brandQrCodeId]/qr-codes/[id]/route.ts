import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prismaDB/prismadb";
import { CorsHandler } from '@/lib/CorsHandler/CorsHndler';
export const dynamic = 'force-dynamic';




// ✅ Handle preflight requests
export async function OPTIONS(req: NextRequest) {
  const headers = CorsHandler(req);
  return new NextResponse(null, { status: 204, headers });
}


type PageProps = {
  params: Promise<{ brandQrCodeId: string; id: string}>;
};



// GET single QR code by ID
export async function GET(
  request: NextRequest,
  req: NextRequest, { params }: PageProps
) {
  try {
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: (await params).id },
    });

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('Error fetching QR code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR code' },
      { status: 500 }
    );
  }
}

// PUT update QR code
export async function PUT(
  req: NextRequest,
  { params }: PageProps
) {
    const headers = CorsHandler(req);
  
  try {
    const body = await req.json();
    const { title, type, content, color, logoUrl } = body;


    const brandQrCode = await prisma.brandQrCode.findUnique({
      where: { id: (await params).brandQrCodeId },
    });

    if (!brandQrCode) {
      return new NextResponse("Course not found", { status: 404, headers });
    }


    const qrCode = await prisma.qRCode.update({
      where: { id: (await params).id },
      data: {
        title,
        type,
        content,
        color,
        brandQrCodeId: (await params).brandQrCodeId,
        logoUrl,
      },
    });

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error('Error updating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to update QR code' },
      { status: 500 }
    );
  }
}



// DELETE QR code
export async function DELETE(
  request: NextRequest,
  { params }: PageProps
) {
  const headers = CorsHandler(request);
  
  try {
    await prisma.qRCode.delete({
      where: { id: (await params).id },
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error deleting QR code:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to delete QR code' }),
      { status: 500, headers }
    );
  }
}
