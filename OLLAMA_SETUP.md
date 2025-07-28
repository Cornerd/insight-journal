# 🏠 Ollama 本地 AI 设置指南

## 📋 概述

Ollama 是一个完全免费的本地 AI 解决方案，让你可以在自己的电脑上运行大语言模型，无需任何费用！

## 🚀 安装 Ollama

### Windows 安装
1. 访问 [https://ollama.ai](https://ollama.ai)
2. 点击 "Download for Windows"
3. 下载并运行安装程序
4. 安装完成后，Ollama 会自动启动

### 验证安装
打开命令提示符或 PowerShell，运行：
```bash
ollama --version
```

## 📦 下载推荐模型

### 方案 A: Llama 3.1 8B (推荐)
```bash
ollama pull llama3.1:8b
```
- **大小**: ~4.7GB
- **质量**: 优秀
- **速度**: 快
- **内存需求**: 8GB RAM

### 方案 B: Qwen2.5 7B (备选)
```bash
ollama pull qwen2.5:7b
```
- **大小**: ~4.4GB
- **质量**: 很好
- **速度**: 很快
- **特点**: 对中文支持更好

### 方案 C: Llama 3.1 3B (轻量级)
```bash
ollama pull llama3.1:3b
```
- **大小**: ~2GB
- **质量**: 良好
- **速度**: 非常快
- **内存需求**: 4GB RAM

## ⚙️ 配置应用

### 1. 确保 Ollama 运行
```bash
ollama serve
```

### 2. 测试连接
```bash
ollama run llama3.1:8b "Hello, how are you?"
```

### 3. 更新环境变量
在 `.env.local` 中确保：
```bash
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b
```

## 🔧 故障排除

### 问题 1: "ollama: command not found"
**解决方案**: 重启终端或重新安装 Ollama

### 问题 2: "connection refused"
**解决方案**: 
```bash
# 手动启动 Ollama 服务
ollama serve
```

### 问题 3: 模型下载慢
**解决方案**: 
- 使用稳定的网络连接
- 考虑使用更小的模型 (3B 版本)

### 问题 4: 内存不足
**解决方案**:
- 关闭其他应用程序
- 使用更小的模型
- 增加虚拟内存

## 📊 性能对比

| 模型 | 大小 | 内存需求 | 速度 | 质量 | 推荐用途 |
|------|------|----------|------|------|----------|
| llama3.1:8b | 4.7GB | 8GB | 快 | 优秀 | 生产使用 |
| qwen2.5:7b | 4.4GB | 8GB | 很快 | 很好 | 中文优化 |
| llama3.1:3b | 2GB | 4GB | 非常快 | 良好 | 轻量级 |

## 🎯 使用建议

### 开发阶段
- 使用 `llama3.1:3b` 进行快速测试
- 功能验证完成后切换到 `llama3.1:8b`

### 生产准备
- 本地测试使用 `llama3.1:8b`
- 部署到 Vercel 时自动切换到 Gemini

## 🔄 模型切换

### 切换到不同模型
```bash
# 下载新模型
ollama pull qwen2.5:7b

# 更新环境变量
OLLAMA_MODEL=qwen2.5:7b
```

### 查看已安装模型
```bash
ollama list
```

### 删除不需要的模型
```bash
ollama rm llama3.1:3b
```

## 🚀 启动应用

1. **确保 Ollama 运行**:
   ```bash
   ollama serve
   ```

2. **启动开发服务器**:
   ```bash
   npm run dev
   ```

3. **测试 AI 功能**:
   - 创建新的 journal 条目
   - 等待 AI 分析完成
   - 享受完全免费的 AI 功能！

## 💡 提示

- **首次使用**: 模型加载可能需要几秒钟
- **性能优化**: 保持 Ollama 服务运行以获得最佳性能
- **隐私保护**: 所有数据都在本地处理，完全私密
- **离线使用**: 无需网络连接即可使用 AI 功能

## 🎉 完成！

现在你有了一个完全免费的本地 AI 解决方案！🚀
