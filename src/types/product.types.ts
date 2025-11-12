export type TProduct = {
    id: number;
    title: string;
    price: number;
    img: string;
    max?: number;
    cat_prefix?: string;
    quantity?: number;
    isLiked?: boolean;
    isAuthenticated?: boolean;
  };