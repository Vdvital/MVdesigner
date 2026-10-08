"use strict";
(() => {
  const form = document.getElementById("feedback-form");
  if (!form) return;
  const stars = [...form.querySelectorAll(".feedback-star")];
  const ratingInput = document.getElementById("feedback-rating");
  const ratingLabel = document.getElementById("feedback-rating-label");
  const status = document.getElementById("feedback-status");
  const names = ["", "1 estrela — Ruim", "2 estrelas — Regular", "3 estrelas — Bom", "4 estrelas — Muito bom", "5 estrelas — Excelente"];
  function setRating(value, focus = false) {
    const rating = Math.max(1, Math.min(5, Number(value)));
    ratingInput.value = String(rating);
    stars.forEach((star, index) => {
      star.setAttribute("aria-pressed", String(index + 1 === rating));
      star.textContent = index < rating ? "★" : "☆";
      star.tabIndex = index + 1 === rating ? 0 : -1;
    });
    ratingLabel.textContent = names[rating];
    status.textContent = "";
    if (focus) stars[rating - 1].focus();
  }
  stars.forEach((star, index) => {
    star.addEventListener("click", () => setRating(index + 1));
    star.addEventListener("keydown", event => {
      if (event.key === "ArrowRight" || event.key === "ArrowUp") { event.preventDefault(); setRating((index + 1) % 5 + 1, true); }
      if (event.key === "ArrowLeft" || event.key === "ArrowDown") { event.preventDefault(); setRating((index + 3) % 5 + 1, true); }
    });
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("feedback-name").value.trim();
    const message = document.getElementById("feedback-message").value.trim();
    const rating = Number(ratingInput.value);
    if (!name || !message || !rating) {
      status.textContent = "Preencha seu nome, selecione as estrelas e escreva seu comentário.";
      return;
    }
    const text = `Olá, Marcos! Gostaria de deixar um feedback sobre o MV Designer.\n\nNome: ${name}\nAvaliação: ${rating}/5 estrelas\nComentário: ${message}`;
    status.textContent = "Abrindo o WhatsApp para você confirmar o envio do feedback.";
    window.location.assign(`https://wa.me/5511993975886?text=${encodeURIComponent(text)}`);
  });
})();
