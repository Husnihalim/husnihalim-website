const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;

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

async function addToMailerLite(data) {
  if (!MAILERLITE_API_KEY) {
    throw new Error('MAILERLITE_API_KEY is not configured');
  }

  const email = cleanString(data.email).toLowerCase();
  if (!email) {
    return { statusCode: 400, body: JSON.stringify({ success: false, error: 'Email is required' }) };
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

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true }),
  };
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
    const result = await addToMailerLite(data);
    return { ...result, headers };
  } catch (error) {
    console.error('subscribe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Subscription failed' }),
    };
  }
};
