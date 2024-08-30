export class PaginationModel {
    currentPage: number;
    data: any[] = [];
    hasNext: boolean;
    hasPrevious: boolean;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}
