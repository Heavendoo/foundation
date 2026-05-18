import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { SectionLabel, SectionTitle } from './Shared';
import { supabase } from '../lib/supabase';

export default function News() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (!error && data) {
        setArticles(data);
      } else {
        console.error('Supabase fetch error:', error);
      }
      setLoading(false);
    };

    fetchNews();

    // Subscribe to real-time changes on the 'news' table
    const subscription = supabase
      .channel('public:news')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, () => {
        fetchNews();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const defaultArticles = [
    { cat: 'MILESTONE', title: "We've Crossed 1 Million Trees Planted", excerpt: "Seven years in the making — our team celebrates a historic milestone and looks ahead to the next target.", image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000", emoji: "🌳" },
    { cat: 'RESEARCH', title: "Urban Trees Reduce Heat by Up to 8°C", excerpt: "New peer-reviewed findings from our research team highlight the cooling power of strategic urban planting.", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1000", emoji: "🔬" },
    { cat: 'PARTNERSHIP', title: "12 New Corporate Partners Join Our 2026 Green Drive", excerpt: "From tech startups to manufacturing giants — businesses stepping up their sustainability commitments.", image: "https://images.unsplash.com/photo-1521791136064-7986c295944c?auto=format&fit=crop&q=80&w=1000", emoji: "🤝" }
  ];

  const displayArticles = articles.length > 0 ? articles : defaultArticles;
  const heroArticle = displayArticles.find(a => a.isHero) || (articles.length > 0 ? null : displayArticles[0]);
  const regularArticles = displayArticles.filter(a => a !== heroArticle);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <section className="bg-dark-base py-32 px-6 md:px-12 text-white">
        <div className="max-w-7xl mx-auto">
          <SectionLabel className="text-green-mid">NEWSROOM</SectionLabel>
          <SectionTitle className="text-white text-6xl md:text-8xl !leading-[1.1] font-serif">Stories from <br /><span className="italic">the Field</span></SectionTitle>
          <p className="text-xl text-white/50 font-normal max-w-xl mt-8 leading-relaxed">Updates, milestones, partnerships, and insights from Heavendoo Foundation and our global community.</p>
        </div>
      </section>

      {heroArticle && !loading && (
        <section className="py-24 px-6 md:px-12 bg-white">
           <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                 <div className="relative rounded-[3rem] overflow-hidden aspect-[4/3] lg:aspect-square">
                    <img src={heroArticle.image} alt={heroArticle.title} className="w-full h-full object-cover" />
                    <div className="absolute top-8 left-8 bg-amber-400 text-white px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-xl">
                      Featured Milestone
                    </div>
                 </div>
                 <div>
                    <div className="text-[10px] font-black text-green-primary tracking-[0.3em] uppercase mb-6">
                      {heroArticle.cat || heroArticle.category}
                    </div>
                    <h2 className="text-5xl md:text-7xl font-serif font-bold text-dark-base mb-8 leading-[1.1]">
                      {heroArticle.title}
                    </h2>
                    <p className="text-xl text-dark-muted leading-relaxed mb-10">
                      {heroArticle.excerpt || heroArticle.desc}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center pt-10 border-t border-bg-soft">
                       <div className="text-[10px] text-muted-foreground font-black tracking-widest uppercase">
                          {heroArticle.createdAt ? heroArticle.createdAt.toDate().toLocaleDateString() : 'Featured Story'}
                          {heroArticle.sourceUrl && <span className="ml-4 text-green-primary">/ {heroArticle.sourceUrl}</span>}
                       </div>
                       <button className="bg-dark-base text-white px-10 py-5 rounded-full text-xs font-black tracking-widest uppercase hover:bg-green-primary transition-all shadow-xl shadow-dark-base/10">
                          Read The Full Story
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </section>
      )}
      
      <section className="py-24 px-6 md:px-12 bg-bg-soft">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
             <div className="col-span-full py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
             </div>
          ) : (
            regularArticles.map((a, i) => (
              <div key={i} className="bg-white border border-border-subtle rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all group flex flex-col">
                <div className="h-64 overflow-hidden relative">
                  {a.image ? (
                    <img src={a.image} alt={a.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-green-light flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-700">
                      {a.emoji || '🗞️'}
                    </div>
                  )}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-green-primary">
                    {a.cat || a.category}
                  </div>
                </div>
                <div className="p-10 flex-1 flex flex-col">
                  <h3 className="text-3xl font-serif font-bold mb-4 leading-[1.2] group-hover:text-green-primary transition-colors">{a.title}</h3>
                  <p className="text-base text-dark-muted font-normal leading-relaxed mb-8 line-clamp-3">{a.excerpt || a.desc}</p>
                  <div className="mt-auto pt-8 border-t border-border-subtle flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                    <div className="flex flex-col gap-1">
                       <span>{a.createdAt ? a.createdAt.toDate().toLocaleDateString() : (a.meta || 'Foundation Update')}</span>
                       {a.sourceUrl && <span className="text-green-primary/60">Source: {a.sourceUrl}</span>}
                    </div>
                    <span className="text-green-primary hover:underline underline-offset-4 cursor-pointer">Read &rarr;</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </motion.div>
  );
}
