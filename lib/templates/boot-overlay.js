/** Boot splash markup for billtube-fw loader. */
export function bootOverlayCardHtml() {
  return `
        <div class="btfw-boot-overlay__card">
          <div class="btfw-boot-overlay__ring"></div>
          <p class="btfw-boot-overlay__label">
            <strong>BillTube theme</strong>
            Preparing the channel experience…
          </p>
          <p class="btfw-boot-overlay__error"></p>
        </div>
      `;
}
