import { useEffect, useRef, useState } from 'react';
import { getBreakingNews } from '@/features/news/services/newsService';
import { buildArticlePath } from '@/config/routes';
import { BREAKING_STREAM_URL, type BreakingAlert } from '../services/notificationService';

const SHOWN_IDS_KEY = 'dw:breaking-alerts:shown';
const POLL_INTERVAL_MS = 60 * 1000;

function loadShownIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SHOWN_IDS_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function rememberShownId(id: string, shown: Set<string>) {
  shown.add(id);
  try {
    sessionStorage.setItem(SHOWN_IDS_KEY, JSON.stringify([...shown]));
  } catch {
    // sessionStorage unavailable (private mode, etc.) — dedupe stays in-memory only
  }
}

/** Low-latency popup alerts for newly-published breaking stories, distinct
 * from the persistent `useBreakingNews()` header ticker. Prefers SSE, falls
 * back to polling if the stream can't connect, and never re-shows an alert
 * already surfaced this session. */
export function useBreakingAlerts() {
  const [alert, setAlert] = useState<BreakingAlert | null>(null);
  const shownIds = useRef<Set<string>>(loadShownIds());

  useEffect(() => {
    const surface = (candidate: BreakingAlert) => {
      if (shownIds.current.has(candidate.id)) return;
      rememberShownId(candidate.id, shownIds.current);
      setAlert(candidate);
    };

    let pollTimer: ReturnType<typeof setInterval> | undefined;
    const startPolling = () => {
      if (pollTimer) return;
      pollTimer = setInterval(async () => {
        try {
          const articles = await getBreakingNews();
          const top = articles[0];
          if (top?.breaking) {
            surface({
              id: top.id,
              headline: top.headline,
              summary: top.summary,
              category: top.category ?? 'general',
              url: buildArticlePath(top.id),
              timestamp: top.timestamp ?? new Date().toISOString(),
            });
          }
        } catch {
          // best-effort fallback — a failed poll just waits for the next tick
        }
      }, POLL_INTERVAL_MS);
    };

    if (typeof EventSource === 'undefined') {
      startPolling();
      return () => clearInterval(pollTimer);
    }

    const source = new EventSource(BREAKING_STREAM_URL, { withCredentials: true });
    source.onmessage = (event) => {
      try {
        surface(JSON.parse(event.data) as BreakingAlert);
      } catch {
        // malformed event — ignore
      }
    };
    source.onerror = () => {
      source.close();
      startPolling();
    };

    return () => {
      source.close();
      clearInterval(pollTimer);
    };
  }, []);

  return { alert, dismiss: () => setAlert(null) };
}
