type HeroColumnType = {
    id?: string;
    slug?: string;
    nameAr?: string;
    nameEn?: string;

    titleAr?: string;
    titleEn?: string;

    subtitleEn?: string;
    subtitleAr?: string;

    descEn?: string;
    descAr?: string;
    imageUrl?: string;
    bgUrl?: string;

    isFeatured?: boolean;
    isArchived?: boolean;
    createdAt: string;
  };
  
  export default HeroColumnType;
  