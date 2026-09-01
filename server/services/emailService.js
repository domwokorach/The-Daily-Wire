import { Resend } from 'resend';
import { getEnv } from '../config/env.js';
import { confirmSubscriptionEmail } from '../emails/templates/ConfirmSubscription.js';
import { subscriptionWelcomeEmail } from '../emails/templates/SubscriptionWelcome.js';
import { dailyDigestEmail } from '../emails/templates/DailyDigest.js';
import { weeklyDigestEmail } from '../emails/templates/WeeklyDigest.js';
import { breakingNewsEmail } from '../emails/templates/BreakingNews.js';

let client;

function getClient() {
  if (!client) client = new Resend(getEnv().resendApiKey);
  return client;
}

/** Returns the Resend-assigned message id (or `null` if the send was
 * skipped/failed) so callers can log it for delivery tracking — never logs
 * the API key or full provider response, just the id. */
async function send({ to, subject, html }) {
  const env = getEnv();
  if (!env.resendApiKey) {
    console.error('[emailService] RESEND_API_KEY is not configured — email not sent.', { to, subject });
    return null;
  }
  const { data, error } = await getClient().emails.send({ from: env.emailFrom, to, subject, html });
  if (error) {
    console.error('[emailService] Resend send failed', error);
    return null;
  }
  return data?.id ?? null;
}

function manageUrl(token) {
  return `${getEnv().appOrigin}/subscription/manage?token=${token}`;
}

function unsubscribeUrl(token) {
  return `${getEnv().appOrigin}/subscription/unsubscribe?token=${token}`;
}

export async function sendVerificationEmail(email, token) {
  const url = `${getEnv().appOrigin}/verify-email?token=${token}`;
  await send({
    to: email,
    subject: 'Verify your email — The Daily Wire',
    html: `<p>Confirm your email address to finish setting up your account.</p><p><a href="${url}">Verify email</a></p>`,
  });
}

export async function sendPasswordResetEmail(email, token) {
  const url = `${getEnv().appOrigin}/reset-password?token=${token}`;
  await send({
    to: email,
    subject: 'Reset your password — The Daily Wire',
    html: `<p>Reset your password using the link below. This link expires in 30 minutes.</p><p><a href="${url}">Reset password</a></p>`,
  });
}

export async function sendEmailChangeVerification(newEmail, token) {
  const url = `${getEnv().appOrigin}/verify-email?token=${token}`;
  await send({
    to: newEmail,
    subject: 'Confirm your new email — The Daily Wire',
    html: `<p>Confirm this address to make it your new account email.</p><p><a href="${url}">Confirm new email</a></p>`,
  });
}

export async function sendSubscriptionConfirmation(email, confirmationToken) {
  const confirmUrl = `${getEnv().appOrigin}/subscription/confirm?token=${confirmationToken}`;
  return send({
    to: email,
    subject: 'Confirm your subscription',
    html: confirmSubscriptionEmail({ confirmUrl }),
  });
}

export async function sendSubscriptionWelcome(email, managementToken) {
  return send({
    to: email,
    subject: "You're subscribed — The Daily Wire",
    html: subscriptionWelcomeEmail({ manageUrl: manageUrl(managementToken), unsubscribeUrl: unsubscribeUrl(managementToken) }),
  });
}

export async function sendDailyDigest(email, { date, stories, managementToken }) {
  return send({
    to: email,
    subject: `UK News — Daily Briefing, ${date}`,
    html: dailyDigestEmail({ date, stories, manageUrl: manageUrl(managementToken), unsubscribeUrl: unsubscribeUrl(managementToken) }),
  });
}

export async function sendWeeklyDigest(email, { weekLabel, stories, managementToken }) {
  return send({
    to: email,
    subject: `UK News — Weekly Digest, ${weekLabel}`,
    html: weeklyDigestEmail({ weekLabel, stories, manageUrl: manageUrl(managementToken), unsubscribeUrl: unsubscribeUrl(managementToken) }),
  });
}

export async function sendBreakingNewsEmail(email, { headline, summary, url, managementToken }) {
  return send({
    to: email,
    subject: `Breaking: ${headline}`,
    html: breakingNewsEmail({ headline, summary, url, manageUrl: manageUrl(managementToken), unsubscribeUrl: unsubscribeUrl(managementToken) }),
  });
}
