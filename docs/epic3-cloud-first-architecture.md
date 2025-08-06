# Epic 3: Cloud-First Architecture

## Overview

With Epic 3 completion (User Authentication & Cloud Storage), the application has transitioned from localStorage-based MVP to a cloud-first architecture using Supabase.

## Data Flow Strategy

### Authenticated Users (Cloud-First)
```
New Journal Entry → Supabase → UI Update
AI Analysis → Supabase → UI Update
```

**Key Points:**
- All new data saves directly to Supabase
- No localStorage fallback for authenticated users
- Immediate UI refresh after cloud operations
- Consistent data across devices

### Non-Authenticated Users (MVP Fallback)
```
New Journal Entry → localStorage → UI Update
AI Analysis → localStorage → UI Update
```

**Key Points:**
- Maintains MVP functionality for guest users
- Local-only data storage
- No cloud synchronization

## Implementation Details

### Journal Entry Creation
**File:** `src/features/editor/components/MarkdownEditor.tsx`

```typescript
if (session?.user) {
  // ✅ Authenticated: Save to Supabase
  const response = await fetch('/api/journal/entries', {
    method: 'POST',
    body: JSON.stringify({ title, content })
  });
  // Auto-refresh cloud data
  await cloudStore.loadEntries();
} else {
  // 📱 Non-authenticated: Save to localStorage
  await addLocalEntry({ content });
}
```

### AI Analysis Storage
**File:** `src/features/ai-insights/hooks/useAIAnalysis.ts`

```typescript
if (session?.user) {
  // ✅ Authenticated: Save to Supabase
  await saveAnalysis(entryId, analysisData);
  await cloudStore.loadEntries();
} else {
  // 📱 Non-authenticated: Save to localStorage
  await updateEntry({ id: entryId, aiAnalysis: analysis });
  await localStore.loadEntries();
}
```

### Data Display Logic
**File:** `src/app/journal/page.tsx`

```typescript
// Epic 3: Cloud-First Data Strategy
const useCloud = !!session?.user;
const entries = useCloud ? cloudEntries : localEntries;
```

## Benefits

1. **Data Consistency**: All authenticated user data in Supabase
2. **Cross-Device Sync**: Automatic synchronization across devices
3. **Scalability**: Cloud storage handles large datasets
4. **Security**: User data protected by authentication
5. **Backup**: Automatic cloud backup of all data

## Migration Path

- **Phase 1 (MVP)**: localStorage only
- **Phase 2 (Epic 3)**: Hybrid approach with migration tools
- **Phase 3 (Current)**: Cloud-first for authenticated users
- **Future**: Complete cloud migration with data export tools

## Verification

To verify Epic 3 implementation:

1. **Create New Entry**: Should appear immediately in list
2. **AI Analysis**: Should save to cloud and update status
3. **Cross-Device**: Login on different device shows same data
4. **Offline Users**: Still functional with localStorage

## API Endpoints

- `POST /api/journal/entries` - Create journal entry
- `PUT /api/journal/entries/[id]` - Update journal entry
- `POST /api/ai/analyze` - Analyze entry content
- `POST /api/journal/ai-analysis` - Save analysis results

## Database Schema

**journal_entries**
- id, user_id, title, content, created_at, updated_at

**ai_analysis**
- id, journal_entry_id, summary, emotions, suggestions, model, created_at
