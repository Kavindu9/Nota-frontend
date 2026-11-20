import type { MouseEvent } from "react";

// Links like "#specifications" jump to a section on this page.
export function scrollToSection(event: MouseEvent<HTMLAnchorElement>, url: string) {
  if (!url.startsWith("#")) return; 
  const target = document.querySelector<HTMLElement>(url);
  if (!target) return;

  event.preventDefault(); // stop the browser's own jump
  const spacer = target.parentElement?.classList.contains("pin-spacer") ? target.parentElement : null;
  const box = spacer ?? target;
  let top = box.getBoundingClientRect().top + window.scrollY; 

  if (spacer) {
    const offset = Number(target.dataset.scrollOffset ?? 0); 
    top += offset * window.innerHeight;
  }

  window.scrollTo({ top, behavior: "smooth" });
  history.replaceState(null, "", url); 
}
