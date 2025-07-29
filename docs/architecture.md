# Insight Journal Architecture Documentation

## 📋 Architecture Overview

This document outlines the overall project architecture for Insight Journal – AI-Powered Daily Reflection Web App, including backend systems, shared services, and non-UI specific concerns. Its primary goal is to serve as the guiding architectural blueprint for AI-driven development, ensuring consistency and adherence to chosen patterns and technologies.

**Relationship to Frontend Architecture:**
If the project includes a significant user interface, a separate Frontend Architecture Document will detail the frontend-specific design and MUST be used in conjunction with this document. Core technology stack choices documented herein (see "Tech Stack") are definitive for the entire project, including any frontend components.

### Starter Template or Existing Project

This architecture document is being generated from a structured template, ensuring comprehensive coverage of key architectural areas.

### Project Name and Overview

**Project Name:** Insight Journal – AI-Powered Daily Reflection Web App

**Overview:** The Insight Journal is a web application designed to help users organize their daily thoughts and reflections. It leverages AI to provide summaries, emotion analysis, and personalized suggestions, enhancing self-awareness and emotional well-being.

### Goals and Background Context

#### Goals

* Provide users with a tool to systematically organize their daily thoughts and reflections.
* Enable users to gain deeper self-awareness through AI-powered summaries and emotion analysis.
* Offer intelligent insights and personalized suggestions to support emotional management and personal growth.
* Showcase the developer's proficiency in front-end development and AI integration.

#### Background Context

Many individuals keep diaries or journals for self-reflection, but often struggle to derive actionable insights or identify long-term emotional patterns from their entries. Existing emotion diary applications frequently lack intelligent features, offering a dull experience without the benefit of deeper analysis. The "Insight Journal" project addresses these pain points by leveraging AI to transform raw journal entries into structured summaries, provide detailed emotion analysis, and generate personalized suggestions. This web application aims to enhance the user's self-awareness and emotional well-being by making daily reflection more insightful and engaging.

### Functional Requirements

The application will include the following key functional requirements:

#### Epic 1: Core Journaling Experience

* **Story 1.1: User Registration & Login:** Users can create accounts, log in, and manage their sessions securely.
* **Story 1.2: Journal Entry Creation:** Users can write and save daily journal entries (text-based).
* **Story 1.3: Journal Entry Viewing:** Users can view their past journal entries, sorted by date.
* **Story 1.4: Journal Entry Editing & Deletion:** Users can edit or delete their existing journal entries.
* **Story 1.5: Basic Journal Search/Filter:** Users can search or filter entries by date range.

#### Epic 2: AI-Powered Insights & Analysis

* **Story 2.1: Automatic AI Summarization:** Each journal entry is automatically summarized by AI upon saving.
* **Story 2.2: Emotion Detection & Analysis:** AI analyzes entries for dominant emotions and provides an emotional breakdown.
* **Story 2.3: Personalized Suggestions:** AI offers relevant suggestions or prompts based on the entry's content and detected emotions.
* **Story 2.4: AI Analysis Display:** AI summaries, emotions, and suggestions are clearly displayed alongside the journal entry.
* **Story 2.5: AI Re-analysis Trigger:** Users can manually trigger re-analysis of an entry if content is significantly updated or desired.

#### Epic 3: Supabase Authentication and Cloud Storage

* **Story 3.1: Supabase User Authentication Integration:** Integrate Supabase Auth for user registration, login, and session management.
* **Story 3.2: Journal Entry Cloud Storage:** Store all journal entries in Supabase PostgreSQL, leveraging its capabilities for data persistence and retrieval.
* **Story 3.3: User Preferences Storage:** Store user-specific settings (e.g., preferred AI model) in Supabase.
* **Story 3.4: Row Level Security (RLS) Implementation:** Implement RLS policies to ensure users can only access their own journal entries and data.
* **Story 3.5: Realtime Updates (Optional MVP):** Explore and potentially implement Supabase Realtime for instant updates to the UI (e.g., new entries appearing without refresh).
* **Story 3.6: Local Storage Data Migration:** Provide a seamless one-time migration for existing users who previously used local storage for their journal entries, moving their data to Supabase upon first login.

### Non-Functional Requirements

* **Performance:**
    * **Frontend:** Initial page load time < 2 seconds on a typical broadband connection.
    * **Backend (AI Analysis):** AI analysis for an average entry (approx. 500 words) to complete within 5-10 seconds.
    * **Database:** CRUD operations on journal entries to respond within 200ms for typical usage.
* **Security:**
    * **Authentication:** Secure user authentication (Supabase Auth).
    * **Data Protection:** All sensitive data (journal entries) encrypted at rest and in transit.
    * **Authorization:** Strict Row Level Security (RLS) to prevent unauthorized data access between users.
    * **API Security:** All API endpoints secured against common vulnerabilities (e.g., injection, XSS, CSRF).
* **Scalability:**
    * Application must be capable of handling 10,000 concurrent users with minimal performance degradation.
    * Database should scale to accommodate millions of journal entries.
    * AI service integration should be able to handle increasing analysis requests.
* **Reliability & Availability:**
    * Target 99.9% uptime for the application.
    * Redundant infrastructure where possible.
    * Robust error handling and logging for all critical operations.
* **Maintainability:**
    * Clean, modular code architecture following best practices.
    * Comprehensive documentation (this architecture document, API docs, code comments).
    * Automated testing for key functionalities.
* **Usability:**
    * Intuitive and responsive user interface.
    * Clear feedback for user actions (e.g., loading states for AI analysis).
    * Accessibility considerations for users with disabilities (WCAG 2.1 AA compliant where feasible).
* **Cost Efficiency:**
    * Leverage serverless and managed services (Vercel, Supabase, AI APIs) to optimize operational costs based on usage.
    * Monitor AI token usage to control expenses.
* **Privacy:**
    * Adhere to relevant data privacy regulations (e.g., GDPR, CCPA).
    * Clear user consent for data processing and AI analysis.
    * User data to be used solely for the stated purpose of providing journaling and insights.

### Technical Assumptions

* **Cloud Platform:** Vercel for frontend and Next.js backend (Serverless Functions/Server Actions).
* **Database:** Supabase (PostgreSQL database with built-in Auth and Realtime).
* **AI Services:** Initial integration with OpenAI API (GPT models). Design should allow for future integration of other providers (e.g., Google Gemini, Ollama).
* **Frontend Framework:** Next.js 15 (App Router).
* **Styling:** Tailwind CSS for rapid UI development and responsiveness.
* **Language:** TypeScript for both frontend and backend for type safety.
* **Version Control:** Git/GitHub.
* **Deployment:** CI/CD pipeline integrated with Vercel for automated deployments from GitHub.
* **User Data Migration:** Users will consent to a one-time migration of their local journal entries to Supabase upon logging in to preserve their history.

## Proposed Architecture

### High-Level System Architecture

The Insight Journal application will follow a modern serverless architecture, primarily built on Next.js 15, deployed on Vercel, and leveraging Supabase as its backend-as-a-service. AI functionalities will be integrated via external APIs.

```mermaid
graph TD
    A[User (Web Browser)] -->|HTTP/HTTPS| B(Vercel Hosted Next.js App)

    subgraph Next.js Application (Deployed on Vercel)
        B --&gt; C(Next.js Frontend - React 19 / App Router)
        B --&gt; D(Next.js Backend - Server Actions / API Routes)
    end

    C --&gt;|Client-Side Data Fetching| D
    D --&gt;|PostgreSQL Interface (via Supabase Client)| E(Supabase PostgreSQL Database)
    D --&gt;|Auth API (via Supabase Client)| F(Supabase Auth)
    D --&gt;|External API Calls| G(OpenAI / Google Gemini / Ollama APIs)

    E --&gt;|Realtime Subscriptions| C
    F --&gt;|Auth Events| C

    subgraph External Services
        E --&gt; H(Supabase Storage - for future file uploads)
        F --&gt; I(Email Service - for Auth Emails)
        G --&gt; J(AI Model Providers)
    end

    style A fill:#ECEFF1,stroke:#607D8B,stroke-width:2px;
    style B fill:#E0F2F7,stroke:#26C6DA,stroke-width:2px;
    style C fill:#BBDEFB,stroke:#2196F3,stroke-width:2px;
    style D fill:#C8E6C9,stroke:#4CAF50,stroke-width:2px;
    style E fill:#FFFDE7,stroke:#FFEB3B,stroke-width:2px;
    style F fill:#F3E5F5,stroke:#9C27B0,stroke-width:2px;
    style G fill:#FFCCBC,stroke:#FF5722,stroke-width:2px;
    style H fill:#CFD8DC,stroke:#607D8B,stroke-width:1px;
    style I fill:#CFD8DC,stroke:#607D8B,stroke-width:1px;
    style J fill:#CFD8DC,stroke:#607D8B,stroke-width:1px;

Key Components:

User (Web Browser): Interacts with the application through a web browser.

Next.js Application (Deployed on Vercel):

Next.js Frontend (React 19 / App Router): The user interface, rendered as React components. It will leverage Next.js Server Components for static content and initial data fetching, and Client Components for interactivity.

Next.js Backend (Server Actions / API Routes): Serverless functions within the Next.js application that handle sensitive logic, database interactions, and external API calls (e.g., to AI services). Server Actions will be primarily used for mutations, while API Routes can serve for more general data fetching or specific integrations.

Supabase PostgreSQL Database: The primary data store for journal entries, user preferences, and AI usage logs. Supabase provides a managed PostgreSQL instance, abstracting database management.

Supabase Auth: Integrated authentication service provided by Supabase, handling user registration, login, session management (JWTs), and integrating with RLS.

External AI APIs (OpenAI / Google Gemini / Ollama): Third-party AI services used for generating summaries, emotion analysis, and personalized suggestions. Calls to these APIs are proxied through the Next.js Backend to protect API keys and apply business logic.

Supabase Storage (Future): For potential future features like storing attachments or multimedia.

Email Service: Used by Supabase Auth for transactional emails (e.g., password resets, email confirmations).

Data Flow Overview:

Users interact with the Next.js Frontend.

Interactive actions (e.g., saving a journal entry, logging in) trigger Server Actions or API Routes on the Next.js Backend.

The Next.js Backend communicates with Supabase (for database operations and authentication) and external AI APIs.

Data retrieved from Supabase or AI APIs is sent back to the Next.js Frontend for display.

Supabase Realtime can push live updates from the database directly to the Frontend (e.g., new entries appearing instantly).

Data Model
The data model is centered around journal entries and associated user data, designed to support the core application functionalities and AI analysis. The primary database will be Supabase PostgreSQL.

Conceptual Data Model
Code snippet

erDiagram
    USERS {
        UUID id PK
        TEXT email
        TIMESTAMP created_at
        TIMESTAMP last_sign_in_at
    }

    JOURNAL_ENTRIES {
        UUID id PK
        UUID user_id FK "REFERENCES USERS"
        VARCHAR title
        TEXT content
        TIMESTAMP created_at
        TIMESTAMP updated_at
        TEXT ai_summary
        JSONB ai_emotions
        TEXT ai_suggestions
        TIMESTAMP ai_analyzed_at
        VARCHAR ai_analysis_version
        VARCHAR content_hash UNIQUE
        INTEGER word_count
        TIMESTAMP deleted_at
    }

    USER_PREFERENCES {
        UUID id PK
        UUID user_id FK "REFERENCES USERS" UNIQUE
        VARCHAR ai_provider
        BOOLEAN ai_analysis_auto
        VARCHAR theme
        VARCHAR language
        VARCHAR timezone
        BOOLEAN email_notifications
        VARCHAR reminder_frequency
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }

    AI_USAGE_LOGS {
        UUID id PK
        UUID user_id FK "REFERENCES USERS"
        UUID entry_id FK "REFERENCES JOURNAL_ENTRIES"
        VARCHAR ai_provider
        VARCHAR analysis_type
        INTEGER tokens_used
        DECIMAL cost_usd
        INTEGER execution_time_ms
        BOOLEAN success
        TEXT error_message
        TIMESTAMP created_at
    }

    USERS ||--o{ JOURNAL_ENTRIES : has
    USERS ||--o{ USER_PREFERENCES : has
    USERS ||--o{ AI_USAGE_LOGS : generates
    JOURNAL_ENTRIES ||--o{ AI_USAGE_LOGS : analyzed_for
Entities and Attributes
auth.users (Supabase Built-in)

id (UUID, Primary Key): Unique identifier for the user.

email (TEXT): User's email address.

created_at (TIMESTAMP): Timestamp of user creation.

last_sign_in_at (TIMESTAMP): Last sign-in timestamp.

journal_entries

id (UUID, Primary Key, Default uuid_generate_v4()): Unique identifier for each journal entry.

user_id (UUID, Foreign Key to auth.users.id, NOT NULL, ON DELETE CASCADE): Links entries to a specific user.

title (VARCHAR(255)): Optional title for the entry.

content (TEXT, NOT NULL, CHECK (char_length(content) > 0)): The main text content of the journal entry.

created_at (TIMESTAMP WITH TIME ZONE, NOT NULL, Default NOW()): Timestamp when the entry was created.

updated_at (TIMESTAMP WITH TIME ZONE, NOT NULL, Default NOW()): Timestamp of the last update. Managed by a database trigger.

ai_summary (TEXT): AI-generated summary of the entry.

ai_emotions (JSONB): AI-detected emotions, stored as a JSONB object (e.g., {"sentiment": "positive", "confidence": 0.9, "tags": ["joy", "calm"]}). Validated by a DB function.

ai_suggestions (TEXT): AI-generated personalized suggestions or prompts.

ai_analyzed_at (TIMESTAMP WITH TIME ZONE): Timestamp of the last AI analysis.

ai_analysis_version (VARCHAR(20), Default '1.0'): Version of the AI model used for analysis.

content_hash (VARCHAR(64), UNIQUE): SHA256 hash of the content to detect changes and prevent duplicate AI analysis. Managed by a database trigger.

word_count (INTEGER, Default 0, CHECK (word_count >= 0)): Number of words in the entry. Managed by a database trigger.

deleted_at (TIMESTAMP WITH TIME ZONE): Used for soft deletion, allowing recovery and historical tracking.

user_preferences

id (UUID, Primary Key, Default uuid_generate_v4()): Unique identifier for the preference record.

user_id (UUID, Foreign Key to auth.users.id, UNIQUE, NOT NULL, ON DELETE CASCADE): Links preferences to a user, ensuring one-to-one relationship.

ai_provider (VARCHAR(20), Default 'openai', CHECK constraint): Preferred AI service provider ('openai', 'gemini', 'ollama').

ai_analysis_auto (BOOLEAN, Default true): Flag for automatic AI analysis on new entries.

theme (VARCHAR(10), Default 'light', CHECK constraint): UI theme preference ('light', 'dark', 'system').

language (VARCHAR(5), Default 'en'): User's preferred language.

timezone (VARCHAR(50), Default 'UTC'): User's local timezone.

email_notifications (BOOLEAN, Default false): Opt-in for email notifications.

reminder_frequency (VARCHAR(10), Default 'none', CHECK constraint): How often to send journaling reminders ('none', 'daily', 'weekly', 'monthly').

created_at (TIMESTAMP WITH TIME ZONE, NOT NULL, Default NOW()): Timestamp of record creation.

updated_at (TIMESTAMP WITH TIME ZONE, NOT NULL, Default NOW()): Timestamp of the last update. Managed by a database trigger.

ai_usage_logs

id (UUID, Primary Key, Default uuid_generate_v4()): Unique identifier for each log entry.

user_id (UUID, Foreign Key to auth.users.id, NOT NULL, ON DELETE CASCADE): The user who triggered the AI call.

entry_id (UUID, Foreign Key to journal_entries.id, ON DELETE CASCADE): The journal entry associated with the AI call (nullable if AI call is not entry-specific).

ai_provider (VARCHAR(20), NOT NULL): The AI service provider used.

analysis_type (VARCHAR(20), NOT NULL, CHECK constraint): Type of AI analysis performed ('summary', 'emotions', 'suggestions', 'full').

tokens_used (INTEGER): Number of AI tokens consumed for the operation.

cost_usd (DECIMAL(10, 6)): Estimated cost of the AI operation in USD.

execution_time_ms (INTEGER): Time taken for the AI operation in milliseconds.

success (BOOLEAN, Default true): Indicates if the AI call was successful.

error_message (TEXT): Error message if the AI call failed.

created_at (TIMESTAMP WITH TIME ZONE, NOT NULL, Default NOW()): Timestamp of the log entry.

Relationships
One-to-Many:

auth.users to journal_entries: One user can have many journal entries.

auth.users to ai_usage_logs: One user can generate many AI usage logs.

One-to-One:

auth.users to user_preferences: Each user has exactly one preferences record.

Many-to-One:

journal_entries to ai_usage_logs: An AI usage log can be associated with one specific journal entry.

Technology Stack
Category	Technology	Purpose
Frontend	Next.js 15	React framework for building the user interface, leveraging App Router.
React 19	JavaScript library for building user interfaces.
Tailwind CSS	Utility-first CSS framework for rapid UI development and responsive design.
Zustand	Lightweight state management library for client-side state.
@uiw/react-md-editor	Markdown editor component for journal entry input.
Backend	Next.js 15 (Server Actions)	Serverless functions for API endpoints, business logic, and database interactions.
Database	Supabase (PostgreSQL)	Managed PostgreSQL database, providing data persistence, Row Level Security (RLS), and real-time capabilities.
Authentication	Supabase Auth	User authentication and authorization, integrated with PostgreSQL RLS.
AI Integration	OpenAI API	Primary AI provider for summarization, emotion analysis, and suggestions.
Google Gemini API (Future)	Alternative AI provider for future integration and fallback.
Ollama (Future)	Local/self-hosted LLM option for future integration.
Deployment	Vercel	Serverless deployment platform for Next.js applications.
Language	TypeScript	Strongly typed superset of JavaScript, used across frontend and backend.
Version Control	Git / GitHub	Source code management and collaboration.
Utilities	date-fns	Library for date manipulation.
html-purify	HTML sanitization for user input.

Export to Sheets
Key Architectural Components
Frontend Components
The frontend of the Insight Journal application will be built using Next.js 15 and React 19, leveraging the App Router for a robust and performant user interface. The architecture emphasizes a modular approach, clear separation of concerns, and optimizations for user experience.

App Router Structure
The application's routing and file-based organization will follow the Next.js 15 App Router conventions:

app/
├── layout.tsx                 # Root layout with global providers
├── page.tsx                   # Home page (/)
├── journal/
│   ├── layout.tsx            # Journal-specific layout
│   ├── page.tsx              # Main journal page (/journal)
│   └── [id]/
│       └── page.tsx          # Individual entry view (/journal/[id])
├── auth/
│   ├── login/page.tsx        # Login page (/auth/login)
│   └── register/page.tsx     # Register page (/auth/register)
├── settings/
│   └── page.tsx              # User preferences (/settings)
└── globals.css               # Global styles with Tailwind
Layout Components
Root Layout (app/layout.tsx)

Serves as the global application shell.

Contains the <html> structure and essential metadata.

Imports global CSS (Tailwind, custom styles).

Wraps the application with global providers (e.g., AuthProvider, ThemeProvider).

Includes global error boundaries.

Handles font optimization and loading.

Journal Layout (app/journal/layout.tsx)

Provides a specific layout structure for all journal-related pages.

Integrates a navigation sidebar for journal history.

Displays AI analysis status indicators.

Includes quick action buttons (e.g., "New Entry," "Settings").

Adapts for responsive mobile/desktop experiences.

Core Pages/Views
Home Page (/)

Purpose: Landing page and introduction to the application.

Components: Hero section highlighting app benefits, feature highlights (AI analysis, emotion tracking), call-to-action to start journaling, and authentication status handling.

Journal Page (/journal)

Purpose: The primary interface for creating and managing journal entries.

Key Components:

JournalEditor: A wrapper around @uiw/react-md-editor for rich content input.

EntryList: Displays the user's journal history with date filtering.

AIAnalysisPanel: Shows AI-generated summaries, emotions, and suggestions.

LoadingStates: Provides visual feedback during AI processing.

ErrorBoundary: Gracefully handles potential AI service failures.

Individual Entry View (/journal/[id])

Purpose: Allows users to view and edit specific journal entries.

Components:

EntryViewer: Read-only display of an entry with an optional edit toggle.

AIInsights: Detailed display of AI analysis results.

ReAnalyzeButton: A trigger for manual AI re-processing.

EntryActions: Buttons for editing, deleting, and future sharing options.

Authentication Pages (/auth/*)

Purpose: Handles user registration and login flows.

Components:

AuthForm: A reusable form component for both login and registration.

SocialAuth: (Future) Buttons for OAuth providers.

PasswordReset: Handles the password recovery flow.

Key UI Components Library
The application will use a structured component library for reusability and consistency:

Journal-Specific Components (components/journal/)

JournalEditor.tsx

EntryCard.tsx

EntryList.tsx

AIAnalysisPanel.tsx

EmotionTags.tsx

LoadingSpinner.tsx

ReAnalyzeButton.tsx

Common UI Components (components/ui/)

Button.tsx

Input.tsx

Modal.tsx

Card.tsx

Badge.tsx

Toast.tsx

Skeleton.tsx

Layout Components (components/layout/)

Header.tsx

Sidebar.tsx

Footer.tsx

MobileNav.tsx

State Management Architecture
Client-side state will be managed primarily using Zustand:

Zustand Store Structure (stores/)

authStore.ts: Manages user authentication state.

journalStore.ts: Journal entries and CRUD operations.

aiStore.ts: AI analysis states and caching.

uiStore.ts: UI state (theme, modals, loading).

settingsStore.ts: User preferences.

Store Integration Pattern

Stores will encapsulate state and related actions, interacting with Supabase for persistence and triggering AI analysis via Server Actions.

React Integration Patterns
Server Components Usage

Used for static content, initial data loading, and components that do not require client-side interactivity or frequent re-renders.

Examples: Layout components (for SEO and performance), initial journal entry lists, user preference loading, and metadata/OpenGraph tags.

Client Components for Interactivity

Designated with 'use client' directive for interactive elements requiring browser APIs or client-side state.

Examples: Journal editor with real-time preview, AI analysis triggers and loading states, form submissions and validation, animations, and transition effects.

Custom Hooks Pattern (hooks/)

Custom React hooks will encapsulate reusable logic for state management, API interactions, and utility functions.

Examples: useAuth.ts, useJournal.ts, useAIAnalysis.ts, useLocalStorage.ts, useDebounce.ts.

Responsive Design Strategy
The application will adopt a mobile-first approach, leveraging Tailwind CSS breakpoints:

Mobile-First Approach

Utilizes Tailwind CSS breakpoints (sm:, md:, lg:, xl:) for adaptive styling.

UI elements are optimized for touch interactions.

Incorporates features like swipe gestures for navigation and a collapsible sidebar on mobile.

Desktop Enhancements

Implements multi-column layouts for larger screens.

Provides keyboard shortcuts for power users.

Includes hover states and subtle animations.

Features an extended sidebar with advanced options.

Performance Optimizations
Code Splitting

Lazy loading will be employed for non-critical components to reduce initial bundle size and improve load times.

Example: const AIAnalysisPanel = lazy(() => import('./AIAnalysisPanel')).

Image and Asset Optimization

next/image component will be used for automatic image optimization and responsive loading.

SVG icons will be preferred for scalability and performance (e.g., using lucide-react).

Caching Strategies

React Query (Future): For robust server state caching and data synchronization.

Zustand persist middleware: For persisting client-side state across sessions.

Service Worker (Future): For advanced offline functionality and caching of assets.

Backend Services
The backend of the Insight Journal application will be primarily built using Next.js 15's Server Actions and API Routes, enabling a serverless architecture deployed on Vercel. These services will handle core business logic, data interactions with Supabase, and integrations with external AI APIs.

Service Architecture Overview
The serverless backend will leverage Next.js Server Actions for direct data mutations and complex business logic, and API Routes for more traditional HTTP endpoints, especially for data fetching or specific integrations. This approach centralizes backend logic within the Next.js application, simplifying deployment and scaling.

1. Authentication Services
Server Actions for Auth Flow:

signUpAction(formData): Handles user registration. Performs server-side validation, integrates with supabase.auth.signUp, and initializes user preferences upon successful registration.

signInAction(formData): (Similar pattern) Manages user login.

Rationale: Server Actions provide a secure and efficient way to handle authentication directly from forms, avoiding explicit API calls from the client and enhancing security by running logic on the server.

TypeScript

// app/auth/actions.ts
'use server'
export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // 1. Client-side and Server-side Validation
  const validationResult = validateAuthInput(email, password)
  if (!validationResult.success) {
    return { error: validationResult.error }
  }

  // 2. Supabase User Creation
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (error) return { error: error.message }

  // 3. Initialize user preferences
  await initializeUserPreferences(data.user?.id)

  return { success: true, user: data.user }
}
// Similar pattern for signInAction, etc.
Session Management API (app/api/auth/session/route.ts):

GET: Retrieves current user session details from Supabase.

DELETE: Handles user logout by invalidating the Supabase session.

Rationale: Provides clear HTTP endpoints for session state retrieval and termination, especially useful for client-side hydration or global logout mechanisms.

2. Journal Entry Services
CRUD Operations via Server Actions (app/journal/actions.ts):

createJournalEntry(content, title?): Handles the creation of new journal entries. Includes authentication checks, input validation (sanitization, word count, content hashing), database insertion via Supabase, and triggers background AI analysis.

updateJournalEntry(id, updates): Manages updates to existing journal entries. Incorporates ownership checks (via user_id and RLS), updates the database, and intelligently triggers AI re-analysis if the content has changed.

Rationale: Server Actions provide a direct and type-safe way to perform database mutations securely on the server, ensuring data integrity and applying business logic before saving.

TypeScript

// app/journal/actions.ts
'use server'
export async function createJournalEntry(content: string, title?: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  const sanitizedContent = sanitizeHtml(content)
  const wordCount = countWords(sanitizedContent)
  const contentHash = generateContentHash(sanitizedContent)

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: user.id,
      title,
      content: sanitizedContent,
      word_count: wordCount,
      content_hash: contentHash
    })
    .select()
    .single()

  if (error) throw new Error('Failed to create entry')

  await triggerAIAnalysis(data.id) // Trigger AI analysis in background

  return data
}
// Similar pattern for updateJournalEntry, etc.
Data Fetching API Routes (app/api/journal/entries/route.ts):

GET(request): Fetches a paginated list of journal entries for the authenticated user, ordered by creation date. Includes authentication and pagination logic.

Rationale: API Routes are suitable for data fetching, allowing for flexible query parameters and standard HTTP responses.

3. AI Integration Services
Multi-Provider AI Service (services/aiService.ts):

AIService Class: Encapsulates logic for interacting with various AI providers (OpenAI, Gemini, Ollama). It abstracts the underlying AI API calls.

analyzeEntry(content, provider): Orchestrates the AI analysis process, calling the selected provider for summary, emotion analysis, and suggestions. Includes a fallback mechanism to a default provider (e.g., OpenAI) if the primary chosen provider fails.

Rationale: This abstraction allows for easy switching between AI providers, future expansion, and robust error handling/fallbacks, minimizing vendor lock-in.

AI Analysis API Routes (app/api/ai/analyze/route.ts):

POST(request): Triggers AI analysis for a specific journal entry.

Logic: Authenticates the user, verifies entry ownership, checks if re-analysis is needed (using content_hash and forceReAnalysis), calls the AIService, and updates the database with the AI analysis results (ai_summary, ai_emotions, ai_suggestions).

Rationale: Centralizes AI processing on the server, preventing client-side exposure of AI API keys and allowing for background processing and caching.

4. Data Migration Services
LocalStorage Migration API (app/api/migration/localStorage/route.ts):

POST(request): Facilitates the migration of locally stored anonymous journal entries from localStorage (or IndexedDB) to the Supabase database upon user registration/login.

Logic: Transforms local entry data to the Supabase schema, then performs a batch upsert with conflict resolution (onConflict: 'user_id,created_at', ignoreDuplicates: true) to avoid duplicates.

Rationale: Ensures a seamless transition for anonymous users to authenticated accounts, preserving their journal history.

5. User Preferences Services
Settings Management Server Action (app/settings/actions.ts):

updateUserPreferences(preferences): Allows authenticated users to update their settings, such as preferred AI provider or UI theme.

Logic: Performs an upsert operation on the user_preferences table in Supabase.

Rationale: Provides a direct and secure way to manage user-specific configurations.

6. Utility Services
Background Job Processing (services/backgroundJobs.ts):

triggerAIAnalysis(entryId): Function to queue or trigger AI analysis jobs. This could evolve to use Vercel Cron or an external queuing system for more robust background processing.

scheduleDataCleanup(): (Future) Placeholder for functions that handle scheduled tasks like cleaning old analysis caches or expired sessions.

Rationale: Offloads long-running or non-critical tasks from the main request-response cycle, improving user experience and system efficiency.

Error Handling & Logging (middleware/errorHandler.ts):

withErrorHandling(handler): A higher-order function to wrap API Routes or Server Actions, providing centralized error catching, logging to the console, and potential integration with external logging services in production.

Rationale: Ensures consistent error responses and robust monitoring for debugging and operational insights.

Service Integration Patterns:

Authentication Middleware (lib/auth.ts):

getCurrentUser(): Fetches the current user session.

requireAuth(): A decorator/utility to enforce authentication on server-side functions.

Rate Limiting (middleware/rateLimit.ts): (Future) Middleware to prevent abuse of expensive AI APIs by tracking and limiting user requests.

Caching Strategy (lib/cache.ts): (Future) A dedicated caching class/service to cache AI results, user preferences, and frequently accessed journal entries to reduce redundant computations and database load.

Database
The Insight Journal application will utilize Supabase PostgreSQL as its primary database, chosen for its robust relational capabilities, real-time features, and integrated authentication. The database design emphasizes data integrity, performance, and strong security through Row Level Security (RLS).

1. Core Tables Structure
The core database schema is designed around key application entities:

SQL

-- 扩展UUID生成功能
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Journal Entries表 (核心数据表)
CREATE TABLE journal_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- 内容字段
  title VARCHAR(255),
  content TEXT NOT NULL CHECK (char_length(content) > 0),

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- AI分析结果
  ai_summary TEXT,
  ai_emotions JSONB,
  ai_suggestions TEXT,
  ai_analyzed_at TIMESTAMP WITH TIME ZONE,
  ai_analysis_version VARCHAR(20) DEFAULT '1.0',

  -- 缓存和性能优化
  content_hash VARCHAR(64) UNIQUE,
  word_count INTEGER DEFAULT 0 CHECK (word_count >= 0),

  -- 软删除支持
  deleted_at TIMESTAMP WITH TIME ZONE,

  -- 约束
  CONSTRAINT valid_analysis_data CHECK (
    (ai_summary IS NULL AND ai_emotions IS NULL AND ai_suggestions IS NULL AND ai_analyzed_at IS NULL) OR
    (ai_summary IS NOT NULL OR ai_emotions IS NOT NULL OR ai_suggestions IS NOT NULL)
  )
);

-- User Preferences表
CREATE TABLE user_preferences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,

  -- AI设置
  ai_provider VARCHAR(20) DEFAULT 'openai' CHECK (ai_provider IN ('openai', 'gemini', 'ollama')),
  ai_analysis_auto BOOLEAN DEFAULT true,

  -- UI偏好
  theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
  language VARCHAR(5) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'UTC',

  -- 通知设置
  email_notifications BOOLEAN DEFAULT false,
  reminder_frequency VARCHAR(10) DEFAULT 'none' CHECK (
    reminder_frequency IN ('none', 'daily', 'weekly', 'monthly')
  ),

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- AI Usage Tracking表 (用于成本控制)
CREATE TABLE ai_usage_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_id UUID REFERENCES journal_entries(id) ON DELETE CASCADE,

  -- AI调用详情
  ai_provider VARCHAR(20) NOT NULL,
  analysis_type VARCHAR(20) NOT NULL CHECK (
    analysis_type IN ('summary', 'emotions', 'suggestions', 'full')
  ),

  -- 成本追踪
  tokens_used INTEGER,
  cost_usd DECIMAL(10, 6),

  -- 执行详情
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT true,
  error_message TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
2. AI Emotions JSONB Schema
A standardized JSONB structure for ai_emotions ensures consistency and allows for validation:

SQL

-- AI情感分析的标准化JSONB结构
CREATE OR REPLACE FUNCTION validate_ai_emotions(emotions JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- 验证必需字段
  IF NOT (emotions ? 'sentiment' AND emotions ? 'confidence') THEN
    RETURN FALSE;
  END IF;

  -- 验证sentiment值
  IF NOT (emotions->>'sentiment' IN ('positive', 'neutral', 'negative')) THEN
    RETURN FALSE;
  END IF;

  -- 验证confidence范围
  IF (emotions->>'confidence')::float < 0 OR (emotions->>'confidence')::float > 1 THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 在journal_entries表上添加JSONB验证约束
ALTER TABLE journal_entries ADD CONSTRAINT valid_ai_emotions_format CHECK (ai_emotions IS NULL OR validate_ai_emotions(ai_emotions));
3. Indexes for Performance
To optimize query performance, the following indexes will be implemented:

SQL

-- 主要查询优化索引
CREATE INDEX idx_journal_entries_user_created ON journal_entries(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_journal_entries_content_hash ON journal_entries(content_hash) WHERE content_hash IS NOT NULL;
CREATE INDEX idx_journal_entries_ai_analysis ON journal_entries(user_id, ai_analyzed_at DESC) WHERE ai_analyzed_at IS NOT NULL;

-- JSONB索引用于情感查询
CREATE INDEX idx_journal_entries_emotions_sentiment ON journal_entries USING GIN ((ai_emotions->'sentiment'));
CREATE INDEX idx_journal_entries_emotions_tags ON journal_entries USING GIN ((ai_emotions->'tags'));

-- Full-text search索引
CREATE INDEX idx_journal_entries_content_search ON journal_entries USING GIN (to_tsvector('english', content));

-- 使用统计索引
CREATE INDEX idx_ai_usage_user_date ON ai_usage_logs(user_id, created_at DESC);
4. Row Level Security (RLS) Policies
RLS is crucial for data privacy and multi-tenancy. It will be enabled and configured for all user-specific tables:

SQL

-- 启用RLS
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Journal Entries的RLS策略
CREATE POLICY "Users can view own entries" ON journal_entries
  FOR SELECT USING (
    auth.uid() = user_id AND deleted_at IS NULL
  );
CREATE POLICY "Users can insert own entries" ON journal_entries
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
  );
CREATE POLICY "Users can update own entries" ON journal_entries
  FOR UPDATE USING (
    auth.uid() = user_id AND deleted_at IS NULL
  ) WITH CHECK (
    auth.uid() = user_id
  );
CREATE POLICY "Users can soft delete own entries" ON journal_entries
  FOR UPDATE USING (
    auth.uid() = user_id AND deleted_at IS NULL
  ) WITH CHECK (
    auth.uid() = user_id AND deleted_at IS NOT NULL
  );

-- User Preferences的RLS策略
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AI Usage Logs的RLS策略
CREATE POLICY "Users can view own usage" ON ai_usage_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert usage logs" ON ai_usage_logs
  FOR INSERT WITH CHECK (true); -- 允许系统插入
5. Database Functions & Triggers
Automated database functions and triggers will ensure data consistency and reduce application-level boilerplate:

SQL

-- 自动更新updated_at字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 应用到相关表
CREATE TRIGGER update_journal_entries_updated_at
  BEFORE UPDATE ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 自动计算字数的触发器
CREATE OR REPLACE FUNCTION calculate_word_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.word_count = array_length(string_to_array(trim(NEW.content), ' '), 1);
  NEW.content_hash = encode(digest(NEW.content, 'sha256'), 'hex');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_journal_word_count
  BEFORE INSERT OR UPDATE OF content ON journal_entries
  FOR EACH ROW EXECUTE FUNCTION calculate_word_count();

-- 初始化用户偏好的函数
CREATE OR REPLACE FUNCTION initialize_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 在用户创建时自动初始化偏好
CREATE TRIGGER initialize_preferences_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_preferences();
6. Supabase Real-time Features
Real-time capabilities will be enabled for key tables to provide live updates to the client:

SQL

-- 启用实时订阅
ALTER PUBLICATION supabase_realtime ADD TABLE journal_entries;
ALTER PUBLICATION supabase_realtime ADD TABLE user_preferences;
7. Data Migration Utilities
A utility function for migrating local data to the cloud database:

SQL

-- 数据迁移辅助函数
CREATE OR REPLACE FUNCTION migrate_localStorage_entry(
  p_user_id UUID,
  p_content TEXT,
  p_timestamp TIMESTAMP WITH TIME ZONE,
  p_ai_summary TEXT DEFAULT NULL,
  p_ai_emotions JSONB DEFAULT NULL,
  p_ai_suggestions TEXT DEFAULT NULL) RETURNS UUID AS $$
DECLARE
  entry_id UUID;
BEGIN
  INSERT INTO journal_entries (
    user_id, content, created_at, updated_at,
    ai_summary, ai_emotions, ai_suggestions,
    ai_analyzed_at
  ) VALUES (
    p_user_id, p_content, p_timestamp, p_timestamp,
    p_ai_summary, p_ai_emotions, p_ai_suggestions,
    CASE WHEN p_ai_summary IS NOT NULL THEN p_timestamp ELSE NULL END
  )
  ON CONFLICT (content_hash) DO UPDATE SET
    updated_at = EXCLUDED.updated_at
  RETURNING id INTO entry_id;

  RETURN entry_id;
END;
$$ LANGUAGE plpgsql;
8. Database Views for Analytics
Views provide aggregated data for insights and trends visualization:

SQL

-- 用户统计视图
CREATE VIEW user_journal_stats AS
SELECT
  u.id as user_id,
  u.email,
  COUNT(je.id) as total_entries,
  COUNT(CASE WHEN je.ai_analyzed_at IS NOT NULL THEN 1 END) as analyzed_entries,
  AVG(je.word_count) as avg_word_count,
  MIN(je.created_at) as first_entry_date,
  MAX(je.created_at) as last_entry_date
FROM auth.users u
LEFT JOIN journal_entries je ON u.id = je.user_id
WHERE je.deleted_at IS NULL
GROUP BY u.id, u.email;

-- 情感趋势视图
CREATE VIEW emotion_trends AS
SELECT
  user_id,
  DATE_TRUNC('week', created_at) as week,
  ai_emotions->>'sentiment' as sentiment,
  COUNT(*) as entry_count,
  AVG((ai_emotions->>'confidence')::float) as avg_confidence
FROM journal_entries
WHERE ai_emotions IS NOT NULL AND deleted_at IS NULL
GROUP BY user_id, week, sentiment
ORDER BY user_id, week DESC;
9. Backup and Maintenance
Functions for automated data cleanup:

SQL

-- 软删除清理函数（定期清理30天前的软删除记录）
CREATE OR REPLACE FUNCTION cleanup_soft_deleted_entries()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM journal_entries
  WHERE deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- AI使用日志清理（保留6个月数据）
CREATE OR REPLACE FUNCTION cleanup_old_usage_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM ai_usage_logs
  WHERE created_at < NOW() - INTERVAL '6 months';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;
10. Performance Monitoring
Views to aid in database performance monitoring:

SQL

-- 查询性能监控视图
CREATE VIEW slow_queries AS
SELECT
  query,
  calls,
  total_time,
  mean_time,
  rows
FROM pg_stat_statements
WHERE mean_time > 100  -- 超过100ms的查询
ORDER BY mean_time DESC;

-- 数据库大小监控
CREATE VIEW database_size_stats AS
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  pg_total_relation_size(schemaname||'.'||tablename) as bytes
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY bytes DESC;
Authentication
The Insight Journal application will leverage Supabase Auth as its primary identity and access management system. This provides a secure, scalable, and integrated solution for user registration, login, and session management, ensuring a seamless user experience while upholding data security and privacy.

Authentication Flow Overview
The authentication process is designed for a seamless user experience while ensuring robust security.

1. User Registration Flow
Registration Process:

Utilizes Next.js Server Actions for secure, server-side handling of user registration.

Performs both client-side and server-side validation of email, password, and password confirmation.

Integrates with supabase.auth.signUp to create new user accounts, including options for email redirection and custom user metadata.

Translates Supabase authentication errors into user-friendly messages.

Automatically initializes default user preferences upon successful registration or email confirmation.

TypeScript

// app/auth/register/actions.ts
'use server'
export async function registerAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  // 1. Client-side and Server-side Validation
  const validation = validateRegistrationInput(email, password, confirmPassword)
  if (!validation.success) {
    return { error: validation.error }
  }

  try {
    // 2. Supabase User Creation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          registration_source: 'web_app',
          registration_timestamp: new Date().toISOString()
        }
      }
    })

    if (error) {
      return { error: translateAuthError(error.message) }
    }

    // 3. Initialize User Data (if email confirmation not required)
    if (data.user && !data.user.email_confirmed_at) {
      return {
        success: true,
        message: 'Please check your email to confirm your account.',
        requiresConfirmation: true
      }
    }

    // 4. Auto-initialize user preferences
    if (data.user?.id) {
      await initializeUserProfile(data.user.id)
    }

    return {
      success: true,
      user: data.user,
      message: 'Account created successfully!'
    }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: 'Registration failed. Please try again.' }
  }
}
// User profile initialization
async function initializeUserProfile(userId: string) {
  // Create default user preferences
  await supabase.from('user_preferences').insert({
    user_id: userId,
    ai_provider: 'openai',
    theme: 'light',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    email_notifications: false
  })
}
Email Confirmation Handling:

A dedicated API Route (app/auth/callback/route.ts) handles email confirmation callbacks from Supabase.

It exchanges the confirmation code for a session and then initializes user-specific data (e.g., preferences) and checks for any pending local data migrations.

2. Login Flow
Standard Login Process:

Implemented via Next.js Server Actions (app/auth/login/actions.ts) for secure credential handling.

Includes input validation and leverages supabase.auth.signInWithPassword.

Supports a "remember me" option for longer session durations.

Logs failed login attempts for security monitoring and updates the user's last login timestamp upon success.

Checks for and flags any necessary data migration from local storage.

TypeScript

// app/auth/login/actions.ts
'use server'
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const remember = formData.get('remember') === 'on'

  // Input validation
  const validation = validateLoginInput(email, password)
  if (!validation.success) {
    return { error: validation.error }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        // Longer session for "remember me"
        ...(remember && {
          sessionTimeout: 60 * 60 * 24 * 30 // 30 days
        })
      }
    })

    if (error) {
      // Log failed login attempts for security monitoring
      await logSecurityEvent('failed_login', { email, ip: getClientIP() })
      return { error: translateAuthError(error.message) }
    }

    if (data.user) {
      // Update last login timestamp
      await updateUserLastLogin(data.user.id)

      // Check for data migration needs
      const migrationStatus = await checkMigrationStatus(data.user.id)

      return {
        success: true,
        user: data.user,
        migrationNeeded: migrationStatus.needsMigration
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return { error: 'Login failed. Please try again.' }
  }
}
Social Authentication (Future Enhancement):

The architecture accounts for future integration with OAuth providers (e.g., Google, GitHub) using supabase.auth.signInWithOAuth.

3. Session Management
JWT Token Handling:

Supabase issues JSON Web Tokens (JWTs) for authenticated sessions. These tokens are automatically managed by the Supabase client library.

A SessionManager class (lib/auth/session.ts) handles the initialization, automatic refreshing (e.g., 5 minutes before expiry), and validation of these tokens.

Session validation includes verifying JWT signature, claims (audience, expiration), and additional security checks (e.g., IP change detection).

TypeScript

// lib/auth/session.ts
export class SessionManager {
  private static instance: SessionManager
  private refreshTimer: NodeJS.Timeout | null = null

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager()
    }
    return SessionManager.instance
  }

  async initializeSession() {
    // Get initial session
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Session initialization error:', error)
      return null
    }

    if (session) {
      // Set up automatic token refresh
      this.setupTokenRefresh(session)

      // Validate session integrity
      const isValid = await this.validateSession(session)
      if (!isValid) {
        await this.signOut()
        return null
      }
    }

    return session
  }

  private setupTokenRefresh(session: Session) {
    // Calculate refresh time (refresh 5 minutes before expiry)
    const expiresAt = session.expires_at! * 1000
    const refreshAt = expiresAt - (5 * 60 * 1000)
    const timeUntilRefresh = refreshAt - Date.now()

    if (timeUntilRefresh > 0) {
      this.refreshTimer = setTimeout(async () => {
        await this.refreshSession()
      }, timeUntilRefresh)
    }
  }

  private async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('Token refresh failed:', error)
        await this.signOut()
        return
      }

      if (session) {
        this.setupTokenRefresh(session)
      }
    } catch (error) {
      console.error('Session refresh error:', error)
      await this.signOut()
    }
  }

  private async validateSession(session: Session): Promise<boolean> {
    try {
      // Verify JWT signature and claims
      const { data: user, error } = await supabase.auth.getUser(session.access_token)

      if (error || !user) {
        return false
      }

      // Additional security checks
      return this.performSecurityChecks(session, user.user)
    } catch (error) {
      console.error('Session validation error:', error)
      return false
    }
  }

  private async performSecurityChecks(session: Session, user: User): Promise<boolean> {
    // Check for suspicious activity
    const lastLogin = await getUserLastLogin(user.id)
    const currentIP = await getClientIP()

    // Implement IP change detection, unusual access patterns, etc.
    // For now, return true - implement based on security requirements
    return true
  }

  async signOut() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
      this.refreshTimer = null
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Sign out error:', error)
    }

    // Clear any cached data
    await this.clearUserData()
  }

  private async clearUserData() {
    // Clear sensitive data from stores
    // Reset application state
    // Clear any cached tokens or user info
  }
}
Auth State Management with Zustand:

A Zustand store (stores/authStore.ts) manages the global authentication state (user, session, loading status, authentication status).

It initializes the session, sets up listeners for onAuthStateChange events from Supabase, and dispatches actions to sign in, sign up, and sign out. This ensures that the UI always reflects the current authentication state.

TypeScript

// stores/authStore.ts
interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  isAuthenticated: boolean
  initialized: boolean
}
interface AuthActions {
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<AuthResult>
  signUp: (email: string, password: string) => Promise<AuthResult>
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
}
export const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  user: null,
  session: null,
  loading: true,
  isAuthenticated: false,
  initialized: false,

  initialize: async () => {
    set({ loading: true })

    const sessionManager = SessionManager.getInstance()
    const session = await sessionManager.initializeSession()

    set({
      session,
      user: session?.user || null,
      isAuthenticated: !!session?.user,
      loading: false,
      initialized: true
    })

    // Set up auth state change listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({
        session,
        user: session?.user || null,
        isAuthenticated: !!session?.user,
        loading: false
      })

      // Handle specific auth events
      switch (event) {
        case 'SIGNED_IN':
          await handleSignIn(session?.user)
          break
        case 'SIGNED_OUT':
          await handleSignOut()
          break
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed successfully')
          break
      }
    })
  },

  signIn: async (email: string, password: string) => {
    const result = await loginAction(new FormData())
    return result
  },

  signUp: async (email: string, password: string) => {
    const result = await registerAction(new FormData())
    return result
  },

  signOut: async () => {
    const sessionManager = SessionManager.getInstance()
    await sessionManager.signOut()
  },

  refreshSession: async () => {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    if (!error && session) {
      set({ session, user: session.user })
    }
  }
}))
4. Password Reset Flow
Password Reset Request:

A Server Action (app/auth/reset-password/actions.ts) handles requests for password resets.

It uses supabase.auth.resetPasswordForEmail to send a reset link to the user's email.

Security best practice: always returns a generic success message to prevent email enumeration.

TypeScript

// app/auth/reset-password/actions.ts
'use server'
export async function requestPasswordReset(email: string) {
  const validation = validateEmail(email)
  if (!validation.success) {
    return { error: validation.error }
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/confirm`
    })

    if (error) {
      // Don't reveal if email exists for security
      console.error('Password reset error:', error)
    }

    // Always return success to prevent email enumeration
    return {
      success: true,
      message: 'If an account with that email exists, you will receive a password reset link.'
    }
  } catch (error) {
    console.error('Password reset request error:', error)
    return { error: 'Password reset request failed. Please try again.' }
  }
}
Password Reset Confirmation:

A Server Action (app/auth/reset-password/confirm/actions.ts) handles the final step of password reset.

It validates the new password and calls supabase.auth.updateUser to set the new password for the authenticated session.

Logs successful password resets as security events.

TypeScript

// app/auth/reset-password/confirm/actions.ts
'use server'
export async function confirmPasswordReset(password: string, confirmPassword: string) {
  const validation = validatePasswordReset(password, confirmPassword)
  if (!validation.success) {
    return { error: validation.error }
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      return { error: translateAuthError(error.message) }
    }

    // Log successful password reset
    await logSecurityEvent('password_reset_success', {
      timestamp: new Date().toISOString()
    })

    return {
      success: true,
      message: 'Password updated successfully. You are now logged in.'
    }
  } catch (error) {
    console.error('Password reset confirmation error:', error)
    return { error: 'Password reset failed. Please try again.' }
  }
}
5. Row Level Security (RLS) Integration
RLS Policy Implementation:

RLS policies are defined directly in the PostgreSQL database (managed by Supabase) to ensure that users can only access and modify their own data.

Policies leverage auth.uid() (Supabase's function to get the current user's UUID from the JWT) and validate JWT claims (aud, exp) to prevent unauthorized access.

Strict policies are applied to journal_entries, user_preferences, and ai_usage_logs tables for SELECT, INSERT, UPDATE, and DELETE operations.

SQL

-- 基于JWT的用户识别
CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claim.sub', true),
    (current_setting('request.jwt.claims', true)::JSONB ->> 'sub')
  )::UUID
$$ LANGUAGE SQL STABLE;

-- 更严格的RLS策略 (example for journal_entries)
CREATE POLICY "Authenticated users can access own data" ON journal_entries
  FOR ALL USING (
    auth.uid() = user_id
    AND auth.jwt() ->> 'aud' = 'authenticated'
    AND (auth.jwt() ->> 'exp')::int > extract(epoch from now())
  );
-- ... other RLS policies
JWT Claims Validation:

Client-side and server-side logic validate JWT claims (e.g., sub, aud, exp) beyond what Supabase might implicitly handle, providing an additional layer of security.

TypeScript

// lib/auth/jwt.ts
export interface JWTClaims {
  sub: string        // User ID
  email: string      // User email
  aud: string        // Audience
  exp: number        // Expiration time
  iat: number        // Issued at
  iss: string        // Issuer
  role: string       // User role
}
export async function validateJWTClaims(token: string): Promise<boolean> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return false
    }

    // Additional JWT validation
    const payload = JSON.parse(atob(token.split('.')[1]))
    const claims = payload as JWTClaims

    // Verify standard claims
    if (claims.exp < Date.now() / 1000) {
      console.error('JWT expired')
      return false
    }

    if (claims.aud !== 'authenticated') {
      console.error('Invalid audience')
      return false
    }

    if (claims.sub !== user.id) {
      console.error('Subject mismatch')
      return false
    }

    return true
  } catch (error) {
    console.error('JWT validation error:', error)
    return false
  }
}
6. Security Considerations
Security Middleware:

Next.js middleware (middleware/security.ts) will be used to apply essential security headers (e.g., X-Content-Type-Options, X-Frame-Options, Content-Security-Policy (CSP)) to all responses, mitigating common web vulnerabilities like XSS and clickjacking.

TypeScript

// middleware/security.ts
export async function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()

  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CSP Header
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' [https://cdnjs.cloudflare.com](https://cdnjs.cloudflare.com)",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co [https://api.openai.com](https://api.openai.com)",
    "font-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')

  response.headers.set('Content-Security-Policy', csp)

  return response
}
Rate Limiting for Auth Endpoints:

Implemented to prevent brute-force attacks on login and registration endpoints. A checkAuthRateLimit utility tracks attempts per identifier (e.g., IP address or email) within a time window.

TypeScript

// lib/auth/rateLimit.ts
const authAttempts = new Map<string, { count: number; lastAttempt: number }>()
export async function checkAuthRateLimit(identifier: string): Promise<boolean> {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxAttempts = 5

  const attempts = authAttempts.get(identifier)

  if (!attempts) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now })
    return true
  }

  // Reset if window expired
  if (now - attempts.lastAttempt > windowMs) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now })
    return true
  }

  // Check if limit exceeded
  if (attempts.count >= maxAttempts) {
    return false
  }

  // Increment counter
  attempts.count++
  attempts.lastAttempt = now

  return true
}
Security Event Logging:

A logSecurityEvent utility function (lib/auth/security.ts) captures and logs critical security events (e.g., failed logins, password resets, suspicious activity). In production, these logs would be sent to an external security monitoring service.

TypeScript

// lib/auth/security.ts
interface SecurityEvent {
  event_type: string
  user_id?: string
  ip_address?: string
  user_agent?: string
  metadata?: Record<string, any>
  timestamp: string
}
export async function logSecurityEvent(
  eventType: string,
  metadata: Record<string, any> = {}) {
  const event: SecurityEvent = {
    event_type: eventType,
    ip_address: await getClientIP(),
    user_agent: await getClientUserAgent(),
    metadata,
    timestamp: new Date().toISOString()
  }

  // Log to external security monitoring service
  // For now, log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Security Event:', event)
  }

  // In production, send to monitoring service
  if (process.env.NODE_ENV === 'production') {
    await sendToSecurityMonitoring(event)
  }
}
7. Authentication Hooks and Utilities
Protected Route HOC:

A withAuth Higher-Order Component (components/auth/ProtectedRoute.tsx) wraps components that require authentication, automatically redirecting unauthenticated users to the login page.

TypeScript

// components/auth/ProtectedRoute.tsx
export function withAuth<P extends object>(
  Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, initialized } = useAuthStore()

    if (!initialized || loading) {
      return <AuthLoadingSpinner />
    }

    if (!user) {
      redirect('/auth/login')
    }

    return <Component {...props} />
  }
}
// Usage
// const ProtectedJournalPage = withAuth(JournalPage)
Auth Utilities:

A set of utility functions (lib/auth/utils.ts) provides common authentication-related functionalities:

translateAuthError: Maps generic Supabase errors to user-friendly messages.

validateEmail: Client-side email validation.

validatePassword: Client-side password strength validation (length, character types).

TypeScript

// lib/auth/utils.ts
export function translateAuthError(error: string): string {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Incorrect email or password',
    'Email not confirmed': 'Please check your email and confirm your account',
    'User already registered': 'An account with this email already exists',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long'
  }

  return errorMap[error] || 'An authentication error occurred'
}
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email) {
    return { success: false, error: 'Email is required' }
  }

  if (!emailRegex.test(email)) {
    return { success: false, error: 'Please enter a valid email address' }
  }

  return { success: true }
}
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { success: false, error: 'Password is required' }
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long' }
  }

  // Additional password strength requirements
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      success: false,
      error: 'Password must contain uppercase, lowercase, and numbers'
    }
  }

  return { success: true }
}
📚 Related Documentation
Product Requirements - Business requirements and features

User Stories - Detailed implementation stories

Development Guide - Setup and development instructions

External References
Next.js Documentation - Framework documentation

Tailwind CSS - Styling framework

OpenAI API - AI integration

Vercel Platform - Deployment platform