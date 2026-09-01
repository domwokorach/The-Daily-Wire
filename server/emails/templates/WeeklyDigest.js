import { wrapEmail, storyCard, footerLinks } from './layout.js';

export function weeklyDigestEmail({ weekLabel, stories, manageUrl, unsubscribeUrl }) {
  return wrapEmail({
    title: 'UK News — Weekly Digest',
    preheader: `The week's most important stories, ${weekLabel}.`,
    bodyHtml: `
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#B8C2D1;">
        Weekly Digest · ${weekLabel}
      </p>
      <h1 style="margin:0 0 20px;font-size:20px;">This week in UK news</h1>
      ${stories.map((story) => storyCard(story)).join('')}
      ${footerLinks({ manageUrl, unsubscribeUrl })}
    `,
  });
}
