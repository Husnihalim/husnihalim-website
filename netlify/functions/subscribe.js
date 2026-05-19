const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL || 'admin@visiarmada.com';
const CC_EMAILS = (process.env.CONTACT_CC_EMAILS || 'admin@visiarmada.com')
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean);
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'noreply@husnihalim.com';

const GROUPS = {
  contact: process.env.MAILERLITE_CONTACT_GROUP_ID || '182444406325904847',
  oee: process.env.MAILERLITE_OEE_GROUP_ID || '182927163251492060',
};

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function buildFields(data) {
  const fields = {
    name: cleanString(data.fname || data.firstname || data.name),
    last_name: cleanString(data.lname || data.lastname),
    company: cleanString(data.company),
  };

  Object.keys(fields).forEach((key) => {
    if (!fields[key]) delete fields[key];
  });

  return fields;
}

function escapeHtml(value) {
  return cleanString(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendSubscriptionNotification(data) {
  if (!RESEND_API_KEY) {
    console.error('Subscription notification skipped: RESEND_API_KEY is not configured');
    return;
  }

  const email = cleanString(data.email).toLowerCase();
  const name = [data.fname || data.firstname || data.name, data.lname || data.lastname].map(cleanString).filter(Boolean).join(' ') || 'Website visitor';
  const source = cleanString(data.source || data.group || 'subscription');
  const rows = Object.entries(data)
    .map(([key, value]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;width:140px;">${escapeHtml(key)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td>
      </tr>`)
    .join('');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Husni Halim Website <${FROM_EMAIL}>`,
      to: [NOTIFICATION_EMAIL],
      cc: CC_EMAILS,
      reply_to: email || undefined,
      subject: `New ${source} lead: ${name}`,
      html: `<!doctype html>
<html>
<body style="font-family:Arial,sans-serif;background:#f6f7f9;margin:0;padding:24px;color:#111827;">
  <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:10px;padding:28px;border:1px solid #e5e7eb;">
    <h2 style="margin:0 0 6px;color:#111827;">New website lead</h2>
    <p style="margin:0 0 18px;color:#6b7280;">${escapeHtml(source)}</p>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
  </div>
</body>
</html>`,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend subscription notification failed: ${message}`);
  }
}

async function addToMailerLite(data) {
  if (!MAILERLITE_API_KEY) {
    console.error('MailerLite skipped: MAILERLITE_API_KEY is not configured');
    return;
  }

  const email = cleanString(data.email).toLowerCase();
  if (!email) {
    throw new Error('Email is required');
  }

  const groupKey = cleanString(data.group || data.source) === 'oee' ? 'oee' : 'contact';
  const groupId = GROUPS[groupKey];

  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${MAILERLITE_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      fields: buildFields({ ...data, source: data.source || groupKey }),
      groups: [groupId],
      status: 'active',
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`MailerLite error: ${message}`);
  }

  return { synced: true };
}

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ success: false, error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    if (!cleanString(data.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Email is required' }),
      };
    }

    try {
      await sendSubscriptionNotification(data);
    } catch (error) {
      console.error('Subscription notification failed:', error);
    }

    try {
      await addToMailerLite(data);
    } catch (error) {
      console.error('MailerLite sync failed:', error);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('subscribe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Subscription failed' }),
    };
  }
};
