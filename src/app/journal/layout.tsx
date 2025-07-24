import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Journal - Insight Journal',
  description:
    'Write and reflect on your daily thoughts with AI-powered insights.',
  keywords: ['journal', 'writing', 'reflection', 'AI', 'markdown'],
};

interface JournalLayoutProps {
  children: React.ReactNode;
}

export default function JournalLayout({ children }: JournalLayoutProps) {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <div className='container mx-auto px-4 py-8'>
        <header className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                📝 Journal
              </h1>
              <p className='text-gray-600 dark:text-gray-300 mt-2'>
                Capture your thoughts and reflections
              </p>
            </div>
            <nav className='flex items-center space-x-4'>
              <Link
                href='/'
                className='text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors'
              >
                ← Back to Home
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
