type PkgRecipesColumntype = {
  id: number;
  titleAr: string;
  titleEn: string;

  imageUrl?: string;
  productItem?: {
    nameEn: string;
    nameAr: string;
    price: number;
    imageUrl: string;
  }[]; // Optional

  createdAt: string;
};

export default PkgRecipesColumntype;
