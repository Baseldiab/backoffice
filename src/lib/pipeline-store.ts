import { create } from 'zustand';
import { deals as initialDeals, PIPELINE_STAGES } from './mock/pipeline';
import type { Deal, DealPriority } from './mock/pipeline';

interface PipelineState {
  deals: Deal[];
  searchQuery: string;
  filterStage: string | null;
  filterPriority: DealPriority | null;
  filterCountry: string | null;
  selectedDeal: Deal | null;
  drawerOpen: boolean;
  addDealModalOpen: boolean;
  lastAutoWonDealId: string | null;

  moveDealToStage: (dealId: string, newStageId: string) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  addNote: (
    dealId: string,
    note: { id: string; text: string; author: string; createdAt: string },
  ) => void;
  addActivity: (dealId: string, activity: Deal['activities'][0]) => void;
  setSelectedDeal: (deal: Deal | null) => void;
  setDrawerOpen: (open: boolean) => void;
  setAddDealModalOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
  setFilterStage: (s: string | null) => void;
  setFilterPriority: (p: DealPriority | null) => void;
  setFilterCountry: (c: string | null) => void;
  addDeal: (deal: Deal) => void;
  markWon: (dealId: string) => void;
  markLost: (dealId: string, reason: string) => void;
  toggleRequirement: (dealId: string, requirementId: string) => void;
  clearAutoWon: () => void;
  getStageProgress: (dealId: string) => {
    completed: number;
    total: number;
    missingRequired: string[];
  };
  getFilteredDeals: () => Deal[];
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  deals: initialDeals,
  searchQuery: '',
  filterStage: null,
  filterPriority: null,
  filterCountry: null,
  selectedDeal: null,
  drawerOpen: false,
  addDealModalOpen: false,
  lastAutoWonDealId: null,

  moveDealToStage: (dealId, newStageId) => {
    const now = new Date().toISOString();
    set((state) => ({
      deals: state.deals.map((d) => {
        if (d.id !== dealId) return d;
        const activity: Deal['activities'][0] = {
          id: `a-${Date.now()}`,
          type: 'stage_change',
          note: `Moved to ${newStageId}.`,
          date: now,
          loggedAt: now,
          loggedBy: 'You',
          canEdit: false,
        };
        return {
          ...d,
          stageId: newStageId,
          updatedAt: now,
          activities: [...d.activities, activity],
        };
      }),
      // Keep selectedDeal in sync
      selectedDeal:
        state.selectedDeal?.id === dealId
          ? { ...state.selectedDeal, stageId: newStageId, updatedAt: now }
          : state.selectedDeal,
    }));
  },

  updateDeal: (dealId, updates) => {
    const now = new Date().toISOString();
    set((state) => ({
      deals: state.deals.map((d) => (d.id === dealId ? { ...d, ...updates, updatedAt: now } : d)),
      selectedDeal:
        state.selectedDeal?.id === dealId
          ? { ...state.selectedDeal, ...updates, updatedAt: now }
          : state.selectedDeal,
    }));
  },

  addNote: (dealId, note) => {
    set((state) => ({
      deals: state.deals.map((d) => (d.id === dealId ? { ...d, notes: [...d.notes, note] } : d)),
      selectedDeal:
        state.selectedDeal?.id === dealId
          ? { ...state.selectedDeal, notes: [...state.selectedDeal.notes, note] }
          : state.selectedDeal,
    }));
  },

  addActivity: (dealId, activity) => {
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === dealId ? { ...d, activities: [...d.activities, activity] } : d,
      ),
      selectedDeal:
        state.selectedDeal?.id === dealId
          ? {
              ...state.selectedDeal,
              activities: [...state.selectedDeal.activities, activity],
            }
          : state.selectedDeal,
    }));
  },

  setSelectedDeal: (deal) => set({ selectedDeal: deal }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setAddDealModalOpen: (open) => set({ addDealModalOpen: open }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterStage: (s) => set({ filterStage: s }),
  setFilterPriority: (p) => set({ filterPriority: p }),
  setFilterCountry: (c) => set({ filterCountry: c }),

  addDeal: (deal) =>
    set((state) => ({
      deals: [deal, ...state.deals],
    })),

  markWon: (dealId) => {
    const now = new Date().toISOString();
    set((state) => ({
      deals: state.deals.map((d) => {
        if (d.id !== dealId) return d;
        const activity: Deal['activities'][0] = {
          id: `a-${Date.now()}`,
          type: 'stage_change',
          note: 'Deal marked as Won. Onboarding initiated.',
          date: now,
          loggedAt: now,
          loggedBy: 'You',
          canEdit: false,
        };
        return {
          ...d,
          closedStatus: 'won' as const,
          wonAt: now,
          updatedAt: now,
          activities: [...d.activities, activity],
        };
      }),
      selectedDeal:
        state.selectedDeal?.id === dealId
          ? {
              ...state.selectedDeal,
              closedStatus: 'won' as const,
              wonAt: now,
              updatedAt: now,
            }
          : state.selectedDeal,
    }));
  },

  markLost: (dealId, reason) => {
    const now = new Date().toISOString();
    set((state) => ({
      deals: state.deals.map((d) => {
        if (d.id !== dealId) return d;
        const activity: Deal['activities'][0] = {
          id: `a-${Date.now()}`,
          type: 'stage_change',
          note: `Deal marked as Lost — ${reason}.`,
          date: now,
          loggedAt: now,
          loggedBy: 'You',
          canEdit: false,
        };
        return {
          ...d,
          closedStatus: 'lost' as const,
          lostReason: reason,
          updatedAt: now,
          activities: [...d.activities, activity],
        };
      }),
      selectedDeal:
        state.selectedDeal?.id === dealId
          ? {
              ...state.selectedDeal,
              closedStatus: 'lost' as const,
              lostReason: reason,
              updatedAt: now,
            }
          : state.selectedDeal,
    }));
  },

  toggleRequirement: (dealId, requirementId) => {
    set((state) => {
      const newDeals = state.deals.map((d) => {
        if (d.id !== dealId) return d;
        const reqs = d.completedRequirements || [];
        const completedRequirements = reqs.includes(requirementId)
          ? reqs.filter((r) => r !== requirementId)
          : [...reqs, requirementId];
        return { ...d, completedRequirements };
      });
      const updatedDeal = newDeals.find((d) => d.id === dealId);

      // Auto-won check: if deal is in the last stage (contract) and all requirements are done
      let autoWonId: string | null = null;
      if (updatedDeal && !updatedDeal.closedStatus) {
        const lastStage = PIPELINE_STAGES[PIPELINE_STAGES.length - 1];
        if (updatedDeal.stageId === lastStage.id) {
          const allDone = lastStage.requirements.every(
            (r) =>
              updatedDeal.completedRequirements.includes(r.id) ||
              (r.field ? !!updatedDeal[r.field as keyof Deal] : false),
          );
          if (allDone) {
            const now = new Date().toISOString();
            const activity: Deal['activities'][0] = {
              id: `a-${Date.now()}`,
              type: 'stage_change',
              note: 'Deal auto-marked as Won — all requirements completed.',
              date: now,
              loggedAt: now,
              loggedBy: 'System',
              canEdit: false,
            };
            const wonDeal = {
              ...updatedDeal,
              closedStatus: 'won' as const,
              wonAt: now,
              updatedAt: now,
              activities: [...updatedDeal.activities, activity],
            };
            const finalDeals = newDeals.map((d) => (d.id === dealId ? wonDeal : d));
            autoWonId = dealId;
            return {
              deals: finalDeals,
              selectedDeal: state.selectedDeal?.id === dealId ? { ...wonDeal } : state.selectedDeal,
              lastAutoWonDealId: autoWonId,
            };
          }
        }
      }

      return {
        deals: newDeals,
        selectedDeal:
          state.selectedDeal?.id === dealId && updatedDeal
            ? { ...updatedDeal }
            : state.selectedDeal,
      };
    });
  },

  clearAutoWon: () => set({ lastAutoWonDealId: null }),

  getStageProgress: (dealId) => {
    const { deals } = get();
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return { completed: 0, total: 0, missingRequired: [] };
    const stage = PIPELINE_STAGES.find((s) => s.id === deal.stageId);
    if (!stage || !stage.requirements) return { completed: 0, total: 0, missingRequired: [] };
    const reqs = deal.completedRequirements || [];
    const completedReqs = stage.requirements.filter(
      (r) => reqs.includes(r.id) || (r.field ? !!deal[r.field as keyof Deal] : false),
    );
    const missingRequired = stage.requirements
      .filter((r) => !completedReqs.some((c) => c.id === r.id))
      .map((r) => r.label);
    return { completed: completedReqs.length, total: stage.requirements.length, missingRequired };
  },

  getFilteredDeals: () => {
    const { deals, searchQuery, filterStage, filterPriority, filterCountry } = get();
    return deals.filter((d) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!d.companyName.toLowerCase().includes(q) && !d.contactName.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filterStage && d.stageId !== filterStage) return false;
      if (filterPriority && d.priority !== filterPriority) return false;
      if (filterCountry && d.country !== filterCountry) return false;
      return true;
    });
  },
}));
