# Insight Journal 组件库设计文档

## 🎨 设计系统概览

基于所有用户故事分析，Insight Journal需要一个统一的组件库来支持从基础日记功能到AI增强分析的完整用户体验。

## 🎯 核心设计原则

### 用户体验原则
1. **平静与专注** - 减少干扰，营造思考空间
2. **渐进展示** - 先写作，后分析，避免认知负担  
3. **温和反馈** - 使用柔和的动画和颜色变化
4. **移动优先** - 确保触摸友好，适应小屏幕
5. **情感共鸣** - 通过视觉设计传达温暖和支持

### 技术原则
- **组件化设计** - 可复用、可组合的组件
- **响应式优先** - 移动端到桌面端的无缝体验
- **可访问性** - 符合WCAG 2.1 AA标准
- **性能优化** - 轻量级组件，快速加载

## 🎨 设计Token

### 颜色系统
```css
/* 主色调 - 平静的绿色系 */
--primary-50: #f0fdf4;
--primary-100: #dcfce7;
--primary-500: #10b981;  /* 主色 */
--primary-600: #059669;
--primary-700: #047857;

/* 辅助色 - 温和的蓝色系 */
--secondary-50: #eff6ff;
--secondary-100: #dbeafe;
--secondary-500: #3b82f6;
--secondary-600: #2563eb;

/* 中性色 - 温暖的灰色系 */
--neutral-50: #f9fafb;
--neutral-100: #f3f4f6;
--neutral-200: #e5e7eb;
--neutral-500: #6b7280;
--neutral-700: #374151;
--neutral-900: #111827;

/* 情感色彩 */
--emotion-joy: #fbbf24;      /* 温暖黄色 */
--emotion-calm: #10b981;     /* 平静绿色 */
--emotion-sadness: #3b82f6;  /* 柔和蓝色 */
--emotion-anxiety: #f59e0b;  /* 橙色 */
--emotion-anger: #ef4444;    /* 红色 */
--emotion-love: #ec4899;     /* 粉色 */
```

### 间距系统
```css
/* 基于4px网格 */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
```

### 圆角系统
```css
--radius-sm: 0.25rem;   /* 4px - 小组件 */
--radius-md: 0.5rem;    /* 8px - 卡片 */
--radius-lg: 0.75rem;   /* 12px - 模态框 */
--radius-xl: 1rem;      /* 16px - 大容器 */
--radius-full: 9999px;  /* 圆形 */
```

### 阴影系统
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

### 字体系统
```css
/* 字体大小 */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* 字重 */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* 行高 */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

## 🧩 基础组件

### Button 组件
**用途**: 所有交互操作 (Story 1.1, 1.4, 1.5)

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}
```

**设计规范**:
- 主按钮: 绿色背景，白色文字，用于保存等主要操作
- 次按钮: 白色背景，绿色边框，用于取消等次要操作
- 幽灵按钮: 透明背景，用于编辑、删除等操作
- 危险按钮: 红色背景，用于删除确认

### Card 组件
**用途**: 日记条目展示、AI分析结果 (Story 1.3, 2.2, 2.3, 2.4)

```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined';
  padding: 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: ReactNode;
}
```

**设计规范**:
- 默认卡片: 白色背景，轻微阴影
- 悬浮卡片: 鼠标悬停时增强阴影
- 边框卡片: 用于次要内容

### Input 组件
**用途**: 表单输入、搜索 (Story 1.1)

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'search';
  size: 'sm' | 'md' | 'lg';
  state: 'default' | 'error' | 'success';
  placeholder?: string;
  icon?: ReactNode;
}
```

## 📝 编辑器组件

### MarkdownEditor 组件
**用途**: 主要的日记编写界面 (Story 1.1)

```typescript
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  minHeight?: number;
}
```

**设计规范**:
- 简洁的工具栏，只显示常用格式
- 实时预览功能
- 响应式设计，移动端优化
- 自动保存指示器

### EditorToolbar 组件
**用途**: Markdown编辑工具栏 (Story 1.1)

**设计规范**:
- 图标按钮，简洁明了
- 移动端可折叠
- 快捷键提示

## 📋 列表组件

### JournalList 组件
**用途**: 日记条目列表展示 (Story 1.3)

```typescript
interface JournalListProps {
  entries: JournalEntry[];
  onEntryClick: (id: string) => void;
  loading?: boolean;
  emptyState?: ReactNode;
}
```

### JournalCard 组件
**用途**: 单个日记条目卡片 (Story 1.3)

```typescript
interface JournalCardProps {
  entry: JournalEntry;
  onClick: () => void;
  showPreview?: boolean;
  actions?: ReactNode;
}
```

**设计规范**:
- 显示日期、标题、预览文本
- 悬停效果
- 操作按钮（编辑、删除）
- 情感标签预览

### EmptyState 组件
**用途**: 空状态展示 (Story 1.3)

**设计规范**:
- 友好的插图
- 引导性文案
- 明确的行动号召

## 🤖 AI分析组件

### AIAnalysisCard 组件
**用途**: AI分析结果展示容器 (Story 2.2, 2.3, 2.4)

```typescript
interface AIAnalysisCardProps {
  analysis: AIAnalysis;
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}
```

**设计规范**:
- 分段展示：摘要、情感、建议
- 渐进式加载动画
- 错误状态处理

### EmotionTags 组件
**用途**: 情感标签展示 (Story 2.3)

```typescript
interface EmotionTagsProps {
  emotions: EmotionTag[];
  sentiment: 'positive' | 'neutral' | 'negative';
  size?: 'sm' | 'md' | 'lg';
}
```

**设计规范**:
- 彩色标签，对应不同情感
- 表情符号支持
- 强度可视化（透明度/大小）

### SuggestionsList 组件
**用途**: AI建议展示 (Story 2.4)

```typescript
interface SuggestionsListProps {
  suggestions: Suggestion[];
  onSuggestionClick?: (suggestion: Suggestion) => void;
}
```

**设计规范**:
- 分类展示（健康、正念、生产力等）
- 可操作的建议项
- 优先级指示

## 🔄 反馈组件

### LoadingSpinner 组件
**用途**: 加载状态指示 (Story 2.5)

```typescript
interface LoadingSpinnerProps {
  size: 'sm' | 'md' | 'lg';
  message?: string;
  progress?: number;
}
```

**设计规范**:
- 柔和的旋转动画
- 可选的进度指示
- 上下文相关的加载文案

### ErrorMessage 组件
**用途**: 错误状态展示 (Story 2.5)

```typescript
interface ErrorMessageProps {
  error: string;
  type: 'warning' | 'error' | 'info';
  onRetry?: () => void;
  onDismiss?: () => void;
}
```

**设计规范**:
- 友好的错误信息
- 明确的解决方案
- 重试机制

### SuccessMessage 组件
**用途**: 成功状态反馈 (Story 1.2, 1.4)

**设计规范**:
- 绿色主题
- 简洁的成功图标
- 自动消失机制

## 🎭 模态框组件

### Modal 组件
**用途**: 确认对话框、设置面板 (Story 1.5)

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
}
```

### ConfirmDialog 组件
**用途**: 删除确认等操作 (Story 1.5)

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}
```

## 📱 响应式设计规范

### 断点系统
```css
/* 移动端优先 */
--breakpoint-sm: 640px;   /* 小屏幕 */
--breakpoint-md: 768px;   /* 平板 */
--breakpoint-lg: 1024px;  /* 桌面 */
--breakpoint-xl: 1280px;  /* 大屏幕 */
```

### 布局组件

#### Container 组件
**用途**: 页面内容容器

```typescript
interface ContainerProps {
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  children: ReactNode;
}
```

#### Grid 组件
**用途**: 响应式网格布局

```typescript
interface GridProps {
  cols: number | { sm?: number; md?: number; lg?: number };
  gap: number;
  children: ReactNode;
}
```

## 🎨 动画规范

### 过渡动画
```css
/* 标准过渡 */
--transition-fast: 150ms ease-out;
--transition-normal: 250ms ease-out;
--transition-slow: 350ms ease-out;

/* 缓动函数 */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
```

### 微交互
- **悬停效果**: 轻微的阴影变化和颜色过渡
- **点击反馈**: 轻微的缩放效果
- **加载动画**: 柔和的脉冲或旋转
- **页面切换**: 淡入淡出效果

## 🔧 实现指南

### 组件开发原则
1. **单一职责**: 每个组件只负责一个功能
2. **可组合性**: 组件可以灵活组合使用
3. **可配置性**: 通过props控制组件行为
4. **可访问性**: 支持键盘导航和屏幕阅读器

### 文件结构
```
src/shared/components/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.test.tsx
│   ├── Button.stories.tsx
│   └── index.ts
├── Card/
├── Input/
└── ...
```

### 样式实现
- 使用Tailwind CSS utility classes
- 通过CSS变量支持主题切换
- 使用clsx进行条件样式组合

## 📖 使用示例

### 基础用法示例

#### 日记编辑页面布局
```tsx
<Container size="lg" padding>
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* 编辑器区域 */}
    <div className="lg:col-span-2">
      <Card variant="default" padding="lg">
        <MarkdownEditor
          value={content}
          onChange={setContent}
          placeholder="写下你今天的想法..."
          autoFocus
        />
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-neutral-500">
            自动保存于 {lastSaved}
          </div>
          <Button
            variant="primary"
            loading={saving}
            onClick={handleSave}
          >
            保存
          </Button>
        </div>
      </Card>
    </div>

    {/* 侧边栏 */}
    <div className="space-y-6">
      <JournalList
        entries={recentEntries}
        onEntryClick={handleEntryClick}
      />

      {aiAnalysis && (
        <AIAnalysisCard
          analysis={aiAnalysis}
          loading={analyzing}
        />
      )}
    </div>
  </div>
</Container>
```

#### 情感分析展示
```tsx
<Card variant="elevated" padding="md">
  <h3 className="text-lg font-semibold mb-4">情感分析</h3>

  {/* 情感标签 */}
  <EmotionTags
    emotions={analysis.emotions}
    sentiment={analysis.sentiment}
    size="md"
  />

  {/* 建议列表 */}
  <div className="mt-6">
    <h4 className="text-md font-medium mb-3">个性化建议</h4>
    <SuggestionsList
      suggestions={analysis.suggestions}
      onSuggestionClick={handleSuggestionClick}
    />
  </div>
</Card>
```

## 🎯 可访问性指南

### 键盘导航
- **Tab**: 在可交互元素间导航
- **Enter/Space**: 激活按钮和链接
- **Escape**: 关闭模态框和下拉菜单
- **Arrow Keys**: 在列表和网格中导航

### 屏幕阅读器支持
- 所有交互元素都有适当的ARIA标签
- 图像和图标都有替代文本
- 表单字段有明确的标签关联
- 状态变化会被适当宣布

### 颜色对比
- 文本与背景的对比度至少为4.5:1
- 大文本（18px+）的对比度至少为3:1
- 不仅依赖颜色传达信息

## 🔄 状态管理

### 组件状态模式
```typescript
// 加载状态
interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
}

// 错误状态
interface ErrorState {
  hasError: boolean;
  error?: string;
  canRetry: boolean;
}

// 数据状态
interface DataState<T> {
  data: T | null;
  loading: LoadingState;
  error: ErrorState;
}
```

### 全局状态集成
```typescript
// 与Zustand store集成
const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  currentEntry: null,

  // UI状态
  ui: {
    sidebarOpen: false,
    editorMode: 'write',
    theme: 'light'
  },

  // 操作
  toggleSidebar: () => set(state => ({
    ui: { ...state.ui, sidebarOpen: !state.ui.sidebarOpen }
  }))
}));
```

## 🎨 主题系统

### 主题切换支持
```typescript
interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
}

const lightTheme: Theme = {
  name: 'light',
  colors: {
    primary: '#10b981',
    secondary: '#3b82f6',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827'
  }
};

const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#34d399',
    secondary: '#60a5fa',
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb'
  }
};
```

### CSS变量实现
```css
:root {
  --color-primary: 16 185 129; /* RGB值，用于透明度 */
  --color-secondary: 59 130 246;
  --color-background: 249 250 251;
  --color-surface: 255 255 255;
  --color-text: 17 24 39;
}

[data-theme="dark"] {
  --color-primary: 52 211 153;
  --color-secondary: 96 165 250;
  --color-background: 17 24 39;
  --color-surface: 31 41 55;
  --color-text: 249 250 251;
}

/* 使用示例 */
.bg-primary {
  background-color: rgb(var(--color-primary));
}

.bg-primary-alpha {
  background-color: rgb(var(--color-primary) / 0.1);
}
```

## 📱 移动端优化

### 触摸友好设计
- 最小触摸目标：44px × 44px
- 适当的间距避免误触
- 手势支持（滑动、长按）

### 移动端特定组件
```typescript
// 移动端底部操作栏
interface MobileActionBarProps {
  actions: Array<{
    icon: ReactNode;
    label: string;
    onClick: () => void;
    primary?: boolean;
  }>;
}

// 移动端抽屉导航
interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}
```

## 🧪 测试策略

### 组件测试
```typescript
// Button组件测试示例
describe('Button', () => {
  it('renders with correct variant styles', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-primary-500');
  });

  it('shows loading state correctly', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 可访问性测试
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

it('should not have accessibility violations', async () => {
  const { container } = render(<Button>Accessible button</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## 📚 Storybook集成

### 组件故事示例
```typescript
// Button.stories.tsx
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger']
    }
  }
} as Meta;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '主要按钮'
  }
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: '加载中...'
  }
};
```

## 🚀 性能优化

### 代码分割
```typescript
// 懒加载大型组件
const MarkdownEditor = lazy(() => import('./MarkdownEditor'));
const AIAnalysisCard = lazy(() => import('./AIAnalysisCard'));

// 使用Suspense包装
<Suspense fallback={<LoadingSpinner />}>
  <MarkdownEditor />
</Suspense>
```

### 虚拟化长列表
```typescript
// 使用react-window进行虚拟化
import { FixedSizeList as List } from 'react-window';

const VirtualizedJournalList = ({ entries }) => (
  <List
    height={600}
    itemCount={entries.length}
    itemSize={120}
    itemData={entries}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <JournalCard entry={data[index]} />
      </div>
    )}
  </List>
);
```

---

**文档版本**: 1.0
**最后更新**: 2025-07-22
**维护者**: UX Team
**下次审查**: 2025-08-22
