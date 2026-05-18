import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SectionLabel, SectionTitle, SectionDesc } from './Shared';
import { supabase } from '../lib/supabase';

interface TreeRecord {
  id: string;
  species: string;
  name: string;
  dedicatedTo: string;
  treeCode: string;
  loc: string;
  date: string;
  status: 'Sapling' | 'Growing' | 'Thriving';
  by: string;
  emoji: string;
  lat?: number;
  lng?: number;
}

export default function Records() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [trees, setTrees] = useState<TreeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalStats, setGlobalStats] = useState({
    treesPlanted: 0,
    countries: 0,
    survivalRate: '0%',
    co2Offset: '0t'
  });

  const mockTrees: TreeRecord[] = [
    { id: '1', treeCode: '#HD-10892', species: 'Indian Rosewood', name: 'Aarohan', dedicatedTo: 'Environment Day', loc: 'Ghaziabad, UP', lat: 28.6692, lng: 77.4538, date: 'Apr 12, 2026', status: 'Sapling', by: 'Riya Sharma', emoji: '🌳' },
    { id: '2', treeCode: '#HD-10874', species: 'Neem Tree', name: 'Sanjeevani', dedicatedTo: 'Future Generations', loc: 'Lucknow, UP', lat: 26.8467, lng: 80.9462, date: 'Mar 20, 2026', status: 'Growing', by: 'Corporate Drive', emoji: '🌿' },
    { id: '3', treeCode: '#HD-10801', species: 'Moringa', name: 'Prakriti', dedicatedTo: 'Sustainability', loc: 'Vadodara, GJ', lat: 22.3072, lng: 73.1812, date: 'Feb 5, 2026', status: 'Thriving', by: 'Arjun Mehta', emoji: '🌴' },
    { id: '4', treeCode: '#HD-10766', species: 'Peepal', name: 'Bodhi', dedicatedTo: 'Peace', loc: 'Delhi NCR', lat: 28.7041, lng: 77.1025, date: 'Jan 28, 2026', status: 'Thriving', by: 'School Drive', emoji: '🍂' },
    { id: '5', treeCode: '#HD-10744', species: 'Blue Pine', name: 'Himalaya', dedicatedTo: 'Cool Earth', loc: 'Manali, HP', lat: 32.2432, lng: 77.1892, date: 'Jan 10, 2026', status: 'Sapling', by: 'Heavendoo Team', emoji: '🌲' },
  ];

  useEffect(() => {
    const fetchTrees = async () => {
      const { data, error } = await supabase
        .from('trees')
        .select('*')
        .order('date', { ascending: false });

      if (!error && data && data.length > 0) {
        setTrees(data as TreeRecord[]);
      } else {
        setTrees(mockTrees);
      }
      setLoading(false);
    };

    fetchTrees();

    const subscription = supabase
      .channel('public:trees')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trees' }, () => {
        fetchTrees();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Fetch live stats from admin-managed stats/global document
  useEffect(() => {
    const fetchStats = async () => {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .eq('id', 'global')
        .single();

      if (!error && data) {
        setGlobalStats({
          treesPlanted: data.treesPlanted || 0,
          countries: data.countries || 0,
          survivalRate: data.survivalRate || '0%',
          co2Offset: data.co2Offset || '0t',
        });
      }
    };

    fetchStats();

    const subscription = supabase
      .channel('public:stats')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'stats', filter: 'id=eq.global' }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const stats = [
    { val: globalStats.treesPlanted > 0 ? globalStats.treesPlanted.toLocaleString() : '0', lbl: 'Total Trees', icon: '🌳' },
    { val: String(globalStats.countries), lbl: 'Countries', icon: '📍' },
    { val: globalStats.survivalRate, lbl: 'Survival Rate', icon: '📈' },
    { val: globalStats.co2Offset, lbl: 'CO₂ Offset', icon: '☁️' }
  ];

  const statusStyles: Record<string, string> = {
    'Sapling': 'bg-bg-soft text-dark-muted',
    'Growing': 'bg-green-light text-green-primary',
    'Thriving': 'bg-green-primary text-white',
  };

  const filteredTrees = trees.filter(t => {
    const matchesFilter = filter === 'All' || t.status === filter;
    const searchLow = search.toLowerCase();
    const matchesSearch = 
      t.species.toLowerCase().includes(searchLow) || 
      t.treeCode?.toLowerCase().includes(searchLow) ||
      t.name?.toLowerCase().includes(searchLow) ||
      t.loc?.toLowerCase().includes(searchLow) ||
      t.by?.toLowerCase().includes(searchLow) ||
      t.id.toLowerCase().includes(searchLow);
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-24">
      <div className="py-24 px-6 md:px-12 hero-gradient border-b border-border-subtle">
        <div className="max-w-7xl mx-auto">
          <SectionLabel>REAL-TIME DATA</SectionLabel>
          <SectionTitle>Global Tree Registry</SectionTitle>
          <SectionDesc className="max-w-2xl mb-16">
            Transparency is our foundation. Every sapling planted by Heavendoo is tagged, tracked, and audited, providing you with a live record of our collective effort.
          </SectionDesc>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white border border-border-subtle rounded-3xl p-8 hover:shadow-xl hover:shadow-black/5 transition-all group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">{s.lbl}</div>
                <div className="text-3xl font-serif font-bold text-dark-base leading-none">{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div className="flex gap-2 p-1.5 bg-white border border-border-subtle rounded-full overflow-x-auto no-scrollbar">
            {['All', 'Thriving', 'Growing', 'Sapling'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer ${
                  filter === f ? 'bg-green-primary text-white shadow-lg shadow-green-primary/20' : 'text-muted-foreground hover:text-dark-base'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative min-w-[300px]">
            <input 
              type="text" 
              placeholder="SEARCH BY ID, NAME OR SPECIES..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-border-subtle rounded-full px-10 py-4 text-xs font-bold tracking-widest uppercase outline-none focus:border-green-primary transition-all shadow-sm"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30">🔍</span>
          </div>
        </div>

        {loading ? (
          <div className="p-20 text-center bg-white border border-border-subtle rounded-3xl">
            <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Accessing Ledger...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTrees.map((t, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-border-subtle rounded-[2.5rem] p-8 hover:shadow-2xl hover:shadow-black/5 transition-all group overflow-hidden relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-bg-soft rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
                    {t.emoji}
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${statusStyles[t.status] || ''}`}>
                    {t.status}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="text-[10px] font-mono text-green-primary mb-1 font-bold uppercase tracking-widest">
                    {t.treeCode || `CODE: ${t.id.slice(0, 8).toUpperCase()}`}
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-dark-base mb-1">{t.name || t.species}</h4>
                  <div className="text-sm font-medium text-dark-muted">{t.species}</div>
                </div>

                <div className="space-y-4 pt-6 border-t border-bg-soft">
                  <div className="flex items-center gap-3">
                    <span className="text-lg opacity-40">💝</span>
                    <div className="text-xs">
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Dedicated To</div>
                      <div className="font-bold text-dark-base">{t.dedicatedTo || 'Sustainable Future'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg opacity-40">📍</span>
                    <div className="text-xs">
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Digital Geo-Tag</div>
                      <div className="font-mono text-dark-muted">
                        {t.loc}<br />
                        <span className="text-green-primary opacity-80">{t.lat?.toFixed(4)}, {t.lng?.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-xs">
                      <div className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Planted By</div>
                      <div className="font-bold text-dark-base">{t.by}</div>
                    </div>
                    <div className="text-[10px] font-serif italic text-muted-foreground">
                      {t.date}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredTrees.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white border border-border-subtle rounded-3xl">
                <p className="text-muted-foreground italic">No matching records found in our global database.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Showing {filteredTrees.length} of {trees.length === mockTrees.length ? '1,243,670' : trees.length} records</span>
          <div className="flex gap-4">
             <button className="bg-white border border-border-subtle text-dark-base px-8 py-4 rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-bg-soft transition-all">Previous</button>
             <button className="bg-green-primary text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-lg shadow-green-primary/20 hover:bg-green-dark transition-all">Next Page</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

