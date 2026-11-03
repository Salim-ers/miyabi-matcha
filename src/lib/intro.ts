/** Gestion de l'intro cinématographique (jouée une fois par session). */
export const INTRO_STORAGE_KEY = "miyabi:intro-seen";
export const INTRO_EVENT = "miyabi:intro-done";

/** Script inline exécuté avant le premier rendu : évite tout flash de l'intro. */
export const introBootScript = `(function(){var d=document.documentElement;d.classList.add('js');var m='skip';try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var s=window.sessionStorage.getItem('${INTRO_STORAGE_KEY}');if(!r&&!s&&location.pathname==='/'){m='play'}}catch(e){}d.setAttribute('data-intro',m);})();`;

export function isIntroPending() {
  return typeof document !== "undefined" && document.documentElement.dataset.intro === "play";
}

/** Appelle `cb` quand l'intro est terminée (ou immédiatement si elle n'est pas jouée). */
export function onIntroDone(cb: () => void): () => void {
  if (!isIntroPending()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(INTRO_EVENT, handler, { once: true });
  return () => window.removeEventListener(INTRO_EVENT, handler);
}

export function completeIntro() {
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    /* stockage indisponible : l'intro rejouera simplement */
  }
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event(INTRO_EVENT));
}
