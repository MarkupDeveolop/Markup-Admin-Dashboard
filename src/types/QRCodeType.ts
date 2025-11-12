


export type QRCodeType =
  | 'url'
  | 'email'
  | 'phone'
  | 'sms'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'location';

export interface QRCode {
  id: string;
  title: string;
  type: QRCodeType;
  content: string;
  color: string;
  logoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId?: string | null;
}

export interface CreateQRCodeInput {
  title: string;
  type: QRCodeType;
  content: string;
  color?: string;
  logoUrl?: string;
}

export interface UpdateQRCodeInput extends CreateQRCodeInput {
  id: string;
}
