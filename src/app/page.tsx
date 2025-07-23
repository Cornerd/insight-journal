import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800'>
      {/* Navigation */}
      <nav className='container mx-auto px-6 py-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-lg'>IJ</span>
            </div>
            <span className='text-xl font-bold text-gray-900 dark:text-white'>
              Insight Journal
            </span>
          </div>
          <div className='hidden md:flex space-x-6'>
            <Link
              href='#features'
              className='text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400'
            >
              Features
            </Link>
            <Link
              href='#about'
              className='text-gray-600 hover:text-emerald-600 dark:text-gray-300 dark:hover:text-emerald-400'
            >
              About
            </Link>
            <Link
              href='/journal'
              className='bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors'
            >
              Start Journaling
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className='container mx-auto px-6 py-16'>
        <div className='text-center max-w-4xl mx-auto'>
          <h1 className='text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6'>
            Your AI-Powered
            <span className='text-emerald-600 block'>Personal Journal</span>
          </h1>
          <p className='text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto'>
            Transform your thoughts into insights with the help of AI. Reflect,
            analyze, and grow through intelligent journaling.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/journal'
              className='bg-emerald-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors'
            >
              Start Your Journey
            </Link>
            <Link
              href='#features'
              className='border border-emerald-600 text-emerald-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors'
            >
              Learn More
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id='features' className='py-20 bg-white dark:bg-gray-800'>
        <div className='container mx-auto px-6'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Intelligent Journaling Features
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
              Discover how AI can enhance your personal reflection and growth
              journey.
            </p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🤖</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                AI-Powered Insights
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Get personalized insights and reflections on your journal
                entries using advanced AI.
              </p>
            </div>

            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>📝</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Smart Writing Assistant
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Overcome writer&apos;s block with AI-generated prompts and writing
                suggestions.
              </p>
            </div>

            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>📊</span>
              </div>
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                Mood & Pattern Analysis
              </h3>
              <p className='text-gray-600 dark:text-gray-300'>
                Track your emotional patterns and personal growth over time with
                AI analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id='about' className='py-20 bg-gray-50 dark:bg-gray-900'>
        <div className='container mx-auto px-6'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-4xl font-bold text-gray-900 dark:text-white mb-6'>
              About Insight Journal
            </h2>
            <p className='text-lg text-gray-600 dark:text-gray-300 mb-8'>
              Insight Journal combines the timeless practice of journaling with
              cutting-edge AI technology. Our platform helps you gain deeper
              self-awareness, track personal growth, and develop meaningful
              insights from your daily reflections.
            </p>
            <div className='grid md:grid-cols-2 gap-8 text-left'>
              <div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                  🔒 Privacy First
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  Your thoughts are private. We use secure encryption and never
                  share your personal data.
                </p>
              </div>
              <div>
                <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
                  🎯 Personalized Experience
                </h3>
                <p className='text-gray-600 dark:text-gray-300'>
                  AI adapts to your writing style and preferences to provide
                  relevant insights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-12'>
        <div className='container mx-auto px-6'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='flex items-center space-x-2 mb-4 md:mb-0'>
              <div className='w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center'>
                <span className='text-white font-bold text-lg'>IJ</span>
              </div>
              <span className='text-xl font-bold'>Insight Journal</span>
            </div>
            <div className='text-gray-400'>
              <p>&copy; 2025 Insight Journal. Built with Next.js and AI.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
