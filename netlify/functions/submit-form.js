// ============================================================
// Netlify Serverless Function: submit-form.js
// Called directly by the floor-assessment form via fetch().
// All 3 API calls run in PARALLEL for speed.
// ============================================================

const RESEND_API_KEY      = process.env.RESEND_API_KEY;
const MAILERLITE_API_KEY  = process.env.MAILERLITE_API_KEY;
const YOUR_EMAIL          = process.env.CONTACT_NOTIFICATION_EMAIL || "admin@visiarmada.com";
const CC_EMAILS           = (process.env.CONTACT_CC_EMAILS || "admin@visiarmada.com")
  .split(",")
  .map(function(email) { return email.trim(); })
  .filter(Boolean);
const YOUR_NAME           = "Husni Halim";
const FROM_EMAIL          = "noreply@husnihalim.com";
const REPLY_TO_EMAIL      = process.env.CONTACT_REPLY_TO_EMAIL || YOUR_EMAIL;
const MAILERLITE_GROUP_ID = "182444406325904847";

function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isLikelyBotSubmission(params) {
  if (cleanString(params.get("bot-field"))) return true;

  const startedAt = Number(params.get("form-started-at") || 0);
  if (!startedAt) return true;

  if (Date.now() - startedAt < 3000) return true;

  const firstname = cleanString(params.get("firstname"));
  const lastname = cleanString(params.get("lastname"));
  return hasBotNamePattern(`${firstname}${lastname}`);
}

function hasBotNamePattern(value) {
  const text = cleanString(value);
  if (text.length < 12) return false;

  const lettersOnly = text.replace(/[^a-z]/gi, "");
  if (lettersOnly.length < 12) return false;

  const uppercaseCount = (lettersOnly.match(/[A-Z]/g) || []).length;
  const lowercaseCount = (lettersOnly.match(/[a-z]/g) || []).length;
  const hasNormalSeparator = /[\s.'-]/.test(text);
  const hasCommonNamePart = /(bin|binti|mohd|muhammad|ahmad|abdul|siti|nur|lee|lim|tan|wong|aziz|rahman|husni)/i.test(text);
  const randomCamelCase = uppercaseCount >= 4 && lowercaseCount >= 6 && !hasNormalSeparator && !hasCommonNamePart;

  const vowelCount = (lettersOnly.match(/[aeiou]/gi) || []).length;
  const vowelRatio = vowelCount / lettersOnly.length;
  const lowVowelLongToken = lettersOnly.length >= 16 && vowelRatio < 0.22 && !hasCommonNamePart;

  return randomCamelCase || lowVowelLongToken;
}

function sendEmail({ to, toName, cc, replyTo, subject, html }) {
  if (!RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  return fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${YOUR_NAME} <${FROM_EMAIL}>`,
      to: toName ? [`${toName} <${to}>`] : [to],
      cc,
      reply_to: replyTo || undefined,
      subject,
      html,
    }),
  }).then(function(res) {
    if (!res.ok) return res.text().then(function(e) { throw new Error("Resend: " + e); });
    return res.json();
  });
}

function addToMailerLite(email, firstname, lastname) {
  if (!MAILERLITE_API_KEY) {
    console.error("MailerLite skipped: MAILERLITE_API_KEY is not configured");
    return Promise.resolve();
  }

  return fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${MAILERLITE_API_KEY}`,
      "Accept":        "application/json",
    },
    body: JSON.stringify({
      email,
      fields: { name: firstname, last_name: lastname },
      groups: [MAILERLITE_GROUP_ID],
    }),
  }).then(function(res) {
    if (!res.ok) return res.text().then(function(e) { console.error("MailerLite:", e); });
    console.log("MailerLite OK:", email);
  });
}

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const params    = new URLSearchParams(event.body);
    if (isLikelyBotSubmission(params)) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: true }),
      };
    }

    const firstname = params.get("firstname") || "";
    const lastname  = params.get("lastname")  || "";
    const email     = params.get("email")     || "";
    const fullName  = `${firstname} ${lastname}`.trim() || "there";
    const time      = new Date().toLocaleString("en-MY", { timeZone: "Asia/Kuala_Lumpur" });

    if (!email) return { statusCode: 400, body: "Email required" };

    const visitorHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:Georgia,serif;background:#f9f7f4;margin:0;padding:0}
.w{max-width:600px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)}
.h{background:#0a0f1a;padding:32px 40px}.h h1{color:#fff;font-size:22px;margin:0}
.h p{color:rgba(255,255,255,.55);font-size:13px;margin:6px 0 0}
.b{padding:36px 40px;color:#1a1a1a;line-height:1.7}.b p{margin:0 0 16px}
.hi{background:#fdf5e8;border-left:3px solid #c47832;padding:16px 20px;border-radius:4px;margin:24px 0}
.hi ul{margin:8px 0 0 16px;padding:0}.hi ul li{margin-bottom:6px}
.f{background:#f2f0ed;padding:20px 40px;font-size:12px;color:#888}
.f a{color:#8b2252;text-decoration:none}
</style></head><body><div class="w">
<div class="h"><h1>Husni Halim</h1><p>Principal Consultant, Certified Process Kaizen Engineer</p></div>
<div class="b">
<p>Hi ${firstname || fullName},</p>
<p>I received your request for a free floor assessment.</p>
<p>Here's what to expect:</p>
<div class="hi"><ul>
<li><strong>A quick call</strong> to understand your specific situation (15–20 min)</li>
<li><strong>The floor walk</strong> — I come to your site, eyes on the actual operation</li>
<li><strong>A clear picture</strong> of your top recurring problems and where to start</li>
</ul></div>
<p>I will reply personally within 1 business day to arrange the next step. If there is anything urgent or specific you want me to look at, just reply to this email.</p>
<p>Regards,<br><strong>Husni Halim</strong><br>Principal Consultant, Visi Armada Consulting</p>
</div>
<div class="f"><a href="https://husnihalim.com">husnihalim.com</a> · Principal Consultant, Certified Process Kaizen Engineer</div>
</div></body></html>`;

    const husniHtml = `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:-apple-system,sans-serif;background:#f5f5f5;margin:0;padding:40px 20px}
.c{max-width:500px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,.08)}
table{width:100%;border-collapse:collapse;margin:16px 0}
td{padding:8px 12px;border-bottom:1px solid #eee;font-size:14px}
td:first-child{color:#666;width:80px}
.a{margin-top:20px;padding:16px;background:#f0fdf4;border-radius:6px;font-size:14px}
</style></head><body><div class="c">
<h2>New Floor Assessment Request</h2>
<table>
<tr><td>Name</td><td><strong>${fullName}</strong></td></tr>
<tr><td>Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
<tr><td>Time</td><td>${time} (KL)</td></tr>
</table>
<div class="a"><strong>Next step:</strong> Reply within 48 hours to arrange the discovery call and floor walk.</div>
</div></body></html>`;

    // Send the visitor and owner emails together; keep MailerLite from blocking the lead notification.
    await Promise.all([
      sendEmail({ to: email, toName: fullName, replyTo: REPLY_TO_EMAIL, subject: "I received your floor assessment request - Husni Halim", html: visitorHtml }),
      sendEmail({ to: YOUR_EMAIL, cc: CC_EMAILS, subject: `New lead: ${fullName} requested a floor assessment`, html: husniHtml }),
    ]);
    addToMailerLite(email, firstname, lastname).catch(function(error) {
      console.error("MailerLite:", error);
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };

  } catch (err) {
    console.error("submit-form error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
