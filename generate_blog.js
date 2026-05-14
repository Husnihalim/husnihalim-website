const fs = require('fs');
const path = require('path');

// ─── Shared assets ────────────────────────────────────────────────
const GOOGLE_FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">`;

const SHARE_ICONS = {
  native: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98"/><path d="M15.41 6.51L8.59 10.49"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zM7.119 20.452H3.555V9h3.564v11.452z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.446 18.627.073 12 .073S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>'
};

function escapeAttr(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function shareButton(action, label, isButton = false, extraClass = '') {
  const icon = SHARE_ICONS[action] || '';
  const classes = `hh-share__button hh-share__button--${action}${extraClass ? ` ${extraClass}` : ''}`;

  if (isButton) {
    return `<button class="${classes}" type="button" data-share-action="${action}" aria-label="${escapeAttr(label)}">${icon}<span>${label}</span></button>`;
  }

  return `<a class="${classes}" data-share-action="${action}" target="_blank" rel="noopener" aria-label="${escapeAttr(label)}">${icon}<span>${label}</span></a>`;
}

function articleShare() {
  return `<div class="hh-share hh-share--article">
      <span class="hh-share__label">Share this article</span>
      <div class="hh-share__actions">
        ${shareButton('native', 'Share', true)}
        ${shareButton('whatsapp', 'WhatsApp')}
        ${shareButton('linkedin', 'LinkedIn')}
        ${shareButton('facebook', 'Facebook')}
        ${shareButton('x', 'X')}
        ${shareButton('copy', 'Copy link', true)}
      </div>
    </div>`;
}

function cardShare(article) {
  const url = `https://husnihalim.com/blog/${article.slug}/`;
  const title = escapeAttr(article.title);

  return `<div class="hh-share hh-share--card" data-share-url="${url}" data-share-title="${title}">
    <span class="hh-share__label">Share</span>
    <div class="hh-share__actions">
      ${shareButton('whatsapp', 'Share on WhatsApp')}
      ${shareButton('linkedin', 'Share on LinkedIn')}
      ${shareButton('facebook', 'Share on Facebook')}
      ${shareButton('copy', 'Copy article link', true)}
    </div>
  </div>`;
}

// ─── Articles data ────────────────────────────────────────────────
const articles = [
  {
    slug: 'why-kaizen-events-fail',
    title: 'Why Kaizen Events Fail in Manufacturing Plants',
    subtitle: 'Most Kaizen events produce a report, not results. Here are the six root causes of Kaizen failure — and what successful implementation actually looks like.',
    metaTitle: 'Why Kaizen Events Fail in Manufacturing Malaysia | Husni Halim',
    metaDesc: 'Most Kaizen events in Malaysian manufacturing plants produce a report, not results. Lean consultant explains the 6 root causes of Kaizen failure and what successful implementation looks like.',
    category: 'Kaizen',
    readTime: '9 min read',
    date: 'November 2024',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['Kaizen', 'Lean Manufacturing', 'Continuous Improvement', 'Malaysia'],
    body: `
<p>Most Kaizen events in Malaysian factories follow the same script. A consultant or internal team runs a three to five day workshop. Participants map the current state, identify waste, brainstorm improvements, and fill an A3 report with promising actions. Everyone claps. Three months later, the factory floor looks exactly the same.</p>
<p>This is not a Malaysian problem exclusively — it is a global pattern. But it is particularly acute in Malaysian manufacturing because of specific cultural and structural factors that undermine Kaizen sustainability even when the technical work is done correctly.</p>
<p>Here are the six most common reasons Kaizen events fail — and what to do instead.</p>

<h2>1. The Event Is Treated as the Destination, Not the Starting Point</h2>
<p>A Kaizen event is not an improvement. It is the trigger for an improvement. The actual work happens in the weeks and months after the event — when new standard work is being practised, old habits are being broken, and the changes are being embedded into daily operations.</p>
<p>Most organisations celebrate the event and neglect the follow-through. Improvements survive for four to six weeks, then quietly revert as workload pressure mounts and no one is accountable for sustaining the change.</p>
<div class="callout"><strong>Fix:</strong> Every Kaizen event must close with a 30-60-90 day sustainment plan with named owners — not a list of action items assigned to "management."</div>

<h2>2. Middle Management Is Not Bought In</h2>
<p>Senior management sponsors the Kaizen. Operators participate. But shift supervisors and line managers in between — the people who control the daily work environment — were either not involved or are quietly resistant.</p>
<p>A supervisor who does not understand why a new standard work procedure was designed will allow team members to revert to the old method when pressure mounts. And it always does.</p>
<div class="callout"><strong>Fix:</strong> Supervisors must be active participants in the Kaizen design process, not passive recipients of its outputs. Their practical knowledge of why the old method exists is the most important input to designing a better one.</div>

<h2>3. The Improvement Target Is Too Vague</h2>
<p>"Reduce waste" and "improve efficiency" are not Kaizen targets. They are aspirations. A Kaizen event needs a specific, measurable target: reduce changeover time on Line 3 from 47 minutes to 25 minutes. Eliminate the waiting waste at incoming inspection that delays 35% of production starts by more than two hours.</p>
<p>Without a specific target, the event generates activity but cannot be declared a success or failure. Without accountability, sustainment is impossible.</p>

<h2>4. The Root Cause Was Misidentified</h2>
<p>Many Kaizen events target symptoms rather than root causes. A factory addresses high defect rates by adding an extra inspection step — a countermeasure that increases cost and complexity without resolving the source of the defects.</p>
<p>Proper root cause analysis using 5 Whys methodically — reaching the actual process or system-level cause rather than the proximate human error — is the foundation of any Kaizen that produces lasting results. Skipping this step and going straight to solutions is the most common technical error.</p>

<h2>5. No Standard Work Was Updated</h2>
<p>Here is a diagnostic question: if you walked onto your shop floor today and asked any operator the correct way to perform their task, could they show you a written standard? In most plants the answer is no — and that is the problem.</p>
<p>Kaizen events improve a process but if there is no standard work document to update, the new method has nowhere to live. It exists in memory, and memory degrades.</p>
<div class="callout"><strong>Fix:</strong> Before closing any Kaizen event, the updated method must be documented in a standard work sheet. Operators must receive training on the new standard. That documentation must be posted at the workstation.</div>

<h2>6. Leadership Disappears After the Presentation</h2>
<p>When senior management shows up for the Day 5 presentation and then disappears, it sends a clear signal: this was a performance, not a priority. The team reads it correctly and adjusts their effort accordingly.</p>
<p>Sustainable Kaizen requires leaders to physically visit the improved area in the weeks after the event. Not to inspect — to ask questions, show they remember, reinforce that the change matters. This takes 10 minutes a week. Most plants do not do it.</p>

<h2>The Common Thread</h2>
<p>Every failure mode above shares one root cause: Kaizen events are treated as isolated activities rather than components of a continuous improvement system. They are scheduled, executed, and closed — without the infrastructure to maintain what was built.</p>
<p>The fix is not a better event format. It is building the supporting conditions: standard work, visual management, operator ownership, and leadership presence. When those exist, Kaizen events amplify what is already working. When they do not, Kaizen events are expensive workshops.</p>
<table>
<thead><tr><th>Failure Pattern</th><th>Root Cause</th><th>Practical Fix</th></tr></thead>
<tbody>
<tr><td>Improvements reversed in 2 weeks</td><td>No standard work updated</td><td>Update SOP before closing event</td></tr>
<tr><td>Operators ignore new method</td><td>Not involved in design</td><td>Include floor operators in team</td></tr>
<tr><td>Action items expire</td><td>No named owner or deadline</td><td>Assign person + 30-day review</td></tr>
<tr><td>Management loses interest</td><td>No visible tracking board</td><td>Post status in gemba, not reports</td></tr>
<tr><td>Next event repeats same problems</td><td>No lessons-learned captured</td><td>5-min debrief, documented and shared</td></tr>
</tbody>
</table>
`
  },
  {
    slug: '5s-implementation-problems',
    title: '5S Implementation Problems: Why It Never Sticks After Training',
    subtitle: 'Thousands of Malaysian factories have run 5S programmes. A fraction of them are still practising 5S six months later. The reasons are consistent and fixable.',
    metaTitle: '5S Implementation Problems in Malaysian Factories | Husni Halim',
    metaDesc: 'Why does 5S fail after training in Malaysian manufacturing? Certified lean consultant explains the most common 5S implementation problems and how to build a 5S system that lasts.',
    category: 'Lean Manufacturing',
    readTime: '8 min read',
    date: 'December 2024',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['5S', 'Lean Manufacturing', 'Workplace Organisation', 'Malaysia'],
    body: `
<p>5S is taught in virtually every lean manufacturing training programme in Malaysia. It is the entry point — the foundation on which everything else is built. And yet, after more than a decade of running 5S programmes across Malaysian factories, the honest observation is this: most 5S implementations fail within six months of the initial training.</p>
<p>Not because 5S is complicated. Because of predictable, recurring mistakes that are almost always present when a 5S programme collapses.</p>

<h2>Mistake 1: 5S Is Implemented as a Cleaning Programme</h2>
<p>The most damaging misconception about 5S is treating it as a one-time deep clean. Management schedules a "5S Day," everyone cleans their area, photos are taken, and the programme is declared a success.</p>
<p>5S is not a cleaning event. It is a system for maintaining the visual conditions needed to detect abnormalities quickly. The cleaning is only Sort and Shine. Without Set in Order, Standardise, and Sustain — the system cannot function and the workplace reverts to its previous state within weeks.</p>
<div class="callout"><strong>The tell:</strong> If your factory has run multiple "5S Days" in the past three years, your 5S programme is not working. A properly implemented 5S system does not need special days — it runs continuously.</div>

<h2>Mistake 2: There Are No Clear Standards for "Correct"</h2>
<p>After Sort and Set in Order, every location in the workplace needs a defined standard: what belongs here, how much of it, and what the visual indicator looks like when the standard is met versus violated.</p>
<p>Without these standards documented and posted, "cleaning up" is subjective. Each operator has a different interpretation of tidy. Shift handovers reintroduce disorder because there is no agreed definition of the correct state.</p>
<p>The physical embodiment of this standard is a "5S map" or shadow board for each zone — a visual that makes it immediately obvious when something is out of place or missing, even to someone who has never worked in that area before.</p>

<h2>Mistake 3: The Audit Is a Punishment Exercise</h2>
<p>Many factories implement 5S audits with scoring sheets that get reported up to management. When audit scores are low, it triggers a top-down pressure response — supervisors push operators to "fix the score" rather than fix the underlying conditions.</p>
<p>This creates a pattern where the workplace is tidied before the scheduled audit and returns to disorder immediately after. The audit measures compliance with the audit, not compliance with the standard.</p>
<div class="callout"><strong>Fix:</strong> The purpose of a 5S audit is to identify obstacles that are making it difficult for operators to maintain the standard — not to catch people failing. When an area consistently scores low, the question to ask is: "What is making it hard to keep this area in standard?" not "Why is this area failing?"</div>

<h2>Mistake 4: 5S Is Owned by the Quality or EHS Department</h2>
<p>When 5S is assigned to a support department rather than to production leadership, it becomes a compliance activity rather than an operational discipline. Production supervisors do not feel ownership of it. Operators do not associate it with their own work performance.</p>
<p>5S must be owned by the line — by the operators and supervisors who work in that space every day. The role of the quality or lean team is to support and coach, not to own and enforce.</p>

<h2>Mistake 5: Management Does Not Sustain Its Own Areas</h2>
<p>If the management meeting room, the engineering office, and the maintenance workshop are not held to the same 5S standard as the production floor, the message to operators is clear: 5S is something we ask of you, not something we practise ourselves.</p>
<p>In every successful 5S programme, leadership areas are included in the scope from day one — and are held to the same audit standard as production areas.</p>

<h2>What a Working 5S System Looks Like</h2>
<p>A 5S system that is actually working has these observable characteristics: any visitor can walk into any area and identify a non-conformance within 30 seconds without being told what to look for. Every location has a defined owner. Audit scores trend consistently above a threshold, not because of pressure, but because the standards are achievable and clearly communicated. And operators can explain the purpose of the standard, not just follow it.</p>
<p>That last point matters most. Operators who understand why a standard exists will maintain it under pressure. Operators who are just following instructions will abandon it the moment no one is watching.</p>
`
  },
  {
    slug: 'value-stream-mapping-mistakes',
    title: 'Value Stream Mapping Mistakes That Make VSM Useless',
    subtitle: 'Value Stream Mapping is one of the most powerful tools in lean manufacturing. It is also one of the most commonly misused. Here is what goes wrong.',
    metaTitle: 'Value Stream Mapping Mistakes in Manufacturing | Husni Halim',
    metaDesc: 'VSM is powerful when done correctly. Lean consultant explains the most common value stream mapping mistakes that produce maps nobody acts on — and how to build a VSM that drives real improvement.',
    category: 'Lean Manufacturing',
    readTime: '8 min read',
    date: 'February 2025',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['VSM', 'Value Stream Mapping', 'Lean Manufacturing', 'Waste Elimination'],
    body: `
<p>Value Stream Mapping is taught in almost every lean training programme. The exercise of drawing the current state, calculating flow metrics, and designing the future state is genuinely powerful when it is done well. The problem is that most VSM exercises produce a beautiful map that gets framed on a wall and never acted upon.</p>
<p>Here are the mistakes that produce maps nobody uses.</p>

<h2>Mistake 1: Mapping from Memory Instead of the Gemba</h2>
<p>The most common VSM mistake is building the current state map in a conference room, based on what people believe is happening on the floor, rather than what is actually happening.</p>
<p>Standard times from the routing sheets are used instead of measured cycle times. Inventory quantities are estimated rather than counted. The WIP between stations is approximated. The result is a map of the imagined current state, not the real one — and improvement actions based on imaginary data produce imaginary improvements.</p>
<div class="callout"><strong>Rule:</strong> Every data box on a current state map must come from direct observation on the shop floor, not from ERP reports or memory. Walk the flow. Time the cycles. Count the inventory. Measure the changeovers.</div>

<h2>Mistake 2: Mapping at the Wrong Level</h2>
<p>Value streams operate at multiple levels: the factory level (how orders flow from customer through production to delivery), the production line level, and the process level. Teams often build VSMs at the wrong level for the problem they are trying to solve.</p>
<p>A factory-level map that aggregates multiple product families cannot reveal the specific constraints in a single production cell. A process-level map of one workstation cannot reveal the scheduling problems that are creating upstream batching. Matching the map level to the problem is a prerequisite for useful analysis.</p>

<h2>Mistake 3: The Future State Has No Pull Logic</h2>
<p>Future state maps often look like the current state with fewer inventory triangles and faster cycle times — without addressing the fundamental flow logic. The same push scheduling, the same batch-and-queue behaviour, the same disconnect between customer demand and production rate — all present in the "improved" future state.</p>
<p>A properly designed future state map specifies: the pacemaker process, the pitch calculation, how pull signals will work between processes, and what the maximum WIP limits are at each queue. Without this, the future state is a wish, not a design.</p>

<h2>Mistake 4: The Map Lives in a File, Not on the Floor</h2>
<p>VSM is a communication tool as much as an analysis tool. When the current state and future state maps are stored as PowerPoint files or PDFs that require a computer to view, they are removed from the operational context where they are useful.</p>
<p>VSMs should be posted in the production area — large format, visible to the team, with the implementation plan and progress status visible alongside them. When the map is in the gemba, it drives daily conversation. When it is in a file, it drives annual presentations.</p>

<h2>Mistake 5: No Implementation Plan Attached to the Future State</h2>
<p>A future state map without an implementation roadmap is a drawing of a building without a construction plan. The team knows where they want to go but has no structured path to get there.</p>
<p>Every future state map should be accompanied by a kaizen burst list that identifies the specific improvement events needed to close the gap, sequenced in the right order (flow improvements before pull, pull improvements before levelling), with target completion dates and named owners for each.</p>
<div class="callout"><strong>VSM done right:</strong> Current state mapped at gemba → Future state designed with pull logic → Kaizen burst list with sequenced events → Implementation roadmap with owners and dates → Regular review of progress against the map.</div>
`
  },
  {
    slug: 'standard-work-implementation-problems',
    title: 'Why Standard Work Never Gets Followed After Training',
    subtitle: 'Standard work is the foundation of every lean system. It is also the most consistently ignored element. Understanding why reveals a lot about how improvement programmes fail.',
    metaTitle: 'Why Standard Work Fails After Training in Manufacturing | Husni Halim',
    metaDesc: 'Standard work documents get created, operators get trained, and three months later nobody follows them. Lean consultant explains why standard work fails and how to build a system that actually holds.',
    category: 'Lean Manufacturing',
    readTime: '7 min read',
    date: 'April 2025',
    image: 'https://images.unsplash.com/photo-1565618013578-d6bcdbf1b90d?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['Standard Work', 'Lean Manufacturing', 'SOPs', 'Operator Training'],
    body: `
<p>Standard work is documented. Operators are trained. SOPs are laminated and posted at workstations. Six months later, a factory visit reveals that approximately 40% of operators are following the standard, 40% have modified it in ways they believe are improvements, and 20% have reverted entirely to a previous method or invented their own.</p>
<p>This pattern is so consistent across Malaysian manufacturing plants that it can be predicted before arriving at a factory. Here is why it happens.</p>

<h2>The Standard Was Written Without the Operator</h2>
<p>The most fundamental mistake in standard work implementation is writing the standard in an office, without the input of the operators who perform the work. Engineers and supervisors document what they believe the process should be. The result is a standard that often conflicts with practical realities the writer was not aware of — equipment variation, material inconsistencies, ergonomic constraints.</p>
<p>When operators discover that following the standard exactly produces worse results than their own method, they stop following it. And they are usually right to do so — the standard was wrong.</p>
<div class="callout"><strong>Principle:</strong> Standard work must be written by the people who do the work, with engineering support, not written by engineers and handed to operators. The operator's practical knowledge is the most important input to a workable standard.</div>

<h2>The Standard Is Written for Compliance, Not Clarity</h2>
<p>Many standard work documents are written to satisfy an audit — to prove that a standard exists. They are dense paragraphs of instructions, often in language that assumes extensive background knowledge, with no visual references.</p>
<p>A workable standard work document is designed to be used at the workstation, in real time, by operators of varying experience levels. It should be visual-first: diagrams, photos, and decision trees rather than paragraphs. The test of a good standard is whether a new operator can follow it correctly on their first day, without supervision.</p>

<h2>There Is No Consequence for Not Following It</h2>
<p>Standard work without a verification system is a suggestion, not a standard. If operators can choose whether to follow the documented method without any mechanism detecting deviation, the standard has no operational reality.</p>
<p>Verification does not require punishment. It requires visibility. Leader standard work — where supervisors perform structured observations of operators following standard work at defined intervals — makes deviation visible without creating a surveillance culture. When deviation is detected, the first question is always: "Is the standard correct, or is the operator deviating from a correct standard?"</p>

<h2>The Standard Is Never Updated</h2>
<p>Processes change. Equipment is modified. Material specifications shift. New tools are introduced. If the standard work document is not updated when the process changes, it becomes a document of how the process used to work — and operators who are following reality rather than the document are technically "non-compliant" with a standard that no longer describes reality.</p>
<p>Standard work is a living document. Every process change, every Kaizen improvement, every corrective action that changes the method must trigger an update to the standard. If updating the standard is administratively difficult, the system will fail.</p>

<h2>What Working Standard Work Looks Like</h2>
<p>In factories where standard work is genuinely working, you can walk to any workstation, pick up the standard work document, observe the operator, and verify that what the operator is doing matches what the document describes. The document is visual and current. The operator can explain why each step is done the way it is. And when you ask the supervisor when the document was last updated, they can tell you exactly.</p>
`
  },
  {
    slug: 'kaizen-blitz-vs-kaizen-culture',
    title: 'Kaizen Blitz vs Kaizen Culture: Why One-Off Events Always Fail Long-Term',
    subtitle: 'The difference between factories that improve continuously and factories that run Kaizen events is not the events. It is what happens between them.',
    metaTitle: 'Kaizen Blitz vs Kaizen Culture: Why Events Fail Without Systems | Husni Halim',
    metaDesc: 'Running Kaizen events without building Kaizen culture produces temporary results. Lean consultant explains the difference between blitz-based and culture-based continuous improvement programmes.',
    category: 'Kaizen',
    readTime: '7 min read',
    date: 'June 2025',
    image: 'https://images.unsplash.com/photo-1542744094-24638eff58bb?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['Kaizen', 'Continuous Improvement', 'Lean Culture', 'Manufacturing'],
    body: `
<p>There are two types of factories that run Kaizen programmes. The first type runs events — focused, intensive workshops that produce documented improvements, get reported to management, and appear on the year-end performance review. The second type builds a system where improvement is how the factory thinks and operates every day. The difference in long-term performance between these two types is not marginal. It is categorical.</p>

<h2>What a Kaizen Blitz Actually Produces</h2>
<p>A Kaizen blitz — a concentrated improvement event run over three to five days — is a powerful tool. Under the right conditions, it can produce in five days what normal improvement cycles would take six months to achieve. The energy, focus, and cross-functional collaboration that a well-run event generates are genuinely valuable.</p>
<p>But a blitz has a characteristic failure mode: it produces improvements that belong to the event rather than to the process. The team that ran the event understands the changes. Everyone else experienced them as something that happened to their workplace. When the event team disperses, the organisational knowledge that produced the improvement disperses with it.</p>

<h2>What Kaizen Culture Actually Requires</h2>
<p>Kaizen culture is often described as "everyone improving every day" — which is accurate but insufficiently concrete to implement. The operational requirements of a genuine Kaizen culture are specific.</p>
<p>First, every operator must have a structured channel for surfacing improvement ideas. This is not a suggestion box — it is a regular, facilitated conversation between operators and supervisors about what is making the work harder than it needs to be. The response time from idea to implementation must be measured and managed.</p>
<p>Second, small improvements must be implemented immediately, without requiring the formal approval structures that Kaizen events require. A supervisor who has to submit a form and wait three weeks for approval to make a minor workstation ergonomic change will eventually stop trying.</p>
<div class="callout"><strong>The test:</strong> Ask any operator in your factory when they last suggested an improvement. Ask them what happened to it. If they cannot answer the first question, or if the answer to the second is "nothing," your factory does not have a Kaizen culture.</div>

<h2>The Bridge Between Blitz and Culture</h2>
<p>Kaizen events and Kaizen culture are not alternatives. The highest-performing factories use both — but in the right relationship. Events are used to address problems that require focused cross-functional attention and cannot be solved through daily incremental improvement. Between events, the culture of daily improvement is what prevents the decay that follows every blitz.</p>
<p>The transition from blitz-dependent to culture-driven improvement requires three things: a functioning daily management system where abnormalities are visible and responded to; a structured operator idea-generation and implementation process; and leadership behaviour that models improvement rather than just demanding it.</p>
<p>None of these require a significant financial investment. They require a consistent behavioural commitment from management that is sustained for long enough — typically 12 to 18 months — for the new habits to become the default way of operating.</p>
`
  },
  {
    slug: 'visual-management-failures',
    title: 'Visual Management Failures: Boards Nobody Reads',
    subtitle: 'Every lean factory has visual management boards. Very few of them actually manage anything. Here is the difference between decoration and function.',
    metaTitle: 'Visual Management Failures in Manufacturing | Why Boards Nobody Reads | Husni Halim',
    metaDesc: 'Visual management boards that nobody reads are worse than having no boards — they signal that the management system is not real. Lean consultant explains what effective visual management actually requires.',
    category: 'Lean Manufacturing',
    readTime: '7 min read',
    date: 'August 2025',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['Visual Management', 'Lean Manufacturing', 'Daily Management', 'Manufacturing'],
    body: `
<p>Walk through any Malaysian manufacturing plant that has implemented lean and you will find visual management boards. Production status boards. Quality trend charts. Safety scorecards. 5S audit results. OEE displays. They are on the walls, at the production lines, in the corridor between departments.</p>
<p>Now watch the operators and supervisors who work in front of those boards every day. Watch whether they look at them during a shift. Watch whether the data on those boards drives any observable decision or action. In most factories, the answer is no — and the boards have become expensive wallpaper.</p>

<h2>Why Most Boards Do Not Work</h2>
<p>The fundamental problem with most visual management implementations is that the boards were designed to report information upward — to give management visibility — rather than to help operators and supervisors manage their work in real time.</p>
<p>Information that flows only upward is reporting. Visual management that actually works flows laterally and downward — it gives the people doing the work the real-time information they need to make decisions about that work without waiting for management intervention.</p>
<div class="callout"><strong>The diagnostic question:</strong> Can an operator at this workstation look at the visual management in their area and immediately know whether they are ahead, behind, or on track — and what to do differently if they are behind? If the answer is no, the visual management is for management, not for operations.</div>

<h2>Boards Updated Weekly Are Not Visual Management</h2>
<p>A board showing last week's OEE number is a historical report. A board showing the current hour's production count against the hourly target is a management tool. The difference is the update frequency and the actionability of the information.</p>
<p>Visual management must be updated at the right frequency for the decisions it supports. Production status boards should be updated hourly, or in some high-velocity environments every pitch interval. Quality defect boards should be updated at the end of each batch or shift. Boards that are updated monthly or quarterly can usefully show trends — but they cannot drive real-time operations.</p>

<h2>No One Is Responsible for the Board</h2>
<p>Visual management boards without named owners decay rapidly. Data becomes outdated. Charts stop being updated when results are unfavourable. The board that was current in January is showing October numbers by March.</p>
<p>Every board needs a single named owner who is responsible for the accuracy and timeliness of its data. That owner should be the person who uses the board to manage their work — the line supervisor, not the lean coordinator.</p>

<h2>The Board Is Not Connected to a Daily Routine</h2>
<p>Visual management without a structured daily management routine is a display, not a system. The boards need to be the centrepiece of a regular, brief meeting where the team reviews status against plan, identifies problems, and agrees on immediate countermeasures.</p>
<p>The most effective format is a 15-minute stand-up at the board at the start of each shift — covering yesterday's performance, today's plan, any safety or quality concerns, and specific problems that need attention. The board provides the structure. The meeting provides the discipline. Together they create a real management system.</p>
`
  },
  {
    slug: 'poka-yoke-implementation-problems',
    title: 'Why Poka-Yoke Implementations Fail on Production Lines',
    subtitle: 'Error-proofing should make defects impossible. In practice, most poka-yoke devices are bypassed, broken, or ignored within months of installation.',
    metaTitle: 'Why Poka-Yoke Implementations Fail in Manufacturing | Husni Halim',
    metaDesc: 'Poka-yoke devices that get bypassed or ignored are not error-proofing — they are false confidence. Lean consultant explains why most poka-yoke implementations fail and how to design ones that hold.',
    category: 'Lean Manufacturing',
    readTime: '7 min read',
    date: 'September 2025',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['Poka-Yoke', 'Error Proofing', 'Quality', 'Lean Manufacturing'],
    body: `
<p>Poka-yoke — error-proofing — is one of the most elegant concepts in lean manufacturing. Design the process so the error is physically impossible to make. No training required, no discipline required, no inspection required. The defect simply cannot happen.</p>
<p>In practice, most poka-yoke implementations do not achieve this. The device gets bypassed during a production rush. The sensor gets taped over because it triggers false positives. The fixture that prevents incorrect assembly gets modified because it slows the line. Six months after installation, the error rate has returned to its pre-poka-yoke level — and the organisation has gained false confidence that the problem is solved.</p>

<h2>The Device Addresses the Symptom, Not the Source</h2>
<p>Many poka-yoke implementations are reactive — designed to detect an error after it has already occurred, rather than prevent the condition that causes the error. A light that alerts the operator when a part is assembled incorrectly is not error-proofing. It is error-detection. The assembly error has still happened. The poka-yoke has just caught it slightly earlier.</p>
<p>True error-proofing makes the incorrect action physically impossible. A fixture that only accepts a correctly oriented part, not one that beeps when the part is oriented incorrectly. The distinction matters because detection-based poka-yoke depends on the operator responding correctly to the alert, which introduces human judgment back into a system that was meant to eliminate it.</p>

<h2>The Device Creates a Production Constraint</h2>
<p>Operators who are being measured on output will bypass any device that slows them down, if bypassing is physically possible and the bypass is not immediately visible to supervision.</p>
<p>A poka-yoke that is bypassed provides no protection against the error it was designed to prevent — and creates the additional problem of giving quality management the false impression that the error is controlled. This is more dangerous than having no poka-yoke at all.</p>
<div class="callout"><strong>Design principle:</strong> A poka-yoke that can be bypassed will be bypassed. The device design must make bypass either physically impossible or immediately obvious — not rely on operator compliance with a rule against bypass.</div>

<h2>No Maintenance System for the Devices</h2>
<p>Poka-yoke devices are equipment. Like all equipment, they degrade, fail, and require maintenance. Sensors drift. Fixtures wear. Electrical connections corrode. A poka-yoke that has failed silently — still appearing to function but no longer detecting the error condition — is indistinguishable from a functioning device until a defect escapes.</p>
<p>Every poka-yoke device needs a verification protocol: a periodic test using a known defective part that verifies the device correctly identifies the error condition. This test must be scheduled, documented, and treated with the same seriousness as any other critical process check.</p>

<h2>The Error Rate After Installation Is Not Measured</h2>
<p>The effectiveness of a poka-yoke must be measured after installation. If the defect rate for the error that was targeted has not dropped to zero or near-zero, the poka-yoke is not working. Most organisations install the device, report that "poka-yoke has been implemented," and do not verify whether the target defect rate has actually changed.</p>
<p>Measurement closes the loop. It identifies whether the implementation has achieved its purpose — and if not, it forces the question of why, which leads to the design improvements that make the device actually effective.</p>
`
  },
  {
    slug: 'pdca-implementation-problems',
    title: 'PDCA in Malaysian SMEs: Why It Always Gets Stuck at Plan',
    subtitle: 'The PDCA cycle is four steps. Most Malaysian manufacturing SMEs complete one and a half of them. Here is why — and what a full PDCA cycle actually looks like in practice.',
    metaTitle: 'PDCA Implementation Problems in Malaysian SMEs | Husni Halim',
    metaDesc: 'Most Malaysian manufacturing SMEs plan extensively and do minimally. PDCA specialist explains why the cycle stalls, why "check" never happens, and how to run PDCA that produces real results.',
    category: 'Continuous Improvement',
    readTime: '7 min read',
    date: 'October 2025',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['PDCA', 'Continuous Improvement', 'SME Malaysia', 'Problem Solving'],
    body: `
<p>Deming's PDCA cycle — Plan, Do, Check, Act — is the most widely taught problem-solving framework in Malaysian manufacturing. It appears in HRDC training programmes, ISO procedure manuals, and KPI reports across the country. It is also the most consistently incomplete improvement methodology in practice.</p>
<p>The observable reality in most Malaysian manufacturing SMEs: teams plan extensively, do incompletely, skip check entirely, and rarely act in the sense of standardising and propagating what worked. The cycle completes about 30% of its rotation and then stops.</p>

<h2>Why Plan Phase Takes All the Time</h2>
<p>Planning feels productive. Meetings are held. Root cause analyses are drawn. Fishbone diagrams are completed. Action plans are written. Presentations are made to management. All of this activity creates the impression of progress without requiring any change to the actual process.</p>
<p>The planning phase has no natural endpoint in many organisations — it can always be more thorough, more complete, more validated. This is compounded by organisational risk aversion: implementing a countermeasure requires committing to a course of action that might not work, and that failure is visible. Planning does not carry that exposure.</p>
<div class="callout"><strong>Rule of thumb:</strong> If your team has been in the Plan phase for more than two weeks on a shop-floor problem, the planning is no longer the constraint. The constraint is the decision to implement.</div>

<h2>Why Do Phase Is Incomplete</h2>
<p>Implementation is partial because the countermeasures designed in the Plan phase often turn out to be more difficult to implement than anticipated. Equipment constraints, budget limitations, or scheduling conflicts mean that only some of the planned actions get executed. The team moves to "check" before the implementation is complete — and then wonders why the results are not as expected.</p>
<p>The discipline of the Do phase requires completing the implementation as designed before measuring results. Measuring a partial implementation produces data that cannot be meaningfully interpreted — you do not know whether the incomplete actions are why the results are insufficient.</p>

<h2>Why Check Never Happens</h2>
<p>The Check phase requires collecting data and comparing it objectively against the target established in the Plan phase. This comparison will produce one of two findings: either the countermeasure worked, or it did not work as expected. Both are valuable findings. The second is unwelcome.</p>
<p>Organisations that have not normalised "this did not work as expected" as a legitimate outcome of the Check phase — where it is treated as learning rather than failure — will unconsciously avoid rigorous checking. The result is that countermeasures that are partially effective are declared successes, and the root cause remains partially unaddressed.</p>

<h2>Why Act Never Standardises</h2>
<p>When a countermeasure does work, the Act phase should result in the successful method being standardised and applied wherever the same root cause exists elsewhere in the factory. This is the compounding mechanism of PDCA — not just fixing one problem, but building organisational capability by capturing what works and replicating it.</p>
<p>In practice, standardisation is skipped because it requires updating procedures, retraining operators, and communicating across departments — all of which take more effort than the team has available after the immediate problem is resolved. The improvement is real but localised. The same problem recurs on a different line six months later, and the cycle starts again from scratch.</p>
`
  },
  {
    slug: 'andon-system-implementation-problems',
    title: 'Andon Systems That Nobody Uses After Installation',
    subtitle: 'Andon is one of the most powerful tools in the Toyota Production System. In most non-Toyota factories, it is an expensive light installation that operators learn to ignore.',
    metaTitle: 'Andon System Implementation Problems in Manufacturing Malaysia | Husni Halim',
    metaDesc: 'Andon systems that operators do not activate are not andon systems — they are coloured lights. Lean consultant explains why andon implementations fail and what a functioning andon system requires.',
    category: 'Lean Manufacturing',
    readTime: '7 min read',
    date: 'November 2025',
    image: 'https://images.unsplash.com/photo-1565618014297-ec85f49db6aa?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['Andon', 'Lean Manufacturing', 'Toyota Production System', 'Factory Management'],
    body: `
<p>The andon system is one of the most recognisable elements of the Toyota Production System. When a problem occurs at a workstation, the operator activates the andon — a signal that alerts the team leader, triggers a swift response, and if the problem is not resolved within a defined response time, stops the line.</p>
<p>The concept is simple and powerful. The implementation in non-Toyota environments is consistently problematic. The most common outcome: the andon system is installed, operators are trained, and within three months, activations have dropped to near zero — not because problems have stopped occurring, but because operators have learned that activating the andon is not worth the consequences.</p>

<h2>Operators Are Discouraged from Activating</h2>
<p>In Toyota, activating the andon is a respected act — it surfaces a problem, contributes to quality, and triggers a support response. In many Malaysian factories, activating the andon is experienced as triggering a blame response. Who caused the problem? Why did this happen? Why is the line stopped?</p>
<p>Operators who experience activation as the beginning of an interrogation will stop activating. This is a rational response to the incentive structure they are operating in — not a training failure or a discipline failure. It is a management culture failure.</p>
<div class="callout"><strong>The test:</strong> Ask your operators what happens after they activate the andon. If the honest answer involves any form of blame or negative consequence for the activating operator, your andon system will not function as designed regardless of the quality of the installation.</div>

<h2>Response Times Are Too Long</h2>
<p>Andon is designed for rapid response — team leader response in under 60 seconds in high-functioning implementations. In most factories, the response time is measured in minutes. Operators who need help and receive it five minutes later — after their frustration has peaked and the immediate moment of the problem has passed — learn to solve problems themselves rather than wait for a response that arrives too late to be useful.</p>
<p>Long response times are usually a staffing problem: not enough team leaders covering enough production area, or team leaders who are occupied with administrative tasks rather than being present on the floor. Andon requires that someone is always available to respond. If that condition cannot be met, the andon system cannot function.</p>

<h2>The System Has No Authority to Stop Production</h2>
<p>In Toyota, the andon has the authority to stop the production line. In many factories, the fear of production stoppage means that operators are explicitly or implicitly told not to stop the line — only to signal for help, which may or may not arrive before the problem becomes a defect.</p>
<p>An andon system that cannot stop production is not an andon system. It is a help request button. It does not prevent defects from being produced. It does not change the fundamental quality accountability of the system. It is a more expensive version of raising your hand.</p>

<h2>What a Functioning Andon System Requires</h2>
<p>Three non-negotiable conditions: a management culture where activation is treated as a positive contribution rather than a problem source; response times that are measured, targeted, and consistently achieved; and the genuine authority to stop production when the problem cannot be resolved within the response window. Remove any one of these and the system will not function as designed.</p>
`
  },
  {
    slug: 'gemba-walk-problems',
    title: 'Why Gemba Walks Do Not Work: Doing Gemba the Wrong Way',
    subtitle: 'Gemba walks are one of the most powerful habits in lean leadership. They are also one of the most commonly performed incorrectly — producing the appearance of engagement without any of the substance.',
    metaTitle: 'Why Gemba Walks Do Not Work in Malaysian Manufacturing | Husni Halim',
    metaDesc: 'Gemba walks that audit rather than learn are not gemba walks. Lean consultant explains the most common gemba walk mistakes in Malaysian manufacturing and what effective gemba leadership looks like.',
    category: 'Lean Manufacturing',
    readTime: '7 min read',
    date: 'January 2026',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['Gemba Walk', 'Lean Leadership', 'Continuous Improvement', 'Factory Management'],
    body: `
<p>Gemba walk is a Japanese management practice meaning "go to the actual place" — the practice of leaders regularly visiting the shop floor not to inspect and direct, but to observe, understand, and support the people doing the work. Toyota leaders are famous for their gemba discipline, and the practice has been widely adopted in Malaysian manufacturing as part of lean implementation programmes.</p>
<p>The adoption has been mostly superficial. Gemba walks are scheduled, conducted, and reported. And they produce almost no operational improvement — because almost every common error in gemba walk practice undermines the purpose of the activity.</p>

<h2>The Walk Is an Audit, Not an Observation</h2>
<p>The most damaging gemba walk mistake is treating it as an inspection. The leader walks through the production area looking for non-conformances: 5S violations, operators not following standard work, safety hazards. Problems are noted. People are held accountable. The leader returns to the office.</p>
<p>This is an audit, not a gemba walk. Audits serve a different purpose and require a different mindset. Gemba walking as an audit creates defensive behaviour from operators and supervisors — people straighten up, put things away, and answer questions with what management wants to hear rather than what is actually happening. The leader returns to the office with a false picture of the operation.</p>
<div class="callout"><strong>The purpose of gemba:</strong> To understand the actual conditions of work. To see the problems that standard reports do not capture. To ask questions that surface the knowledge of the people closest to the work. None of this is achievable when the walk creates defensiveness.</div>

<h2>Leaders Talk More Than They Observe</h2>
<p>Effective gemba requires sustained, silent observation before any conversation. A leader who arrives at a workstation, watches for 30 seconds, and then begins directing — telling operators what they should be doing differently, explaining what the correct method is — has not observed. They have visited and lectured.</p>
<p>The discipline of gemba observation requires standing at a workstation for long enough to understand the work cycle, to notice the informal workarounds that operators have developed, to see where the hesitations and recoveries happen. This typically takes five to ten minutes of sustained attention. It is not natural for leaders accustomed to action and decision-making. It must be practised deliberately.</p>

<h2>Questions Are Leading, Not Open</h2>
<p>When leaders do ask questions during gemba walks, they frequently ask leading questions: "Shouldn't this be stored over here?" "Is this the correct procedure?" "Do you know the target for today?"</p>
<p>Leading questions confirm what the leader already believes. They do not surface the operator's actual experience of the work. Effective gemba questions are open: "What makes this step the hardest?" "What would you change about this process if you could?" "What is stopping you from hitting the target today?" These questions elicit information the leader cannot obtain from reports — and that information is the value of gemba.</p>

<h2>No Follow-Through on What Was Learned</h2>
<p>Even when a gemba walk is conducted correctly — observing properly, asking open questions, listening genuinely — it produces no value if what was learned is not acted on. Operators and supervisors who surface real problems during gemba walks and receive no follow-up will stop surfacing real problems. The walk becomes a performance: leaders perform observation, operators perform normalcy.</p>
<p>Every gemba walk should result in specific follow-up commitments — problems identified, owners assigned, timelines established. And those commitments must be tracked and completed. The credibility of gemba depends entirely on what happens after the walk ends.</p>
`
  },
  {
    slug: 'oee-training-malaysia',
    title: 'OEE Training Malaysia: The Complete Guide for Manufacturing Leaders',
    subtitle: 'Overall Equipment Effectiveness is the most widely misunderstood KPI in Malaysian manufacturing. This guide explains what OEE actually measures, why most OEE numbers are wrong, and what real OEE improvement requires.',
    metaTitle: 'OEE Training Malaysia | HRDC Claimable | Husni Halim',
    metaDesc: 'HRDC claimable OEE training in Malaysia by certified consultant. Serving automotive, semiconductor, aerospace MRO, and FMCG sectors. Proven results across 30+ factories.',
    category: 'OEE & TPM',
    readTime: '11 min read',
    date: 'October 2024',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['OEE', 'TPM', 'HRDC Claimable', 'Manufacturing Malaysia', 'Productivity'],
    body: `
<p>Overall Equipment Effectiveness — OEE — is the most commonly reported manufacturing KPI in Malaysia. It is also the most consistently misunderstood, miscalculated, and misused metric in the industry. Plants report OEE numbers of 85% and above while producing at rates that suggest 45% or below. The gap between the number and reality is not fraud — it is a systematic misunderstanding of what OEE is designed to measure.</p>
<p>This guide covers what OEE actually measures, the most common calculation errors, what world-class OEE looks like by industry, and what a structured OEE improvement programme requires.</p>

<h2>What OEE Actually Measures</h2>
<p>OEE is the product of three factors: Availability, Performance, and Quality. Each factor measures a specific category of loss.</p>
<p>Availability measures time losses — unplanned downtime, planned downtime, and changeover time relative to the planned production window. Performance measures speed losses — the gap between the actual production rate and the designed maximum rate of the equipment. Quality measures defect losses — the proportion of output that meets specification on the first pass.</p>
<p>A true OEE calculation uses the theoretical maximum capacity of the equipment as its baseline — not the "practical" capacity or the "best demonstrated rate" or the "target rate." If the equipment is theoretically capable of producing 600 units per hour and is producing 480, the Performance rate is 80%, not 100%.</p>
<div class="callout"><strong>World-class OEE benchmarks:</strong> Discrete manufacturing: 85% | Process manufacturing: 90% | New equipment in first year: 65% typical | Malaysian manufacturing average: 55-65%</div>

<h2>The Most Common OEE Calculation Errors in Malaysia</h2>
<p>The most prevalent error is using a planned or target rate as the Performance denominator rather than the theoretical maximum rate. This inflates the Performance component and produces an OEE number that flatters the operation without reflecting its true efficiency.</p>
<p>The second most common error is excluding planned downtime from the Availability calculation. Planned maintenance, planned changeovers, and scheduled cleaning stops are real time losses. Excluding them from OEE treats them as unavoidable — which removes the incentive to reduce them through TPM and SMED programmes.</p>
<p>The third error is measuring quality on inspected output rather than all output. If defective parts are reworked before counting, the Quality factor is artificially elevated and the actual first-pass yield is obscured.</p>

<h2>OEE by Industry Sector in Malaysia</h2>
<table>
<thead><tr><th>Sector</th><th>Typical OEE Range</th><th>Primary Loss Category</th><th>Key Improvement Focus</th></tr></thead>
<tbody>
<tr><td>Automotive Components</td><td>60–75%</td><td>Changeover time</td><td>SMED, quick die change</td></tr>
<tr><td>Semiconductor</td><td>70–85%</td><td>Minor stoppages</td><td>Autonomous maintenance, andon</td></tr>
<tr><td>Food & Beverage</td><td>50–70%</td><td>Cleaning and changeover</td><td>Hygienic design, SMED</td></tr>
<tr><td>Aerospace MRO</td><td>55–70%</td><td>Availability and waiting</td><td>Parts planning, workflow redesign</td></tr>
<tr><td>Plastics & Rubber</td><td>55–72%</td><td>Speed losses</td><td>Mould maintenance, parameter control</td></tr>
</tbody>
</table>

<h2>What a Structured OEE Improvement Programme Requires</h2>
<p>OEE improvement is not an event — it is a system. The five components of a functioning OEE improvement system are: accurate real-time data collection at the equipment level; a loss categorisation system that distinguishes between the Six Big Losses; daily review of the previous shift's OEE by the production team; a structured countermeasure process for the top loss category; and a TPM programme that addresses equipment reliability as the foundation for Availability improvement.</p>
<p>The most common shortcut organisations take is to focus on the OEE number rather than on the underlying losses. An OEE score is a lag indicator. The leading indicators are the loss categories and their trends. Improving OEE requires understanding and attacking the specific losses that make up the gap between current and target — not managing the score itself.</p>

<h2>HRDC Claimable OEE Training in Malaysia</h2>
<p>OEE training programmes in Malaysia can be claimed under HRDC (Human Resource Development Corporation) for eligible employers. A structured OEE training programme covering measurement methodology, loss analysis, TPM fundamentals, and improvement project facilitation is typically delivered over two to three days, with a project component that applies the methodology to actual equipment in the participant's facility.</p>
<p>The most effective OEE training programmes are not classroom programmes. They are delivered at the factory, using the factory's actual equipment and actual loss data, with participants who are responsible for the equipment's performance. This ensures that the training produces an improvement plan that is immediately actionable rather than a generic understanding that does not translate to implementation.</p>
`
  },
  {
    slug: 'kaizen-coaching-mro-aviation-malaysia',
    title: 'Kaizen Coaching for MRO and Aviation Maintenance Malaysia',
    subtitle: 'Aviation MRO is one of the most complex operational environments in Malaysian industry. Here is how Kaizen coaching applies to hangar operations, component shops, and maintenance planning — and why the approach must be different from conventional factory-floor lean.',
    metaTitle: 'Kaizen Coaching for MRO and Aviation Maintenance Malaysia | Husni Halim',
    metaDesc: 'Kaizen coaching for aviation MRO in Malaysia. Reduce TAT, improve hangar 5S, and standardise maintenance workflows. HRDC claimable. By MPC Certified consultant.',
    category: 'Kaizen',
    readTime: '10 min read',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['Kaizen', 'MRO', 'Aviation Maintenance', 'Lean Manufacturing', 'Malaysia'],
    body: `
<p>Malaysia's aviation MRO (Maintenance, Repair, and Overhaul) sector is one of the most technically demanding industrial environments in the country. Facilities in Subang, KLIA, Penang, and Johor Bahru perform everything from routine line maintenance and scheduled A-checks to heavy C-checks and D-checks on widebody aircraft. The workforce is highly credentialled — licensed aircraft maintenance engineers, CAAM-approved inspectors, and specialised avionics technicians — yet the operations that surround their technical work are frequently chaotic, slow, and wasteful.</p>

<p>This is where Kaizen coaching makes a measurable difference. Not Kaizen as it is practised on an automotive stamping line or a food processing plant — MRO Kaizen requires a calibrated approach that respects regulatory constraints, safety culture, and the inherent variability of aircraft maintenance work. When applied correctly, it delivers significant reductions in turn-around time (TAT), dramatic improvements in parts availability and hangar flow, and a measurable increase in the proportion of mechanics' time spent on value-adding work rather than waiting, searching, and walking.</p>

<h2>Why Kaizen in Aviation MRO is Different From Factory Lean</h2>

<p>Most Kaizen frameworks were developed for repetitive, high-volume manufacturing environments where process variation is the enemy and standardisation is the goal. Aviation MRO has a fundamentally different production structure. Aircraft come in different configurations, different maintenance histories, and different findings that are discovered only after inspection begins. The scope of a C-check is never fully known until the first stage of the work package is opened. This variability is not a defect in the process — it is an inherent characteristic of complex maintenance work.</p>

<p>This means that Kaizen in MRO cannot simply eliminate variation. Instead, it must distinguish between necessary variability — the kind driven by actual aircraft condition — and unnecessary waste: time spent waiting for job cards, searching for tooling, chasing parts, repeating paperwork, or navigating a disorganised hangar bay. The first category must be managed; the second can and should be eliminated.</p>

<p>The other critical difference is the regulatory environment. CAAM, FAA, and EASA requirements mean that process changes in aviation MRO must go through a structured approval pathway. A Kaizen improvement that changes a maintenance procedure, a tool calibration process, or a parts handling method cannot simply be implemented on Monday after a Friday workshop. This is not an obstacle to Kaizen — it is a design constraint that shapes how improvement projects are structured and timed.</p>

<h2>Five Kaizen Principles That Deliver Results in Malaysian Aviation MRO</h2>

<h3>1. Gemba-Based Problem Identification</h3>

<p>The first step in any MRO Kaizen engagement is structured observation on the hangar floor — not interviews, not reports, and not management estimates of where the time goes. In every MRO facility I have worked with in Malaysia, the actual distribution of mechanics' time is dramatically different from what supervisors believe. A typical finding: mechanics in a component shop spend 35 to 45 percent of their working time in activities that are not direct maintenance work — waiting for parts, locating tools, completing or correcting paperwork, or coordinating with planning and stores. Kaizen starts by making this visible through time-observation studies, then systematically attacking the largest non-value-adding categories.</p>

<h3>2. 5S as a Foundation, Not a Housekeeping Programme</h3>

<p>5S in an aviation hangar is not about aesthetics. It is about safety, reliability, and speed. A Foreign Object Damage (FOD) event caused by an unsecured tool is a serious safety and regulatory incident. A mechanic who cannot find the correct torque wrench in under two minutes has a workflow problem, not a discipline problem. When 5S is implemented correctly in MRO — with shadow boards, dedicated tool stations, clearly demarcated work zones, and visual indicators for calibration status — it eliminates a large category of daily friction and creates the visual control environment that makes standard work possible. The challenges of implementing 5S sustainably, and why it typically stalls after the initial audit, are covered in detail in <a href="/blog/5s-implementation-problems/">5S implementation problems in Malaysian factories</a>.</p>

<h3>3. Standard Work for Repeatable Maintenance Tasks</h3>

<p>Not all MRO work is variable. A significant proportion of hangar activity involves tasks that are performed on every aircraft of a given type, on every visit of a given check interval, under the same conditions. Tyre changes, oil servicing, toilet servicing, galley equipment inspections, and many avionics functional checks are essentially repetitive. Standard work for these tasks — including the sequence of steps, the tooling required, the acceptance criteria, and the time allocation — reduces variation, accelerates training of new technicians, and provides a baseline against which actual performance can be measured. The key failure mode, where standard work is created but never followed, is explored in <a href="/blog/standard-work-implementation-problems/">why standard work documentation fails in lean manufacturing</a>.</p>

<h3>4. Pull-Based Parts and Materials Flow</h3>

<p>Parts waiting is one of the largest sources of TAT loss in Malaysian MRO operations. Aircraft on jacks cannot progress to the next maintenance phase when the required parts have not been kitted and staged. The typical MRO response is to build larger parts buffer stocks — which ties up working capital and creates its own inventory management problems. The Kaizen approach is to analyse the actual demand patterns for high-frequency consumables and rotable parts, redesign the kitting and staging process to bring parts to the point of use before the mechanic needs them, and establish a visual replenishment system for consumables so that stockouts are visible before they create delays. This is a pull-flow principle applied to a service environment — and it delivers measurable TAT improvement within weeks of implementation.</p>

<h3>5. Visual Management of Maintenance Progress</h3>

<p>In a complex C-check with 800 to 1,200 job cards across multiple aircraft zones, managing progress is a planning and communication challenge. Many Malaysian MRO facilities rely on their MRO management software for status tracking — but the information is often updated late, incomplete, or inaccessible to the mechanics and team leads who need it in real time on the hangar floor. Visual management in MRO means bringing the critical schedule information to where the work happens: zone boards showing job card completion status by day, visual indicators for items awaiting inspection sign-off, and escalation signals for jobs that are behind schedule. This is the MRO equivalent of the andon system in manufacturing — making problems visible immediately rather than discovering them at the daily coordination meeting.</p>

<h2>Turn-Around Time: The Primary KPI for MRO Kaizen</h2>

<p>In aviation MRO, the equivalent of OEE is TAT — Turn-Around Time. The faster an aircraft can be returned to service after scheduled maintenance, the more revenue it generates for the airline and the more capacity the MRO facility can sell. TAT is also the primary competitive differentiator among Malaysian MRO providers competing for regional airline contracts.</p>

<table>
<thead><tr><th>Kaizen Focus Area</th><th>Typical TAT Impact</th><th>Implementation Timeframe</th><th>Complexity</th></tr></thead>
<tbody>
<tr><td>5S and tooling organisation</td><td>5–10% TAT reduction</td><td>4–8 weeks</td><td>Low</td></tr>
<tr><td>Parts kitting and staging</td><td>10–20% TAT reduction</td><td>8–12 weeks</td><td>Medium</td></tr>
<tr><td>Standard work for repetitive tasks</td><td>8–15% TAT reduction</td><td>12–20 weeks</td><td>Medium–High</td></tr>
<tr><td>Visual management and zone boards</td><td>5–12% TAT reduction</td><td>4–8 weeks</td><td>Low–Medium</td></tr>
<tr><td>Full Kaizen coaching programme (all areas)</td><td>20–35% TAT reduction</td><td>6–12 months</td><td>High</td></tr>
</tbody>
</table>

<p>The combined effect of a structured Kaizen coaching programme across all five focus areas typically delivers a 20 to 35 percent reduction in TAT for the targeted check type. For a Malaysian MRO facility performing 40 to 60 C-checks per year, a 25 percent TAT reduction represents significant additional capacity — and a corresponding improvement in contract competitiveness and revenue per bay-day.</p>

<h2>Common Failure Modes in MRO Kaizen Programmes</h2>

<p>MRO Kaizen fails for the same reasons it fails in manufacturing — but with additional failure modes specific to the aviation environment. The most common are: treating Kaizen as a one-time workshop rather than a sustained coaching engagement; attempting to apply factory-floor Kaizen tools directly without adapting them to the MRO context; not securing CAAM or engineering approval before attempting to standardise maintenance procedures; and running improvement projects on non-bottleneck activities while the critical path through the C-check remains unchanged.</p>

<p>The last point is particularly important. In a complex C-check, there is always a critical path — a sequence of interdependent tasks that determines the minimum possible TAT regardless of how efficiently all other work is done. Kaizen effort invested outside the critical path produces no TAT improvement. This is the same constraint-focused logic described in the OEE improvement context: improvement at a non-bottleneck is waste in a systems sense, regardless of how impressive it looks at the team level. The pattern of Kaizen effort dissolving into activity without results is explored in <a href="/blog/why-kaizen-events-fail/">why Kaizen events fail in manufacturing plants</a>.</p>

<div class="callout">
  <strong>What a Kaizen Coaching Engagement Looks Like in Malaysian Aviation MRO</strong>
  <p>A structured MRO Kaizen coaching programme typically runs over six to twelve months and includes an initial diagnostic phase (two to three days of gemba observation and data collection), a prioritised improvement roadmap based on actual TAT loss drivers, facilitated Kaizen workshops for the top two to three improvement areas, standard work development and visual management implementation, and a monthly coaching cadence with the operations and planning team to sustain gains and build internal lean capability. The goal is not just to improve TAT for the current programme — it is to build a facility where the operations team can identify and solve its own flow problems without external support. <a href="/#contact">Contact Husni to discuss a programme scoped to your facility.</a></p>
</div>

<h2>HRDC Claimable Kaizen Training for Aviation MRO Teams</h2>

<p>Kaizen and lean manufacturing training for Malaysian MRO teams is eligible for HRDC (Human Resource Development Corporation) claims under SBL-Khas for registered employers. Training can be delivered in a format specifically adapted for aviation maintenance personnel — with case examples drawn from hangar environments, component shops, and line maintenance operations rather than automotive or semiconductor factories. Participants from planning, stores, maintenance, and quality functions benefit most when trained together, as TAT improvement requires cross-functional coordination that classroom training alone cannot develop.</p>

<p>The most effective programme combines two to three days of foundational Kaizen and lean principles training with a live improvement project at the facility — identifying a real TAT or flow problem, analysing it using lean tools, and implementing the first improvement actions before the training closes. This approach ensures the training produces tangible results rather than theoretical knowledge that does not survive contact with the day-to-day pressures of a live MRO operation.</p>

<p>If your MRO facility is under pressure on TAT, dealing with recurring parts availability issues, or struggling to sustain 5S after the initial launch, a Kaizen diagnostic is the fastest way to identify where the improvement leverage actually is. <a href="/#contact">Reach out through the contact section</a> to discuss what a programme scoped to your operation would look like.</p>
`
  },
  {
    slug: 'oee-semiconductor-factories-malaysia',
    title: 'How to Improve OEE in Semiconductor Factories Malaysia',
    subtitle: 'Malaysian semiconductor plants run 15 to 30 percentage points below world-class OEE. Here is what the data shows, what drives the gap, and the improvement roadmap that actually works in backend assembly and test operations.',
    metaTitle: 'How to Improve OEE in Semiconductor Factories Malaysia | Husni Halim',
    metaDesc: 'HRDC certified consultant explains how to improve OEE in Malaysian semiconductor factories. Loss analysis, benchmarks, and improvement roadmap for backend assembly and test.',
    category: 'OEE & TPM',
    readTime: '10 min read',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['OEE', 'Semiconductor', 'TPM', 'Lean Manufacturing', 'Malaysia'],
    body: `
<p>Malaysia's semiconductor sector is under pressure. With global chip demand fluctuating and factory managers squeezed between rising energy costs and headcount constraints, improving Overall Equipment Effectiveness (OEE) has moved from a "nice to have" metric to a survival imperative. Yet most Malaysian semiconductor plants I visit are running OEE between 55% and 70% — well below the world-class benchmark of 85%.</p>

<p>This guide explains why semiconductor OEE improvement is fundamentally different from automotive or FMCG manufacturing, what the real loss drivers are, and what a practical improvement roadmap looks like — not a textbook framework, but what actually works on the production floor of Malaysian fabs and backend assembly operations in Penang, Kulim, and the Klang Valley.</p>

<h2>Why Semiconductor OEE Is Different From Other Industries</h2>

<p>Most OEE frameworks were developed for high-volume, low-mix manufacturing. Semiconductor fabrication is the opposite: long cycle times, complex multi-step processes, clean room constraints, and yield-based quality losses that do not behave like the defect rates you see in automotive stamping or food processing.</p>

<p>In a typical Malaysian backend semiconductor plant — IC assembly, wire bonding, moulding, or test — three dynamics make OEE management uniquely challenging:</p>

<p><strong>Recipe complexity.</strong> A single wire bonder may run 40 to 80 different device types per shift, each with its own bonding parameters, die size, and pad layout. Changeover loss is embedded in the process, not an exception to be eliminated.</p>

<p><strong>Equipment sensitivity.</strong> Machines like die attach, wire bond, and flip chip tools are highly sensitive to temperature, humidity, and vibration. Minor environmental drift causes yield loss that shows up as quality OEE loss — but the root cause is actually an equipment or facility issue, not operator error.</p>

<p><strong>Interdependent bottlenecks.</strong> In semiconductor flow, the constraint shifts. A short burst of downtime at the wire bonder does not necessarily affect output if the moulding press is already the bottleneck. Traditional OEE measured at each machine independently can mislead improvement priorities and waste engineering resources on non-constraint equipment.</p>

<p>This is why simply installing an OEE monitoring system and chasing daily OEE percentages rarely moves the needle in semiconductor manufacturing. The measurement framework must match the operational reality.</p>

<h2>The Three Loss Categories That Drive Down Semiconductor OEE</h2>

<p>The standard OEE formula — Availability x Performance x Quality — applies to semiconductor, but the dominant losses within each category are different from what you encounter in other sectors.</p>

<h3>1. Availability Losses: Unplanned Downtime and Minor Stoppages</h3>

<p>Across the semiconductor backend plants I have worked with, unplanned downtime accounts for 40% to 60% of total OEE loss. Common culprits include wire bonder jamming from lead frame misfeeds often linked to incoming reel quality variation, moulding press compound blockages caused by incorrect pre-heat parameters, vision system false rejects that halt automatic transfer between stations, and vacuum system failures causing pick-and-place heads to misplace dies.</p>

<p>Many plants track these as "minor stoppages" separately from "breakdowns" and fail to apply the same rigour of root cause analysis. A stoppage that takes four minutes to clear and occurs 15 times per shift is costing you one hour of capacity — the same as a single one-hour breakdown — but it never appears on the formal breakdown log and never triggers a proper countermeasure.</p>

<h3>2. Performance Losses: Speed and Rate Losses</h3>

<p>Running below rated speed is endemic in Malaysian semiconductor plants, and it is almost always invisible. Machine operators and technicians routinely slow down wire bonders or test handlers by five to ten percent "to reduce defects" — a workaround that suppresses the symptom without fixing the root cause. The result is a chronic performance OEE loss that no one officially owns.</p>

<p>The fix requires engineering discipline: document the designed cycle time per device type, measure actual cycle time daily, and require a formal deviation approval process before any speed reduction is permitted. This is standard work applied to equipment settings, and it is a principle covered in detail in <a href="/blog/standard-work-implementation-problems/">why standard work never gets followed after training</a>.</p>

<h3>3. Quality Losses: Yield and Scrap</h3>

<p>Semiconductor quality loss in OEE terms captures the cost of defects — units that fail electrical test, visual inspection, or dimensional checks. In backend assembly, yield losses cluster around three areas: wire bond quality including looping height, ball size, and pull strength; mould void and delamination; and mark legibility failures. Each has its own diagnostic path, and most require correlation analysis between process parameters and test results — something that operators cannot do without engineering support and proper data infrastructure. Without this infrastructure, quality losses in OEE are tracked but never systematically reduced.</p>

<h2>OEE Benchmarks: Typical vs World-Class for Semiconductor Malaysia</h2>

<table class="compare-table">
  <thead>
    <tr>
      <th>OEE Component</th>
      <th>Typical Malaysian Semiconductor Plant</th>
      <th>World-Class Benchmark</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Availability</td>
      <td>75–82%</td>
      <td>90% or above</td>
    </tr>
    <tr>
      <td>Performance</td>
      <td>80–88%</td>
      <td>95% or above</td>
    </tr>
    <tr>
      <td>Quality (Yield)</td>
      <td>92–97%</td>
      <td>99% or above</td>
    </tr>
    <tr>
      <td>Overall OEE</td>
      <td>55–70%</td>
      <td>85% or above</td>
    </tr>
  </tbody>
</table>

<p>The 15 to 30 percentage point gap between typical and world-class is not an engineering impossibility. It is a management and systems gap. The equipment capacity is there — Malaysian semiconductor plants use the same equipment platforms as world-class fabs in Japan, Taiwan, and South Korea. The question is whether the organisation has the data discipline, improvement capability, and management system to unlock the capacity that already exists inside the factory.</p>

<div class="callout">
  <strong>HRDC Claimable OEE Training for Semiconductor Teams</strong>
  <p>Husni Halim delivers structured OEE and TPM training workshops designed specifically for Malaysian semiconductor and electronics manufacturing environments. All programmes are HRDC claimable under SBL-Khas. Delivered on-site using your actual production data and equipment. Suitable for production engineers, maintenance leads, and manufacturing managers. <a href="/#contact">Contact Husni for a consultation</a> or read the complete <a href="/blog/oee-training-malaysia/">OEE Training Malaysia guide</a>.</p>
</div>

<h2>A Practical OEE Improvement Roadmap for Semiconductor Plants</h2>

<p>Theory aside, here is the sequence that produces results in Malaysian semiconductor factories — based on programmes I have led across backend assembly and test operations:</p>

<h3>Step 1: Fix Your OEE Data Collection Before Anything Else</h3>

<p>Before you can improve OEE, you need accurate OEE data. Most plants I audit have three different OEE numbers for the same production line: one from the machine SCADA, one from the production system, and one from the shift supervisor's daily report. They rarely agree, and in most cases none of them are fully correct.</p>

<p>Start with a single agreed definition of loading time, planned downtime, and all loss categories. Define what counts as a breakdown versus a minor stoppage versus a changeover. Get engineering, production, and maintenance to sign off on the definitions and the measurement logic. Only then does your OEE number mean something actionable.</p>

<h3>Step 2: Focus Improvement on the Constraint, Not Every Machine</h3>

<p>Improving OEE at a non-bottleneck machine produces zero additional output. In semiconductor backend flow, identify the rate-limiting operation — often wire bonding or final test — and focus all improvement energy there first. A five percent OEE improvement at the constraint is worth more than a twenty percent improvement spread across all other workstations combined.</p>

<p>This is where most Malaysian semiconductor improvement programmes fail. Random improvement activity spread across all machines is why Kaizen programmes stall — a pattern explored in <a href="/blog/why-kaizen-events-fail/">why Kaizen events fail in manufacturing plants</a>. Constraint-focused improvement is not obvious, but it is the only approach that reliably moves the output number.</p>

<h3>Step 3: Implement Operator-Led Equipment Health Checks</h3>

<p>Autonomous maintenance — where production operators take ownership of basic equipment care — is the single highest-leverage OEE improvement activity in semiconductor manufacturing. Clean, inspect, and lubricate routines for wire bonders and die attach machines can eliminate 30 to 50 percent of unplanned stoppages within 90 days when implemented properly.</p>

<p>The critical success factor is that operators must understand why they are doing the checks, not just what to check. When an operator understands the linkage between vacuum filter cleanliness and pick-and-place accuracy, they act like equipment owners instead of machine minders. That shift in mindset is what makes autonomous maintenance sustainable beyond the initial implementation period.</p>

<h3>Step 4: Run Focused Improvement Projects on the Top Loss Categories</h3>

<p>Once your data is clean and your constraint is identified, run structured Kaizen or Six Sigma projects on the top three loss categories at the bottleneck machine. Each project should have a specific numerical target — for example, reduce wire bonder unplanned downtime from eight percent to three percent — with a named team lead, a four to eight week project timeline, and a weekly review cadence. Without this structure, improvement activity dissolves back into firefighting within three months regardless of how good the analysis was.</p>

<h2>What Results Can You Realistically Expect?</h2>

<p>Based on OEE improvement programmes I have led in Malaysian semiconductor plants, a focused 12-month programme with proper data infrastructure, constraint-focused Kaizen, and autonomous maintenance implementation typically delivers availability improvement of eight to fifteen percentage points, performance improvement of five to ten percentage points, quality yield improvement of one to three percentage points, and a net OEE improvement of fifteen to twenty-five percentage points.</p>

<p>To put that in business terms: for a plant running 20 wire bonders at 60% OEE, a fifteen-point improvement to 75% OEE is equivalent to adding three additional machines to the line — without capital expenditure. That is the financial case for OEE improvement in semiconductor manufacturing, and it is why the leading Malaysian semiconductor manufacturers invest in structured OEE programmes rather than treating it as an IT or data project.</p>

<h2>Getting Started: OEE Diagnostic for Malaysian Semiconductor Plants</h2>

<p>If your plant is below 70% OEE and you want a structured path to improvement, the starting point is an OEE diagnostic — typically a two to three day on-site assessment that identifies the top five loss categories at your bottleneck equipment and quantifies the improvement opportunity in output and revenue terms. This gives you a fact-based business case for the improvement investment and a clear prioritised action list before any training or project work begins.</p>

<p>The diagnostic uses your existing production data — no new systems or sensors are required to get started. What changes is how that data is analysed and acted on. <a href="/#contact">Reach out through the contact section</a> to discuss whether an OEE diagnostic is the right starting point for your operation.</p>
`
  },
  {
    slug: 'tpm-autonomous-maintenance-implementation-malaysia',
    title: 'TPM Autonomous Maintenance Implementation in Malaysian Factories',
    subtitle: 'Autonomous maintenance transfers basic equipment care from the maintenance department to operators — and it is the single highest-leverage step in any TPM programme. Here is how to implement it correctly in Malaysian manufacturing.',
    metaTitle: 'TPM Autonomous Maintenance Implementation Malaysia | Husni Halim',
    metaDesc: 'Step-by-step guide to TPM autonomous maintenance implementation in Malaysian factories. HRDC certified consultant explains the 7 steps, common failure modes, and how to build operator ownership.',
    category: 'OEE & TPM',
    readTime: '11 min read',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['TPM', 'Autonomous Maintenance', 'Lean Manufacturing', 'OEE', 'Malaysia'],
    body: `
<p>Of all the pillars in Total Productive Maintenance, autonomous maintenance is the one that delivers the fastest and most visible results — and the one that most Malaysian factories implement incorrectly. When done right, it transfers daily equipment care from an overloaded maintenance department to the operators who run the equipment, improving availability, reducing unplanned breakdowns, and building a shop floor culture where everyone owns equipment performance. When done wrong, it becomes a cleaning roster that collapses within three months.</p>

<p>This article explains the seven-step autonomous maintenance model, the specific implementation challenges in Malaysian manufacturing, and the design decisions that determine whether the programme sustains or fades.</p>

<h2>What Autonomous Maintenance Is — and What It Is Not</h2>

<p>Autonomous maintenance (AM) — called Jishu Hozen in Japanese — is the practice of having machine operators perform a defined set of daily and periodic equipment care activities: cleaning, inspection, lubrication, tightening, and basic adjustments. The goal is to restore equipment to its optimal condition and then maintain that condition through operator activity rather than depending on the maintenance department for all interactions with the machine.</p>

<p>This is not about replacing skilled maintenance technicians. It is about freeing them from reactive breakdowns caused by deterioration that operators could have detected and prevented — so that their time can be invested in planned maintenance, predictive maintenance, and equipment improvement work. In most Malaysian factories running without AM, 40 to 60 percent of maintenance department time is consumed by breakdowns that were entirely predictable and preventable. Autonomous maintenance eliminates the largest share of that waste.</p>

<div class="callout">
  <strong>The AM Logic:</strong> Operators clean → they discover abnormalities → abnormalities are addressed before they become failures → equipment availability rises → OEE improves → production cost per unit falls. The cleaning is not the goal. The discovery and prevention is.
</div>

<h2>The Seven Steps of Autonomous Maintenance</h2>

<p>The classical TPM model structures AM implementation as a seven-step programme. Each step must be completed and sustained before the next begins. Skipping steps is the most common reason AM programmes plateau and collapse.</p>

<h3>Step 1: Initial Cleaning and Inspection</h3>

<p>The first step is a thorough, hands-on cleaning of the equipment — not by the cleaning crew, but by the operators who run it. The purpose is not housekeeping. It is to restore the equipment to a condition where abnormalities are visible, and to force the operator into close physical contact with every part of the machine. During Step 1 cleaning, operators discover contamination sources, loose bolts, damaged seals, oil leaks, worn components, and unsafe conditions that have been invisible under layers of accumulated grime. Each finding is tagged with a coloured marker — a physical abnormality tag — that creates a visible record of what was found and what action is required. This is the first moment in most operators' working lives when they have been given both the permission and the tools to notice what is wrong with their machine.</p>

<h3>Step 2: Countermeasures for Contamination and Hard-to-Access Areas</h3>

<p>Once the machine is clean and abnormalities are tagged, Step 2 addresses the sources of contamination and the physical access problems that made Step 1 difficult. If chips accumulate in a housing because the cover design allows them in, the solution is to improve the cover — not to clean the chips more frequently. If a lubrication point is inaccessible without removing a guard, the solution is to extend the lube point to the equipment exterior. Step 2 makes it easier to maintain the clean condition achieved in Step 1, and easier for operators to perform the ongoing activities that follow. Skipping Step 2 means the machine will be dirty again within a week, and the programme loses credibility.</p>

<h3>Step 3: Cleaning and Lubrication Standards</h3>

<p>Step 3 formalises what operators are expected to do and when. A cleaning and lubrication standard is a visual document — typically posted at the machine — that specifies every cleaning task (location, method, frequency, time required), every lubrication point (lubricant type, quantity, frequency), and every inspection check (what to look for, acceptance criteria, action if abnormal). The standard must be realistic. If it requires 45 minutes and is scheduled for a 10-minute shift changeover, it will not be done. Building the standard around what can actually be completed in the available time — and then protecting that time — is a management responsibility.</p>

<h3>Step 4: General Inspection</h3>

<p>Step 4 develops operators' technical competence to inspect the key mechanical, electrical, and hydraulic systems of their equipment. This requires structured training — not a one-day classroom session, but point-of-learning modules delivered at the machine that explain how each system works, what normal looks like, and how to identify early signs of deterioration. After Step 4, operators can distinguish between a pneumatic system running at the correct pressure and one that is slowly losing pressure due to a fitting leak — and they know what to do about it. This step closes the knowledge gap that is the root cause of most equipment abnormalities going undetected until they become failures.</p>

<h3>Step 5: Autonomous Inspection</h3>

<p>By Step 5, cleaning and inspection are combined into a single integrated activity that operators perform as part of their routine. The formal checklists from Step 3 are refined based on operating experience, and the inspection intervals are adjusted based on actual deterioration patterns observed over the preceding months. Operators at this step are no longer following a prescribed routine mechanically — they understand why each check is done and can adapt when they encounter something outside the standard condition.</p>

<h3>Step 6: Standardisation</h3>

<p>Step 6 extends autonomous maintenance principles beyond the individual machine to the entire work area. Visual management standards for the workstation, tool storage, material flow, and workplace organisation are developed and formalised. This is the AM equivalent of the Standardise step in 5S — creating documented, visual standards that make the correct state immediately apparent and the incorrect state immediately visible. The relationship between 5S and autonomous maintenance is explored in detail in <a href="/blog/5s-implementation-problems/">5S implementation problems in Malaysian factories</a>.</p>

<h3>Step 7: Full Self-Management</h3>

<p>At Step 7, the AM programme is fully embedded. Operators manage their own equipment cleaning, inspection, and basic maintenance activities without supervisor prompting. They detect abnormalities, raise them through the proper channels, track resolution, and continuously improve their own standards. The maintenance department has been transformed from a reactive breakdown-repair service into a function focused on planned maintenance, condition monitoring, and equipment improvement. OEE is measured and owned at the operator level. This is the state that most TPM textbooks describe as the destination — in Malaysian manufacturing, it is typically two to three years from the start of Step 1 implementation.</p>

<h2>Autonomous Maintenance by Equipment Type in Malaysia</h2>

<table>
<thead><tr><th>Equipment Type</th><th>Primary AM Focus</th><th>Typical Step 1 Duration</th><th>Key Abnormality Category</th></tr></thead>
<tbody>
<tr><td>Injection moulding (plastics)</td><td>Mould cleaning, lubrication, temperature sensors</td><td>4–8 hours per machine</td><td>Contamination in mould cavities, worn tie bars</td></tr>
<tr><td>CNC machining centres</td><td>Coolant system, chip clearance, axis lubrication</td><td>6–12 hours per machine</td><td>Coolant contamination, loose clamping fixtures</td></tr>
<tr><td>Conveyor and assembly lines</td><td>Drive chain, belt tension, sensor cleaning</td><td>2–4 hours per zone</td><td>Belt wear, sensor misalignment, debris accumulation</td></tr>
<tr><td>Packaging machinery</td><td>Seal bar condition, film feed, date coder</td><td>3–6 hours per machine</td><td>Seal bar wear, film tracking issues</td></tr>
<tr><td>Semiconductor back-end (wire bonders, die attach)</td><td>Optics cleaning, bonding tool condition</td><td>2–3 hours per machine</td><td>Contaminated optics, worn capillaries</td></tr>
</tbody>
</table>

<h2>Why Autonomous Maintenance Fails in Malaysian Factories</h2>

<p>The failure modes are consistent across industries and plant sizes. The most common is treating AM as a cleaning programme rather than a deterioration-prevention system. When management presents AM to operators as "we need the machines cleaner," the response is compliance — operators clean the visible surfaces, the abnormality tags are never raised, and the programme produces no improvement in breakdown frequency. The programme succeeds when it is presented as "we need you to become the first line of defence for your equipment" — which is a completely different psychological contract.</p>

<p>The second failure mode is not protecting the time. Step 3 AM standards require between 10 and 45 minutes per shift depending on equipment complexity. If production scheduling does not ring-fence this time — if operators are expected to complete AM activities as extra work on top of their normal production load — the activities will be skipped whenever production pressure mounts. And production pressure always mounts. The lesson here is identical to what drives all lean implementation failures, as explored in <a href="/blog/why-kaizen-events-fail/">why Kaizen events fail in manufacturing plants</a>: without the supporting management system, the technical tools produce nothing.</p>

<p>The third failure mode is abnormality tags that never get resolved. When operators raise 50 tags in Step 1 and 45 of them are still open six months later, they conclude that the programme is performative — that management is collecting their feedback and doing nothing with it. The AM programme's credibility depends entirely on the speed and completeness of abnormality resolution, particularly in the early stages. A target of 80 percent tag closure within 30 days is a reasonable starting standard. Anything slower breaks the feedback loop that motivates operator engagement.</p>

<div class="callout">
  <strong>Common Mistake to Avoid:</strong> Running a "TPM Launch Day" where operators clean their machines while managers take photos, then returning to normal operations the following week. Autonomous maintenance is not a launch event. It is a system that requires daily management commitment and a multi-year implementation horizon. One launch day with no follow-through damages the credibility of any future improvement initiative.
</div>

<h2>The Link Between Autonomous Maintenance and OEE Improvement</h2>

<p>Autonomous maintenance directly attacks the Availability component of OEE by eliminating the minor stoppages and unplanned breakdowns caused by deterioration that operators detect and resolve before they become failures. In a well-implemented AM programme, minor stoppage frequency typically falls by 30 to 50 percent within 12 months of Step 1 completion. Unplanned breakdown duration falls by 20 to 40 percent over the same period, as the remaining breakdowns that do occur are detected at an earlier stage of deterioration — when they are faster and cheaper to repair.</p>

<p>The Quality component of OEE also improves, because many quality defects in Malaysian manufacturing are caused by equipment conditions — worn tooling, contaminated media, misaligned fixtures — that AM inspection detects before they produce defective output. A progressive die that is beginning to deflect will show visible wear patterns on the die face that an operator trained in Step 4 general inspection will notice. The same die, uninspected, produces a shift of defective stampings before it fails catastrophically. The connection between consistent equipment condition and first-pass quality is one of the strongest arguments for AM investment in quality-critical manufacturing sectors.</p>

<h2>HRDC Claimable TPM and Autonomous Maintenance Training in Malaysia</h2>

<p>TPM implementation training and autonomous maintenance coaching for Malaysian manufacturers can be claimed under HRDC SBL-Khas for registered employers. A structured programme covering TPM foundations, the seven-step AM model, abnormality identification, cleaning and lubrication standard development, and visual management for equipment care is typically delivered across two to three days of classroom and hands-on work, followed by facilitated implementation coaching at the factory over six to twelve months.</p>

<p>The most effective format combines training with live implementation — participants begin their Step 1 activity on actual production equipment during the programme, so that the first abnormality tags are raised before the training closes and the maintenance team can begin resolution work immediately. This approach compresses the timeline from training to visible results from months to weeks, and it produces a concrete demonstration of what AM looks like in practice that sustains momentum after the trainer leaves.</p>

<p>If your maintenance department is reactive, your operators are disengaged from equipment condition, and your OEE Availability component is below 80 percent, autonomous maintenance implementation is the highest-leverage first step available to you. <a href="/#contact">Contact Husni through the contact section</a> to discuss a scoped TPM diagnostic and implementation programme for your facility.</p>
`
  },
  {
    slug: '5s-audit-checklist-malaysian-factories',
    title: '5S Implementation Audit Checklist for Malaysian Factories',
    subtitle: 'A practical, zone-by-zone 5S audit checklist built for Malaysian manufacturing — with scoring guidance, common failure patterns, and how to turn audit findings into lasting improvement.',
    metaTitle: '5S Implementation Audit Checklist for Malaysian Factories | Husni Halim',
    metaDesc: 'Download-ready 5S audit checklist for Malaysian factories. HRDC certified lean consultant shares scoring criteria, common failure patterns, and how to sustain 5S after the audit.',
    category: 'Lean Manufacturing',
    readTime: '10 min read',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['5S', 'Lean Manufacturing', 'Audit', 'Workplace Organisation', 'Malaysia'],
    body: `
<p>A 5S audit is not a performance review. It is a diagnostic tool — a structured method for detecting gaps between the standard you defined and the reality on the shop floor today. Used correctly, a 5S audit drives genuine improvement. Used incorrectly, it creates anxiety, gaming, and a culture of cleaning for the auditor rather than for the process. In Malaysian manufacturing, the difference between these two outcomes comes down almost entirely to audit design and how results are acted upon.</p>

<p>This article provides a practical 5S implementation audit checklist for Malaysian factories — built around the five pillars of Sort, Set in Order, Shine, Standardise, and Sustain — along with scoring guidance, common failure patterns, and the management actions that turn audit findings into lasting change.</p>

<h2>Why Most 5S Audits Fail to Drive Improvement</h2>

<p>Before presenting the checklist, it is worth understanding why so many 5S audits in Malaysian factories produce numbers without progress. The most common failure pattern is auditing for compliance rather than for root cause. An auditor walks through a zone, scores each item on a five-point scale, calculates a percentage, and reports the result upward. Low scores trigger management pressure. Supervisors respond by cleaning up before the next scheduled audit. The score improves. The workplace reverts within a week.</p>

<p>This cycle repeats indefinitely because the audit is treating the score as the objective. The real objective is to understand <em>why</em> the standard is not being maintained — and to remove whatever is making it difficult for the people working in that zone to sustain the correct condition. When an audit consistently finds the same zone scoring poorly, the question is not "why is this area failing?" but "what is blocking this team from maintaining the standard?" That distinction changes the audit from an accountability exercise into an improvement tool.</p>

<div class="callout"><strong>Audit Principle:</strong> A 5S audit is only useful if it generates action to remove barriers — not action to clean up before the next visit. If your scores improve before audits and drop afterward, your audit is measuring compliance with the auditing process, not compliance with the standard.</div>

<h2>The 5S Implementation Audit Checklist</h2>

<p>The following checklist is structured by pillar. Each item is scored 0–4 using the criteria below. A zone total below 60 percent requires a root cause investigation and corrective action plan before the next audit cycle. A zone total above 80 percent indicates a functioning 5S system that requires ongoing maintenance rather than corrective intervention.</p>

<p><strong>Scoring scale:</strong> 0 = Not started / standard does not exist. 1 = Standard exists but not practised. 2 = Partial compliance, inconsistent across shifts. 3 = Consistent compliance with minor gaps. 4 = Full compliance, visual evidence present, sustainable without supervisor intervention.</p>

<h3>Pillar 1 — Sort (Seiri)</h3>
<p>Sort asks whether every item in the work zone is necessary, and whether unnecessary items have been removed. The audit should verify physical reality — not what the team believes, but what an observer can see.</p>
<p>Check 1.1: Are there any items in the zone (tools, materials, equipment, documents) that are not required for current production? Score 4 if the zone contains only what is actively needed. Score 0 if there are clearly unused items with no red-tag or disposition plan.</p>
<p>Check 1.2: Is there a red-tag area visible and actively managed? Items that are under review for removal should be physically separated and tagged with a disposition decision and target date. Score 4 if the red-tag area is current and items are progressing toward resolution. Score 0 if no red-tag process exists or the red-tag area is a permanent dump for items no one will decide on.</p>
<p>Check 1.3: Are inventory levels visually controlled? Excess material and work-in-process beyond the defined maximum create clutter that hides abnormalities. Score 4 if min/max indicators are visible and the zone is within limits. Score 0 if there are no inventory boundaries defined.</p>
<p>Check 1.4: Are personal items restricted to designated areas? Personal belongings left at workstations, in aisles, or on machinery are a Sort failure. Score 4 if personal items are in a defined location and kept there consistently.</p>

<h3>Pillar 2 — Set in Order (Seiton)</h3>
<p>Set in Order asks whether everything that belongs in the zone has a defined, labelled, visual location — and whether it is always returned to that location.</p>
<p>Check 2.1: Does every item have a defined location with a visual indicator? Shadow boards, floor markings, label slots, and outline tape are the visual tools that make Set in Order auditable. Score 4 if every item has a location and the visual indicator makes it obvious when the item is missing. Score 0 if locations are informal or exist only in the team's memory.</p>
<p>Check 2.2: Are locations logically designed for workflow? Tools and materials should be positioned where they are used, in the sequence they are needed, at the ergonomic height and reach distance for the operator. Score 4 if the zone layout reflects workflow analysis. Score 0 if items are stored by convenience rather than by use.</p>
<p>Check 2.3: Are aisle markings clear and unobstructed? Floor tape defining pedestrian walkways, material staging areas, and equipment boundaries must be intact and respected. Score 4 if all markings are legible and the zone is consistently within boundaries. Score 0 if markings are absent, worn, or routinely ignored.</p>
<p>Check 2.4: Is the correct quantity at each location maintained? A shadow board with one wrench missing is a Set in Order failure. Score 4 if the defined quantity is present and verified on each shift.</p>

<h3>Pillar 3 — Shine (Seiso)</h3>
<p>Shine is not housekeeping. It is the practice of cleaning as inspection — using the physical act of cleaning to detect abnormalities in equipment, materials, and workplace conditions before they cause problems.</p>
<p>Check 3.1: Is equipment cleaned to a defined standard at a defined frequency? A cleaning standard specifies what is cleaned, how, with what materials, and how often. Score 4 if the standard is documented, posted, and evidenced by a completed log. Score 0 if cleaning happens informally or only when something is visibly dirty.</p>
<p>Check 3.2: Are contamination sources identified and controlled? If an area consistently gets dirty due to a specific source — coolant leak, chip accumulation, dust from a nearby process — the Shine audit should flag whether a countermeasure is in place to control the source, not just clean the result. Score 4 if known contamination sources have documented countermeasures.</p>
<p>Check 3.3: Is cleaning equipment available at point of use? Operators should not need to leave the zone to collect cleaning materials. Score 4 if all cleaning tools are stored in the zone at their defined location.</p>
<p>Check 3.4: Are abnormalities detected during cleaning recorded and actioned? The purpose of cleaning-as-inspection is to generate findings. Score 4 if there is a visible mechanism — a tag board, a maintenance request log, a team board — where cleaning discoveries are recorded and tracked to resolution.</p>

<h3>Pillar 4 — Standardise (Seiketsu)</h3>
<p>Standardise asks whether the first three pillars have been documented in a form that allows anyone — including a new operator, a relief worker, or an auditor unfamiliar with the zone — to understand what correct looks like and verify whether it is being maintained.</p>
<p>Check 4.1: Is a zone map or 5S standard posted and current? The zone map shows the defined layout: where each item belongs, where the cleaning equipment is stored, where the red-tag area is, and what the zone boundaries are. Score 4 if the map is posted, reflects current practice, and has a revision date.</p>
<p>Check 4.2: Are cleaning and inspection standards at the point of use? Standards that exist in a folder in the supervisor's office do not drive behaviour. Score 4 if the standard is laminated, posted at the workstation, and used as a reference during cleaning activities.</p>
<p>Check 4.3: Does the zone have a visual management board with current audit scores? Transparency in 5S performance — posting scores at zone level rather than only in management reports — is a marker of a mature Standardise implementation. Score 4 if a board is present, current, and shows trend data.</p>

<h3>Pillar 5 — Sustain (Shitsuke)</h3>
<p>Sustain is the most difficult pillar to audit because it measures culture — the degree to which 5S discipline is self-reinforcing rather than supervisor-dependent. The audit evidence for Sustain comes from patterns across time, not from the condition of the zone on a single visit.</p>
<p>Check 5.1: Is there a consistent audit schedule with completed records? Sporadic auditing produces sporadic results. Score 4 if the audit schedule is posted, records show no missed audits in the past three months, and the audit is conducted by someone other than the zone supervisor.</p>
<p>Check 5.2: Is there evidence of operator-initiated improvement? Sustain is evidenced by 5S improvements that were identified and implemented by the zone team without management direction — a new shadow board, a revised cleaning route, a contamination source elimination. Score 4 if the team can point to at least one self-initiated improvement in the past 60 days.</p>
<p>Check 5.3: Do audit scores show an improving or stable trend? A score that improves only before planned audits and drops immediately after is not sustained. Score 4 if trend data over the past six audits shows stability or improvement without unusual pre-audit spikes.</p>
<p>Check 5.4: Is management conducting regular gemba walks with 5S focus? Leadership visibility at the shop floor level is the single strongest predictor of 5S sustainability. Score 4 if there is documented evidence — a leader standard work form, a gemba walk log, sign-offs on a zone board — of regular management visits to the zone. The connection between this and broader lean sustainability is discussed in <a href="/blog/why-kaizen-events-fail/">why Kaizen events fail in manufacturing plants</a>.</p>

<h2>5S Audit Scoring Reference by Maturity Level</h2>

<table>
<thead><tr><th>Zone Score</th><th>Maturity Level</th><th>Recommended Action</th><th>Audit Frequency</th></tr></thead>
<tbody>
<tr><td>0–40%</td><td>Not started / collapsed</td><td>Full restart: Sort and Set in Order with management sponsorship</td><td>Weekly until above 60%</td></tr>
<tr><td>41–59%</td><td>Partial implementation</td><td>Root cause investigation for each failing item; barrier removal plan</td><td>Fortnightly</td></tr>
<tr><td>60–74%</td><td>Basic compliance</td><td>Focus on Standardise: document what is working; close visual gaps</td><td>Monthly</td></tr>
<tr><td>75–89%</td><td>Functioning system</td><td>Shift focus to Sustain: operator ownership, self-auditing capability</td><td>Monthly, transitioning to quarterly</td></tr>
<tr><td>90–100%</td><td>Mature / self-sustaining</td><td>Benchmark and share practices; focus on continuous improvement projects</td><td>Quarterly</td></tr>
</tbody>
</table>

<h2>Common 5S Audit Failures in Malaysian Factories</h2>

<p>The most consistent audit failure pattern in Malaysian manufacturing is the disconnect between Sort and Set in Order. Factories often complete a thorough Sort — removing all unnecessary items, red-tagging obsolete equipment, clearing aisles — and then fail to build the visual location standards that make Set in Order auditable. Six months later, the removed items have quietly returned because there is no visual system making their absence obvious. The Sort effort is invisible; the drift back is gradual and easy to rationalise at each step.</p>

<p>The second consistent failure is Standardise existing only as a document rather than as a visual reality. A 5S standard that lives in a SharePoint folder or a quality manual is not a 5S standard. It is a record that a standard was once written. The standard is functional only when it is physically present in the zone, when it reflects actual current practice, and when it is used by operators as a reference rather than filed away for audit purposes. See <a href="/blog/5s-implementation-problems/">5S implementation problems in Malaysian factories</a> for a deeper analysis of why 5S fails after training — most of the root causes trace back to Standardise not being implemented properly.</p>

<p>The third failure is auditing the wrong person. When a supervisor audits their own zone, scoring tends to be generous and findings tend to be soft. A more effective model assigns cross-zone auditing: the supervisor of Zone A audits Zone B, and vice versa. This produces more objective scores, builds shared understanding of the standard across the plant, and prevents the score from being a reflection of political relationships rather than physical reality.</p>

<div class="callout"><strong>Key Practice:</strong> After every 5S audit, the auditor and the zone supervisor should walk the zone together to review each finding. The auditor explains what was observed and why it was scored as it was. The supervisor identifies the barrier — what is making it difficult to maintain the standard — not the person responsible for the failure. The output is a short corrective action list with names, actions, and dates. Without this conversation, the audit score is just a number.</div>

<h2>Making 5S Audits HRDC Claimable</h2>

<p>For Malaysian manufacturers registered with HRDC, 5S training programmes — including the design and implementation of audit systems — are claimable under the SBL-Khas scheme. A structured programme typically covers 5S principles, zone assessment methodology, audit checklist design, scoring calibration, and how to conduct a findings walkthrough that drives improvement rather than defensiveness. The most effective programmes include a live audit exercise on the factory floor, where participants score a real zone and calibrate their observations against an experienced facilitator. This practical component is what closes the gap between knowing the checklist and being able to use it as an improvement tool.</p>

<p>If you are building a 5S audit system for the first time, or if your existing audit programme is producing scores without driving improvement, the place to start is an on-site diagnostic that assesses your current 5S implementation against each of the five pillars and identifies the specific gaps that are limiting your progress. <a href="/#contact">Contact Husni through the contact section</a> to discuss a scoped 5S assessment and training programme for your facility.</p>
`
  },
{
    slug: 'vsm-value-stream-mapping-automotive-suppliers-malaysia',
    title: 'Value Stream Mapping for Automotive Suppliers Malaysia',
    subtitle: 'Malaysian Tier 1 and Tier 2 automotive suppliers face unique VSM challenges — short JIT windows, multi-model lines, and PPAP complexity. Here is how to apply value stream mapping correctly in the Malaysian automotive supply chain.',
    metaTitle: 'Value Stream Mapping for Automotive Suppliers Malaysia | Husni Halim',
    metaDesc: 'HRDC certified lean consultant explains value stream mapping for Malaysian automotive suppliers. Current state mapping, future state design, and implementation for Tier 1 and Tier 2 plants.',
    category: 'Lean Manufacturing',
    readTime: '11 min read',
    date: 'March 2026',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['VSM', 'Value Stream Mapping', 'Automotive', 'Lean Manufacturing', 'Malaysia'],
    body: `
<p>Value stream mapping is the lean tool that shows you everything your process improvement instinct cannot see on its own. It makes the flow of material and information visible — from raw material arriving at the dock to finished parts shipping to the OEM — and it quantifies precisely where time, capacity, and cost are being lost. For Malaysian automotive suppliers, getting VSM right is not optional. Proton, Perodua, Honda Malaysia, Toyota, and their Tier 1 vendors operate on delivery windows measured in hours. A two-day stockpile of WIP that looks harmless on the floor costs working capital, hides defects, and masks the process instability that is eating into your on-time delivery performance.</p>

<p>Yet the majority of VSM exercises I conduct in Malaysian automotive supplier plants reveal the same pattern: a current state map drawn once during a lean training workshop, framed on the wall of the production office, and never acted upon. The future state was designed over two days and shelved because no one knew how to close the gap between where the plant was and where the map said it should be. This article explains how to do VSM correctly for Malaysian automotive suppliers — from selecting the right product family to executing a future state that actually reaches the floor.</p>

<h2>Why Automotive Suppliers Need a Different VSM Approach</h2>

<p>The standard VSM methodology works well for high-volume, single-product lines where the product flow is linear and demand is relatively stable. Malaysian automotive supplier plants are rarely this simple. Tier 1 suppliers typically run five to fifteen product variants on the same line, responding to OEM call-offs that can change weekly based on model mix. Tier 2 suppliers face even more variety, often serving multiple OEM programmes simultaneously with shared equipment and overlapping scheduling windows.</p>

<p>Three dynamics make automotive VSM different from a standard lean plant exercise:</p>

<p><strong>Multi-model production.</strong> A single stamping press might produce brackets for three different vehicle models. A single welding cell might handle eight variants with different jig setups. Mapping a single product family means selecting a representative flow — the one that consumes the most capacity and best represents the system's constraints — not mapping every variant separately, which produces complexity without insight.</p>

<p><strong>OEM-dictated takt time.</strong> In general manufacturing, your takt time is calculated from customer demand. In automotive supply, the effective takt time is set by the OEM's production schedule, and it can change at short notice. A VSM designed around a stable takt assumption becomes misleading within months if demand mix shifts. The future state must include buffer strategies and changeover reduction targets that make the line responsive, not just efficient at one operating point.</p>

<p><strong>PPAP and quality constraints.</strong> Automotive quality systems — IATF 16949, PPAP, MSA, and control plan requirements — add process steps that a standard VSM template does not capture. Inspection gates, first article checks, SPC monitoring points, and material segregation zones are all part of the value stream in automotive, and they must appear on the current state map even if they are candidates for elimination in the future state.</p>

<h2>The Five Steps of Value Stream Mapping for Automotive Suppliers</h2>

<h3>Step 1 — Select the Product Family Correctly</h3>

<p>A product family, in VSM terms, is a group of products that share the same major process steps and equipment in roughly the same sequence. For a Malaysian Tier 2 stamping supplier serving Perodua and Proton programmes, the product family is not "all Perodua parts" — it is the group of parts that pass through the same press tonnage range, the same secondary operations (piercing, bending, welding), and the same inspection gates. If you map across product families, your current state will average out the very variation you need to understand.</p>

<p>Select the product family that represents your highest-volume, most-stressed flow — the one where late delivery calls from the OEM are most frequent. This is almost always the right starting point because it is where your improvement investment will produce the fastest return in delivery and working capital terms.</p>

<h3>Step 2 — Draw the Current State Map on the Gemba</h3>

<p>Current state mapping must be done by walking the actual process, not by reconstructing it from the ERP system or from a process flow chart drawn in a conference room. Take your VSM team to the floor — typically a cross-functional group of four to six people including production, maintenance, quality, and logistics — and walk the flow in reverse, from shipping back to receiving. Reverse-direction walking ensures you see the flow from the customer's perspective, not the production scheduler's.</p>

<p>At each process step, record cycle time, changeover time, uptime percentage, number of operators, shift pattern, and the quantity of WIP inventory in front of and behind the process. Do not estimate — measure and count. The accuracy of your current state map determines the credibility of your future state targets and the quality of your improvement prioritisation. A map built from estimates and assumptions will lead you to the wrong improvement projects, a pattern explored in detail in <a href="/blog/value-stream-mapping-mistakes/">value stream mapping mistakes that make VSM useless</a>.</p>

<h3>Step 3 — Calculate the Key Metrics</h3>

<p>Once the current state map is drawn, calculate four key metrics: process lead time (the total time from raw material receipt to finished goods shipment), value-added time (the sum of actual cycle times where transformation is occurring), value-added ratio (value-added time divided by process lead time), and inventory days of supply at each stocking point. In Malaysian automotive supplier plants, the value-added ratio is typically between one and five percent. That means 95 to 99 percent of the time your material spends in the plant, nothing productive is happening to it. It is waiting, being counted, being moved, being inspected again, or sitting in a queue. The current state metrics make this visible in a form that is impossible to argue with.</p>

<h3>Step 4 — Design the Future State Map</h3>

<p>The future state is not a wish list. It is a map of the flow you can achieve within 12 to 18 months using the people, equipment, and floor space you already have. The design process uses eight VSM future state questions: What is the takt time? Where will you build to a pacemaker? How will you use supermarkets or FIFO lanes? Where will you level the production schedule? What process improvements are required at the constraint?</p>

<p>For most Malaysian automotive Tier 2 suppliers, the highest-leverage future state improvements are: supermarket pull systems replacing push scheduling between operations, changeover reduction at constraint equipment to enable smaller lot sizes, and visual production management replacing verbal scheduling. Each improvement has a measurable target — for example, reduce WIP between press and secondary operations from five days to one day — that becomes the basis for the implementation plan.</p>

<h3>Step 5 — Build and Execute the Implementation Plan</h3>

<p>The implementation plan breaks the gap between current state and future state into specific projects, each with a named owner, a target date, and a measurable outcome. A typical Malaysian automotive supplier VSM implementation plan has eight to fifteen projects across a 12-month horizon, grouped into three phases: stabilise (fix data accuracy, implement basic visual management, standardise changeover procedures), flow (implement pull systems, reduce batch sizes, right-size inventories), and improve (reduce lead time further, improve OEE at the constraint, implement level scheduling). Without this structure, VSM exercises stall after the mapping phase — the improvement intention is there but the projects never get done. The reason is almost always the absence of a visible implementation plan with named owners and a regular review cadence, which is the same root cause behind why <a href="/blog/why-kaizen-events-fail/">Kaizen events fail in manufacturing plants</a>.</p>

<h2>VSM Benchmarks: Typical vs Target for Malaysian Automotive Suppliers</h2>

<table class="compare-table">
  <thead>
    <tr>
      <th>Metric</th>
      <th>Typical Malaysian Tier 2 Supplier</th>
      <th>Future State Target (12–18 months)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Process Lead Time</td>
      <td>12–25 days</td>
      <td>3–7 days</td>
    </tr>
    <tr>
      <td>Value-Added Ratio</td>
      <td>1–4%</td>
      <td>8–15%</td>
    </tr>
    <tr>
      <td>WIP Inventory (days)</td>
      <td>5–10 days between operations</td>
      <td>0.5–2 days between operations</td>
    </tr>
    <tr>
      <td>Changeover Time (constraint)</td>
      <td>60–180 minutes</td>
      <td>15–45 minutes</td>
    </tr>
    <tr>
      <td>Scheduling Method</td>
      <td>Push (ERP releases to every operation)</td>
      <td>Pull (pacemaker only, with supermarkets)</td>
    </tr>
    <tr>
      <td>On-Time Delivery to OEM</td>
      <td>88–94%</td>
      <td>98%+</td>
    </tr>
  </tbody>
</table>

<p>These targets are achievable without capital investment. The lead time reduction from 15 days to five days does not require new equipment — it requires smaller batches, pull scheduling, and the elimination of queuing time between operations. The WIP reduction releases working capital immediately and typically funds the improvement programme itself within the first six months.</p>

<div class="callout">
  <strong>HRDC Claimable VSM Training for Malaysian Automotive Suppliers</strong>
  <p>Husni Halim delivers Value Stream Mapping workshops designed specifically for Malaysian automotive Tier 1 and Tier 2 suppliers. Programmes include on-site current state mapping, future state design, and implementation planning using your actual production flow. All sessions are HRDC claimable under SBL-Khas. Suitable for production managers, IE engineers, and operations leads working in stamping, welding, assembly, and plastics. <a href="/#contact">Contact Husni to discuss a VSM programme</a> for your plant, or read the full <a href="/blog/oee-training-malaysia/">OEE Training Malaysia guide</a> to understand how VSM and OEE improvement work together.</p>
</div>

<h2>Common VSM Mistakes in Malaysian Automotive Factories</h2>

<p>The most consistent VSM mistake in Malaysian automotive suppliers is mapping the information flow incorrectly. Most teams draw the material flow accurately — they have walked the floor and counted the inventory — but the information flow is sketched from memory rather than mapped from observation. Where does the production schedule actually come from? Who calls off material from the warehouse? When does engineering release the daily plan? These are not rhetorical questions. Mapping the information flow reveals whether scheduling is being driven by the OEM's kanban signal, by the plant's own ERP system, or by a production supervisor making informal decisions on the floor. In most Malaysian automotive supplier plants I map, the answer is all three simultaneously — and the conflicts between these three information sources are responsible for the majority of the WIP accumulation that shows up in the material flow.</p>

<p>The second consistent mistake is drawing the future state as an idealised version of the current state rather than a redesigned flow. A future state that reduces inventory at each process step but keeps the same push scheduling logic will not achieve a sustainable lead time reduction. The flow logic — how and where production is triggered, how batch sizes are determined, how information moves between operations — must change, not just the inventory quantities. The future state must answer the eight VSM questions, not just look cleaner than the current state map.</p>

<p>The third mistake is failing to connect VSM to standard work. A future state designed around a 30-unit batch size means nothing if the operators continue to build in 150-unit batches because the informal standard has not changed. The implementation plan must include a standard work update for every process that is being redesigned — new batch sizes, new scheduling signals, new material handling routes. Without this, the future state map stays on the wall and the floor returns to its current state within three months. This linkage between VSM and standard work is discussed in detail in <a href="/blog/standard-work-implementation-problems/">why standard work never gets followed after training</a>.</p>

<h2>VSM in the Context of Malaysian Automotive Supplier Development</h2>

<p>Malaysian automotive suppliers under Vendor Development Programmes — whether through Proton's vendor programme, DRB-Hicom's supply chain initiatives, or MITI's SME manufacturing support — are increasingly required to demonstrate lean manufacturing capability as a condition of programme participation or contract renewal. A completed and implemented VSM exercise, with documented before-and-after metrics, is one of the most credible demonstrations of lean capability that a supplier can present to an OEM assessment team. It shows not just that lean tools are understood, but that they have been applied to real processes with measurable results.</p>

<p>For suppliers preparing for IATF 16949 recertification or OEM second-party audits, the VSM also provides a structured baseline for continual improvement planning — a requirement under clause 10.3 of IATF 16949 that is often addressed with generic improvement plans rather than data-driven prioritisation.</p>

<h2>Getting Started: VSM Diagnostic for Malaysian Automotive Plants</h2>

<p>If your plant has never completed a proper VSM exercise, or if a previous VSM never translated into floor-level improvement, the right starting point is a one-day VSM diagnostic — a structured walk of your highest-volume product family with a trained facilitator, producing a current state map, a quick-win list, and a scoped implementation brief. This gives management the business case for the full programme and gives the shop floor team a concrete picture of what is possible before committing to a multi-month improvement initiative.</p>

<p>The diagnostic is done on your floor with your team. No preparatory data collection is required — the mapping exercise collects the data as part of the process. The output is a current state map, a process lead time calculation, and a prioritised list of the top five improvement opportunities based on what was observed on the day. <a href="/#contact">Contact Husni through the contact section</a> to arrange a VSM diagnostic for your automotive supplier facility.</p>
`
  },
  {
    slug: 'kaizen-champion-development-program',
    title: 'Kaizen Champion Development Program',
    subtitle: 'Develop internal Kaizen champions who can drive sustainable continuous improvement in your manufacturing plant. Structured, results-based program for Malaysian manufacturers.',
    metaTitle: 'Kaizen Champion Development Program | Husni Halim',
    metaDesc: 'HRDC certified Kaizen champion development program for Malaysian manufacturers. Structured training program to develop internal continuous improvement leaders.',
    category: 'Training Program',
    readTime: 'Learn more',
    date: 'April 2026',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&h=630&q=80',
    tags: ['Kaizen', 'Training', 'Continuous Improvement', 'Manufacturing', 'Leadership', 'Malaysia'],
    body: `
<p>The Kaizen Champion Development Program is a structured, results-based training program designed to develop internal continuous improvement leaders in Malaysian manufacturing plants. This program equips teams with the knowledge, skills, and practical experience to lead Kaizen initiatives, sustain improvements, and build a continuous improvement culture.</p>

<h2>Program Structure</h2>
<p>The program combines theoretical training with hands-on application, ensuring participants can immediately apply what they learn on the shop floor. Over six months, participants engage in modular training, real-world projects, and peer learning.</p>

<h2>The Five-Module Curriculum</h2>
<p><strong>Module 1: Lean Fundamentals & Kaizen Philosophy</strong> — Understand the history and principles of Kaizen, lean thinking, and value stream concepts. Learn how Kaizen fits into broader operational excellence initiatives.</p>
<p><strong>Module 2: Kaizen Event Facilitation</strong> — Master the five-day Kaizen event format, including current state mapping, root cause analysis, future state design, and implementation planning. Practice facilitation techniques.</p>
<p><strong>Module 3: Standard Work & Visual Management</strong> — Learn how to document, standardise, and visually manage processes so that improvements stick. Build standard work procedures and implement visual control systems.</p>
<p><strong>Module 4: Sustainability & Continuous Improvement Systems</strong> — Understand what causes improvements to revert and how to build organisational conditions that sustain change. Learn metrics-driven improvement management.</p>
<p><strong>Module 5: Leadership & Change Management</strong> — Develop the soft skills and change management approaches needed to lead cross-functional teams through improvement initiatives in a Malaysian manufacturing context.</p>

<h2>Three Program Options</h2>
<p><strong>Standard Program (RM 6,500)</strong> — Full six-month curriculum with monthly workshops, one applied project, and peer group support. Best for plants starting their continuous improvement journey.</p>
<p><strong>Early Bird Pricing (RM 6,250)</strong> — Enrol before the program start date and receive discounted pricing. Same content and duration as the standard program.</p>
<p><strong>Group Discount (RM 6,200 per person)</strong> — Available for 2 or more participants. Group + Early Bird pricing is RM 6,000 per person when 2 or more participants register by 4 May 2026.</p>

<h2>What Participants Receive</h2>
<ul>
<li>Six months of structured training (one full day monthly)</li>
<li>Training materials and Kaizen facilitation templates</li>
<li>Coaching on one applied improvement project</li>
<li>Peer learning cohort with other Kaizen champions</li>
<li>Access to post-program support and resources (three months)</li>
<li>Certificate of completion upon successful programme completion</li>
</ul>

<h2>Who Should Enrol</h2>
<p>This program is designed for production supervisors, quality leaders, maintenance engineers, and operations staff who will champion continuous improvement initiatives in their plants. Ideal participants have 3-10 years of manufacturing experience and are ready to take on broader improvement leadership roles.</p>

<h2>Post-Program Support</h2>
<p>Graduates receive three months of post-program coaching and support, including access to email consultation, review of improvement project documentation, and invitation to alumni network sessions.</p>

<h2>Registration & Enquiries</h2>
<p>The program runs on a cohort basis. Early registration discounts apply. Contact Husni Halim to discuss timing, customisation options for group registrations, and programme fit for your organisation.</p>
`
  }
];

// ─── Shared CSS ───────────────────────────────────────────────────
const BLOG_CSS = `
:root {
  --c-dark: #0c1b2e;
  --c-accent: #8b2252;
  --c-secondary: #c47832;
  --c-warm: #f9f7f4;
  --c-soft: #ece8e3;
  --c-body: #374151;
  --c-mid: #6b7280;
  --font-h: 'Cormorant Garamond', Georgia, serif;
  --font-b: 'DM Sans', -apple-system, sans-serif;
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--font-b);background:var(--c-warm);color:var(--c-body);-webkit-font-smoothing:antialiased}

/* NAV */
.nav{background:var(--c-dark);padding:14px 40px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:100}
.nav-logo{color:#fff;font-family:var(--font-h);font-size:20px;font-weight:600;text-decoration:none;letter-spacing:1px}
.nav-logo em{color:var(--c-secondary);font-style:italic}
.nav-links{display:flex;gap:28px;list-style:none}
.nav-links a{color:#ccc;font-size:13px;text-decoration:none;font-family:var(--font-b);letter-spacing:.4px;transition:color .2s}
.nav-links a:hover{color:#fff}
.nav-cta{background:var(--c-accent)!important;color:#fff!important;padding:8px 16px;border-radius:4px}

/* HERO */
.post-hero{position:relative;height:440px;overflow:hidden;background:var(--c-dark)}
.post-hero img{width:100%;height:100%;object-fit:cover;opacity:.45}
.post-hero-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(12,27,46,.95) 30%,rgba(12,27,46,.4))}
.post-hero-content{position:absolute;bottom:0;left:0;right:0;padding:48px;max-width:900px}
.post-cat{font-family:var(--font-b);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--c-secondary);margin-bottom:14px}
.post-title{font-family:var(--font-h);font-size:clamp(26px,4vw,44px);line-height:1.2;color:#fff;margin-bottom:16px;font-weight:600}
.post-meta{font-size:13px;color:rgba(255,255,255,.6);display:flex;gap:16px;flex-wrap:wrap}
.post-meta span{display:flex;align-items:center;gap:6px}

/* LAYOUT */
.page-wrap{max-width:1160px;margin:0 auto;padding:0 24px;display:grid;grid-template-columns:1fr 300px;gap:64px;align-items:start}
article{padding:48px 0 80px}
.post-subtitle{font-size:20px;line-height:1.65;color:#555;font-style:italic;margin-bottom:36px;padding-bottom:36px;border-bottom:1px solid #ddd;font-family:var(--font-h)}

/* ARTICLE BODY */
article h2{font-family:var(--font-h);font-size:26px;font-weight:600;color:var(--c-dark);margin:44px 0 16px;padding-left:16px;border-left:3px solid var(--c-accent)}
article h3{font-family:var(--font-h);font-size:20px;font-weight:600;color:#222;margin:28px 0 10px}
article p{font-size:17px;line-height:1.85;color:var(--c-body);margin-bottom:20px}
article ul,article ol{margin:10px 0 20px 22px}
article li{font-size:16px;line-height:1.75;margin-bottom:8px;color:var(--c-body)}
.callout{background:#fff8f2;border-left:3px solid var(--c-secondary);border-radius:4px;padding:20px 24px;margin:32px 0;font-size:16px;line-height:1.7;color:#444}
.callout strong{color:var(--c-accent)}
blockquote{padding:24px 32px;margin:36px 0;background:#f4f0fb;border-radius:6px;font-family:var(--font-h);font-size:22px;line-height:1.6;color:#2a1a4e;font-style:italic;text-align:center}
table{width:100%;border-collapse:collapse;margin:28px 0;font-size:14px}
th{background:var(--c-dark);color:#fff;padding:12px 16px;text-align:left;font-family:var(--font-b);font-weight:600;letter-spacing:.3px}
td{padding:12px 16px;border-bottom:1px solid #eee;color:var(--c-body);line-height:1.5;font-size:14px}
tr:nth-child(even) td{background:#f9f7f4}
tr:hover td{background:#fff8f2}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:36px}
.tag{background:var(--c-soft);color:#555;font-size:11px;padding:5px 12px;border-radius:20px;font-weight:500;letter-spacing:.4px}

/* AUTHOR BIO */
.author-bio{display:flex;gap:20px;align-items:flex-start;background:#fff;border:1px solid #eee;border-radius:8px;padding:24px;margin-top:56px}
.author-av{width:60px;height:60px;border-radius:50%;background:var(--c-dark);display:flex;align-items:center;justify-content:center;color:var(--c-secondary);font-family:var(--font-h);font-size:22px;font-weight:600;flex-shrink:0}
.author-bio p{font-size:14px;line-height:1.6;color:#555;margin-bottom:4px}
.author-bio strong{color:#111;font-size:15px;display:block;margin-bottom:4px}
/* SIDEBAR */
aside{padding-top:48px;position:sticky;top:70px}
.s-card{background:#fff;border:1px solid #eee;border-radius:8px;padding:22px;margin-bottom:22px}
.s-card h4{font-family:var(--font-b);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;margin-bottom:14px}
.toc li{list-style:none;padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#555}
.toc li:last-child{border-bottom:none}
.toc li::before{content:"→ ";color:var(--c-secondary)}
.rel-post{display:block;padding:9px 0;border-bottom:1px solid #f0f0f0;font-size:13px;color:#444;text-decoration:none;line-height:1.4}
.rel-post:last-child{border-bottom:none}
.rel-post:hover{color:var(--c-accent)}
.cta-card{background:var(--c-dark);border-radius:8px;padding:22px;text-align:center}
.cta-card h4{color:#fff;font-size:14px;line-height:1.5;margin-bottom:8px;letter-spacing:normal;text-transform:none;font-family:var(--font-h);font-style:italic;font-size:17px}
.cta-card p{font-size:12px;color:#aaa;margin-bottom:14px;line-height:1.5}
.cta-btn{display:block;background:var(--c-accent);color:#fff;padding:10px;border-radius:4px;font-size:13px;font-weight:600;text-decoration:none;letter-spacing:.4px}
.cta-btn:hover{background:#a0285e}

/* BREADCRUMB */
.breadcrumb{max-width:1160px;margin:0 auto;padding:20px 24px 0;font-size:12px;color:#999;font-family:var(--font-b)}
.breadcrumb a{color:var(--c-mid);text-decoration:none}
.breadcrumb a:hover{color:var(--c-accent)}
.breadcrumb span{margin:0 6px}

/* BACK LINK */
.back-btn{display:inline-flex;align-items:center;gap:8px;color:var(--c-accent);font-size:13px;text-decoration:none;font-weight:500;padding:0 0 24px}
.back-btn:hover{gap:12px}

/* FOOTER */
.footer{background:var(--c-dark);color:#888;text-align:center;padding:32px;font-size:13px;margin-top:80px}
.footer a{color:var(--c-secondary);text-decoration:none}

@media(max-width:800px){
  .page-wrap{grid-template-columns:1fr}
  aside{display:none}
  .nav{padding:12px 20px}
  .post-hero-content{padding:24px}
  .nav-links{gap:14px}
}
`;

// ─── Blog listing page CSS additions ─────────────────────────────
const LISTING_EXTRA_CSS = `
.blog-hero{background:var(--c-dark);padding:80px 24px 60px;text-align:center}
.blog-hero .label{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--c-secondary);margin-bottom:14px}
.blog-hero h1{font-family:var(--font-h);font-size:clamp(32px,5vw,56px);color:#fff;font-weight:300;margin-bottom:16px}
.blog-hero p{font-size:16px;color:rgba(255,255,255,.55);max-width:520px;margin:0 auto;line-height:1.7}
.blog-grid{max-width:1160px;margin:60px auto;padding:0 24px;display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:32px}
.card{background:#fff;border-radius:8px;overflow:hidden;border:1px solid #eee;transition:box-shadow .2s,transform .2s;display:flex;flex-direction:column}
.card:hover{box-shadow:0 12px 36px rgba(12,27,46,.1);transform:translateY(-2px)}
.card a{text-decoration:none;color:inherit;display:flex;flex-direction:column;height:100%}
.card-img{height:200px;overflow:hidden;background:var(--c-dark)}
.card-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.card:hover .card-img img{transform:scale(1.04)}
.card-body{padding:24px;flex:1;display:flex;flex-direction:column}
.card-cat{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--c-secondary);margin-bottom:10px}
.card h2{font-family:var(--font-h);font-size:20px;line-height:1.3;color:var(--c-dark);margin-bottom:10px;font-weight:600}
.card p{font-size:14px;line-height:1.65;color:var(--c-mid);flex:1}
.card-footer{padding:14px 24px;border-top:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center}
.card-meta{font-size:12px;color:#aaa}
.card-read{font-size:12px;color:var(--c-accent);font-weight:600}
`;

// ─── Helper: nav HTML ─────────────────────────────────────────────
function nav(active = '') {
  return `<nav class="nav">
  <a href="/" class="nav-logo">Husni<em>Halim</em></a>
  <ul class="nav-links">
    <li><a href="/#about">About</a></li>
    <li><a href="/#expertise">Expertise</a></li>
    <li><a href="/#training">Training</a></li>
    <li><a href="/blog/" ${active === 'blog' ? 'style="color:#fff"' : ''}>Blog</a></li>
    <li><a href="/#contact" class="nav-cta">Get In Touch</a></li>
  </ul>
</nav>`;
}

// ─── Helper: footer HTML ──────────────────────────────────────────
function footer() {
  return `<footer class="hh-footer">
  <div class="hh-footer-inner">
    <div class="hh-footer-grid">
      <div class="hh-footer-col hh-footer-brand">
        <a href="/" class="hh-footer-logo">Husni<em>Halim</em></a>
        <p>Principal Consultant, Certified Process Kaizen Engineer. Helping Malaysian manufacturers build a culture of continuous improvement.</p>
        <p><strong>Visi Armada Consulting</strong><br>HRDC Registered Training Provider<br>Shah Alam, Selangor, Malaysia</p>
        <div class="hh-footer-social">
          <a href="https://www.linkedin.com/in/husni-halim-7436b01b/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg></a>
          <a href="https://wa.me/60165241901" target="_blank" rel="noopener" aria-label="WhatsApp"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
        </div>
      </div>

      <div class="hh-footer-col">
        <h4>Services</h4>
        <ul>
          <li><a href="/#about">About Husni</a></li>
          <li><a href="/assessment/">Free Site Assessment</a></li>
          <li><a href="/kaizenchampion/">Kaizen Champion Program</a></li>
          <li><a href="/hrdc-training/">HRDC Training Programs</a></li>
          <li><a href="/consulting/">Consulting Engagement</a></li>
          <li><a href="/oee-calculator/">Free OEE Calculator</a></li>
        </ul>
      </div>

      <div class="hh-footer-col">
        <h4>Training Topics</h4>
        <ul>
          <li><a href="/hrdc-training/kaizen/">Kaizen Principles</a></li>
          <li><a href="/hrdc-training/5s/">5S &amp; Workplace Organisation</a></li>
          <li><a href="/hrdc-training/oee/">OEE Improvement</a></li>
          <li><a href="/hrdc-training/lean-manufacturing/">Value Stream Mapping</a></li>
          <li><a href="/hrdc-training/problem-solving/">Root Cause Analysis</a></li>
          <li><a href="/hrdc-training/tpm/">Total Productive Maintenance</a></li>
        </ul>
      </div>

      <div class="hh-footer-col">
        <h4>Contact</h4>
        <ul class="hh-footer-contact-list">
          <li><a href="https://wa.me/60165241901" target="_blank" rel="noopener"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>+60165241901</a></li>
          <li><a href="mailto:admin@visiarmada.com">admin@visiarmada.com</a></li>
          <li><a href="https://www.linkedin.com/in/husni-halim-7436b01b/" target="_blank" rel="noopener">LinkedIn Profile</a></li>
          <li>Shah Alam, Selangor, Malaysia</li>
        </ul>
        <a href="/consulting/" class="hh-footer-cta">Book a Free Call</a>
      </div>
    </div>

    <div class="hh-footer-bottom">
      <p>&copy; 2026 Mohd Husni Bin Abd Halim &middot; Visi Armada Consulting. All rights reserved.</p>
      <p>HRDC Registered Training Provider &middot; Trainer ID 11294</p>
    </div>
  </div>
</footer>`;
}

// ─── Helper: related articles (3 random excl current) ────────────
function relatedArticles(currentSlug) {
  return articles
    .filter(a => a.slug !== currentSlug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map(a => `<a class="rel-post" href="/blog/${a.slug}/">${a.title}</a>`)
    .join('\n');
}

// ─── Helper: TOC from h2 tags ─────────────────────────────────────
function extractTOC(body) {
  const matches = [...body.matchAll(/<h2>(.*?)<\/h2>/g)];
  return matches.map(m => `<li>${m[1]}</li>`).join('\n');
}

// ─── Build article page ───────────────────────────────────────────
function buildArticlePage(article) {
  const toc = extractTOC(article.body);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${article.metaTitle}</title>
<meta name="description" content="${article.metaDesc}">
<meta name="author" content="Husni Halim">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://husnihalim.com/blog/${article.slug}/">
<meta property="og:title" content="${article.metaTitle}">
<meta property="og:description" content="${article.metaDesc}">
<meta property="og:image" content="${article.image}">
<meta property="og:type" content="article">
<meta property="og:url" content="https://husnihalim.com/blog/${article.slug}/">
<meta name="twitter:card" content="summary_large_image">
${GOOGLE_FONTS}
<link rel="stylesheet" href="/assets/site-footer.css">
<link rel="stylesheet" href="/assets/share.css">
<style>${BLOG_CSS}</style>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "${article.title}",
  "description": "${article.metaDesc}",
  "image": "${article.image}",
  "url": "https://husnihalim.com/blog/${article.slug}/",
  "datePublished": "${article.isoDate}",
  "dateModified": "${article.isoDate}",
  "inLanguage": "en-MY",
  "author": {
    "@type": "Person",
    "name": "Husni Halim",
    "url": "https://husnihalim.com",
    "jobTitle": "Principal Consultant, Certified Process Kaizen Engineer",
    "sameAs": [
      "https://www.linkedin.com/in/husni-halim-7436b01b/",
      "https://www.facebook.com/visiarmada"
    ]
  },
  "publisher": {
    "@type": "Person",
    "name": "Husni Halim",
    "url": "https://husnihalim.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://husnihalim.com/assets/husni-portrait.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://husnihalim.com/blog/${article.slug}/"
  },
  "keywords": "${article.tags.join(', ')}"
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://husnihalim.com/"},
    {"@type": "ListItem", "position": 2, "name": "Blog", "item": "https://husnihalim.com/blog/"},
    {"@type": "ListItem", "position": 3, "name": "${article.title}", "item": "https://husnihalim.com/blog/${article.slug}/"}
  ]
}
</script>
</head>
<body>
${nav('blog')}

<div class="post-hero">
  <img src="${article.image}" alt="${article.title}" loading="lazy" onerror="this.style.display='none'">
  <div class="post-hero-overlay"></div>
  <div class="post-hero-content">
    <div class="post-cat">${article.category}</div>
    <h1 class="post-title">${article.title}</h1>
    <div class="post-meta">
      <span>${article.date}</span>
      <span>·</span>
      <span>${article.readTime}</span>
    </div>
  </div>
</div>

<div class="breadcrumb">
  <a href="/">Home</a><span>›</span>
  <a href="/blog/">Blog</a><span>›</span>
  ${article.title}
</div>

<div class="page-wrap">
  <article>
    <a class="back-btn" href="/blog/">← Back to Blog</a>

    <div class="tags">
      ${article.tags.map(t => `<span class="tag">${t}</span>`).join('')}
    </div>

    <p class="post-subtitle">${article.subtitle}</p>

    ${article.body}

    <div class="author-bio">
      <div class="author-av">H</div>
      <div>
        <strong>Husni Halim</strong>
        <p>Principal Consultant, Certified Process Kaizen Engineer. HRDC Certified Trainer (TTT/10228) and MPC Certified Productivity Expert at Visi Armada Consulting, specialising in lean manufacturing, OEE, and Kaizen for Malaysian manufacturers.</p>
      </div>
    </div>

    ${articleShare()}
  </article>

  <aside>
    <div class="s-card">
      <h4>In this article</h4>
      <ul class="toc">${toc}</ul>
    </div>
    <div class="s-card">
      <h4>Related Articles</h4>
      ${relatedArticles(article.slug)}
    </div>
    <div class="cta-card">
      <h4>Need help implementing this in your factory?</h4>
      <p>HRDC claimable training available across Malaysia.</p>
      <a href="/#contact" class="cta-btn">Get In Touch →</a>
    </div>
  </aside>
</div>

${footer()}
<script src="/assets/share.js" defer></script>
</body>
</html>`;
}

// ─── Build blog listing page ──────────────────────────────────────
function buildListingPage() {
  const cards = articles.map(a => `
<div class="card">
  <a href="/blog/${a.slug}/">
    <div class="card-img">
      <img src="${a.image}" alt="${a.title}" loading="lazy" onerror="this.style.opacity='.3'">
    </div>
    <div class="card-body">
      <div class="card-cat">${a.category}</div>
      <h2>${a.title}</h2>
      <p>${a.subtitle.slice(0, 120)}…</p>
    </div>
    <div class="card-footer">
      <span class="card-meta">${a.date} · ${a.readTime}</span>
      <span class="card-read">Read →</span>
    </div>
  </a>
  ${cardShare(a)}
</div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog | Lean Manufacturing & Kaizen Insights | Husni Halim</title>
<meta name="description" content="Practical lean manufacturing, Kaizen, OEE, and continuous improvement insights from HRDC certified consultant Husni Halim. For Malaysian manufacturing leaders and SMEs.">
<meta name="author" content="Husni Halim">
<link rel="canonical" href="https://husnihalim.com/blog/">
<meta property="og:title" content="Blog | Lean Manufacturing & Kaizen Insights | Husni Halim">
<meta property="og:description" content="Practical lean manufacturing and Kaizen insights for Malaysian manufacturing.">
<meta property="og:url" content="https://husnihalim.com/blog/">
${GOOGLE_FONTS}
<link rel="stylesheet" href="/assets/site-footer.css">
<link rel="stylesheet" href="/assets/share.css">
<style>${BLOG_CSS}${LISTING_EXTRA_CSS}</style>
</head>
<body>
${nav('blog')}
<div class="blog-hero">
  <div class="label">Lean &amp; Kaizen Insights</div>
  <h1>Insights for Malaysian Manufacturers</h1>
  <p>Practical guides on lean manufacturing, Kaizen, OEE, and operational excellence — written from the factory floor, not the textbook.</p>
</div>
<div class="blog-grid">
${cards}
</div>
${footer()}
<script src="/assets/share.js" defer></script>
</body>
</html>`;
}

// ─── Enrich articles with isoDate ────────────────────────────────
const MONTH_MAP = {
  'January': '01', 'February': '02', 'March': '03', 'April': '04',
  'May': '05', 'June': '06', 'July': '07', 'August': '08',
  'September': '09', 'October': '10', 'November': '11', 'December': '12'
};
// Assign mid-month ISO dates matching the sitemap lastmod values
const ISO_DATE_MAP = {
  'oee-training-malaysia':                    '2024-10-15',
  'why-kaizen-events-fail':                   '2024-11-10',
  '5s-implementation-problems':               '2024-12-05',
  'value-stream-mapping-mistakes':            '2025-02-12',
  'standard-work-implementation-problems':    '2025-04-08',
  'kaizen-blitz-vs-kaizen-culture':           '2025-06-14',
  'visual-management-failures':               '2025-08-19',
  'poka-yoke-implementation-problems':        '2025-09-22',
  'pdca-implementation-problems':             '2025-10-17',
  'andon-system-implementation-problems':     '2025-11-11',
  'gemba-walk-problems':                      '2026-01-08',
  'kaizen-coaching-mro-aviation-malaysia':    '2026-03-14',
  'oee-semiconductor-factories-malaysia':     '2026-03-03',
  'tpm-autonomous-maintenance-implementation-malaysia': '2026-03-17',
  'vsm-value-stream-mapping-automotive-suppliers-malaysia': '2026-03-31'
};
articles.forEach(a => {
  a.isoDate = ISO_DATE_MAP[a.slug] || '2025-01-01';
});

// ─── Write all files ──────────────────────────────────────────────
const BLOG_DIR = path.join(__dirname, 'blog');
fs.mkdirSync(BLOG_DIR, { recursive: true });

// Listing page
fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), buildListingPage());
console.log('✓ blog/index.html');

// Article pages
for (const article of articles) {
  const dir = path.join(BLOG_DIR, article.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), buildArticlePage(article));
  console.log(`✓ blog/${article.slug}/index.html`);
}

console.log(`\nDone — ${articles.length + 1} files generated.`);
