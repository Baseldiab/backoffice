import { create } from 'zustand';

export type RailTool =
  | 'ai'
  | 'templates'
  | 'text'
  | 'cta'
  | 'interactive'
  | 'media'
  | 'element'
  | 'layers';

export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
}

export const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'iphone-15-pro', name: 'iPhone 15 Pro', width: 393, height: 852 },
  { id: 'iphone-se', name: 'iPhone SE', width: 375, height: 667 },
  { id: 'galaxy-s24', name: 'Galaxy S24', width: 360, height: 780 },
  { id: 'ipad-mini', name: 'iPad Mini', width: 744, height: 1133 },
];

interface StudioState {
  // Rail / panel
  activeTool: RailTool | null;
  setActiveTool: (tool: RailTool | null) => void;
  toggleTool: (tool: RailTool) => void;

  // Device
  deviceId: string;
  setDeviceId: (id: string) => void;

  // Safe area
  showSafeArea: boolean;
  toggleSafeArea: () => void;

  // Zoom
  zoom: number;
  zoomIn: () => void;
  zoomOut: () => void;

  // Timeline
  activeStoryIndex: number;
  setActiveStoryIndex: (index: number) => void;

  // Undo / redo (mock)
  canUndo: boolean;
  canRedo: boolean;

  // Save state
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;
  markDirty: () => void;
  simulateSave: () => void;

  // Selected element
  selectedElement: string | null;
  selectedElementType: 'text' | 'image' | 'cta' | 'options' | null;
  setSelectedElement: (
    id: string | null,
    elementType?: 'text' | 'image' | 'cta' | 'options' | null,
  ) => void;

  // Font
  selectedFont: string;
  setSelectedFont: (font: string) => void;
}

export const useStudioStore = create<StudioState>((set, get) => ({
  activeTool: null,
  setActiveTool: (tool) => set({ activeTool: tool }),
  toggleTool: (tool) => set({ activeTool: get().activeTool === tool ? null : tool }),

  deviceId: 'iphone-15-pro',
  setDeviceId: (id) => set({ deviceId: id }),

  showSafeArea: false,
  toggleSafeArea: () => set((s) => ({ showSafeArea: !s.showSafeArea })),

  zoom: 100,
  zoomIn: () => set((s) => ({ zoom: Math.min(200, s.zoom + 10) })),
  zoomOut: () => set((s) => ({ zoom: Math.max(50, s.zoom - 10) })),

  activeStoryIndex: 0,
  setActiveStoryIndex: (index) => set({ activeStoryIndex: index }),

  canUndo: false,
  canRedo: false,

  isSaving: false,
  hasUnsavedChanges: false,
  lastSavedAt: null,
  markDirty: () => {
    set({ hasUnsavedChanges: true });
    // Auto-save after a short delay
    get().simulateSave();
  },
  simulateSave: () => {
    set({ isSaving: true });
    setTimeout(() => {
      set({ isSaving: false, hasUnsavedChanges: false, lastSavedAt: new Date() });
    }, 1000);
  },

  selectedElement: null,
  selectedElementType: null,
  setSelectedElement: (id, elementType) =>
    set({ selectedElement: id, selectedElementType: id ? (elementType ?? null) : null }),

  selectedFont: 'Inter',
  setSelectedFont: (font) => set({ selectedFont: font }),
}));
