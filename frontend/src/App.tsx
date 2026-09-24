import React, { useState } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { CanvasPreview } from './components/CanvasPreview';
import { ChatMessage, BrandStrategy, PageSection } from './types/brand';

const API_URL = 'http://localhost:8000/api';

export const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to Ink Loom AI. Tell me about your product or community idea to build your brand and dynamic landing page.',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [brand, setBrand] = useState<BrandStrategy | null>(null);
  const [layout, setLayout] = useState<PageSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (userPrompt: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_message: userPrompt,
          conversation_history: messages.map(m => ({ role: m.role, content: m.content })),
          current_layout: layout,
          current_brand: brand
        })
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), role: 'assistant', content: data.reply, timestamp: new Date().toLocaleTimeString() }
        ]);
      }

      if (data.brand) setBrand(data.brand);
      if (data.layout) setLayout(data.layout);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: 'Failed to communicate with AI server. Make sure FastAPI backend is running.', timestamp: new Date().toLocaleTimeString() }
      ]);
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
      const res = await fetch(`${API_URL}/merge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          option_a: layout,
          option_b: layout.slice().reverse(),
          user_preference: 'Combine the primary hero with high conversion feature grids'
        })
      });
      const data = await res.json();
      if (data.merged_layout) setLayout(data.merged_layout);
    } catch (e) {
      console.error(e);
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
