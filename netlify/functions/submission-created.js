const RESEND_API_KEY = process.env.RESEND_API_KEY;
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const NOTIFICATION_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL || 'admin@visiarmada.com';
const CC_EMAILS = (process.env.CONTACT_CC_EMAILS || 'admin@visiarmada.com')
  .split(',')
  .map((email) => email.trim())
  .filter(Boolean);
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'noreply@husnihalim.com';
const REPLY_TO_EMAIL = process.env.CONTACT_REPLY_TO_EMAIL || NOTIFICATION_EMAIL;
const FROM_NAME = 'Husni Halim Website';
const MAILERLITE_GROUP_ID = process.env.MAILERLITE_CONTACT_GROUP_ID || '182444406325904847';

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return cleanString(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getPayload(event) {
  const body = JSON.parse(event.body || '{}');
  return body.payload || body;
}

function getField(data, names) {
  for (const name of names) {
    if (cleanString(data[name])) return cleanString(data[name]);
  }
  return '';
}

function getFullName(data) {
  const name = getField(data, ['name', 'full_name', 'fullname']);
  if (name) return name;
  return [data.firstname, data.lastname].map(cleanString).filter(Boolean).join(' ');
}

async function sendEmail({ to, cc, replyTo, subject, html }) {
  if (!RESEND_API_KEY) {
    console.error('Email skipped: RESEND_API_KEY is not configured');
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [to],
      cc,
      reply_to: replyTo || undefined,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend error: ${message}`);
  }
}

async function sendVisitorAutoReply(data, formName) {
  const email = getField(data, ['email']);
  if (!email) return;

  const fullName = getFullName(data);
  const firstName = escapeHtml(fullName.split(/\s+/).filter(Boolean)[0] || 'there');
  const company = escapeHtml(getField(data, ['company']));
  const topic = formName === 'blog-enquiry' ? 'your enquiry from the article page' : 'your website enquiry';

  await sendEmail({
    to: email,
    replyTo: REPLY_TO_EMAIL,
    subject: 'I received your enquiry - Husni Halim',
    html: `<!doctype html>
<html>
<body style="font-family:Arial,sans-serif;background:#f6f7f9;margin:0;padding:24px;color:#111827;">
  <div style="max-width:620px;margin:0 auto;background:#fff;border-radius:10px;padding:28px;border:1px solid #e5e7eb;">
    <h2 style="margin:0 0 12px;color:#111827;">Thanks for reaching out</h2>
    <p style="line-height:1.6;margin:0 0 14px;">Hi ${firstName},</p>
    <p style="line-height:1.6;margin:0 0 14px;">I received ${topic}${company ? ` from <strong>${company}</strong>` : ''}.</p>
    <p style="line-height:1.6;margin:0 0 14px;">I will review it and reply personally within 1 business day. If the matter is urgent, you can reply to this email or WhatsApp me at <a href="https://wa.me/60165241901" style="color:#8b2252;">+60165241901</a>.</p>
    <p style="line-height:1.6;margin:20px 0 0;">Regards,<br><strong>Husni Halim</strong><br>Principal Consultant, Visi Armada Consulting</p>
  </div>
</body>
</html>`,
  });
}

async function addToMailerLite(data) {
  const email = getField(data, ['email']);
  if (!MAILERLITE_API_KEY || !email) return;

  const fullName = getFullName(data);
  const nameParts = fullName.split(/\s+/).filter(Boolean);
  const firstName = cleanString(data.firstname) || nameParts.shift() || '';
  const lastName = cleanString(data.lastname) || nameParts.join(' ');
  const fields = {
    name: firstName,
    last_name: lastName,
    company: cleanString(data.company),
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
      email: email.toLowerCase(),
      fields,
      groups: [MAILERLITE_GROUP_ID],
      status: 'active',
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error('MailerLite error:', message);
  }
}

exports.handler = async function submissionCreated(event) {
  try {
    const payload = getPayload(event);
    const data = payload.data || payload;
    const formName = payload.form_name || payload.formName || data['form-name'] || 'website-form';
    const fullName = getFullName(data) || 'Website visitor';
    const email = getField(data, ['email']);
    const submittedAt = new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });
    const rows = Object.entries(data)
      .filter(([key]) => key !== 'bot-field')
      .map(([key, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;color:#6b7280;width:140px;">${escapeHtml(key)}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(value)}</td>
        </tr>`)
      .join('');

    await Promise.all([
      sendEmail({
        to: NOTIFICATION_EMAIL,
        cc: CC_EMAILS,
        replyTo: email,
        subject: `New ${formName} submission: ${fullName}`,
        html: `<!doctype html>
<html>
<body style="font-family:Arial,sans-serif;background:#f6f7f9;margin:0;padding:24px;color:#111827;">
  <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:10px;padding:28px;border:1px solid #e5e7eb;">
    <h2 style="margin:0 0 6px;color:#111827;">New website form submission</h2>
    <p style="margin:0 0 18px;color:#6b7280;">${escapeHtml(formName)} submitted at ${escapeHtml(submittedAt)} (KL)</p>
    <table style="width:100%;border-collapse:collapse;">${rows}</table>
  </div>
</body>
</html>`,
      }),
      sendVisitorAutoReply(data, formName),
    ]);

    try {
      await addToMailerLite(data);
    } catch (error) {
      console.error('MailerLite sync failed:', error);
    }

    return { statusCode: 200, body: 'OK' };
  } catch (error) {
    console.error('submission-created error:', error);
    return { statusCode: 500, body: error.message };
  }
};
