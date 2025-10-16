// src/services/offlineSync.ts

export type SyncAction = {
  key: string;                 // e.g. 'vote' or 'issue'
  data: any;
  url: string;
  method?: string;
};

export function saveOffline(action: SyncAction) {
  const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
  queue.push(action);
  localStorage.setItem("offlineQueue", JSON.stringify(queue));
}

export async function trySync() {
  if (!navigator.onLine) return;
  const queue = JSON.parse(localStorage.getItem("offlineQueue") || "[]");
  const stillPending: SyncAction[] = [];
  for (const action of queue) {
    try {
      await fetch(action.url, {
        method: action.method || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action.data),
      });
    } catch {
      stillPending.push(action);
    }
  }
  localStorage.setItem("offlineQueue", JSON.stringify(stillPending));
}

// Listen for connection restore to sync automatically
window.addEventListener('online', trySync);
