import { CreateQRCodeInput, QRCode, UpdateQRCodeInput } from "@/types/QRCodeType";

export async function createQRCode(brandQrCodeId: string, input: CreateQRCodeInput): Promise<QRCode> {
  const response = await fetch(`/api/brandQrCode/${brandQrCodeId}/qr-codes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to create QR code');
  }

  const data = await response.json();
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

export async function getQRCodes(brandQrCodeId: string): Promise<QRCode[]> {
  const response = await fetch(`/api/brandQrCode/${brandQrCodeId}/qr-codes`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch QR codes');
  }

  const data = await response.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((qr: any) => ({
    ...qr,
    createdAt: new Date(qr.createdAt),
    updatedAt: new Date(qr.updatedAt),
  }));
}

export async function getQRCodeById(brandQrCodeId: string, id: string): Promise<QRCode | null> {
  const response = await fetch(`/api/brandQrCode/${brandQrCodeId}/qr-codes/${id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error('Failed to fetch QR code');
  }

  const data = await response.json();
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

export async function updateQRCode(brandQrCodeId: string, input: UpdateQRCodeInput): Promise<QRCode> {
  const response = await fetch(`/api/brandQrCode/${brandQrCodeId}/qr-codes/${input.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update QR code');
  }

  const data = await response.json();
  return {
    ...data,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
}

export async function deleteQRCode(brandQrCodeId: string, id: string): Promise<void> {
  const response = await fetch(`/api/brandQrCode/${brandQrCodeId}/qr-codes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete QR code');
  }
}
