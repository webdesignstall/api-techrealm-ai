export const strongPasswordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const bdMobileNoRegex = /^\+880\d{10}$/;
export const userFilterableFields = ['searchTerm', 'name', 'email'];

export const userSearchableFields = ['name'];
