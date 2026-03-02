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
  const x = e.clientX - rect.left; // posição do mouse dentro do wrapper
  const center = rect.width / 2;

  if (x < center - 50) {
    // mouse mais para a esquerda → anda para trás
    speed = -3.5;
  } else if (x > center + 50) {
    // mouse mais para a direita → anda para frente
    speed = 3.5;
  } else {
    // mouse no centro → velocidade menor ou parado
    speed = 1;
  }
});

// ===== VOLTA ao normal quando sai do wrapper =====
wrapper.addEventListener("mouseleave", () => {
  speed = 1; // velocidade padrão
});
