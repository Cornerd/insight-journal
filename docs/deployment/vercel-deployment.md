# Vercel Deployment Guide

This guide walks you through deploying Insight Journal to Vercel, including environment variable setup and configuration.

## Prerequisites

- [Vercel account](https://vercel.com/signup)
- [GitHub repository](https://github.com) with your project code
- OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

## Quick Deployment

### Option 1: Deploy Button (Recommended)

Click the deploy button to automatically set up the project on Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/insight-journal&env=OPENAI_API_KEY,NEXT_PUBLIC_APP_URL&envDescription=Required%20environment%20variables%20for%20Insight%20Journal&envLink=https://github.com/your-username/insight-journal/blob/main/.env.example)

### Option 2: Manual Deployment

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing Insight Journal

2. **Configure Project Settings**
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

## Environment Variables Setup

### Required Variables

Set these environment variables in your Vercel project:

1. **Go to Project Settings**
   - Navigate to your project in Vercel Dashboard
   - Click on "Settings" tab
   - Select "Environment Variables" from the sidebar

2. **Add Required Variables**

   | Variable | Value | Environment |
   |----------|-------|-------------|
   | `OPENAI_API_KEY` | Your OpenAI API key (starts with `sk-`) | Production, Preview, Development |
   | `NEXT_PUBLIC_APP_URL` | Your Vercel app URL (e.g., `https://insight-journal.vercel.app`) | Production, Preview |

### Optional Variables

   | Variable | Value | Environment | Description |
   |----------|-------|-------------|-------------|
   | `OPENAI_ORG_ID` | Your OpenAI organization ID (starts with `org-`) | All | Only if you belong to multiple organizations |
   | `OPENAI_MODEL` | `gpt-4` | All | Default AI model to use |

### Environment Variable Configuration

```bash
# Production Environment Variables (set in Vercel Dashboard)
OPENAI_API_KEY=sk-your-actual-api-key-here
OPENAI_ORG_ID=org-your-org-id-here  # Optional
OPENAI_MODEL=gpt-4
NODE_ENV=production  # Automatically set by Vercel
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

## Deployment Process

### Automatic Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Vercel Auto-Deploy**
   - Vercel automatically detects the push
   - Builds and deploys your application
   - Provides a preview URL for each deployment

### Manual Deployment

1. **Using Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel --prod
   ```

## Post-Deployment Verification

### 1. Check Application Status

- Visit your deployed URL
- Verify the landing page loads correctly
- Test navigation between sections

### 2. Test Environment Variables

- Navigate to `/api/test-env` (development endpoint)
- Verify environment variables are loaded correctly
- Check for any validation errors

### 3. Monitor Deployment

- Check Vercel Dashboard for build logs
- Monitor function execution times
- Review any error logs

## Custom Domain Setup (Optional)

### 1. Add Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

### 2. Update Environment Variables

Update `NEXT_PUBLIC_APP_URL` to use your custom domain:

```bash
NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
```

## Troubleshooting

### Common Issues

#### Build Failures

**Problem**: Build fails with environment variable errors

**Solution**:
1. Verify all required environment variables are set
2. Check that `OPENAI_API_KEY` starts with `sk-`
3. Ensure `NEXT_PUBLIC_APP_URL` is a valid URL

#### Function Timeouts

**Problem**: API routes timeout during execution

**Solution**:
1. Check `vercel.json` function configuration
2. Optimize API route performance
3. Consider upgrading Vercel plan for longer timeouts

#### Environment Variable Issues

**Problem**: Environment variables not loading in production

**Solution**:
1. Verify variables are set in Vercel Dashboard
2. Check variable names match exactly
3. Redeploy after adding new variables

### Getting Help

1. **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
2. **Next.js Deployment**: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
3. **Project Issues**: Check GitHub repository issues

## Security Considerations

### Environment Variables

- Never commit `.env.local` to version control
- Use Vercel's encrypted environment variable storage
- Rotate API keys regularly
- Use different API keys for development and production

### API Security

- API routes are automatically secured by Vercel
- Consider implementing rate limiting for production
- Monitor API usage in OpenAI dashboard

## Performance Optimization

### Vercel Features

- **Edge Functions**: Automatically optimized for global performance
- **Image Optimization**: Built-in Next.js image optimization
- **Static Generation**: Pre-rendered pages for better performance
- **CDN**: Global content delivery network

### Monitoring

- Use Vercel Analytics for performance insights
- Monitor Core Web Vitals
- Track API response times

---

**Last Updated**: 2025-07-23  
**Next Review**: After first production deployment  
**Owner**: DevOps Team
