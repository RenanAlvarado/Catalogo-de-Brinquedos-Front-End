import { abrirBrinquedo } from "../router/brinquedoRouter.js";

export function bindCardBrinquedo(cardElement, brinquedo) {
  cardElement.onclick = () => {
    abrirBrinquedo(brinquedo.id);
  };
}
