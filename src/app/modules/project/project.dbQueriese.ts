const roleJoining = {
  $lookup: {
    from: 'roles',
    localField: 'roleId',
    foreignField: '_id',
    as: 'role',
    pipeline: [
      {
        $project: {
          id: '$_id',
          name: 1,
        },
      },
    ],
  },
};

const permissionJoining = {
  $lookup: {
    from: 'permissions',
    localField: 'role.permissions',
    foreignField: '_id',
    as: 'permissions',
    pipeline: [
      {
        $project: {
          id: '$_id',
          name: 1,
        },
      },
    ],
  },
};

const projection = {
  $project: {
    email: 1,
    password: 1,
    role: 1,
    verified: 1,
    status: 1,
    permissions: 1,
    id: '$_id',
  },
};

export const UserDBQueries = {
  roleJoining,
  permissionJoining,
  projection,
};
