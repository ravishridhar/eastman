import{n as e}from"./main-D1AEymar.js";var t=e((()=>{var e=new URLSearchParams(window.location.search).get(`tab`)||document.querySelector(`[data-research-page]`)?.dataset.researchPage||`tubular`,t={breadcrumb:new URL(`/eastman/assets/breadcrumb_arrow-C3Nmsv93.svg`,``+import.meta.url).href,consumerApplication:new URL(`/eastman/assets/rnd_svg_icn1-DT0XU0An.svg`,``+import.meta.url).href,valueForMoney:new URL(`/eastman/assets/rnd_svg_icn2-CydVBdzY.svg`,``+import.meta.url).href,designQuality:new URL(`/eastman/assets/rnd_svg_icn3-BVARSVjd.svg`,``+import.meta.url).href,warranty:new URL(`/eastman/assets/rnd_svg_icn4-D-Xdnf1p.svg`,``+import.meta.url).href},n={lithium:{title:`End-to-end Lithium Battery Manufacturing`,metrics:[[`In-house`,`Manufacturing`],[`3`,`Categories — Wall-mounted, floor-mount, rack-type`]],paragraphs:[`Our lithium-ion battery manufacturing capability is anchored by in-house unit located in North India's automobile manufacturing hub — one of a small number of Indian facilities able to manufacture lithium-ion battery packs end-to-end rather than import finished packs.`,`R&D work spans wall-mounted, floor-mount, and rack-type architectures for Solar, Last Mile E-Mobility & Power Back-up applications, with technology-enabled battery management systems designed to improve efficiency, safety, and cycle life.`]},power:{title:`Power Electronics Manufacturing with Backward Integration`,metrics:[[`2M`,`Units annual production capacity`],[`Surface Mount Technology`,`+ manual insertion + SKD, under one roof`],[`Fully automated `,`PCB production line`]],paragraphs:[`Our Power Electronics R&D translates Solar, Power Backup, and Last-Mile Mobility challenges into indigenised products, including Solar Inverters, Home UPS Systems, and E-Rickshaw Chargers, engineered to substitute imported sub-assemblies with technology developed and manufactured in-house.<br/><br/>Development is supported by a centralized infrastructure integrating Surface Mount Technology (SMT), manual insertion, and semi-knocked-down (SKD) assembly, along with a fully automated PCB production line—reducing dependence on imported components while maintaining a strong focus on backward integration.`,,]},tubular:{title:`India's largest maker of solar tubular batteries`,metrics:[[`5.5M`,`Units/year capacity across 3 factories`],[`400+`,`OEMs using Eastman batteries`],[`#1`,`Largest Indian maker of tubular batteries`]],paragraphs:[`As one of India's largest manufacturers of conventional tubular batteries, our R&D work centres on extending cycle life and durability across inverter, solar, and E-Rickshaw applications — the segment where Eastman is the preferred supplier for nearly every E-Rickshaw OEM in the country.`,`Manufacturing lines built on established German process technology support high-volume output, and our labs continuously validate performance against the demands of frequent power cuts, high ambient temperatures, and demanding backup-power duty cycles.`]},solar:{title:`Solar panels technology engineered for Indian conditions`,metrics:[[`DCR`,`Solar Panel Technology for Subsidy Support`],[`Advanced Robotics`,`Technology for Manufacturing`]],paragraphs:[`Eastman combines advanced research with large-scale manufacturing to deliver high-performance solar panels for residential, and commercial applications. Our 800 MW Solar Panel Manufacturing Plant is equipped with modern production technologies to ensure consistent quality, high efficiency, and long-term reliability.`,`Our product portfolio includes Monocrystalline, Bifacial, and TOPCon solar panel technologies, designed to maximize energy generation across diverse environmental conditions. We also manufacture both DCR and N-DCR solar panels to support government projects as well as private and commercial installations.`]}},r=[[`lithium`,`Lithium Batteries`,`/eastman/research-development/?tab=lithium#focus-areas`],[`power`,`Power Electronics`,`/eastman/research-development/?tab=power#focus-areas`],[`tubular`,`Conventional Tubular Batteries`,`/eastman/research-development/?tab=tubular#focus-areas`],[`solar`,`Solar Panels`,`/eastman/research-development/?tab=solar#focus-areas`]],i=n[e],a=document.querySelector(`[data-research-main]`);a&&i&&(a.innerHTML=`
    <section class="research-hero">
      <div class="research-hero__content"><h1>Research &amp;<br /><span>Development</span></h1></div>
    </section>
    <nav class="research-breadcrumbs" aria-label="Breadcrumb">
      <a href="/eastman/research-development/">Research &amp; Development</a>
      <img src="${t.breadcrumb}" alt="" />
      <span>${r.find(([t])=>t===e)[1]}</span>
    </nav>
    <section class="research-intro">
      <div class="research-intro__top">
        <div class="research-intro__copy">
          <h2 class="research-section-title">Empowering Lives<br /><span>Through Innovation</span></h2>
          <p>Three in-house R&amp;D centers, a technology center in Hong Kong, and 200+ engineers translating Power Electronics, storage, and Last Mile E-Mobility challenges into indigenized products — built for Indian manufacturability.</p>
          <a class="research-explore" href="#focus-areas">Explore More</a>
        </div>
        <div class="research-values">
          <article class="research-value"><img class="research-value__icon" src="${t.consumerApplication}" alt="" /><strong>Crafted with consumer application in mind</strong></article>
          <article class="research-value"><img class="research-value__icon" src="${t.valueForMoney}" alt="" /><strong>Maximum value for money</strong></article>
          <article class="research-value"><img class="research-value__icon" src="${t.designQuality}" alt="" /><strong>Quality at design stage</strong></article>
          <article class="research-value"><img class="research-value__icon" src="${t.warranty}" alt="" /><strong>Best-in-class warranty</strong></article>
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
        ${r.map(([t,n,r])=>`<a class="research-tab${t===e?` is-active`:``}" href="${r}"${t===e?` aria-current="page"`:``}>${n}</a>`).join(``)}
      </nav>
      <article class="research-stream-card">
        <h2>${i.title}</h2>
        <div class="research-stream-metrics" style="--metric-count:${i.metrics.length}">
          ${i.metrics.map(([e,t])=>`<div class="research-stream-metric"><strong>${e}</strong><span>${t}</span></div>`).join(``)}
        </div>
        <div class="research-stream-copy">${i.paragraphs.map(e=>`<p>${e}</p>`).join(``)}</div>
      </article>
    </section>
    <section class="research-cta">
      <div class="research-cta__inner">
        <div><small>Partner with us</small><h2>Build the next generation of energy hardware with Eastman.</h2></div>
        <a href="/eastman/contact-us">Get in touch &nbsp;→</a>
      </div>
    </section>
  `)}));export{t};