type IOption = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder?: 1 | -1 | 'asc' | 'desc';
};

const calculatePagination = (options: IOption): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || 'createdAt';
  //   const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
  const sortOrder: 1 | -1 | 'asc' | 'desc' =
    options.sortOrder === 'asc' ? 1 : options.sortOrder === 'desc' ? -1 : -1;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelper = { calculatePagination };
