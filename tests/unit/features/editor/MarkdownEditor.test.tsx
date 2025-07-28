import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MarkdownEditor } from '@/features/editor/components/MarkdownEditor';

// Mock the MDEditor component since it has complex dependencies
jest.mock('@uiw/react-md-editor', () => {
  return function MockMDEditor({ value, onChange, placeholder }: any) {
    return (
      <textarea
        data-testid="markdown-editor"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    );
  };
});

// Mock the useEditorContent hook
jest.mock('@/features/editor/hooks/useEditorContent', () => ({
  useEditorContent: () => ({
    content: '',
    isLoading: false,
    lastSaved: null,
    setContent: jest.fn(),
    saveContent: jest.fn().mockResolvedValue(undefined),
    loadContent: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe('MarkdownEditor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the markdown editor', () => {
    render(<MarkdownEditor />);
    
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
    expect(screen.getByText('💾 Save Entry')).toBeInTheDocument();
  });

  it('displays the default placeholder', () => {
    render(<MarkdownEditor />);
    
    expect(screen.getByPlaceholderText('Start writing your thoughts...')).toBeInTheDocument();
  });

  it('displays custom placeholder when provided', () => {
    const customPlaceholder = 'Write your custom thoughts here...';
    render(<MarkdownEditor placeholder={customPlaceholder} />);
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('shows character count', () => {
    render(<MarkdownEditor />);
    
    expect(screen.getByText('0 characters')).toBeInTheDocument();
  });

  it('displays markdown quick reference', () => {
    render(<MarkdownEditor />);
    
    expect(screen.getByText('Markdown Quick Reference')).toBeInTheDocument();
    expect(screen.getByText(/\*\*Bold\*\*/)).toBeInTheDocument();
    expect(screen.getByText(/\*Italic\*/)).toBeInTheDocument();
    expect(screen.getByText(/# Heading/)).toBeInTheDocument();
  });

  it('shows save button', () => {
    render(<MarkdownEditor />);
    
    const saveButton = screen.getByRole('button', { name: /save entry/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('handles save button click', async () => {
    const mockSaveContent = jest.fn().mockResolvedValue(undefined);
    
    // Re-mock the hook for this specific test
    jest.doMock('@/features/editor/hooks/useEditorContent', () => ({
      useEditorContent: () => ({
        content: 'Test content',
        isLoading: false,
        lastSaved: null,
        setContent: jest.fn(),
        saveContent: mockSaveContent,
        loadContent: jest.fn().mockResolvedValue(undefined),
      }),
    }));

    render(<MarkdownEditor />);
    
    const saveButton = screen.getByRole('button', { name: /save entry/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockSaveContent).toHaveBeenCalledTimes(1);
    });
  });
});
