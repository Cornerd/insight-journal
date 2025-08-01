-- Row Level Security (RLS) Policies Setup
-- This script sets up security policies for the Insight Journal database

-- Enable RLS on tables (if not already enabled)
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for clean setup)
DROP POLICY IF EXISTS "Users can view their own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can insert their own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can update their own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can delete their own journal entries" ON journal_entries;

DROP POLICY IF EXISTS "Users can view their own AI analysis" ON ai_analysis;
DROP POLICY IF EXISTS "Users can insert their own AI analysis" ON ai_analysis;
DROP POLICY IF EXISTS "Users can update their own AI analysis" ON ai_analysis;
DROP POLICY IF EXISTS "Users can delete their own AI analysis" ON ai_analysis;

-- Journal Entries Policies
-- Allow users to view their own entries
CREATE POLICY "Users can view their own journal entries" ON journal_entries
    FOR SELECT USING (auth.uid() = user_id);

-- Allow users to insert their own entries
CREATE POLICY "Users can insert their own journal entries" ON journal_entries
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own entries
CREATE POLICY "Users can update their own journal entries" ON journal_entries
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own entries
CREATE POLICY "Users can delete their own journal entries" ON journal_entries
    FOR DELETE USING (auth.uid() = user_id);

-- AI Analysis Policies
-- Allow users to view AI analysis for their own entries
CREATE POLICY "Users can view their own AI analysis" ON ai_analysis
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM journal_entries 
            WHERE journal_entries.id = ai_analysis.journal_entry_id 
            AND journal_entries.user_id = auth.uid()
        )
    );

-- Allow users to insert AI analysis for their own entries
CREATE POLICY "Users can insert their own AI analysis" ON ai_analysis
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM journal_entries 
            WHERE journal_entries.id = ai_analysis.journal_entry_id 
            AND journal_entries.user_id = auth.uid()
        )
    );

-- Allow users to update AI analysis for their own entries
CREATE POLICY "Users can update their own AI analysis" ON ai_analysis
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM journal_entries 
            WHERE journal_entries.id = ai_analysis.journal_entry_id 
            AND journal_entries.user_id = auth.uid()
        )
    );

-- Allow users to delete AI analysis for their own entries
CREATE POLICY "Users can delete their own AI analysis" ON ai_analysis
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM journal_entries 
            WHERE journal_entries.id = ai_analysis.journal_entry_id 
            AND journal_entries.user_id = auth.uid()
        )
    );

-- Service Role Policies (for server-side operations)
-- These policies allow the service role to perform operations on behalf of users

-- Allow service role to perform all operations on journal_entries
CREATE POLICY "Service role can manage all journal entries" ON journal_entries
    FOR ALL USING (auth.role() = 'service_role');

-- Allow service role to perform all operations on ai_analysis
CREATE POLICY "Service role can manage all AI analysis" ON ai_analysis
    FOR ALL USING (auth.role() = 'service_role');

-- Create or update the journal_entries_with_analysis view
-- This view combines journal entries with their AI analysis
CREATE OR REPLACE VIEW journal_entries_with_analysis AS
SELECT 
    je.id,
    je.user_id,
    je.title,
    je.content,
    je.created_at,
    je.updated_at,
    aa.id as analysis_id,
    aa.summary,
    aa.emotions,
    aa.suggestions,
    aa.model,
    aa.generated_at
FROM journal_entries je
LEFT JOIN ai_analysis aa ON je.id = aa.journal_entry_id;

-- Enable RLS on the view (if supported)
-- Note: Views inherit RLS from their underlying tables

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON journal_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ai_analysis TO authenticated;
GRANT SELECT ON journal_entries_with_analysis TO authenticated;

-- Grant service role permissions
GRANT ALL ON journal_entries TO service_role;
GRANT ALL ON ai_analysis TO service_role;
GRANT SELECT ON journal_entries_with_analysis TO service_role;

-- Enable realtime for the tables (if not already enabled)
-- This should be done in the Supabase dashboard, but including here for reference
-- ALTER PUBLICATION supabase_realtime ADD TABLE journal_entries;
-- ALTER PUBLICATION supabase_realtime ADD TABLE ai_analysis;
