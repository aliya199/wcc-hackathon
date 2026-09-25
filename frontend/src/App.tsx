import React, { useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { CanvasPreview } from './components/CanvasPreview';
import { postJson } from './lib/api';
import { ChatMessage, BrandStrategy, PageSection } from './types/brand';

type ChatResponse = {
  reply?: string;
  brand?: BrandStrategy;
  layout?: PageSection[];
};

type MergeResponse = {
  merged_layout?: PageSection[] | null;
  reply?: string;
};

const assistantMessage = (content: string): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role: 'assistant',
  content,
  timestamp: new Date().toLocaleTimeString(),
});

export const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Ink Loom AI. Tell me about your product or community idea to build your brand and dynamic landing page.',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [brand, setBrand] = useState<BrandStrategy | null>(null);
  const [layout, setLayout] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userPrompt: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await postJson<ChatResponse>('/chat', {
        user_message: userPrompt,
        conversation_history: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        current_layout: layout,
        current_brand: brand,
      });

      if (data.reply) {
        setMessages((prev) => [...prev, assistantMessage(data.reply!)]);
      }

      if (data.brand) setBrand(data.brand);
      if (data.layout?.length) setLayout(data.layout);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to communicate with AI server. Make sure the FastAPI backend is running on port 8000.';
      setMessages((prev) => [...prev, assistantMessage(message)]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBrand = (updated: Partial<BrandStrategy>) => {
    if (brand) setBrand({ ...brand, ...updated });
  };

  const handleMergeTrigger = async () => {
    if (!layout.length) return;
    setIsLoading(true);
    try {
      const data = await postJson<MergeResponse>('/merge', {
        option_a: layout,
        option_b: layout.slice().reverse(),
        user_preference: 'Combine the primary hero with high conversion feature grids',
      });
      if (data.merged_layout?.length) {
        setLayout(data.merged_layout);
        setMessages((prev) => [...prev, assistantMessage('Merged layout applied to the canvas.')]);
      } else if (data.reply) {
        setMessages((prev) => [...prev, assistantMessage(data.reply!)]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Merge request failed.';
      setMessages((prev) => [...prev, assistantMessage(message)]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      <ChatPanel
        messages={messages}
        onSendMessage={handleSendMessage}
        brand={brand}
        onUpdateBrand={handleUpdateBrand}
        onMergeTrigger={handleMergeTrigger}
        isLoading={isLoading}
      />
      <CanvasPreview layout={layout} brand={brand} />
    </div>
  );
};

export default App;
