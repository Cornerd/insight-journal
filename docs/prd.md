1. # Product Requirements Document: Insight Journal – AI-Powered Daily Reflection Web App

   **Document Version:** 0.1
   **Date:** 2025-07-20
   **Author:** PM Agent

   ---

   ## 1. Goals and Background Context

   ### Goals

   * Provide users with a tool to systematically organize their daily thoughts and reflections.
   * Enable users to gain deeper self-awareness through AI-powered summaries and emotion analysis.
   * Offer intelligent insights and personalized suggestions to support emotional management and personal growth.
   * Showcase the developer's proficiency in front-end development and AI integration.

   ### Background Context

   Many individuals keep diaries or journals for self-reflection, but often struggle to derive actionable insights or identify long-term emotional patterns from their entries. Existing emotion diary applications frequently lack intelligent features, offering a dull experience without the benefit of deeper analysis. The "Insight Journal" project addresses these pain points by leveraging AI to transform raw journal entries into structured summaries, provide detailed emotion analysis, and generate personalized suggestions. This web application aims to enhance the user's self-awareness and emotional well-being by making daily reflection more insightful and engaging.

   ### Change Log

   | Date       | Version | Description   | Author |
   | :--------- | :------ | :------------ | :----- |
   | 2025-07-20 | 0.1     | Initial Draft | PM     |

   ---

   ## 2. Requirements

   ### 2.1 Functional Requirements (FR)

   * **FR1: Daily Note Editor:** Users must be able to input and edit daily notes using a rich text/Markdown editor.
   * **FR2: AI Summary Generation:** The system shall utilize the OpenAI API to automatically generate concise summaries of user notes.
   * **FR3: Emotion Analysis:** The system shall analyze the text of user notes to determine emotional sentiment and provide relevant emotion tags.
   * **FR4: Suggestion Generation:** The AI shall generate personalized suggestions based on the note's content and emotional analysis, such as improvement advice or psychological support messages.
   * **FR5: Local Data Storage:** All user notes, AI summaries, emotion analysis, and suggestions must be saved locally using `localStorage`.
   * **FR6: Responsive Design:** The application's user interface must adapt and be fully functional across various devices, including mobile phones and desktop browsers.

   ### 2.2 Non-Functional Requirements (NFR)

   * **NFR1: OpenAI API Usage:** The application will rely on the OpenAI API for AI-powered features (summary, emotion analysis, suggestions).
   * **NFR2: Performance (AI Response Time):** AI analysis and suggestion generation should provide responses in a timely manner, aiming for a smooth user experience.
   * **NFR3: Data Privacy (Local Storage):** User data will be stored locally in the browser's `localStorage` for the MVP. (Note: A future phase will involve cloud storage for enhanced data persistence and multi-device access.)
   * **NFR4: Scalability (Future Consideration):** While MVP uses `localStorage`, future iterations should consider scalable database solutions (e.g., Firebase/Supabase).
   * **NFR5: Maintainability:** The codebase should be structured for easy maintenance and future enhancements, adhering to modern front-end best practices.
   * **NFR6: Security (API Key Handling):** The application should prompt users to configure their OpenAI API key securely (e.g., via environment variables in a deployed version, or direct input for local testing).
   * **NFR7: UI Performance:** The UI should be smooth and responsive, with light animations, especially during AI processing.
   * **NFR8: Accessibility (Basic):** The application should aim for basic web accessibility, ensuring usability for a broad range of users.

   ---

   ## 3. User Interface Design Goals

   This section captures the high-level UI/UX vision to guide the Design Architect and inform story creation. It is not a detailed UI specification but focuses on product vision and user goals.

   ### Overall UX Vision
   The overall user experience vision for Insight Journal is to provide a calm, intuitive, and supportive environment for daily reflection. The interface should feel personal and empathetic, encouraging consistent engagement and fostering a sense of well-being through thoughtful design and subtle interactions.

   ### Key Interaction Paradigms
   * **Effortless Journaling:** A clean and distraction-free interface for text input, promoting a seamless writing experience.
   * **Instant Insights:** Immediate feedback from AI analysis displayed clearly and concisely after journal submission.
   * **Intuitive Navigation:** Simple routing between the core journaling page and future historical views.
   * **Visual Feedback:** Use of subtle animations (e.g., during loading/analysis) and visual cues (e.g., emotion icons, color schemes) to enhance user understanding and engagement.

   ### Core Screens and Views
   From a product perspective, the most critical screens or views necessary to deliver the Insight Journal's values and goals are:

   * **Journaling Page (`/journal`):** The primary interface for users to write their daily notes, trigger AI analysis, and view the AI-generated summary, emotion analysis, and suggestions.
   * **Home Page (`/`):** An introductory page with a brief overview of the app's benefits and a clear Call to Action (CTA) to start journaling.

   ### Accessibility: None
   *Assumption: For MVP, basic accessibility best practices will be followed, but no specific WCAG compliance level (AA or AAA) is targeted.*

   ### Branding
   The branding should evoke a sense of calm and introspection.
   * **Color Palette:** Use soft color schemes, such as greens and blues, to create a meditative atmosphere.
   * **Animations:** Incorporate light animations, potentially using `framer-motion` for transitions and loading states, to provide a polished and responsive feel.
   * **Visual Cues:** Utilize emojis or simple graphical visualizations for daily emotion icons.

   ### Target Device and Platforms: Web Responsive
   The application is primarily targeted as a web responsive application, ensuring a consistent and functional experience across desktop browsers and mobile devices.

   ---

   ## 4. Technical Assumptions

   This section gathers technical decisions that will guide the Architect. These choices become constraints for the Architect; therefore, it's crucial for them to be specific and complete.

   ### Repository Structure: Polyrepo
   * **Rationale:** Given the clear separation between a web application (frontend) and potentially a future backend API (though not in MVP), a Polyrepo structure is assumed to allow for independent deployment and development of different services. For the MVP, it will primarily contain the Next.js project.

   ### Service Architecture: Monolith (Frontend Application)
   * **Rationale:** The MVP is a self-contained frontend web application using `localStorage` for data persistence. This aligns with a monolithic frontend application architecture, simplifying initial deployment and development. Future phases might introduce separate backend services, but for MVP, it's a single deployable unit.

   ### Testing Requirements: Unit + Integration
   * **Rationale:** To ensure the stability and correctness of the application, Unit Tests will cover individual components and functions, and Integration Tests will verify the interaction between different parts of the frontend application and API integrations (e.g., OpenAI API calls). This provides a good balance for MVP quality assurance.

   ### Additional Technical Assumptions and Requests

   * **Frontend Framework:** React with Next.js will be used for the main frontend development.
   * **Styling Framework:** Tailwind CSS for rapid and consistent UI development.
   * **AI Integration:** OpenAI API will be used for all AI-powered features (summary, emotion analysis, suggestions). User's own API key will be required.
   * **State Management:** Zustand is a recommended choice for lightweight global state management within the frontend application.
   * **Animations:** `framer-motion` is suggested for handling animations, particularly during AI analysis loading states, to enhance user experience.
   * **Deployment Target:** Vercel is a strong candidate for deployment given the Next.js choice and ease of continuous deployment.
   * **Data Persistence:** `localStorage` will be the primary method for data storage in the MVP, with a clear understanding that this is a temporary solution for local data.
   * **Future Data Persistence:** Firebase/Supabase are noted as potential solutions for future cloud-based user authentication and data storage.
   * **Markdown Editor:** A suitable Markdown editor library will be integrated to support rich text/Markdown input for notes.
   * **Charting Library (Future):** For future data analysis features, `echarts`, `Recharts`, `Chart.js`, or `D3.js` are noted as potential charting libraries.
   * **Internationalization (Future):** `i18n` is noted for future multi-language support.

   ---

   ## 5. Epic List

   Below is a high-level list of all epics for the MVP of Insight Journal, along with their primary goals. This allows for a review of the overall project structure before detailing individual stories.

   * **Epic 0: Project Setup & Infrastructure**
       * **Goal:** Establish the foundational technical stack, environment configurations, and deployment pipeline, along with essential development tools and a reusable UI structure. This epic ensures the project is set up for efficient development and deployment.
       * **Includes:**
           * Initialize Next.js + Tailwind CSS project
           * Setup ESLint, Prettier, Husky (optional)
           * Setup `.env` & configure OpenAI key handling
           * Setup deployment to Vercel

   * **Epic 1: Core Journaling Experience**
       * **Goal:** Enable users to write, save, display, and manage their daily notes locally, providing the essential journaling functionality and a responsive interface.
       * **Includes:**
           * Journaling UI with markdown editor or textarea
           * Save entry to `localStorage`
           * Display saved entries in a list view (journal history)
           * Edit/update/delete existing journal entries
           * Responsive layout for mobile and desktop

   * **Epic 2: AI-Powered Insights & Analysis**
       * **Goal:** Integrate the OpenAI API to automatically generate summaries, perform emotion analysis, and provide personalized suggestions for journal entries, delivering the core AI value proposition.
       * **Includes:**
           * Integrate OpenAI API (GPT 3.5/4)
           * Prompt engineering for summary generation
           * Emotion classification (e.g., positive/neutral/negative)
           * Personalized suggestions based on emotion
           * Implement loading states & error handling for AI requests

   * **Epic 3 (Future): User Authentication & Cloud Storage**
       * **Goal:** Enable users to securely save and access their journal entries across multiple devices through user authentication and cloud-based data storage, addressing long-term data persistence and multi-device access.
       * **Includes:**
           * GitHub/Google login integration (e.g., with NextAuth.js)
           * Store journals in Firebase/Supabase
           * Implement user-specific journal access control

   ---

   ## 6. Epic Details

   ### Epic 0: Project Setup & Infrastructure

   **Goal:** Establish the foundational technical stack, environment configurations, and deployment pipeline, along with essential development tools and a reusable UI structure. This epic ensures the project is set up for efficient development and deployment, providing a solid base for all subsequent development.

   ### Story 0.1: Initialize Next.js Project with Tailwind CSS

   As a **developer**,
   I want to **initialize a new Next.js project and integrate Tailwind CSS**,
   so that I have a modern, efficient, and well-structured frontend development environment.

   **Acceptance Criteria:**
   1.  **0.1.1:** A new Next.js project is successfully created using the official `create-next-app` command or equivalent.
   2.  **0.1.2:** Tailwind CSS is correctly configured and integrated into the Next.js project, allowing for utility-first styling.
   3.  **0.1.3:** The project runs locally without errors.
   4.  **0.1.4:** Basic Tailwind CSS classes are verifiable (e.g., changing background color of a simple element).
   5.  **0.1.5:** Unnecessary boilerplate files are removed, and a clean project structure is established.

   ### Story 0.2: Configure Development Tools (ESLint, Prettier, Husky)

   As a **developer**,
   I want to **configure ESLint, Prettier, and Husky**,
   so that code quality, consistency, and pre-commit checks are enforced, leading to a more maintainable codebase.

   **Acceptance Criteria:**
   1.  **0.2.1:** ESLint is configured with a recommended set of rules for Next.js and React, and is integrated into the development workflow.
   2.  **0.2.2:** Prettier is configured for automatic code formatting, ensuring consistent style across the project.
   3.  **0.2.3:** ESLint and Prettier work in conjunction without conflicts.
   4.  **0.2.4:** Husky (or an equivalent pre-commit hook tool) is installed and configured to run ESLint and Prettier checks before committing code.
   5.  **0.2.5:** A `.editorconfig` file is present to ensure consistent editor settings.

   ### Story 0.3: Implement Environment Variable Handling for OpenAI API Key

   As a **developer**,
   I want to **set up environment variable handling for the OpenAI API key**,
   so that sensitive credentials are kept out of the codebase and can be easily managed for different environments (development, production).

   **Acceptance Criteria:**
   1.  **0.3.1:** A `.env.local` file is created for local development environment variables.
   2.  **0.3.2:** An `.env.example` file is created in the root directory, clearly documenting the required environment variables (e.g., `OPENAI_API_KEY`).
   3.  **0.3.3:** The application can successfully read an environment variable (e.g., `process.env.OPENAI_API_KEY`) when running locally.
   4.  **0.3.4:** The `.env.local` file is added to `.gitignore` to prevent accidental commits of sensitive information.

   ### Story 0.4: Setup Vercel Deployment

   As a **developer**,
   I want to **configure the project for automated deployment to Vercel**,
   so that changes pushed to the main branch are automatically built and deployed, enabling continuous delivery.

   **Acceptance Criteria:**
   1.  **0.4.1:** The project is configured to deploy correctly on Vercel.
   2.  **0.4.2:** A basic "Hello World" or initial landing page is successfully deployed to a Vercel URL.
   3.  **0.4.3:** Environment variables (specifically `OPENAI_API_KEY`) can be securely configured in Vercel's project settings.
   4.  **0.4.4:** Subsequent commits to the main branch trigger new successful deployments on Vercel.

   ### Epic 1: Core Journaling Experience

   **Goal:** Enable users to write, save, display, and manage their daily notes locally, providing the essential journaling functionality and a responsive interface. This epic delivers the core value of journaling to the user before AI enhancements.

   ### Story 1.1: Implement Journaling Page UI and Markdown Editor

   As a **user**,
   I want to **access a dedicated journaling page with a markdown-enabled text editor**,
   so that I can easily write and format my daily reflections.

   **Acceptance Criteria:**
   1.  **1.1.1:** A new page accessible via the `/journal` route is created.
   2.  **1.1.2:** The `/journal` page displays a prominent, multi-line text input area suitable for writing journal entries.
   3.  **1.1.3:** The text input area supports basic Markdown formatting (e.g., bold, italics, headings).
   4.  **1.1.4:** The page includes a clear "Save" button to submit the journal entry.
   5.  **1.1.5:** The UI is responsive, adapting well to both mobile and desktop screen sizes.

   ### Story 1.2: Save Journal Entry to Local Storage

   As a **user**,
   I want to **save my written journal entry locally**,
   so that my thoughts are preserved even after closing the browser.

   **Acceptance Criteria:**
   1.  **1.2.1:** When the "Save" button is clicked, the content of the journal entry is stored in the browser's `localStorage`.
   2.  **1.2.2:** Each journal entry stored in `localStorage` includes a unique identifier and a timestamp (date/time of creation/last update).
   3.  **1.2.3:** A success message or visual confirmation is displayed to the user upon successful saving.
   4.  **1.2.4:** The saved entry can be retrieved from `localStorage` in a subsequent session.

   ### Story 1.3: Display Saved Journal Entries as a History List

   As a **user**,
   I want to **view a list of my previously saved journal entries**,
   so that I can easily browse my past reflections.

   **Acceptance Criteria:**
   1.  **1.3.1:** A dedicated section or component on the `/journal` page displays a list of all saved journal entries.
   2.  **1.3.2:** Each item in the list clearly shows the date/time of the entry.
   3.  **1.3.3:** Clicking on a list item navigates the user to view the full content of that specific journal entry.
   4.  **1.3.4:** The list is ordered chronologically (e.g., newest entry first).

   ### Story 1.4: Edit and Update Existing Journal Entries

   As a **user**,
   I want to **edit and update my existing journal entries**,
   so that I can refine my thoughts or correct mistakes after saving them.

   **Acceptance Criteria:**
   1.  **1.4.1:** When a user views a past journal entry, an "Edit" button or similar mechanism is available.
   2.  **1.4.2:** Clicking "Edit" populates the journal editor with the content of the selected entry.
   3.  **1.4.3:** After modifying the content, clicking "Save" updates the corresponding entry in `localStorage` with the new content and an updated timestamp.
   4.  **1.4.4:** A success message or visual confirmation is displayed upon successful update.

   ### Story 1.5: Delete Existing Journal Entries

   As a **user**,
   I want to **delete existing journal entries**,
   so that I can remove unwanted or irrelevant reflections from my history.

   **Acceptance Criteria:**
   1.  **1.5.1:** An option (e.g., a "Delete" button or icon) is available for each entry in the journal history list or when viewing an individual entry.
   2.  **1.5.2:** Clicking "Delete" prompts the user for confirmation before permanent deletion.
   3.  **1.5.3:** Upon confirmation, the selected journal entry is permanently removed from `localStorage`.
   4.  **1.5.4:** The journal history list automatically updates to reflect the deletion.

   ### Epic 2: AI-Powered Insights & Analysis

   **Goal:** Integrate the OpenAI API to automatically generate summaries, perform emotion analysis, and provide personalized suggestions for journal entries, delivering the core AI value proposition to the user.

   ### Story 2.1: Integrate OpenAI API Client

   As a **developer**,
   I want to **integrate the OpenAI API client into the Next.js application**,
   so that I can make requests to OpenAI's models for AI-powered features.

   **Acceptance Criteria:**
   1.  **2.1.1:** The OpenAI client library (e.g., `openai` npm package) is installed and configured in the Next.js project.
   2.  **2.1.2:** A utility function or service is created to securely make authenticated calls to the OpenAI API using the environment variable `OPENAI_API_KEY`.
   3.  **2.1.3:** A basic test call to a simple OpenAI endpoint (e.g., a "hello world" text completion) can be successfully made from the application's backend (e.g., an API route).
   4.  **2.1.4:** Error handling for API requests (e.g., network errors, API rate limits, invalid keys) is implemented.

   ### Story 2.2: Implement Journal Entry Summarization with AI

   As a **user**,
   I want to **receive an AI-generated summary of my journal entry**,
   so that I can quickly grasp the main points of my reflections without re-reading the entire text.

   **Acceptance Criteria:**
   1.  **2.2.1:** When a journal entry is saved or viewed, a request is made to the OpenAI API to generate a concise summary.
   2.  **2.2.2:** A carefully crafted prompt is used to guide the AI in generating a relevant and accurate summary.
   3.  **2.2.3:** The generated summary is displayed clearly on the journal entry view page.
   4.  **2.2.4:** A loading indicator is shown while the AI summary is being generated.
   5.  **2.2.5:** The summary is saved along with the journal entry in `localStorage`.

   ### Story 2.3: Implement Emotion Analysis with AI

   As a **user**,
   I want to **see an AI-generated emotion analysis of my journal entry**,
   so that I can understand the prevailing sentiment and emotional themes within my writing.

   **Acceptance Criteria:**
   1.  **2.3.1:** Following summarization, a request is made to the OpenAI API to analyze the sentiment of the journal entry (e.g., positive, neutral, negative).
   2.  **2.3.2:** The AI output includes not only sentiment but also relevant emotion tags (e.g., "joy," "sadness," "anxiety," "calm").
   3.  **2.3.3:** The identified sentiment and emotion tags are prominently displayed on the journal entry view page, possibly using visual cues like emojis or color coding.
   4.  **2.3.4:** The emotion analysis results (sentiment and tags) are saved along with the journal entry in `localStorage`.
   5.  **2.3.5:** Prompt engineering is applied to ensure accurate and nuanced emotion detection from the AI.

   ### Story 2.4: Generate Personalized Suggestions with AI

   As a **user**,
   I want to **receive personalized suggestions based on my journal entry and emotional state**,
   so that I can gain actionable insights and support for my personal growth and well-being.

   **Acceptance Criteria:**
   1.  **2.4.1:** After summarization and emotion analysis, a final request is made to the OpenAI API to generate tailored suggestions.
   2.  **2.4.2:** The prompt for suggestions incorporates the summary, emotional analysis, and potentially a user's identified pain points or goals (if available from the entry).
   3.  **2.4.3:** Suggestions are practical, supportive, and relevant to the journal entry's content and identified emotions (e.g., stress reduction tips, mindfulness exercises, positive affirmations).
   4.  **2.4.4:** The AI-generated suggestions are displayed clearly on the journal entry view page.
   5.  **2.4.5:** The generated suggestions are saved along with the journal entry in `localStorage`.

   ### Story 2.5: Implement AI Processing Loading States and Error Handling

   As a **user**,
   I want to **see clear indications when AI processing is underway or encounters an error**,
   so that I understand the system's state and can react appropriately.

   **Acceptance Criteria:**
   1.  **2.5.1:** A visual loading indicator (e.g., spinner, progress bar) is displayed when an API request to OpenAI is in progress.
   2.  **2.5.2:** Appropriate error messages are displayed to the user if an OpenAI API request fails (e.g., "Failed to generate summary. Please try again later.").
   3.  **2.5.3:** The application handles different types of API errors gracefully (e.g., network issues, invalid API key, rate limits).
   4.  **2.5.4:** Users are guided on how to resolve common issues (e.g., "Check your OpenAI API key settings").
   5.  **2.5.5:** The loading indicator is cleared once the AI response is received or an error occurs.

   ---

   ## 7. Checklist Results Report

   *(This section will be populated after running the PM Checklist.)*

   ---

   ## 8. Next Steps

   ### Prompt for UX Expert (if applicable)

   *(This section will be populated based on the UX Design Goals after the checklist.)*

   ### Prompt for Architect

   *(This section will be populated based on the Technical Assumptions and Epic Details after the checklist.)*