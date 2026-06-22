import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SectionLabel, SectionTitle, SectionDesc } from './Shared';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { FileText, Download } from 'lucide-react';

export const Research = () => {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'research'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setPapers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'research'));
  }, []);

  const defaultPapers = [
    { category: 'ECOLOGY', title: 'Urban Reforestation and Microclimate Regulation', author: 'Dr. Anita Rao, Prof. S. Kumar', summary: 'Peer-reviewed research on Micro-Climate resilience.', downloadUrl: '#' },
    { category: 'BIODIVERSITY', title: 'Native Species Recovery', author: 'Dr. M. Banerjee, T. Gupta', summary: 'Biodiversity monitoring in restored habitats.', downloadUrl: '#' }
  ];

  const displayPapers = papers.length > 0 ? papers : defaultPapers;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-32 px-6 max-w-7xl mx-auto min-h-screen">
      <SectionLabel>KNOWLEDGE BASE</SectionLabel>
      <SectionTitle className="text-6xl md:text-8xl">Research & <span className="italic">Papers</span></SectionTitle>
      <SectionDesc className="mb-20 text-xl">
        Our field scientists and partner universities publish peer-reviewed research on reforestation, ecology, and climate resilience.
      </SectionDesc>

      <div className="grid md:grid-cols-2 gap-10">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          displayPapers.map((p, i) => (
            <div key={i} className="bg-white border border-border-subtle p-12 rounded-[2.5rem] hover:shadow-2xl hover:shadow-black/5 transition-all group flex flex-col">
              <div className="w-12 h-12 bg-bg-soft rounded-xl flex items-center justify-center text-green-primary mb-8">
                <FileText size={24} />
              </div>
              <div className="flex gap-2 mb-6">
                <span className="text-[10px] font-bold bg-bg-soft text-green-primary px-3 py-1.5 rounded-full uppercase tracking-widest">
                  {p.category || p.tags?.[0]}
                </span>
              </div>
              <h3 className="text-3xl font-serif font-bold mb-6 leading-tight group-hover:text-green-primary transition-colors">{p.title}</h3>
              <p className="text-sm text-dark-muted mb-8 line-clamp-3 leading-relaxed">{p.summary}</p>
              <div className="mt-auto flex justify-between items-center pt-10 border-t border-bg-soft">
                <div>
                  <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Author</div>
                  <div className="text-xs font-bold text-dark-base">{p.author || p.authors}</div>
                </div>
                <a
                  href={p.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-green-primary bg-bg-soft px-8 py-4 rounded-full hover:bg-green-primary hover:text-white transition-all uppercase tracking-widest flex items-center gap-2"
                >
                  <Download size={14} /> DOWNLOAD PDF
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export const About = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <section className="bg-bg-soft py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <div>
          <SectionLabel>WHO WE ARE</SectionLabel>
          <SectionTitle>We Plant Trees.<br />We Record &
            We Maintaine.<br /><span className="italic">We Make it Last.</span></SectionTitle>
          <p className="text-xl text-dark-muted font-normal leading-relaxed mb-10 max-w-lg">
            Heavendoo Foundation is a nonprofit organisation dedicated to large-scale, transparent reforestation. Every tree planted is a promise to the next generation.
          </p>
          <div className="bg-white border border-border-subtle p-10 inline-block rounded-[2rem] shadow-xl shadow-black/5">
            <div className="text-[10px] text-muted-foreground font-bold tracking-[2px] uppercase mb-2">Established In</div>
            <div className="text-5xl font-bold font-serif text-dark-base mb-2">2026</div>
            <div className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Chandigarh, India</div>
            <div className="text-[10px] text-green-primary font-bold tracking-widest uppercase">Reg. Nonprofit Organization</div>
          </div>
        </div>
        <div className="aspect-[4/5] bg-green-light rounded-[3rem] shadow-2xl relative overflow-hidden flex items-center justify-center text-[18rem] group">
          <span className="group-hover:scale-110 transition-transform duration-700 select-none">🌳</span>
          <div className="absolute inset-0 bg-dark-base/5" />
        </div>
      </div>
    </section>

    <section className="py-32 px-6 md:px-12 bg-white">
      <div className="max-w-7xl mx-auto text-center mb-24">
        <SectionLabel>LEADERSHIP</SectionLabel>
        <SectionTitle>The People Behind<br /><span className="italic">Every Tree</span></SectionTitle>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {[
          { name: 'Rishabh Raj', role: 'Director, Tech & Marketing', initials: 'RR', color: 'bg-bg-soft text-dark-base' },
          { name: 'Charanjeet Singh', role: 'Director, Operations', initials: 'CS', color: 'bg-bg-soft text-dark-base' },
          { name: 'Tushar Sharma ', role: 'Director, Publich Relation ', initials: 'TS', color: 'bg-bg-soft text-dark-base' },
          { name: 'Sanyam Poonia', role: 'Director, Outreach & Partnerships', initials: 'SP', color: 'bg-bg-soft text-dark-base' },

        ].map((m, i) => (
          <div key={i} className="text-center group">
            <div className={`w-32 h-32 rounded-full ${m.color} mx-auto mb-8 flex items-center justify-center text-3xl font-serif font-bold group-hover:bg-green-primary group-hover:text-white transition-all shadow-lg border border-border-subtle`}>
              {m.initials}
            </div>
            <h4 className="text-2xl font-serif font-bold mb-2">{m.name}</h4>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  </motion.div>
);

export const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ firstName: '', lastName: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'leads');
      setStatus('idle');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-32 px-6 bg-bg-soft min-h-screen">
      <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.4fr] gap-20 items-start">
        <div className="sticky top-32">
          <SectionLabel>REACH OUT</SectionLabel>
          <SectionTitle className="text-6xl md:text-8xl leading-[1] mb-10">Let's Build a<br /><span className="italic">Greener World</span><br />Together</SectionTitle>
          <p className="text-xl text-dark-muted font-normal leading-relaxed mb-16">Whether you want to donate, volunteer, partner with us, or simply learn more — we'd love to hear from you.</p>
          <div className="space-y-12">
            <div className="flex gap-8 items-center group">
              <div className="w-16 h-16 bg-white border border-border-subtle rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:scale-110">📍</div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground tracking-[2px] uppercase mb-1">Headquarters</div>
                <div className="text-base font-bold text-dark-base uppercase tracking-tight">Makhan Majara, Chandigarh, India</div>
              </div>
            </div>
            <div className="flex gap-8 items-center group">
              <div className="w-16 h-16 bg-white border border-border-subtle rounded-2xl flex items-center justify-center text-3xl shadow-sm transition-transform group-hover:scale-110">✉️</div>
              <div>
                <div className="text-[10px] font-bold text-muted-foreground tracking-[2px] uppercase mb-1">Direct Outreach</div>
                <div className="text-base font-bold text-dark-base uppercase tracking-tight">hello@heavendoo.org</div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-border-subtle rounded-[3rem] p-16 shadow-2xl shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-bg-soft rounded-bl-full opacity-50" />
          <h3 className="text-4xl font-serif font-bold mb-12 relative z-1">Send Us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-8 relative z-1">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground tracking-[2px] uppercase">First Name</label>
                <input
                  required
                  type="text"
                  placeholder="Riya"
                  value={formData.firstName}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary bg-white transition-all text-sm font-bold placeholder:opacity-30"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-muted-foreground tracking-[2px] uppercase">Last Name</label>
                <input
                  required
                  type="text"
                  placeholder="Sharma"
                  value={formData.lastName}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary bg-white transition-all text-sm font-bold placeholder:opacity-30"
                />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground tracking-[2px] uppercase">Email Address</label>
              <input
                required
                type="email"
                placeholder="riya@email.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary bg-white transition-all text-sm font-bold placeholder:opacity-30"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground tracking-[2px] uppercase">Message</label>
              <textarea
                required
                placeholder="Tell us how you'd like to get involved…"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary bg-white h-48 border-b-8 border-b-green-primary/5 transition-all text-sm font-medium"
              ></textarea>
            </div>
            <button
              disabled={status === 'submitting'}
              className={`w-full bg-green-primary text-white py-6 rounded-2xl font-bold text-sm tracking-[0.2em] hover:bg-green-dark transition-all shadow-2xl shadow-green-primary/20 flex items-center justify-center gap-4 uppercase ${status === 'submitting' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {status === 'submitting' ? 'SENDING...' : status === 'success' ? 'SENT SUCCESSFULLY ✓' : 'SEND MESSAGE 🌱'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};
