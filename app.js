(() => {
  const STORAGE_KEY = "cv-lang";
  const defaultLang = "es";

  const getInitialLang = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
    const browser = (navigator.language || "es").slice(0, 2).toLowerCase();
    return translations[browser] ? browser : defaultLang;
  };

  const applyLanguage = (lang) => {
    const dict = translations[lang] || translations[defaultLang];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = dict[key];
      if (typeof value !== "string") return;

      if (value.includes("<")) {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    document.title =
      lang === "es"
        ? "Dannel Jimenez — CV"
        : "Dannel Jimenez — Resume";

    localStorage.setItem(STORAGE_KEY, lang);
  };

  const bindLanguageSwitch = () => {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        if (!translations[lang]) return;

        document.body.classList.remove("is-switching");
        // Force reflow so the animation restarts
        void document.body.offsetWidth;
        document.body.classList.add("is-switching");
        applyLanguage(lang);
      });
    });
  };

  const ensurePhotoFallback = () => {
    const photo = document.querySelector(".photo");
    const fallback = document.querySelector(".photo-fallback");
    if (!photo || !fallback) return;

    if (photo.complete && photo.naturalWidth === 0) {
      photo.classList.add("is-hidden");
      fallback.classList.add("is-visible");
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyLanguage(getInitialLang());
    bindLanguageSwitch();
    ensurePhotoFallback();
  });
})();
