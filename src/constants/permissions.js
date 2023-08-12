export const ALL_ROLES = [
  {
    id: 1,
    value: "ADMIN",
    label: "Admin",
  },
  {
    id: 2,
    value: "MANAGER",
    label: "Manager",
  },
  {
    id: 3,
    value: "EMPLOYEE",
    label: "Employee",
  },
  {
    id: 4,
    value: "USER",
    label: "User",
  },
];

export const ADMIN_ROLE = ALL_ROLES[0].value;
export const MANAGER_ROLE = ALL_ROLES[1].value;
export const EMPLOYEE_ROLE = ALL_ROLES[2].value;
export const USER_ROLE = ALL_ROLES[3].value;

export const ALLOWED_ADMIN_MANAGER_EMPLOYEE = [
  ADMIN_ROLE,
  MANAGER_ROLE,
  EMPLOYEE_ROLE,
];

export const ALLOWED_ADMIN_MANAGER = [ADMIN_ROLE, MANAGER_ROLE];

export const TITLE_POSITION_LIST = [
  {
    title: "CEO",
    value: "ADMIN",
    permission: "ADMIN",
  },
  {
    title: "COO",
    value: "MANAGER",
    permission: "MANAGER",
  },
  {
    title: "Mastering Personnel Course Management",
    value: "EMPLOYEE",
    permission: "COURSE",
  },
  {
    title: "Mastering Content Marketing",
    value: "EMPLOYEE",
    permission: "BLOG",
  },
];
