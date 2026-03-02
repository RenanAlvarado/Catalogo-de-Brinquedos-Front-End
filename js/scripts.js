const carousel = document.getElementById("brands-carousel");
const nextBtn = document.querySelector(".arrow.right");
const prevBtn = document.querySelector(".arrow.left");

let items = document.querySelectorAll(".brand");
const itemWidth = items[0].offsetWidth + 20; // largura + gap

// ===== DUPLICAR ITENS =====
// Para garantir loop suave, duplicamos todos os itens
carousel.innerHTML += carousel.innerHTML;
items = document.querySelectorAll(".brand");

let position = 0;
let speed = 1; // pixels por frame

function animate() {
  position -= speed;
  if (Math.abs(position) >= (items.length / 2) * itemWidth) {
    // reset quando chega na metade (fim da lista original)
    position = 0;
  }
  carousel.style.transform = `translateX(${position}px)`;
  requestAnimationFrame(animate);
}

animate();

// ===== CONTROLE MANUAL =====
nextBtn.addEventListener("click", () => {
  position -= itemWidth * 2; // acelera para frente
});

prevBtn.addEventListener("click", () => {
  position += itemWidth * 2; // acelera para trás
});
