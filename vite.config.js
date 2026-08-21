const { defineConfig } = require('vite');
const tailwindcss = require('@tailwindcss/vite').default;
const { resolve } = require('path');
const { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } = require('fs');

let deployBasePath = '/';

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
  const defaultSiteUrl = deployBasePath === '/' ? 'https://eaplworld.com' : `https://ravishridhar.github.io${deployBasePath}`;
  const siteOrigin = (process.env.SITE_URL || defaultSiteUrl).replace(/\/$/, '');
  const routes = [...topLevelCleanRoutes, ...Object.keys(nestedCleanRoutes)].sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });
  const urls = routes.map((route) => `  <url><loc>${siteOrigin}${route}</loc></url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function prefixRootUrls(directory) {
  if (deployBasePath === '/') return;
  const prefix = deployBasePath.slice(0, -1);

  const visit = (currentDirectory) => {
    for (const entry of readdirSync(currentDirectory, { withFileTypes: true })) {
      const file = resolve(currentDirectory, entry.name);
      if (entry.isDirectory()) {
        visit(file);
        continue;
      }
      if (!/\.(?:html|css|js)$/.test(entry.name)) continue;

      const source = readFileSync(file, 'utf8');
      let updated = source;

      if (entry.name.endsWith('.html')) {
        updated = updated.replace(/((?:src|href|poster)=["'])\/(?!eastman(?:\/|["']))/g, `$1${prefix}/`);
      } else if (entry.name.endsWith('.css')) {
        updated = updated.replace(/url\((['"]?)\/(?!eastman\/)/g, `url($1${prefix}/`);
      } else if (entry.name.endsWith('.js')) {
        updated = updated.replace(/(["'`])\/(?![>%]|eastman(?:\/|["'`]))/g, `$1${prefix}/`);
      }

      if (updated !== source) writeFileSync(file, updated);
    }
  };

  visit(directory);
}

function cleanUrlPages() {
  const routeRequest = (request, response) => {
    if (!request.url) return;
    const [pathname, query = ''] = request.url.split('?');
    const basePrefix = deployBasePath === '/' ? '' : deployBasePath.slice(0, -1);
    const routePath = basePrefix && pathname.startsWith(basePrefix) ? pathname.slice(basePrefix.length) || '/' : pathname;
    const normalizedPath = routePath.replace(/\/$/, '') || '/';
    const acceptsHtml = !request.headers.accept || request.headers.accept.includes('text/html');

    if (nestedCleanRoutes[normalizedPath]) {
      request.url = `/${nestedCleanRoutes[normalizedPath]}${query ? `?${query}` : ''}`;
    } else if (topLevelCleanRoutes.includes(normalizedPath)) {
      request.url = normalizedPath === '/' ? `/${query ? `?${query}` : ''}` : `${normalizedPath}.html${query ? `?${query}` : ''}`;
    } else if (acceptsHtml && !/\.[a-z0-9]+$/i.test(routePath)) {
      request.url = `/404.html${query ? `?${query}` : ''}`;
      response.statusCode = 404;
    }
  };

  return {
    name: 'clean-url-pages',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        routeRequest(request, response);
        next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        routeRequest(request, response);
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
      prefixRootUrls(resolve(__dirname, 'dist'));
    },
  };
}

module.exports = defineConfig(({ command }) => {
  const configuredBase = process.env.VITE_BASE_PATH || (command === 'build' ? '/eastman/' : '/');
  deployBasePath = configuredBase === '/' ? '/' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`;

  return {
    base: deployBasePath,
    plugins: [tailwindcss(), cleanUrlPages()],
    build: {
    assetsInlineLimit: 0,
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        notFound: resolve(__dirname, '404.html'),
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
  };
});
