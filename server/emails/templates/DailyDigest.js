import { wrapEmail, storyCard, footerLinks } from './layout.js';

export function dailyDigestEmail({ date, stories, manageUrl, unsubscribeUrl }) {
  const [topStory, ...rest] = stories;
  return wrapEmail({
    title: 'UK News — Daily Briefing',
    preheader: topStory?.headline ?? "Today's top UK and world stories.",
    bodyHtml: `
      <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#B8C2D1;">
        Daily Briefing · ${date}
      </p>
      <h1 style="margin:0 0 20px;font-size:20px;">UK News — Daily Briefing</h1>
      ${topStory ? storyCard(topStory) : ''}
      ${rest.map((story) => storyCard(story)).join('')}
      ${footerLinks({ manageUrl, unsubscribeUrl })}
    `,
  });
}
