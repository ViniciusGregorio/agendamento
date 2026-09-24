const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const leadForm = document.querySelector("#lead-form");
const toast = document.querySelector("#toast");
const year = document.querySelector("#year");

const setMenuState = (open) => {
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton?.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  mainNav?.classList.toggle("is-open", open);
  document.body.classList.toggle("menu-open", open);
};

menuButton?.addEventListener("click", () => {
  setMenuState(menuButton.getAttribute("aria-expanded") !== "true");
});

mainNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuState(false);
});

const updateHeader = () => {
  header?.classList.toggle("is-sticky", window.scrollY > 120);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" },
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll(".accordion details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".accordion details").forEach((other) => {
      if (other !== detail) other.removeAttribute("open");
    });
  });
});

const showToast = () => {
  if (!toast) return;
  toast.classList.add("is-visible");
  window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
};

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!leadForm.reportValidity()) return;

  const formData = new FormData(leadForm);
  const name = String(formData.get("name") || "").trim();
  const goal = String(formData.get("goal") || "").trim();
  const period = String(formData.get("period") || "").trim();
  const message = [
    `Olá! Meu nome é ${name}. Vim pelo site da Ariônia e quero conhecer a academia.`,
    `Meu principal objetivo é: ${goal}.`,
    `Prefiro treinar no período: ${period}.`,
    "Podem me explicar os planos e como funciona para começar?",
  ].join("\n");

  const whatsappUrl = `https://wa.me/5512988911301?text=${encodeURIComponent(message)}`;
  showToast();

  if (window.dataLayer) {
    window.dataLayer.push({
      event: "generate_lead",
      lead_source: "site_form",
      fitness_goal: goal,
      preferred_period: period,
    });
  }

  window.setTimeout(() => window.open(whatsappUrl, "_blank", "noopener"), 180);
});

document.querySelectorAll('a[href*="wa.me"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (!window.dataLayer) return;
    window.dataLayer.push({ event: "whatsapp_click", link_location: link.className || "content" });
  });
});

if (year) year.textContent = String(new Date().getFullYear());
