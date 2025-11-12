type UserPkgColumnType = {
    id: string;
    titleAr: string;
    titleEn: string;
    subtitleEn?: string;
    subtitleAr?: string;
    category: string;
    color: string;
    size: string;
    imageUrl?: string;
    pkgItem?: { nameEn: string; nameAr: string; imageUrl: string }[]; // Optional
    isFeatured?: boolean;
    isArchived?: boolean;
    createdAt: string;
  };
  
  export default UserPkgColumnType;
  