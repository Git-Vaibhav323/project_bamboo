import { useEffect } from 'react';
import { useLocation } from 'wouter';

const SITE_NAME = 'Baans Infra';
const SITE_DESCRIPTION =
  'Luxury bamboo resorts, villas, pavilions and sustainable structures built across India.';

const routeMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Baans Infra | Luxury Bamboo Architecture in India',
    description: SITE_DESCRIPTION,
  },
  '/projects': {
    title: 'Projects | Baans Infra',
    description: 'Explore Baans Infra bamboo resorts, villas, pavilions and rammed earth projects.',
  },
  '/about': {
    title: 'About | Baans Infra',
    description: 'Meet the team and craft behind Baans Infra sustainable bamboo construction.',
  },
  '/team': {
    title: 'Team | Baans Infra',
    description: 'Meet the people building refined bamboo structures across India.',
  },
  '/blogs': {
    title: 'Blogs | Baans Infra',
    description: 'Ideas and stories about bamboo architecture, sustainable building and natural materials.',
  },
  '/contact': {
    title: 'Contact | Baans Infra',
    description: 'Start your bamboo resort, villa, pavilion or commercial structure with Baans Infra.',
  },
};

function upsertMeta(selector: string, attrs: Record<string, string>, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attrs).forEach(([key, value]) => el?.setAttribute(key, value));
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(url: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.rel = 'canonical';
    document.head.appendChild(el);
  }
  el.href = url;
}

export default function SEO() {
  const [location] = useLocation();

  useEffect(() => {
    const meta = routeMeta[location] || (
      location.startsWith('/projects/')
        ? { title: `Project | ${SITE_NAME}`, description: 'Project details, gallery and building story from Baans Infra.' }
        : location.startsWith('/blogs/')
          ? { title: `Blog | ${SITE_NAME}`, description: 'Insights from Baans Infra on bamboo, design and sustainable construction.' }
          : { title: SITE_NAME, description: SITE_DESCRIPTION }
    );

    const canonical = `${window.location.origin}${location}`;
    document.title = meta.title;
    upsertMeta('meta[name="description"]', { name: 'description' }, meta.description);
    upsertMeta('meta[property="og:title"]', { property: 'og:title' }, meta.title);
    upsertMeta('meta[property="og:description"]', { property: 'og:description' }, meta.description);
    upsertMeta('meta[property="og:type"]', { property: 'og:type' }, 'website');
    upsertMeta('meta[property="og:url"]', { property: 'og:url' }, canonical);
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    upsertCanonical(canonical);
  }, [location]);

  return null;
}
