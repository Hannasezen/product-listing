export const PRODUCT_LIST_API_PATH = '/api/products';

export function productDetailApiPath(slug: string) {
  return `/api/products/slug/${slug}`;
}

export function productDetailPagePath(slug: string) {
  return `/products/${slug}`;
}
