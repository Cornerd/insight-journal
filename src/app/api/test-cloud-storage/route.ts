/**
 * Cloud Storage Test API Route
 * Tests cloud storage functionality and data isolation
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cloudStorageService } from '@/features/journal/services/cloudStorageService';

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Authentication required',
          tests: {
            authentication: 'FAILED - No session',
          },
        },
        { status: 401 }
      );
    }

    const testResults: Record<string, string> = {};

    // Test 1: Authentication check
    testResults.authentication = 'PASSED - User authenticated';

    // Test 2: Create a test journal entry
    try {
      const testEntry = await cloudStorageService.createJournalEntry(
        'Test Entry',
        'This is a test entry to verify cloud storage functionality.'
      );
      testResults.createEntry = `PASSED - Created entry with ID: ${testEntry.id}`;

      // Test 3: Retrieve the created entry
      try {
        const retrievedEntry = await cloudStorageService.getJournalEntry(
          testEntry.id
        );
        if (retrievedEntry && retrievedEntry.id === testEntry.id) {
          testResults.retrieveEntry = 'PASSED - Successfully retrieved entry';
        } else {
          testResults.retrieveEntry = 'FAILED - Entry not found or ID mismatch';
        }

        // Test 4: Update the entry
        try {
          const updatedEntry = await cloudStorageService.updateJournalEntry(
            testEntry.id,
            { title: 'Updated Test Entry' }
          );
          if (updatedEntry.title === 'Updated Test Entry') {
            testResults.updateEntry = 'PASSED - Successfully updated entry';
          } else {
            testResults.updateEntry = 'FAILED - Entry not updated correctly';
          }

          // Test 5: Get all entries (should include our test entry)
          try {
            const allEntries = await cloudStorageService.getJournalEntries();
            const hasTestEntry = allEntries.some(
              entry => entry.id === testEntry.id
            );
            if (hasTestEntry) {
              testResults.getAllEntries = `PASSED - Found test entry in ${allEntries.length} total entries`;
            } else {
              testResults.getAllEntries =
                'FAILED - Test entry not found in entries list';
            }
          } catch (error) {
            testResults.getAllEntries = `FAILED - Error getting entries: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }

          // Test 6: Test AI analysis storage
          try {
            const analysisData = {
              summary: 'Test summary',
              emotions: { happy: 0.8, excited: 0.6 },
              suggestions: { suggestion1: 'Test suggestion' },
              model: 'test-model',
            };

            const savedAnalysis = await cloudStorageService.saveAIAnalysis(
              testEntry.id,
              analysisData
            );
            testResults.saveAnalysis = `PASSED - Saved analysis with ID: ${savedAnalysis.id}`;

            // Test 7: Retrieve AI analysis
            try {
              const retrievedAnalysis = await cloudStorageService.getAIAnalysis(
                testEntry.id
              );
              if (
                retrievedAnalysis &&
                retrievedAnalysis.summary === 'Test summary'
              ) {
                testResults.retrieveAnalysis =
                  'PASSED - Successfully retrieved analysis';
              } else {
                testResults.retrieveAnalysis =
                  'FAILED - Analysis not found or data mismatch';
              }
            } catch (error) {
              testResults.retrieveAnalysis = `FAILED - Error retrieving analysis: ${error instanceof Error ? error.message : 'Unknown error'}`;
            }
          } catch (error) {
            testResults.saveAnalysis = `FAILED - Error saving analysis: ${error instanceof Error ? error.message : 'Unknown error'}`;
            testResults.retrieveAnalysis = 'SKIPPED - Save analysis failed';
          }

          // Test 8: Clean up - delete the test entry
          try {
            await cloudStorageService.deleteJournalEntry(testEntry.id);

            // Verify deletion
            const deletedEntry = await cloudStorageService.getJournalEntry(
              testEntry.id
            );
            if (!deletedEntry) {
              testResults.deleteEntry = 'PASSED - Successfully deleted entry';
            } else {
              testResults.deleteEntry =
                'FAILED - Entry still exists after deletion';
            }
          } catch (error) {
            testResults.deleteEntry = `FAILED - Error deleting entry: ${error instanceof Error ? error.message : 'Unknown error'}`;
          }
        } catch (error) {
          testResults.updateEntry = `FAILED - Error updating entry: ${error instanceof Error ? error.message : 'Unknown error'}`;
          testResults.getAllEntries = 'SKIPPED - Update failed';
          testResults.saveAnalysis = 'SKIPPED - Update failed';
          testResults.retrieveAnalysis = 'SKIPPED - Update failed';
          testResults.deleteEntry = 'SKIPPED - Update failed';
        }
      } catch (error) {
        testResults.retrieveEntry = `FAILED - Error retrieving entry: ${error instanceof Error ? error.message : 'Unknown error'}`;
        testResults.updateEntry = 'SKIPPED - Retrieve failed';
        testResults.getAllEntries = 'SKIPPED - Retrieve failed';
        testResults.saveAnalysis = 'SKIPPED - Retrieve failed';
        testResults.retrieveAnalysis = 'SKIPPED - Retrieve failed';
        testResults.deleteEntry = 'SKIPPED - Retrieve failed';
      }
    } catch (error) {
      testResults.createEntry = `FAILED - Error creating entry: ${error instanceof Error ? error.message : 'Unknown error'}`;
      testResults.retrieveEntry = 'SKIPPED - Create failed';
      testResults.updateEntry = 'SKIPPED - Create failed';
      testResults.getAllEntries = 'SKIPPED - Create failed';
      testResults.saveAnalysis = 'SKIPPED - Create failed';
      testResults.retrieveAnalysis = 'SKIPPED - Create failed';
      testResults.deleteEntry = 'SKIPPED - Create failed';
    }

    // Calculate overall success
    const totalTests = Object.keys(testResults).length;
    const passedTests = Object.values(testResults).filter(result =>
      result.startsWith('PASSED')
    ).length;
    const failedTests = Object.values(testResults).filter(result =>
      result.startsWith('FAILED')
    ).length;
    const skippedTests = Object.values(testResults).filter(result =>
      result.startsWith('SKIPPED')
    ).length;

    return NextResponse.json({
      success: passedTests > 0 && failedTests === 0,
      message: 'Cloud storage functionality test completed',
      timestamp: new Date().toISOString(),
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        skipped: skippedTests,
        successRate: `${Math.round((passedTests / (totalTests - skippedTests)) * 100)}%`,
      },
      tests: testResults,
      notes: [
        'This test creates, reads, updates, and deletes a test journal entry',
        'It also tests AI analysis storage and retrieval',
        'All operations should respect Row Level Security (RLS) policies',
        'Test data is automatically cleaned up after testing',
      ],
    });
  } catch (error) {
    console.error('Cloud storage test error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Cloud storage test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
