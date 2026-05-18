import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { SectionLabel, SectionTitle } from './Shared';
import { CreditCard, Landmark, QrCode, Copy, Check } from 'lucide-react';

export default function Donation() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    return onSnapshot(doc(db, 'settings', 'donation'), (s) => {
      if (s.exists()) {
        setSettings(s.data());
      }
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.GET, 'settings/donation'));
  }, []);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen pt-32 pb-24 px-6 md:px-12 bg-bg-soft"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <SectionLabel>SUPPORT THE MISSION</SectionLabel>
          <SectionTitle className="text-6xl mb-6">Invest in the Earth's Future</SectionTitle>
          <p className="text-dark-muted max-w-2xl mx-auto text-lg">
            Every contribution directly funds the planting, tracking, and protection of native forests. 
            Choose your preferred method of support.
          </p>
        </div>

        {!settings ? (
          <div className="bg-white border border-border-subtle rounded-[3rem] p-20 text-center">
            <div className="text-6xl mb-6">🌱</div>
            <h3 className="text-2xl font-serif font-bold mb-4">Direct Donation Coming Soon</h3>
            <p className="text-dark-muted max-w-sm mx-auto">
              We are currently setting up our official foundation bank accounts. Please check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Payment Scanner */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white border border-border-subtle rounded-[3rem] p-12 shadow-sm text-center"
            >
              <div className="w-16 h-16 bg-bg-soft rounded-2xl flex items-center justify-center mx-auto mb-8 text-green-primary">
                <QrCode size={32} />
              </div>
              <h3 className="text-3xl font-serif font-bold mb-4">Instant Scan & Pay</h3>
              <p className="text-dark-muted mb-10 text-sm">Scan this QR code using any UPI app (GPay, PhonePe, Paytm) to donate instantly.</p>
              
              {settings.qrCodeUrl ? (
                <div className="max-w-[300px] mx-auto bg-bg-soft p-6 rounded-3xl border border-border-subtle mb-8">
                  <img src={settings.qrCodeUrl} alt="Donation QR Code" className="w-full aspect-square object-contain rounded-xl bg-white shadow-inner" />
                </div>
              ) : (
                <div className="max-w-[300px] mx-auto bg-bg-soft p-20 rounded-3xl border border-border-subtle mb-8">
                  <div className="text-4xl">📱</div>
                </div>
              )}

              {settings.upiId && (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">UPI ID</span>
                  <div 
                    onClick={() => copyToClipboard(settings.upiId, 'upi')}
                    className="flex items-center gap-3 bg-bg-soft px-6 py-3 rounded-full border border-border-subtle cursor-pointer hover:border-green-primary transition-all group"
                  >
                    <span className="font-bold text-dark-base">{settings.upiId}</span>
                    {copied === 'upi' ? <Check size={14} className="text-green-primary" /> : <Copy size={14} className="text-muted-foreground group-hover:text-green-primary" />}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Bank Details */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="space-y-8"
            >
              <div className="bg-white border border-border-subtle rounded-[3rem] p-12 shadow-sm">
                <div className="w-16 h-16 bg-bg-soft rounded-2xl flex items-center justify-center mb-8 text-green-primary">
                  <Landmark size={32} />
                </div>
                <h3 className="text-3xl font-serif font-bold mb-4">Bank Transfer (NEFT/IMPS)</h3>
                <p className="text-dark-muted mb-10 text-sm">Directly support our operations via international or local bank transfers.</p>
                
                <div className="space-y-6">
                  <DetailItem label="Bank Name" value={settings.bankName} onCopy={() => copyToClipboard(settings.bankName, 'bank')} isCopied={copied === 'bank'} />
                  <DetailItem label="Account Holder" value={settings.accountHolder} onCopy={() => copyToClipboard(settings.accountHolder, 'holder')} isCopied={copied === 'holder'} />
                  <DetailItem label="Account Number" value={settings.accountNumber} onCopy={() => copyToClipboard(settings.accountNumber, 'acc')} isCopied={copied === 'acc'} />
                  <DetailItem label="IFSC Code" value={settings.ifsc} onCopy={() => copyToClipboard(settings.ifsc, 'ifsc')} isCopied={copied === 'ifsc'} />
                </div>
              </div>

              <div className="bg-green-primary rounded-[2.5rem] p-10 text-white shadow-xl shadow-green-primary/20">
                <div className="flex gap-4 items-start">
                  <div className="text-4xl">📜</div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">Tax Exemption</h4>
                    <p className="text-white/80 text-sm leading-relaxed">
                      All donations to Heavendoo Foundation are eligible for tax benefits under Section 80G. 
                      Please share your transfer receipt to hello@heavendoo.org to receive your certificate.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DetailItem({ label, value, onCopy, isCopied }: { label: string, value: string, onCopy: () => void, isCopied: boolean }) {
  return (
    <div className="flex justify-between items-center group">
      <div>
        <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{label}</div>
        <div className="text-lg font-bold text-dark-base">{value || '---'}</div>
      </div>
      <button 
        onClick={onCopy}
        className={`p-3 rounded-xl transition-all ${isCopied ? 'bg-green-light text-green-primary' : 'bg-bg-soft text-muted-foreground hover:bg-green-light hover:text-green-primary group-hover:opacity-100 opacity-0'}`}
      >
        {isCopied ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
  );
}
