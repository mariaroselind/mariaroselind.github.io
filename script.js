/* =========================================
   NAV — SCROLL STATE & ACTIVE LINKS
   ========================================= */
(function () {
  const nav       = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('a');

  /* Scrolled state */
  function onScroll () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    highlightNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile toggle */
  navToggle.addEventListener('click', function () {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  /* Close mobile menu on link click */
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  /* Active link highlighting */
  function highlightNavLink () {
    const sections = document.querySelectorAll('section[id], div[id]');
    let current = '';

    sections.forEach(function (sec) {
      if (window.scrollY >= sec.offsetTop - 90) {
        current = sec.getAttribute('id');
      }
    });

    links.forEach(function (link) {
      link.classList.toggle(
        'active',
        link.getAttribute('href') === '#' + current
      );
    });
  }
})();


/* =========================================
   SCROLL REVEAL
   ========================================= */
(function () {
  const els = document.querySelectorAll('.reveal');

  if (!els.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -32px 0px' }
  );

  els.forEach(function (el) { observer.observe(el); });
})();


/* =========================================
   HERO CANVAS — GRAPH NETWORK
   ========================================= */
(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes, animId;

  const NODE_COUNT    = 38;
  const CONNECT_DIST  = 160;
  const NODE_RADIUS   = 2.4;
  const BASE_SPEED    = 0.22;

  const NODE_COLOR    = 'rgba(37,99,235,0.55)';
  const LINE_COLOR_FN = function (alpha) {
    return 'rgba(37,99,235,' + alpha + ')';
  };

  function resize () {
    W = canvas.offsetWidth;
    H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;
  }

  function makeNode () {
    var angle = Math.random() * Math.PI * 2;
    var speed = BASE_SPEED + Math.random() * 0.18;
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r:  NODE_RADIUS + Math.random() * 1.4
    };
  }

  function init () {
    resize();
    nodes = Array.from({ length: NODE_COUNT }, makeNode);
  }

  function draw () {
    ctx.clearRect(0, 0, W, H);

    /* Move */
    nodes.forEach(function (n) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
    });

    /* Edges */
    for (var i = 0; i < nodes.length; i++) {
      for (var j = i + 1; j < nodes.length; j++) {
        var dx   = nodes[i].x - nodes[j].x;
        var dy   = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          var alpha = (1 - dist / CONNECT_DIST) * 0.18;
          ctx.strokeStyle = LINE_COLOR_FN(alpha.toFixed(3));
          ctx.lineWidth   = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    /* Nodes */
    nodes.forEach(function (n) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = NODE_COLOR;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  init();
  draw();

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      cancelAnimationFrame(animId);
      init();
      draw();
    }, 120);
  });
})();


/* =========================================
   SMOOTH SCROLL (fallback for older Safari)
   ========================================= */
(function () {
  if (CSS.supports('scroll-behavior', 'smooth')) return;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
