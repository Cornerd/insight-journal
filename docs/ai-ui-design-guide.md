# AI功能UI设计指南

## 🤖 AI交互设计原则

基于Stories 2.1-2.5的分析，AI功能需要特殊的UI设计考虑，以确保用户理解AI的工作方式并建立信任。

## 🎯 核心设计目标

### 1. 透明度 (Transparency)
- 清楚地表明哪些内容是AI生成的
- 显示AI分析的置信度
- 提供AI决策的简单解释

### 2. 控制感 (Control)
- 用户可以选择是否启用AI分析
- 提供重新生成AI结果的选项
- 允许用户编辑或忽略AI建议

### 3. 渐进式披露 (Progressive Disclosure)
- 先显示摘要，再展示详细分析
- 按需加载不同类型的AI洞察
- 避免信息过载

### 4. 情感敏感性 (Emotional Sensitivity)
- 使用温和的颜色和语调
- 避免判断性的语言
- 提供支持性的建议

## 🎨 AI组件视觉设计

### AI分析容器设计
```css
.ai-analysis-container {
  /* 渐变边框表示AI内容 */
  background: linear-gradient(135deg, 
    rgba(16, 185, 129, 0.1) 0%, 
    rgba(59, 130, 246, 0.1) 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  position: relative;
}

.ai-analysis-container::before {
  content: "🤖 AI分析";
  position: absolute;
  top: -8px;
  left: 16px;
  background: white;
  padding: 0 8px;
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}
```

### 加载状态设计
```css
.ai-loading {
  /* 脉冲动画 */
  animation: ai-pulse 2s ease-in-out infinite;
}

@keyframes ai-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.ai-thinking {
  /* 思考动画 */
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ai-thinking::after {
  content: "";
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #10b981;
  animation: ai-dots 1.4s ease-in-out infinite both;
}

@keyframes ai-dots {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

## 📊 情感分析UI设计

### 情感标签设计规范
```typescript
const emotionConfig = {
  joy: {
    color: '#fbbf24',
    emoji: '😊',
    bgColor: 'rgba(251, 191, 36, 0.1)',
    borderColor: 'rgba(251, 191, 36, 0.3)'
  },
  calm: {
    color: '#10b981',
    emoji: '😌',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  sadness: {
    color: '#3b82f6',
    emoji: '😢',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)'
  },
  anxiety: {
    color: '#f59e0b',
    emoji: '😰',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  anger: {
    color: '#ef4444',
    emoji: '😠',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  love: {
    color: '#ec4899',
    emoji: '💕',
    bgColor: 'rgba(236, 72, 153, 0.1)',
    borderColor: 'rgba(236, 72, 153, 0.3)'
  }
};
```

### 情感强度可视化
```css
.emotion-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

/* 强度通过透明度表示 */
.emotion-tag[data-intensity="low"] {
  opacity: 0.6;
}

.emotion-tag[data-intensity="medium"] {
  opacity: 0.8;
}

.emotion-tag[data-intensity="high"] {
  opacity: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

### 情感趋势图表
```typescript
interface EmotionTrendProps {
  data: Array<{
    date: string;
    emotions: Record<string, number>;
  }>;
  timeRange: '7d' | '30d' | '90d';
}

// 使用柔和的渐变色表示情感变化
const emotionGradients = {
  positive: 'linear-gradient(90deg, #10b981, #34d399)',
  neutral: 'linear-gradient(90deg, #6b7280, #9ca3af)',
  negative: 'linear-gradient(90deg, #3b82f6, #60a5fa)'
};
```

## 💡 AI建议UI设计

### 建议卡片设计
```css
.suggestion-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  position: relative;
}

.suggestion-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
}

.suggestion-card::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--category-color);
  border-radius: 4px 0 0 4px;
}
```

### 建议分类颜色
```css
.suggestion-wellness { --category-color: #10b981; }
.suggestion-mindfulness { --category-color: #8b5cf6; }
.suggestion-productivity { --category-color: #f59e0b; }
.suggestion-social { --category-color: #ec4899; }
.suggestion-physical { --category-color: #ef4444; }
.suggestion-reflection { --category-color: #3b82f6; }
```

### 建议优先级指示
```css
.suggestion-priority-high {
  border-left-width: 4px;
  border-left-color: #ef4444;
}

.suggestion-priority-medium {
  border-left-width: 3px;
  border-left-color: #f59e0b;
}

.suggestion-priority-low {
  border-left-width: 2px;
  border-left-color: #6b7280;
}
```

## 🔄 AI处理状态设计

### 多阶段加载指示
```typescript
interface AIProcessingStagesProps {
  currentStage: 'analyzing' | 'emotions' | 'suggestions' | 'complete';
  stages: Array<{
    id: string;
    label: string;
    icon: ReactNode;
    duration?: number;
  }>;
}

const aiProcessingStages = [
  {
    id: 'analyzing',
    label: '分析文本内容',
    icon: '📝',
    duration: 2000
  },
  {
    id: 'emotions',
    label: '识别情感模式',
    icon: '💭',
    duration: 1500
  },
  {
    id: 'suggestions',
    label: '生成个性化建议',
    icon: '💡',
    duration: 2500
  }
];
```

### 进度条设计
```css
.ai-progress-bar {
  width: 100%;
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
}

.ai-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 2px;
  transition: width 0.3s ease;
  position: relative;
}

.ai-progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: ai-shimmer 2s infinite;
}

@keyframes ai-shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

## ⚠️ 错误状态设计

### AI错误类型和视觉处理
```typescript
interface AIErrorState {
  type: 'network' | 'quota' | 'processing' | 'timeout';
  message: string;
  canRetry: boolean;
  suggestion?: string;
}

const errorStyles = {
  network: {
    icon: '🌐',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  quota: {
    icon: '⏰',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)'
  },
  processing: {
    icon: '⚠️',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  timeout: {
    icon: '⏱️',
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)'
  }
};
```

### 友好的错误消息
```typescript
const errorMessages = {
  network: {
    title: '网络连接问题',
    message: '无法连接到AI服务，请检查网络连接',
    action: '重试分析'
  },
  quota: {
    title: 'AI分析次数已用完',
    message: '今日AI分析次数已达上限，明天再试试吧',
    action: '了解更多'
  },
  processing: {
    title: 'AI分析遇到问题',
    message: '分析过程中出现错误，请稍后重试',
    action: '重新分析'
  },
  timeout: {
    title: '分析超时',
    message: '分析时间过长，请尝试缩短文本长度',
    action: '重试'
  }
};
```

## 🎭 AI置信度可视化

### 置信度指示器
```css
.confidence-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.confidence-bar {
  width: 60px;
  height: 4px;
  background: #f3f4f6;
  border-radius: 2px;
  overflow: hidden;
}

.confidence-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.confidence-high { background: #10b981; }
.confidence-medium { background: #f59e0b; }
.confidence-low { background: #ef4444; }
```

### 置信度文本描述
```typescript
const confidenceLabels = {
  high: { text: '高置信度', color: '#10b981' },
  medium: { text: '中等置信度', color: '#f59e0b' },
  low: { text: '低置信度', color: '#ef4444' }
};

function getConfidenceLevel(score: number): keyof typeof confidenceLabels {
  if (score >= 0.8) return 'high';
  if (score >= 0.6) return 'medium';
  return 'low';
}
```

## 📱 移动端AI界面优化

### 移动端AI卡片布局
```css
@media (max-width: 768px) {
  .ai-analysis-mobile {
    /* 全宽显示 */
    margin: 0 -16px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  
  .emotion-tags-mobile {
    /* 可滚动的水平标签 */
    display: flex;
    overflow-x: auto;
    gap: 8px;
    padding: 0 16px;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .emotion-tags-mobile::-webkit-scrollbar {
    display: none;
  }
  
  .suggestions-mobile {
    /* 折叠式建议列表 */
    max-height: 200px;
    overflow-y: auto;
  }
}
```

### 触摸友好的AI交互
```css
.ai-action-button {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 16px;
  touch-action: manipulation;
}

.ai-suggestion-item {
  padding: 16px;
  min-height: 60px;
  border-radius: 8px;
  cursor: pointer;
  touch-action: manipulation;
}
```

## 🔮 未来AI功能设计考虑

### 个性化学习指示
```css
.ai-learning-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #10b981;
  opacity: 0.8;
}

.ai-learning-indicator::before {
  content: "🧠";
  animation: ai-learn 3s ease-in-out infinite;
}

@keyframes ai-learn {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
```

### AI对话界面预留
```css
.ai-chat-container {
  border-radius: 12px;
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  border: 1px solid #d1fae5;
  padding: 16px;
  margin-top: 16px;
}

.ai-message {
  background: white;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

---

**文档版本**: 1.0  
**最后更新**: 2025-07-22  
**维护者**: UX Team  
**相关文档**: [组件库设计文档](./component-library.md)
