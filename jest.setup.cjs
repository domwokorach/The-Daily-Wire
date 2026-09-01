require("@testing-library/jest-dom");
require("dotenv/config");

// jsdom's test environment doesn't provide these globals; the `resend` SDK
// (pulled in transitively by server-side auth tests) needs them at import time.
const { TextEncoder, TextDecoder } = require("node:util");
if (typeof globalThis.TextEncoder === "undefined") globalThis.TextEncoder = TextEncoder;
if (typeof globalThis.TextDecoder === "undefined") globalThis.TextDecoder = TextDecoder;
