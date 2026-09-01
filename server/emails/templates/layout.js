// Plain HTML-string templates — this app has no React Email / JSX-to-HTML
// render pipeline (the server runs as plain ESM Node, no JSX transform), so
// these mirror the existing `emailService.js` convention of hand-written
// inline-styled HTML rather than introducing a new rendering stack.

const COLORS = {
  background: '#071426',
  surface: '#101F3A',
  surfaceAlt: '#132642',
  text: '#F7F8FA',
  textSecondary: '#B8C2D1',
  gold: '#C9A86A',
};

export function wrapEmail({ preheader = '', title, bodyHtml }) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.background};font-family:Georgia,'Times New Roman',serif;">
    <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.background};padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background-color:${COLORS.surface};border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px 8px;">
                <p style="margin:0;color:${COLORS.gold};font-size:12px;letter-spacing:0.14em;text-transform:uppercase;font-family:Arial,sans-serif;">
                  The Daily Wire
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 32px;color:${COLORS.text};">
                ${bodyHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function button(url, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;">
    <tr>
      <td style="border-radius:4px;background-color:${COLORS.gold};">
        <a href="${url}" style="display:inline-block;padding:12px 28px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;color:${COLORS.background};text-decoration:none;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;
}

export function footerLinks({ manageUrl, unsubscribeUrl }) {
  return `<p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:12px;color:${COLORS.textSecondary};">
    ${manageUrl ? `<a href="${manageUrl}" style="color:${COLORS.textSecondary};">Manage preferences</a> &nbsp;·&nbsp; ` : ''}
    <a href="${unsubscribeUrl}" style="color:${COLORS.textSecondary};">Unsubscribe</a>
  </p>`;
}

export function storyCard(story) {
  const image = story.image
    ? `<img src="${story.image}" width="496" alt="${story.headline}" style="width:100%;max-width:496px;aspect-ratio:16/9;object-fit:cover;border-radius:4px;display:block;margin:10px 0;" />`
    : '';
  return `<div style="margin:0 0 22px;padding-bottom:22px;border-bottom:1px solid rgba(255,255,255,0.1);">
    ${story.sectionLabel ? `<p style="margin:0;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:${COLORS.gold};">${story.sectionLabel}</p>` : ''}
    <p style="margin:6px 0 0;font-size:18px;line-height:1.35;font-weight:bold;">
      <a href="${story.url}" style="color:${COLORS.text};text-decoration:none;">${story.headline}</a>
    </p>
    ${image}
    ${story.summary ? `<p style="margin:8px 0 0;font-family:Arial,sans-serif;font-size:13px;line-height:1.5;color:${COLORS.textSecondary};">${story.summary}</p>` : ''}
  </div>`;
}

export { COLORS };
