export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered successfully scope:', reg.scope);

          // Handle service worker updates
          reg.onupdatefound = () => {
            const installingWorker = reg.installing;
            if (installingWorker == null) return;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[PWA] New version available! Reloading or notification ready.');
                } else {
                  console.log('[PWA] Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }
}

export function requestBackgroundSync(tag: string = 'sync-orders') {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'SyncManager' in window) {
    navigator.serviceWorker.ready
      .then((registration: any) => {
        return registration.sync.register(tag);
      })
      .then(() => {
        console.log(`[PWA] Background sync registered for tag: ${tag}`);
      })
      .catch((err) => {
        console.warn(`[PWA] Background sync registration failed for ${tag}:`, err);
      });
  }
}

export function setupPwaInstallListener(onPromptAvailable: (event: BeforeInstallPromptEvent) => void) {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    onPromptAvailable(e as BeforeInstallPromptEvent);
  });
}

export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
