export interface BrandStrategy {
  name: string;
  tagline: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  bg_color: string;
  heading_font: string;
  body_font: string;
  motion_profile: 'energetic_stagger' | 'minimal_fade' | 'slide_reveal';
}

export interface SectionContent {
  headline?: string;
  subheadline?: string;
  cta_text?: string;
  title?: string;
  items?: Array<{ title: string; desc: string }>;
}

export interface PageSection {
  id: string;
  template_id: string;
  section_type: 'hero' | 'features' | 'cta';
  content: SectionContent;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
