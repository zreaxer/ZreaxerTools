
import { useEffect, useState } from "react";
import "./OfflineStatus.css";

export default function OfflineStatus() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [connectionRestored, setConnectionRestored] = useState(false);

  useEffect(() => {
    let restoreTimer: number | undefined;

    const handleOffline = () => {
      setIsOffline(true);
      setConnectionRestored(false);

      if (restoreTimer) {
        window.clearTimeout(restoreTimer);
      }
    };

    const handleOnline = () => {
      setIsOffline(false);
      setConnectionRestored(true);

      if (restoreTimer) {
        window.clearTimeout(restoreTimer);
      }

      restoreTimer = window.setTimeout(() => {
        setConnectionRestored(false);
      }, 3500);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);

      if (restoreTimer) {
        window.clearTimeout(restoreTimer);
      }
    };
  }, []);

  if (!isOffline && !connectionRestored) {
    return null;
  }

  return (
    <div
      className={`connection-notice ${
        isOffline ? "connection-offline" : "connection-online"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="connection-indicator">
        {isOffline ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 8.5a15.5 15.5 0 0 1 20 0" />
            <path d="M5 12a10.5 10.5 0 0 1 14 0" />
            <path d="M8.5 15.5a5.5 5.5 0 0 1 7 0" />
            <path d="M12 20h.01" />
            <path d="m3 3 18 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 7 10 17l-5-5" />
          </svg>
        )}
      </span>

      <span className="connection-message">
        {isOffline
          ? "İnternet bağlantısı yok. Önbellekteki özellikler kullanılabilir."
          : "İnternet bağlantısı yeniden sağlandı."}
      </span>
    </div>
  );
}
