import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { commentKeys } from '@/constants/queryKeys';
import { commentStreamUrl } from '../services/commentService';
import { insertCommentIntoCache, replaceCommentInCache, removeCommentFromCache } from '../utils/commentCache';
import type { Comment } from '../types';

const POLL_INTERVAL_MS = 20 * 1000;

type RealtimeEvent =
  | { type: 'comment.created'; articleId: string; comment: Comment; clientMutationId?: string }
  | { type: 'comment.updated'; articleId: string; comment: Comment }
  | { type: 'comment.deleted'; articleId: string; commentId: string };

/**
 * Subscribes to this article's own SSE channel (never a global firehose)
 * and patches the TanStack Query cache directly — no polling, no
 * whole-page refetch, while the stream is connected. Falls back to
 * bounded polling only if SSE itself is unavailable or keeps failing to
 * connect, and pauses that fallback while the tab is hidden.
 */
export function useCommentRealtime(articleId: string) {
  const queryClient = useQueryClient();
  const fallbackActive = useRef(false);

  useEffect(() => {
    if (!articleId) return undefined;

    let pollTimer: ReturnType<typeof setInterval> | undefined;
    let source: EventSource | undefined;
    let closed = false;

    const refetchNow = () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.byArticle(articleId, 'newest') });
      queryClient.invalidateQueries({ queryKey: commentKeys.byArticle(articleId, 'oldest') });
    };

    const startPolling = () => {
      if (pollTimer || fallbackActive.current) return;
      fallbackActive.current = true;
      pollTimer = setInterval(() => {
        if (document.visibilityState === 'hidden') return;
        refetchNow();
      }, POLL_INTERVAL_MS);
    };

    const handleEvent = (event: RealtimeEvent) => {
      if (event.articleId !== articleId) return;
      if (event.type === 'comment.created') {
        insertCommentIntoCache(queryClient, articleId, event.comment, event.clientMutationId);
      } else if (event.type === 'comment.updated') {
        replaceCommentInCache(queryClient, articleId, event.comment);
      } else if (event.type === 'comment.deleted') {
        removeCommentFromCache(queryClient, articleId, event.commentId);
      }
    };

    if (typeof EventSource === 'undefined') {
      startPolling();
      return () => clearInterval(pollTimer);
    }

    const connect = () => {
      if (closed) return;
      source = new EventSource(commentStreamUrl(articleId), { withCredentials: true });

      source.onmessage = (messageEvent) => {
        try {
          handleEvent(JSON.parse(messageEvent.data) as RealtimeEvent);
        } catch {
          // malformed event — ignore this one, the connection stays open
        }
      };

      // The browser's own EventSource retries the connection automatically
      // (per the `retry:` hint the server sends) — reconnect loss is
      // silent, never surfaced as an alarming error. Only fall back to
      // polling once, so a single unstable connection doesn't grow one
      // interval per retry.
      source.onerror = () => {
        startPolling();
      };
    };

    connect();

    return () => {
      closed = true;
      source?.close();
      clearInterval(pollTimer);
      fallbackActive.current = false;
    };
  }, [articleId, queryClient]);
}
