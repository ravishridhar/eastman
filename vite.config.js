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
  '/terms-of-use',
  '/privacy-policy',
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

const legacyRedirects = {
  '/dealer-locator': '/',
  '/white-paper': '/white-papers',
  '/media-centre': '/media-news',
  '/about-us/our-values': '/about-us',
  '/our-businesses/global-businesses': '/our-businesses',
  '/Sanjay-Singh': '/leadership-team/sanjay-singh',
  '/Vishal-Puri': '/leadership-team/vishal-puri',
  '/goutam-kumar': '/corporate-governance/goutam-kumar',
  '/rajat-diwaker': '/corporate-governance/rajat-diwaker',
  '/Jitender-Manav': '/leadership-team/jitender-manav',
  '/jagdish-rai-singal': '/corporate-governance/jagdish-rai-singal',
  '/Sanjay-Kumar-Makkar': '/leadership-team/sanjay-kumar-makkar',
  '/sanjeev-gupta': '/corporate-governance/sanjeev-gupta',
  '/Hemant-Nagpal': '/leadership-team/hemant-nagpal',
  '/Mantosh-Kumar': '/leadership-team/mantosh-kumar',
  '/ashok-kumar-jain': '/corporate-governance/ashok-kumar-jain',
  '/rahul-nitin-sinnarkar': '/corporate-governance/rahul-nitin-sinnarkar',
  '/Tilak-Raj': '/leadership-team/tilak-raj',
  '/manjusha-bhatnagar': '/corporate-governance/manjusha-bhatnagar',
  '/shekhar-singal': '/corporate-governance/shekhar-singal',
  '/Sunil-Tiku': '/leadership-team/sunil-tiku',
  '/Surajit-Sur': '/leadership-team/surajit-sur',
  '/satpal-kumar-arora': '/corporate-governance/satpal-kumar-arora',
  '/top-10-battery-manufacturers-in-india': '/',
  '/debunked-6-inverter-battery-myths-you-should-stop-believing': '/',
  '/harnessing-solar-power-sustainable-energy-solution-your-home': '/',
  '/home-battery-system-compact-guide': '/',
  '/Made-in-India-Powering-the-World-Eastman-50-plus-Country-Reach': '/',
  '/everything-to-know-about-tubular-batteries': '/',
  '/the-future-of-solar-energy-innovations-driving-the-industry-in-2025': '/',
  '/why-eastman-lithium-batteries-are-emerging-as-indias-no-1-choice-for-solar-storage': '/',
  '/report.html': '/resources',
};

function deployedPath(route, basePath = deployBasePath) {
  const basePrefix = basePath === '/' ? '' : basePath.slice(0, -1);
  return `${basePrefix}${route}` || '/';
}

function createStaticRedirect(target, basePath) {
  const destination = deployedPath(target, basePath);
  const escapedDestination = destination.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  return `<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="robots" content="noindex">\n  <meta http-equiv="refresh" content="0; url=${escapedDestination}">\n  <link rel="canonical" href="${escapedDestination}">\n  <title>Redirecting…</title>\n  <script>window.location.replace(${JSON.stringify(destination)} + window.location.search + window.location.hash);</script>\n</head>\n<body>\n  <p>This page has moved to <a href="${escapedDestination}">${escapedDestination}</a>.</p>\n</body>\n</html>\n`;
}

function createSitemap(basePath = deployBasePath) {
  const defaultSiteUrl = basePath === '/' ? 'https://eaplworld.com' : `https://ravishridhar.github.io${basePath}`;
  const siteOrigin = (process.env.SITE_URL || defaultSiteUrl).replace(/\/$/, '');
  const routes = [...topLevelCleanRoutes, ...Object.keys(nestedCleanRoutes)].sort((a, b) => {
    if (a === '/') return -1;
    if (b === '/') return 1;
    return a.localeCompare(b);
  });
  const urls = routes.map((route) => `  <url><loc>${siteOrigin}${route}</loc></url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function prefixRootUrls(directory, basePath = deployBasePath) {
  if (basePath === '/') return;
  const prefix = basePath.slice(0, -1);

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

function cleanUrlPages(basePath) {
  let resolvedBasePath = basePath;

  const routeRequest = (request, response) => {
    if (!request.url) return;
    const [pathname, query = ''] = request.url.split('?');
    const basePrefix = resolvedBasePath === '/' ? '' : resolvedBasePath.slice(0, -1);
    const routePath = basePrefix && pathname.startsWith(basePrefix) ? pathname.slice(basePrefix.length) || '/' : pathname;
    const normalizedPath = routePath.replace(/\/$/, '') || '/';
    const acceptsHtml = !request.headers.accept || request.headers.accept.includes('text/html');

    if (legacyRedirects[normalizedPath]) {
      response.statusCode = 301;
      const destination = deployedPath(legacyRedirects[normalizedPath], resolvedBasePath);
      response.setHeader('Location', `${destination}${query ? `?${query}` : ''}`);
      response.end();
      return true;
    } else if (nestedCleanRoutes[normalizedPath]) {
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
    configResolved(config) {
      resolvedBasePath = config.base === '/' ? '/' : `/${config.base.replace(/^\/+|\/+$/g, '')}/`;
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!routeRequest(request, response)) next();
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        if (!routeRequest(request, response)) next();
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

      for (const [route, target] of Object.entries(legacyRedirects)) {
        const redirectFile = route.endsWith('.html')
          ? resolve(__dirname, 'dist', route.slice(1))
          : resolve(__dirname, 'dist', route.slice(1), 'index.html');
        mkdirSync(resolve(redirectFile, '..'), { recursive: true });
        writeFileSync(redirectFile, createStaticRedirect(target, resolvedBasePath));
      }

      writeFileSync(resolve(__dirname, 'dist', 'sitemap.xml'), createSitemap(resolvedBasePath));
      prefixRootUrls(resolve(__dirname, 'dist'), resolvedBasePath);
    },
  };
}

module.exports = defineConfig(({ command }) => {
  const configuredBase = process.env.VITE_BASE_PATH || (command === 'build' ? '/eastman/' : '/');
  deployBasePath = configuredBase === '/' ? '/' : `/${configuredBase.replace(/^\/+|\/+$/g, '')}/`;
  const buildBasePath = deployBasePath;

  return {
    base: buildBasePath,
    plugins: [tailwindcss(), cleanUrlPages(buildBasePath)],
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
        termsOfUse: resolve(__dirname, 'terms-of-use.html'),
        privacyPolicy: resolve(__dirname, 'privacy-policy.html'),
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
