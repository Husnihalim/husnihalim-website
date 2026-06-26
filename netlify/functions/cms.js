// Netlify Serverless Function - Multi-Site CMS API v2
// Full CMS with media library, text styling, section backgrounds, theme control
// Supports multiple sites: vac (default) and husni
// Uses Netlify Blobs for persistent storage

const crypto = require('crypto');

// Admin credentials from environment variables (set in Netlify dashboard)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
  console.error('CMS ERROR: ADMIN_USERNAME, ADMIN_PASSWORD, and JWT_SECRET must be set in Netlify environment variables');
}

// Rate limiting for login attempts
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);
  if (!record) return true;
  if (now - record.windowStart > LOGIN_WINDOW_MS) {
    loginAttempts.delete(ip);
    return true;
  }
  return record.attempts < MAX_LOGIN_ATTEMPTS;
}

function recordLoginAttempt(ip, success) {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, windowStart: now };
  if (now - record.windowStart > LOGIN_WINDOW_MS) {
    record.attempts = 0;
    record.windowStart = now;
  }
  if (!success) record.attempts++;
  else loginAttempts.delete(ip);
  loginAttempts.set(ip, record);
}

function getClientIp(event) {
  return event.headers['x-nf-client-connection-ip']
    || event.headers['x-forwarded-for']
    || event.headers['client-ip']
    || 'unknown';
}

// Valid site identifiers
const VALID_SITES = ['vac', 'husni'];
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const MAILERLITE_CONTACT_GROUP_ID = process.env.MAILERLITE_CONTACT_GROUP_ID || '182444406325904847';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL || 'admin@visiarmada.com';
const CONTACT_CC_EMAILS = Array.from(new Set([
 ...(process.env.CONTACT_CC_EMAILS || '').split(','),
 'admin@visiarmada.com',
]
 .map((email) => email.trim())
 .filter(Boolean)));
const CONTACT_FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'noreply@husnihalim.com';
const CONTACT_REPLY_TO_EMAIL = process.env.CONTACT_REPLY_TO_EMAIL || CONTACT_NOTIFICATION_EMAIL;

// Proper HMAC-SHA256 JWT (no npm dependencies)
function base64url(str) {
  return Buffer.from(str).toString('base64url');
}

function base64urlFromBuffer(buf) {
  return buf.toString('base64url');
}

function createToken(payload) {
  if (!JWT_SECRET) return null;
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify({ ...payload, exp: Date.now() + 86400000 }));
  const signature = base64urlFromBuffer(
    crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + body).digest()
  );
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  if (!JWT_SECRET) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const expectedSig = base64urlFromBuffer(
      crypto.createHmac('sha256', JWT_SECRET).update(header + '.' + body).digest()
    );
    if (signature !== expectedSig) return null;
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function getAuth(event) {
 const authHeader = event.headers.authorization || event.headers.Authorization || '';
 const token = authHeader.replace('Bearer ', '');
 return verifyToken(token);
}

function cleanString(value) {
 return typeof value === 'string' ? value.trim() : '';
}

function isLikelyBotSubmission(submission) {
 const honeypot = cleanString(submission['bot-field'] || submission.botField);
 if (honeypot) return true;

 const startedAt = Number(submission['form-started-at'] || submission.formStartedAt || 0);
 if (!startedAt) return true;

 const elapsed = Date.now() - startedAt;
 if (elapsed < 3000) return true;

 return hasBotTextPattern(submission.name) || hasBotTextPattern(submission.company);
}

function hasBotTextPattern(value) {
 const text = cleanString(value);
 if (text.length < 12) return false;

 const lettersOnly = text.replace(/[^a-z]/gi, '');
 if (lettersOnly.length < 12) return false;

 const uppercaseCount = (lettersOnly.match(/[A-Z]/g) || []).length;
 const lowercaseCount = (lettersOnly.match(/[a-z]/g) || []).length;
 const hasNormalSeparator = /[\s.'&-]/.test(text);
 const hasCommonNamePart = /(sdn|bhd|plt|enterprise|resources|trading|services|manufacturing|bin|binti|mohd|muhammad|ahmad|abdul|siti|nur|lee|lim|tan|wong|aziz|rahman|husni)/i.test(text);
 const randomCamelCase = uppercaseCount >= 4 && lowercaseCount >= 6 && !hasNormalSeparator && !hasCommonNamePart;

 const vowelCount = (lettersOnly.match(/[aeiou]/gi) || []).length;
 const vowelRatio = vowelCount / lettersOnly.length;
 const lowVowelLongToken = lettersOnly.length >= 16 && vowelRatio < 0.22 && !hasCommonNamePart;

 return randomCamelCase || lowVowelLongToken;
}

async function addContactToMailerLite(submission) {
 if (!MAILERLITE_API_KEY || !submission.email) return;

 const nameParts = cleanString(submission.name).split(/\s+/).filter(Boolean);
 const firstName = nameParts.shift() || '';
 const lastName = nameParts.join(' ');
 const fields = {
 name: firstName,
 last_name: lastName,
 company: cleanString(submission.company),
 };

 Object.keys(fields).forEach((key) => {
 if (!fields[key]) delete fields[key];
 });

 const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 Accept: 'application/json',
 Authorization: `Bearer ${MAILERLITE_API_KEY}`,
 },
 body: JSON.stringify({
 email: cleanString(submission.email).toLowerCase(),
 fields,
 groups: [MAILERLITE_CONTACT_GROUP_ID],
 status: 'active',
 }),
 });

 if (!response.ok) {
 const message = await response.text();
 console.error('MailerLite contact sync failed:', message);
 }
}

function escapeHtml(value) {
 return cleanString(value)
 .replace(/&/g, '&amp;')
 .replace(/</g, '&lt;')
 .replace(/>/g, '&gt;')
 .replace(/"/g, '&quot;')
 .replace(/'/g, '&#039;');
}

async function sendResendEmail({ to, cc, replyTo, subject, html }) {
 if (!RESEND_API_KEY) {
 throw new Error('RESEND_API_KEY is not configured');
 }

 const response = await fetch('https://api.resend.com/emails', {
 method: 'POST',
 headers: {
 Authorization: `Bearer ${RESEND_API_KEY}`,
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({
 from: `Husni Halim Website <${CONTACT_FROM_EMAIL}>`,
 to: Array.isArray(to) ? to : [to],
 cc,
 reply_to: replyTo || undefined,
 subject,
 html,
 }),
 });

 if (!response.ok) {
 const messageText = await response.text();
 throw new Error(`Resend email failed: ${messageText}`);
 }
}

async function sendContactNotification(submission) {
 const subjectName = cleanString(submission.name) || 'Website visitor';
 const name = escapeHtml(submission.name) || 'Website visitor';
 const email = cleanString(submission.email).toLowerCase();
 const safeEmail = escapeHtml(email);
 const company = escapeHtml(submission.company) || '-';
 const interest = escapeHtml(submission.interest) || '-';
 const message = escapeHtml(submission.message) || '-';
 const submittedAt = new Date(submission.timestamp).toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });

 await sendResendEmail({
 to: CONTACT_NOTIFICATION_EMAIL,
 cc: CONTACT_CC_EMAILS,
 replyTo: email,
 subject: `New website enquiry: ${subjectName}`,
 html: `<!doctype html>
<html>
<body style="font-family:Arial,sans-serif;background:#f6f7f9;margin:0;padding:24px;color:#111827;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:10px;padding:28px;border:1px solid #e5e7eb;">
    <h2 style="margin:0 0 18px;color:#111827;">New website enquiry</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:8px 0;color:#6b7280;width:120px;">Name</td><td style="padding:8px 0;"><strong>${name}</strong></td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Company</td><td style="padding:8px 0;">${company}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Interest</td><td style="padding:8px 0;">${interest}</td></tr>
      <tr><td style="padding:8px 0;color:#6b7280;">Submitted</td><td style="padding:8px 0;">${submittedAt} (KL)</td></tr>
    </table>
    <div style="margin-top:18px;padding:16px;background:#f9fafb;border-radius:8px;white-space:pre-wrap;line-height:1.5;">${message}</div>
  </div>
</body>
</html>`,
 });
}

async function sendContactAutoReply(submission) {
 const email = cleanString(submission.email).toLowerCase();
 if (!email) return;

 const name = escapeHtml(submission.name) || 'there';
 const interest = escapeHtml(submission.interest) || 'your enquiry';
 const company = escapeHtml(submission.company);

 await sendResendEmail({
 to: email,
 replyTo: CONTACT_REPLY_TO_EMAIL,
 subject: 'I received your enquiry - Husni Halim',
 html: `<!doctype html>
<html>
<body style="font-family:Arial,sans-serif;background:#f6f7f9;margin:0;padding:24px;color:#111827;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:10px;padding:28px;border:1px solid #e5e7eb;">
    <h2 style="margin:0 0 12px;color:#111827;">Thanks for reaching out</h2>
    <p style="line-height:1.6;margin:0 0 14px;">Hi ${name},</p>
    <p style="line-height:1.6;margin:0 0 14px;">I received your enquiry${company ? ` from <strong>${company}</strong>` : ''} about <strong>${interest}</strong>.</p>
    <p style="line-height:1.6;margin:0 0 14px;">I will review the details and reply personally within 1 business day. If the matter is urgent, you can reply to this email or WhatsApp me at <a href="https://wa.me/60165241901" style="color:#8b2252;">+60165241901</a>.</p>
    <p style="line-height:1.6;margin:20px 0 0;">Regards,<br><strong>Husni Halim</strong><br>Principal Consultant, Visi Armada Consulting</p>
  </div>
</body>
</html>`,
 });
}

async function sendContactEmails(submission) {
 await Promise.all([
 sendContactNotification(submission),
 sendContactAutoReply(submission),
 ]);
}

// Get site from query params or body, default to 'vac'
function getSiteId(event) {
 const params = event.queryStringParameters || {};
 if (params.site && VALID_SITES.includes(params.site)) {
 return params.site;
 }
 try {
 if (event.body) {
 const body = JSON.parse(event.body);
 if (body.site && VALID_SITES.includes(body.site)) {
 return body.site;
 }
 }
 } catch {}
 return 'vac';
}

// ---- Blob Store Helpers ----
let contentStores = { vac: {}, husni: {} };
let submissionsStores = { vac: [], husni: [] };
let mediaStores = { vac: {}, husni: {} };
let mediaIndexes = { vac: [], husni: [] };

async function getStore(name) {
 try {
 const { getStore } = await import('@netlify/blobs');
 return getStore(name);
 } catch {
 return null;
 }
}

async function getData(storeName, siteId) {
 const fullStoreName = siteId === 'vac' ? storeName : `${siteId}_${storeName}`;
 const store = await getStore(fullStoreName);
 if (store) {
 try {
 const data = await store.get('data', { type: 'json' });
 return data || (storeName === 'submissions' ? [] : {});
 } catch {
 return storeName === 'submissions' ? [] : {};
 }
 }
 if (storeName === 'submissions') {
 return submissionsStores[siteId] || [];
 }
 return contentStores[siteId] || {};
}

async function setData(storeName, data, siteId) {
 const fullStoreName = siteId === 'vac' ? storeName : `${siteId}_${storeName}`;
 const store = await getStore(fullStoreName);
 if (store) {
 await store.setJSON('data', data);
 } else {
 if (storeName === 'submissions') {
 submissionsStores[siteId] = data;
 } else {
 contentStores[siteId] = data;
 }
 }
}

// ---- Media Store Helpers ----
async function getMediaStore(siteId) {
 const name = siteId === 'vac' ? 'media' : `${siteId}_media`;
 return await getStore(name);
}

async function getMediaIndex(siteId) {
 const store = await getMediaStore(siteId);
 if (store) {
 try {
 const idx = await store.get('_index', { type: 'json' });
 return idx || [];
 } catch {
 return [];
 }
 }
 return mediaIndexes[siteId] || [];
}

async function setMediaIndex(siteId, index) {
 const store = await getMediaStore(siteId);
 if (store) {
 await store.setJSON('_index', index);
 } else {
 mediaIndexes[siteId] = index;
 }
}

// ---- Deep Merge Utility ----
function deepMerge(target, source) {
 const result = { ...target };
 for (const key of Object.keys(source)) {
 if (
 source[key] &&
 typeof source[key] === 'object' &&
 !Array.isArray(source[key]) &&
 target[key] &&
 typeof target[key] === 'object' &&
 !Array.isArray(target[key])
 ) {
 result[key] = deepMerge(target[key], source[key]);
 } else {
 result[key] = source[key];
 }
 }
 return result;
}

// ---- Content Format Migration ----
function migrateContentV1toV2(data) {
 if (!data || data._version === 2) return data;
 // If it already has nested structure keys, return as-is
 if (data.content && typeof data.content === 'object') return { _version: 2, ...data };

 // Migrate flat key-value to v2 nested format
 const migrated = {
 _version: 2,
 content: {},
 images: {},
 sections: {},
 theme: {},
 };
 Object.keys(data).forEach((key) => {
 if (key === '_version') return;
 migrated.content[key] = { text: data[key], styles: {} };
 });
 return migrated;
}

exports.handler = async (event) => {
 const headers = {
 'Access-Control-Allow-Origin': '*',
 'Access-Control-Allow-Headers': 'Content-Type, Authorization',
 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
 'Content-Type': 'application/json',
 };

 // Handle CORS preflight
 if (event.httpMethod === 'OPTIONS') {
 return { statusCode: 204, headers };
 }

 const path = event.path.replace('/.netlify/functions/cms', '').replace('/api/cms', '');
 const siteId = getSiteId(event);

 try {
  // ==== LOGIN (shared across all sites) ====
  if (path === '/login' && event.httpMethod === 'POST') {
  const clientIp = getClientIp(event);
  if (!checkRateLimit(clientIp)) {
  return {
  statusCode: 429,
  headers,
  body: JSON.stringify({ success: false, error: 'Too many login attempts. Try again in 15 minutes.' }),
  };
  }
  const { username, password } = JSON.parse(event.body);
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
  recordLoginAttempt(clientIp, true);
  const token = createToken({ role: 'admin' });
  if (!token) {
  return {
  statusCode: 500,
  headers,
  body: JSON.stringify({ success: false, error: 'Server configuration error: JWT_SECRET not set.' }),
  };
  }
  return {
  statusCode: 200,
  headers,
  body: JSON.stringify({ success: true, token }),
  };
  }
  recordLoginAttempt(clientIp, false);
  return {
  statusCode: 401,
  headers,
  body: JSON.stringify({ success: false, error: 'Invalid credentials' }),
  };
  }

 // ==== GET CONTENT (public - used by main sites) ====
 if (path === '/content' && event.httpMethod === 'GET') {
 let content = await getData('content', siteId);
 // Auto-migrate v1 flat format to v2
 content = migrateContentV1toV2(content);
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify(content),
 };
 }

 // ==== SAVE CONTENT (admin only - deep merge) ====
 if (path === '/content' && event.httpMethod === 'PUT') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 const body = JSON.parse(event.body);
 const updates = body.content || body;
 const targetSite = body.site && VALID_SITES.includes(body.site) ? body.site : siteId;
 let content = await getData('content', targetSite);
 // Migrate if needed
 content = migrateContentV1toV2(content);
 // Deep merge updates
 content = deepMerge(content, updates);
 content._version = 2;
 await setData('content', content, targetSite);
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({ success: true, content }),
 };
 }

 // ==== RESET CONTENT (admin only) ====
 if (path === '/content/reset' && event.httpMethod === 'POST') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 const body = JSON.parse(event.body || '{}');
 const field = body.field;
 const section = body.section; // e.g. 'content', 'theme', 'sections', 'images'
 const targetSite = body.site && VALID_SITES.includes(body.site) ? body.site : siteId;
 let content = await getData('content', targetSite);
 content = migrateContentV1toV2(content);

 if (field && section && content[section]) {
 delete content[section][field];
 } else if (field && content.content) {
 delete content.content[field];
 } else {
 // Reset all
 content = { _version: 2, content: {}, images: {}, sections: {}, theme: {} };
 }
 await setData('content', content, targetSite);
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({ success: true, content }),
 };
 }

 // ==== GET THEME (public - used by frontend) ====
 if (path === '/theme' && event.httpMethod === 'GET') {
 let content = await getData('content', siteId);
 content = migrateContentV1toV2(content);
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify(content.theme || {}),
 };
 }

 // ==== MEDIA UPLOAD (admin only) ====
 if (path === '/media/upload' && event.httpMethod === 'POST') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 const body = JSON.parse(event.body);
 const { filename, mimeType, data: imageData, alt } = body;
 const targetSite = body.site && VALID_SITES.includes(body.site) ? body.site : siteId;

 if (!imageData || !filename) {
 return {
 statusCode: 400,
 headers,
 body: JSON.stringify({ error: 'Missing required fields: filename, data' }),
 };
 }

 // Generate unique ID
 const id = 'img_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);

 // Store image data in blob
 const store = await getMediaStore(targetSite);
 if (store) {
 // Store raw base64 data (without data URL prefix)
 const rawBase64 = imageData.includes(',') ? imageData.split(',')[1] : imageData;
 await store.set(id, rawBase64);
 } else {
 // In-memory fallback
 if (!mediaStores[targetSite]) mediaStores[targetSite] = {};
 mediaStores[targetSite][id] = imageData;
 }

 // Calculate approximate size
 const rawBase64 = imageData.includes(',') ? imageData.split(',')[1] : imageData;
 const sizeBytes = Math.round((rawBase64.length * 3) / 4);

 // Update index
 const index = await getMediaIndex(targetSite);
 const record = {
 id,
 filename: filename || 'untitled',
 mimeType: mimeType || 'image/jpeg',
 size: sizeBytes,
 alt: alt || '',
 uploadedAt: new Date().toISOString(),
 };
 index.push(record);
 await setMediaIndex(targetSite, index);

 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({
 success: true,
 image: record,
 url: `/api/cms/media/${id}?site=${targetSite}`,
 }),
 };
 }

 // ==== LIST MEDIA (admin only) ====
 if (path === '/media' && event.httpMethod === 'GET') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 const index = await getMediaIndex(siteId);
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({ images: index }),
 };
 }

 // ==== SERVE MEDIA (public - for img src) ====
 if (path.startsWith('/media/') && path !== '/media/upload' && event.httpMethod === 'GET') {
 const id = path.replace('/media/', '');
 if (!id || id === '' || id.startsWith('_')) {
 return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
 }

 // Get mime type from index
 const index = await getMediaIndex(siteId);
 const record = index.find((r) => r.id === id);
 const mimeType = record ? record.mimeType : 'image/jpeg';

 // Get image data from blob
 const store = await getMediaStore(siteId);
 let imageData = null;
 if (store) {
 try {
 imageData = await store.get(id);
 } catch {
 imageData = null;
 }
 } else {
 imageData = mediaStores[siteId] ? mediaStores[siteId][id] : null;
 }

 if (!imageData) {
 return { statusCode: 404, headers, body: JSON.stringify({ error: 'Image not found' }) };
 }

 // Return binary image with correct content type
 const rawBase64 = typeof imageData === 'string' && imageData.includes(',')
 ? imageData.split(',')[1]
 : imageData;

 return {
 statusCode: 200,
 headers: {
 'Content-Type': mimeType,
 'Cache-Control': 'public, max-age=31536000, immutable',
 'Access-Control-Allow-Origin': '*',
 },
 body: rawBase64,
 isBase64Encoded: true,
 };
 }

 // ==== DELETE MEDIA (admin only) ====
 if (path.startsWith('/media/') && event.httpMethod === 'DELETE') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 const id = path.replace('/media/', '');
 const targetSite = siteId;

 // Remove from blob store
 const store = await getMediaStore(targetSite);
 if (store) {
 try {
 await store.delete(id);
 } catch {}
 } else {
 if (mediaStores[targetSite]) delete mediaStores[targetSite][id];
 }

 // Remove from index
 let index = await getMediaIndex(targetSite);
 index = index.filter((r) => r.id !== id);
 await setMediaIndex(targetSite, index);

 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({ success: true }),
 };
 }

 // ==== CONTACT FORM SUBMISSION (public) ====
 if (path === '/contact' && event.httpMethod === 'POST') {
 const submission = JSON.parse(event.body);
 if (isLikelyBotSubmission(submission)) {
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({ success: true, message: 'Thank you for your enquiry. We will get back to you soon.' }),
 };
 }
 const email = cleanString(submission.email).toLowerCase();
 if (!email) {
 return {
 statusCode: 400,
 headers,
 body: JSON.stringify({ success: false, error: 'Email is required.' }),
 };
 }
 submission.email = email;
 const submissionSite = submission.site && VALID_SITES.includes(submission.site) ? submission.site : siteId;
 submission.timestamp = new Date().toISOString();
 submission.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
 submission.site = submissionSite;
 const submissions = await getData('submissions', submissionSite);
 submissions.push(submission);
 await setData('submissions', submissions, submissionSite);
 try {
 await addContactToMailerLite(submission);
 } catch (error) {
 console.error('MailerLite contact sync failed:', error);
 }
 try {
 await sendContactEmails(submission);
 } catch (error) {
 console.error('Contact notification failed:', error);
 return {
 statusCode: 502,
 headers,
 body: JSON.stringify({
 success: false,
 saved: true,
 emailDeliveryFailed: true,
 error: 'Your enquiry was received, but email delivery failed. Please check RESEND_API_KEY and CONTACT_FROM_EMAIL in Netlify.',
 }),
 };
 }

 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({ success: true, message: 'Thank you for your enquiry. We will get back to you soon.' }),
 };
 }

 // ==== GET SUBMISSIONS (admin only) ====
 if (path === '/submissions' && event.httpMethod === 'GET') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 const submissions = await getData('submissions', siteId);
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify(submissions),
 };
 }

 // ==== GET ALL SUBMISSIONS ACROSS SITES (admin only) ====
 if (path === '/submissions/all' && event.httpMethod === 'GET') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 const allSubmissions = {};
 for (const site of VALID_SITES) {
 allSubmissions[site] = await getData('submissions', site);
 }
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify(allSubmissions),
 };
 }

 // ==== DELETE SUBMISSION (admin only) ====
 if (path.startsWith('/submissions/') && path !== '/submissions/clear' && path !== '/submissions/all' && event.httpMethod === 'DELETE') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 const id = path.replace('/submissions/', '');
 let submissions = await getData('submissions', siteId);
 submissions = submissions.filter((s) => s.id !== id);
 await setData('submissions', submissions, siteId);
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({ success: true }),
 };
 }

 // ==== CLEAR ALL SUBMISSIONS (admin only) ====
 if (path === '/submissions/clear' && event.httpMethod === 'POST') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 await setData('submissions', [], siteId);
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({ success: true }),
 };
 }

 // ==== LIST SITES (admin only) ====
 if (path === '/sites' && event.httpMethod === 'GET') {
 const auth = getAuth(event);
 if (!auth) {
 return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
 }
 return {
 statusCode: 200,
 headers,
 body: JSON.stringify({
 sites: [
 { id: 'vac', name: 'Visi Armada Consulting', domain: 'visiarmada.com', url: '/' },
 { id: 'husni', name: 'Husni Halim', domain: 'husnihalim.com', url: '/husni/' },
 ],
 }),
 };
 }

 // ==== 404 ====
 return {
 statusCode: 404,
 headers,
 body: JSON.stringify({ error: 'Not found' }),
 };
 } catch (err) {
 return {
 statusCode: 500,
 headers,
 body: JSON.stringify({ error: 'Internal server error', details: err.message }),
 };
 }
};
