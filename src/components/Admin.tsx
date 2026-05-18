import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  MapPin, 
  TreePine, 
  Newspaper, 
  Users, 
  Settings as SettingsIcon,
  LogOut,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  Upload,
  Heart,
  BookOpen,
  Search,
  Filter,
  ChevronRight,
  FileText,
  Award,
  FolderOpen
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { SectionLabel, SectionTitle } from './Shared';

// --- Types ---
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

interface NewsArticle {
  id: string;
  cat: string;
  title: string;
  desc: string;
  meta: string;
  emoji: string;
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  createdAt: any;
}

// --- Components ---

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'trees' | 'news' | 'leads' | 'stats' | 'donation' | 'research' | 'certificates' | 'projects'>('dashboard');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          // Check if exists in admins collection
          const adminDoc = await getDoc(doc(db, 'admins', u.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else if (u.email === 'rishabhravindra5262@gmail.com') {
            // Auto-bootstrap for the current user if they are the designated admin
            await setDoc(doc(db, 'admins', u.uid), { 
              email: u.email, 
              role: 'owner',
              bootstrappedAt: serverTimestamp() 
            });
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (err) {
          console.error("Auth permission check failed", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err: any) {
      if (err.code === 'auth/cancelled-popup-request') {
        console.log('User closed the login popup.');
        return;
      }
      console.error('Login failed:', err);
    }
  };

  const logout = () => signOut(auth);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft">
      <div className="w-12 h-12 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user || !isAdmin) return (
    <div className="min-h-screen flex items-center justify-center bg-bg-soft px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-border-subtle rounded-[2.5rem] p-12 text-center shadow-2xl shadow-black/5"
      >
        <div className="text-6xl mb-8">🔐</div>
        <SectionLabel>HEAVENDOO MISSION CONTROL</SectionLabel>
        <h2 className="text-4xl font-serif font-bold mb-6">Restricted Access</h2>
        <p className="text-dark-muted mb-10 leading-relaxed">
          Please sign in with an authorized account to manage the global registry and foundation data.
        </p>
        <button 
          onClick={login}
          className="w-full bg-green-primary text-white py-5 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-primary/20"
        >
          Sign in with Google
        </button>
        {!isAdmin && user && (
          <div className="mt-8 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-bold uppercase tracking-widest">
            Identity Verified. Permissions Denied.
          </div>
        )}
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-soft flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-border-subtle flex flex-col fixed h-full z-10">
        <div className="p-10 border-b border-border-subtle">
           <div className="text-xs font-black tracking-[0.3em] text-green-primary uppercase mb-1">FOUNDATION</div>
           <div className="text-2xl font-serif font-bold text-dark-base">Admin Panel</div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
           <SidebarLink 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
           />
           <SidebarLink 
            icon={<TreePine size={20} />} 
            label="Tree Records" 
            active={activeTab === 'trees'} 
            onClick={() => setActiveTab('trees')} 
           />
           <SidebarLink 
            icon={<Newspaper size={20} />} 
            label="Newsroom" 
            active={activeTab === 'news'} 
            onClick={() => setActiveTab('news')} 
           />
           <SidebarLink 
            icon={<Users size={20} />} 
            label="Leads & Contact" 
            active={activeTab === 'leads'} 
            onClick={() => setActiveTab('leads')} 
           />
           <SidebarLink 
            icon={<BookOpen size={20} />} 
            label="Research Papers" 
            active={activeTab === 'research'} 
            onClick={() => setActiveTab('research')} 
           />
           <SidebarLink 
            icon={<SettingsIcon size={20} />} 
            label="Global Stats" 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')} 
           />
           <SidebarLink 
            icon={<Heart size={20} />} 
            label="Donation Control" 
            active={activeTab === 'donation'} 
            onClick={() => setActiveTab('donation')} 
           />
           <SidebarLink 
            icon={<Award size={20} />} 
            label="Certificates" 
            active={activeTab === 'certificates'} 
            onClick={() => setActiveTab('certificates')} 
           />
           <SidebarLink 
            icon={<FolderOpen size={20} />} 
            label="Projects" 
            active={activeTab === 'projects'} 
            onClick={() => setActiveTab('projects')} 
           />
        </nav>

        <div className="p-6 border-t border-border-subtle">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center border border-border-subtle text-xs font-bold">
              {user.displayName?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-dark-base truncate">{user.displayName || 'Admin'}</div>
              <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border-subtle text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-12">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <DashboardView key="dash" />}
          {activeTab === 'trees' && <TreeManager key="trees" />}
          {activeTab === 'news' && <NewsManager key="news" />}
          {activeTab === 'research' && <ResearchManager key="research" />}
          {activeTab === 'leads' && <LeadManager key="leads" />}
          {activeTab === 'stats' && <StatsManager key="stats" />}
          {activeTab === 'donation' && <DonationManager key="donation" />}
          {activeTab === 'certificates' && <CertificatesManager key="certificates" />}
          {activeTab === 'projects' && <ProjectsManager key="projects" />}
        </AnimatePresence>
      </main>
    </div>
  );
}

function StatsManager() {
  const [stats, setStats] = useState({ 
    treesPlanted: 0, 
    countries: 0, 
    survivalRate: '', 
    co2Offset: '', 
    updatedAt: null as any 
  });
  const [formData, setFormData] = useState({
    treesPlanted: 0,
    countries: 0,
    survivalRate: '',
    co2Offset: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'stats', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        setStats(data);
        setFormData({
          treesPlanted: data.treesPlanted || 0,
          countries: data.countries || 0,
          survivalRate: data.survivalRate || '',
          co2Offset: data.co2Offset || ''
        });
      }
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'stats/global'));
  }, []);

  const saveAll = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'stats', 'global'), {
        treesPlanted: formData.treesPlanted,
        countries: formData.countries,
        survivalRate: formData.survivalRate,
        co2Offset: formData.co2Offset,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'stats/global');
    } finally {
      setSaving(false);
    }
  };

  const addToday = async () => {
    const addVal = prompt('How many trees were planted today?');
    if (!addVal || isNaN(parseInt(addVal))) return;
    
    try {
      await setDoc(doc(db, 'stats', 'global'), {
        treesPlanted: stats.treesPlanted + parseInt(addVal),
        countries: stats.countries || formData.countries,
        survivalRate: stats.survivalRate || formData.survivalRate,
        co2Offset: stats.co2Offset || formData.co2Offset,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'stats/global');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <header>
        <SectionLabel>FOUNDATION DATA</SectionLabel>
        <SectionTitle className="text-5xl">Global Stats</SectionTitle>
        <p className="text-dark-muted mt-4">Manage all live stats displayed on the Tree Records page cards and homepage.</p>
      </header>

      {/* Live Preview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🌳', lbl: 'Total Trees', val: formData.treesPlanted.toLocaleString() },
          { icon: '📍', lbl: 'Countries', val: String(formData.countries) },
          { icon: '📈', lbl: 'Survival Rate', val: formData.survivalRate || '—' },
          { icon: '☁️', lbl: 'CO₂ Offset', val: formData.co2Offset || '—' }
        ].map((s, i) => (
          <div key={i} className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm text-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-[9px] font-black tracking-widest text-muted-foreground uppercase mb-1">{s.lbl}</div>
            <div className="text-xl font-serif font-bold text-green-primary">{s.val}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Edit All Stats */}
        <div className="bg-white border border-border-subtle rounded-[2.5rem] p-12 shadow-sm space-y-6">
          <h3 className="text-xl font-bold border-b border-bg-soft pb-4">Edit Card Values</h3>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">🌳 Total Trees Planted</label>
            <input 
              type="number"
              className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
              value={formData.treesPlanted}
              onChange={e => setFormData({ ...formData, treesPlanted: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 1500000"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">📍 Countries Operating In</label>
            <input 
              type="number"
              className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
              value={formData.countries}
              onChange={e => setFormData({ ...formData, countries: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 48"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">📈 Survival Rate</label>
            <input 
              type="text"
              className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
              value={formData.survivalRate}
              onChange={e => setFormData({ ...formData, survivalRate: e.target.value })}
              placeholder="e.g., 97.2%"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">☁️ CO₂ Offset</label>
            <input 
              type="text"
              className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
              value={formData.co2Offset}
              onChange={e => setFormData({ ...formData, co2Offset: e.target.value })}
              placeholder="e.g., 312.4t"
            />
          </div>

          <button 
            onClick={saveAll}
            disabled={saving}
            className="w-full bg-green-primary text-white py-5 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-primary/20 disabled:opacity-50"
          >
            <CheckCircle2 size={20} /> {saving ? 'Saving...' : 'Save All Stats'}
          </button>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-8">
          <div className="bg-white border border-border-subtle rounded-[2.5rem] p-12 shadow-sm">
            <div className="text-6xl mb-8">🌳</div>
            <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2">Current Tree Count</div>
            <div className="text-6xl font-serif font-bold text-green-primary">{stats.treesPlanted.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground mt-4 font-mono uppercase">
              Last Updated: {stats.updatedAt ? new Date(stats.updatedAt.toDate()).toLocaleString() : 'Never'}
            </div>

            <div className="mt-10 pt-10 border-t border-bg-soft">
              <button 
                onClick={addToday}
                className="w-full bg-dark-base text-white py-5 rounded-2xl font-bold tracking-widest uppercase hover:bg-black transition-all flex items-center justify-center gap-3"
              >
                <Plus size={20} /> Add Daily Planting
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DonationManager() {
  const [settings, setSettings] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    ifsc: '',
    upiId: '',
    qrCodeUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return onSnapshot(doc(db, 'settings', 'donation'), (s) => {
      if (s.exists()) {
        setSettings(s.data() as any);
      }
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/donation'));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'donation'), {
        ...settings,
        updatedAt: serverTimestamp()
      });
      alert('Donation settings updated successfully!');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/donation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <header>
        <SectionLabel>FOUNDATION FINANCE</SectionLabel>
        <SectionTitle className="text-5xl">Donation Control</SectionTitle>
        <p className="text-dark-muted mt-4">Manage bank details and QR codes for donors.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white border border-border-subtle rounded-[3rem] p-12 shadow-sm space-y-8">
           <h3 className="text-2xl font-serif font-bold border-b border-bg-soft pb-6">Bank Registry Details</h3>
           
           <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Bank Name</label>
                <input 
                  className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                  value={settings.bankName}
                  onChange={e => setSettings({ ...settings, bankName: e.target.value })}
                  placeholder="e.g., State Bank of India"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Account Holder Name</label>
                <input 
                  className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                  value={settings.accountHolder}
                  onChange={e => setSettings({ ...settings, accountHolder: e.target.value })}
                  placeholder="Heavendoo Foundation"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Account Number</label>
                  <input 
                    className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                    value={settings.accountNumber}
                    onChange={e => setSettings({ ...settings, accountNumber: e.target.value })}
                    placeholder="XXXX XXXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">IFSC Code</label>
                  <input 
                    className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                    value={settings.ifsc}
                    onChange={e => setSettings({ ...settings, ifsc: e.target.value })}
                    placeholder="SBIN000XXXX"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">UPI ID (Optional)</label>
                <input 
                  className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                  value={settings.upiId}
                  onChange={e => setSettings({ ...settings, upiId: e.target.value })}
                  placeholder="heavendoo@upi"
                />
              </div>
           </div>
        </div>

        <div className="bg-white border border-border-subtle rounded-[3rem] p-12 shadow-sm space-y-8">
           <h3 className="text-2xl font-serif font-bold border-b border-bg-soft pb-6">Payment Scanner (QR)</h3>
           
           <div className="space-y-8">
              {settings.qrCodeUrl && (
                <div className="aspect-square w-64 mx-auto bg-white border border-border-subtle p-4 rounded-3xl group relative">
                   <img src={settings.qrCodeUrl} className="w-full h-full object-contain" alt="QR Code" />
                   <button 
                    onClick={() => setSettings({ ...settings, qrCodeUrl: '' })}
                    className="absolute -top-2 -right-2 p-2 bg-rose-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all"
                   >
                     <X size={14} />
                   </button>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">QR Code Image URL</label>
                <input 
                  className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                  value={settings.qrCodeUrl}
                  onChange={e => setSettings({ ...settings, qrCodeUrl: e.target.value })}
                  placeholder="Paste URL of the QR scanner image"
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed italic">
                Tip: You can upload your QR code to a service like PostImages or Imgur and paste the direct link here.
              </p>
           </div>

           <div className="pt-12">
              <button 
                onClick={save}
                disabled={saving}
                className="w-full bg-green-primary text-white py-5 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-primary/20 disabled:opacity-50"
              >
                {saving ? 'Syncing...' : <CheckCircle2 size={20} />} 
                {saving ? 'Syncing...' : 'Update Public Details'}
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold tracking-tight transition-all ${
        active 
        ? 'bg-green-primary text-white shadow-lg shadow-green-primary/20' 
        : 'text-muted-foreground hover:bg-bg-soft hover:text-dark-base'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function DashboardView() {
  const [stats, setStats] = useState({ treesPlanted: 0 });
  const [counts, setCounts] = useState({ trees: 0, news: 0, leads: 0 });

  useEffect(() => {
    onSnapshot(doc(db, 'stats', 'global'), (s) => s.exists() && setStats(s.data() as any));
    onSnapshot(collection(db, 'trees'), (s) => setCounts(prev => ({ ...prev, trees: s.size })));
    onSnapshot(collection(db, 'news'), (s) => setCounts(prev => ({ ...prev, news: s.size })));
    onSnapshot(collection(db, 'leads'), (s) => setCounts(prev => ({ ...prev, leads: s.size })));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <header className="mb-12">
        <SectionLabel>OVERVIEW</SectionLabel>
        <SectionTitle className="text-5xl">Mission Control</SectionTitle>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Active Trees', val: stats.treesPlanted.toLocaleString(), icon: '🌳', color: 'text-green-primary' },
          { label: 'Total Leads', val: counts.leads, icon: '✉️', color: 'text-blue-500' },
          { label: 'News Items', val: counts.news, icon: '📰', color: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-border-subtle rounded-3xl p-10 shadow-sm">
            <div className="text-4xl mb-6">{s.icon}</div>
            <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase mb-2">{s.label}</div>
            <div className={`text-4xl font-serif font-bold ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-border-subtle rounded-[2.5rem] p-10">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4 items-start pb-6 border-b border-bg-soft last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-bg-soft flex items-center justify-center text-lg">🌱</div>
                <div>
                  <div className="text-sm font-bold text-dark-base">New Tree Record Added</div>
                  <div className="text-xs text-muted-foreground">#HD-10900 · Indian Rosewood · Ghaziabad</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter mt-1">2 hours ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-border-subtle rounded-[2.5rem] p-10">
          <h3 className="text-xl font-bold mb-6">System Status</h3>
          <div className="space-y-4">
             <StatusRow label="Firebase Firestore" status="online" />
             <StatusRow label="Authentication" status="online" />
             <StatusRow label="Asset Storage" status="online" />
             <StatusRow label="Global Search Index" status="online" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusRow({ label, status }: { label: string, status: 'online' | 'error' }) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-bg-soft last:border-0">
      <span className="text-sm font-bold text-dark-base">{label}</span>
      <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${status === 'online' ? 'text-green-primary' : 'text-rose-500'}`}>
        <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-primary' : 'bg-rose-500'} animate-pulse`} />
        {status}
      </span>
    </div>
  );
}

function TreeManager() {
  const [trees, setTrees] = useState<TreeRecord[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    species: '',
    name: '',
    dedicatedTo: '',
    treeCode: '',
    loc: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Sapling' as const,
    by: '',
    emoji: '🌳',
    lat: 28.6139,
    lng: 77.2090
  });

  useEffect(() => {
    const q = query(collection(db, 'trees'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setTrees(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as TreeRecord)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'trees'));
  }, []);

  const save = async () => {
    // Validation
    const required = ['species', 'loc', 'date', 'status', 'by'];
    const missing = required.filter(key => !formData[key as keyof typeof formData]);
    
    if (missing.length > 0) {
      alert(`Please fill in all required fields: ${missing.join(', ')}`);
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, 'trees', editingId), formData);
      } else {
        await addDoc(collection(db, 'trees'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ 
        species: '', 
        name: '', 
        dedicatedTo: '', 
        treeCode: '', 
        loc: '', 
        date: new Date().toISOString().split('T')[0], 
        status: 'Sapling', 
        by: '', 
        emoji: '🌳',
        lat: 28.6139,
        lng: 77.2090
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'trees');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await deleteDoc(doc(db, 'trees', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'trees');
    }
  };

  const filteredTrees = trees.filter(t => {
    const searchLow = search.toLowerCase();
    return (
      t.species.toLowerCase().includes(searchLow) ||
      t.name?.toLowerCase().includes(searchLow) ||
      t.treeCode?.toLowerCase().includes(searchLow) ||
      t.loc?.toLowerCase().includes(searchLow) ||
      t.by?.toLowerCase().includes(searchLow) ||
      t.id.toLowerCase().includes(searchLow)
    );
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <SectionLabel>DATABASE</SectionLabel>
          <SectionTitle className="text-5xl">Tree Records</SectionTitle>
        </div>
        <div className="flex gap-4">
          <input 
            type="text"
            placeholder="Search records..."
            className="bg-white border border-border-subtle px-6 py-4 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold min-w-[300px]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-green-primary text-white px-8 py-4 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center gap-3 shadow-xl shadow-green-primary/20"
          >
            <Plus size={20} /> Add New Tree
          </button>
        </div>
      </header>

      {/* Grid of Trees */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredTrees.map(t => (
          <div key={t.id} className="bg-white border border-border-subtle rounded-3xl p-8 flex items-center gap-6 group hover:border-green-primary transition-all">
            <div className="text-4xl bg-bg-soft w-20 h-20 flex items-center justify-center rounded-2xl">{t.emoji}</div>
            <div className="flex-1">
              <div className="text-xs font-mono text-green-primary mb-1">{t.treeCode || t.id.slice(0, 8).toUpperCase()}</div>
              <h4 className="text-xl font-bold text-dark-base">{t.name || t.species}</h4>
              <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">
                Dedicated to: {t.dedicatedTo || 'The Earth'}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground mt-2 font-bold uppercase tracking-tighter">
                <span className="flex items-center gap-1"><MapPin size={10} /> {t.loc}</span>
                <span className="flex items-center gap-1">📍 {t.lat?.toFixed(4)}, {t.lng?.toFixed(4)}</span>
                <span className="font-serif italic capitalize">{t.date}</span>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
              t.status === 'Sapling' ? 'bg-bg-soft text-dark-muted' : 
              t.status === 'Growing' ? 'bg-green-light text-green-primary' : 
              'bg-green-primary text-white'
            }`}>
              {t.status}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setFormData({...t});
                  setEditingId(t.id);
                  setIsAdding(true);
                }}
                className="p-3 bg-bg-soft rounded-xl text-dark-muted hover:text-green-primary transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => remove(t.id)}
                className="p-3 bg-bg-soft rounded-xl text-dark-muted hover:text-rose-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-dark-base/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-12">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-serif font-bold">{editingId ? 'Edit Tree Record' : 'Log New Tree'}</h3>
                  <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-bg-soft rounded-full transition-colors"><X /></button>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Tree Name</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Hope"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Unique Code</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.treeCode}
                      onChange={e => setFormData({ ...formData, treeCode: e.target.value })}
                      placeholder="e.g., HD-1002"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Dedicated To</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.dedicatedTo}
                      onChange={e => setFormData({ ...formData, dedicatedTo: e.target.value })}
                      placeholder="e.g., Grandmother"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Species</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.species}
                      onChange={e => setFormData({ ...formData, species: e.target.value })}
                      placeholder="e.g., Neem Tree"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Location</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.loc}
                      onChange={e => setFormData({ ...formData, loc: e.target.value })}
                      placeholder="e.g., Lucknow, UP"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Latitude</label>
                    <input 
                      type="number"
                      step="0.0001"
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.lat}
                      onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Longitude</label>
                    <input 
                      type="number"
                      step="0.0001"
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.lng}
                      onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Date Planted</label>
                    <input 
                      type="date"
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Status</label>
                    <select 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold appearance-none cursor-pointer"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="Sapling">Sapling</option>
                      <option value="Growing">Growing</option>
                      <option value="Thriving">Thriving</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Planted By</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.by}
                      onChange={e => setFormData({ ...formData, by: e.target.value })}
                      placeholder="e.g., Heavendoo Team"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Icon Emoji</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.emoji}
                      onChange={e => setFormData({ ...formData, emoji: e.target.value })}
                      placeholder="🌳"
                    />
                  </div>
                </div>

                <div className="mt-12 flex gap-4">
                  <button 
                    onClick={save}
                    className="flex-1 bg-green-primary text-white py-5 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-primary/20"
                  >
                    <Save size={20} /> {editingId ? 'Update Record' : 'Publish Record'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function NewsManager() {
  const [articles, setArticles] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    cat: 'Achievement',
    excerpt: '',
    image: '',
    content: '',
    sourceUrl: '',
    isHero: false
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const resetForm = () => {
    setFormData({ title: '', cat: 'Achievement', excerpt: '', image: '', content: '', sourceUrl: '', isHero: false });
    setEditingId(null);
    setIsAdding(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setArticles(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'news'));
  }, []);

  const save = async () => {
    if (!formData.title || !formData.excerpt || !formData.image) {
      alert('Please fill required fields');
      return;
    }
    try {
      if (editingId) {
        await updateDoc(doc(db, 'news', editingId), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'news'), {
          ...formData,
          createdAt: serverTimestamp()
        });
      }
      resetForm();
    } catch (err) {
      handleFirestoreError(err, editingId ? OperationType.WRITE : OperationType.CREATE, 'news');
    }
  };

  const startEdit = (article: any) => {
    setFormData({
      title: article.title || '',
      cat: article.cat || 'Achievement',
      excerpt: article.excerpt || '',
      image: article.image || '',
      content: article.content || '',
      sourceUrl: article.sourceUrl || '',
      isHero: article.isHero || false
    });
    setEditingId(article.id);
    setIsAdding(true);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await deleteDoc(doc(db, 'news', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'news');
    }
  };

  const filteredArticles = articles.filter(a => {
    const s = search.toLowerCase();
    return a.title.toLowerCase().includes(s) || a.cat.toLowerCase().includes(s);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <header className="flex justify-between items-end mb-12">
        <div>
          <SectionLabel>PUBLISHING</SectionLabel>
          <SectionTitle className="text-5xl">Newsroom</SectionTitle>
          <p className="text-dark-muted mt-4">Manage foundation updates and press releases.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
             <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
              type="text"
              placeholder="Search articles..."
              className="bg-white border border-border-subtle pl-12 pr-6 py-4 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold min-w-[300px]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-green-primary text-white px-8 py-4 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center gap-3 shadow-xl shadow-green-primary/20"
          >
            <Plus size={20} /> New Article
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map(article => (
          <div key={article.id} className="bg-white border border-border-subtle rounded-3xl overflow-hidden group hover:border-green-primary transition-all">
            <div className="aspect-video relative overflow-hidden bg-bg-soft">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase text-green-primary">
                  {article.cat}
                </div>
                {article.isHero && (
                  <div className="bg-amber-400 text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                    HERO
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button onClick={() => startEdit(article)} className="p-4 bg-white text-dark-base rounded-full hover:scale-110 transition-all" title="Edit article">
                  <Edit2 size={24} />
                </button>
                <button onClick={() => remove(article.id)} className="p-4 bg-rose-500 text-white rounded-full hover:scale-110 transition-all" title="Delete article">
                  <Trash2 size={24} />
                </button>
              </div>
            </div>
            <div className="p-8">
              <h4 className="text-xl font-serif font-bold text-dark-base mb-4 line-clamp-2">{article.title}</h4>
              <p className="text-sm text-dark-muted line-clamp-3 leading-relaxed">{article.excerpt}</p>
              <div className="mt-6 pt-6 border-t border-bg-soft text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
                {article.createdAt?.toDate().toLocaleDateString() || 'Draft'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-dark-base/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-serif font-bold">Compose Article</h3>
                  <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-bg-soft rounded-full transition-colors"><X /></button>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Headline</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., 500,000 Trees Reached in Ghaziabad Milestone"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Category</label>
                      <select 
                        className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold appearance-none"
                        value={formData.cat}
                        onChange={e => setFormData({ ...formData, cat: e.target.value })}
                      >
                        <option>Achievement</option>
                        <option>Community</option>
                        <option>Press Release</option>
                        <option>Ecology</option>
                        <option>Event</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Hero Image</label>
                      <div className="flex gap-4 items-center">
                         <div className="w-20 h-20 bg-bg-soft rounded-2xl overflow-hidden border border-border-subtle flex-shrink-0">
                            {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Upload size={20} /></div>}
                         </div>
                         <div className="flex-1">
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleImageUpload}
                              className="hidden" 
                              id="news-img-upload" 
                            />
                            <label 
                              htmlFor="news-img-upload"
                              className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold flex items-center justify-between cursor-pointer hover:bg-white"
                            >
                               <span>{uploading ? 'Processing...' : formData.image ? 'Change Image' : 'Select File'}</span>
                               <Upload size={16} />
                            </label>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Source / Credits Name</label>
                        <input 
                          className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                          value={formData.sourceUrl || ''}
                          onChange={e => setFormData({ ...formData, sourceUrl: e.target.value })}
                          placeholder="e.g., Times of India / Foundation Press"
                        />
                    </div>
                    <div className="flex items-center gap-4 pt-6">
                       <button 
                        onClick={() => setFormData({ ...formData, isHero: !formData.isHero })}
                        className={`px-6 py-4 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all flex items-center gap-2 ${formData.isHero ? 'bg-amber-400 text-white' : 'bg-bg-soft text-muted-foreground'}`}
                       >
                         {formData.isHero ? '⭐ Hero Banner Active' : 'Set as Hero Banner'}
                       </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Short Excerpt (List View)</label>
                    <textarea 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold h-24"
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Brief summary used for the news grid..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Full Content (Markdown Supported)</label>
                    <textarea 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold h-48"
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                      placeholder="The main story..."
                    />
                  </div>
                  
                  <div className="pt-6">
                    <button 
                      onClick={save} 
                      className="w-full bg-green-primary text-white py-5 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-primary/20"
                    >
                      <Save size={20} /> {editingId ? 'Update Article' : 'Publish Article'}
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ResearchManager() {
  const [papers, setPapers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    summary: '',
    downloadUrl: '',
    category: 'Ecology'
  });

  useEffect(() => {
    const q = query(collection(db, 'research'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setPapers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'research'));
  }, []);

  const save = async () => {
    if (!formData.title || !formData.author || !formData.downloadUrl) {
      alert('Please fill required fields');
      return;
    }
    try {
      await addDoc(collection(db, 'research'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setFormData({ title: '', author: '', summary: '', downloadUrl: '', category: 'Ecology' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'research');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this paper?')) return;
    try {
      await deleteDoc(doc(db, 'research', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'research');
    }
  };

  const filteredPapers = papers.filter(p => {
    const s = search.toLowerCase();
    return p.title.toLowerCase().includes(s) || p.category.toLowerCase().includes(s) || p.author.toLowerCase().includes(s);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <header className="flex justify-between items-end mb-12">
        <div>
          <SectionLabel>ACADEMIC</SectionLabel>
          <SectionTitle className="text-5xl">Research Data</SectionTitle>
          <p className="text-dark-muted mt-4">Publish peer-reviewed papers and foundation scientific reports.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
             <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
             <input 
              type="text"
              placeholder="Search papers..."
              className="bg-white border border-border-subtle pl-12 pr-6 py-4 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold min-w-[300px]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-green-primary text-white px-8 py-4 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center gap-3 shadow-xl shadow-green-primary/20"
          >
            <Plus size={20} /> Publish Paper
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {filteredPapers.map(paper => (
          <div key={paper.id} className="bg-white border border-border-subtle rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center group hover:border-green-primary transition-all">
            <div className="flex gap-6 items-center">
              <div className="w-16 h-16 bg-bg-soft rounded-2xl flex items-center justify-center text-green-primary">
                <FileText size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-dark-base">{paper.title}</h4>
                <div className="flex gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  <span>{paper.author}</span>
                  <span className="text-green-primary/40">•</span>
                  <span>{paper.category}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0">
               <button onClick={() => remove(paper.id)} className="p-4 bg-bg-soft text-muted-foreground hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all">
                <Trash2 size={20} />
               </button>
               <a 
                href={paper.downloadUrl} 
                target="_blank" 
                rel="noreferrer"
                className="bg-green-primary text-white px-6 py-4 rounded-xl text-xs font-bold tracking-widest uppercase flex items-center gap-2 hover:bg-green-dark transition-all"
              >
                <Upload size={16} className="rotate-180" /> Preview PDF
              </a>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-dark-base/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.9, opacity: 0 }}
               className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-2xl"
            >
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-3xl font-serif font-bold">Publish Paper</h3>
                  <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-bg-soft rounded-full transition-colors"><X /></button>
               </div>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Paper Title</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Soil Biodiversity in Post-Industrial Ghaziabad"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Primary Author</label>
                      <input 
                        className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                        value={formData.author}
                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                        placeholder="Dr. S. Ravindra"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Category</label>
                      <select 
                        className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option>Ecology</option>
                        <option>Technology</option>
                        <option>Policy</option>
                        <option>Sustainability</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">PDF Download URL</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.downloadUrl}
                      onChange={e => setFormData({ ...formData, downloadUrl: e.target.value })}
                      placeholder="Link to hosted PDF file"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Abstract / Summary</label>
                    <textarea 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold h-32"
                      value={formData.summary}
                      onChange={e => setFormData({ ...formData, summary: e.target.value })}
                      placeholder="A short summary of results..."
                    />
                  </div>
                  
                  <div className="pt-6">
                    <button 
                      onClick={save} 
                      className="w-full bg-green-primary text-white py-5 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all"
                    >
                      Publish Record
                    </button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


function LeadManager() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setLeads(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Lead)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'leads'));
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
       <header className="mb-12">
        <SectionLabel>OUTREACH</SectionLabel>
        <SectionTitle className="text-5xl">Contact Leads</SectionTitle>
        <p className="text-dark-muted mt-4">Review and respond to inquiries from potential donors, volunteers, and partners.</p>
      </header>

      <div className="space-y-6">
        {leads.length === 0 ? (
          <div className="bg-white border border-border-subtle rounded-3xl p-12 text-center text-muted-foreground">
             No leads found in the database.
          </div>
        ) : (
          leads.map(lead => (
            <div key={lead.id} className="bg-white border border-border-subtle rounded-3xl p-10 hover:border-green-primary transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-dark-base">{lead.firstName} {lead.lastName}</h4>
                  <div className="text-sm text-green-primary font-bold mt-1 tracking-tight">{lead.email}</div>
                </div>
                <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase bg-bg-soft px-4 py-2 rounded-full">
                  {lead.createdAt?.toDate().toLocaleDateString() || 'Recently'}
                </div>
              </div>
              <p className="text-base text-dark-muted leading-relaxed bg-bg-soft/50 p-6 rounded-2xl italic">
                "{lead.message}"
              </p>
              <div className="mt-8 flex gap-4">
                <button className="bg-green-primary text-white px-8 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-green-dark transition-all">Reply via Email</button>
                <button className="bg-white border border-border-subtle text-muted-foreground px-8 py-3 rounded-xl text-xs font-bold tracking-widest uppercase hover:border-rose-500 hover:text-rose-500 transition-all">Archive</button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

function CertificatesManager() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    issuedBy: '',
    date: '',
    description: '',
    imageUrl: ''
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'certificates'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setCertificates(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'certificates'));
  }, []);

  const save = async () => {
    if (!formData.title || !formData.issuedBy || !formData.imageUrl) {
      alert('Please fill in Title, Issued By, and upload an image.');
      return;
    }
    try {
      await addDoc(collection(db, 'certificates'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setFormData({ title: '', issuedBy: '', date: '', description: '', imageUrl: '' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'certificates');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this certificate?')) return;
    try {
      await deleteDoc(doc(db, 'certificates', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'certificates');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <header className="flex justify-between items-end mb-12">
        <div>
          <SectionLabel>CREDENTIALS</SectionLabel>
          <SectionTitle className="text-5xl">Certificates</SectionTitle>
          <p className="text-dark-muted mt-4">Upload and manage foundation certificates visible to the public.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-green-primary text-white px-8 py-4 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center gap-3 shadow-xl shadow-green-primary/20"
        >
          <Plus size={20} /> Upload Certificate
        </button>
      </header>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.map(cert => (
            <div key={cert.id} className="bg-white border border-border-subtle rounded-3xl overflow-hidden group hover:border-green-primary transition-all">
              <div className="aspect-[4/3] relative overflow-hidden bg-bg-soft">
                <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => remove(cert.id)} className="p-4 bg-rose-500 text-white rounded-full hover:scale-110 transition-all">
                    <Trash2 size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h4 className="text-lg font-serif font-bold text-dark-base mb-1">{cert.title}</h4>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {cert.issuedBy} {cert.date && `· ${cert.date}`}
                </div>
                {cert.description && (
                  <p className="text-xs text-dark-muted mt-3 line-clamp-2">{cert.description}</p>
                )}
              </div>
            </div>
          ))}
          {certificates.length === 0 && (
            <div className="col-span-full bg-white border border-border-subtle rounded-3xl p-12 text-center text-muted-foreground">
              No certificates uploaded yet. Click "Upload Certificate" to add one.
            </div>
          )}
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-dark-base/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-serif font-bold">Upload Certificate</h3>
                <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-bg-soft rounded-full transition-colors"><X /></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Certificate Title *</label>
                  <input 
                    className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., ISO 14001 Environmental Certification"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Issued By *</label>
                    <input 
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.issuedBy}
                      onChange={e => setFormData({ ...formData, issuedBy: e.target.value })}
                      placeholder="e.g., Bureau of Indian Standards"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Date Issued</label>
                    <input 
                      type="date"
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Certificate Image *</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-32 h-24 bg-bg-soft rounded-2xl overflow-hidden border border-border-subtle flex-shrink-0">
                      {formData.imageUrl ? (
                        <img src={formData.imageUrl} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground"><Upload size={24} /></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden" 
                        id="cert-img-upload" 
                      />
                      <label 
                        htmlFor="cert-img-upload"
                        className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none text-sm font-bold flex items-center justify-between cursor-pointer hover:bg-white transition-all"
                      >
                        <span>{uploading ? 'Processing...' : formData.imageUrl ? 'Change Image' : 'Select File'}</span>
                        <Upload size={16} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Description (Optional)</label>
                  <textarea 
                    className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold h-24"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this certificate..."
                  />
                </div>

                <div className="pt-6">
                  <button 
                    onClick={save}
                    className="w-full bg-green-primary text-white py-5 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all"
                  >
                    Publish Certificate
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface ProjectDocument {
  title: string;
  url: string;
}

function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    category: 'Sustainability',
    description: '',
    status: 'Research' as 'Research' | 'In Progress' | 'Active' | 'Completed',
    emoji: '🌳',
    learnings: '',
    estimatedCost: '',
    timeline: '',
    documents: [] as ProjectDocument[],
  });
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Sustainability',
      description: '',
      status: 'Research',
      emoji: '🌳',
      learnings: '',
      estimatedCost: '',
      timeline: '',
      documents: [],
    });
    setNewDocTitle('');
    setNewDocUrl('');
    setEditingId(null);
    setIsAdding(false);
  };

  const addDocument = () => {
    if (!newDocTitle.trim() || !newDocUrl.trim()) return;
    setFormData({
      ...formData,
      documents: [...formData.documents, { title: newDocTitle.trim(), url: newDocUrl.trim() }],
    });
    setNewDocTitle('');
    setNewDocUrl('');
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index),
    });
  };

  const save = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a project title.');
      return;
    }
    try {
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'projects'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      resetForm();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'projects');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, 'projects');
    }
  };

  const startEdit = (project: any) => {
    setFormData({
      title: project.title || '',
      category: project.category || 'Sustainability',
      description: project.description || '',
      status: project.status || 'Research',
      emoji: project.emoji || '🌳',
      learnings: project.learnings || '',
      estimatedCost: project.estimatedCost || '',
      timeline: project.timeline || '',
      documents: project.documents || [],
    });
    setEditingId(project.id);
    setIsAdding(true);
  };

  const filteredProjects = projects.filter(p => {
    const s = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(s) ||
      p.category?.toLowerCase().includes(s) ||
      p.status?.toLowerCase().includes(s)
    );
  });

  const statusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-light text-green-primary';
      case 'In Progress': return 'bg-blue-50 text-blue-600';
      case 'Completed': return 'bg-bg-soft text-dark-muted';
      default: return 'bg-amber-50 text-amber-700';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <SectionLabel>INITIATIVES</SectionLabel>
          <SectionTitle className="text-5xl">Projects</SectionTitle>
          <p className="text-dark-muted mt-4">Manage all foundation projects, documentation, learnings and costing.</p>
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search projects..."
            className="bg-white border border-border-subtle px-6 py-4 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold min-w-[250px]"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="bg-green-primary text-white px-8 py-4 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center gap-3 shadow-xl shadow-green-primary/20"
          >
            <Plus size={20} /> New Project
          </button>
        </div>
      </header>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.length === 0 ? (
          <div className="bg-white border border-border-subtle rounded-3xl p-16 text-center">
            <div className="text-5xl mb-6">📂</div>
            <h3 className="text-2xl font-serif font-bold mb-3">No Projects Yet</h3>
            <p className="text-dark-muted mb-8">Create your first project to get started.</p>
            <button
              onClick={() => { resetForm(); setIsAdding(true); }}
              className="bg-green-primary text-white px-8 py-4 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all inline-flex items-center gap-3"
            >
              <Plus size={20} /> Create Project
            </button>
          </div>
        ) : (
          filteredProjects.map(p => (
            <div key={p.id} className="bg-white border border-border-subtle rounded-3xl p-8 flex items-start gap-6 group hover:border-green-primary transition-all">
              <div className="text-4xl bg-bg-soft w-20 h-20 flex items-center justify-center rounded-2xl flex-shrink-0">
                {p.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-[10px] font-bold bg-bg-soft text-green-primary px-3 py-1.5 rounded-full uppercase tracking-widest">
                    {p.category}
                  </span>
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${statusColor(p.status)}`}>
                    {p.status}
                  </span>
                </div>
                <h4 className="text-xl font-bold text-dark-base mb-1">{p.title}</h4>
                <p className="text-xs text-dark-muted line-clamp-2 mb-3">{p.description}</p>
                <div className="flex flex-wrap gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  {p.estimatedCost && <span>💰 {p.estimatedCost}</span>}
                  {p.timeline && <span>📅 {p.timeline}</span>}
                  {p.documents?.length > 0 && <span>📄 {p.documents.length} doc{p.documents.length > 1 ? 's' : ''}</span>}
                  {p.updatedAt && (
                    <span>🕐 {new Date(p.updatedAt.toDate()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(p)}
                  className="p-3 bg-bg-soft rounded-xl text-dark-muted hover:text-green-primary transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => remove(p.id)}
                  className="p-3 bg-bg-soft rounded-xl text-dark-muted hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-dark-base/40 backdrop-blur-md z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-3xl rounded-[3rem] p-12 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-serif font-bold">{editingId ? 'Edit Project' : 'New Project'}</h3>
                <button onClick={resetForm} className="p-3 hover:bg-bg-soft rounded-full transition-colors"><X /></button>
              </div>

              <div className="space-y-8">
                {/* Row 1: Title + Emoji */}
                <div className="grid grid-cols-[1fr_auto] gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Project Title *</label>
                    <input
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Tree Aforestation"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Emoji</label>
                    <input
                      className="w-24 bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold text-center text-2xl"
                      value={formData.emoji}
                      onChange={e => setFormData({ ...formData, emoji: e.target.value })}
                    />
                  </div>
                </div>

                {/* Row 2: Category + Status */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Category</label>
                    <input
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Climate Tech, Blockchain"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Status</label>
                    <select
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold appearance-none cursor-pointer"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="Research">Research</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">Description</label>
                  <textarea
                    className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold h-28"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this project..."
                  />
                </div>

                {/* Cost + Timeline */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">💰 Estimated Cost</label>
                    <input
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.estimatedCost}
                      onChange={e => setFormData({ ...formData, estimatedCost: e.target.value })}
                      placeholder="e.g., ₹15,00,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">📅 Timeline</label>
                    <input
                      className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                      value={formData.timeline}
                      onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                      placeholder="e.g., Q1 2026 — Q4 2027"
                    />
                  </div>
                </div>

                {/* Learnings */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">📖 Learnings & Updates</label>
                  <textarea
                    className="w-full bg-bg-soft border border-border-subtle p-5 rounded-2xl outline-none focus:border-green-primary transition-all text-sm font-bold h-32"
                    value={formData.learnings}
                    onChange={e => setFormData({ ...formData, learnings: e.target.value })}
                    placeholder="Key learnings, progress notes, updates..."
                  />
                </div>

                {/* Documentation */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">📄 Documentation</label>

                  {/* Existing docs */}
                  {formData.documents.length > 0 && (
                    <div className="space-y-2">
                      {formData.documents.map((d, i) => (
                        <div key={i} className="flex items-center gap-3 bg-bg-soft rounded-xl p-4">
                          <FileText size={16} className="text-green-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-dark-base truncate">{d.title}</div>
                            <div className="text-[10px] text-muted-foreground truncate">{d.url}</div>
                          </div>
                          <button
                            onClick={() => removeDocument(i)}
                            className="p-2 text-muted-foreground hover:text-rose-500 transition-colors flex-shrink-0"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new doc */}
                  <div className="border border-dashed border-border-subtle rounded-2xl p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        className="w-full bg-white border border-border-subtle p-4 rounded-xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                        value={newDocTitle}
                        onChange={e => setNewDocTitle(e.target.value)}
                        placeholder="Document title"
                      />
                      <input
                        className="w-full bg-white border border-border-subtle p-4 rounded-xl outline-none focus:border-green-primary transition-all text-sm font-bold"
                        value={newDocUrl}
                        onChange={e => setNewDocUrl(e.target.value)}
                        placeholder="Paste URL (Google Drive, Dropbox...)"
                      />
                    </div>
                    <button
                      onClick={addDocument}
                      className="text-[10px] font-bold text-green-primary bg-green-light/40 px-6 py-3 rounded-xl hover:bg-green-light transition-all uppercase tracking-widest flex items-center gap-2"
                    >
                      <Plus size={14} /> Add Document
                    </button>
                  </div>
                </div>

                {/* Save */}
                <div className="pt-4">
                  <button
                    onClick={save}
                    className="w-full bg-green-primary text-white py-5 rounded-2xl font-bold tracking-widest uppercase hover:bg-green-dark transition-all flex items-center justify-center gap-3 shadow-xl shadow-green-primary/20"
                  >
                    <Save size={20} /> {editingId ? 'Update Project' : 'Publish Project'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

