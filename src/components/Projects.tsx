import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionLabel, SectionTitle, SectionDesc } from './Shared';
import { supabase } from '../lib/supabase';
import { ChevronDown, FileText, Download, Clock, IndianRupee, CalendarRange, BookOpen, ExternalLink } from 'lucide-react';

interface ProjectDoc {
  title: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'Research' | 'In Progress' | 'Active' | 'Completed';
  emoji: string;
  learnings: string;
  estimatedCost: string;
  timeline: string;
  documents: ProjectDoc[];
  updatedAt?: any;
  createdAt?: any;
}

const statusColors: Record<string, string> = {
  'Research': 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-blue-50 text-blue-700 border-blue-200',
  'Active': 'bg-green-light text-green-primary border-green-primary/20',
  'Completed': 'bg-bg-soft text-dark-muted border-border-subtle',
};

const defaultProjects: Omit<Project, 'id'>[] = [
  {
    title: 'Tree Aforestation',
    category: 'Sustainability',
    description: 'Our flagship large-scale tree planting initiative across India. We identify degraded land, partner with local communities, and plant native species to restore ecosystems, improve air quality, and create green corridors for wildlife.',
    status: 'Active',
    emoji: '🌳',
    learnings: 'Native species show 3x higher survival rate compared to exotic varieties. Community involvement is critical for long-term maintenance. Monsoon planting windows yield best results.',
    estimatedCost: '₹25,00,000',
    timeline: 'Ongoing since Q1 2026',
    documents: [
      { title: 'Aforestation Strategy 2026', url: '#' },
      { title: 'Species Selection Guide', url: '#' },
    ],
  },
  {
    title: 'Carbon Credit Crypto Coin',
    category: 'Climate Tech',
    description: 'A cryptocurrency backed by verified carbon credits generated from our tree planting operations. Each token represents measurable CO₂ offset, creating a transparent, tradable instrument for climate-conscious investors and organisations.',
    status: 'Research',
    emoji: '🪙',
    learnings: 'Exploring Polygon blockchain for low gas fees. Verra and Gold Standard certifications being evaluated for carbon credit verification. Tokenomics model in early design phase.',
    estimatedCost: '₹40,00,000',
    timeline: 'Q3 2026 — Q2 2027',
    documents: [
      { title: 'Tokenomics Whitepaper (Draft)', url: '#' },
    ],
  },
  {
    title: 'Tress DNFT',
    category: 'Blockchain',
    description: 'Dynamic NFTs that represent living trees in our registry. Each DNFT evolves over time — changing its visual representation as the real tree grows from sapling to thriving canopy, creating a living digital twin of nature.',
    status: 'In Progress',
    emoji: '🖼️',
    learnings: 'Metadata update triggers linked to IoT sensors on flagship trees. Art generation pipeline using AI for tree growth stages. Partnership discussions with NFT marketplaces underway.',
    estimatedCost: '₹18,00,000',
    timeline: 'Q2 2026 — Q4 2026',
    documents: [
      { title: 'DNFT Technical Specification', url: '#' },
      { title: 'Art Evolution Framework', url: '#' },
    ],
  },
  {
    title: 'Water Salination Plant',
    category: 'Infrastructure',
    description: 'A solar-powered water desalination and purification facility designed for coastal and arid communities. Using advanced reverse osmosis technology to convert brackish and seawater into safe drinking water at scale.',
    status: 'Research',
    emoji: '💧',
    learnings: 'Solar-thermal hybrid systems reduce energy costs by 40%. Pilot site identification underway in coastal Odisha. Community needs assessment surveys completed for 3 villages.',
    estimatedCost: '₹1,20,00,000',
    timeline: 'Q1 2027 — Q4 2028',
    documents: [
      { title: 'Feasibility Study Report', url: '#' },
    ],
  },
  {
    title: 'Own AI',
    category: 'Technology',
    description: 'Proprietary artificial intelligence models built for ecological monitoring, tree health analysis, carbon calculation, and operational automation. Our AI analyses satellite imagery, drone footage, and ground sensor data to optimise reforestation outcomes.',
    status: 'In Progress',
    emoji: '🤖',
    learnings: 'Computer vision models achieving 94% accuracy on tree species identification from drone imagery. NLP pipeline for auto-generating field reports from volunteer notes. GPU infrastructure being set up in-house.',
    estimatedCost: '₹35,00,000',
    timeline: 'Q2 2026 — Ongoing',
    documents: [
      { title: 'AI Architecture Overview', url: '#' },
      { title: 'Model Training Pipeline', url: '#' },
      { title: 'Data Ethics Policy', url: '#' },
    ],
  },
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (!error && data) {
        setProjects(data as Project[]);
      } else {
        console.warn('Projects collection not accessible yet, using defaults:', error);
      }
      setLoading(false);
    };

    fetchProjects();

    const subscription = supabase
      .channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchProjects();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const displayProjects: Project[] = projects.length > 0
    ? projects
    : defaultProjects.map((p, i) => ({ ...p, id: `default-${i}` }));

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Section */}
      <section className="py-32 px-6 md:px-12 bg-bg-soft relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="max-w-7xl mx-auto relative">
          <SectionLabel>INITIATIVES & INNOVATION</SectionLabel>
          <SectionTitle className="text-6xl md:text-8xl">
            Our <span className="italic">Projects</span>
          </SectionTitle>
          <SectionDesc className="mb-8 text-xl max-w-3xl">
            From reforestation to blockchain, from water purification to artificial intelligence — we're building the future of environmental stewardship through bold, interconnected initiatives.
          </SectionDesc>

          {/* Stats bar */}
          <div className="flex flex-wrap gap-6 mt-12">
            {[
              { label: 'Active Projects', value: displayProjects.filter(p => p.status === 'Active').length.toString() },
              { label: 'In Progress', value: displayProjects.filter(p => p.status === 'In Progress').length.toString() },
              { label: 'Research Phase', value: displayProjects.filter(p => p.status === 'Research').length.toString() },
              { label: 'Total Initiatives', value: displayProjects.length.toString() },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-border-subtle rounded-2xl px-8 py-5 shadow-sm">
                <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-1">{s.label}</div>
                <div className="text-3xl font-serif font-bold text-green-primary">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-8">
              {displayProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <div
                    className={`bg-white border rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all duration-500 overflow-hidden ${
                      expandedId === project.id ? 'border-green-primary/30 shadow-xl shadow-green-primary/5' : 'border-border-subtle'
                    }`}
                  >
                    {/* Card Header — always visible */}
                    <button
                      onClick={() => toggleExpand(project.id)}
                      className="w-full p-10 md:p-12 flex items-center gap-8 text-left cursor-pointer group"
                    >
                      <div className="text-5xl md:text-6xl bg-bg-soft w-24 h-24 flex items-center justify-center rounded-3xl group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                        {project.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-[10px] font-bold bg-bg-soft text-green-primary px-3 py-1.5 rounded-full uppercase tracking-widest">
                            {project.category}
                          </span>
                          <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border ${statusColors[project.status] || statusColors['Research']}`}>
                            {project.status}
                          </span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-serif font-bold text-dark-base group-hover:text-green-primary transition-colors leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-sm text-dark-muted mt-3 line-clamp-2 leading-relaxed max-w-2xl">
                          {project.description}
                        </p>
                      </div>

                      <div className={`p-3 bg-bg-soft rounded-full transition-transform duration-300 flex-shrink-0 ${
                        expandedId === project.id ? 'rotate-180' : ''
                      }`}>
                        <ChevronDown size={20} className="text-dark-muted" />
                      </div>
                    </button>

                    {/* Expanded Detail Section */}
                    <AnimatePresence>
                      {expandedId === project.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="px-10 md:px-12 pb-12 pt-0">
                            <div className="border-t border-border-subtle pt-10" />

                            {/* Info Cards Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                              <div className="bg-bg-soft rounded-2xl p-6">
                                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                  <IndianRupee size={16} />
                                  <span className="text-[10px] font-black tracking-widest uppercase">Estimated Cost</span>
                                </div>
                                <div className="text-2xl font-serif font-bold text-dark-base">
                                  {project.estimatedCost || '—'}
                                </div>
                              </div>

                              <div className="bg-bg-soft rounded-2xl p-6">
                                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                  <CalendarRange size={16} />
                                  <span className="text-[10px] font-black tracking-widest uppercase">Timeline</span>
                                </div>
                                <div className="text-2xl font-serif font-bold text-dark-base">
                                  {project.timeline || '—'}
                                </div>
                              </div>

                              <div className="bg-bg-soft rounded-2xl p-6">
                                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                  <Clock size={16} />
                                  <span className="text-[10px] font-black tracking-widest uppercase">Last Updated</span>
                                </div>
                                <div className="text-lg font-serif font-bold text-dark-base">
                                  {project.updatedAt
                                    ? new Date(project.updatedAt.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                    : 'Recently'
                                  }
                                </div>
                              </div>
                            </div>

                            {/* Learnings */}
                            {project.learnings && (
                              <div className="mb-10">
                                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                  <BookOpen size={16} />
                                  <span className="text-[10px] font-black tracking-widest uppercase">Key Learnings & Updates</span>
                                </div>
                                <div className="bg-green-light/30 border border-green-primary/10 rounded-2xl p-8">
                                  <p className="text-sm text-dark-muted leading-relaxed whitespace-pre-line">
                                    {project.learnings}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Documentation */}
                            {project.documents && project.documents.length > 0 && (
                              <div>
                                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                                  <FileText size={16} />
                                  <span className="text-[10px] font-black tracking-widest uppercase">Documentation</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {project.documents.map((doc, di) => (
                                    <a
                                      key={di}
                                      href={doc.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="flex items-center gap-4 bg-bg-soft border border-border-subtle rounded-2xl p-5 hover:border-green-primary hover:bg-green-light/20 transition-all group"
                                    >
                                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-primary shadow-sm flex-shrink-0">
                                        <FileText size={20} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-dark-base truncate group-hover:text-green-primary transition-colors">
                                          {doc.title}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                                          PDF Document
                                        </div>
                                      </div>
                                      <ExternalLink size={16} className="text-muted-foreground group-hover:text-green-primary transition-colors flex-shrink-0" />
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-12 bg-bg-soft">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-8">🚀</div>
          <SectionTitle className="text-5xl md:text-6xl">
            Want to <span className="italic">Collaborate?</span>
          </SectionTitle>
          <SectionDesc className="mx-auto mb-12 text-xl">
            We're always looking for partners, researchers, and visionaries who share our mission. Whether you bring expertise in blockchain, AI, ecology, or community building — let's create impact together.
          </SectionDesc>
        </div>
      </section>
    </motion.div>
  );
}
