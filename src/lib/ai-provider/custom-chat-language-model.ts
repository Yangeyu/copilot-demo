import { LanguageModelV2, LanguageModelV2CallOptions, LanguageModelV2CallWarning, LanguageModelV2Content, LanguageModelV2DataContent, LanguageModelV2FinishReason, LanguageModelV2Prompt, LanguageModelV2StreamPart, LanguageModelV2Text } from '@ai-sdk/provider';
import { combineHeaders, createJsonResponseHandler, FetchFunction, postJsonToApi } from '@ai-sdk/provider-utils';
import { customFaildResponseHandler } from './error';
import z from 'zod';

type CustomChatSettings = {

}

type CustomChatConfig = {
  provider: string;
  baseURL: string;
  isMultiModel?: boolean;
  isReasoningModel?: boolean;
  headers: () => Record<string, string | undefined>;
  fetch?: FetchFunction;
};

export class CustomChatLanguageModel implements LanguageModelV2 {
  readonly specificationVersion = 'v2';
  readonly provider: string;
  readonly modelId: string;

  private config: CustomChatConfig;

  constructor(
    modelId: string,
    settings: CustomChatSettings,
    config: CustomChatConfig,
  ) {
    this.provider = config.provider;
    this.modelId = modelId;
    this.config = config;
  }

  // Convert AI SDK prompt to provider format
  private getArgs(options: LanguageModelV2CallOptions) {
    const warnings: LanguageModelV2CallWarning[] = [];

    // Map messages to provider format
    const messages = this.convertToProviderMessages(options.prompt);

    // Build request body
    const body = {
      model: this.modelId,
      messages,
      temperature: options.temperature,
      max_tokens: options.maxOutputTokens,
      stop: options.stopSequences,
      // ... other parameters
    };

    return { args: body, warnings };
  }

  private convertToProviderMessages(prompt: LanguageModelV2Prompt) {
    return prompt.map((message) => {
      switch (message.role) {
        case 'system':
          return { role: 'system', content: message.content };

        case 'user':
          return {
            role: 'user',
            content: message.content.map((part) => {
              switch (part.type) {
                case 'text':
                  return { type: 'text', text: part.text };
                case 'file':
                  return {
                    type: 'image_url',
                    image_url: {
                      url: this.convertFileToUrl(part.data),
                    },
                  };
                default:
                  throw new Error(`Unsupported part type: ${(part as LanguageModelV2Text).type}`);
              }
            }),
          };

        case 'assistant':
        // Handle assistant messages with text, tool calls, etc.
        // return this.convertAssistantMessage(message);

        case 'tool':
        // Handle tool results
        // return this.convertToolMessage(message);

        default:
          throw new Error(`Unsupported message role: ${message.role}`);
      }
    });
  }

  private createTransformer(warnings: LanguageModelV2CallWarning[]) {
    let isFirstChunk = true;
    let isActiveText = false;

    return new TransformStream<any, LanguageModelV2StreamPart>({
      async transform(chunk, controller) {
        // Send warnings with first chunk
        if (isFirstChunk) {
          controller.enqueue({ type: 'stream-start', warnings });
          isFirstChunk = false;
        }

        console.log('Received chunk:', chunk);
        
        // Handle different chunk types
        if (chunk.choices?.[0]?.delta?.content) {
          if (!isActiveText) {
            controller.enqueue({
              type: 'text-start',
              id: 'txt-0',
            });
            isActiveText = true;
          }
          controller.enqueue({
            type: 'text-delta',
            id: 'txt-0',
            delta: chunk.choices[0].delta.content,
          });
        }

        // TODO: handle tool calls

        // Handle finish reason
        if (chunk.choices?.[0]?.finish_reason) {
          controller.enqueue({
            type: 'finish',
            finishReason: mapFinishReason(chunk.choices[0].finish_reason),
            usage: {
              inputTokens: chunk.usage?.prompt_tokens,
              outputTokens: chunk.usage?.completion_tokens,
              totalTokens: chunk.usage?.total_tokens,
            },
          });
        }
      },
    });
  }

  async doGenerate(options: LanguageModelV2CallOptions) {
    const { args, warnings } = this.getArgs(options);

    // Make API call
    const {
      value: response,
      rawValue: rawResponse,
      responseHeaders
    } = await postJsonToApi({
      url: `${this.config.baseURL}/chat/completions`,
      headers: combineHeaders(this.config.headers(), options.headers),
      body: args,
      failedResponseHandler: customFaildResponseHandler,
      abortSignal: options.abortSignal,
      successfulResponseHandler: createJsonResponseHandler(customChatResponseSchema),
      fetch: this.config.fetch,
    });

    // Convert provider response to AI SDK format
    const content: LanguageModelV2Content[] = [];

    // Extract text content
    const responseText = response.choices[0].message.content;

    // const responseReasoning = response.choices[0].message.reasoning_content;

    if (responseText) {
      content.push({
        type: 'text',
        text: responseText,
      });
    }

    // TODO: handle tool calls

    return {
      content,
      finishReason: mapFinishReason(response.choices[0].finish_reason),
      usage: {
        inputTokens: response.usage?.prompt_tokens,
        outputTokens: response.usage?.completion_tokens ?? NaN,
        totalTokens: response.usage?.total_tokens ?? NaN,
      },
      request: { body: args },
      response: { body: response },
      warnings,
    };
  }

  async doStream(options: LanguageModelV2CallOptions) {
    const { args, warnings } = this.getArgs(options);

    // Create streaming response
    const response = await fetch(`http://localhost:3000/api/chat/stream`, {
      method: 'POST',
      headers: {
        ...this.config.headers(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...args, stream: true }),
      signal: options.abortSignal,
    });

    // Transform stream to AI SDK format
    const stream = response
      .body!.pipeThrough(new TextDecoderStream())
      .pipeThrough(this.createParser())
      .pipeThrough(this.createTransformer(warnings));

    return { stream, warnings };
  }

  createParser() {
    return new TransformStream<string, any>({
      transform(chunk, controller) {
        try {
          console.log('Received chunk:', chunk);
          
          controller.enqueue(JSON.parse(chunk));
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }

  convertFileToUrl(data: LanguageModelV2DataContent) {
    // TODO: implement file upload    
    return ''
  }

  // Supported URL patterns for native file handling
  get supportedUrls() {
    return {
      'image/*': [/^https:\/\/example\.com\/images\/.*/],
    };
  }
}

function mapFinishReason(
  finishReason: string | null | undefined,
): LanguageModelV2FinishReason {
  switch (finishReason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "tool_calls":
      return "tool-calls";
    case "sensitive":
      return "content-filter";
    case "network_error":
      return "error";
    default:
      return "unknown";
  }
}

const customChatResponseSchema = z.object({
  id: z.string().nullish(),
  created: z.number().nullish(),
  model: z.string().nullish(),
  choices: z.array(
    z.object({
      message: z.object({
        role: z.literal("assistant"),
        content: z.string().nullish(),
        reasoning_content: z.string().nullish(),
        tool_calls: z
          .array(
            z.object({
              id: z.string(),
              index: z.number().nullish(),
              type: z.literal("function"),
              function: z.object({ name: z.string(), arguments: z.string() }),
            }),
          )
          .nullish(),
      }),
      index: z.number(),
      finish_reason: z.string().nullish(),
    }),
  ),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number().nullish(),
    total_tokens: z.number().nullish(),
  }),
  web_search: z
    .object({
      icon: z.string(),
      title: z.string(),
      link: z.string(),
      media: z.string(),
      content: z.string(),
    })
    .nullish(),
});
