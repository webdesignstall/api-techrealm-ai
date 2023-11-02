type PermissionCategory = {
  name: Record<string, string>;
  groupId: number;
  groupName: string;
};

type Permission = {
  name: string;
  groupId: number;
  groupName: string;
};

export const permissions: Record<string, PermissionCategory> = {
  user: {
    name: {
      can_user_create: 'can_user_create',
      can_edit_user: 'can_edit_user',
      can_view_user: 'can_view_user',
      can_delete_user: 'can_delete_user',
    },
    groupId: 1,
    groupName: 'User',
  },
  courseSubject: {
    name: {
      can_create_course_subject: 'can_create_course_subject',
      can_edit_course_subject: 'can_edit_course_subject',
      can_view_course_subject: 'can_view_course_subject',
      can_delete_course_subject: 'can_delete_course_subject',
    },
    groupId: 2,
    groupName: 'Course Subject',
  },
  courseQualification: {
    name: {
      can_create_course_qualification: 'can_create_course_qualification',
      can_edit_course_qualification: 'can_edit_course_qualification',
      can_view_course_qualification: 'can_view_course_qualification',
      can_delete_course_qualification: 'can_delete_course_qualification',
    },
    groupId: 3,
    groupName: 'Course Qualification',
  },
  course: {
    name: {
      can_create_course: 'can_create_course',
      can_edit_course: 'can_edit_course',
      can_view_course: 'can_view_course',
      can_delete_course: 'can_delete_course',
    },
    groupId: 4,
    groupName: 'Course',
  },
  role: {
    name: {
      can_create_role: 'can_create_role',
      can_edit_role: 'can_edit_role',
      can_view_role: 'can_view_role',
      can_view_dropdown_role: 'can_view_dropdown_role',
      can_delete_role: 'can_delete_role',
    },
    groupId: 5,
    groupName: 'Role',
  },
  university: {
    name: {
      can_create_university: 'can_create_university',
      can_edit_university: 'can_edit_university',
      can_view_university: 'can_view_university',
      can_delete_university: 'can_delete_university',
    },
    groupId: 6,
    groupName: 'University',
  },
  general: {
    name: {
      can_update_general: 'can_update_general',
    },
    groupId: 7,
    groupName: 'General',
  },
  contactUs: {
    name: {
      can_reply_contactUs: 'can_reply_contactUs',
      can_edit_contactUs: 'can_edit_contactUs',
      can_view_contactUs: 'can_view_contactUs',
      can_delete_contactUs: 'can_delete_contactUs',
    },
    groupId: 8,
    groupName: 'Contact Us',
  },
};

export const permissionsDocuments: Permission[] = Object.keys(
  permissions
).reduce((acc: Permission[], category: string) => {
  const categoryPermissions = permissions[category];
  return acc.concat(
    Object.keys(categoryPermissions?.name).map((permission: string) => ({
      name: categoryPermissions?.name[permission],
      groupId: categoryPermissions?.groupId,
      groupName: categoryPermissions?.groupName,
    }))
  );
}, []);
