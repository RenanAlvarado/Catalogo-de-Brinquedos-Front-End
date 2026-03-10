/* ===================================== */
/* CARROSSEL DE MARCAS */
/* ===================================== */

const carousel = document.getElementById("brands-carousel");
const wrapper = document.getElementById("brands-wrapper");

if (carousel && wrapper) {
  let items = document.querySelectorAll(".brand");

  if (items.length > 0) {
    const itemWidth = items[0].offsetWidth + 20;

    // DUPLICAR LISTA
    carousel.innerHTML += carousel.innerHTML;
    items = document.querySelectorAll(".brand");

    let position = 0;
    let speed = 0;

    const totalWidth = (items.length / 2) * itemWidth;

    function animate() {
      position -= speed;

      const visiblePosition = position % totalWidth;

      carousel.style.transform = `translateX(${visiblePosition}px)`;

      requestAnimationFrame(animate);
    }

    animate();

    // CONTROLE PELO MOUSE
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

    // VOLTA AO NORMAL
    wrapper.addEventListener("mouseleave", () => {
      speed = 1;
    });
  }
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
