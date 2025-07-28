# 🆓 免费 AI 解决方案完整设置指南

## 🎯 方案概述

我们实现了一个智能的双环境 AI 解决方案：

- 🏠 **本地开发**: Ollama (完全免费，离线)
- ☁️ **生产部署**: Google Gemini (慷慨免费额度)

## 🚀 快速开始

### 步骤 1: 选择你的设置方式

#### 选项 A: 本地开发 (推荐开始)
```bash
# 1. 安装 Ollama
# 访问 https://ollama.ai 下载安装

# 2. 下载模型
ollama pull llama3.1:8b

# 3. 启动 Ollama
ollama serve

# 4. 配置环境变量
AI_PROVIDER=ollama
```

#### 选项 B: 云端开发
```bash
# 1. 获取 Gemini API 密钥
# 访问 https://makersuite.google.com/app/apikey

# 2. 配置环境变量
AI_PROVIDER=gemini
GEMINI_API_KEY=your-api-key-here
```

### 步骤 2: 更新配置

在 `.env.local` 中设置：
```bash
# 选择提供商
AI_PROVIDER=ollama  # 或 gemini

# Ollama 配置 (本地免费)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b

# Gemini 配置 (云端免费额度)
GEMINI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-1.5-flash
```

### 步骤 3: 启动应用

```bash
# 启动开发服务器
npm run dev

# 访问应用
open http://localhost:3001
```

## 📊 成本对比

| 方案 | 本地开发 | 生产部署 | 月度成本 |
|------|----------|----------|----------|
| **我们的方案** | Ollama (免费) | Gemini (免费额度) | **$0-0.50** |
| OpenAI 方案 | GPT-4o-mini | GPT-4o-mini | **$5-50** |
| 传统方案 | GPT-4 | GPT-4 | **$50-500** |

## 🔧 详细设置指南

### 本地开发 (Ollama)

#### 1. 安装 Ollama
- **Windows**: 下载 [Ollama for Windows](https://ollama.ai)
- **macOS**: `brew install ollama`
- **Linux**: `curl -fsSL https://ollama.ai/install.sh | sh`

#### 2. 下载推荐模型
```bash
# 推荐: 平衡性能和质量
ollama pull llama3.1:8b

# 备选: 更好的中文支持
ollama pull qwen2.5:7b

# 轻量级: 低配置电脑
ollama pull llama3.1:3b
```

#### 3. 验证安装
```bash
# 测试模型
ollama run llama3.1:8b "Hello, how are you?"

# 检查服务
curl http://localhost:11434/api/tags
```

### 云端部署 (Gemini)

#### 1. 获取 API 密钥
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录 Google 账户
3. 点击 "Create API Key"
4. 复制生成的密钥

#### 2. 配置 Vercel 环境变量
```bash
# 在 Vercel Dashboard 中设置
AI_PROVIDER=gemini
GEMINI_API_KEY=your-actual-api-key
GEMINI_MODEL=gemini-1.5-flash
```

#### 3. 部署到 Vercel
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

## 🔄 环境切换

### 自动切换 (推荐)
应用会自动检测环境：
- **开发环境**: 使用 Ollama
- **生产环境**: 使用 Gemini

### 手动切换
```bash
# 切换到 Ollama
AI_PROVIDER=ollama

# 切换到 Gemini  
AI_PROVIDER=gemini

# 切换到 OpenAI (如果有密钥)
AI_PROVIDER=openai
```

## 🧪 测试和验证

### 1. 检查 AI 状态
访问: `http://localhost:3001/api/ai/status`

### 2. 测试 AI 分析
1. 创建新的 journal 条目
2. 输入一些文本
3. 等待 AI 分析完成
4. 验证摘要、情感分析和建议

### 3. 性能测试
```bash
# 测试响应时间
curl -X POST http://localhost:3001/api/ai/analyze \
  -H "Content-Type: application/json" \
  -d '{"content":"Today I feel happy","entryId":"test","type":"full"}'
```

## 🛠️ 故障排除

### Ollama 问题

#### 问题: "connection refused"
```bash
# 解决方案: 启动 Ollama 服务
ollama serve
```

#### 问题: 模型下载失败
```bash
# 解决方案: 检查网络连接，重试下载
ollama pull llama3.1:8b
```

#### 问题: 内存不足
```bash
# 解决方案: 使用更小的模型
ollama pull llama3.1:3b
```

### Gemini 问题

#### 问题: "API key invalid"
- 检查 API 密钥是否正确
- 确认 API 密钥有效期
- 重新生成 API 密钥

#### 问题: "quota exceeded"
- 检查免费额度使用情况
- 等待额度重置 (每分钟重置)
- 考虑升级到付费计划

### 通用问题

#### 问题: AI 分析失败
1. 检查 AI 提供商状态
2. 验证网络连接
3. 查看浏览器控制台错误
4. 检查服务器日志

## 📈 使用建议

### 开发阶段
1. **使用 Ollama** 进行快速迭代
2. **测试不同模型** 找到最适合的
3. **验证功能** 确保一切正常

### 生产准备
1. **获取 Gemini API 密钥**
2. **配置 Vercel 环境变量**
3. **测试生产环境**
4. **监控使用情况**

### 成本优化
1. **开发时使用 Ollama** (完全免费)
2. **生产时使用 Gemini** (免费额度)
3. **监控 API 使用量**
4. **必要时实现缓存**

## 🎉 完成检查清单

- [ ] ✅ 安装 Ollama (本地开发)
- [ ] ✅ 下载 AI 模型
- [ ] ✅ 获取 Gemini API 密钥 (生产部署)
- [ ] ✅ 配置环境变量
- [ ] ✅ 测试 AI 功能
- [ ] ✅ 验证环境切换
- [ ] ✅ 部署到 Vercel
- [ ] ✅ 监控使用情况

## 🚀 恭喜！

你现在拥有了一个几乎零成本的 AI 驱动 journal 应用！

**总结**:
- 💰 **成本**: 几乎为零
- 🏠 **本地**: 完全免费和私密
- ☁️ **云端**: 慷慨的免费额度
- 🔄 **灵活**: 随时切换提供商

享受你的免费 AI 功能吧！🎊
