type shippingCoulumsTyeps = {
    id: number;
    nameAr: string;
    nameEn: string;
  
    imageUrl?: string;
    shippingCountry?: {
      nameEn: string;
      nameAr: string;
      imageUrl?: string;
    }[]; // Optional

    shippingZone?: {
        nameEn: string;
        nameAr: string;
        price?: number;
        imageUrl: string;
      }[]; // Optional
  
    createdAt: string;
  };
  
  export default shippingCoulumsTyeps;
  