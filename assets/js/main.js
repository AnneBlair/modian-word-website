/* 墨典单词 官网主脚本 — 交互与动效 (无依赖)
   全部动效尊重 prefers-reduced-motion */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Theme toggle ---------- */
  (function theme() {
    var root = document.documentElement;
    var btn = document.getElementById("theme-toggle");
    function apply(t) {
      root.setAttribute("data-theme", t);
      try { localStorage.setItem("modian-theme", t); } catch (e) {}
      var meta = document.querySelector('meta[name="theme-color"]:not([media])') ||
                 document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute("content", t === "dark" ? "#0B0D14" : "#F4F3EE");
    }
    if (btn) {
      btn.addEventListener("click", function () {
        apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
      });
    }
  })();

  /* ---------- Mobile navigation ---------- */
  (function nav() {
    var menuBtn = document.getElementById("nav-menu-btn");
    var navLinks = document.getElementById("nav-links");
    if (!menuBtn || !navLinks) return;
    function close() {
      navLinks.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
    menuBtn.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
    document.addEventListener("click", function (e) {
      if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  })();

  /* ---------- Nav scrolled state + scroll progress ---------- */
  (function scrollUI() {
    var nav = document.getElementById("site-nav");
    var bar = document.getElementById("scroll-progress-bar");
    var ticking = false;
    function update() {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle("scrolled", y > 8);
      if (bar) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  })();

  /* ---------- FAQ accordion ---------- */
  (function faq() {
    var items = document.querySelectorAll(".faq-question");
    if (!items.length) return;
    items.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var answer = document.getElementById(btn.getAttribute("aria-controls"));
        var expanded = btn.getAttribute("aria-expanded") === "true";
        items.forEach(function (other) {
          var oa = document.getElementById(other.getAttribute("aria-controls"));
          other.setAttribute("aria-expanded", "false");
          if (oa) oa.classList.remove("is-open");
        });
        if (!expanded) {
          btn.setAttribute("aria-expanded", "true");
          if (answer) answer.classList.add("is-open");
        }
      });
    });
  })();

  /* ---------- Prepare SVG curves (exact dash length) ---------- */
  (function curves() {
    document.querySelectorAll(".curve-decay, .curve-retain, .lab-decay, .lab-retain").forEach(function (p) {
      try {
        var len = Math.ceil(p.getTotalLength());
        p.style.setProperty("--len", len);
      } catch (e) {}
    });
  })();

  /* ---------- Science lab review toggle ---------- */
  (function lab() {
    var btn = document.getElementById("lab-toggle");
    var canvas = document.querySelector(".lab-canvas");
    if (!btn || !canvas) return;
    btn.addEventListener("click", function () {
      var on = !btn.classList.contains("is-active");
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      canvas.classList.toggle("review-off", !on);
      var b = btn.querySelector(".lab-toggle-text b");
      if (b) b.textContent = on ? "开启" : "关闭";
    });
  })();

  /* ---------- Count-up numbers ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count-to")) || 0;
    var suffix = el.getAttribute("data-count-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    window.requestAnimationFrame(step);
  }

  /* ---------- Intersection: reveal + count + curve draw ---------- */
  (function observe() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
      document.querySelectorAll("[data-count-to]").forEach(function (el) {
        el.textContent = el.getAttribute("data-count-to") + (el.getAttribute("data-count-suffix") || "");
      });
      document.querySelectorAll(".curve-card, .lab-canvas").forEach(function (el) { el.classList.add("drawn"); });
      return;
    }

    // reveal targets
    var revealSel = ".section-head, .lab-note, .shot, .creed-quote, .cta-inner, .stats-grid, " +
      ".features-grid, .why-grid, .lib-grid, .flow-track, .audience-grid";
    document.querySelectorAll(revealSel).forEach(function (el) { el.classList.add("reveal"); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.classList.add("in");
        el.querySelectorAll && el.querySelectorAll("[data-count-to]").forEach(countUp);
        io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

    // standalone count-ups not inside a reveal container (hero callout)
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObs.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll(".curve-callout [data-count-to]").forEach(function (el) { countObs.observe(el); });

    // curve drawing
    var drawObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("drawn");
        drawObs.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    document.querySelectorAll(".curve-card, .lab-canvas").forEach(function (el) { drawObs.observe(el); });
  })();

  /* ---------- Cursor spotlight on cards ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".spotlight").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll(".btn-magnetic").forEach(function (btn) {
      var strength = 0.28;
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        btn.style.transform = "translate(" + dx * strength + "px," + dy * strength + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });
  }

  /* ---------- Word marquee: duplicate for seamless loop ---------- */
  (function marquee() {
    var track = document.getElementById("word-track");
    if (!track) return;
    track.innerHTML += track.innerHTML;
  })();

  /* ---------- Share button ---------- */
  (function share() {
    var btn = document.getElementById("share-btn");
    var hint = document.getElementById("share-hint");
    if (!btn) return;
    var url = btn.getAttribute("data-share-url") || location.href;
    var payload = {
      title: "墨典单词",
      text: "依艾宾浩斯遗忘曲线的极简背单词 App，在你忘记之前复习。",
      url: url
    };
    btn.addEventListener("click", function () {
      if (navigator.share) {
        navigator.share(payload).catch(function () {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          if (hint) hint.textContent = "链接已复制，去分享给朋友吧 ✦";
        }).catch(function () {
          if (hint) hint.textContent = url;
        });
      } else if (hint) {
        hint.textContent = url;
      }
    });
  })();
})();
