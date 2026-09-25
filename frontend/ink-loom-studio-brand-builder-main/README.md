# Ink Loom Studio: Brand Builder

Build a modern, high-energy AI Brand Builder & Dynamic Landing Page Studio called "Ink Loom Studio". 

### OVERALL APP LAYOUT

Create a full-viewport, split-panel application with a dark mode base theme (Slate 950/900 background, Indigo/Violet accents).

1. LEFT PANEL (350px - 400px fixed width): "Interactive AI Copilot Drawer"

   - Header: "Ink Loom Studio" logo with a glowing AI badge and a live backend status pill.

   - Brand Control Deck: A collapsible card showing generated Brand Swatches (Primary, Secondary, Accent, BG), Google Typography selections, and a Motion Profile selector ("Energetic Stagger", "Minimal Fade", "Slide Reveal"). Allow direct color editing via visual color pickers.

   - Chat Feed: Multi-turn message history displaying user prompts and AI assistant replies in clean, rounded message bubbles.

   - Quick Action Deck: Quick-click buttons for actions like "Merge Layout Options", "Regenerate Palette", "Audit Clichés", and "Switch Motion Style".

   - Input Bar: Bottom-anchored text input with a send button and micro-loaders for active AI generation states.

2. RIGHT PANEL (Flex-1 remaining width): "Live Responsive Canvas"

   - Canvas Top Bar: Shows active brand title, heading/body font indicators, a Desktop/Mobile viewport toggle switch, and a prominent "Export Brand HTML / Assets" button.

   - Dynamic Canvas Area: A scrollable, centered container simulating a real browser window. Render landing page sections dynamically based on active JSON state.

### DYNAMIC LANDING PAGE COMPONENT LIBRARY

Create modular, visually rich React components that accept `brand` styling (colors, fonts) and use Framer Motion for scroll/entrance animations:

1. HeroBold Component: High-impact hero section with a floating badge, bold heading, subheadline, CTA button with arrow icons, and a dark/accent background.

2. HeroMinimal Component: Clean, editorial hero with left border accent lines, serif/sans contrast, and subtle text reveal animations.

3. FeaturesBento Component: Bento-grid layout with 3 interactive cards featuring hover scale effects, checkmark icons, and custom color accents.

4. CTAGlow Component: High-conversion bottom banner with a subtle glow overlay, email input box, and action button.

### STATE & DATA MOCKING

- Implement local React state for `messages`, `brandStrategy`, `pageLayout`, and `isGenerating`.

- Include initial mock state displaying a generated sample brand ("VibeCode AI") so the canvas looks populated immediately on first load.

- Ensure all color pickers, viewport switches, and section re-orders update the canvas in real-time.

- Style using Tailwind CSS with sleek glassmorphism effects (`backdrop-blur`, subtle borders `border-slate-800`), smooth transition animations, and modern Lucide React icons (`Sparkles`, `Palette`, `Layers`, `Monitor`, `Smartphone`, `Download`, `Send`).

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/32854b4f-256b-4dda-872a-796c2ec9f784).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
