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
/* ABRIR OPÇÕES OU CONTEÚDO QUANDO A TELA TEM UM DROPDOWN BTN
/* ===================================== */
document.querySelectorAll(".dropdown-btn").forEach((botao) => {
  botao.addEventListener("click", () => {
    const opcoes = botao.nextElementSibling;

    opcoes.classList.toggle("open");
    botao.classList.toggle("open");
  });
});

/* ===================================== */
/* CARROSSEL DE MARCAS SIMPLIFICADO */
/* ===================================== */

const brandCarousel = document.querySelector("#brands-simple-carousel");
const brandWrapper = document.querySelector("#brands-simple-wrapper");

const prevBtnBrands = document.querySelector(".prev-brands");
const nextBtnBrands = document.querySelector(".next-brands");

if (brandCarousel && brandWrapper) {
  let scrollPosition = 0;

  const scrollAmount = 180;

  nextBtnBrands?.addEventListener("click", () => {
    const maxScroll = brandCarousel.scrollWidth - brandWrapper.clientWidth;

    if (scrollPosition < maxScroll) {
      scrollPosition += scrollAmount;

      if (scrollPosition > maxScroll) {
        scrollPosition = maxScroll;
      }

      brandCarousel.style.transform = `translateX(-${scrollPosition}px)`;
    }
  });

  prevBtnBrands?.addEventListener("click", () => {
    scrollPosition -= scrollAmount;

    if (scrollPosition < 0) {
      scrollPosition = 0;
    }

    brandCarousel.style.transform = `translateX(-${scrollPosition}px)`;
  });
}
