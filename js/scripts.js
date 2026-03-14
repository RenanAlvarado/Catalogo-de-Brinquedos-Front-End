/* ===================================== */
/* CARROSSEL DE MARCAS */
/* ===================================== */

export function iniciarCarrosselMarcas() {
  const carousel = document.getElementById("brands-carousel");
  const wrapper = document.getElementById("brands-wrapper");

  if (!carousel || !wrapper) return;

  let items = carousel.querySelectorAll(".brand-card");

  if (items.length === 0) return;

  const itemWidth = items[0].offsetWidth + 20;

  // DUPLICAR LISTA (forma segura)
  const cards = [...items];

  cards.forEach((card) => {
    const clone = card.cloneNode(true);

    // copiar evento de clique
    clone.addEventListener("click", () => {
      card.click();
    });

    carousel.appendChild(clone);
  });
  items = carousel.querySelectorAll(".brand-card");

  let position = 0;
  let speed = 1;

  const totalWidth = (items.length / 2) * itemWidth;

  function animate() {
    position -= speed;

    // LOOP INFINITO CORRIGIDO
    if (position <= -totalWidth) {
      position += totalWidth;
    }

    if (position >= 0) {
      position -= totalWidth;
    }

    carousel.style.transform = `translateX(${position}px)`;

    requestAnimationFrame(animate);
  }

  animate();

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const center = rect.width / 2;

    if (x < center - 50) speed = -3.5;
    else if (x > center + 50) speed = 3.5;
    else speed = 1;
  });

  wrapper.addEventListener("mouseleave", () => {
    speed = 1;
  });
}

/* ===================================== */
/* CARROSSEL DO BANNER */
/* ===================================== */

const bannerCarousel = document.querySelector("#banner-carousel");
const bannerSlides = document.querySelectorAll(".banner-slide");

const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

if (bannerCarousel && bannerSlides.length > 0) {
  let bannerIndex = 0;

  function updateBanner() {
    bannerCarousel.style.transform = `translateX(-${bannerIndex * 100}%)`;
  }

  nextBtn?.addEventListener("click", () => {
    bannerIndex++;

    if (bannerIndex >= bannerSlides.length) {
      bannerIndex = 0;
    }

    updateBanner();
  });

  prevBtn?.addEventListener("click", () => {
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
}

/* ===================================== */
/* CARROSSEL DE CATEGORIAS */
/* ===================================== */

const categoryCarousel = document.querySelector("#categories-carousel");
const categoryWrapper = document.querySelector("#categories-wrapper");

const prevBtnCategories = document.querySelector(".prev-categories");
const nextBtnCategories = document.querySelector(".next-categories");

if (categoryCarousel && categoryWrapper) {
  let scrollPosition = 0;

  const scrollAmount = 180;

  nextBtnCategories?.addEventListener("click", () => {
    const maxScroll =
      categoryCarousel.scrollWidth - categoryWrapper.clientWidth;

    if (scrollPosition < maxScroll) {
      scrollPosition += scrollAmount;

      if (scrollPosition > maxScroll) {
        scrollPosition = maxScroll;
      }

      categoryCarousel.style.transform = `translateX(-${scrollPosition}px)`;
    }
  });

  prevBtnCategories?.addEventListener("click", () => {
    scrollPosition -= scrollAmount;

    if (scrollPosition < 0) {
      scrollPosition = 0;
    }

    categoryCarousel.style.transform = `translateX(-${scrollPosition}px)`;
  });
}

/* ===================================== */
/* ABRIR OPÇÕES DE CATEGORIAS E MARCAS */
/* ===================================== */
document.querySelectorAll(".dropdown-btn").forEach((botao) => {
  botao.addEventListener("click", () => {
    const opcoes = botao.nextElementSibling;

    opcoes.classList.toggle("open");
    botao.classList.toggle("open");
  });
});
