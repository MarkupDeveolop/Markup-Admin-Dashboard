type NewsColumnType = {
  id: string;
  articaleCategoryId?: string;
  slug?: string;

  nameEn?: string;
  nameAr?: string;

  titleEn?: string;
  titleAr?: string;

  subtitleEn?: string;
  subtitleAr?: string;

  articaleImages?: { url: string }[];

  articaleCategory?: string;


  isFeatured?: boolean;
  isArchived?: boolean;
  createdAt: string;
};

export default NewsColumnType;
