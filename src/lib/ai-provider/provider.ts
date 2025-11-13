import {
  generateId,
  loadApiKey,
  withoutTrailingSlash,
} from '@ai-sdk/provider-utils';
import { ProviderV2 } from '@ai-sdk/provider';
import { CustomChatLanguageModel } from './custom-chat-language-model';
import { CustomChatSettings } from './chat-settings';

// Define your provider interface extending ProviderV2
interface CustomProvider extends ProviderV2 {
  (modelId: string, settings?: CustomChatSettings): CustomChatLanguageModel;

  // Add specific methods for different model types
  languageModel(
    modelId: string,
    settings?: CustomChatSettings,
  ): CustomChatLanguageModel;
}

// Provider settings
interface CustomProviderSettings {
  /**
   * Base URL for API calls
   */
  baseURL?: string;

  /**
   * API key for authentication
   */
  apiKey?: string;

  /**
   * Custom headers for requests
   */
  headers?: Record<string, string>;
}

// Factory function to create provider instance
function createCustom(options: CustomProviderSettings = {}): CustomProvider {
  const createChatModel = (
    modelId: string,
    settings: CustomChatSettings = {},
  ) =>
    new CustomChatLanguageModel(modelId, settings, {
      provider: 'custom',
      baseURL: withoutTrailingSlash(options.baseURL) ?? 'http://localhost:3000/api/',
      headers: () => ({
        Authorization: `Bearer ${loadApiKey({
          apiKey: options.apiKey,
          environmentVariableName: 'CUSTOM_API_KEY',
          description: 'Custom Provider',
        })}`,
        ...options.headers,
      }),
    });

  const provider = function(modelId: string, settings?: CustomChatSettings) {
    if (new.target) {
      throw new Error(
        'The model factory function cannot be called with the new keyword.',
      );
    }

    return createChatModel(modelId, settings);
  };

  provider.languageModel = createChatModel;

  return provider as CustomProvider;
}

// Export default provider instance
export const kaiwu = createCustom({apiKey: 'custom'});
