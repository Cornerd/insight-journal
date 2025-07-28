/**
 * AI Provider Status Component
 * Shows current AI provider status and allows testing
 */

'use client';

import React, { useState, useEffect } from 'react';

interface ProviderInfo {
  current: string;
  info: {
    name: string;
    model: string;
    cost: string;
    description: string;
  };
}

interface HealthCheck {
  provider: string;
  available: boolean;
  error?: string;
}

interface StatusResponse {
  success: boolean;
  provider: ProviderInfo;
  health: HealthCheck;
  config: any;
  apiKeys: Record<string, boolean>;
  error?: string;
}

export function AIProviderStatus() {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState<string | null>(null);

  // Load status on component mount
  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load AI status:', error);
      setStatus({
        success: false,
        error: 'Failed to load status',
        provider: {} as ProviderInfo,
        health: {} as HealthCheck,
        config: {},
        apiKeys: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const testProvider = async (provider: string) => {
    try {
      setTesting(provider);
      const response = await fetch('/api/ai/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });
      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${provider} is working correctly!`);
      } else {
        alert(`❌ ${provider} test failed: ${data.error}`);
      }
    } catch (error) {
      alert(`❌ ${provider} test failed: ${error}`);
    } finally {
      setTesting(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!status || !status.success) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <h3 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
          AI Status Error
        </h3>
        <p className="text-sm text-red-600 dark:text-red-400">
          {status?.error || 'Unknown error'}
        </p>
        <button
          onClick={loadStatus}
          className="mt-2 text-sm text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100"
        >
          Retry
        </button>
      </div>
    );
  }

  const getStatusColor = (available: boolean) => {
    return available 
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return '🤖';
      case 'gemini': return '✨';
      case 'ollama': return '🏠';
      default: return '❓';
    }
  };

  return (
    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
          AI Provider Status
        </h3>
        <button
          onClick={loadStatus}
          className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Current Provider */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">{getProviderIcon(status.provider.current)}</span>
          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
            {status.provider.info.name}
          </span>
          <span className={`text-sm ${getStatusColor(status.health.available)}`}>
            {status.health.available ? '✅ Available' : '❌ Unavailable'}
          </span>
        </div>
        
        <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
          <div>Model: {status.provider.info.model}</div>
          <div>Cost: {status.provider.info.cost}</div>
          <div>Environment: {status.config.environment}</div>
        </div>

        {!status.health.available && status.health.error && (
          <div className="mt-2 text-xs text-red-600 dark:text-red-400">
            Error: {status.health.error}
          </div>
        )}
      </div>

      {/* Provider Tests */}
      <div className="space-y-2">
        <div className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
          Test Providers:
        </div>
        
        {['openai', 'gemini', 'ollama'].map((provider) => (
          <div key={provider} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span>{getProviderIcon(provider)}</span>
              <span className="text-xs text-blue-700 dark:text-blue-300 capitalize">
                {provider}
              </span>
              {!status.apiKeys[provider] && provider !== 'ollama' && (
                <span className="text-xs text-yellow-600 dark:text-yellow-400">
                  (No API Key)
                </span>
              )}
            </div>
            
            <button
              onClick={() => testProvider(provider)}
              disabled={testing === provider || (!status.apiKeys[provider] && provider !== 'ollama')}
              className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing === provider ? '⏳' : '🧪 Test'}
            </button>
          </div>
        ))}
      </div>

      {/* Development Info */}
      {status.config.environment === 'development' && (
        <div className="mt-4 pt-3 border-t border-blue-200 dark:border-blue-700">
          <div className="text-xs text-blue-600 dark:text-blue-400">
            <div className="font-medium mb-1">Development Mode</div>
            <div>Current: {status.provider.current}</div>
            <div>Recommended: ollama (local) or gemini (cloud)</div>
          </div>
        </div>
      )}
    </div>
  );
}
