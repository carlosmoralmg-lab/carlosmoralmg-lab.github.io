let deferredInstallPrompt = null;

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  if (!window.isSecureContext && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") {
    return;
  }

  navigator.serviceWorker.register("./service-worker.js").catch(() => {});
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
});

window.addEventListener("load", registerServiceWorker);

window.FasterLearnPWA = {
  getInstallPrompt() {
    return deferredInstallPrompt;
  }
};
