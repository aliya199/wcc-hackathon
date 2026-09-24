import React from 'react'
import { motion, Variants } from 'framer-motion'
import { PageSection, BrandStrategy } from '../types/brand'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

interface ComponentProps {
  section: PageSection
  brand: BrandStrategy
}

const getMotionVariants = (profile: string): Variants => {
  if (profile === 'minimal_fade') {
    return { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }
  }
  if (profile === 'slide_reveal') {
    return { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5 } } }
  }
  return { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.15 } } }
}

export const HeroBold: React.FC<ComponentProps> = ({ section, brand }) => {
  const variants = getMotionVariants(brand.motion_profile)
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} className="min-h-[70vh] flex flex-col justify-center items-center text-center px-6 py-20 relative overflow-hidden" style={{ backgroundColor: brand.bg_color }}>
      <motion.div variants={variants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 shadow-sm border" style={{ borderColor: brand.accent_color, color: brand.accent_color }}>
        <Sparkles className="w-4 h-4" /> {brand.name} Identity System
      </motion.div>
      <motion.h1 variants={variants} className="text-5xl md:text-7xl font-extrabold max-w-4xl tracking-tight mb-6" style={{ color: brand.primary_color, fontFamily: brand.heading_font }}>
        {section.content.headline || 'Transform Your Vision Into Reality'}
      </motion.h1>
      <motion.p variants={variants} className="text-lg md:text-xl max-w-2xl mb-8 leading-relaxed opacity-80" style={{ color: brand.secondary_color, fontFamily: brand.body_font }}>
        {section.content.subheadline || brand.tagline}
      </motion.p>
      <motion.button variants={variants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 rounded-xl font-bold text-white shadow-lg flex items-center gap-2" style={{ backgroundColor: brand.accent_color }}>
        {section.content.cta_text || 'Get Started'} <ArrowRight className="w-5 h-5" />
      </motion.button>
    </motion.section>
  )
}

export const HeroMinimal: React.FC<ComponentProps> = ({ section, brand }) => {
  const variants = getMotionVariants(brand.motion_profile)
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} className="min-h-[60vh] flex flex-col justify-center px-8 py-16" style={{ backgroundColor: brand.bg_color }}>
      <div className="max-w-5xl mx-auto border-l-4 pl-8" style={{ borderColor: brand.accent_color }}>
        <motion.h1 variants={variants} className="text-4xl md:text-6xl font-serif mb-4" style={{ color: brand.primary_color, fontFamily: brand.heading_font }}>
          {section.content.headline}
        </motion.h1>
        <motion.p variants={variants} className="text-lg max-w-xl mb-6 opacity-75" style={{ color: brand.secondary_color, fontFamily: brand.body_font }}>
          {section.content.subheadline}
        </motion.p>
        <motion.button variants={variants} className="underline font-semibold text-lg" style={{ color: brand.accent_color }}>
          {section.content.cta_text} →
        </motion.button>
      </div>
    </motion.section>
  )
}

export const FeaturesBento: React.FC<ComponentProps> = ({ section, brand }) => {
  const variants = getMotionVariants(brand.motion_profile)
  const items = section.content.items || [
    { title: 'Dynamic Intelligence', desc: 'Automated brand decisions in real-time.' },
    { title: 'Modular Architecture', desc: 'Stitch and merge design systems effortlessly.' },
    { title: 'Launch Ready', desc: 'Export clean code and visual assets instantly.' }
  ]

  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} className="py-20 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12" style={{ color: brand.primary_color, fontFamily: brand.heading_font }}>
        {section.content.title || 'Engineered for Distinctiveness'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <motion.div key={idx} variants={variants} whileHover={{ y: -5 }} className="p-6 rounded-2xl border shadow-sm flex flex-col justify-between" style={{ backgroundColor: brand.bg_color, borderColor: '#E5E7EB' }}>
            <div>
              <CheckCircle2 className="w-8 h-8 mb-4" style={{ color: brand.accent_color }} />
              <h3 className="text-xl font-bold mb-2" style={{ color: brand.primary_color, fontFamily: brand.heading_font }}>{item.title}</h3>
              <p className="text-sm opacity-75 leading-relaxed" style={{ color: brand.secondary_color, fontFamily: brand.body_font }}>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export const CTAGlow: React.FC<ComponentProps> = ({ section, brand }) => {
  const variants = getMotionVariants(brand.motion_profile)
  return (
    <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} variants={variants} className="py-20 px-6">
      <div className="max-w-4xl mx-auto rounded-3xl p-10 text-center relative overflow-hidden shadow-2xl" style={{ backgroundColor: brand.primary_color }}>
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: brand.heading_font }}>
            {section.content.headline || 'Ready to launch your brand?'}
          </h2>
          <p className="text-gray-300 mb-8 max-w-lg mx-auto" style={{ fontFamily: brand.body_font }}>
            {section.content.subheadline || 'Generate your identity and dynamic landing page in under 2 minutes.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Enter your email" className="px-4 py-3 rounded-xl text-black outline-none flex-1" />
            <button className="px-6 py-3 rounded-xl font-bold text-white shadow" style={{ backgroundColor: brand.accent_color }}>
              {section.content.cta_text || 'Claim Access'}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export const RenderSection: React.FC<ComponentProps> = (props) => {
  switch (props.section.template_id) {
    case 'hero_minimal_02':
      return <HeroMinimal {...props} />
    case 'features_bento_01':
    case 'features_grid_02':
      return <FeaturesBento {...props} />
    case 'cta_glow_01':
      return <CTAGlow {...props} />
    case 'hero_bold_01':
    default:
      return <HeroBold {...props} />
  }
}

export default RenderSection
