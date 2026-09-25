import { useMemo, useState, useEffect, type CSSProperties, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Download,
  Layers3,
  LoaderCircle,
  Merge,
  Monitor,
  Palette,
  RefreshCw,
  ScanSearch,
  Send,
  Smartphone,
  Sparkles,
  WandSparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type MotionProfile = "Energetic Stagger" | "Minimal Fade" | "Slide Reveal";
type SectionKind = "hero" | "features" | "cta";

type BrandStrategy = {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  highlight: string;
  peach: string;
  headingFont: string;
  bodyFont: string;
  motion: MotionProfile;
};

type Message = { id: number; role: "assistant" | "user"; text: string };

const initialBrand: BrandStrategy = {
  name: "VibeCode AI",
  primary: "#01787D",
  secondary: "#7BB7AA",
  accent: "#CDA44B",
  background: "#FBF9F5",
  highlight: "#A80E0E",
  peach: "#CE7A5A",
  headingFont: "Playfair Display",
  bodyFont: "DM Sans",
  motion: "Minimal Fade",
};

const initialMessages: Message[] = [
  { id: 1, role: "user", text: "Build a bold identity for an AI prototyping studio." },
  { id: 2, role: "assistant", text: "I shaped VibeCode AI around editorial clarity: deep teal, burnished gold, and warm, direct language." },
  { id: 3, role: "assistant", text: "The landing page is ready. Adjust any brand token and watch the canvas respond." },
];

const palettes: Array<[string, string, string, string]> = [
  ["#01787D", "#7BB7AA", "#CDA44B", "#FBF9F5"],
  ["#155E63", "#9BC4B8", "#D7AA50", "#FFF9F0"],
  ["#0D676B", "#83AA9D", "#BF8C39", "#F6F0E7"],
];

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

function colorDetails(hex: string) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  const rgb = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  const normalized = rgb.map((channel) => channel / 255);
  const k = 1 - Math.max(...normalized);
  const cmy = k === 1 ? [0, 0, 0] : normalized.map((channel) => Math.round(((1 - channel - k) / (1 - k)) * 100));
  return { rgb: rgb.join(", "), cmyk: `${cmy[0]}, ${cmy[1]}, ${cmy[2]}, ${Math.round(k * 100)}` };
}

function BrandMark() {
  return (
    <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
      <Sparkles className="size-5" />
    </div>
  );
}

function HeroBold({ brand }: { brand: BrandStrategy }) {
  return (
    <section className="canvas-hero relative min-h-[520px] overflow-hidden px-8 py-10 md:px-14 md:py-14">
      <div className="canvas-grid absolute inset-0 opacity-25" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: brand.motion === "Minimal Fade" ? 0.8 : 0.5 }}
        className="relative z-10 flex min-h-[410px] flex-col justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="canvas-chip inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase">
            <span className="size-1.5 rounded-full bg-current" /> AI native studio
          </span>
          <span className="text-xs font-medium uppercase opacity-60">V / 01</span>
        </div>
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-2 text-xs font-bold uppercase opacity-70">
            <Zap className="size-4" /> Ideas to interface in minutes
          </p>
          <h1 className="canvas-heading max-w-3xl text-5xl font-semibold leading-[1.02] md:text-7xl">
            The art of digital craftsmanship.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed opacity-70 md:text-lg">
            VibeCode weaves editorial precision and intelligent tools into a distinctive, launch-ready brand.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="canvas-primary-button inline-flex h-11 items-center gap-2 px-5 text-sm font-bold">
              Start building <ArrowRight className="size-4" />
            </button>
            <button className="canvas-secondary-button inline-flex h-11 items-center px-5 text-sm font-semibold">
              View the system
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function HeroMinimal({ brand }: { brand: BrandStrategy }) {
  return (
    <section className="canvas-minimal px-8 py-20 md:px-16 md:py-28">
      <motion.div
        initial={{ opacity: 0, x: brand.motion === "Slide Reveal" ? -24 : 0 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="border-l-4 border-[var(--brand-accent)] pl-7"
      >
        <span className="text-xs font-bold uppercase opacity-50">Design velocity, without sameness</span>
        <h2 className="canvas-heading mt-5 max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
          A sharper way to move from concept to culture.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed opacity-60">
          Strategy, identity, and launch pages woven into one intelligent creative flow.
        </p>
      </motion.div>
    </section>
  );
}

function FeaturesBento({ brand }: { brand: BrandStrategy }) {
  const features = [
    { number: "01", title: "Find your signal", text: "Turn market noise into a precise position people remember." },
    { number: "02", title: "Build the system", text: "Generate a visual language that stays coherent as you grow." },
    { number: "03", title: "Ship with conviction", text: "Move from decisions to a polished launch without losing momentum." },
  ];
  return (
    <section className="canvas-features px-8 py-16 md:px-14 md:py-20">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="text-xs font-bold uppercase opacity-50">One connected system</p>
          <h2 className="canvas-heading mt-3 text-3xl font-bold md:text-5xl">Built for forward motion.</h2>
        </div>
        <span className="hidden text-sm opacity-50 md:block">From prompt → presence</span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {features.map((feature, index) => (
          <motion.article
            key={feature.number}
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className={cn("canvas-feature-card min-h-52 p-6", index === 0 && "md:row-span-2 md:min-h-[428px]")}
          >
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold opacity-40">{feature.number}</span>
                <span className="canvas-check grid size-8 place-items-center rounded-full"><Check className="size-4" /></span>
              </div>
              <div className={cn(index === 0 && "md:mt-32")}>
                <h3 className="canvas-heading text-2xl font-bold">{feature.title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed opacity-60">{feature.text}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function CTAGlow() {
  return (
    <section className="canvas-cta relative overflow-hidden px-8 py-20 text-center md:px-14 md:py-24">
      <div className="canvas-glow absolute inset-x-1/4 bottom-0 h-32" />
      <div className="relative mx-auto max-w-2xl">
        <WandSparkles className="mx-auto size-8" />
        <h2 className="canvas-heading mt-5 text-4xl font-bold md:text-6xl">Make the first move.</h2>
        <p className="mx-auto mt-4 max-w-lg opacity-65">Your clearest brand direction is one good prompt away.</p>
        <form className="canvas-email mx-auto mt-8 flex max-w-md gap-2 p-1.5" onSubmit={(event) => event.preventDefault()}>
          <input className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-hidden placeholder:opacity-40" placeholder="you@company.com" aria-label="Email address" />
          <button className="canvas-primary-button px-4 py-2 text-sm font-bold">Get early access</button>
        </form>
      </div>
    </section>
  );
}

function LandingCanvas({ brand, layout, compact }: { brand: BrandStrategy; layout: SectionKind[]; compact: boolean }) {
  const style = {
    "--brand-primary": brand.primary,
    "--brand-primary-rgb": hexToRgb(brand.primary),
    "--brand-secondary": brand.secondary,
    "--brand-accent": brand.accent,
    "--brand-bg": brand.background,
    "--brand-highlight": brand.highlight,
    "--brand-peach": brand.peach,
    "--brand-heading": `'${brand.headingFont}', serif`,
    "--brand-body": `'${brand.bodyFont}', sans-serif`,
  } as CSSProperties;

  return (
    <div className={cn("landing-canvas overflow-hidden", compact && "mobile-canvas")} style={style}>
      <div className="canvas-nav flex h-16 items-center justify-between px-7 md:px-10">
        <span className="canvas-heading text-lg font-bold">{brand.name}</span>
        <div className="flex items-center gap-5 text-xs font-semibold opacity-60"><span>Work</span><span>Process</span><span>About</span></div>
      </div>
      {layout.map((section) => {
        if (section === "hero") return <HeroBold key={section} brand={brand} />;
        if (section === "features") return <FeaturesBento key={section} brand={brand} />;
        return <CTAGlow key={section} />;
      })}
      <HeroMinimal brand={brand} />
    </div>
  );
}

export function BrandStudio() {
  const [brand, setBrand] = useState(initialBrand);
  const [messages, setMessages] = useState(initialMessages);
  const [layout, setLayout] = useState<SectionKind[]>(["hero", "features", "cta"]);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [deckOpen, setDeckOpen] = useState(true);
  const [paletteIndex, setPaletteIndex] = useState(0);

  const swatches = useMemo(() => [
    ["primary", "Primary Teal", brand.primary],
    ["secondary", "Muted Teal", brand.secondary],
    ["accent", "Golden Bronze", brand.accent],
    ["highlight", "Inferno", brand.highlight],
    ["peach", "Burnt Peach", brand.peach],
    ["background", "Sandy Ivory", brand.background],
  ] as const, [brand]);

  useEffect(() => {
    // Force dark background to ensure UI visibility during debugging
    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;
    document.body.style.background = "#000";
    document.body.style.color = "#fff";
    return () => {
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
    };
  }, []);

  const submitPrompt = async (event: FormEvent) => {
    event.preventDefault();
    if (!input.trim() || isGenerating) return;
    const text = input.trim();
    setMessages((current) => [...current, { id: Date.now(), role: "user", text }]);
    setInput("");
    setIsGenerating(true);

    try {
      const payload = {
        user_message: text,
        conversation_history: messages.map((m) => ({ role: m.role, content: m.text })),
        current_layout: layout,
        current_brand: brand,
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error: ${res.status} ${txt}`);
      }

      const data = await res.json();

      if (data.reply) {
        setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", text: String(data.reply) }]);
      }

      if (data.brand && typeof data.brand === "object") {
        const b: any = data.brand;
        setBrand((current) => ({
          ...current,
          name: b.name ?? b.brand_name ?? current.name,
          primary: b.primary_color ?? b.primary ?? current.primary,
          secondary: b.secondary_color ?? b.secondary ?? current.secondary,
          accent: b.accent_color ?? b.accent ?? current.accent,
          background: b.bg_color ?? b.background ?? current.background,
          highlight: b.highlight ?? current.highlight,
          peach: b.peach ?? current.peach,
          headingFont: b.heading_font ?? b.headingFont ?? current.headingFont,
          bodyFont: b.body_font ?? b.bodyFont ?? current.bodyFont,
          motion: (b.motion_profile ?? b.motion ?? current.motion) as MotionProfile,
        }));
      }

      if (Array.isArray(data.layout)) {
        const mapped = data.layout
          .map((s: any) => s.section_type || s.type || (s.template_id && (s.template_id.includes("hero") ? "hero" : s.template_id.includes("features") ? "features" : "cta")) )
          .filter(Boolean) as SectionKind[];
        if (mapped.length) setLayout(mapped);
      }
    } catch (err) {
      console.error("Backend integration error:", err);
      setMessages((current) => [...current, { id: Date.now() + 2, role: "assistant", text: "Sorry — I couldn't reach the AI engine. Check the backend and try again." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const regeneratePalette = () => {
    const next = (paletteIndex + 1) % palettes.length;
    const palette = palettes[next];
    if (!palette) return;
    setPaletteIndex(next);
    setBrand((current) => ({ ...current, primary: palette[0], secondary: palette[1], accent: palette[2], background: palette[3] }));
  };

  const reorder = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= layout.length) return;
    const next = [...layout];
    const selected = next[index];
    const target = next[nextIndex];
    if (!selected || !target) return;
    next[index] = target;
    next[nextIndex] = selected;
    setLayout(next);
  };

  const exportBrand = () => {
    const content = `<!doctype html><html><head><title>${brand.name}</title></head><body><h1>${brand.name}</h1><p>Primary: ${brand.primary}</p><p>Motion: ${brand.motion}</p></body></html>`;
    const blob = new Blob([content], { type: "text/html" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = `${brand.name.toLowerCase().replaceAll(" ", "-")}-brand.html`;
    anchor.click();
    URL.revokeObjectURL(href);
  };

  return (
    <main className="studio-shell flex min-h-screen flex-col overflow-hidden lg:h-screen lg:flex-row">
      <aside className="studio-drawer flex w-full shrink-0 flex-col border-b border-studio-border lg:h-screen lg:w-[390px] lg:border-r lg:border-b-0">
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-studio-border px-5">
          <div className="flex items-center gap-3">
            <BrandMark />
             <div><h1 className="font-display text-base font-semibold">Ink Loom Studio</h1><p className="text-[10px] uppercase text-muted-foreground">Editorial brand intelligence</p></div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-semibold text-success">
            <span className="size-1.5 rounded-full bg-success animate-pulse" /> Engine live
          </span>
        </header>

        <div className="flex-1 overflow-y-auto studio-scrollbar">
          <Collapsible open={deckOpen} onOpenChange={setDeckOpen} className="border-b border-studio-border px-4 py-4">
            <CollapsibleTrigger className="flex w-full items-center justify-between py-1 text-left">
              <span className="flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground"><Palette className="size-4 text-primary" /> Brand control deck</span>
              <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", deckOpen && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
               <div className="grid grid-cols-3 gap-2.5">
                {swatches.map(([key, label, color]) => (
                   <label key={key} className="swatch-card group cursor-pointer overflow-hidden border border-studio-border bg-studio-raised">
                     <span className="relative block h-24 overflow-hidden">
                       <input type="color" value={color} onChange={(event) => setBrand((current) => ({ ...current, [key]: event.target.value }))} className="absolute inset-0 h-full w-full cursor-pointer" aria-label={`${label} color`} />
                     </span>
                     <span className="block p-2">
                       <span className="mb-2 block min-h-6 text-[9px] font-semibold uppercase text-foreground">{label}</span>
                       <span className="block space-y-1 font-mono text-[8px] leading-tight text-muted-foreground">
                         <span className="flex justify-between gap-1"><span>HEX</span><span>{color.toUpperCase()}</span></span>
                         <span className="flex justify-between gap-1"><span>RGB</span><span>{colorDetails(color).rgb}</span></span>
                         <span className="flex justify-between gap-1"><span>CMYK</span><span>{colorDetails(color).cmyk}</span></span>
                       </span>
                     </span>
                  </label>
                ))}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <label className="text-[10px] font-semibold text-muted-foreground">Heading
                  <Select value={brand.headingFont} onValueChange={(value) => setBrand((current) => ({ ...current, headingFont: value }))}>
                    <SelectTrigger className="mt-1.5 h-8 border-studio-border bg-studio-raised text-xs"><SelectValue /></SelectTrigger>
                     <SelectContent><SelectItem value="Playfair Display">Playfair Display</SelectItem><SelectItem value="Instrument Serif">Instrument Serif</SelectItem><SelectItem value="DM Serif Display">DM Serif Display</SelectItem></SelectContent>
                  </Select>
                </label>
                <label className="text-[10px] font-semibold text-muted-foreground">Body
                  <Select value={brand.bodyFont} onValueChange={(value) => setBrand((current) => ({ ...current, bodyFont: value }))}>
                    <SelectTrigger className="mt-1.5 h-8 border-studio-border bg-studio-raised text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="DM Sans">DM Sans</SelectItem><SelectItem value="Manrope">Manrope</SelectItem><SelectItem value="Work Sans">Work Sans</SelectItem></SelectContent>
                  </Select>
                </label>
              </div>
              <label className="mt-4 block text-[10px] font-semibold text-muted-foreground">Motion profile
                <Select value={brand.motion} onValueChange={(value: MotionProfile) => setBrand((current) => ({ ...current, motion: value }))}>
                  <SelectTrigger className="mt-1.5 h-9 border-studio-border bg-studio-raised text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Energetic Stagger">Energetic Stagger</SelectItem><SelectItem value="Minimal Fade">Minimal Fade</SelectItem><SelectItem value="Slide Reveal">Slide Reveal</SelectItem></SelectContent>
                </Select>
              </label>
            </CollapsibleContent>
          </Collapsible>

          <section className="px-4 py-5">
            <div className="mb-4 flex items-center justify-between"><span className="text-xs font-bold uppercase text-muted-foreground">Copilot thread</span><span className="text-[10px] text-muted-foreground">03 insights</span></div>
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div className={cn("max-w-[88%] rounded-lg px-3.5 py-3 text-xs leading-relaxed", message.role === "user" ? "bg-primary text-primary-foreground" : "border border-studio-border bg-studio-raised text-foreground")}>
                    {message.role === "assistant" && <Sparkles className="mb-2 size-3.5 text-primary" />}{message.text}
                  </div>
                </div>
              ))}
              {isGenerating && <div className="flex items-center gap-2 text-xs text-muted-foreground"><LoaderCircle className="size-3.5 animate-spin text-primary" /> Weaving direction…</div>}
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-studio-border bg-studio-panel p-4">
          <div className="mb-3 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="justify-start border-studio-border bg-studio-raised text-[10px]" onClick={() => setLayout([...layout].reverse())}><Merge /> Merge layout</Button>
            <Button variant="outline" size="sm" className="justify-start border-studio-border bg-studio-raised text-[10px]" onClick={regeneratePalette}><RefreshCw /> New palette</Button>
            <Button variant="outline" size="sm" className="justify-start border-studio-border bg-studio-raised text-[10px]" onClick={() => setMessages((current) => [...current, { id: Date.now(), role: "assistant", text: "Cliché audit complete: the copy is specific, active, and free of generic AI claims." }])}><ScanSearch /> Audit clichés</Button>
            <Button variant="outline" size="sm" className="justify-start border-studio-border bg-studio-raised text-[10px]" onClick={() => setBrand((current) => ({ ...current, motion: current.motion === "Minimal Fade" ? "Energetic Stagger" : "Minimal Fade" }))}><Zap /> Switch motion</Button>
          </div>
          <form onSubmit={submitPrompt} className="flex items-center gap-2 rounded-lg border border-studio-border bg-studio-raised p-1.5 focus-within:border-primary/70">
            <input value={input} onChange={(event) => setInput(event.target.value)} className="min-w-0 flex-1 bg-transparent px-2 text-xs outline-hidden placeholder:text-muted-foreground" placeholder="Ask the brand copilot…" />
            <Button size="icon" className="size-8" disabled={isGenerating} aria-label="Send prompt"><Send className="size-3.5" /></Button>
          </form>
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col bg-studio-workspace lg:h-screen">
        <header className="flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b border-studio-border bg-studio-panel px-4 py-3 md:px-6">
          <div><div className="flex items-center gap-2"><Layers3 className="size-4 text-primary" /><h2 className="font-display text-sm font-bold">{brand.name}</h2></div><p className="mt-1 text-[10px] text-muted-foreground">{brand.headingFont} / {brand.bodyFont}</p></div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-studio-border bg-studio-raised p-1">
              <Button size="sm" variant={viewport === "desktop" ? "default" : "ghost"} className="h-7 px-2.5" onClick={() => setViewport("desktop")} aria-label="Desktop preview"><Monitor className="size-3.5" /></Button>
              <Button size="sm" variant={viewport === "mobile" ? "default" : "ghost"} className="h-7 px-2.5" onClick={() => setViewport("mobile")} aria-label="Mobile preview"><Smartphone className="size-3.5" /></Button>
            </div>
            <Button className="h-9 text-xs" onClick={exportBrand}><Download className="size-4" /><span className="hidden sm:inline">Export Brand HTML / Assets</span><span className="sm:hidden">Export</span></Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <div className="hidden w-12 shrink-0 flex-col items-center gap-2 border-r border-studio-border py-4 xl:flex">
            {layout.map((section, index) => (
              <div key={section} className="flex flex-col items-center gap-1">
                <Button variant="ghost" size="icon" className="size-7" onClick={() => reorder(index, -1)} disabled={index === 0} aria-label={`Move ${section} up`}><ArrowUp /></Button>
                <span className="writing-vertical text-[9px] font-bold uppercase text-muted-foreground">{section}</span>
                <Button variant="ghost" size="icon" className="size-7" onClick={() => reorder(index, 1)} disabled={index === layout.length - 1} aria-label={`Move ${section} down`}><ArrowDown /></Button>
              </div>
            ))}
          </div>
          <div className="studio-canvas-area min-w-0 flex-1 overflow-auto p-4 md:p-7">
            <div className={cn("mx-auto transition-[width] duration-500", viewport === "desktop" ? "w-full max-w-[1120px]" : "w-[390px] max-w-full")}>
              <div className="browser-chrome flex h-9 items-center gap-2 rounded-t-lg border border-studio-border px-3">
                <span className="size-2 rounded-full bg-browser-red" /><span className="size-2 rounded-full bg-browser-yellow" /><span className="size-2 rounded-full bg-browser-green" />
                <span className="ml-3 flex-1 rounded-sm bg-studio-panel px-3 py-1 text-center text-[9px] text-muted-foreground">vibecode.ai</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={`${viewport}-${brand.motion}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <LandingCanvas brand={brand} layout={layout} compact={viewport === "mobile"} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}