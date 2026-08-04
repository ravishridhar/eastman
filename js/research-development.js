const pageKey = document.querySelector('[data-research-page]')?.dataset.researchPage || 'lithium';
const researchImages = {
  breadcrumb: new URL('../images/breadcrumb_arrow.svg', import.meta.url).href,
  consumerApplication: new URL('../images/rnd_svg_icn1.svg', import.meta.url).href,
  valueForMoney: new URL('../images/rnd_svg_icn2.svg', import.meta.url).href,
  designQuality: new URL('../images/rnd_svg_icn3.svg', import.meta.url).href,
  warranty: new URL('../images/rnd_svg_icn4.svg', import.meta.url).href,
};

const streams = {
  lithium: {
    title: 'End-to-end Lithium Battery Manufacturing',
    metrics: [
      ['In-house', 'Manufacturing'],
      ['3', 'Categories — Wall-mounted, floor-mount, rack-type'],
    ],
    paragraphs: [
      "Our lithium-ion battery manufacturing capability is anchored by in-house unit located in North India's automobile manufacturing hub — one of a small number of Indian facilities able to manufacture lithium-ion battery packs end-to-end rather than import finished packs.",
      'R&D work spans wall-mounted, floor-mount, and rack-type architectures for Solar, Last Mile E-Mobility & Power Back-up applications, with technology-enabled battery management systems designed to improve efficiency, safety, and cycle life.',
    ],
  },
  power: {
    title: 'Power Electronics Manufacturing with Backward Integration',
    metrics: [
      ['2M', 'Units annual production capacity'],
      ['Surface Mount Technology', '+ manual insertion + SKD, under one roof'],
      ['Fully automated ', 'PCB production line'],
    ],
    paragraphs: [
      'Our Power Electronics R&D translates Solar, Power Backup, and Last-Mile Mobility challenges into indigenised products, including Solar Inverters, Home UPS Systems, and E-Rickshaw Chargers, engineered to substitute imported sub-assemblies with technology developed and manufactured in-house.<br/><br/>Development is supported by a centralized infrastructure integrating Surface Mount Technology (SMT), manual insertion, and semi-knocked-down (SKD) assembly, along with a fully automated PCB production line—reducing dependence on imported components while maintaining a strong focus on backward integration.',
      ,
    ],
  },
  tubular: {
    title: "India's largest maker of solar tubular batteries",
    metrics: [
      ['5.5M', 'Units/year capacity across 3 factories'],
      ['400+', 'OEMs using Eastman batteries'],
      ['#1', 'Largest Indian maker of tubular batteries'],
    ],
    paragraphs: [
      "As one of India's largest manufacturers of conventional tubular batteries, our R&D work centres on extending cycle life and durability across inverter, solar, and E-Rickshaw applications — the segment where Eastman is the preferred supplier for nearly every E-Rickshaw OEM in the country.",
      'Manufacturing lines built on established German process technology support high-volume output, and our labs continuously validate performance against the demands of frequent power cuts, high ambient temperatures, and demanding backup-power duty cycles.',
    ],
  },
  solar: {
    title: 'Solar panels technology engineered for Indian conditions',
    metrics: [
      ['DCR', 'Solar Panel Technology for Subsidy Support'],
      ['Advanced Robotics', 'Technology for Manufacturing'],
    ],
    paragraphs: [
      'Eastman combines advanced research with large-scale manufacturing to deliver high-performance solar panels for residential, and commercial applications. Our 800 MW Solar Panel Manufacturing Plant is equipped with modern production technologies to ensure consistent quality, high efficiency, and long-term reliability.',
      'Our product portfolio includes Monocrystalline, Bifacial, and TOPCon solar panel technologies, designed to maximize energy generation across diverse environmental conditions. We also manufacture both DCR and N-DCR solar panels to support government projects as well as private and commercial installations.',
    ],
  },
};

const streamLinks = [
  ['lithium', 'Lithium Batteries', 'research-lithium-batteries.html#focus-areas'],
  ['power', 'Power Electronics', 'research-power-electronics.html#focus-areas'],
  ['tubular', 'Conventional Tubular Batteries', 'research-conventional-tubular-batteries.html#focus-areas'],
  ['solar', 'Solar Panels', 'research-solar-panels.html#focus-areas'],
];

const data = streams[pageKey];
const main = document.querySelector('[data-research-main]');

if (main && data) {
  main.innerHTML = `
    <section class="research-hero">
      <div class="research-hero__content"><h1>Research &amp;<br /><span>Development</span></h1></div>
    </section>
    <nav class="research-breadcrumbs" aria-label="Breadcrumb">
      <a href="${streamLinks[0][2]}">Research &amp; Development</a>
      <img src="${researchImages.breadcrumb}" alt="" />
      <span>${streamLinks.find(([key]) => key === pageKey)[1]}</span>
    </nav>
    <section class="research-intro">
      <div class="research-intro__top">
        <div class="research-intro__copy">
          <h2 class="research-section-title">Empowering Lives<br /><span>Through Innovation</span></h2>
          <p>Three in-house R&amp;D centers, a technology center in Hong Kong, and 200+ engineers translating Power Electronics, storage, and Last Mile E-Mobility challenges into indigenized products — built for Indian manufacturability.</p>
          <a class="research-explore" href="#focus-areas">Explore More</a>
        </div>
        <div class="research-values">
          <article class="research-value"><img class="research-value__icon" src="${researchImages.consumerApplication}" alt="" /><strong>Crafted with consumer application in mind</strong></article>
          <article class="research-value"><img class="research-value__icon" src="${researchImages.valueForMoney}" alt="" /><strong>Maximum value for money</strong></article>
          <article class="research-value"><img class="research-value__icon" src="${researchImages.designQuality}" alt="" /><strong>Quality at design stage</strong></article>
          <article class="research-value"><img class="research-value__icon" src="${researchImages.warranty}" alt="" /><strong>Best-in-class warranty</strong></article>
        </div>
      </div>
      <div class="research-stats">
        <div class="research-stat"><strong>3</strong><span>R&amp;D centres</span></div>
        <div class="research-stat"><strong>200+</strong><span>Engineers &amp; experts</span></div>
        <div class="research-stat"><strong>2</strong><span>Patents held</span></div>
        <div class="research-stat"><strong>41</strong><span>Design registrations</span></div>
      </div>
    </section>
    <section class="research-streams" id="focus-areas">
      <p class="research-streams__eyebrow">Our Focus Areas</p>
      <h2 class="research-streams__title">Four R&amp;D <span>Product Streams</span></h2>
      <nav class="research-tabs" aria-label="R&D product streams">
        ${streamLinks.map(([key, label, href]) => `<a class="research-tab${key === pageKey ? ' is-active' : ''}" href="${href}"${key === pageKey ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
      </nav>
      <article class="research-stream-card">
        <h2>${data.title}</h2>
        <div class="research-stream-metrics" style="--metric-count:${data.metrics.length}">
          ${data.metrics.map(([value, label]) => `<div class="research-stream-metric"><strong>${value}</strong><span>${label}</span></div>`).join('')}
        </div>
        <div class="research-stream-copy">${data.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join('')}</div>
      </article>
    </section>
    <section class="research-cta">
      <div class="research-cta__inner">
        <div><small>Partner with us</small><h2>Build the next generation of energy hardware with Eastman.</h2></div>
        <a href="contact-us.html">Get in touch &nbsp;→</a>
      </div>
    </section>
  `;
}
