export const RoleType = {
  ADMIN: 'ADMIN',
  PEMBELI: 'PEMBELI',
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];
