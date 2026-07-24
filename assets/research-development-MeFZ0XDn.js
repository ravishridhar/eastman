import{r as e}from"./main-CD5ADy1u.js";var t=e((()=>{var e=document.querySelector(`[data-research-page]`)?.dataset.researchPage||`lithium`,t={lithium:{title:`End-to-end pack assembly, not import-and-brand.`,metrics:[[`In-house`,`Pack assembly, not import-and-brand`],[`3`,`Formats — wall-mounted, floor-mount, rack-type`]],paragraphs:[`Our lithium-ion capability is anchored by an in-house battery pack assembly unit located in North India's automobile manufacturing hub — one of a small number of Indian facilities able to assemble lithium-ion battery packs end-to-end rather than import finished packs.`,`R&D work spans wall-mounted, floor-mount, and rack-type architectures for residential, solar, and Last Mile E-Mobility applications, with technology-enabled battery management systems designed to improve efficiency, safety, and cycle life as electrified last-mile mobility scales across India.`]},power:{title:`Grid & mobility challenges, indigenised in hardware`,metrics:[[`2M`,`Units annual production capacity`],[`Surface Mount Technology`,`+ manual insertion + SKD, under one roof`],[`Auto`,`Fully automated PCB production line`]],paragraphs:[`Our power electronics R&D translates grid and mobility challenges into indigenised hardware: home UPS and inverter systems, grid-tie inverters, hybrid inverters, solar power conditioning units, and EV chargers, engineered to substitute imported sub-assemblies with technology developed and manufactured in-house.`,`Development is backed by a centralised infrastructure that integrates surface-mount technology, manual insertion, and semi-knocked-down assembly alongside a fully automated PCB production line — reducing dependence on imported components while maintaining a strong focus on backward integration.`]},tubular:{title:`India's largest maker of solar tubular batteries`,metrics:[[`5.5M`,`Units/year capacity across 3 factories`],[`400+`,`OEMs using Eastman batteries`],[`#1`,`Largest Indian maker of tubular batteries`]],paragraphs:[`As one of India's largest manufacturers of conventional tubular batteries, our R&D work centres on extending cycle life and durability across inverter, solar, and E-Rickshaw applications — the segment where Eastman is the preferred supplier for nearly every E-Rickshaw OEM in the country.`,`Manufacturing lines built on established German process technology support high-volume output, and our labs continuously validate performance against the demands of frequent power cuts, high ambient temperatures, and demanding backup-power duty cycles.`]},solar:{title:`Solar panels technology engineered for Indian condition`,metrics:[[`50+`,`Countries served by our solar business`],[`High-T`,`Systems tuned for Middle East & Africa climates`]],paragraphs:[`Eastman combines advanced research with large-scale manufacturing to deliver high-performance solar solutions for residential, commercial, and industrial applications. Our 800 MW Solar Panel Manufacturing Plant is equipped with modern production technologies to ensure consistent quality, high efficiency, and long-term reliability.`,`Our product portfolio includes Monocrystalline, Bifacial, and TOPCon solar panel technologies, designed to maximize energy generation across diverse environmental conditions. We also manufacture both DCR and N-DCR solar panels to support government projects as well as private and commercial installations.`]}},n=[[`lithium`,`Lithium Batteries`,`research-lithium-batteries.html`],[`power`,`Power Electronics`,`research-power-electronics.html`],[`tubular`,`Conventional Tubular Batteries`,`research-conventional-tubular-batteries.html`],[`solar`,`Solar Panels`,`research-solar-panels.html`]],r=t[e],i=document.querySelector(`[data-research-main]`);i&&r&&(i.innerHTML=`
    <section class="research-hero">
      <div class="research-hero__content"><h1>Research &amp;<br /><span>Development</span></h1></div>
    </section>
    <nav class="research-breadcrumbs" aria-label="Breadcrumb">
      <a href="${n[0][2]}">Research &amp; Development</a>
      <img src="/images/breadcrumb_arrow.svg" alt="" />
      <span>${n.find(([t])=>t===e)[1]}</span>
    </nav>
    <section class="research-intro">
      <div class="research-intro__top">
        <div class="research-intro__copy">
          <h2 class="research-section-title">Empowering Lives<br /><span>Through Innovation</span></h2>
          <p>Three in-house R&amp;D centers, a technology center in Hong Kong, and 200+ engineers translating Power Electronics, storage, and Last Mile E-Mobility challenges into indigenized products — built for Indian manufacturability.</p>
          <a class="research-explore" href="#focus-areas">Explore More</a>
        </div>
        <div class="research-values">
          <article class="research-value"><img class="research-value__icon" src="/images/rnd_svg_icn1.svg" alt="" /><strong>Crafted with consumer application in mind</strong></article>
          <article class="research-value"><img class="research-value__icon" src="/images/rnd_svg_icn2.svg" alt="" /><strong>Maximum value for money</strong></article>
          <article class="research-value"><img class="research-value__icon" src="/images/rnd_svg_icn3.svg" alt="" /><strong>Quality at design stage</strong></article>
          <article class="research-value"><img class="research-value__icon" src="/images/rnd_svg_icn4.svg" alt="" /><strong>Best-in-class warranty</strong></article>
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
        ${n.map(([t,n,r])=>`<a class="research-tab${t===e?` is-active`:``}" href="${r}"${t===e?` aria-current="page"`:``}>${n}</a>`).join(``)}
      </nav>
      <article class="research-stream-card">
        <h2>${r.title}</h2>
        <div class="research-stream-metrics" style="--metric-count:${r.metrics.length}">
          ${r.metrics.map(([e,t])=>`<div class="research-stream-metric"><strong>${e}</strong><span>${t}</span></div>`).join(``)}
        </div>
        <div class="research-stream-copy">${r.paragraphs.map(e=>`<p>${e}</p>`).join(``)}</div>
      </article>
    </section>
    <section class="research-cta">
      <div class="research-cta__inner">
        <div><small>Partner with us</small><h2>Build the next generation of energy</h2></div>
        <a href="contact-us.html">Get in touch &nbsp;→</a>
      </div>
    </section>
  `)}));export{t};