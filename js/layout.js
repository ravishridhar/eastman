const BASE_URL = import.meta.env.BASE_URL || '/';
const assetPath = (path) => `${BASE_URL}${path}`;
const pagePath = (path = '') => `${BASE_URL}${path}`;

const headerMarkup = `
  <header class="site-header" data-header>
    <a class="brand" href="${pagePath()}" aria-label="Eastman home">
      <img src="${assetPath('images/eastman-logo.svg')}" alt="Eastman" />
    </a>

    <div class="header-nav-stack">
      <nav class="utility-nav" aria-label="Utility navigation">
        <a href="${pagePath('#assure')}">Eastman Assure Service</a>
        <a href="${pagePath('about.html')}">About JRS Eastman Group</a>
        <a href="${pagePath('#contact')}">Partner With Us</a>
        <a href="#contact">Contact us</a>
      </nav>

      <nav class="desktop-nav" aria-label="Primary navigation">
        <button type="button" data-desktop-trigger="about" aria-expanded="false">About Us<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="research" aria-expanded="false">Research &amp; Development<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="manufacturing" aria-expanded="false">Manufacturing Infrastructure<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="businesses" aria-expanded="false">Our Businesses<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="resources" aria-expanded="false">Resources<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
        <button type="button" data-desktop-trigger="life" aria-expanded="false">Life@Eastman<img src="${assetPath('images/nav-chevron.svg')}" alt="" class="nav-chevron" /></button>
      </nav>
    </div>

    <div class="header-actions">
      <a class="phone-link" href="tel:18004198610" aria-label="Call Eastman">
        <img src="${assetPath('images/phone-icon.svg')}" alt="" class="phone-icon" />
        1800 419 8610
      </a>
      <a class="trade-chip" href="#contact">Trade Enquiry</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu" data-menu-toggle>
        <img src="${assetPath('images/menu-icon.svg')}" alt="" />
        <span></span><span></span><span></span>
      </button>
    </div>

    <div class="desktop-mega-menu" data-desktop-menu>
      <section class="mega-panel mega-panel--card" data-desktop-panel="about" aria-label="About Us submenu">
        <h2>Company</h2>
        <a class="is-current" href="${pagePath('about.html')}">Overview &amp; Group Companies</a>
        <a href="${pagePath('about.html')}">About EAPL</a>
        <a href="${pagePath('corporate-history.html')}">Corporate History</a>
        <a href="${pagePath('about.html')}">Corporate Governance</a>
        <a href="${pagePath('about.html')}">Shareholder Information</a>
        <a href="${pagePath('about.html')}">CSR</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="research" aria-label="Research and Development submenu">
        <h2>Research &amp; Development</h2>
        <a href="${pagePath('#research')}">Overview</a>
        <a href="${pagePath('#research')}">Conventional Tubular Batteries</a>
        <a href="${pagePath('#research')}">Power Electronics</a>
        <a href="${pagePath('#research')}">Lithium-ion Batteries Solar Panels</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="manufacturing" aria-label="Manufacturing Infrastructure submenu">
        <h2>Manufacturing &amp; Infrastructure</h2>
        <a href="${pagePath('#manufacturing')}">Overview</a>
        <a href="${pagePath('#manufacturing')}">Conventional Tubular Batteries</a>
        <a href="${pagePath('#manufacturing')}">Power Electronics</a>
        <a href="${pagePath('#manufacturing')}">Lithium-ion Batteries Solar Panels</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="businesses" aria-label="Our Businesses submenu">
        <h2>Our Businesses</h2>
        <a href="${pagePath('#businesses')}">Last Mile E-Mobility Solutions</a>
        <a href="${pagePath('#businesses')}">Residential Solar With Storage</a>
        <a href="${pagePath('#businesses')}">Continued Energy Solutions</a>
        <a href="${pagePath('#businesses')}">Advanced Electronics Manufacturing</a>
        <a href="${pagePath('#businesses')}">Global Business</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="resources" aria-label="Resources submenu">
        <h2>Resources</h2>
        <a href="${pagePath('#resources')}">Overview</a>
        <a href="${pagePath('#resources')}">Blogs</a>
        <a href="${pagePath('#resources')}">Whitepaper</a>
        <a href="${pagePath('#resources')}">Media</a>
        <a href="${pagePath('#resources')}">Social Feed</a>
        <a href="${pagePath('#resources')}">Videos</a>
      </section>
      <section class="mega-panel mega-panel--card" data-desktop-panel="life" aria-label="Life at Eastman submenu">
        <h2>Life @ Eastman</h2>
        <a href="${pagePath('#life')}">Great Place to Work</a>
        <a href="${pagePath('#life')}">Careers</a>
      </section>
    </div>
  </header>

  <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" data-mobile-menu>
    <div class="mobile-menu-inner" data-lenis-prevent>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">About Us<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('about.html')}">Explore About Us</a>
          <h3>Company</h3>
          <a href="${pagePath('about.html')}">Overview &amp; Group Companies</a>
          <a href="${pagePath('eapl-in-numbers.html')}">Eastman in Numbers</a>
          <a href="${pagePath('about.html')}">Our Values</a>
          <h3>Governance</h3>
          <a href="${pagePath('corporate-history.html')}">Corporate History</a>
          <a href="${pagePath('about.html')}">Corporate Governance</a>
          <a href="${pagePath('about.html')}">Shareholders Information</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Research &amp; Development<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('#research')}">Overview</a>
          <a href="${pagePath('#research')}">Conventional Energy Storage</a>
          <a href="${pagePath('#research')}">Power Electronics</a>
          <a href="${pagePath('#research')}">Lithium-Ion Battery Pack</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Manufacturing Infrastructure<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('#manufacturing')}">Overview</a>
          <a href="${pagePath('#manufacturing')}">Conventional Tubular Batteries</a>
          <a href="${pagePath('#manufacturing')}">Lithium-ion Batteries</a>
          <a href="${pagePath('#manufacturing')}">Power Electronics</a>
          <a href="${pagePath('#manufacturing')}">Solar Panels</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Our Businesses<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('#businesses')}">Last Mile E-Mobility Solutions</a>
          <a href="${pagePath('#businesses')}">Solar Solutions</a>
          <a href="${pagePath('#businesses')}">Continued Energy Solutions</a>
          <a href="${pagePath('#businesses')}">Global Businesses</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Resources<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('#resources')}">Overview</a>
          <a href="${pagePath('#resources')}">Blogs</a>
          <a href="${pagePath('#resources')}">White Paper</a>
          <a href="${pagePath('#resources')}">Media</a>
          <a href="${pagePath('#resources')}">Videos</a>
          <a href="${pagePath('#resources')}">Social Feed</a>
        </div>
      </div>
      <div class="mobile-nav-item">
        <button type="button" class="mobile-nav-trigger" aria-expanded="false">Life@Eastman<img src="${assetPath('images/nav-chevron.svg')}" alt="" /></button>
        <div class="mobile-submenu">
          <a href="${pagePath('#life')}">Great Place to Work</a>
          <a href="${pagePath('#life')}">Careers</a>
        </div>
      </div>
      <div class="mobile-menu-actions">
        <a class="phone-link" href="tel:18004198610"><img src="${assetPath('images/phone-icon.svg')}" alt="" />1800 419 8610</a>
        <a class="trade-chip" href="#contact">Trade Enquiry</a>
      </div>
    </div>
  </nav>
`;

const footerMarkup = `
  <footer class="site-footer" id="contact">
    <div class="footer-grid">
      <div class="footer-column footer-brand-column">
        <a class="footer-brand" href="${pagePath()}" aria-label="Eastman home">
          <img src="${assetPath('images/footer_logo.svg')}" alt="Eastman" />
        </a>
        <p class="footer-about">Eastman Auto &amp; Power Limited (EAPL) is one of India&apos;s leading energy transition companies. For over 3 decades, we have been committed to power, progress and people.</p>
        <section class="footer-group">
          <h3>About Us</h3>
          <a href="${pagePath('about.html')}">About JRS Eastman</a>
          <a href="${pagePath('about.html')}">EAPL &amp; Group Companies</a>
          <a href="${pagePath('about.html')}">Our Values</a>
          <a href="${pagePath('eapl-in-numbers.html')}">Eastman Auto &amp; Power in Numbers</a>
          <a href="${pagePath('corporate-history.html')}">Corporate History</a>
          <a href="${pagePath('about.html')}">Corporate Governance</a>
          <a href="${pagePath('about.html')}">Shareholder Information</a>
        </section>
      </div>
      <div class="footer-column">
        <section class="footer-group">
          <h3>Research &amp; Development</h3>
          <a href="${pagePath('#research')}">Overview</a>
          <a href="${pagePath('#research')}">Conventional Tubular Batteries</a>
          <a href="${pagePath('#research')}">Power Electronics</a>
          <a href="${pagePath('#research')}">Lithium-ion Batteries</a>
          <a href="${pagePath('#research')}">Solar Panels</a>
        </section>
        <section class="footer-group">
          <h3>Manufacturing Infrastructure</h3>
          <a href="${pagePath('#manufacturing')}">Overview</a>
          <a href="${pagePath('#manufacturing')}">Conventional Tubular Batteries</a>
          <a href="${pagePath('#manufacturing')}">Power Electronics</a>
          <a href="${pagePath('#manufacturing')}">Lithium-ion Batteries</a>
          <a href="${pagePath('#manufacturing')}">Solar Panels</a>
        </section>
      </div>
      <div class="footer-column">
        <section class="footer-group">
          <h3>Our Businesses</h3>
          <a href="${pagePath('#businesses')}">Last Mile E-Mobility Solutions</a>
          <a href="${pagePath('#businesses')}">Residential Solar with Storage</a>
          <a href="${pagePath('#businesses')}">Continued Energy Solutions</a>
          <a href="${pagePath('#businesses')}">Advanced Electronics Manufacturing</a>
          <a href="${pagePath('#businesses')}">Global Business</a>
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
          <h3>Contact Us</h3>
          <h4>INDIA - Corporate</h4>
          <p class="contact-row"><img src="${assetPath('images/footer-location.svg')}" alt="" />4th Floor, Plot No. 7, Sector 44, Institutional Area, Gurugram, Haryana - 122003, Haryana India</p>
          <a class="contact-row" href="tel:+911244682650"><img src="${assetPath('images/footer-phone.svg')}" alt="" />(0124) 4682650</a>
          <a class="contact-row" href="mailto:corporate@eaplworld.com"><img src="${assetPath('images/footer-email.svg')}" alt="" />corporate@eaplworld.com</a>
        </section>
        <section class="footer-group social-group">
          <h4>Social</h4>
          <div class="socials">
            <a href="#" aria-label="Facebook"><img src="${assetPath('images/social-facebook.svg')}" alt="" /></a>
            <a href="#" aria-label="LinkedIn"><img src="${assetPath('images/social-linkedin.svg')}" alt="" /></a>
            <a href="#" aria-label="Instagram"><img src="${assetPath('images/social-instagram.svg')}" alt="" /></a>
            <a href="#" aria-label="YouTube"><img src="${assetPath('images/social-youtube.svg')}" alt="" /></a>
            <a href="#" aria-label="X"><img src="${assetPath('images/social-x.svg')}" alt="" /></a>
          </div>
        </section>
      </div>
    </div>
    <div class="legal">
      <p>&copy; 2026 Eastman Auto &amp; Power Limited. All rights reserved.</p>
      <span>Privacy Policy</span>
      <span>Terms of Conditions</span>
    </div>
  </footer>
`;

export function setupLayout() {
  const headerSlot = document.querySelector('[data-layout-header]');
  const footerSlot = document.querySelector('[data-layout-footer]');

  if (headerSlot) headerSlot.outerHTML = headerMarkup;
  if (footerSlot) footerSlot.outerHTML = footerMarkup;
}
