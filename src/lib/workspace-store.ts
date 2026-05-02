import { create } from 'zustand';

interface WorkspaceState {
  /** The currently selected widget ID — acts as the global workspace filter */
  activeWidgetId: string;
  setActiveWidgetId: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  activeWidgetId: 'widget-1',
  setActiveWidgetId: (id) => set({ activeWidgetId: id }),
}));
