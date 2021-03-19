/**
 * Show popup message.
 *
 * ```js
 * hv.ui.showPopup('Hello, World!');
 * hv.ui.showPopup('Hello, World!', 'red');
 * hv.ui.showPopup('Hello, World!', '#ff00ff', 'HentaiVerse Monster Database UserScript');
 * ```
 */
export function popup(msgHtml: string, color = '#000', title?: string): void {
  const popupEl = document.body.appendChild(document.createElement('div'));
  popupEl.style.cssText = 'position:fixed;top:0;left:0;width:1236px;height:702px;padding:3px 100% 100% 3px;background-color:rgba(0,0,0,.3);z-index:1001;display:flex;justify-content:center;align-items:center';
  const popupMsgEl = popupEl.appendChild(document.createElement('div'));
  popupMsgEl.style.cssText = 'min-width:400px;min-height:80px;max-width:100%;max-height:100%;padding:10px;background-color:#fff;border:1px solid #333;cursor:pointer;display:flex;flex-direction:column;justify-content:center;font-size:10pt';

  if (title) {
    const titleEl = popupMsgEl.appendChild(document.createElement('h3'));
    titleEl.textContent = title;
    titleEl.style.marginTop = '0';
  }
  const contentEl = popupMsgEl.appendChild(document.createElement('div'));
  contentEl.style.color = color;
  contentEl.innerHTML = msgHtml;

  const closePopupKeyboardEventHandler = (e: KeyboardEvent) => {
    if (e instanceof KeyboardEvent) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        popupEl.remove();
      }
    }
    document.removeEventListener('keydown', closePopupKeyboardEventHandler);
  };

  popupEl.addEventListener('click', () => {
    popupEl.remove();
  });
  document.addEventListener('keydown', closePopupKeyboardEventHandler);
}
