const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const links = Array.from(document.querySelectorAll(".nav-link"));
const mainContent = document.getElementById("mainContent");
const WEB3FORMS_ACCESS_KEY = "15a138bd-2431-4dca-8ecb-8557b3b1c0d5";

const lightbox = document.getElementById("galleryLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const originalMainHTML = mainContent ? mainContent.innerHTML : "";

let isGiftView = false;
let mainController = null;
let sectionObserver = null;
let galleryImages = [];
let currentGalleryIndex = 0;

const closeMobileMenu = () => {
  if (window.innerWidth <= 860 && sidebar) {
    sidebar.classList.remove("open");
    document.body.classList.remove("menu-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  }
};

const setActiveNav = (targetId) => {
  links.forEach((link) => {
    link.classList.toggle("active", link.dataset.target === targetId);
  });
};

if (menuBtn && sidebar) {
  menuBtn.addEventListener("click", () => {
    const willOpen = !sidebar.classList.contains("open");
    sidebar.classList.toggle("open");
    document.body.classList.toggle("menu-open", willOpen);
    menuBtn.setAttribute("aria-expanded", String(willOpen));
  });
}

const closeLightbox = () => {
  if (!lightbox) return;
  lightbox.classList.add("hidden");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
};

const renderLightboxImage = () => {
  const image = galleryImages[currentGalleryIndex];
  if (!image || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = `${image.alt} (${currentGalleryIndex + 1}/${galleryImages.length})`;
};

const openLightbox = (index) => {
  if (!lightbox) return;
  currentGalleryIndex = index;
  renderLightboxImage();
  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
};

const goToPreviousImage = () => {
  if (!galleryImages.length) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
  renderLightboxImage();
};

const goToNextImage = () => {
  if (!galleryImages.length) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
  renderLightboxImage();
};

lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", goToPreviousImage);
lightboxNext?.addEventListener("click", goToNextImage);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.classList.contains("hidden")) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") goToPreviousImage();
  if (event.key === "ArrowRight") goToNextImage();
});

const bindSectionObserver = () => {
  sectionObserver?.disconnect();
  const sections = Array.from(document.querySelectorAll("main .section"));
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        if (id) setActiveNav(id);
      });
    },
    { threshold: 0.35 }
  );
  sections.forEach((section) => sectionObserver?.observe(section));
};

const bindHeroCountdown = (signal) => {
  const countdownEl = document.getElementById("heroCountdown");
  if (!countdownEl) return;

  const weddingStart = new Date(2026, 3, 11, 0, 0, 0, 0);
  const weddingEnd = new Date(2026, 3, 12, 0, 0, 0, 0);

  const updateCountdown = () => {
    const now = new Date();
    countdownEl.classList.remove("state-today", "state-after");

    if (now >= weddingEnd) {
      countdownEl.textContent = "CASADOS E FELIZES!";
      countdownEl.classList.add("state-after");
      return;
    }

    if (now >= weddingStart) {
      countdownEl.textContent = "É HOJE!!";
      countdownEl.classList.add("state-today");
      return;
    }

    const diff = weddingStart.getTime() - now.getTime();
    const totalSeconds = Math.max(0, Math.floor(diff / 1000));
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownEl.innerHTML = `
      <div class="countdown-grid">
        <div class="countdown-item">
          <span class="countdown-value">${days}</span>
          <span class="countdown-label">dias</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${String(hours).padStart(2, "0")}</span>
          <span class="countdown-label">horas</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${String(minutes).padStart(2, "0")}</span>
          <span class="countdown-label">min</span>
        </div>
        <div class="countdown-item">
          <span class="countdown-value">${String(seconds).padStart(2, "0")}</span>
          <span class="countdown-label">seg</span>
        </div>
      </div>
    `;
  };

  updateCountdown();
  const intervalId = window.setInterval(updateCountdown, 1000);
  signal.addEventListener("abort", () => window.clearInterval(intervalId), { once: true });
};

const bindGallery = (signal) => {
  galleryImages = Array.from(document.querySelectorAll(".gallery-grid img"));
  galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => openLightbox(index), { signal });
  });
};

const bindRSVP = (signal) => {
  const temCriancas = document.getElementById("temCriancas");
  const criancasBox = document.getElementById("criancasBox");
  const qtdCriancas = document.getElementById("qtdCriancas");
  const criancasDetalhes = document.getElementById("criancasDetalhes");
  const form = document.querySelector(".rsvp-form");

  if (!temCriancas || !criancasBox || !qtdCriancas || !criancasDetalhes || !form) return;

  const renderChildrenDetails = () => {
    const amount = Number.parseInt(qtdCriancas.value, 10);
    criancasDetalhes.innerHTML = "";
    if (!Number.isInteger(amount) || amount < 1) return;

    for (let i = 1; i <= amount; i += 1) {
      const row = document.createElement("div");
      row.className = "children-row";
      row.innerHTML = `
        <div class="field">
          <input type="text" id="nomeCrianca${i}" name="nomeCrianca${i}" placeholder=" " required>
          <label for="nomeCrianca${i}">Nome da criança ${i}</label>
        </div>
        <div class="field">
          <input type="number" id="idadeCrianca${i}" name="idadeCrianca${i}" min="0" max="17" placeholder=" " required>
          <label for="idadeCrianca${i}">Idade da criança ${i}</label>
        </div>
      `;
      criancasDetalhes.appendChild(row);
    }
  };

  const handleChildrenFields = () => {
    const hasChildren = temCriancas.value === "sim";
    criancasBox.classList.toggle("hidden", !hasChildren);
    qtdCriancas.required = hasChildren;
    if (!hasChildren) {
      qtdCriancas.value = "";
      criancasDetalhes.innerHTML = "";
    }
  };

  temCriancas.addEventListener("change", handleChildrenFields, { signal });
  qtdCriancas.addEventListener("input", renderChildrenDetails, { signal });

  form.addEventListener(
    "submit",
    async (event) => {
      event.preventDefault();
      const convidado1 = document.getElementById("convidado1")?.value.trim() || "Não informado";
      const convidado2 = document.getElementById("convidado2")?.value.trim();
      const email = document.getElementById("email")?.value.trim() || "Não informado";
      const hasChildren = temCriancas.value === "sim";
      const childrenCount = hasChildren ? Number.parseInt(qtdCriancas.value || "0", 10) : 0;

      const lines = [
        "Olá, Yane e Paulo.",
        `${convidado1} respondeu o RSVP. A seguir as informações do formulário:`,
        "",
        `Convidado(a) principal: ${convidado1}`,
        `Convidado(a) 2: ${convidado2 || "Não informado"}`,
        `E-mail: ${email}`,
        `Há crianças? ${hasChildren ? "Sim" : "Não"}`
      ];

      if (hasChildren && Number.isInteger(childrenCount) && childrenCount > 0) {
        lines.push(`Quantidade de crianças: ${childrenCount}`);
        lines.push("");
        lines.push("Dados das crianças:");

        for (let i = 1; i <= childrenCount; i += 1) {
          const childName = document.getElementById(`nomeCrianca${i}`)?.value.trim() || "Não informado";
          const childAge = document.getElementById(`idadeCrianca${i}`)?.value.trim() || "Não informado";
          lines.push(`${i}. ${childName} (${childAge} anos)`);
        }
      }

      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: "Envio de RSVP do casamento",
        from_name: "Site Yane & Paulo",
        to: "amanda328@hotmail.com",
        message: lines.join("\n"),
        convidado_principal: convidado1,
        convidado_2: convidado2 || "Não informado",
        email_contato: email,
        ha_criancas: hasChildren ? "Sim" : "Não",
        quantidade_criancas: hasChildren && Number.isInteger(childrenCount) ? String(childrenCount) : "0"
      };

      try {
        if (WEB3FORMS_ACCESS_KEY === "COLE_SUA_ACCESS_KEY_AQUI") {
          throw new Error("Configure sua access key do Web3Forms em script.js.");
        }

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          const apiMessage = typeof result.message === "string" ? result.message : "Falha no envio do formulário.";
          throw new Error(apiMessage);
        }

        alert("RSVP enviado com sucesso. Obrigado por confirmar presença!");
        form.reset();
        criancasBox.classList.add("hidden");
        criancasDetalhes.innerHTML = "";
      } catch (error) {
        const message = error instanceof Error ? error.message : "Não foi possível enviar agora.";
        alert(`Não foi possível enviar agora: ${message}`);
      }
    },
    { signal }
  );
};

const loadGiftPageIntoMain = async (url) => {
  if (!mainContent) return;
  closeLightbox();
  mainController?.abort();

  const separator = url.includes("?") ? "&" : "?";
  const urlWithBust = `${url}${separator}v=${Date.now()}`;
  const response = await fetch(urlWithBust, { cache: "no-store", headers: { Accept: "text/html" } });
  if (!response.ok) throw new Error("Falha ao carregar lista de presentes.");
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const giftPage = doc.querySelector(".gift-page");
  const fallbackCard = doc.querySelector(".card");
  if (!giftPage && !fallbackCard) throw new Error("Conteúdo da lista não encontrado.");

  mainContent.innerHTML = giftPage
    ? giftPage.outerHTML
    : `<section id="presentes" class="section">${fallbackCard.outerHTML}</section>`;
  window.scrollTo({ top: 0, behavior: "smooth" });
  isGiftView = true;
  sectionObserver?.disconnect();
  setActiveNav("presentes");
};

const restoreMainContent = () => {
  if (!mainContent || !isGiftView) return;
  mainContent.innerHTML = originalMainHTML;
  isGiftView = false;
  initMainContent();
};

const bindGiftLink = (signal) => {
  const giftLink = document.querySelector(".gift-btn");
  if (!giftLink) return;

  giftLink.addEventListener(
    "click",
    async (event) => {
      event.preventDefault();
      try {
        await loadGiftPageIntoMain(giftLink.href);
      } catch (error) {
        window.location.href = giftLink.href;
      }
    },
    { signal }
  );
};

const bindGiftViewBackLink = (signal) => {
  const backLink = mainContent?.querySelector('a[href="index.html"]');
  if (!backLink) return;
  backLink.addEventListener(
    "click",
    (event) => {
      event.preventDefault();
      restoreMainContent();
      const homeSection = document.getElementById("home");
      if (homeSection) {
        setActiveNav("home");
        homeSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    { signal }
  );
};

const initMainContent = () => {
  mainController?.abort();
  mainController = new AbortController();
  const { signal } = mainController;

  bindSectionObserver();
  bindHeroCountdown(signal);
  bindGallery(signal);
  bindRSVP(signal);
  bindGiftLink(signal);
  bindGiftViewBackLink(signal);
};

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    closeMobileMenu();
    closeLightbox();

    if (isGiftView) {
      restoreMainContent();
    }

    const targetId = link.dataset.target;
    if (!targetId) return;
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;
    setActiveNav(targetId);
    targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

initMainContent();
