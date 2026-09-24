import React from 'react';
import { PageSection, BrandStrategy } from '../types/brand';
import { RenderSection } from './TemplateRegistry';
import { Monitor, Smartphone, Download } from 'lucide-react';

interface CanvasPreviewProps {
  layout: PageSection[];
  brand: BrandStrategy | null;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ layout, brand }) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');

  if (!brand || layout.length === 0) {
    return (
      <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
        <Monitor className="w-12 h-12 mb-4 text-slate-700" />
        <h3 className="text-xl font-bold text-slate-300 mb-2">Live Interactive Canvas</h3>
        <p className="max-w-md text-sm">Enter your startup or product idea in the chat panel to generate a live, animated brand system and landing page.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden">
      <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="font-semibold text-slate-200">{brand.name}</span>
          <span className="opacity-50">| {brand.heading_font} & {brand.body_font}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800 rounded-lg p-0.5">
            <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-slate-700 text-white' : 'hover:text-white'}`}>
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-slate-700 text-white' : 'hover:text-white'}`}>
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
          <button onClick={() => alert(JSON.stringify({ brand, layout }, null, 2))} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg font-medium transition">
            <Download className="w-3.5 h-3.5" /> Export Brand Kit
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-950">
        <div className={`transition-all duration-300 w-full bg-white shadow-2xl rounded-2xl overflow-hidden ${viewMode === 'mobile' ? 'max-w-[375px] min-h-[667px]' : 'max-w-5xl'}`}>
          {layout.map((sec) => (
            <RenderSection key={sec.id} section={sec} brand={brand} />
          ))}
          <div className="p-4 border-t">
            <button
              onClick={() => {
                // simple HTML export of current layout + inline styles
                const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${brand.name} - Export</title><style>body{font-family:system-ui;background:${brand.bg_color};color:${brand.primary_color};padding:24px}</style></head><body>${layout.map(s=>`<section><h2>${s.content.headline||s.content.title||''}</h2><p>${s.content.subheadline||''}</p></section>`).join('')}</body></html>`;
                const blob = new Blob([html], { type: 'text/html' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${brand.name || 'export'}.html`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              import React, { useState } from 'react';
              import { PageSection, BrandStrategy } from '../types/brand';
              import { RenderSection } from './TemplateRegistry';
              import { Monitor, Smartphone, Download } from 'lucide-react';

              interface CanvasPreviewProps {
                layout: PageSection[];
                brand: BrandStrategy | null;
              }

              export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ layout, brand }) => {
                const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

                if (!brand || layout.length === 0) {
                  return (
                    <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                      <Monitor className="w-12 h-12 mb-4 text-slate-700" />
                      <h3 className="text-xl font-bold text-slate-300 mb-2">Live Interactive Canvas</h3>
                      <p className="max-w-md text-sm">Enter your idea in the chat panel to generate a live, animated brand system.</p>
                    </div>
                  );
                }

                const exportHTML = () => {
                  const htmlContent = `<!doctype html><html><head><meta charset="utf-8"></head><body>${JSON.stringify({ brand, layout }, null, 2)}</body></html>`;
                  const blob = new Blob([htmlContent], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${brand.name || 'brand'}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                };

                return (
                  <div className="flex-1 bg-slate-950 flex flex-col h-full overflow-hidden">
                    <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 text-slate-400 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span className="font-semibold text-slate-200">{brand.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex bg-slate-800 rounded-lg p-0.5">
                          <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded ${viewMode === 'desktop' ? 'bg-slate-700 text-white' : 'hover:text-white'}`}>
                            <Monitor className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded ${viewMode === 'mobile' ? 'bg-slate-700 text-white' : 'hover:text-white'}`}>
                            <Smartphone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button onClick={exportHTML} className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg font-medium transition">
                          <Download className="w-3.5 h-3.5" /> Export Brand HTML
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-slate-950">
                      <div className={`transition-all duration-300 w-full bg-white shadow-2xl rounded-2xl overflow-hidden ${viewMode === 'mobile' ? 'max-w-[375px] min-h-[667px]' : 'max-w-5xl'}`}>
                        {layout.map((sec) => (
                          <RenderSection key={sec.id} section={sec} brand={brand} />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              };

              export default CanvasPreview;
