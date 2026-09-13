"use client";

import { useSyncExternalStore } from "react";
import { WifiOff } from "lucide-react";

function subscribe(onChange: () => void) {
  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
  };
}

/**
 * A quiet bar, not a modal: offline reading of saved pages is a supported
 * state, not an error. Server snapshot is "online" so nothing flashes.
 */
export function OfflineIndicator() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );
  if (online) return null;
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 bg-foreground px-4 py-2 text-center text-xs text-background"
    >
      <WifiOff className="size-3.5" aria-hidden />
      オフラインです。一度開いたページは引き続き読めます。
    </div>
  );
}
