import { useEffect } from 'react';

/**
 * SEO metadata configuration for each page.
 * Updates document.title and meta description dynamically as users navigate.
 */
const SEO_CONFIG: Record<string, { title: string; description: string }> = {
  home: {
    title: 'Heavendoo Foundation — Restoring the Earth, One Sapling at a Time',
    description: 'Heavendoo Foundation is a nonprofit dedicated to large-scale, transparent reforestation. Every tree planted is GPS-tagged, publicly tracked, and audited. Join our mission to restore ecosystems worldwide.',
  },
  about: {
    title: 'About Us — Heavendoo Foundation',
    description: 'Learn about Heavendoo Foundation, a registered nonprofit in Chandigarh, India. We plant trees, record every sapling with GPS coordinates, and maintain forests for future generations.',
  },
  vision: {
    title: 'Our Vision — Heavendoo Foundation',
    description: 'Our vision is a planet where reforestation is a foundation, not an option. We aim to restore 100 million hectares by 2050 through native species planting, transparent records, and education.',
  },
  projects: {
    title: 'Our Projects — Heavendoo Foundation',
    description: 'Explore Heavendoo Foundation initiatives: tree aforestation, carbon credit crypto, dynamic NFTs, water desalination, and AI-powered ecological monitoring.',
  },
  records: {
    title: 'Global Tree Registry — Heavendoo Foundation',
    description: 'Browse our public tree registry with GPS-verified planting records. Every sapling planted by Heavendoo is tagged, tracked, and audited for full transparency.',
  },
  research: {
    title: 'Research & Papers — Heavendoo Foundation',
    description: 'Peer-reviewed research from Heavendoo Foundation and partner universities on reforestation, urban ecology, native species recovery, and climate resilience.',
  },
  certificates: {
    title: 'Certificates & Accreditations — Heavendoo Foundation',
    description: 'Verified credentials validating Heavendoo Foundation\'s commitment to transparency, ecological impact, and organizational excellence.',
  },
  news: {
    title: 'Newsroom — Heavendoo Foundation',
    description: 'Latest updates, milestones, partnerships, and field stories from Heavendoo Foundation and our global reforestation community.',
  },
  contact: {
    title: 'Contact Us — Heavendoo Foundation',
    description: 'Get in touch with Heavendoo Foundation. Whether you want to donate, volunteer, partner, or learn more — reach us at hello@heavendoo.org or visit Chandigarh, India.',
  },
  donate: {
    title: 'Donate — Support Heavendoo Foundation',
    description: 'Every contribution funds the planting, tracking, and protection of native forests. Donate via UPI, bank transfer, or QR code. Tax benefits under Section 80G.',
  },
  admin: {
    title: 'Admin Panel — Heavendoo Foundation',
    description: 'Restricted admin panel for managing Heavendoo Foundation data.',
  },
};

/**
 * Custom hook that updates document.title and meta description
 * whenever the active page changes. This ensures each "virtual page"
 * in the SPA has unique SEO-relevant metadata.
 */
export function useSEO(activePage: string) {
  useEffect(() => {
    const config = SEO_CONFIG[activePage] || SEO_CONFIG.home;

    // Update document title
    document.title = config.title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', config.description);
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      metaDesc.setAttribute('content', config.description);
      document.head.appendChild(metaDesc);
    }

    // Update Open Graph title and description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', config.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', config.description);

    // Update Twitter title and description
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', config.title);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', config.description);

    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const hash = activePage === 'home' ? '' : `#${activePage}`;
      canonical.setAttribute('href', `https://heavendoo.org/${hash}`);
    }

  }, [activePage]);
}
