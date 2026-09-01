import { wrapEmail, button } from './layout.js';

export function breakingNewsEmail({ headline, summary, url, manageUrl, unsubscribeUrl }) {
  return wrapEmail({
    title: `Breaking: ${headline}`,
    preheader: summary ?? headline,
    bodyHtml: `
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#9C3B3B;">
        Breaking News
      </p>
      <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;">${headline}</h1>
      ${summary ? `<p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#B8C2D1;">${summary}</p>` : ''}
      ${button(url, 'Read Story')}
      <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#8896AA;">
        You are receiving this because Breaking News alerts are enabled.
        <a href="${manageUrl}" style="color:#8896AA;">Manage alerts</a> ·
        <a href="${unsubscribeUrl}" style="color:#8896AA;">Unsubscribe</a>
      </p>
    `,
  });
}
