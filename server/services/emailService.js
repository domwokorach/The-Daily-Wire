import { Resend } from 'resend';
import { getEnv } from '../config/env.js';

let client;

function getClient() {
  if (!client) client = new Resend(getEnv().resendApiKey);
  return client;
}

async function send({ to, subject, html }) {
  const env = getEnv();
  if (!env.resendApiKey) {
    console.error('[emailService] RESEND_API_KEY is not configured — email not sent.', { to, subject });
    return;
  }
  const { error } = await getClient().emails.send({ from: env.emailFrom, to, subject, html });
  if (error) console.error('[emailService] Resend send failed', error);
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
