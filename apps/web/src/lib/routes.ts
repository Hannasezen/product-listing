export const PRODUCT_LIST_API_PATH = '/api/products';
export const FAVORITES_API_PATH = '/api/favorites';

export function productDetailApiPath(slug: string) {
  return `/api/products/slug/${slug}`;
}

export function productDetailPagePath(slug: string) {
  return `/products/${slug}`;
}

export function productListByCategoryApiPath(categoryId: string) {
  return `${PRODUCT_LIST_API_PATH}?categoryId=${categoryId}`;
}

export function categoryDetailApiPath(slug: string) {
  return `/api/categories/slug/${slug}`;
}

export function categoryPagePath(slug: string) {
  return `/categories/${slug}`;
}
