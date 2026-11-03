/**
 * « La scène » : tant qu'un écran couvre la page (intro, transition), les animations d'entrée attendent.
 * Les composants s'y abonnent avec onStage().
 */
export const INTRO_STORAGE_KEY = "miyabi:intro-seen";
export const STAGE_EVENT = "miyabi:stage";

/**
 * Script inline exécuté avant le premier rendu : évite tout flash de l'intro.
 * `data-intro` : play (intro à jouer) | skip | done. `lite` : appareils très modestes, effets réduits.
 */
export const stageBootScript = `(function(){var d=document.documentElement;d.classList.add('js');var m='skip';try{var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;var s=window.sessionStorage.getItem('${INTRO_STORAGE_KEY}');if(!r&&!s&&location.pathname==='/'){m='play'}var n=navigator;if((n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2)||(n.connection&&n.connection.saveData)){d.classList.add('lite')}}catch(e){}d.setAttribute('data-intro',m);})();`;

const root = () => document.documentElement;

/** Vrai tant qu'un écran (intro ou transition) couvre encore la page. */
export function isStageHeld() {
  if (typeof document === "undefined") return false;
  const { intro, transition } = root().dataset;
  return intro === "play" || transition === "cover";
}

export function isIntroPending() {
  return typeof document !== "undefined" && root().dataset.intro === "play";
}

/** Premier chargement du site, arrivé sans écran de transition : la page est déjà visible, on ne la cache pas. */
export function isDirectLoad() {
  return typeof document !== "undefined" && root().dataset.nav !== "client" && !isStageHeld();
}

export function isLite() {
  return typeof document !== "undefined" && root().classList.contains("lite");
}

/** Appelle `cb` quand la scène est découverte (immédiatement si rien ne la couvre). */
export function onStage(cb: () => void): () => void {
  if (!isStageHeld()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener(STAGE_EVENT, handler, { once: true });
  return () => window.removeEventListener(STAGE_EVENT, handler);
}

export function releaseStage() {
  window.dispatchEvent(new Event(STAGE_EVENT));
}

export function completeIntro() {
  try {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
  } catch {
    /* stockage indisponible : l'intro rejouera simplement */
  }
  root().dataset.intro = "done";
  releaseStage();
}
