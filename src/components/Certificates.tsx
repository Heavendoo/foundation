import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SectionLabel, SectionTitle, SectionDesc } from './Shared';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { X, Award, Calendar, Building2 } from 'lucide-react';

interface Certificate {
  id: string;
  title: string;
  issuedBy: string;
  date: string;
  description: string;
  imageUrl: string;
  createdAt: any;
}

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setCertificates(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Certificate)));
      setLoading(false);
    }, () => {
      setLoading(false);
    });
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Hero Section */}
      <section className="bg-dark-base py-32 px-6 md:px-12 text-white relative overflow-hidden">
        <div className="absolute right-[-150px] top-[-150px] w-[500px] h-[500px] rounded-full bg-green-primary/10 pointer-events-none" />
        <div className="absolute left-[-80px] bottom-[-80px] w-[300px] h-[300px] rounded-full bg-white/5 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-1">
          <SectionLabel className="text-green-mid">TRUST & RECOGNITION</SectionLabel>
          <SectionTitle className="text-white text-6xl md:text-8xl !leading-[1.1] font-serif">
            Our <span className="italic">Certificates</span><br />& Accreditations
          </SectionTitle>
          <p className="text-xl text-white/50 font-normal max-w-xl mt-8 leading-relaxed">
            Verified credentials that validate our commitment to transparency, ecological impact, and organizational excellence.
          </p>
          <div className="flex gap-6 mt-12">
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3">
              <Award className="w-5 h-5 text-green-primary" />
              <span className="text-sm font-bold text-white/70">{certificates.length} Certificates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="py-24 px-6 md:px-12 bg-bg-soft">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-20 flex justify-center">
              <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="bg-white border border-border-subtle rounded-[3rem] p-20 text-center">
              <div className="text-6xl mb-6">📜</div>
              <h3 className="text-2xl font-serif font-bold mb-4">Certificates Coming Soon</h3>
              <p className="text-dark-muted max-w-sm mx-auto">
                We are currently in the process of uploading our verified accreditations. Please check back shortly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {certificates.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => setSelectedCert(cert)}
                  className="bg-white border border-border-subtle rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-black/5 transition-all group cursor-pointer flex flex-col"
                >
                  {/* Certificate Image */}
                  <div className="aspect-[4/3] overflow-hidden relative bg-bg-soft">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                      <span className="bg-white/90 backdrop-blur text-dark-base text-[10px] font-black tracking-widest uppercase px-6 py-2 rounded-full">
                        View Certificate
                      </span>
                    </div>
                  </div>

                  {/* Certificate Info */}
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-4 h-4 text-green-primary" />
                      <span className="text-[10px] font-black tracking-widest text-green-primary uppercase">Certificate</span>
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-3 leading-tight group-hover:text-green-primary transition-colors">
                      {cert.title}
                    </h3>
                    {cert.description && (
                      <p className="text-sm text-dark-muted line-clamp-2 leading-relaxed mb-6">{cert.description}</p>
                    )}
                    <div className="mt-auto pt-6 border-t border-bg-soft flex justify-between items-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">{cert.issuedBy}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        <span>{cert.date}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-[999]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-dark-base/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute inset-4 md:inset-12 lg:inset-20 bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-8 border-b border-border-subtle">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-dark-base">{selectedCert.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {selectedCert.issuedBy}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {selectedCert.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-3 hover:bg-bg-soft rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image */}
              <div className="flex-1 overflow-auto p-8 bg-bg-soft flex items-center justify-center">
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.title}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                />
              </div>

              {/* Description */}
              {selectedCert.description && (
                <div className="p-8 border-t border-border-subtle">
                  <p className="text-dark-muted leading-relaxed">{selectedCert.description}</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
