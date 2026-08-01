"use client";

import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

/** Enregistre le service worker + bannière « hors-ligne ». */
export function PwaClient() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((e) => console.warn("SW register failed", e));
    }
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    setOffline(!navigator.onLine);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;
  return (
    <div className="fixed top-14 left-0 right-0 z-[60] bg-[#ffc500] text-black text-[13px] font-bold px-4 py-2 flex items-center justify-center gap-2 shadow-lg">
      <WifiOff className="w-4 h-4" />
      Mode hors-ligne — lecture depuis le cache local.
    </div>
  );
}
