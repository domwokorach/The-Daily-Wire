// Comment *reads* (including the SSE stream) are intentionally public — the
// stream route uses `optionalAuth`, never `requireAuth`. This file exists so
// that stays a deliberate, documented decision rather than an implicit one:
//
//   - A connected client's identity (if any) is never used to authorize a
//     comment mutation. `comment.created`/`updated`/`deleted` events are
//     broadcast to every subscriber of an article's channel regardless of
//     who they are.
//   - Every create/update/delete still goes through `requireAuth` /
//     `requireCommentOwner` on the plain REST endpoints
//     (`server/api/comments/*.js`) before it ever reaches
//     `realtime/channels.js#publishToArticle`. The realtime layer only ever
//     fans out what the REST layer already authorized — it performs no
//     authorization decisions of its own.
export const REALTIME_READS_ARE_PUBLIC = true;
