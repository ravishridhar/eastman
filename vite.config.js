const { defineConfig } = require('vite');
const tailwindcss = require('@tailwindcss/vite').default;
const { resolve } = require('path');
const { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } = require('fs');
const blogArticles = require('./data/blog-articles.json');
const auditRedirects = require('./data/audit-redirects.json');

let deployBasePath = '/';

const leadershipProfileSlugs = [
  'vishal-puri',
  'sanjay-singh',
  'jitender-manav',
  'hemant-nagpal',
  'surajit-sur',
  'mantosh-kumar',
  'sunil-tiku',
  'sanjay-kumar-makkar',
];

const sharedGovernanceProfileSlugs = [
  'shekhar-singal',
  'ashok-kumar-jain',
  'goutam-kumar',
];

const boardOnlyProfileSlugs = [
  'jagdish-rai-singal',
  'satpal-kumar-arora',
  'rajat-diwaker',
  'sanjeev-gupta',
  'manjusha-bhatnagar',
];

const companySecretarySlug = 'rahul-nitin-sinnarkar';

const nestedCleanRoutes = {
  ...Object.fromEntries(blogArticles.map(({ path, file }) => [path, file])),
  '/manufacturing-infrastructure/conventional-tubular-batteries': 'conventional-tubular-batteries.html',
  '/manufacturing-infrastructure/power-electronics': 'power-electronics.html',
  '/manufacturing-infrastructure/lithium-batteries': 'lithium-batteries.html',
  '/manufacturing-infrastructure/solar-panels': 'solar-panels.html',
  '/our-businesses/last-mile-e-mobility-solutions': 'last-mile-e-mobility-solutions.html',
  '/our-businesses/residential-solar-with-storage': 'residential-solar-with-storage.html',
  '/our-businesses/continued-energy-solutions': 'continued-energy-solutions.html',
  '/our-businesses/advanced-electronics-manufacturing': 'advanced-electronics-manufacturing.html',
  '/our-businesses/international-business': 'international-business.html',
  ...Object.fromEntries(leadershipProfileSlugs.map((slug) => [`/leadership-team/${slug}`, 'leadership-team.html'])),
  ...Object.fromEntries([...sharedGovernanceProfileSlugs, ...boardOnlyProfileSlugs].map((slug) => [`/corporate-governance/${slug}`, 'corporate-governance.html'])),
  ...Object.fromEntries([...sharedGovernanceProfileSlugs, 'rajesh-jindal', companySecretarySlug].map((slug) => [`/kmp/${slug}`, 'kmp.html'])),
};

const topLevelCleanRoutes = [
  '/',
  '/about-us',
  '/eapl-in-numbers',
  '/corporate-history',
  '/board-committee',
  '/corporate-governance',
  '/kmp',
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
  '/leadership-team/rajesh-jindal': '/kmp/rajesh-jindal',
  [`/corporate-governance/${companySecretarySlug}`]: `/kmp/${companySecretarySlug}`,
  ...Object.fromEntries(boardOnlyProfileSlugs.map((slug) => [`/kmp/${slug}`, `/corporate-governance/${slug}`])),
  '/our-businesses/conventional-tubular-batteries': '/manufacturing-infrastructure/conventional-tubular-batteries',
  '/businesses/conventional-tubular-batteries': '/manufacturing-infrastructure/conventional-tubular-batteries',
  '/our-businesses/lithium-ion-battery-packs': '/manufacturing-infrastructure/lithium-batteries',
  '/businesses/lithium-ion-battery-packs': '/manufacturing-infrastructure/lithium-batteries',
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
  '/rahul-nitin-sinnarkar': '/kmp/rahul-nitin-sinnarkar',
  '/Tilak-Raj': '/leadership-team',
  '/leadership-team/tilak-raj': '/leadership-team',
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

function siteUrl(basePath) {
  const defaultSiteUrl = basePath === '/' ? 'https://eaplworld.com' : `https://ravishridhar.github.io${basePath}`;
  return (process.env.SITE_URL || defaultSiteUrl).replace(/\/$/, '');
}

const indexableRoutes = new Set([...topLevelCleanRoutes, ...Object.keys(nestedCleanRoutes)]);
const pageUrl = (route) => route === '/' ? route : `${route}/`;
const escapeRewritePattern = (route) => route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\x20');

function createSitemap(basePath) {
  const urls = [...indexableRoutes].sort().map((route) => `  <url><loc>${siteUrl(basePath)}${pageUrl(route)}</loc></url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function createApacheConfig(basePath, directory) {
  const errorPage = `ErrorDocument 404 ${deployedPath('/404.html', basePath)}\n`;
  if (basePath !== '/' || siteUrl(basePath) !== 'https://eaplworld.com') return errorPage;

  const rules = [
    'RewriteEngine On',
    // The old dealer directory used numeric pagination on both of these paths.
    'RewriteCond %{QUERY_STRING} (?:^|&)page=[0-9]+(?:&|$)',
    'RewriteRule ^(?:dealer-locator/?)?$ - [G,L]',
  ];
  for (const [source, target] of Object.entries({ ...legacyRedirects, ...auditRedirects })) {
    const isPage = indexableRoutes.has(target);
    const isDocument = target.startsWith('/documents/') && existsSync(resolve(directory, target.slice(1)));
    if (indexableRoutes.has(source) || (!isPage && !isDocument)) {
      throw new Error(`Invalid legacy redirect: ${source} -> ${target}`);
    }
    const pattern = escapeRewritePattern(source.slice(1));
    // mod_rewrite treats %N as a condition backreference, including in encoded filenames.
    const documentUrl = () => target.split('/').map((segment) => encodeURIComponent(segment)
      .replace(/[!'()*]/g, (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`))
      .join('/').replace(/%/g, '\\%');
    const destination = isPage ? pageUrl(target) : documentUrl();
    rules.push(`RewriteRule ^${pattern}/?$ https://eaplworld.com${destination} [R=301,L,NE]`);
  }

  rules.push(
    // Normalize known page directories before the hostname rule so these requests redirect once.
    `RewriteRule ^(${[...indexableRoutes].filter((route) => route !== '/').map((route) => escapeRewritePattern(route.slice(1))).join('|')})$ https://eaplworld.com/$1/ [R=301,L,NE]`,
    'RewriteCond %{HTTP_HOST} ^www\\.eaplworld\\.com(?::[0-9]+)?$ [NC,OR]',
    'RewriteCond %{HTTPS} !=on',
    'RewriteCond %{HTTP_HOST} ^(?:www\\.)?eaplworld\\.com(?::[0-9]+)?$ [NC]',
    'RewriteRule ^ https://eaplworld.com%{REQUEST_URI} [R=301,L,NE]',
  );
  return `${errorPage}\n${rules.join('\n')}\n`;
}

function updatePageMetadata(directory, basePath) {
  const canonicalRoutes = new Map([['index.html', '/']]);
  for (const route of indexableRoutes) {
    if (route === '/') continue;
    canonicalRoutes.set(`${route.slice(1)}/index.html`, route);
    const source = nestedCleanRoutes[route] || `${route.slice(1)}.html`;
    if (!canonicalRoutes.has(source)) canonicalRoutes.set(source, route);
    const alias = source.replace(/\.html$/, '/index.html');
    if (!canonicalRoutes.has(alias) && existsSync(resolve(directory, alias))) canonicalRoutes.set(alias, route);
  }

  const normalizeLinks = (html) => html.replace(
    /(\b(?:href|data-nav-href)=["'])(?:https?:\/\/(?:www\.)?eaplworld\.com)?(\/(?!\/)[^"'?#]*)([^"']*)/g,
    (match, attribute, path, suffix) => {
      const route = path.replace(/\/$|\.html$/g, '') || '/';
      return indexableRoutes.has(route) ? `${attribute}${pageUrl(route)}${suffix}` : match;
    },
  );

  for (const [file, route] of canonicalRoutes) {
    const path = resolve(directory, file);
    const html = normalizeLinks(readFileSync(path, 'utf8'))
      .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '')
      .replace('</head>', `  <link rel="canonical" href="${siteUrl(basePath)}${pageUrl(route)}" />\n  </head>`);
    writeFileSync(path, html);
  }

  for (const file of ['404.html', '404/index.html']) {
    const path = resolve(directory, file);
    writeFileSync(path, normalizeLinks(readFileSync(path, 'utf8'))
      .replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>'));
  }
}

function prefixRootUrls(directory, basePath = deployBasePath) {
  if (basePath === '/') return;
  const prefix = basePath.slice(0, -1);
  const prefixUrl = (url) => url === prefix || url.startsWith(`${prefix}/`) || url.startsWith('//')
    ? url
    : `${prefix}${url}`;

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
        updated = updated.replace(/((?:src|href|poster|action)=["'])(\/[^"']*)/g, (_match, attribute, url) => `${attribute}${prefixUrl(url)}`);
      } else if (entry.name.endsWith('.css')) {
        updated = updated.replace(/url\((['"]?)(\/[^)'"\s]*)/g, (_match, quote, url) => `url(${quote}${prefixUrl(url)}`);
      } else if (entry.name.endsWith('.js')) {
        updated = updated.replace(/(["'`])(\/(?![>%])[^"'`\s]*)/g, (_match, quote, url) => `${quote}${prefixUrl(url)}`);
      }

      if (updated !== source) writeFileSync(file, updated);
    }
  };

  visit(directory);
}

function cleanUrlPages(basePath) {
  let resolvedBasePath = basePath;
  let outputDirectory;

  const routeRequest = (request, response) => {
    if (!request.url) return;
    const [pathname, query = ''] = request.url.split('?');
    const basePrefix = resolvedBasePath === '/' ? '' : resolvedBasePath.slice(0, -1);
    const routePath = basePrefix && pathname.startsWith(basePrefix) ? pathname.slice(basePrefix.length) || '/' : pathname;
    const normalizedPath = routePath.replace(/\/$/, '') || '/';
    const acceptsHtml = !request.headers.accept || request.headers.accept.includes('text/html');

    if (legacyRedirects[normalizedPath]) {
      response.statusCode = 301;
      const destination = deployedPath(pageUrl(legacyRedirects[normalizedPath]), resolvedBasePath);
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
      outputDirectory = resolve(config.root, config.build.outDir);
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
      for (const file of readdirSync(outputDirectory)) {
        if (!file.endsWith('.html') || file === 'index.html') continue;
        const slug = file.slice(0, -5);
        const directory = resolve(outputDirectory, slug);
        mkdirSync(directory, { recursive: true });
        copyFileSync(resolve(outputDirectory, file), resolve(directory, 'index.html'));
      }

      for (const [route, file] of Object.entries(nestedCleanRoutes)) {
        const directory = resolve(outputDirectory, route.slice(1));
        mkdirSync(directory, { recursive: true });
        copyFileSync(resolve(outputDirectory, file), resolve(directory, 'index.html'));
      }

      for (const [route, target] of Object.entries(legacyRedirects)) {
        const redirectFile = route.endsWith('.html')
          ? resolve(outputDirectory, route.slice(1))
          : resolve(outputDirectory, route.slice(1), 'index.html');
        mkdirSync(resolve(redirectFile, '..'), { recursive: true });
        writeFileSync(redirectFile, createStaticRedirect(pageUrl(target), resolvedBasePath));
      }

      updatePageMetadata(outputDirectory, resolvedBasePath);
      writeFileSync(resolve(outputDirectory, 'sitemap.xml'), createSitemap(resolvedBasePath));
      writeFileSync(resolve(outputDirectory, '.htaccess'), createApacheConfig(resolvedBasePath, outputDirectory));
      if (resolvedBasePath === '/' && siteUrl(resolvedBasePath) === 'https://eaplworld.com') {
        writeFileSync(resolve(outputDirectory, 'robots.txt'),
          'User-agent: *\nDisallow: /node/\nDisallow: /taxonomy/\n\nSitemap: https://eaplworld.com/sitemap.xml\n');
      }
      prefixRootUrls(outputDirectory, resolvedBasePath);
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
        kmp: resolve(__dirname, 'kmp.html'),
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
        internationalBusiness: resolve(__dirname, 'international-business.html'),
        partnerWithUs: resolve(__dirname, 'partner-with-us.html'),
        contactUs: resolve(__dirname, 'contact-us.html'),
        lifeAtEastman: resolve(__dirname, 'life-at-eastman.html'),
        resources: resolve(__dirname, 'resources.html'),
        mediaNews: resolve(__dirname, 'media-news.html'),
        blog: resolve(__dirname, 'blog.html'),
        ...Object.fromEntries(blogArticles.map(({ file }, index) => [`blogArticle${index}`, resolve(__dirname, file)])),
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
      watch: {
        ignored: ['**/dist 2/**', '**/backups/**'],
      },
      proxy: {
        '/api': 'http://127.0.0.1:8000',
      },
    },
  };
});
