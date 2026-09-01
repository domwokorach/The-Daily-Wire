import { wrapEmail, button } from './layout.js';

export function confirmSubscriptionEmail({ confirmUrl }) {
  return wrapEmail({
    title: 'Confirm your subscription',
    preheader: "You're almost there — confirm your email to start receiving updates.",
    bodyHtml: `
      <h1 style="margin:0 0 12px;font-size:22px;">You're almost there.</h1>
      <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#B8C2D1;">
        Confirm your email address to start receiving your selected news updates.
      </p>
      ${button(confirmUrl, 'Confirm Subscription')}
      <p style="margin:20px 0 0;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#8896AA;">
        If you did not request this subscription, you can ignore this email — you won't be signed up for anything.
      </p>
    `,
  });
}
