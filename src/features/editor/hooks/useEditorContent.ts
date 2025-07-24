import { create } from 'zustand';

interface EditorState {
  content: string;
  isLoading: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  setContent: (content: string) => void;
  saveContent: () => Promise<void>;
  loadContent: () => Promise<void>;
  autoSave: () => Promise<void>;
}

export const useEditorContent = create<EditorState>(set => ({
  content: '',
  isLoading: false,
  lastSaved: null,
  hasUnsavedChanges: false,

  setContent: (content: string) => {
    set({ content, hasUnsavedChanges: true });
  },

  saveContent: async () => {
    set({ isLoading: true });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // In a real app, this would save to a backend
      // For now, we'll just update the lastSaved timestamp
      set({
        lastSaved: new Date(),
        isLoading: false,
        hasUnsavedChanges: false,
      });

      // Show success message (could be handled by a toast system)
      console.log('Content saved successfully!');
    } catch (error) {
      console.error('Failed to save content:', error);
      set({ isLoading: false });
    }
  },

  loadContent: async () => {
    set({ isLoading: true });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // In a real app, this would load from a backend
      // For now, content is just stored in memory
      set({ isLoading: false });
    } catch (error) {
      console.error('Failed to load content:', error);
      set({ isLoading: false });
    }
  },

  autoSave: async () => {
    const state = useEditorContent.getState();
    if (state.hasUnsavedChanges && !state.isLoading) {
      try {
        // Simulate API call delay (shorter for auto-save)
        await new Promise(resolve => setTimeout(resolve, 200));

        set({
          lastSaved: new Date(),
          hasUnsavedChanges: false,
        });

        console.log('Auto-saved successfully!');
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }
  },
}));
