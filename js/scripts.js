const carousel = document.getElementById("brands-carousel");
const nextBtn = document.querySelector(".arrow.right");
const prevBtn = document.querySelector(".arrow.left");

let items = document.querySelectorAll(".brand");
const itemWidth = items[0].offsetWidth + 20; // 180 + gap
let index = 1;

// ===== CLONAR PRIMEIRO E ÚLTIMO =====
const firstClone = items[0].cloneNode(true);
const lastClone = items[items.length - 1].cloneNode(true);

carousel.appendChild(firstClone);
carousel.insertBefore(lastClone, items[0]);

items = document.querySelectorAll(".brand");

// Posição inicial (já no primeiro real)
carousel.style.transform = `translateX(-${itemWidth}px)`;

// ===== FUNÇÃO MOVER =====
function moveCarousel() {
  carousel.style.transition = "transform 0.4s ease";
  carousel.style.transform = `translateX(-${itemWidth * index}px)`;
}

// ===== BOTÃO DIREITA =====
nextBtn.addEventListener("click", () => {
  if (index >= items.length - 1) return;
  index++;
  moveCarousel();
});

// ===== BOTÃO ESQUERDA =====
prevBtn.addEventListener("click", () => {
  if (index <= 0) return;
  index--;
  moveCarousel();
});

// ===== CORREÇÃO INVISÍVEL =====
carousel.addEventListener("transitionend", () => {
  // Se chegou no clone do final
  if (items[index].isSameNode(firstClone)) {
    carousel.style.transition = "none";
    index = 1;
    carousel.style.transform = `translateX(-${itemWidth * index}px)`;
  }

  // Se chegou no clone do começo
  if (items[index].isSameNode(lastClone)) {
    carousel.style.transition = "none";
    index = items.length - 2;
    carousel.style.transform = `translateX(-${itemWidth * index}px)`;
  }
});
