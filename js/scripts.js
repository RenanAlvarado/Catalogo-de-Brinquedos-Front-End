/* CARROSSEL DE MARCAS */
const carousel = document.getElementById("brands-carousel");
const wrapper = document.getElementById("brands-wrapper");

let items = document.querySelectorAll(".brand");
const itemWidth = items[0].offsetWidth + 20;

// ===== DUPLICAR LISTA =====
carousel.innerHTML += carousel.innerHTML;
items = document.querySelectorAll(".brand");

let position = 0;
let speed = 0; // começa parado
const totalWidth = (items.length / 2) * itemWidth;

// ===== ANIMAÇÃO CONTÍNUA =====
function animate() {
  position -= speed;
  const visiblePosition = position % totalWidth;
  carousel.style.transform = `translateX(${visiblePosition}px)`;
  requestAnimationFrame(animate);
}
animate();

// ===== CONTROLE PELO MOUSE =====
wrapper.addEventListener("mousemove", (e) => {
  const rect = wrapper.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const center = rect.width / 2;

  if (x < center - 50) {
    speed = -3.5;
  } else if (x > center + 50) {
    speed = 3.5;
  } else {
    speed = 1;
  }
});

// ===== VOLTA AO NORMAL =====
wrapper.addEventListener("mouseleave", () => {
  speed = 1;
});

/* ===================================== */
/* CARROSSEL DO BANNER */
/* ===================================== */

const bannerCarousel = document.querySelector("#banner-carousel");
const bannerSlides = document.querySelectorAll(".banner-slide");

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let bannerIndex = 0;

// atualizar posição
function updateBanner() {
  bannerCarousel.style.transform = `translateX(-${bannerIndex * 100}%)`;
}

// botão próximo
nextBtn.addEventListener("click", () => {
  bannerIndex++;

  if (bannerIndex >= bannerSlides.length) {
    bannerIndex = 0;
  }

  updateBanner();
});

// botão anterior
prevBtn.addEventListener("click", () => {
  bannerIndex--;

  if (bannerIndex < 0) {
    bannerIndex = bannerSlides.length - 1;
  }

  updateBanner();
});

// auto slide
setInterval(() => {
  bannerIndex++;

  if (bannerIndex >= bannerSlides.length) {
    bannerIndex = 0;
  }

  updateBanner();
}, 5000);

// Carrosell de Categorias

// Elementos
const categorywrapper = document.querySelector("#categories-wrapper");
const prevBtnCategories = document.querySelector(".prev-categories");
const nextBtnCategories = document.querySelector(".next-categories");

// mover para direita
nextBtnCategories.addEventListener("click", () => {
  const maxScroll = categoryCarousel.scrollWidth - categorywrapper.clientWidth;

  if (scrollPosition < maxScroll) {
    scrollPosition += scrollAmount;

    if (scrollPosition > maxScroll) {
      scrollPosition = maxScroll;
    }

    categoryCarousel.style.transform = `translateX(-${scrollPosition}px)`;
  }
});

// posição atual
let scrollPosition = 0;

// quantidade de movimento
const scrollAmount = 180;

// mover para esquerda
prevBtnCategories.addEventListener("click", () => {
  scrollPosition -= scrollAmount;

  if (scrollPosition < 0) {
    scrollPosition = 0;
  }

  categoryCarousel.style.transform = `translateX(-${scrollPosition}px)`;
});
