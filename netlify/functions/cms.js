// Netlify Serverless Function - Multi-Site CMS API v2
// Full CMS with media library, text styling, section backgrounds, theme control
// Supports multiple sites: vac (default) and husni
// Uses Netlify Blobs for persistent storage

// Admin credentials (hardcoded for Netlify free tier)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'vacadmin2025';
const JWT_SECRET = 'vac-cms-jwt-secret-2025';

// Valid site identifiers
const VALID_SITES = ['vac', 'husni'];

// Simple JWT implementation for auth
function createToken(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify({ ...payload, exp: Date.now() + 86400000 })); // 24h
  const signature = btoa(JSON.stringify({ s: JWT_SECRET + header + body }));
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    const [header, body, signature] = token.split('.');
    const payload = JSON.parse(atob(body));
    const expectedSig = btoa(JSON.stringify({ s: JWT_SECRET + header + body }));
    if (signature !== expectedSig) return null;
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
      const { username, password } = JSON.parse(event.body);
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = createToken({ role: 'admin' });
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, token }),
        };
      }
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
      const submissionSite = submission.site && VALID_SITES.includes(submission.site) ? submission.site : siteId;
      submission.timestamp = new Date().toISOString();
      submission.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      submission.site = submissionSite;
      const submissions = await getData('submissions', submissionSite);
      submissions.push(submission);
      await setData('submissions', submissions, submissionSite);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Thank you for your inquiry. We will get back to you soon.' }),
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
