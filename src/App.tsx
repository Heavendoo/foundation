import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Shared';
import Home from './components/Home';
import Records from './components/Records';
import Vision from './components/Vision';
import News from './components/News';
import Admin from './components/Admin';
import Donation from './components/Donation';
import { Research, About, Contact } from './components/Pages';
import Certificates from './components/Certificates';
import Projects from './components/Projects';
import { useSEO } from './lib/useSEO';

export default function App() {
  const [activePage, setActivePage] = useState('home');

  // Dynamic SEO: updates document.title, meta description, OG tags per page
  useSEO(activePage);

  // Scroll to top on page change for better UX and crawlability
  const navigate = useCallback((page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'home': return <Home onNavigate={navigate} />;
      case 'records': return <Records />;
      case 'vision': return <Vision />;
      case 'news': return <News />;
      case 'research': return <Research />;
      case 'about': return <About />;
      case 'contact': return <Contact />;
      case 'projects': return <Projects />;
      case 'certificates': return <Certificates />;
      case 'donate': return <Donation />;
      case 'admin': return <Admin />;
      default: return <Home onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen selection:bg-green-primary selection:text-white">
      {/* Navigation Header */}
      <header className="glass-nav px-6 md:px-12" role="banner">
        <div className="max-w-7xl mx-auto flex items-center h-20">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); navigate('home'); }}
            aria-label="Heavendoo Foundation — Go to homepage"
          >
            <Logo />
          </a>

          <nav className="hidden lg:flex flex-1 justify-center gap-1 mx-8" aria-label="Main navigation">
            {[
              { id: 'home', label: 'Home' },
              { id: 'about', label: 'About Us' },
              { id: 'vision', label: 'Our Vision' },
              { id: 'projects', label: 'Projects' },
              { id: 'records', label: 'Tree Records' },
              { id: 'research', label: 'Research' },
              { id: 'certificates', label: 'Certificates' },
              { id: 'news', label: 'News' },
              { id: 'contact', label: 'Contact' }
            ].map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => { e.preventDefault(); navigate(link.id); }}
                className={`px-4 py-2 font-sans text-xs font-bold tracking-wider transition-all rounded-lg cursor-pointer ${activePage === link.id ? 'text-green-primary bg-green-light' : 'text-muted-foreground hover:text-green-primary hover:bg-bg-soft'
                  }`}
                aria-current={activePage === link.id ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#donate"
            onClick={(e) => { e.preventDefault(); navigate('donate'); }}
            className="ml-auto bg-green-primary text-white border-none py-2.5 px-6 rounded-full font-bold text-xs tracking-wider cursor-pointer hover:bg-green-dark transition-all shadow-md shadow-green-primary/20"
            aria-label="Donate to Heavendoo Foundation"
          >
            DONATE NOW
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" role="main">
        <AnimatePresence mode="wait">
          <div key={activePage}>
            {renderPage()}
          </div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-bg-soft text-dark-base pt-24 pb-12 px-6 md:px-12 border-t border-border-subtle" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20 border-b border-border-subtle pb-20">
            <div className="col-span-1 md:col-span-1">
              <Logo />
              <p className="mt-6 text-sm text-dark-muted leading-relaxed max-w-xs font-light">
                Planting trees, restoring ecosystems, and building a greener planet — one tree at a time. Authentically records every seed.
              </p>
            </div>
            <div>
              <h5 className="text-[10px] font-bold text-green-mid tracking-[3px] uppercase mb-8">Foundation</h5>
              <nav aria-label="Footer foundation links" className="flex flex-col gap-4 text-sm text-dark-muted font-medium">
                <a href="#about" onClick={(e) => { e.preventDefault(); navigate('about'); }} className="text-left hover:text-green-primary transition-colors">About Us</a>
                <a href="#projects" onClick={(e) => { e.preventDefault(); navigate('projects'); }} className="text-left hover:text-green-primary transition-colors">Projects</a>
                <a href="#records" onClick={(e) => { e.preventDefault(); navigate('records'); }} className="text-left hover:text-green-primary transition-colors">Records</a>
                <a href="#research" onClick={(e) => { e.preventDefault(); navigate('research'); }} className="text-left hover:text-green-primary transition-colors">Research</a>
                <a href="#certificates" onClick={(e) => { e.preventDefault(); navigate('certificates'); }} className="text-left hover:text-green-primary transition-colors">Certificates</a>
              </nav>
            </div>
            <div>
              <h5 className="text-[10px] font-bold text-green-mid tracking-[3px] uppercase mb-8">Initiatives</h5>
              <nav aria-label="Footer initiatives links" className="flex flex-col gap-4 text-sm text-dark-muted font-medium">
                <span className="hover:text-green-primary cursor-pointer">School Drive</span>
                <a href="#donate" onClick={(e) => { e.preventDefault(); navigate('donate'); }} className="text-left hover:text-green-primary transition-colors">Donate</a>
              </nav>
            </div>
            <div>
              <h5 className="text-[10px] font-bold text-green-mid tracking-[3px] uppercase mb-8">Contact</h5>
              <address className="flex flex-col gap-4 text-sm text-dark-muted font-medium not-italic">
                <span>Chandigarh, India</span>
                <a href="mailto:hello@heavendoo.org" className="hover:text-green-primary transition-colors">hello@heavendoo.org</a>
                <a href="tel:+918690906006" className="hover:text-green-primary transition-colors">+91 86909 06006</a>
              </address>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-muted-foreground tracking-[1px] font-bold uppercase">
            <span>© 2026 Heavendoo Foundation. All rights reserved.</span>
            <div className="flex gap-8">
              <span onClick={() => navigate('admin')} className="hover:text-green-primary cursor-pointer transition-all">Admin Panel</span>
              <span className="hover:text-green-primary cursor-pointer transition-all">Privacy Policy</span>
              <span className="hover:text-green-primary cursor-pointer transition-all">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
