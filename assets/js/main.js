/* 墨典单词 官网主脚本 */

(function () {
  "use strict";

  /* ---------- Mobile Navigation ---------- */
  var menuBtn = document.getElementById("nav-menu-btn");
  var navLinks = document.getElementById("nav-links");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!menuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- FAQ Accordion ---------- */
  var faqItems = document.querySelectorAll(".faq-question");

  faqItems.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var answer = document.getElementById(btn.getAttribute("aria-controls"));
      var isExpanded = btn.getAttribute("aria-expanded") === "true";

      // Close all
      faqItems.forEach(function (other) {
        var otherAnswer = document.getElementById(
          other.getAttribute("aria-controls")
        );
        other.setAttribute("aria-expanded", "false");
        if (otherAnswer) otherAnswer.classList.remove("is-open");
      });

      // Toggle current
      if (!isExpanded) {
        btn.setAttribute("aria-expanded", "true");
        if (answer) answer.classList.add("is-open");
      }
    });
  });

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ---------- Intersection Observer for fade-in ---------- */
  if ("IntersectionObserver" in window) {
    var style = document.createElement("style");
    style.textContent =
      ".observe-fade{opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}.observe-fade.is-visible{opacity:1;transform:none}";
    document.head.appendChild(style);

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    document
      .querySelectorAll(".feature-card, .flow-step, .audience-tag, .faq-item, .screenshot-frame, .section-title")
      .forEach(function (el) {
        el.classList.add("observe-fade");
        observer.observe(el);
      });
  }
})();
