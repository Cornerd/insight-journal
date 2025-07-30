import { render, screen } from '@testing-library/react';
import JournalPage from '@/app/journal/page';

// Mock the MarkdownEditor component
jest.mock('@/features/editor/components/MarkdownEditor', () => ({
  MarkdownEditor: function MockMarkdownEditor() {
    return <div data-testid='markdown-editor'>Mocked Markdown Editor</div>;
  },
}));

describe('JournalPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the journal page', () => {
    render(<JournalPage />);

    expect(screen.getByText("Today's Entry")).toBeInTheDocument();
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
  });

  it('displays the current date', () => {
    render(<JournalPage />);

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    expect(screen.getByText(today)).toBeInTheDocument();
  });

  it('has proper page structure', () => {
    render(<JournalPage />);

    // Check for main container
    const container = screen.getByText("Today's Entry").closest('.max-w-4xl');
    expect(container).toBeInTheDocument();

    // Check for card styling
    const card = screen.getByText("Today's Entry").closest('.bg-white');
    expect(card).toBeInTheDocument();
  });
});
