import React from 'react';
import { motion } from 'motion/react';
import { SectionLabel, SectionTitle, SectionDesc } from './Shared';

export default function Vision() {
  const pillars = [
    { num: '01', title: 'Restore', desc: 'Plant native species at scale, restore degraded land, and bring back ecosystems that communities depend on.' },
    { num: '02', title: 'Record', desc: "Build the world's most transparent tree database — publicly accessible, GPS-verified, and regularly updated." },
    { num: '03', title: 'Educate', desc: 'Partner with schools, universities, and businesses to build a generation that understands its ecological responsibility.' }
  ];

  const milestones = [
    { year: '2019', title: 'Foundation Established', desc: 'Heavendoo Foundation was registered as a nonprofit, planting our first 1,000 trees in Uttar Pradesh.' },
    { year: '2021', title: '100,000 Trees Milestone', desc: 'Expanded operations to 5 states with a network of 200 community volunteers and 10 corporate partners.' },
    { year: '2023', title: 'Research Wing Launched', desc: 'Partnered with IIT Delhi and IARI to publish the first Heavendoo research papers on urban ecology.' },
    { year: '2026', title: '1 Million Trees & Global Expansion', desc: 'Operating in 48 countries, with live public records and 12 new corporate partners.' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Vision Hero */}
      <section className="bg-dark-base py-32 px-6 md:px-12 relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 border border-white/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-1">
          <SectionLabel className="text-green-mid">OUR PURPOSE</SectionLabel>
          <SectionTitle className="text-white text-6xl md:text-8xl !leading-[1.1] max-w-2xl font-serif">
            A World Where<br />Every Life is<br /><span className="italic">Rooted in Nature</span>
          </SectionTitle>
          <SectionDesc className="text-white/60 max-w-xl text-xl mt-8">
            We envision a planet where reforestation is not an option — it is a foundation. Our mission is to restore 100 million hectares of land by 2050.
          </SectionDesc>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            {pillars.map((p, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-12 hover:bg-white/[0.08] transition-all group">
                <div className="text-6xl font-serif font-bold text-white/10 group-hover:text-green-primary/40 leading-none mb-8 transition-colors">{p.num}</div>
                <h4 className="text-2xl font-bold text-white mb-4">{p.title}</h4>
                <p className="text-base text-white/50 leading-relaxed font-normal">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* test 
      {/* Roadmap Section
      <section className="py-32 px-6 md:px-12 bg-bg-soft">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-24">
            <SectionLabel>OUR JOURNEY</SectionLabel>
            <SectionTitle>Growth and Milestones</SectionTitle>
          </div>

          <div className="space-y-16 relative">
            {/* Timeline line 
            <div className="absolute left-[39px] md:left-[159px] top-0 bottom-0 w-px bg-border-subtle" />

            {milestones.map((m, i) => (
              <div key={i} className="grid grid-cols-[80px_1fr] md:grid-cols-[200px_1fr] gap-8 md:gap-20  group relative">
                <div className="text-3xl md:text-5xl font-serif font-bold text-dark-base md:text-right pt-2">{m.year}</div>
                <div className="relative pl-12 md:pl-0 pb-4">
                  <div className="absolute -left-[54px] md:-left-[46px] top-4 md:top-6 w-3 h-3 bg-green-primary rounded-full group-hover:scale-150 transition-all shadow-lg shadow-green-primary/30 z-1" />
                  <h4 className="text-2xl md:text-3xl font-bold text-dark-base mb-3 leading-tight">{m.title}</h4>
                  <p className="text-lg text-dark-muted leading-relaxed font-normal">{m.desc}</p>
                </div>
              </div>
            ))}

            {/* Future Target 
            <div className="grid grid-cols-[80px_1fr] md:grid-cols-[200px_1fr] gap-8 md:gap-20 opacity-40 group">
              <div className="text-3xl md:text-5xl font-serif font-bold text-dark-muted md:text-right pt-2">2030</div>
              <div className="relative pl-12 md:pl-0">
                <div className="absolute -left-[54px] md:-left-[46px] top-4 md:top-6 w-3 h-3 bg-dark-muted rounded-full" />
                <h4 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">Target: 10 Million Trees</h4>
                <p className="text-lg text-dark-muted leading-relaxed font-normal">Reach 80 countries and achieve 1 million tons of annual CO₂ offset.</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </motion.div>
  );
}
