const roleJoin = {
  $lookup: {
    from: 'roles',
    localField: 'roleId',
    foreignField: '_id',
    as: 'role',
  },
};

const studentProfileJoin = {
  $lookup: {
    from: 'students',
    localField: 'userId',
    foreignField: '_id',
    as: 'profile',
  },
};

const permissionJoin = {
  $lookup: {
    from: 'permissions',
    localField: 'role.permissions',
    foreignField: '_id',
    as: 'permissions',
  },
};

const projection = { $project: {} };

export const authDBQueries = {
  roleJoin,
  permissionJoin,
  studentProfileJoin,
  projection,
};
