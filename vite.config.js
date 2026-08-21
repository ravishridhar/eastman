const { defineConfig } = require('vite');
const tailwindcss = require('@tailwindcss/vite').default;
const { resolve } = require('path');
const { copyFileSync, mkdirSync, readdirSync, writeFileSync } = require('fs');

const leadershipProfileSlugs = [
  'vishal-puri',
  'sanjay-singh',
  'jitender-manav',
  'hemant-nagpal',
  'surajit-sur',
  'mantosh-kumar',
  'tilak-raj',
  'sunil-tiku',
  'sanjay-kumar-makkar',
];

const boardProfileSlugs = [
  'jagdish-rai-singal',
  'shekhar-singal',
  'ashok-kumar-jain',
  'goutam-kumar',
  'satpal-kumar-arora',
  'rajat-diwaker',
  'sanjeev-gupta',
  'manjusha-bhatnagar',
  'rahul-nitin-sinnarkar',
];

const nestedCleanRoutes = {
  '/manufacturing-infrastructure/conventional-tubular-batteries': 'conventional-tubular-batteries.html',
  '/manufacturing-infrastructure/power-electronics': 'power-electronics.html',
  '/manufacturing-infrastructure/lithium-batteries': 'lithium-batteries.html',
  '/manufacturing-infrastructure/solar-panels': 'solar-panels.html',
  '/our-businesses/last-mile-e-mobility-solutions': 'last-mile-e-mobility-solutions.html',
  '/our-businesses/residential-solar-with-storage': 'residential-solar-with-storage.html',
  '/our-businesses/continued-energy-solutions': 'continued-energy-solutions.html',
  '/our-businesses/advanced-electronics-manufacturing': 'advanced-electronics-manufacturing.html',
  ...Object.fromEntries(leadershipProfileSlugs.map((slug) => [`/leadership-team/${slug}`, 'leadership-team.html'])),
  ...Object.fromEntries(boardProfileSlugs.map((slug) => [`/corporate-governance/${slug}`, 'corporate-governance.html'])),
};

const topLevelCleanRoutes = [
  '/',
  '/about-us',
  '/eapl-in-numbers',
  '/corporate-history',
  '/board-committee',
  '/corporate-governance',
  '/leadership-team',
  '/policies',
  '/disclosures',
  '/shareholders-information',
  '/terms-and-conditions',
  '/our-businesses',
  '/partner-with-us',
  '/contact-us',
  '/life-at-eastman',
  '/resources',
  '/media-news',
  '/blog',
  '/social-feed',
  '/white-papers',
  '/videos',
  '/manufacturing-infrastructure',
  '/research-development',
];

function createSitemap() {
  const siteOrigin = (process.env.SITE_URL || 'https://eaplworld.com').replace(/\/$/, '');
  const routes = [...topLevelCleanRoutes, ...Object.keys(nestedCleanRoutes)].sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });
  const urls = routes.map((route) => `  <url><loc>${siteOrigin}${route}</loc></url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function cleanUrlPages() {
  return {
    name: 'clean-url-pages',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        if (!request.url) return next();
        const [pathname, query = ''] = request.url.split('?');
        const normalizedPath = pathname.replace(/\/$/, '');
        if (nestedCleanRoutes[normalizedPath]) {
          request.url = `/${nestedCleanRoutes[normalizedPath]}${query ? `?${query}` : ''}`;
        } else if (/^\/[a-z0-9-]+\/?$/i.test(pathname) && pathname !== '/') {
          request.url = `${pathname.replace(/\/$/, '')}.html${query ? `?${query}` : ''}`;
        }
        next();
      });
    },
    closeBundle() {
      for (const file of readdirSync(resolve(__dirname, 'dist'))) {
        if (!file.endsWith('.html') || file === 'index.html') continue;
        const slug = file.slice(0, -5);
        const directory = resolve(__dirname, 'dist', slug);
        mkdirSync(directory, { recursive: true });
        copyFileSync(resolve(__dirname, 'dist', file), resolve(directory, 'index.html'));
      }

      for (const [route, file] of Object.entries(nestedCleanRoutes)) {
        const directory = resolve(__dirname, 'dist', route.slice(1));
        mkdirSync(directory, { recursive: true });
        copyFileSync(resolve(__dirname, 'dist', file), resolve(directory, 'index.html'));
      }

      writeFileSync(resolve(__dirname, 'dist', 'sitemap.xml'), createSitemap());
    },
  };
}

module.exports = defineConfig({
  base: '/',
  plugins: [tailwindcss(), cleanUrlPages()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about-us.html'),
        numbers: resolve(__dirname, 'eapl-in-numbers.html'),
        history: resolve(__dirname, 'corporate-history.html'),
        boardCommittee: resolve(__dirname, 'board-committee.html'),
        governance: resolve(__dirname, 'corporate-governance.html'),
        leadershipTeam: resolve(__dirname, 'leadership-team.html'),
        policies: resolve(__dirname, 'policies.html'),
        listing: resolve(__dirname, 'listing.html'),
        disclosures: resolve(__dirname, 'disclosures.html'),
        shareholdersInformation: resolve(__dirname, 'shareholders-information.html'),
        termsAndConditions: resolve(__dirname, 'terms-and-conditions.html'),
        business: resolve(__dirname, 'our-businesses.html'),
        lastMileEMobility: resolve(__dirname, 'last-mile-e-mobility-solutions.html'),
        residentialSolarWithStorage: resolve(__dirname, 'residential-solar-with-storage.html'),
        continuedEnergySolutions: resolve(__dirname, 'continued-energy-solutions.html'),
        advancedElectronicsManufacturing: resolve(__dirname, 'advanced-electronics-manufacturing.html'),
        partnerWithUs: resolve(__dirname, 'partner-with-us.html'),
        contactUs: resolve(__dirname, 'contact-us.html'),
        lifeAtEastman: resolve(__dirname, 'life-at-eastman.html'),
        resources: resolve(__dirname, 'resources.html'),
        mediaNews: resolve(__dirname, 'media-news.html'),
        blog: resolve(__dirname, 'blog.html'),
        socialFeed: resolve(__dirname, 'social-feed.html'),
        whitePapers: resolve(__dirname, 'white-papers.html'),
        videos: resolve(__dirname, 'videos.html'),
        manufacturingInfrastructure: resolve(__dirname, 'manufacturing-infrastructure.html'),
        lithiumBatteries: resolve(__dirname, 'lithium-batteries.html'),
        powerElectronics: resolve(__dirname, 'power-electronics.html'),
        solarPanels: resolve(__dirname, 'solar-panels.html'),
        conventionalTubularBatteries: resolve(__dirname, 'conventional-tubular-batteries.html'),
        researchDevelopment: resolve(__dirname, 'research-development.html'),
        researchLithiumBatteries: resolve(__dirname, 'research-lithium-batteries.html'),
        researchPowerElectronics: resolve(__dirname, 'research-power-electronics.html'),
        researchConventionalTubularBatteries: resolve(__dirname, 'research-conventional-tubular-batteries.html'),
        researchSolarPanels: resolve(__dirname, 'research-solar-panels.html'),
      },
    },
  },
  server: {
    port: 5173,
  },
});
