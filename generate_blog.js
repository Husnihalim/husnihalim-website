const fs = require('fs');
const path = require('path');

// ─── Shared assets ────────────────────────────────────────────────
const GOOGLE_FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">`;

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
/* SHARE */
.share-bar{margin-top:40px;padding-top:32px;border-top:1px solid #eee}
.share-bar p{font-family:var(--font-b);font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#999;margin-bottom:14px}
.share-btns{display:flex;gap:10px;flex-wrap:wrap}
.share-btn{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:6px;font-size:13px;font-weight:600;text-decoration:none;transition:opacity .15s}
.share-btn:hover{opacity:.82}
.share-btn-li{background:#0077b5;color:#fff}
.share-btn-fb{background:#1877f2;color:#fff}
.share-btn-va{background:var(--c-dark);color:var(--c-secondary);border:1px solid var(--c-secondary)}

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
  return `<footer class="footer">
  <p>© ${new Date().getFullYear()} Husni Halim · <a href="/">husnihalim.com</a> · HRDC Accredited Trainer TTT/10228</p>
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
<style>${BLOG_CSS}</style>
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
        <p>HRDC Certified Trainer (TTT/10228) and MPC Certified Productivity Expert. Principal Consultant at Visi Armada Consulting, specialising in lean manufacturing, OEE, and Kaizen for Malaysian manufacturers.</p>
      </div>
    </div>

    <div class="share-bar">
      <p>Share this article</p>
      <div class="share-btns">
        <a class="share-btn share-btn-li" href="https://www.linkedin.com/sharing/share-offsite/?url=https://husnihalim.com/blog/${article.slug}/" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          Share on LinkedIn
        </a>
        <a class="share-btn share-btn-fb" href="https://www.facebook.com/sharer/sharer.php?u=https://husnihalim.com/blog/${article.slug}/" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Share on Facebook
        </a>
        <a class="share-btn share-btn-va" href="https://www.visiarmada.com" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          Visi Armada
        </a>
      </div>
    </div>
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
</body>
</html>`;
}

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
