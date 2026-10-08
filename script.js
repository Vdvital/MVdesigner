"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-nav");
function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir menu");
  mobileMenu.hidden = true;
}
menuToggle.addEventListener("click", () => {
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute("aria-label", opening ? "Fechar menu" : "Abrir menu");
  mobileMenu.hidden = !opening;
});
mobileMenu.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});
window.matchMedia("(min-width: 761px)").addEventListener("change", closeMenu);

const motionDirections = {
  marca: {
    title: "Marca em foco",
    words: ["Identidade", "Presença", "Ritmo"]
  },
  campanha: {
    title: "Campanha com impacto",
    words: ["Oferta", "Alcance", "Memória"]
  },
  conteudo: {
    title: "Conteúdo em série",
    words: ["Posts", "Stories", "Reels"]
  }
};
const motionPreview = document.querySelector("[data-motion-preview]");
const motionTitle = document.querySelector("#motion-preview-title");
const motionWords = document.querySelectorAll(".preview-word");
document.querySelectorAll("[data-motion]").forEach(button => {
  button.addEventListener("click", () => {
    const direction = motionDirections[button.dataset.motion];
    motionPreview.dataset.mode = button.dataset.motion;
    motionTitle.textContent = direction.title;
    motionWords.forEach((word, index) => { word.textContent = direction.words[index]; });
    document.querySelectorAll("[data-motion]").forEach(control => {
      const selected = control === button;
      control.classList.toggle("is-active", selected);
      control.setAttribute("aria-selected", String(selected));
    });
  });
});

const serviceSelect = document.querySelector("#service");
document.querySelectorAll("[data-service]").forEach(link => {
  link.addEventListener("click", () => { serviceSelect.value = link.dataset.service; });
});
document.querySelector("#brief-form").addEventListener("submit", event => {
  event.preventDefault();
  const name = document.querySelector("#name").value.trim();
  const message = document.querySelector("#message").value.trim();
  if (!name || !message) {
    document.querySelector("#form-status").textContent = "Preencha seu nome e conte um pouco sobre o projeto.";
    return;
  }
  const text = `Olá, Marcos! Sou ${name}.\n\nTenho interesse em: ${serviceSelect.value}.\n\nSobre o projeto:\n${message}`;
  // Navigate in this tab so mobile browsers cannot block the conversation as a popup.
  window.location.assign(`https://wa.me/5511993975886?text=${encodeURIComponent(text)}`);
});
document.querySelector("#year").textContent = new Date().getFullYear();

const projects = {
  nexo: {
    title: "Nexo / Identidade visual",
    image: "assets/nexo.jpg",
    alt: "Papelaria conceitual Nexo em azul, branco e prata",
    description: "Um estudo de identidade que explora contraste, tipografia e consistência nas aplicações de papelaria. A mesma linguagem conecta cartão, envelope e apresentação. Projeto de demonstração com imagem ilustrativa, sem vínculo com um cliente real."
  },
  alva: {
    title: "Alva / Direção de arte",
    image: "assets/alva.jpg",
    alt: "Campanha conceitual Alva com frascos verdes e papel laranja",
    description: "Um estudo de campanha para uma marca fictícia de cuidados pessoais. Contraste de cores e composição colocam o produto no centro da comunicação. Projeto de demonstração com imagem ilustrativa, sem vínculo com um cliente real."
  }
};
const projectDialog = document.querySelector("#project-dialog");
document.querySelectorAll("[data-project]").forEach(button => {
  button.addEventListener("click", () => {
    const project = projects[button.dataset.project];
    document.querySelector("#dialog-title").textContent = project.title;
    document.querySelector("#dialog-description").textContent = project.description;
    const image = document.querySelector("#dialog-image");
    image.src = project.image;
    image.alt = project.alt;
    projectDialog.showModal();
    document.body.classList.add("dialog-open");
  });
});
document.querySelector(".dialog-close").addEventListener("click", () => projectDialog.close());
projectDialog.addEventListener("close", () => document.body.classList.remove("dialog-open"));
projectDialog.addEventListener("click", event => {
  const bounds = projectDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) projectDialog.close();
});
document.querySelector("#dialog-contact").addEventListener("click", () => projectDialog.close());

const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const revealElements = document.querySelectorAll(".motion-copy, .motion-preview, .section-heading, .project-card, .service-row, .about-layout, .process-list li, .contact-intro, .brief-form");
if (!motionPreference.matches && "IntersectionObserver" in window) {
  document.body.classList.add("has-motion");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${(index % 2) * 80}ms`);
    observer.observe(element);
  });
  motionPreference.addEventListener("change", () => {
    if (motionPreference.matches) {
      document.body.classList.remove("has-motion");
      observer.disconnect();
    }
  });
}

let pointerFramePending = false;
function updatePointerEffects(event) {
  const width = window.innerWidth || 1;
  const height = window.innerHeight || 1;
  const x = event.clientX / width;
  const y = event.clientY / height;
  document.body.style.setProperty("--cursor-x", `${Math.round(x * 100)}%`);
  document.body.style.setProperty("--cursor-y", `${Math.round(y * 100)}%`);
  document.body.style.setProperty("--hero-shift-x", `${(x - 0.5) * 18}px`);
  document.body.style.setProperty("--hero-shift-y", `${(y - 0.5) * 14}px`);
  document.body.style.setProperty("--hero-rotate", `${(x - 0.5) * 2.4}deg`);
  pointerFramePending = false;
}
if (!motionPreference.matches && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", event => {
    if (!pointerFramePending) {
      pointerFramePending = true;
      window.requestAnimationFrame(() => updatePointerEffects(event));
    }
  }, { passive: true });
  document.querySelectorAll("[data-tilt]").forEach(card => {
    card.addEventListener("pointermove", event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${y * -7}deg`);
      card.style.setProperty("--tilt-y", `${x * 7}deg`);
      card.classList.add("is-tilting");
    });
    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  });
}

const progress = document.querySelector(".scroll-progress");
const heroLogo = document.querySelector(".hero-logo");
let scrollFramePending = false;
function updateScroll() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${distance > 0 ? Math.min(window.scrollY / distance, 1) : 0})`;
  heroLogo.style.setProperty("--parallax", motionPreference.matches ? "0px" : `${Math.min(window.scrollY * 0.04, 24)}px`);
  scrollFramePending = false;
}
window.addEventListener("scroll", () => {
  if (!scrollFramePending) {
    scrollFramePending = true;
    window.requestAnimationFrame(updateScroll);
  }
}, { passive: true });
window.addEventListener("resize", updateScroll);
updateScroll();
