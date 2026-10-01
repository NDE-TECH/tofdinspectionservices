/*
================================================================================
IAIS WEBSITE - MAIN JAVASCRIPT
Vanilla JavaScript only. No npm, libraries, bundler, or build process.
================================================================================
*/

(() => {
  'use strict';

  const doc = document;
  const body = doc.body;

  const reduceMotion =
    matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finePointer =
    matchMedia('(hover: hover) and (pointer: fine)').matches;

  body.classList.add('motion-ready');


  // =========================================================
  // MOBILE MENU
  // =========================================================

  const menuButton = doc.querySelector('.menu-button');
  const nav = doc.querySelector('#site-nav');

  const closeNav = () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('open');
    body.classList.remove('nav-open');
  };

  menuButton?.addEventListener('click', () => {

    const open =
      menuButton.getAttribute('aria-expanded') === 'true';

    menuButton.setAttribute(
      'aria-expanded',
      String(!open)
    );

    nav?.classList.toggle('open', !open);
    body.classList.toggle('nav-open', !open);

  });

  nav?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', closeNav);
  });

  addEventListener(
    'resize',
    () => {
      if (innerWidth > 760) {
        closeNav();
      }
    },
    { passive: true }
  );


  // =========================================================
  // COPYRIGHT YEAR
  // =========================================================

  const year = doc.querySelector('#year');

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // =========================================================
  // SCANNING HUD
  // =========================================================

  doc.querySelectorAll(
    '.hero-cover, .subhero'
  ).forEach((hero, index) => {

    if (hero.querySelector('.scan-sweep-layer')) {
      return;
    }

    const layer = doc.createElement('div');

    layer.className = 'scan-sweep-layer';

    layer.setAttribute(
      'aria-hidden',
      'true'
    );

    layer.innerHTML = `
      <span class="scan-grid"></span>
      <span class="scan-beam"></span>

      <span class="scan-reticle">
        <i></i>
      </span>

      <span class="scan-status">
        ${
          index === 0 &&
          body.classList.contains('page-home')
            ? 'ULTRASONIC SCAN ACTIVE'
            : 'INSPECTION DATA LAYER'
        }
      </span>
    `;

    hero.appendChild(layer);

  });


  // =========================================================
  // TESTING SCANNER RIG
  // =========================================================

  doc.querySelectorAll(
    '.hero-cover, .subhero'
  ).forEach((hero) => {

    if (
      hero.querySelector('.inspection-scan-rig')
    ) {
      return;
    }

    const rig = doc.createElement('div');

    rig.className = 'inspection-scan-rig';

    rig.setAttribute(
      'aria-hidden',
      'true'
    );

    rig.innerHTML = `
      <span class="rig-wave"></span>

      <span class="rig-rail"></span>

      <span class="rig-carriage">
        <i class="rig-beam"></i>
      </span>

      <span class="rig-label">
        ENCODED ULTRASONIC PASS · LIVE
      </span>
    `;

    hero.appendChild(rig);

  });


  // =========================================================
  // SCROLL MOTION
  // =========================================================

  const motionTargets =
    doc.querySelectorAll(`
      .card,
      .application-case,
      .expanded-card,
      .location-cards > div,
      .steps > div,
      .showcase-grid figure,
      .contact-side-card,
      .contact-help,
      .about-items article,
      .region-list article,
      .service-row,
      .app-list > div,
      .method-use-grid article,
      .map-card
    `);


  if (
    'IntersectionObserver' in window &&
    !reduceMotion
  ) {

    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach((entry) => {

            if (!entry.isIntersecting) {
              return;
            }

            const el = entry.target;

            if (!el.dataset.motionPlayed) {

              el.dataset.motionPlayed = '1';

              const delay =
                Math.min(
                  Number(
                    el.dataset.motionIndex || 0
                  ) % 5,
                  4
                ) * 45;

              el.animate(
                [
                  {
                    opacity: 0.76,
                    transform:
                      'translateY(18px) scale(.992)'
                  },
                  {
                    opacity: 1,
                    transform:
                      'translateY(0) scale(1)'
                  }
                ],
                {
                  duration: 620,
                  delay,
                  easing:
                    'cubic-bezier(.2,.8,.2,1)',
                  fill: 'both'
                }
              );
            }

            observer.unobserve(el);

          });

        },
        {
          threshold: 0.08,
          rootMargin:
            '0px 0px -18px'
        }
      );


    motionTargets.forEach((el, i) => {

      el.dataset.motionIndex =
        String(i);

      observer.observe(el);

    });

  }


  // =========================================================
  // SCROLL PROGRESS
  // =========================================================

  const updateScroll = () => {

    const max = Math.max(
      1,
      doc.documentElement.scrollHeight -
        innerHeight
    );

    const progress = Math.max(
      0,
      Math.min(
        100,
        (scrollY / max) * 100
      )
    );

    body.style.setProperty(
      '--scroll-progress',
      `${progress}%`
    );

  };


  addEventListener(
    'scroll',
    updateScroll,
    { passive: true }
  );

  updateScroll();


  // =========================================================
  // POINTER GLOW + HERO PARALLAX
  // =========================================================

  if (
    finePointer &&
    !reduceMotion
  ) {

    let raf = 0;

    let tx =
      innerWidth / 2;

    let ty =
      innerHeight / 3;


    addEventListener(
      'pointermove',
      (e) => {

        tx = e.clientX;
        ty = e.clientY;

        if (!raf) {

          raf =
            requestAnimationFrame(() => {

              body.style.setProperty(
                '--mx',
                `${tx}px`
              );

              body.style.setProperty(
                '--my',
                `${ty}px`
              );


              const hero =
                doc.querySelector(
                  '.hero-cover-image'
                );


              if (
                hero &&
                scrollY < innerHeight
              ) {

                const x =
                  (
                    tx / innerWidth -
                    0.5
                  ) * 7;

                const y =
                  (
                    ty / innerHeight -
                    0.5
                  ) * 4;


                hero.style.transform =
                  `scale(1.045)
                   translate3d(
                     ${x}px,
                     ${y}px,
                     0
                   )`;

              }

              raf = 0;

            });

        }

      },
      { passive: true }
    );

  }


  // =========================================================
  // 3D TILT
  // =========================================================

  const tiltItems =
    doc.querySelectorAll([
      '.card',
      '.about-items article',
      '.expanded-card',
      '.application-case',
      '.location-cards > div',
      '.contact-side-card',
      '.showcase-grid figure',
      '.region-list article',
      '.method-use-grid article',
      '.map-card'
    ].join(','));


  if (
    finePointer &&
    !reduceMotion
  ) {

    tiltItems.forEach((el) => {

      el.classList.add(
        'iais-tilt'
      );

      let rect;


      el.addEventListener(
        'pointerenter',
        () => {

          rect =
            el.getBoundingClientRect();

          el.style.transition =
            'transform .16s ease,' +
            'box-shadow .28s ease,' +
            'border-color .28s ease';

        }
      );


      el.addEventListener(
        'pointermove',
        (e) => {

          rect ||=
            el.getBoundingClientRect();


          const px =
            (
              e.clientX -
              rect.left
            ) /
            rect.width;


          const py =
            (
              e.clientY -
              rect.top
            ) /
            rect.height;


          const ry =
            (px - 0.5) * 6.5;


          const rx =
            (0.5 - py) * 5.5;


          el.style.transform =
            `perspective(950px)
             rotateX(${rx}deg)
             rotateY(${ry}deg)
             translateY(-4px)`;

        }
      );


      el.addEventListener(
        'pointerleave',
        () => {

          rect = null;

          el.style.transition =
            'transform .48s ' +
            'cubic-bezier(.2,.8,.2,1),' +
            'box-shadow .28s ease,' +
            'border-color .28s ease';

          el.style.transform = '';

        }
      );

    });

  }


  // =========================================================
  // PAGE NAVIGATION
  // =========================================================

  const topButton =
    doc.querySelector(
      '.float-action.top'
    );


  const toggleTop = () => {

    topButton?.classList.toggle(
      'show',
      scrollY > 650
    );

  };


  addEventListener(
    'scroll',
    toggleTop,
    { passive: true }
  );


  toggleTop();


  topButton?.addEventListener(
    'click',
    () => {

      scrollTo({
        top: 0,
        behavior:
          reduceMotion
            ? 'auto'
            : 'smooth'
      });

    }
  );


  // =========================================================
  // SMOOTH ANCHOR LINKS
  // =========================================================

  doc.querySelectorAll(
    'a[href^="#"]'
  ).forEach((a) => {

    a.addEventListener(
      'click',
      (e) => {

        const id =
          a.getAttribute('href');

        if (
          !id ||
          id === '#'
        ) {
          return;
        }


        const target =
          doc.querySelector(id);


        if (!target) {
          return;
        }


        e.preventDefault();


        target.scrollIntoView({
          behavior:
            reduceMotion
              ? 'auto'
              : 'smooth',

          block: 'start'
        });

      }
    );

  });

})();



/* ========================================================================
   MICROSOFT CLARITY ANALYTICS
   ------------------------------------------------------------------------
   Project ID: 

   IMPORTANT:
   Do NOT add <script> or </script> tags inside this JS file.
   This JavaScript dynamically loads the official Microsoft Clarity script.
   ======================================================================== */

(function (c, l, a, r, i, t, y) {

  c[a] =
    c[a] ||
    function () {
      (
        c[a].q =
          c[a].q || []
      ).push(arguments);
    };


  t =
    l.createElement(r);


  t.async = 1;


  t.src =
    'https://www.clarity.ms/tag/' +
    i;


  y =
    l.getElementsByTagName(r)[0];


  y.parentNode.insertBefore(
    t,
    y
  );

})(
  window,
  document,
  'clarity',
  'script',
  'yqs6h0zj8s'
);