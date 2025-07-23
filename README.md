# Insight Journal

An AI-powered personal journaling application built with Next.js 15, React 19, and OpenAI integration.

## Getting Started

### Prerequisites

- Node.js 18.18.0 or higher
- npm, yarn, pnpm, or bun
- OpenAI API key

### Environment Setup

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your environment variables:**

   Open `.env.local` and update the following required variables:

   ```env
   # OpenAI Configuration (Required)
   OPENAI_API_KEY=sk-your-actual-api-key-here

   # Application Configuration (Required)
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Get your OpenAI API key:**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy the key and paste it in your `.env.local` file

### Installation and Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. **Open your browser:**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-...` |
| `NODE_ENV` | Application environment | `development` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_ORG_ID` | OpenAI Organization ID | - |
| `OPENAI_MODEL` | Default OpenAI model | `gpt-4` |
| `DEBUG` | Enable debug logging | `false` |
| `VERBOSE_LOGGING` | Enable verbose logging | `false` |

### Environment Files

- `.env.example` - Template file with all available variables
- `.env.local` - Your local development variables (ignored by Git)
- `.env.production` - Production environment variables (if needed)

## Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript checks
```

## Project Structure

```
src/
├── app/             # Next.js App Router pages
├── components/      # Reusable UI components
├── config/          # Configuration files
│   └── env.ts       # Environment variable configuration
├── features/        # Feature-based modules
├── shared/          # Shared utilities and libraries
│   └── lib/         # Utility functions
└── types/           # TypeScript type definitions
```

## Troubleshooting

### Common Issues

#### Environment Variable Errors

**Problem:** `Required environment variable OPENAI_API_KEY is missing`

**Solution:**
1. Ensure `.env.local` file exists in the project root
2. Verify your OpenAI API key is correctly set
3. Restart the development server after making changes

**Problem:** `Environment variable OPENAI_API_KEY has invalid format`

**Solution:**
1. Check that your API key starts with `sk-`
2. Ensure there are no extra spaces or quotes around the key
3. Verify the key is complete and not truncated

#### Development Server Issues

**Problem:** Server won't start or crashes immediately

**Solution:**
1. Check that all required environment variables are set
2. Run `npm run type-check` to identify TypeScript errors
3. Clear Next.js cache: `rm -rf .next`
4. Reinstall dependencies: `rm -rf node_modules && npm install`

### Getting Help

1. Check the [project documentation](./docs/)
2. Review environment variable setup in `.env.example`
3. Ensure all dependencies are installed with correct versions
4. Check the browser console and terminal for error messages

## Technology Stack

- **Framework:** Next.js 15.4.2 with App Router
- **UI Library:** React 19.1.0
- **Styling:** Tailwind CSS v4
- **Language:** TypeScript
- **AI Integration:** OpenAI API
- **Code Quality:** ESLint, Prettier, Husky
- **Development:** Hot reload, TypeScript checking

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [React Documentation](https://react.dev) - React 19 features
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [OpenAI API](https://platform.openai.com/docs) - AI integration guide
- [TypeScript](https://www.typescriptlang.org/docs) - TypeScript handbook

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and test thoroughly
4. Ensure all environment variables are documented
5. Submit a pull request with a clear description

## License

This project is licensed under the MIT License - see the LICENSE file for details.
