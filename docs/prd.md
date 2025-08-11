1. # Product Requirements Document: Insight Journal – AI-Powered Daily Reflection Web App

   **Document Version:** 0.3
   **Date:** 2025-08-04
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
   | 2025-07-29 | 0.2     | AI Analysis Enhancements | PM     |
   | 2025-08-04 | 0.3     | Cloud Storage, Authentication & Data Migration Features | PM     |

   ---

   ## 【未审批】已实现但未经产品审批的功能

   > ⚠️ **重要提醒**: 以下功能已在代码中实现，但未经过正式的产品需求审批流程。这些功能偏离了原始PRD的范围，需要产品团队进行正式评估和决策。

   ### 【未审批】数据迁移系统
   - **功能描述**: 完整的本地数据到云端迁移工具，支持localStorage到Supabase的批量数据同步
   - **实现范围**:
     - 迁移API端点 (`/api/migrate-local-data`)
     - 迁移UI组件 (`DataMigration.tsx`)
     - 重复检测和ID映射机制
     - 迁移进度跟踪和错误处理
   - **偏离原因**: 原PRD仅提及"未来考虑云存储"，但未定义具体的迁移策略
   - **影响评估**:
     - 正面: 用户数据无缝迁移，提升用户体验
     - 风险: 数据丢失风险、复杂的状态管理、用户困惑
   - **产品决策需求**: 是否需要迁移工具？迁移时机和用户引导策略？

   ### 【未审批】本地数据清理功能
   - **功能描述**: 迁移完成后自动清理本地存储数据，释放浏览器存储空间
   - **实现范围**:
     - 清理资格验证（24小时内迁移验证）
     - 安全删除机制和确认流程
     - 清理结果反馈和错误处理
   - **偏离原因**: 原PRD未涉及本地数据生命周期管理
   - **影响评估**:
     - 正面: 优化存储空间，避免数据冗余
     - 风险: 意外数据删除、离线访问能力丧失
   - **产品决策需求**: 清理策略、用户控制权限、数据恢复机制

   ### 【未审批】AI分析状态可视化系统
   - **功能描述**: 日记条目的AI分析状态实时显示，区分已分析和未分析条目
   - **实现范围**:
     - 状态图标系统（绿色勾号/灰色灯泡）
     - 视觉状态指示器组件
     - 分析状态持久化
   - **偏离原因**: 原PRD关注AI功能本身，未考虑状态可视化需求
   - **影响评估**:
     - 正面: 提升用户对AI功能的认知和控制感
     - 风险: UI复杂度增加、用户期望管理挑战
   - **产品决策需求**: 状态显示的必要性、UI设计规范、用户教育策略

   ### 【未审批】混合存储架构
   - **功能描述**: 基于用户认证状态的智能存储切换（已登录=云存储，未登录=本地存储）
   - **实现范围**:
     - NextAuth集成的完整认证流程
     - Supabase云存储服务层
     - 存储策略自动切换逻辑
     - RLS安全策略和用户数据隔离
   - **偏离原因**: 原PRD定义为"MVP使用localStorage，未来考虑云存储"，但实际实现了完整的混合方案
   - **影响评估**:
     - 正面: 灵活的存储策略，支持多种用户场景
     - 风险: 架构复杂度显著增加、状态管理挑战、供应商依赖
   - **产品决策需求**: 存储策略定位、成本效益分析、技术债务评估

   ### 【未审批】云端CRUD操作完整实现
   - **功能描述**: 完整的云端日记条目管理系统，包括创建、读取、更新、删除操作
   - **实现范围**:
     - RESTful API端点 (`/api/journal/entries/*`)
     - 云存储服务抽象层
     - 数据同步和冲突解决
     - AI分析结果云端存储
   - **偏离原因**: 原PRD未定义云端操作的具体实现范围
   - **影响评估**:
     - 正面: 完整的云端功能，支持多设备同步
     - 风险: 开发复杂度、维护成本、数据一致性挑战
   - **产品决策需求**: 云端功能的优先级、MVP范围重新定义

   ### 产品团队待办事项
   1. **紧急**: 评估已实现功能与产品愿景的一致性
   2. **高优先级**: 制定功能保留/移除的决策标准
   3. **中优先级**: 更新PRD以反映最终的产品范围
   4. **低优先级**: 建立功能变更的审批流程，防止未来偏离

   ---

   ## 2. Requirements

   ### 2.1 Functional Requirements (FR)

   * **FR1: Daily Note Editor:** Users must be able to input and edit daily notes using a rich text/Markdown editor.
   * **FR2: AI Summary Generation:** The system shall utilize the OpenAI API to automatically generate concise summaries of user notes.
   * **FR3: Emotion Analysis:** The system shall analyze the text of user notes to determine emotional sentiment and provide relevant emotion tags.
   * **FR4: Suggestion Generation:** The AI shall generate personalized suggestions based on the note's content and emotional analysis, such as improvement advice or psychological support messages.
   * **FR5: Local Data Storage:** All user notes, AI summaries, emotion analysis, and suggestions must be saved locally using `localStorage`.
   * **FR6: Responsive Design:** The application's user interface must adapt and be fully functional across various devices, including mobile phones and desktop browsers.
   * **FR7: Smart Caching System:** The system shall implement intelligent caching to avoid redundant AI analysis requests, detecting content changes and reusing existing analysis when appropriate.
   * **FR8: Manual Re-analysis:** Users must be able to manually trigger re-analysis of their journal entries to get updated insights based on current content.
   * **FR9: Error Recovery:** The system shall provide comprehensive error handling with user-friendly messages and recovery options for AI service failures.
   * **FR10: User Authentication:** The system shall support OAuth authentication via GitHub and Google providers using NextAuth.js for secure user identification.
   * **FR11: Cloud Data Storage:** The system shall provide cloud-based data persistence using Supabase PostgreSQL database for journal entries and AI analysis results.
   * **FR12: Data Migration:** The system shall automatically detect and migrate existing localStorage data to cloud storage upon user authentication, preserving all content and AI analysis.
   * **FR13: AI Analysis Status Visualization:** The system shall display clear visual indicators on journal entries showing whether AI analysis has been completed or is pending.
   * **FR14: Local Data Cleanup:** The system shall provide users with the ability to safely remove local data after successful cloud migration to free up storage space.
   * **FR15: Offline-Online Synchronization:** The system shall support both offline writing (localStorage) and online cloud storage, with seamless data synchronization capabilities.

   ### 2.2 Non-Functional Requirements (NFR)

   * **NFR1: OpenAI API Usage:** The application will rely on the OpenAI API for AI-powered features (summary, emotion analysis, suggestions).
   * **NFR2: Performance (AI Response Time):** AI analysis and suggestion generation should provide responses in a timely manner, aiming for a smooth user experience.
   * **NFR3: Data Privacy (Local Storage):** User data will be stored locally in the browser's `localStorage` for the MVP. (Note: A future phase will involve cloud storage for enhanced data persistence and multi-device access.)
   * **NFR4: Scalability (Future Consideration):** While MVP uses `localStorage`, future iterations should consider scalable database solutions (e.g., Firebase/Supabase).
   * **NFR5: Maintainability:** The codebase should be structured for easy maintenance and future enhancements, adhering to modern front-end best practices.
   * **NFR6: Security (API Key Handling):** The application should prompt users to configure their OpenAI API key securely (e.g., via environment variables in a deployed version, or direct input for local testing).
   * **NFR7: UI Performance:** The UI should be smooth and responsive, with light animations, especially during AI processing.
   * **NFR8: Accessibility (Basic):** The application should aim for basic web accessibility, ensuring usability for a broad range of users.
   * **NFR9: Token Optimization:** The application should minimize OpenAI API token usage through intelligent caching and content change detection to reduce costs.
   * **NFR10: Real-time State Management:** The application should provide real-time feedback on AI analysis status with proper loading states and progress indicators.
   * **NFR11: Data Persistence:** AI analysis results should be automatically saved and persist across browser sessions without user intervention.
   * **NFR12: Authentication Security:** OAuth authentication should use secure token handling with deterministic UUID generation for consistent user identification across sessions.
   * **NFR13: Data Migration Safety:** Data migration processes should include conflict detection, duplicate prevention, and rollback capabilities to ensure data integrity.
   * **NFR14: Cloud Storage Performance:** Cloud storage operations should be optimized with proper indexing, caching, and connection pooling for responsive user experience.
   * **NFR15: Cross-Device Compatibility:** The application should maintain data consistency and synchronization across multiple devices when users are authenticated.
   * **NFR16: Migration Tracking:** The system should maintain detailed logs of data migration operations for debugging and user transparency.

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
   * **Authentication Pages (`/auth/signin`, `/auth/signup`):** Secure OAuth login/signup interfaces supporting GitHub and Google authentication providers.
   * **Migration Page (`/migrate`):** Data migration interface allowing users to transfer localStorage data to cloud storage with progress tracking and conflict resolution.
   * **Test Pages (`/test-login`, `/test-cloud-journal`):** Development and testing interfaces for authentication and cloud storage functionality verification.

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
   * **Cloud Data Persistence:** Supabase PostgreSQL database implemented for production cloud storage with user authentication and data synchronization.
   * **Authentication System:** NextAuth.js implemented with OAuth providers (GitHub, Google) for secure user authentication and session management.
   * **Data Migration System:** Automated migration tools implemented to transfer localStorage data to cloud storage with conflict detection and resolution.
   * **Markdown Editor:** A suitable Markdown editor library will be integrated to support rich text/Markdown input for notes.
   * **Charting Library (Future):** For future data analysis features, `echarts`, `Recharts`, `Chart.js`, or `D3.js` are noted as potential charting libraries.
   * **Internationalization (Future):** `i18n` is noted for future multi-language support.
   * **AI Provider Support:** The system will support multiple AI providers (OpenAI, Gemini, Ollama) with configurable switching and fallback mechanisms.
   * **Content Change Detection:** Intelligent algorithms will detect significant content changes to determine when re-analysis is needed.
   * **Debug and Monitoring:** Comprehensive logging and debug panels will be implemented for development and troubleshooting.

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
       * **Goal:** Integrate multiple AI providers to automatically generate summaries, perform emotion analysis, and provide personalized suggestions for journal entries, with intelligent caching and user control features.
       * **Includes:**
           * Integrate multiple AI providers (OpenAI, Gemini, Ollama)
           * Prompt engineering for summary generation
           * Emotion classification with detailed emotion tags
           * Personalized suggestions based on emotion and content
           * Implement loading states & comprehensive error handling
           * Smart caching system with content change detection
           * Manual re-analysis functionality
           * Real-time status indicators and debug panels

   * **Epic 3: User Authentication & Cloud Storage**
       * **Goal:** Enable users to securely save and access their journal entries across multiple devices through user authentication and cloud-based data storage, addressing long-term data persistence and multi-device access.
       * **Includes:**
           * User authentication with multiple providers (GitHub, Google, Email)
           * Cloud data storage with Supabase integration
           * Data migration from localStorage to cloud storage
           * User-specific journal access control and privacy
           * Multi-device synchronization and conflict resolution
           * Account management and user preferences

   * **Epic 4: Data Migration & Synchronization**
       * **Goal:** Provide seamless data migration capabilities and synchronization between local and cloud storage, ensuring users never lose their journal data when transitioning to cloud storage.
       * **Includes:**
           * Automatic detection of localStorage data
           * Smart migration with duplicate prevention
           * Migration progress tracking and error handling
           * Local data cleanup after successful migration
           * AI analysis status visualization and management
           * Conflict resolution for overlapping data

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

   ### Story 2.6: Implement Smart Caching System

   As a **user**,
   I want to **avoid waiting for AI analysis when my content hasn't significantly changed**,
   so that I can quickly access my insights without unnecessary delays or costs.

   **Acceptance Criteria:**
   1.  **2.6.1:** The system automatically detects when journal content has changed significantly (>50 characters or >20% change).
   2.  **2.6.2:** Previously generated AI analysis is cached and reused when content changes are minimal.
   3.  **2.6.3:** Cached analysis results are automatically loaded when opening existing journal entries.
   4.  **2.6.4:** The system handles different analysis types (summary, emotion, full) with appropriate compatibility checking.
   5.  **2.6.5:** Cache data persists across browser sessions using localStorage.

   ### Story 2.7: Implement Manual Re-analysis Functionality

   As a **user**,
   I want to **manually trigger re-analysis of my journal entries**,
   so that I can get updated insights when I've made significant changes or want fresh perspectives.

   **Acceptance Criteria:**
   1.  **2.7.1:** A "Re-analyze" button is prominently displayed when viewing journal entries with existing AI analysis.
   2.  **2.7.2:** Clicking the re-analyze button clears existing analysis and triggers a fresh AI request.
   3.  **2.7.3:** The button includes appropriate visual feedback (cursor pointer, hover effects).
   4.  **2.7.4:** New analysis results replace the previous ones and are saved to localStorage.
   5.  **2.7.5:** The button is disabled during analysis to prevent multiple simultaneous requests.

   ### Story 2.8: Implement Multiple AI Provider Support

   As a **user**,
   I want to **have access to different AI providers for analysis**,
   so that I can choose the best service for my needs and have fallback options.

   **Acceptance Criteria:**
   1.  **2.8.1:** The system supports OpenAI, Google Gemini, and Ollama (local) AI providers.
   2.  **2.8.2:** Users can configure their preferred AI provider through environment variables or settings.
   3.  **2.8.3:** Each provider has optimized prompts and response parsing for consistent output format.
   4.  **2.8.4:** Error handling is provider-specific with appropriate user guidance.
   5.  **2.8.5:** The system gracefully handles provider-specific limitations and features.

   ### Epic 3: User Authentication & Cloud Storage

   **Goal:** Enable users to securely save and access their journal entries across multiple devices through user authentication and cloud-based data storage, addressing long-term data persistence and multi-device access.

   ### Story 3.1: Implement User Authentication System

   As a **user**,
   I want to **create an account and log in securely**,
   so that I can access my journal entries from any device and keep my data private.

   **Acceptance Criteria:**
   1.  **3.1.1:** Users can sign up with email/password, GitHub, or Google accounts.
   2.  **3.1.2:** Authentication is handled securely with proper session management.
   3.  **3.1.3:** Users can log in and log out from the application.
   4.  **3.1.4:** Authentication state persists across browser sessions.
   5.  **3.1.5:** Protected routes require authentication to access.

   ### Story 3.2: Implement Cloud Data Storage with Supabase

   As a **user**,
   I want to **have my journal entries stored in the cloud**,
   so that I can access them from multiple devices and never lose my data.

   **Acceptance Criteria:**
   1.  **3.2.1:** Journal entries are stored in Supabase database with proper schema.
   2.  **3.2.2:** Each user's data is isolated and secure from other users.
   3.  **3.2.3:** CRUD operations work correctly for journal entries in the cloud.
   4.  **3.2.4:** AI analysis results are also stored in the cloud with journal entries.
   5.  **3.2.5:** Database operations include proper error handling and retry logic.

   ### Story 3.3: Implement Data Migration from localStorage

   As a **user**,
   I want to **migrate my existing journal entries from local storage to the cloud**,
   so that I don't lose any of my previous entries when I create an account.

   **Acceptance Criteria:**
   1.  **3.3.1:** System detects existing localStorage data when user first logs in.
   2.  **3.3.2:** Users are prompted to migrate their local data to the cloud.
   3.  **3.3.3:** Migration process preserves all journal content and AI analysis.
   4.  **3.3.4:** Users can choose to keep or clear local data after migration.
   5.  **3.3.5:** Migration handles conflicts between local and cloud data gracefully.

   ### Story 3.4: Implement Multi-Device Synchronization

   As a **user**,
   I want to **have my journal entries synchronized across all my devices**,
   so that I can write on one device and read on another seamlessly.

   **Acceptance Criteria:**
   1.  **3.4.1:** Changes made on one device appear on other devices in real-time or near real-time.
   2.  **3.4.2:** Conflict resolution handles simultaneous edits from multiple devices.
   3.  **3.4.3:** Offline changes are synchronized when the device comes back online.
   4.  **3.4.4:** Users receive notifications about sync status and conflicts.
   5.  **3.4.5:** Sync works efficiently without excessive bandwidth usage.

   ### Story 3.5: Implement User Account Management

   As a **user**,
   I want to **manage my account settings and preferences**,
   so that I can customize my experience and control my data.

   **Acceptance Criteria:**
   1.  **3.5.1:** Users can view and edit their profile information.
   2.  **3.5.2:** Users can change their password or update authentication methods.
   3.  **3.5.3:** Users can configure AI analysis preferences (provider, frequency).
   4.  **3.5.4:** Users can export their data or delete their account.
   5.  **3.5.5:** Account settings are synchronized across devices.

   ---

    **Goal:** Enable users to securely save and access their journal entries across multiple devices through robust user authentication and cloud-based data storage using Supabase. This epic addresses long-term data persistence, multi-device access, and enhances data security.

    ### Story 3.1: Supabase Project Setup and Client Integration

    As a **developer**,
    I want to **initialize a Supabase project and integrate its client library into the application**,
    so that the application can securely interact with Supabase for authentication and database operations.

    **Acceptance Criteria:**
    1.  **3.1.1:** A new Supabase project is created and configured.
    2.  **3.1.2:** The Supabase client library (`@supabase/supabase-js`) is installed and configured in the Next.js project.
    3.  **3.1.3:** Supabase API URL and `anon` key are securely managed as environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
    4.  **3.1.4:** A utility function or service is created to initialize and provide the Supabase client instance.
    5.  **3.1.5:** A basic connectivity test (e.g., fetching a public, non-sensitive record from a new Supabase table or confirming client initialization) is successfully performed.

    ### Story 3.2: User Registration and Email/Password Login

    As a **user**,
    I want to **register for an account and log in using my email and password**,
    so that my journal entries can be securely associated with my identity and stored in the cloud.

    **Acceptance Criteria:**
    1.  **3.2.1:** A user registration interface is available, requiring email and password input.
    2.  **3.2.2:** Upon successful registration, a new user account is created in Supabase Authentication.
    3.  **3.2.3:** A user login interface is available, requiring email and password input.
    4.  **3.2.4:** Upon successful login, the user's session is established with Supabase, and a secure JWT token is received.
    5.  **3.2.5:** Error handling is implemented for registration and login failures (e.g., invalid credentials, email already in use).
    6.  **3.2.6:** Users receive visual feedback (e.g., success messages, error alerts) during registration and login processes.

    ### Story 3.3: User Session Management and Logout

    As a **user**,
    I want to **remain logged in across sessions and be able to securely log out**,
    so that I don't have to re-enter my credentials frequently and can protect my account.

    **Acceptance Criteria:**
    1.  **3.3.1:** User authentication sessions persist across browser tabs and after closing/reopening the browser.
    2.  **3.3.2:** A "Logout" option is available in the UI when a user is authenticated.
    3.  **3.3.3:** Clicking "Logout" securely terminates the user's session with Supabase.
    4.  **3.3.4:** After logging out, the user is redirected to a public page (e.g., home page or login page).
    5.  **3.3.5:** The application's UI reflects the authenticated state (e.g., showing user email, hiding login/register buttons).

    ### Story 3.4: Migrate Existing LocalStorage Journal Entries to Supabase

    As a **user with existing local journal entries**,
    I want to **migrate my `localStorage` entries to my new Supabase account**,
    so that my historical data is preserved and accessible in the cloud.

    **Acceptance Criteria:**
    1.  **3.4.1:** A clear prompt or migration option is presented to logged-in users who have existing journal entries in `localStorage` but not yet in Supabase.
    2.  **3.4.2:** Upon user confirmation, all existing journal entries from `localStorage` are uploaded and stored in a new table in the Supabase database.
    3.  **3.4.3:** Each migrated entry is associated with the currently logged-in user's ID in Supabase.
    4.  **3.4.4:** Duplicate entries (e.g., if a user logs in on a new device with local data) are handled gracefully (e.g., by unique ID or timestamp, avoiding data loss).
    5.  **3.4.5:** The local `localStorage` entries are cleared *only after* successful migration to Supabase.
    6.  **3.4.6:** A progress indicator and success/failure messages are provided during the migration process.

    ### Story 3.5: Adapt Journal Entry CRUD Operations to Supabase

    As a **user**,
    I want to **create, read, update, and delete my journal entries directly from Supabase**,
    so that my data is consistently stored in the cloud and accessible from any device.

    **Acceptance Criteria:**
    1.  **3.5.1:** All new journal entries created by an authenticated user are saved to the Supabase database instead of `localStorage`.
    2.  **3.5.2:** When viewing journal history, entries are fetched from Supabase, filtered by the logged-in user's ID.
    3.  **3.5.3:** Editing an existing journal entry updates the corresponding record in the Supabase database.
    4.  **3.5.4:** Deleting a journal entry removes the record from the Supabase database.
    5.  **3.5.5:** Real-time feedback (loading states, success/error messages) is provided for all CRUD operations.
    6.  **3.5.6:** The application correctly handles cases where a user has no entries in Supabase yet.

    ### Story 3.6: Update AI Analysis Workflow for Supabase Integration

    As a **user**,
    I want my **AI-generated summaries, emotions, and suggestions to be stored and retrieved from Supabase**,
    so that these insights are persistent and available across devices, alongside my journal entries.

    **Acceptance Criteria:**
    1.  **3.6.1:** When AI analysis (summary, emotion, suggestions) is generated for a journal entry, the results are stored as part of that journal entry's record in the Supabase database.
    2.  **3.6.2:** When a journal entry is retrieved from Supabase, its associated AI analysis results are also fetched and displayed.
    3.  **3.6.3:** The smart caching mechanism (Story 2.6) is adapted to work with Supabase data, avoiding redundant AI calls for entries already analyzed in the cloud.
    4.  **3.6.4:** Manual re-analysis (Story 2.7) updates the AI results directly in the Supabase database.

   ## 7. Checklist Results Report

   *(This section will be populated after running the PM Checklist.)*

   ---

    ## 8. Next Steps

    ### UX Expert Prompt

    The Product Requirements Document (PRD) for the "Insight Journal – AI-Powered Daily Reflection Web App" is now complete. Please review the "User Interface Design Goals" section (Section 3) in the PRD. Your task is to elaborate on these high-level goals and translate them into a more detailed UI/UX specification or wireframes, focusing on the core journaling experience (Epic 1) and the integration of AI-powered insights (Epic 2). Pay particular attention to the "Overall UX Vision," "Key Interaction Paradigms," "Core Screens and Views," and "Branding" to ensure the design aligns with the product's calm, intuitive, and supportive feel.

    ### Architect Prompt

    The Product Requirements Document (PRD) for the "Insight Journal – AI-Powered Daily Reflection Web App" is now complete and includes detailed Epics and Stories. Please review the entire PRD, paying special attention to the "Technical Assumptions" (Section 4) and the "Epic List" and "Epic Details" (Sections 5 and 6), which now include the refined Epic 3 for Supabase Authentication and Cloud Storage. Your task is to create the comprehensive technical architecture and design for this application, covering both the MVP functionality and laying the groundwork for future phases as outlined. Your design should leverage the specified technical stack and address all functional and non-functional requirements.