const { defineConfig } = require('vite');
const tailwindcss = require('@tailwindcss/vite').default;
const { resolve } = require('path');

module.exports = defineConfig({
  base: './',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        numbers: resolve(__dirname, 'eapl-in-numbers.html'),
        history: resolve(__dirname, 'corporate-history.html'),
        boardCommittee: resolve(__dirname, 'board-committee.html'),
        governance: resolve(__dirname, 'corporate-governance.html'),
        leadershipTeam: resolve(__dirname, 'leadership-team.html'),
        policies: resolve(__dirname, 'policies.html'),
        listing: resolve(__dirname, 'listing.html'),
        disclosures: resolve(__dirname, 'disclosures.html'),
        business: resolve(__dirname, 'business.html'),
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
