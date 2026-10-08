"use client";

import { useState, useSyncExternalStore } from "react";
import { notifications } from "@/data/notifications";

const STORAGE_KEY = "hidden-kice:read-notifications";
const CHANGE_EVENT = "hidden-kice:notifications-changed";

function subscribe(notify: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) notify();
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot() {
  return "[]";
}

function parseReadIds(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function useNotifications() {
  const persisted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [sessionReadIds, setSessionReadIds] = useState<readonly string[]>([]);
  const readIds = new Set([...parseReadIds(persisted), ...sessionReadIds]);
  const items = notifications.map((notification) => ({
    ...notification,
    isRead: readIds.has(notification.id),
  }));

  function markAsRead(ids: readonly string[]) {
    const next = [...new Set([...parseReadIds(getSnapshot()), ...sessionReadIds, ...ids])];
    // Keep the visible read state even when browser storage is unavailable.
    setSessionReadIds(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      window.dispatchEvent(new Event(CHANGE_EVENT));
    } catch {
      // Session state above remains available in storage-restricted browsers.
    }
  }

  return {
    items,
    unreadCount: items.filter((item) => !item.isRead).length,
    markAllAsRead: () => markAsRead(items.map((item) => item.id)),
  };
}
