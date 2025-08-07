import Link from 'next/link';
import { AuthButton } from '@/components/auth/AuthButton';

export default function Home() {
  return (
    <div className='min-h-screen relative overflow-hidden'>
      {/* 🎨 Dynamic Background with Flowing Gradients */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'>
        {/* Animated flowing shapes */}
        <div className='absolute top-0 left-0 w-full h-full'>
          <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-violet-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
          <div className='absolute bottom-1/4 left-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/25 to-rose-500/25 rounded-full blur-3xl animate-pulse delay-2000'></div>
        </div>

        {/* Subtle grid pattern */}
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]'></div>
      </div>

      {/* 🎯 Floating Navigation */}
      <nav className='relative z-50 container mx-auto px-6 py-6'>
        <div className='flex items-center justify-between backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl px-6 py-4 shadow-2xl'>
          <div className='flex items-center space-x-3'>
            {/* 🌟 Unique Brand Icon */}
            <div className='relative'>
              <div className='w-10 h-10 bg-gradient-to-br from-violet-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'>
                <div className='w-6 h-6 relative'>
                  {/* Abstract thought bubble icon */}
                  <div className='absolute inset-0 bg-white rounded-full opacity-90'></div>
                  <div className='absolute top-1 left-1 w-2 h-2 bg-violet-600 rounded-full'></div>
                  <div className='absolute top-2 right-1 w-1.5 h-1.5 bg-purple-600 rounded-full'></div>
                  <div className='absolute bottom-1 left-2 w-1 h-1 bg-violet-600 rounded-full'></div>
                </div>
              </div>
              <div className='absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-ping'></div>
            </div>
            <div>
              <span className='text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                Insight Journal
              </span>
              <div className='text-xs text-violet-300 font-medium'>思维的流动</div>
            </div>
          </div>

          <div className='hidden md:flex items-center space-x-8'>
            <Link
              href='#features'
              className='text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium'
            >
              探索功能
            </Link>
            <Link
              href='#about'
              className='text-gray-300 hover:text-white transition-all duration-300 hover:scale-105 font-medium'
            >
              关于我们
            </Link>
            <div className='transform hover:scale-105 transition-all duration-300'>
              <AuthButton />
            </div>
          </div>
        </div>
      </nav>

      {/* 🚀 Revolutionary Hero Section */}
      <main className='relative z-40 container mx-auto px-6 py-20'>
        <div className='grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]'>

          {/* Left: Content with Asymmetric Layout */}
          <div className='space-y-8'>
            {/* 🎯 Attention-grabbing tagline */}
            <div className='inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/20 to-purple-500/20 backdrop-blur-sm border border-violet-500/30 rounded-full px-4 py-2'>
              <div className='w-2 h-2 bg-violet-400 rounded-full animate-pulse'></div>
              <span className='text-violet-300 text-sm font-medium'>AI驱动的内心探索</span>
            </div>

            {/* 🌟 Dynamic Typography */}
            <div className='space-y-4'>
              <h1 className='text-6xl lg:text-7xl font-black leading-tight'>
                <span className='bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent'>
                  不只是
                </span>
                <br />
                <span className='bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse'>
                  日记
                </span>
                <br />
                <span className='text-white relative'>
                  是洞察
                  <div className='absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full'></div>
                </span>
              </h1>
            </div>

            {/* 🎨 Poetic Description */}
            <div className='space-y-4 max-w-lg'>
              <p className='text-xl text-gray-300 leading-relaxed'>
                每一个想法都是一颗种子，
                <br />
                <span className='text-violet-300'>AI帮你发现它们的</span>
                <span className='bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent font-semibold'>深层含义</span>
              </p>
              <p className='text-gray-400'>
                不再是简单的记录，而是思维的可视化、情感的解析、成长的见证
              </p>
            </div>

            {/* 🎯 Unique CTA Design */}
            <div className='flex flex-col sm:flex-row gap-4 pt-4'>
              <Link
                href='/journal'
                className='group relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-violet-500/25 transition-all duration-300 hover:scale-105'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                <div className='relative flex items-center space-x-2'>
                  <span>开始探索内心</span>
                  <div className='w-5 h-5 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300'>
                    <span className='text-sm'>✨</span>
                  </div>
                </div>
              </Link>

              <Link
                href='#features'
                className='group border-2 border-white/20 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/5 hover:border-white/40 transition-all duration-300 backdrop-blur-sm'
              >
                <div className='flex items-center space-x-2'>
                  <span>了解更多</span>
                  <div className='w-5 h-5 border border-white/40 rounded-full flex items-center justify-center group-hover:border-white/60 transition-colors duration-300'>
                    <span className='text-xs'>→</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right: Interactive Visual Element */}
          <div className='relative'>
            {/* 🎨 Floating Thought Bubbles */}
            <div className='relative w-full h-96 lg:h-[500px]'>
              {/* Central mind visualization */}
              <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                <div className='w-32 h-32 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full shadow-2xl shadow-violet-500/50 animate-pulse'>
                  <div className='w-full h-full rounded-full border-4 border-white/20 flex items-center justify-center'>
                    <span className='text-4xl'>🧠</span>
                  </div>
                </div>
              </div>

              {/* Floating insight cards */}
              <div className='absolute top-8 left-8 transform rotate-12 hover:rotate-6 transition-transform duration-500'>
                <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl'>
                  <div className='text-violet-300 text-sm font-medium'>情感分析</div>
                  <div className='text-white text-xs mt-1'>今天的心情：平静而充满希望</div>
                </div>
              </div>

              <div className='absolute top-16 right-12 transform -rotate-6 hover:rotate-0 transition-transform duration-500 delay-200'>
                <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl'>
                  <div className='text-pink-300 text-sm font-medium'>深度洞察</div>
                  <div className='text-white text-xs mt-1'>发现了新的思维模式</div>
                </div>
              </div>

              <div className='absolute bottom-16 left-16 transform rotate-6 hover:rotate-12 transition-transform duration-500 delay-400'>
                <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl'>
                  <div className='text-cyan-300 text-sm font-medium'>成长轨迹</div>
                  <div className='text-white text-xs mt-1'>连续记录 15 天</div>
                </div>
              </div>

              <div className='absolute bottom-8 right-8 transform -rotate-12 hover:-rotate-6 transition-transform duration-500 delay-600'>
                <div className='bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl'>
                  <div className='text-rose-300 text-sm font-medium'>AI建议</div>
                  <div className='text-white text-xs mt-1'>尝试冥想来缓解压力</div>
                </div>
              </div>

              {/* Connecting lines */}
              <svg className='absolute inset-0 w-full h-full pointer-events-none'>
                <defs>
                  <linearGradient id='lineGradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='rgba(139, 92, 246, 0.3)' />
                    <stop offset='100%' stopColor='rgba(168, 85, 247, 0.1)' />
                  </linearGradient>
                </defs>
                <path
                  d='M 160 250 Q 120 180 80 120'
                  stroke='url(#lineGradient)'
                  strokeWidth='2'
                  fill='none'
                  className='animate-pulse'
                />
                <path
                  d='M 160 250 Q 280 200 320 160'
                  stroke='url(#lineGradient)'
                  strokeWidth='2'
                  fill='none'
                  className='animate-pulse delay-1000'
                />
                <path
                  d='M 160 250 Q 140 320 120 380'
                  stroke='url(#lineGradient)'
                  strokeWidth='2'
                  fill='none'
                  className='animate-pulse delay-2000'
                />
                <path
                  d='M 160 250 Q 240 320 280 380'
                  stroke='url(#lineGradient)'
                  strokeWidth='2'
                  fill='none'
                  className='animate-pulse delay-3000'
                />
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* 🎨 Revolutionary Features Section */}
      <section id='features' className='relative py-32 bg-gradient-to-b from-slate-900 to-black overflow-hidden'>
        {/* Background Elements */}
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-violet-500/20 to-transparent'></div>
          <div className='absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent'></div>
        </div>

        <div className='relative z-10 container mx-auto px-6'>
          {/* 🌟 Section Header with Unique Typography */}
          <div className='text-center mb-20'>
            <div className='inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-500/20 rounded-full px-6 py-2 mb-8'>
              <div className='w-2 h-2 bg-violet-400 rounded-full animate-pulse'></div>
              <span className='text-violet-300 text-sm font-medium'>核心能力</span>
            </div>

            <h2 className='text-5xl lg:text-6xl font-black mb-6'>
              <span className='bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>
                重新定义
              </span>
              <br />
              <span className='bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
                日记体验
              </span>
            </h2>
            <p className='text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed'>
              不只是记录生活，更是解读内心、发现模式、促进成长的智能伙伴
            </p>
          </div>

          {/* 🎯 Asymmetric Feature Grid */}
          <div className='grid lg:grid-cols-12 gap-8 mb-16'>

            {/* Feature 1: Large Card */}
            <div className='lg:col-span-7 group'>
              <div className='relative h-full bg-gradient-to-br from-violet-900/40 to-purple-900/40 backdrop-blur-sm border border-violet-500/30 rounded-3xl p-8 hover:border-violet-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/20'>
                <div className='absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500'>
                  <span className='text-2xl'>🧠</span>
                </div>

                <div className='space-y-4'>
                  <div className='inline-flex items-center space-x-2 bg-violet-500/20 rounded-full px-3 py-1'>
                    <div className='w-1.5 h-1.5 bg-violet-400 rounded-full'></div>
                    <span className='text-violet-300 text-xs font-medium'>AI 深度分析</span>
                  </div>

                  <h3 className='text-2xl font-bold text-white group-hover:text-violet-200 transition-colors duration-300'>
                    情感智能解读
                  </h3>

                  <p className='text-gray-300 leading-relaxed'>
                    不只是识别情绪，更能理解情绪背后的原因、模式和趋势。
                    AI 帮你发现隐藏在文字中的深层含义，让每一次记录都成为自我认知的突破。
                  </p>

                  <div className='flex items-center space-x-4 pt-4'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-xs font-bold'>😊</span>
                      </div>
                      <span className='text-sm text-gray-400'>积极情绪</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-xs font-bold'>💙</span>
                      </div>
                      <span className='text-sm text-gray-400'>深度思考</span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center'>
                        <span className='text-white text-xs font-bold'>🎭</span>
                      </div>
                      <span className='text-sm text-gray-400'>复合情感</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Tall Card */}
            <div className='lg:col-span-5 group'>
              <div className='relative h-full bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm border border-purple-500/30 rounded-3xl p-8 hover:border-purple-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20'>
                <div className='absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500'>
                  <span className='text-2xl'>✨</span>
                </div>

                <div className='space-y-4'>
                  <div className='inline-flex items-center space-x-2 bg-purple-500/20 rounded-full px-3 py-1'>
                    <div className='w-1.5 h-1.5 bg-purple-400 rounded-full'></div>
                    <span className='text-purple-300 text-xs font-medium'>智能助手</span>
                  </div>

                  <h3 className='text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300'>
                    写作灵感引擎
                  </h3>

                  <p className='text-gray-300 leading-relaxed'>
                    告别空白页的焦虑。AI 根据你的心情、经历和写作习惯，
                    提供个性化的写作提示和深度问题，激发你的思考和表达。
                  </p>

                  <div className='space-y-3 pt-4'>
                    <div className='bg-white/5 rounded-lg p-3 border-l-2 border-purple-400'>
                      <div className='text-purple-300 text-xs font-medium mb-1'>今日提示</div>
                      <div className='text-white text-sm'>"什么让你今天感到特别有成就感？"</div>
                    </div>
                    <div className='bg-white/5 rounded-lg p-3 border-l-2 border-pink-400'>
                      <div className='text-pink-300 text-xs font-medium mb-1'>深度探索</div>
                      <div className='text-white text-sm'>"这个挑战教会了你什么？"</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row Features */}
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>

            {/* Feature 3 */}
            <div className='group'>
              <div className='relative bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-sm border border-cyan-500/30 rounded-3xl p-6 hover:border-cyan-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/20'>
                <div className='absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500'>
                  <span className='text-xl'>📊</span>
                </div>

                <div className='space-y-3'>
                  <div className='inline-flex items-center space-x-2 bg-cyan-500/20 rounded-full px-3 py-1'>
                    <div className='w-1.5 h-1.5 bg-cyan-400 rounded-full'></div>
                    <span className='text-cyan-300 text-xs font-medium'>数据洞察</span>
                  </div>

                  <h3 className='text-xl font-bold text-white group-hover:text-cyan-200 transition-colors duration-300'>
                    成长轨迹可视化
                  </h3>

                  <p className='text-gray-300 text-sm leading-relaxed'>
                    将你的情感变化、思维模式、成长历程转化为直观的图表和趋势分析，
                    让自我认知变得清晰可见。
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className='group'>
              <div className='relative bg-gradient-to-br from-rose-900/40 to-pink-900/40 backdrop-blur-sm border border-rose-500/30 rounded-3xl p-6 hover:border-rose-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/20'>
                <div className='absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500'>
                  <span className='text-xl'>🔒</span>
                </div>

                <div className='space-y-3'>
                  <div className='inline-flex items-center space-x-2 bg-rose-500/20 rounded-full px-3 py-1'>
                    <div className='w-1.5 h-1.5 bg-rose-400 rounded-full'></div>
                    <span className='text-rose-300 text-xs font-medium'>隐私保护</span>
                  </div>

                  <h3 className='text-xl font-bold text-white group-hover:text-rose-200 transition-colors duration-300'>
                    绝对私密安全
                  </h3>

                  <p className='text-gray-300 text-sm leading-relaxed'>
                    端到端加密，云端同步，离线优先。你的内心世界只属于你，
                    我们只是提供工具，从不窥探内容。
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className='group md:col-span-2 lg:col-span-1'>
              <div className='relative bg-gradient-to-br from-amber-900/40 to-orange-900/40 backdrop-blur-sm border border-amber-500/30 rounded-3xl p-6 hover:border-amber-400/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/20'>
                <div className='absolute top-4 right-4 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500'>
                  <span className='text-xl'>🌱</span>
                </div>

                <div className='space-y-3'>
                  <div className='inline-flex items-center space-x-2 bg-amber-500/20 rounded-full px-3 py-1'>
                    <div className='w-1.5 h-1.5 bg-amber-400 rounded-full'></div>
                    <span className='text-amber-300 text-xs font-medium'>个人成长</span>
                  </div>

                  <h3 className='text-xl font-bold text-white group-hover:text-amber-200 transition-colors duration-300'>
                    智能成长建议
                  </h3>

                  <p className='text-gray-300 text-sm leading-relaxed'>
                    基于你的记录模式和情感变化，AI 提供个性化的成长建议和行动方案，
                    让每一天都成为更好的自己。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 🌟 About Section - Storytelling Approach */}
      <section id='about' className='relative py-32 bg-black overflow-hidden'>
        {/* Animated Background */}
        <div className='absolute inset-0'>
          <div className='absolute top-1/4 left-1/6 w-64 h-64 bg-gradient-to-r from-violet-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-pink-600/10 to-rose-600/10 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        <div className='relative z-10 container mx-auto px-6'>
          <div className='max-w-4xl mx-auto'>

            {/* Story-driven Header */}
            <div className='text-center mb-16'>
              <div className='inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10 backdrop-blur-sm border border-violet-500/20 rounded-full px-6 py-2 mb-8'>
                <div className='w-2 h-2 bg-violet-400 rounded-full animate-pulse'></div>
                <span className='text-violet-300 text-sm font-medium'>我们的故事</span>
              </div>

              <h2 className='text-4xl lg:text-5xl font-black mb-8'>
                <span className='bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent'>
                  每个人都有
                </span>
                <br />
                <span className='bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent'>
                  值得被理解的内心世界
                </span>
              </h2>
            </div>

            {/* Philosophy Cards */}
            <div className='grid md:grid-cols-2 gap-8 mb-16'>
              <div className='group'>
                <div className='bg-gradient-to-br from-violet-900/30 to-purple-900/30 backdrop-blur-sm border border-violet-500/20 rounded-3xl p-8 hover:border-violet-400/40 transition-all duration-500 hover:scale-[1.02]'>
                  <div className='w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500'>
                    <span className='text-2xl'>🔒</span>
                  </div>
                  <h3 className='text-2xl font-bold text-white mb-4'>隐私至上的设计哲学</h3>
                  <p className='text-gray-300 leading-relaxed'>
                    我们相信，内心的声音应该只属于你自己。端到端加密、本地优先存储、
                    零数据收集——技术应该保护而不是侵犯你的隐私。
                  </p>
                </div>
              </div>

              <div className='group'>
                <div className='bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 hover:border-purple-400/40 transition-all duration-500 hover:scale-[1.02]'>
                  <div className='w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-500'>
                    <span className='text-2xl'>🎯</span>
                  </div>
                  <h3 className='text-2xl font-bold text-white mb-4'>AI 作为理解的桥梁</h3>
                  <p className='text-gray-300 leading-relaxed'>
                    AI 不是要替代你的思考，而是帮你更好地理解自己。
                    通过模式识别和深度分析，发现那些隐藏在日常中的成长轨迹。
                  </p>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className='text-center'>
              <div className='bg-gradient-to-r from-violet-900/20 to-purple-900/20 backdrop-blur-sm border border-violet-500/20 rounded-3xl p-12'>
                <div className='max-w-3xl mx-auto'>
                  <div className='text-6xl mb-6'>💫</div>
                  <h3 className='text-3xl font-bold text-white mb-6'>
                    让每一次记录都成为自我发现的旅程
                  </h3>
                  <p className='text-xl text-gray-300 leading-relaxed'>
                    在这个快节奏的世界里，我们为你创造一个安静的角落，
                    让思考沉淀，让情感流淌，让成长可见。
                    <br />
                    <span className='text-violet-300 font-medium'>
                      这不只是一个日记应用，这是你与内心对话的智能伙伴。
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎨 Revolutionary Footer */}
      <footer className='relative bg-gradient-to-t from-black to-slate-900 py-16 overflow-hidden'>
        {/* Background Elements */}
        <div className='absolute inset-0'>
          <div className='absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent'></div>
        </div>

        <div className='relative z-10 container mx-auto px-6'>
          <div className='flex flex-col items-center space-y-8'>

            {/* Brand Section */}
            <div className='text-center'>
              <div className='flex items-center justify-center space-x-4 mb-4'>
                <div className='relative'>
                  <div className='w-12 h-12 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg'>
                    <div className='w-8 h-8 relative'>
                      <div className='absolute inset-0 bg-white rounded-full opacity-90'></div>
                      <div className='absolute top-1 left-1 w-2 h-2 bg-violet-600 rounded-full'></div>
                      <div className='absolute top-2 right-1 w-1.5 h-1.5 bg-purple-600 rounded-full'></div>
                      <div className='absolute bottom-1 left-2 w-1 h-1 bg-violet-600 rounded-full'></div>
                    </div>
                  </div>
                  <div className='absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-ping'></div>
                </div>
                <div>
                  <div className='text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                    Insight Journal
                  </div>
                  <div className='text-sm text-violet-300 font-medium'>思维的流动</div>
                </div>
              </div>

              <p className='text-gray-400 max-w-md mx-auto leading-relaxed'>
                用 AI 重新定义日记体验，让每一次记录都成为自我发现的旅程
              </p>
            </div>

            {/* Links */}
            <div className='flex items-center space-x-8'>
              <Link
                href='#features'
                className='text-gray-400 hover:text-violet-300 transition-colors duration-300 text-sm font-medium'
              >
                探索功能
              </Link>
              <Link
                href='#about'
                className='text-gray-400 hover:text-purple-300 transition-colors duration-300 text-sm font-medium'
              >
                关于我们
              </Link>
              <Link
                href='/journal'
                className='text-gray-400 hover:text-pink-300 transition-colors duration-300 text-sm font-medium'
              >
                开始使用
              </Link>
            </div>

            {/* Copyright */}
            <div className='text-center pt-8 border-t border-gray-800'>
              <p className='text-gray-500 text-sm'>
                © 2025 Insight Journal. 用心构建，用 AI 赋能，用隐私保护。
              </p>
              <p className='text-gray-600 text-xs mt-2'>
                Built with Next.js, Supabase & Claude AI
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
