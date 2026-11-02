
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./PWAInstallButton.css";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isAppInstalled() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function PWAInstallButton() {
  const location = useLocation();

  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installed, setInstalled] = useState(false);

  const isIOS = isIOSDevice();

  useEffect(() => {
    setInstalled(isAppInstalled());

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();

      setInstallPrompt(event as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstall
    );

    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstall
      );

      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (location.pathname !== "/" || installed) {
    return null;
  }

  if (!installPrompt && !isIOS) {
    return null;
  }

  const handleInstall = async () => {
    if (isIOS) {
      setShowIOSInstructions(true);
      return;
    }

    if (!installPrompt) return;

    try {
      await installPrompt.prompt();

      const result = await installPrompt.userChoice;

      if (result.outcome === "accepted") {
        setInstalled(true);
      }

      setInstallPrompt(null);
    } catch (error) {
      console.error("Uygulama yükleme hatası:", error);
    }
  };

  return (
    <>
      <button
        className="pwa-install-button"
        onClick={handleInstall}
        type="button"
        aria-label="ZreaxerTools uygulamasını yükle"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M12 7v8" />
          <path d="m9 12 3 3 3-3" />
        </svg>

        <span>Uygulamayı Yükle</span>
      </button>

      {showIOSInstructions && (
        <div
          className="pwa-modal-overlay"
          onClick={() => setShowIOSInstructions(false)}
        >
          <div
            className="pwa-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pwa-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="pwa-modal-close"
              onClick={() => setShowIOSInstructions(false)}
              aria-label="Pencereyi kapat"
              type="button"
            >
              ×
            </button>

            <div className="pwa-modal-icon">
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M12 7v8" />
                <path d="m9 12 3 3 3-3" />
              </svg>
            </div>

            <h2 id="pwa-modal-title">
              ZreaxerTools'u yükle
            </h2>

            <p>
              ZreaxerTools'u ana ekranına ekleyerek uygulama
              gibi kullanabilirsin.
            </p>

            <div className="pwa-ios-step">
              <span>1</span>
              <p>
                Safari tarayıcısının alt kısmındaki
                <strong> Paylaş </strong>
                simgesine dokun.
              </p>
            </div>

            <div className="pwa-ios-step">
              <span>2</span>
              <p>
                Açılan menüden
                <strong> Ana Ekrana Ekle </strong>
                seçeneğini seç.
              </p>
            </div>

            <div className="pwa-ios-step">
              <span>3</span>
              <p>
                Sağ üstteki
                <strong> Ekle </strong>
                seçeneğine dokun.
              </p>
            </div>

            <button
              className="pwa-modal-confirm"
              onClick={() => setShowIOSInstructions(false)}
              type="button"
            >
              Anladım
            </button>
          </div>
        </div>
      )}
    </>
  );
}
