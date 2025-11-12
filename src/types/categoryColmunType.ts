
type CategoryColumnType = {
  id?: string;
  slug?: string | null;
  nameEn?: string;
  nameAr?: string;
  imageUrl?: string;
  isFeatured?: boolean | null;
  isArchived?: boolean | null;
  createdAt?: string;
};

export default CategoryColumnType;