// ============================================================
// Netlify Serverless Function: submit-form.js
// Called directly by the floor-assessment form via fetch().
// All 3 API calls run in PARALLEL for speed.
// ============================================================

const RESEND_API_KEY      = process.env.RESEND_API_KEY;
const MAILERLITE_API_KEY  = process.env.MAILERLITE_API_KEY;
const YOUR_EMAIL          = process.env.CONTACT_NOTIFICATION_EMAIL || "husnihalim@visiarmada.com";
const CC_EMAILS           = (process.env.CONTACT_CC_EMAILS || "admin@visiarmada.com")
  .split(",")
  .map(function(email) { return email.trim(); })
  .filter(Boolean);
const YOUR_NAME           = "Husni Halim";
const FROM_EMAIL          = "noreply@husnihalim.com";
const MAILERLITE_GROUP_ID = "182444406325904847";

function sendEmail({ to, toName, cc, subject, html }) {
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
      subject,
      html,
    }),
  }).then(function(res) {
    if (!res.ok) return res.text().then(function(e) { throw new Error("Resend: " + e); });
    return res.json();
  });
}

function addToMailerLite(email, firstname, lastname) {
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
<p>Got your request — I'll be in touch within <strong>48 hours</strong> to arrange your free floor walk.</p>
<p>Here's what to expect:</p>
<div class="hi"><ul>
<li><strong>A quick call</strong> to understand your specific situation (15–20 min)</li>
<li><strong>The floor walk</strong> — I come to your site, eyes on the actual operation</li>
<li><strong>A clear picture</strong> of your top recurring problems and where to start</li>
</ul></div>
<p>If you have anything specific you'd like me to look at, just reply to this email.</p>
<p>Talk soon,<br><strong>Husni</strong></p>
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

    // Run all 3 in parallel
    await Promise.all([
      sendEmail({ to: email, toName: fullName, subject: "Got your request — I'll reach out within 48 hours", html: visitorHtml }),
      sendEmail({ to: YOUR_EMAIL, cc: CC_EMAILS, subject: `New lead: ${fullName} requested a floor assessment`, html: husniHtml }),
      addToMailerLite(email, firstname, lastname),
    ]);

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
