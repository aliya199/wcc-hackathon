import React, { useState } from 'react';
import { ChatMessage, BrandStrategy } from '../types/brand';
import { Send, Palette, Layers, Sparkles } from 'lucide-react';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (msg: string) => void;
  brand: BrandStrategy | null;
  onUpdateBrand: (updated: Partial<BrandStrategy>) => void;
  onMergeTrigger: () => void;
  isLoading: boolean;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  brand,
  onUpdateBrand,
  onMergeTrigger,
  isLoading
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="w-full md:w-[380px] h-full bg-slate-900 text-white flex flex-col border-r border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-wide">Ink Loom Studio</h1>
        </div>
      </div>

      {brand && (
        <div className="p-3 bg-slate-800/60 border-b border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-400">Brand Color Swatches</span>
            <Palette className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex gap-2">
            {[brand.primary_color, brand.secondary_color, brand.accent_color, brand.bg_color].map((color, i) => (
              <div key={i} className="flex-1 h-6 rounded border border-white/10 relative group cursor-pointer" style={{ backgroundColor: color }}>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => {
                    const keys: (keyof BrandStrategy)[] = ['primary_color', 'secondary_color', 'accent_color', 'bg_color'];
                    onUpdateBrand({ [keys[i]]: e.target.value });
                  }}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" 
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 p-3 rounded-2xl text-xs text-slate-400 animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" /> Synthesizing brand strategy & assets...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-800 bg-slate-900/80 backdrop-blur space-y-2">
        <div className="flex gap-2">
          <button onClick={onMergeTrigger} className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition">
            <Layers className="w-3.5 h-3.5 text-indigo-400" /> Merge Layout Options
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your idea or request changes..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button type="submit" disabled={isLoading} className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition text-white disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPanel
