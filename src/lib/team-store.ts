import { create } from 'zustand';
import {
  MOCK_TEAM,
  type TeamMember,
  type TeamRole,
  type TeamStatus,
  type InviteEntry,
} from '@/lib/mock/team';

interface TeamState {
  members: TeamMember[];
  addMembers: (entries: InviteEntry[]) => void;
  updateMemberRole: (id: string, role: TeamRole) => void;
  updateMemberStatus: (id: string, status: TeamStatus) => void;
  removeMember: (id: string) => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  members: MOCK_TEAM,

  addMembers: (entries) =>
    set((state) => {
      const now = new Date().toISOString();
      const today = now.split('T')[0];
      const newMembers: TeamMember[] = entries.map((e, i) => ({
        id: `tm_inv_${Date.now()}_${i}`,
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        phone: e.phone,
        role: e.role,
        status: 'Pending' as TeamStatus,
        jobTitle: e.jobTitle || e.role,
        invitedAt: today,
        joinedAt: null,
        lastLogin: null,
        invitedBy: 'Layla Al-Hassan',
        auditTrail: [{ action: 'Invitation sent by Layla Al-Hassan', at: now }],
      }));
      return { members: [...newMembers, ...state.members] };
    }),

  updateMemberRole: (id, role) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.id === id
          ? {
              ...m,
              role,
              auditTrail: [
                ...m.auditTrail,
                { action: `Role changed to ${role}`, at: new Date().toISOString() },
              ],
            }
          : m,
      ),
    })),

  updateMemberStatus: (id, status) =>
    set((state) => ({
      members: state.members.map((m) =>
        m.id === id
          ? {
              ...m,
              status,
              auditTrail: [
                ...m.auditTrail,
                {
                  action:
                    status === 'Suspended'
                      ? 'Account suspended'
                      : status === 'Active'
                        ? 'Account reactivated'
                        : `Status changed to ${status}`,
                  at: new Date().toISOString(),
                },
              ],
            }
          : m,
      ),
    })),

  removeMember: (id) =>
    set((state) => ({
      members: state.members.filter((m) => m.id !== id),
    })),
}));
