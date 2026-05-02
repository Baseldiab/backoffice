import { create } from 'zustand';
import { CUSTOM_ROLES, type CustomRole } from './mock/roles';

type RolesStore = {
  baseRolePermissions: Record<string, string[]>;
  customRoles: CustomRole[];
  updateBaseRolePermissions: (roleId: string, permissions: string[]) => void;
  addCustomRole: (role: CustomRole) => void;
  updateCustomRole: (id: string, patch: Partial<Omit<CustomRole, 'id' | 'isBase'>>) => void;
  deleteCustomRole: (id: string) => void;
};

export const useRolesStore = create<RolesStore>((set) => ({
  baseRolePermissions: {},
  customRoles: CUSTOM_ROLES,

  updateBaseRolePermissions: (roleId, permissions) =>
    set((state) => ({
      baseRolePermissions: { ...state.baseRolePermissions, [roleId]: permissions },
    })),

  addCustomRole: (role) => set((state) => ({ customRoles: [...state.customRoles, role] })),

  updateCustomRole: (id, patch) =>
    set((state) => ({
      customRoles: state.customRoles.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    })),

  deleteCustomRole: (id) =>
    set((state) => ({ customRoles: state.customRoles.filter((r) => r.id !== id) })),
}));
