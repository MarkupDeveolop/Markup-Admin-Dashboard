type ProductColumnType = {
  id: string;
  slug?: string;

  nameEn?: string;
  nameAr?: string;

  titleEn?: string;
  titleAr?: string;

  subtitleEn?: string;
  subtitleAr?: string;

  category?: string;
  brand?: string;
  images?: { url: string }[];



  isBestSeller?: boolean;
  isFeatured?: boolean;
  isArchived?: boolean;
  createdAt: string;
};

export default ProductColumnType;



