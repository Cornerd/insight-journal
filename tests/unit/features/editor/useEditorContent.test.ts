import { renderHook, act } from '@testing-library/react';
import { useEditorContent } from '@/features/editor/hooks/useEditorContent';

// Mock localStorage for zustand persist
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useEditorContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useEditorContent());

    expect(result.current.content).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.lastSaved).toBe(null);
  });

  it('updates content when setContent is called', () => {
    const { result } = renderHook(() => useEditorContent());

    act(() => {
      result.current.setContent('New content');
    });

    expect(result.current.content).toBe('New content');
  });

  it('handles saveContent correctly', async () => {
    const { result } = renderHook(() => useEditorContent());

    // Mock console.log to verify success message
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await act(async () => {
      await result.current.saveContent();
    });

    expect(result.current.lastSaved).toBeInstanceOf(Date);
    expect(result.current.isLoading).toBe(false);
    expect(consoleSpy).toHaveBeenCalledWith('Content saved successfully!');

    consoleSpy.mockRestore();
  });

  it('sets loading state during saveContent', async () => {
    const { result } = renderHook(() => useEditorContent());

    const savePromise = act(async () => {
      await result.current.saveContent();
    });

    // Check loading state is set immediately
    expect(result.current.isLoading).toBe(true);

    await savePromise;

    // Check loading state is cleared after completion
    expect(result.current.isLoading).toBe(false);
  });

  it('handles loadContent correctly', async () => {
    const { result } = renderHook(() => useEditorContent());

    await act(async () => {
      await result.current.loadContent();
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('sets loading state during loadContent', async () => {
    const { result } = renderHook(() => useEditorContent());

    const loadPromise = act(async () => {
      await result.current.loadContent();
    });

    // Check loading state is set immediately
    expect(result.current.isLoading).toBe(true);

    await loadPromise;

    // Check loading state is cleared after completion
    expect(result.current.isLoading).toBe(false);
  });

  it('handles save errors gracefully', async () => {
    const { result } = renderHook(() => useEditorContent());

    // Mock console.error to verify error handling
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    // Mock setTimeout to throw an error
    const originalSetTimeout = global.setTimeout;
    global.setTimeout = jest.fn().mockImplementation(() => {
      throw new Error('Save failed');
    });

    await act(async () => {
      await result.current.saveContent();
    });

    expect(result.current.isLoading).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to save content:',
      expect.any(Error)
    );

    // Restore mocks
    global.setTimeout = originalSetTimeout;
    consoleErrorSpy.mockRestore();
  });
});
