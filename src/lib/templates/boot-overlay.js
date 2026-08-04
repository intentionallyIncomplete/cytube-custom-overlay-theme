/** Boot splash markup for billtube-fw loader. */
export function buildBootOverlayCard() {
  const card = document.createElement("div");
  card.className = "btfw-boot-overlay__card";

  const ring = document.createElement("div");
  ring.className = "btfw-boot-overlay__ring";

  const label = document.createElement("p");
  label.className = "btfw-boot-overlay__label";
  const strong = document.createElement("strong");
  strong.textContent = "Quigly's Playground";
  label.append(strong, document.createTextNode(" Preparing the channel experience\u2026"));

  const error = document.createElement("p");
  error.className = "btfw-boot-overlay__error";

  card.append(ring, label, error);
  return card;
}
