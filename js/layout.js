const BASE_URL = import.meta.env.BASE_URL || './';
const assetPath = (path) => `${BASE_URL}${path}`;
const pagePath = (path = '') => `${BASE_URL}${path.replace(/\.html(?=($|[?#]))/, '')}`;
const headerLogo = new URL('../images/footer-logo-new.svg', import.meta.url).href;
const footerLogo = new URL('../images/eastman-logo-new.svg', import.meta.url).href;
const socialIcons = {
  facebook: new URL('../images/social_icons/facebook.svg', import.meta.url).href,
  instagram: new URL('../images/social_icons/instagram.svg', import.meta.url).href,
  linkedin: new URL('../images/social_icons/linkedin_icn.svg', import.meta.url).href,
  twitter: new URL('../images/social_icons/twitter.svg', import.meta.url).href,
  youtube: new URL('../images/social_icons/youtube_icn.svg', import.meta.url).href,
};

const headerMarkup = `
  <header class="site-header" data-header>
    <a class="brand" href="${pagePath()}" aria-label="Eastman home">
      <img src="${headerLogo}" alt="Eastman" />
    </a>

    <div class="header-nav-stack">
      <nav class="utility-nav" aria-label="Utility navigation">
        <a href="https://www.eastmanassure.com" target="_blank" rel="noopener noreferrer" aria-label="Eastman Assure Service">Eastman Assure Service</a>
        <a href="https://jrseastman.com" target="_blank" rel="noopener noreferrer" aria-label="About JRS Eastman Group">About JRS Eastman Group</a>
        <a href="${pagePath('partner-with-us')}">Partner With Us</a>
        <a href="${pagePath('contact-us')}">Contact us</a>
      </nav>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <button type="button" data-desktop-trigger="about" aria-expanded="false">About Us<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="research" data-nav-href="${pagePath('research-development/?tab=tubular#focus-areas')}" aria-expanded="false">Research &amp; Development<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="manufacturing" aria-expanded="false">Manufacturing Infrastructure<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="businesses" aria-expanded="false">Our Businesses<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="resources" aria-expanded="false">Resources<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <a href="${pagePath('life-at-eastman')}">Life@Eastman</a>
      </nav>
    </div>

    <div class="header-actions">
      <a class="phone-link" href="tel:18004198610" aria-label="Call Eastman">
        <img src="${assetPath('images/phone-icon.svg')}" alt="" class="phone-icon" />
        1800 419 8610
      </a>
      <a class="trade-chip" href="${pagePath('contact-us')}">Trade Enquiry</a>
    </div>

    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" data-menu-toggle>
      <img src="${assetPath('images/menu-icon.svg')}" alt="" />
      <span></span><span></span><span></span>
    </button>

    <div class="desktop-mega-menu" data-desktop-menu>
      <section class="mega-panel mega-panel--card" data-desktop-panel="about" aria-label="About Us submenu">
        <!-- <h2>Company</h2> -->
        <!--<a class="is-current" href="${pagePath('about-us')}">Overview &amp; Group Companies</a>-->
        <a href="${pagePath('about-us')}">Overview &amp; Group Companies</a>
        <a href="${pagePath('eapl-in-numbers')}">Eastman Auto &amp; Power in Nos.</a>
        <a href="${pagePath('corporate-history')}">Corporate History</a>
        <a href="${pagePath('corporate-governance')}">Corporate Governance</a>
        <!--<a href="${pagePath('leadership-team')}">Leadership Team</a>
        <a href="${pagePath('board-committee')}">Board Committee</a>-->
        <a href="${pagePath('shareholders-information')}">Shareholder Information</a>
        <a href="https://jrseastman.com/csr" target="_blank" rel="noopener noreferrer">CSR</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="research" aria-label="Research and Development submenu">
        <a href="${pagePath('research-development/?tab=tubular#focus-areas')}">Conventional Tubular Batteries</a>
        <a href="${pagePath('research-development/?tab=power#focus-areas')}">Power Electronics</a>
        <a href="${pagePath('research-development/?tab=lithium#focus-areas')}">Lithium-ion Batteries</a>
        <a href="${pagePath('research-development/?tab=solar#focus-areas')}">Solar Panels</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="manufacturing" aria-label="Manufacturing Infrastructure submenu">
        <!-- <h2>Manufacturing &amp; Infrastructure</h2> -->
        <a href="${pagePath('manufacturing-infrastructure')}">Overview</a>
        <a href="${pagePath('manufacturing-infrastructure/conventional-tubular-batteries')}">Conventional Tubular Batteries</a>
        <a href="${pagePath('manufacturing-infrastructure/power-electronics')}">Power Electronics</a>
        <a href="${pagePath('manufacturing-infrastructure/lithium-batteries')}">Lithium-ion Batteries</a>
        <a href="${pagePath('manufacturing-infrastructure/solar-panels')}">Solar Panels</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="businesses" aria-label="Our Businesses submenu">
        <!-- <h2>Our Businesses</h2> -->
          <a href="${pagePath('our-businesses')}">Overview</a>
        <a href="${pagePath('our-businesses/last-mile-e-mobility-solutions')}">Last Mile E-Mobility Solutions</a>
        <a href="${pagePath('our-businesses/residential-solar-with-storage')}">Residential Solar With Storage</a>
        <a href="${pagePath('our-businesses/continued-energy-solutions')}">Continued Energy Solutions</a>
        <a href="${pagePath('our-businesses/advanced-electronics-manufacturing')}">Advanced Electronics Manufacturing</a>
        <!--<a href="${pagePath('our-businesses#businesses')}">Global Business</a>-->
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="resources" aria-label="Resources submenu">
        <!-- <h2>Resources</h2> -->
        <a href="${pagePath('resources')}">Overview</a>
        <a href="${pagePath('blog')}">Blogs</a>
        <a href="${pagePath('white-papers')}">White Papers</a>
        <a href="${pagePath('media-news')}">Media</a>
        <a href="${pagePath('social-feed')}">Social Feed</a>
        <a href="${pagePath('videos')}">Videos</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="life" aria-label="Life at Eastman submenu">
        <!-- <h2>Life @ Eastman</h2> -->
        <!-- <a href="${pagePath('#life')}">Great Place to Work</a>
        <a href="${pagePath('#life')}">Careers</a> -->
      </section>
    </div>
  </header>

  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" data-mobile-menu>
    <div class="mobile-menu-inner" data-lenis-prevent>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">About Us<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('about-us')}">Explore About Us</a>
          <h3>Company</h3>
          <a href="${pagePath('about-us')}">Overview &amp; Group Companies</a>
          <a href="${pagePath('eapl-in-numbers')}">Eastman in Numbers</a>
          <a href="${pagePath('about-us')}">Our Values</a>
          <h3>Governance</h3>
          <a href="${pagePath('corporate-history')}">Corporate History</a>
          <a href="${pagePath('corporate-governance')}">Corporate Governance</a>
          <!--<a href="${pagePath('leadership-team')}">Leadership Team</a>
          <a href="${pagePath('board-committee')}">Board Committee</a>-->
          <a href="${pagePath('shareholders-information')}">Shareholders Information</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Research &amp; Development<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('research-development/?tab=tubular#focus-areas')}">Explore Research &amp; Development</a>
          <a href="${pagePath('research-development/?tab=tubular#focus-areas')}">Conventional Tubular Batteries</a>
          <a href="${pagePath('research-development/?tab=power#focus-areas')}">Power Electronics</a>
          <a href="${pagePath('research-development/?tab=lithium#focus-areas')}">Lithium-Ion Batteries</a>
          <a href="${pagePath('research-development/?tab=solar#focus-areas')}">Solar Panels</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Manufacturing Infrastructure<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('manufacturing-infrastructure')}">Overview</a>
          <a href="${pagePath('manufacturing-infrastructure/conventional-tubular-batteries')}">Conventional Tubular Batteries</a>
          <a href="${pagePath('manufacturing-infrastructure/lithium-batteries')}">Lithium-ion Batteries</a>
          <a href="${pagePath('manufacturing-infrastructure/power-electronics')}">Power Electronics</a>
          <a href="${pagePath('manufacturing-infrastructure/solar-panels')}">Solar Panels</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Our Businesses<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('our-businesses')}">Overview</a>
          <a href="${pagePath('our-businesses/last-mile-e-mobility-solutions')}">Last Mile E-Mobility Solutions</a>
          <a href="${pagePath('our-businesses/residential-solar-with-storage')}">Solar Solutions</a>
          <a href="${pagePath('our-businesses/continued-energy-solutions')}">Continued Energy Solutions</a>
          <a href="${pagePath('our-businesses/advanced-electronics-manufacturing')}">Advanced Electronics Manufacturing</a>
          <!--<a href="${pagePath('our-businesses#businesses')}">Global Businesses</a>-->
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Resources<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('resources')}">Overview</a>
          <a href="${pagePath('blog')}">Blogs</a>
          <a href="${pagePath('white-papers')}">White Paper</a>
          <a href="${pagePath('media-news')}">Media</a>
          <a href="${pagePath('videos')}">Videos</a>
          <a href="${pagePath('social-feed')}">Social Feed</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <a class="mobile-direct-link mobile-direct-link--no-arrow" href="${pagePath('life-at-eastman')}">Life@Eastman</a>
        <!-- <div class="mobile-submenu">
          <a href="${pagePath('#life')}">Great Place to Work</a>
          <a href="${pagePath('#life')}">Careers</a>
        </div> -->
      </div>
      <div class="mobile-menu-actions">
        <a class="trade-chip" href="${pagePath('partner-with-us')}">Partner With Us</a>
        <a class="phone-link" href="tel:18004198610"><img src="${assetPath('images/phone-icon.svg')}" alt="" />1800 419 8610</a>
        <a class="trade-chip" href="${pagePath('contact-us')}">Trade Enquiry</a>
      </div>
    </div>
  </nav>
`;

const footerMarkup = `
  <footer class="site-footer" id="contact">
    <div class="footer-grid">
      <div class="footer-column footer-brand-column">
        <a class="footer-brand" href="${pagePath()}" aria-label="Eastman home">
          <img src="${footerLogo}" alt="Eastman" />
        </a>
        <!-- <p class="footer-about">Eastman Auto &amp; Power Limited (EAPL) is one of India&apos;s leading energy transition companies. For over 3 decades, we have been committed to power, progress and people.</p> -->
        <section class="footer-group">
          <h3>About Us</h3>
          <a href="${pagePath('about-us')}">Overview &amp; Group Companies</a>
          <a href="${pagePath('eapl-in-numbers')}">Eastman Auto &amp; Power in Nos.</a>
          <a href="${pagePath('corporate-history')}">Corporate History</a>
          <a href="${pagePath('corporate-governance')}">Corporate Governance</a>
          <!--<a href="${pagePath('leadership-team')}">Leadership Team</a>
          <a href="${pagePath('board-committee')}">Board Committee</a>-->
          <a href="${pagePath('shareholders-information')}">Shareholder Information</a>
          <a href="https://jrseastman.com/csr" target="_blank" rel="noopener noreferrer">CSR</a>
        </section>
      </div>
      <div class="footer-column">
        <section class="footer-group">
          <h3>Research &amp; Development</h3>
          <!--<a href="${pagePath('#research')}">Overview</a>-->
          <a href="${pagePath('research-development/?tab=tubular#focus-areas')}">Conventional Tubular Batteries</a>
          <a href="${pagePath('research-development/?tab=power#focus-areas')}">Power Electronics</a>
          <a href="${pagePath('research-development/?tab=lithium#focus-areas')}">Lithium-ion Batteries</a>
          <a href="${pagePath('research-development/?tab=solar#focus-areas')}">Solar Panels</a>
        </section>
        <section class="footer-group">
          <h3>Manufacturing Infrastructure</h3>
          <a href="${pagePath('manufacturing-infrastructure')}">Overview</a>
          <a href="${pagePath('manufacturing-infrastructure/conventional-tubular-batteries')}">Conventional Tubular Batteries</a>
          <a href="${pagePath('manufacturing-infrastructure/power-electronics')}">Power Electronics</a>
          <a href="${pagePath('manufacturing-infrastructure/lithium-batteries')}">Lithium-ion Batteries</a>
          <a href="${pagePath('manufacturing-infrastructure/solar-panels')}">Solar Panels</a>
        </section>
      </div>
      <div class="footer-column">
        <section class="footer-group">
          <h3>Our Businesses</h3>
          <a href="${pagePath('our-businesses')}">Overview</a>
          <a href="${pagePath('our-businesses/last-mile-e-mobility-solutions')}">Last Mile E-Mobility Solutions</a>
          <a href="${pagePath('our-businesses/residential-solar-with-storage')}">Residential Solar with Storage</a>
          <a href="${pagePath('our-businesses/continued-energy-solutions')}">Continued Energy Solutions</a>
          <a href="${pagePath('our-businesses/advanced-electronics-manufacturing')}">Advanced Electronics Manufacturing</a>
          <!--<a href="${pagePath('our-businesses#businesses')}">Global Business</a>-->
        </section>
        <section class="footer-group">
          <h3>Resources</h3>
          <a href="${pagePath('#resources')}">Overview</a>
          <a href="${pagePath('#resources')}">Blogs</a>
          <a href="${pagePath('#resources')}">Whitepaper</a>
          <a href="${pagePath('#resources')}">Media</a>
          <a href="${pagePath('#resources')}">Social Feed</a>
          <a href="${pagePath('#resources')}">Videos</a>
        </section>
      </div>
      <div class="footer-column contact-col">
        <section class="footer-group">
          <h3>Partner With Us</h3>
          <a href="${pagePath('partner-with-us')}">Become a Channel Partner</a>
        </section>
        <section class="footer-group">
          <h3>Contact Us</h3>
          <h4>INDIA - Corporate</h4>
          <p class="contact-row"><img src="${assetPath('images/footer-location.svg')}" alt="" />4th Floor, Quattro Tower A, Plot No. 249-E, Udyog Vihar Phase IV, Industrial Complex Dundahera, Gurgaon - 122016, Haryana, India</p>
          <a class="contact-row" href="tel:+911244682650"><img src="${assetPath('images/footer-phone.svg')}" alt="" />(0124) 4682650</a>
          <a class="contact-row" href="mailto:corporate@eaplworld.com"><img src="${assetPath('images/footer-email.svg')}" alt="" />corporate@eaplworld.com</a>
        </section>
        <section class="footer-group social-group">
          <h4>Social</h4>
          <div class="socials">
            <a href="https://www.facebook.com/EastmanIndia/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><img src="${socialIcons.facebook}" alt="" /></a>
            <a href="https://www.linkedin.com/company/eastman-auto-power-limited/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><img src="${socialIcons.linkedin}" alt="" /></a>
            <a href="https://www.instagram.com/eastman_india/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><img src="${socialIcons.instagram}" alt="" /></a>
            <a href="https://www.youtube.com/@eastmanindia/videos" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><img src="${socialIcons.youtube}" alt="" /></a>
            <!--<a href="#" aria-label="X"><img src="${socialIcons.twitter}" alt="" /></a>-->
          </div>
        </section>
      </div>
    </div>
    <div class="legal">
      <p>&copy; 2026 Eastman Auto &amp; Power Limited. All rights reserved.</p>
      <span>Privacy Policy</span>
      <a href="${pagePath('terms-and-conditions')}">Terms of Conditions</a>
    </div>
  </footer>
`;

export function setupLayout() {
  const headerSlot = document.querySelector('[data-layout-header]');
  const footerSlot = document.querySelector('[data-layout-footer]');

  if (headerSlot) headerSlot.outerHTML = headerMarkup;
  if (footerSlot) footerSlot.outerHTML = footerMarkup;
}
