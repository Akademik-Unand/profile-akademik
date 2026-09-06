import { useLayoutEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AOS_CONFIG } from './motion';

let aosReady = false;

export function initAos() {
  if (typeof window === 'undefined') return;
  if (aosReady) {
    AOS.refresh();
    return;
  }
  AOS.init(AOS_CONFIG);
  aosReady = true;
}

export function refreshAos() {
  if (typeof window === 'undefined' || !aosReady) return;
  AOS.refresh();
}

export function refreshAosHard() {
  if (typeof window === 'undefined') return;
  initAos();
  if (typeof AOS.refreshHard === 'function') AOS.refreshHard();
  else AOS.refresh();
}

/**
 * Init + refreshHard setelah paint, saat revision (rute / isi builder) berubah.
 */
export function useAosRefresh(revision) {
  useLayoutEffect(() => {
    initAos();
    const frame = window.requestAnimationFrame(() => refreshAosHard());
    return () => window.cancelAnimationFrame(frame);
  }, [revision]);
}
