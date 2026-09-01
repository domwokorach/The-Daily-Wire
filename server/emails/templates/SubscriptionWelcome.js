import { wrapEmail, footerLinks } from './layout.js';

export function subscriptionWelcomeEmail({ manageUrl, unsubscribeUrl }) {
  return wrapEmail({
    title: "You're subscribed",
    preheader: 'Your news preferences have been saved.',
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:22px;">You're subscribed.</h1>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#B8C2D1;">
        Your news preferences have been saved. You can change what you receive, or unsubscribe, at any time.
      </p>
      ${footerLinks({ manageUrl, unsubscribeUrl })}
    `,
  });
}
