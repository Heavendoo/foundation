import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView, useSpring, useTransform } from 'motion/react';
import { SectionLabel, SectionTitle, SectionDesc } from './Shared';
import { collection, query, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const AnimatedCounter = ({ value, label }: { value: number, label: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const display = useTransform(spring, (current) => {
    if (current >= 1000000) return (current / 1000000).toFixed(1) + 'M+';
    if (current >= 1000) return (current / 1000).toFixed(1) + 'K+';
    return Math.floor(current).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      spring.set(value);
    }
  }, [isInView, value, spring]);

  return (
    <div ref={ref} className="flex flex-col">
       <motion.span className="text-3xl font-serif font-bold text-dark-base leading-none mb-1">
         {display}
       </motion.span>
       <span className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground font-bold">{label}</span>
    </div>
  );
};

export default function Home({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [stats, setStats] = useState({ treesPlanted: 1200000 });
  const [heroNews, setHeroNews] = useState<any>(null);

  useEffect(() => {
    const unsubStats = onSnapshot(doc(db, 'stats', 'global'), (snap) => {
      if (snap.exists()) {
        setStats(snap.data() as any);
      }
    });

    const qNews = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    const unsubNews = onSnapshot(qNews, (snap) => {
      const hero = snap.docs.find(d => d.data().isHero);
      if (hero) setHeroNews({ id: hero.id, ...hero.data() });
    });

    return () => {
      unsubStats();
      unsubNews();
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center px-6 md:px-12 hero-gradient border-b border-border-subtle overflow-hidden">
        <div className="max-w-7xl mx-auto w-full relative z-1 text-center">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="py-12 flex flex-col items-center"
          >
            <span className="text-green-mid font-serif italic text-2xl mb-4 block">Our Vision: A Greener Horizon</span>
            <h1 className="text-6xl md:text-8xl text-dark-base font-serif leading-[1.05] tracking-tight mb-8">
              Restoring the <br/>
              <span className="italic text-green-primary">Earth's Lungs</span>,<br/>
              One Sapling at a Time.
            </h1>
            <p className="text-xl text-dark-muted mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
              We connect technology with nature. From GPS-tagged reforestation to peer-reviewed ecological papers, we make every leaf count.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => onNavigate('records')}
                className="bg-green-primary text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest hover:bg-green-dark transition-all shadow-xl shadow-green-primary/20 cursor-pointer"
              >
                EXPLORE RECORDS
              </button>
              <button 
                onClick={() => onNavigate('donate')}
                className="bg-white text-dark-base border border-border-subtle px-10 py-5 rounded-full text-sm font-bold tracking-widest hover:bg-bg-soft transition-all cursor-pointer"
              >
                DONATE NOW
              </button>
            </div>

            <div className="flex justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border-subtle w-full max-w-2xl">
              <AnimatedCounter value={stats.treesPlanted} label="Trees Planted" />
              <AnimatedCounter value={450} label="Partners" />
              <AnimatedCounter value={12} label="Awards" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured News Section */}
      {heroNews && (
        <section className="py-20 px-6 md:px-12 bg-white">
           <div className="max-w-7xl mx-auto">
             <div className="bg-bg-soft rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row gap-12 items-center border border-border-subtle group hover:border-green-primary transition-all cursor-pointer" onClick={() => onNavigate('news')}>
               <div className="w-full md:w-1/3 aspect-square max-h-64 rounded-3xl overflow-hidden shadow-2xl shrink-0">
                 <img src={heroNews.image} alt={heroNews.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="flex-1">
                 <div className="flex items-center gap-4 mb-6">
                    <span className="bg-green-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">FEATURED STORY</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{heroNews.cat}</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-dark-base mb-6 leading-tight group-hover:text-green-primary transition-colors">
                    {heroNews.title}
                 </h2>
                 <p className="text-lg text-dark-muted line-clamp-2 mb-8 leading-relaxed font-normal">
                    {heroNews.excerpt}
                 </p>
                 <div className="text-[10px] text-green-primary font-black uppercase tracking-widest flex items-center gap-2">
                    Read the full story &rarr;
                 </div>
               </div>
             </div>
           </div>
        </section>
      )}

      {/* Feature Section */}
      <section className="py-28 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>OUR APPROACH</SectionLabel>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Public Transparency', desc: "We don't just say we plant. We show you. Every tree is recorded with GPS coordinates and visual Proof of Planting.", icon: '📍' },
              { title: 'Native Biodiversity', desc: 'Monocultures are fragile. We restore forests with native species tailored to the local eco-region for resilience.', icon: '🌿' },
              { title: 'Community Led', desc: 'Sustainability requires ownership. We partner with local communities to ensure forests are protected for generations.', icon: '🤝' }
            ].map((item, i) => (
              <div key={i} className="p-10 bg-bg-soft border border-border-subtle rounded-3xl hover:bg-white hover:border-green-primary/30 hover:shadow-2xl hover:shadow-black/5 transition-all group">
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="text-2xl font-serif font-bold mb-4">{item.title}</h3>
                <p className="text-dark-muted leading-relaxed font-normal">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
