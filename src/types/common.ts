export interface PageResponse<T> {
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  pageData: T[];
}
