'use client';

import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { useState } from 'react';

export default function DemoPage() {
  const [input, setInput] = useState('');
  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    regenerate
  } = useChat({
    transport: new TextStreamChatTransport({
      api: 'api/chat',
    })
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="min-h-screen from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI 聊天演示
          </h1>
          <p className="text-gray-600 mb-6">
            这是一个使用 useChat hook 实现的流式聊天界面
          </p>

          {/* 聊天消息区域 */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6 min-h-[400px] max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-12">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg">开始与 AI 对话吧！</p>
                <p className="text-sm mt-2">输入消息并点击发送</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium opacity-70">
                          {message.role === 'user' ? '你' : 'AI'}
                        </span>
                      </div>
                      <div className="whitespace-pre-wrap">
                        {message.parts
                          .filter(part => part.type === 'text')
                          .map(part => part.text)
                          .join('')}
                      </div>
                    </div>
                  </div>
                ))}

                {/* 加载状态指示器 */}
                {(status === 'submitted' || status === 'streaming') && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          AI 正在思考中...
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 错误处理 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 text-red-800">
                <span className="text-lg">⚠️</span>
                <div>
                  <p className="font-medium">发生错误</p>
                  <p className="text-sm">{error.message}</p>
                </div>
              </div>
              <button
                onClick={() => regenerate()}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                重试
              </button>
            </div>
          )}

          {/* 输入表单 */}
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== 'ready'}
              placeholder="输入你的问题..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <div className="flex gap-2">
              {(status === 'streaming' || status === 'submitted') && (
                <button
                  type="button"
                  onClick={stop}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  停止
                </button>
              )}
              <button
                type="submit"
                disabled={status !== 'ready' || !input.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {status === 'ready' ? '发送' : '发送中...'}
              </button>
            </div>
          </form>

          {/* 状态信息 */}
          <div className="mt-4 text-sm text-gray-500 flex justify-between">
            <span>状态: {getStatusText(status)}</span>
            <span>消息数: {messages.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusText(status: string): string {
  switch (status) {
    case 'ready':
      return '准备就绪';
    case 'submitted':
      return '已提交';
    case 'streaming':
      return '流式输出中';
    case 'error':
      return '发生错误';
    default:
      return status;
  }
}
