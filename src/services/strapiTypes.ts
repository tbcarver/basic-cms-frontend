export interface StrapiPage {
  id: number;
  attributes: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: StrapiPagination;
  };
}
