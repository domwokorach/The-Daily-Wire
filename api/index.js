import { buildApp } from '../server/app.js';

let appPromise;

export default async function handler(req, res) {
  if (!appPromise) appPromise = buildApp();
  const app = await appPromise;
  app(req, res);
}
