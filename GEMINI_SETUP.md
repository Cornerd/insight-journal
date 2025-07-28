# ☁️ Google Gemini API 设置指南

## 📋 概述

Google Gemini API 提供慷慨的免费额度，非常适合部署到 Vercel 等云平台。

## 🆓 免费额度

### Gemini 1.5 Flash (推荐)
- **免费额度**: 每分钟 15 requests
- **每日限制**: 1,500 requests
- **每月限制**: 无限制
- **上下文**: 1M tokens
- **输出**: 8K tokens

### Gemini 1.5 Pro
- **免费额度**: 每分钟 2 requests  
- **每日限制**: 50 requests
- **每月限制**: 无限制
- **上下文**: 2M tokens
- **输出**: 8K tokens

## 🔑 获取 API 密钥

### 步骤 1: 访问 Google AI Studio
1. 打开 [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. 使用 Google 账户登录

### 步骤 2: 创建 API 密钥
1. 点击 "Create API Key"
2. 选择现有项目或创建新项目
3. 复制生成的 API 密钥

### 步骤 3: 配置环境变量

#### 本地开发 (.env.local)
```bash
# 生产环境使用 Gemini
AI_PROVIDER=gemini
GEMINI_API_KEY=your-actual-api-key-here
GEMINI_MODEL=gemini-1.5-flash
```

#### Vercel 部署
在 Vercel Dashboard 中设置环境变量：
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your-actual-api-key-here
GEMINI_MODEL=gemini-1.5-flash
```

## 🚀 Vercel 部署配置

### 1. 创建 vercel.json
```json
{
  "env": {
    "AI_PROVIDER": "gemini",
    "GEMINI_MODEL": "gemini-1.5-flash"
  },
  "build": {
    "env": {
      "AI_PROVIDER": "gemini"
    }
  }
}
```

### 2. 更新 package.json
```json
{
  "scripts": {
    "build": "AI_PROVIDER=gemini next build",
    "start": "AI_PROVIDER=gemini next start"
  }
}
```

### 3. 部署到 Vercel
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 📊 成本分析

### 免费额度使用估算

#### 轻度使用 (个人博客)
- **每日分析**: 50 次
- **月度总计**: 1,500 次
- **成本**: **完全免费** ✅

#### 中度使用 (小团队)
- **每日分析**: 200 次
- **月度总计**: 6,000 次
- **超出免费额度**: 4,500 次
- **预估成本**: ~$0.50/月 💰

#### 重度使用 (企业级)
- **每日分析**: 1,000 次
- **月度总计**: 30,000 次
- **超出免费额度**: 28,500 次
- **预估成本**: ~$2.50/月 💰

## ⚙️ 模型选择建议

### Gemini 1.5 Flash (推荐)
- ✅ **更高的免费额度** (15 req/min vs 2 req/min)
- ✅ **更快的响应速度**
- ✅ **适合实时应用**
- ✅ **成本效益最高**

### Gemini 1.5 Pro (高质量需求)
- ✅ **更高的分析质量**
- ✅ **更大的上下文窗口**
- ❌ **较低的免费额度**
- ❌ **响应速度较慢**

## 🔧 环境切换策略

### 开发环境 (本地)
```bash
# .env.local
AI_PROVIDER=ollama  # 完全免费
```

### 生产环境 (Vercel)
```bash
# Vercel 环境变量
AI_PROVIDER=gemini  # 免费额度 + 云端稳定性
```

### 测试环境
```bash
# .env.test
AI_PROVIDER=gemini  # 测试真实 API 行为
```

## 🛡️ 安全最佳实践

### 1. API 密钥保护
- ❌ 不要在代码中硬编码 API 密钥
- ✅ 使用环境变量
- ✅ 在 Vercel 中设置为加密环境变量

### 2. 请求限制
```typescript
// 实现请求限制
const rateLimiter = {
  requests: 0,
  resetTime: Date.now() + 60000, // 1分钟
  
  canMakeRequest() {
    if (Date.now() > this.resetTime) {
      this.requests = 0;
      this.resetTime = Date.now() + 60000;
    }
    
    if (this.requests >= 15) { // Gemini Flash 限制
      return false;
    }
    
    this.requests++;
    return true;
  }
};
```

### 3. 错误处理
```typescript
// 优雅的降级处理
if (rateLimitExceeded) {
  return {
    summary: "AI analysis temporarily unavailable due to rate limits. Please try again in a moment.",
    fallback: true
  };
}
```

## 🧪 测试 API 连接

### 快速测试脚本
```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Hello, how are you?"}]
    }]
  }'
```

## 📈 监控使用情况

### 1. Google Cloud Console
- 访问 [Google Cloud Console](https://console.cloud.google.com/)
- 查看 API 使用统计
- 设置使用警报

### 2. 应用内监控
```typescript
// 记录 API 使用情况
const logAPIUsage = (tokens: number, model: string) => {
  console.log(`API Usage: ${tokens} tokens, Model: ${model}`);
  // 可以发送到分析服务
};
```

## 🎯 部署检查清单

- [ ] ✅ 获取 Gemini API 密钥
- [ ] ✅ 在 Vercel 中设置环境变量
- [ ] ✅ 测试 API 连接
- [ ] ✅ 验证免费额度
- [ ] ✅ 设置监控和警报
- [ ] ✅ 部署到生产环境

## 🎉 完成！

现在你有了一个成本效益极高的云端 AI 解决方案！

**总结**:
- 🏠 **本地开发**: Ollama (完全免费)
- ☁️ **生产部署**: Gemini (慷慨免费额度)
- 💰 **成本**: 几乎为零！
