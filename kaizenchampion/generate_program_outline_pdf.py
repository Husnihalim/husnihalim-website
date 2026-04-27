from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, Table, TableStyle
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "kaizenchampion" / "Kaizen-Champion-Program-Outline.pdf"
LOGO = ROOT / "VAC_Logo_NoBox.png"

PAGE_W, PAGE_H = A4
MARGIN = 18 * mm
CONTENT_W = PAGE_W - (MARGIN * 2)

NAVY = colors.HexColor("#0C1B2E")
NAVY_2 = colors.HexColor("#16263A")
GOLD = colors.HexColor("#C47832")
BURGUNDY = colors.HexColor("#8B2252")
INK = colors.HexColor("#1A1A1A")
MUTED = colors.HexColor("#5D6673")
LINE = colors.HexColor("#E5E7EB")
PAPER = colors.HexColor("#F7F3ED")
SOFT = colors.HexColor("#F8FAFC")
GREEN = colors.HexColor("#168A5B")


def register_fonts():
    georgia = Path("/System/Library/Fonts/Supplemental/Georgia.ttf")
    georgia_bold = Path("/System/Library/Fonts/Supplemental/Georgia Bold.ttf")
    if georgia.exists() and georgia_bold.exists():
        pdfmetrics.registerFont(TTFont("Georgia", str(georgia)))
        pdfmetrics.registerFont(TTFont("Georgia-Bold", str(georgia_bold)))
        return "Georgia", "Georgia-Bold"
    return "Times-Roman", "Times-Bold"


SERIF, SERIF_BOLD = register_fonts()
SANS = "Helvetica"
SANS_BOLD = "Helvetica-Bold"


styles = {
    "kicker": ParagraphStyle(
        "kicker",
        fontName=SANS_BOLD,
        fontSize=7.5,
        leading=9,
        textColor=GOLD,
        uppercase=True,
        spaceAfter=3,
        alignment=TA_LEFT,
    ),
    "h1": ParagraphStyle(
        "h1",
        fontName=SERIF_BOLD,
        fontSize=31,
        leading=35,
        textColor=colors.white,
        spaceAfter=8,
    ),
    "h2": ParagraphStyle(
        "h2",
        fontName=SERIF_BOLD,
        fontSize=22,
        leading=26,
        textColor=NAVY,
        spaceAfter=8,
    ),
    "h3": ParagraphStyle(
        "h3",
        fontName=SANS_BOLD,
        fontSize=10.5,
        leading=13,
        textColor=NAVY,
        spaceAfter=5,
    ),
    "body": ParagraphStyle(
        "body",
        fontName=SANS,
        fontSize=9.2,
        leading=13.2,
        textColor=INK,
        spaceAfter=7,
    ),
    "body_muted": ParagraphStyle(
        "body_muted",
        fontName=SANS,
        fontSize=8.7,
        leading=12.6,
        textColor=MUTED,
        spaceAfter=6,
    ),
    "small": ParagraphStyle(
        "small",
        fontName=SANS,
        fontSize=7.4,
        leading=10,
        textColor=MUTED,
    ),
    "small_white": ParagraphStyle(
        "small_white",
        fontName=SANS,
        fontSize=8,
        leading=11,
        textColor=colors.Color(1, 1, 1, alpha=0.72),
    ),
    "white": ParagraphStyle(
        "white",
        fontName=SANS,
        fontSize=10,
        leading=14,
        textColor=colors.Color(1, 1, 1, alpha=0.82),
        spaceAfter=7,
    ),
    "center_small": ParagraphStyle(
        "center_small",
        fontName=SANS,
        fontSize=7.2,
        leading=9.2,
        textColor=MUTED,
        alignment=TA_CENTER,
    ),
}


def para(c, text, x, y_top, width, style):
    p = Paragraph(text, style)
    _, h = p.wrap(width, 900)
    p.drawOn(c, x, y_top - h)
    return y_top - h


def pill(c, x, y, text, fill, text_color=colors.white, pad_x=8, height=15):
    c.setFont(SANS_BOLD, 7)
    w = c.stringWidth(text, SANS_BOLD, 7) + pad_x * 2
    c.setFillColor(fill)
    c.roundRect(x, y, w, height, 7, stroke=0, fill=1)
    c.setFillColor(text_color)
    c.drawString(x + pad_x, y + 4.6, text)
    return w


def header(c, page_title, page_no):
    c.setFillColor(colors.white)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - 18 * mm, PAGE_W, 18 * mm, stroke=0, fill=1)
    if LOGO.exists():
        c.drawImage(str(LOGO), MARGIN, PAGE_H - 15.6 * mm, 9 * mm, 9 * mm, mask="auto")
    c.setFont(SANS_BOLD, 8)
    c.setFillColor(colors.white)
    c.drawString(MARGIN + 12 * mm, PAGE_H - 12.2 * mm, "VISI ARMADA CONSULTING")
    c.setFont(SANS, 7.5)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.7))
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 12.2 * mm, page_title.upper())
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.4)
    c.line(MARGIN, PAGE_H - 18 * mm, PAGE_W - MARGIN, PAGE_H - 18 * mm)

    c.setFont(SANS, 7.2)
    c.setFillColor(MUTED)
    c.drawString(MARGIN, 10 * mm, "Kaizen Champion Development Program | husnihalim.com/kaizenchampion")
    c.drawRightString(PAGE_W - MARGIN, 10 * mm, f"{page_no}")


def section_title(c, y, kicker, title, subtitle=None):
    c.setFont(SANS_BOLD, 7.5)
    c.setFillColor(GOLD)
    c.drawString(MARGIN, y, kicker.upper())
    y -= 7.2 * mm
    c.setFont(SERIF_BOLD, 22)
    c.setFillColor(NAVY)
    c.drawString(MARGIN, y, title)
    y -= 8 * mm
    if subtitle:
        y = para(c, subtitle, MARGIN, y + 2, CONTENT_W, styles["body_muted"]) - 3
    return y


def card(c, x, y_top, w, h, title, body, accent=BURGUNDY, fill=colors.white):
    c.setFillColor(fill)
    c.setStrokeColor(LINE)
    c.roundRect(x, y_top - h, w, h, 5, stroke=1, fill=1)
    c.setFillColor(accent)
    c.roundRect(x, y_top - h, 3.5, h, 2, stroke=0, fill=1)
    c.setFont(SANS_BOLD, 9)
    c.setFillColor(NAVY)
    c.drawString(x + 8 * mm, y_top - 9 * mm, title)
    para(c, body, x + 8 * mm, y_top - 13 * mm, w - 13 * mm, styles["body_muted"])


def bullet_list(c, items, x, y, width, color=INK, bullet_color=BURGUNDY, size=8.7, leading=12.3):
    style = ParagraphStyle(
        "bullet",
        fontName=SANS,
        fontSize=size,
        leading=leading,
        textColor=color,
        leftIndent=10,
        firstLineIndent=-10,
        spaceAfter=3.5,
    )
    for item in items:
        p = Paragraph(f'<font color="{bullet_color.hexval()}"><b>-</b></font> {item}', style)
        _, h = p.wrap(width, 200)
        p.drawOn(c, x, y - h)
        y -= h + 1.2
    return y


def draw_cover(c):
    c.setFillColor(NAVY)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(NAVY_2)
    c.circle(PAGE_W + 10 * mm, PAGE_H - 12 * mm, 58 * mm, stroke=0, fill=1)
    c.setFillColor(BURGUNDY)
    c.circle(PAGE_W - 12 * mm, PAGE_H - 30 * mm, 34 * mm, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, PAGE_H - 47 * mm, 7 * mm, 47 * mm, stroke=0, fill=1)

    if LOGO.exists():
        c.drawImage(str(LOGO), MARGIN, PAGE_H - 34 * mm, 17 * mm, 17 * mm, mask="auto")

    c.setFont(SANS_BOLD, 8.5)
    c.setFillColor(colors.white)
    c.drawString(MARGIN + 21 * mm, PAGE_H - 24 * mm, "VISI ARMADA CONSULTING")
    c.setFont(SANS, 7.5)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.65))
    c.drawString(MARGIN + 21 * mm, PAGE_H - 29 * mm, "HRDC Registered Training Provider")

    y = PAGE_H - 68 * mm
    pill(c, MARGIN, y, "HRDC CLAIMABLE", GOLD)
    pill(c, MARGIN + 35 * mm, y, "29 MAY–2 JUNE 2026", BURGUNDY)
    pill(c, MARGIN + 75 * mm, y, "DE PALMA, SHAH ALAM", colors.HexColor("#31435A"))

    y -= 13 * mm
    y = para(c, "Kaizen Champion<br/>Development Program", MARGIN, y, 122 * mm, styles["h1"])
    y -= 4 * mm
    c.setFont(SANS, 12)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.86))
    c.drawString(MARGIN, y, "A 5-day intensive program for manufacturing leaders")
    y -= 7 * mm
    c.setFont(SANS, 10)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.7))
    c.drawString(MARGIN, y, "Build internal capability to lead practical, sustainable continuous improvement.")

    y -= 22 * mm
    fact_w = (CONTENT_W - 14 * mm) / 3
    facts = [
        ("5 days", "Applied classroom and workshop format"),
        ("90 days", "Structured implementation coaching"),
        ("15 pax", "Small cohort for hands-on support"),
    ]
    for i, (num, label) in enumerate(facts):
        x = MARGIN + i * (fact_w + 7 * mm)
        c.setFillColor(colors.Color(1, 1, 1, alpha=0.08))
        c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.13))
        c.roundRect(x, y - 30 * mm, fact_w, 30 * mm, 6, stroke=1, fill=1)
        c.setFont(SERIF_BOLD, 24)
        c.setFillColor(GOLD)
        c.drawString(x + 6 * mm, y - 12 * mm, num)
        para(c, label, x + 6 * mm, y - 16 * mm, fact_w - 12 * mm, styles["small_white"])

    bottom_y = 48 * mm
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.06))
    c.roundRect(MARGIN, bottom_y, CONTENT_W, 27 * mm, 6, stroke=0, fill=1)
    c.setFont(SANS_BOLD, 8)
    c.setFillColor(GOLD)
    c.drawString(MARGIN + 7 * mm, bottom_y + 18 * mm, "PROGRAM LEAD")
    c.setFont(SANS_BOLD, 12)
    c.setFillColor(colors.white)
    c.drawString(MARGIN + 7 * mm, bottom_y + 11.5 * mm, "Husni Halim")
    c.setFont(SANS, 8.2)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.72))
    c.drawString(MARGIN + 7 * mm, bottom_y + 6 * mm, "EFESO-Certified Process Kaizen Engineer | HRDC Accredited Trainer ID 11294")

    c.setFont(SANS_BOLD, 8)
    c.setFillColor(colors.white)
    c.drawRightString(PAGE_W - MARGIN, 21 * mm, "husnihalim.com/kaizenchampion")
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.62))
    c.drawRightString(PAGE_W - MARGIN, 15.5 * mm, "+60 16-526 1901 | husnihalim@visiarmada.com")
    c.showPage()


def draw_intro(c):
    header(c, "Program Brief", 2)
    y = PAGE_H - 31 * mm
    y = section_title(
        c,
        y,
        "INTRODUCTION",
        "Program Brief",
        "This program develops practical Kaizen Champions who can identify waste, lead structured problem solving, and sustain improvements after the training room closes.",
    )

    left_w = 102 * mm
    right_x = MARGIN + left_w + 10 * mm
    right_w = CONTENT_W - left_w - 10 * mm

    y_left = y
    y_left = para(
        c,
        "Kaizen is continuous improvement embedded in daily operations. For manufacturing teams, it creates a disciplined way to move from firefighting to prevention, from opinion-based fixes to data-driven action, and from isolated projects to a culture of sustained improvement.",
        MARGIN,
        y_left,
        left_w,
        styles["body"],
    )
    y_left = para(
        c,
        "Across five intensive days, participants work through the full improvement cycle: understand current-state performance, identify waste, diagnose root causes, design countermeasures, build an A3 report, and prepare a 90-day implementation roadmap.",
        MARGIN,
        y_left - 2 * mm,
        left_w,
        styles["body"],
    )

    glance_h = 90 * mm
    c.setFillColor(SOFT)
    c.setStrokeColor(LINE)
    c.roundRect(right_x, y - glance_h, right_w, glance_h, 7, stroke=1, fill=1)
    c.setFont(SANS_BOLD, 9)
    c.setFillColor(NAVY)
    c.drawString(right_x + 7 * mm, y - 9 * mm, "At a Glance")
    rows = [
        ("Date", "29 May–2 June 2026"),
        ("Time", "9:00 AM - 5:00 PM"),
        ("Venue", "De Palma Hotel, Shah Alam"),
        ("Format", "Public cohort, hands-on workshop"),
        ("Cohort", "Maximum 15 participants"),
        ("Fee", "Regular RM 6,500; discounts from RM 6,000"),
        ("Claim", "HRDC claimable"),
    ]
    yy = y - 17 * mm
    for label, value in rows:
        c.setFont(SANS_BOLD, 7.4)
        c.setFillColor(BURGUNDY)
        c.drawString(right_x + 7 * mm, yy, label.upper())
        value_bottom = para(c, value, right_x + 29 * mm, yy + 2.2 * mm, right_w - 36 * mm, styles["small"])
        yy = min(yy - 8.6 * mm, value_bottom - 2.5 * mm)

    y2 = y_left - 17 * mm
    c.setFont(SERIF_BOLD, 18)
    c.setFillColor(NAVY)
    c.drawString(MARGIN, y2, "Who Should Attend")
    y2 -= 8 * mm
    attend = [
        "Manufacturing supervisors and team leaders",
        "Process, production, industrial and quality engineers",
        "Operations managers, plant leaders and department heads",
        "Continuous improvement, Lean, TPM, OEE and 5S coordinators",
        "Anyone responsible for improving process performance on the floor",
    ]
    y2 = bullet_list(c, attend, MARGIN, y2, left_w)

    benefits = [
        ("Measurable returns", "Typical Kaizen projects can eliminate RM 50,000-80,000 in annual waste through scrap, downtime, rework, inventory, and labour improvements."),
        ("Internal capability", "Participants learn to lead improvements without depending on external consultants for every problem."),
        ("Sustained implementation", "The program includes 90-day coaching so gains are reviewed, reinforced, and protected from regression."),
    ]
    benefit_y = 125 * mm
    c.setFont(SERIF_BOLD, 18)
    c.setFillColor(NAVY)
    c.drawString(MARGIN, benefit_y + 11 * mm, "Why It Matters")
    benefit_w = (CONTENT_W - 12 * mm) / 3
    for i, (title, body) in enumerate(benefits):
        card(c, MARGIN + i * (benefit_w + 6 * mm), benefit_y, benefit_w, 49 * mm, title, body, GOLD, colors.white)

    c.showPage()


def draw_outcomes(c):
    header(c, "Benefits and Learning Outcomes", 3)
    y = PAGE_H - 31 * mm
    y = section_title(
        c,
        y,
        "OUTCOMES",
        "What Participants Leave With",
        "The program balances technical improvement tools with facilitation, communication, and leadership routines needed to make improvement stick.",
    )

    col_w = (CONTENT_W - 10 * mm) / 3
    cols = [
        (
            "Knowledge",
            [
                "Kaizen philosophy and competitive advantage",
                "The 8 Wastes framework",
                "QCD business impact model",
                "PDCA continuous improvement cycle",
                "Root cause analysis methods",
                "7 Quality Control Tools",
                "Poka Yoke and Jidoka concepts",
                "A3 report structure and logic",
            ],
        ),
        (
            "Technical Skills",
            [
                "Baseline assessment and data collection",
                "Systematic 5 Why and Fishbone analysis",
                "Apply 7QC tools to process data",
                "Design countermeasures and controls",
                "Facilitate 5S audits and assessments",
                "Document standard work procedures",
                "Create professional A3 reports",
                "Build KPI dashboards and review routines",
            ],
        ),
        (
            "Leadership Mindset",
            [
                "See waste as a process problem to solve",
                "Go to the actual workplace for facts",
                "Use data to guide decisions",
                "Coach teams through PDCA",
                "Manage resistance with empathy",
                "Build frontline ownership",
                "Protect gains through daily management",
                "Develop future internal champions",
            ],
        ),
    ]

    for i, (title, items) in enumerate(cols):
        x = MARGIN + i * (col_w + 5 * mm)
        c.setFillColor(SOFT if i != 1 else PAPER)
        c.setStrokeColor(LINE)
        c.roundRect(x, y - 103 * mm, col_w, 103 * mm, 7, stroke=1, fill=1)
        c.setFillColor(BURGUNDY if i != 1 else GOLD)
        c.roundRect(x, y - 12 * mm, col_w, 12 * mm, 7, stroke=0, fill=1)
        c.setFont(SANS_BOLD, 9.5)
        c.setFillColor(colors.white)
        c.drawString(x + 6 * mm, y - 7.8 * mm, title)
        bullet_list(c, items, x + 6 * mm, y - 19 * mm, col_w - 12 * mm, size=8.2, leading=11.4)

    y -= 119 * mm
    c.setFillColor(NAVY)
    c.roundRect(MARGIN, y - 42 * mm, CONTENT_W, 42 * mm, 7, stroke=0, fill=1)
    c.setFont(SERIF_BOLD, 16)
    c.setFillColor(colors.white)
    c.drawString(MARGIN + 8 * mm, y - 11 * mm, "Business Benefits")
    benefit_items = [
        "Stronger internal ownership of improvement initiatives.",
        "Clearer problem selection based on QCD impact, not opinions.",
        "Better communication of improvement logic through A3 reporting.",
        "Higher chance that improvements sustain after implementation.",
    ]
    bullet_list(c, benefit_items, MARGIN + 8 * mm, y - 18 * mm, CONTENT_W - 16 * mm, colors.Color(1, 1, 1, alpha=0.82), GOLD, 8.2, 10.6)
    c.showPage()


def curriculum_table(day, theme, morning, afternoon):
    data = [
        [
            Paragraph(f"<b>{day}</b><br/><font color='{MUTED.hexval()}'>{theme}</font>", styles["body"]),
            Paragraph("<b>Morning: 9:00 AM - 1:00 PM</b><br/>" + "<br/>".join(f"- {x}" for x in morning), styles["body_muted"]),
            Paragraph("<b>Afternoon: 2:00 PM - 5:00 PM</b><br/>" + "<br/>".join(f"- {x}" for x in afternoon), styles["body_muted"]),
        ]
    ]
    t = Table(data, colWidths=[34 * mm, 67 * mm, 67 * mm])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), PAPER),
                ("BACKGROUND", (1, 0), (-1, -1), colors.white),
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return t


def draw_curriculum_1(c):
    header(c, "5-Day Curriculum", 4)
    y = PAGE_H - 31 * mm
    y = section_title(
        c,
        y,
        "PROGRAM OUTLINE",
        "5-Day Curriculum",
        "Each day builds one part of the Champion capability model: foundation, diagnosis, analysis, implementation, and sustainment.",
    )

    days = [
        (
            "Day 1",
            "Foundation of Kaizen",
            [
                "Program overview and participant introductions",
                "Kaizen philosophy and historical context",
                "Role of a Kaizen Champion",
                "QCD framework and profitability link",
                "PDCA cycle as the engine of improvement",
            ],
            [
                "Reactive vs. proactive improvement mindset",
                "Champion competencies framework",
                "Operational excellence case study",
                "PDCA exercise on operational challenges",
                "Personal goal setting and commitment",
            ],
        ),
        (
            "Day 2",
            "Baseline and Problem Identification",
            [
                "The 8 Wastes: overproduction, waiting, transport, processing, inventory, motion, defects, talent",
                "Baseline metrics and KPIs",
                "Current-state assessment methodology",
            ],
            [
                "Waste identification workshop",
                "5S framework: Sort, Set, Shine, Standardize, Sustain",
                "Data collection planning: metric, owner, timeline",
            ],
        ),
        (
            "Day 3",
            "Root Cause Analysis and Solutions",
            [
                "5 Why analysis method",
                "Fishbone diagram construction",
                "7 Quality Control Tools overview",
            ],
            [
                "Data analysis workshop using baseline data",
                "Countermeasure development",
                "Implementation plan framework: owner, timing, resource, metric",
            ],
        ),
    ]
    for day in days:
        t = curriculum_table(*day)
        _, h = t.wrap(CONTENT_W, 80 * mm)
        t.drawOn(c, MARGIN, y - h)
        y -= h + 7 * mm
    c.showPage()


def draw_curriculum_2(c):
    header(c, "Implementation and Sustainment", 5)
    y = PAGE_H - 31 * mm
    y = section_title(c, y, "PROGRAM OUTLINE", "Implementation, Sustainability and Support")
    days = [
        (
            "Day 4",
            "Implementation and Leadership",
            [
                "A3 report development: background, analysis, solutions, plan, results",
                "Poka Yoke mistake-proofing",
                "Jidoka: build in quality and stop abnormalities",
            ],
            [
                "Visual management systems",
                "Standard work documentation",
                "Leading change: communicate, involve, train, recognize",
                "Pilot and rollout strategy",
            ],
        ),
        (
            "Day 5",
            "Sustainability and Culture",
            [
                "Sustainability strategy: audits, visual metrics, accountability, recognition",
                "Preventing regression",
                "Managing resistance with empathy",
            ],
            [
                "KPI tracking and dashboards",
                "Business impact calculation: savings, ROI, payback",
                "Capstone A3 presentations and peer feedback",
                "90-day action plan review",
            ],
        ),
    ]
    for day in days:
        t = curriculum_table(*day)
        _, h = t.wrap(CONTENT_W, 80 * mm)
        t.drawOn(c, MARGIN, y - h)
        y -= h + 7 * mm

    c.setFont(SERIF_BOLD, 18)
    c.setFillColor(NAVY)
    c.drawString(MARGIN, y - 3 * mm, "Program Includes")
    y -= 12 * mm
    items = [
        ("Tools Handbook", "A3 templates, Fishbone diagrams, check sheets, Pareto charts, 5S assessments, standard work forms, and visual management templates."),
        ("A3 Report Guidance", "Template, worked example, peer review, and facilitation support so each participant leaves with a ready-to-present improvement plan."),
        ("Implementation Roadmap", "A 90-day execution plan with milestones, ownership, KPI targets, and follow-up rhythm."),
        ("Coaching Support", "Six bi-weekly online sessions over three months, plus email and phone consultation support."),
    ]
    x = MARGIN
    w = (CONTENT_W - 8 * mm) / 2
    for idx, (title, body) in enumerate(items):
        row = idx // 2
        col = idx % 2
        card(c, x + col * (w + 8 * mm), y - row * 40 * mm, w, 33 * mm, title, body, GREEN if idx == 3 else BURGUNDY)
    c.showPage()


def draw_investment(c):
    header(c, "Investment and Registration", 6)
    y = PAGE_H - 31 * mm
    y = section_title(
        c,
        y,
        "REGISTRATION",
        "Investment and Next Steps",
        "The program is designed for companies that want internal Kaizen capability, not a one-off classroom session.",
    )

    price_data = [
        [
            Paragraph("<b>Early Bird</b><br/><font color='#5D6673'>Register by 4 May 2026</font>", styles["body"]),
            Paragraph("<b>RM 6,250</b><br/><font color='#5D6673'>per participant</font>", styles["body"]),
        ],
        [
            Paragraph("<b>Standard Rate</b><br/><font color='#5D6673'>Regular program fee</font>", styles["body"]),
            Paragraph("<b>RM 6,500</b><br/><font color='#5D6673'>per participant</font>", styles["body"]),
        ],
        [
            Paragraph("<b>Group Discount</b><br/><font color='#5D6673'>2 or more participants</font>", styles["body"]),
            Paragraph("<b>RM 6,200</b><br/><font color='#5D6673'>per participant</font>", styles["body"]),
        ],
        [
            Paragraph("<b>Group + Early Bird</b><br/><font color='#5D6673'>2+ participants by 4 May 2026</font>", styles["body"]),
            Paragraph("<b>RM 6,000</b><br/><font color='#5D6673'>per participant</font>", styles["body"]),
        ],
    ]
    t = Table(price_data, colWidths=[100 * mm, 68 * mm])
    t.setStyle(
        TableStyle(
            [
                ("BOX", (0, 0), (-1, -1), 0.7, LINE),
                ("INNERGRID", (0, 0), (-1, -1), 0.5, LINE),
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("BACKGROUND", (0, 1), (-1, 1), SOFT),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 11),
                ("RIGHTPADDING", (0, 0), (-1, -1), 11),
                ("TOPPADDING", (0, 0), (-1, -1), 9),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
            ]
        )
    )
    _, h = t.wrap(CONTENT_W, 80 * mm)
    t.drawOn(c, MARGIN, y - h)

    y -= h + 15 * mm
    c.setFillColor(PAPER)
    c.setStrokeColor(GOLD)
    c.roundRect(MARGIN, y - 34 * mm, CONTENT_W, 34 * mm, 7, stroke=1, fill=1)
    c.setFont(SANS_BOLD, 10)
    c.setFillColor(NAVY)
    c.drawString(MARGIN + 8 * mm, y - 10 * mm, "HRDC Claimable")
    para(
        c,
        "This program is claimable under HRDC for eligible Malaysian companies. Husni Halim is an HRDC accredited trainer (Trainer ID 11294). Contact Visi Armada Consulting for SBL-Khas support documents.",
        MARGIN + 8 * mm,
        y - 15 * mm,
        CONTENT_W - 16 * mm,
        styles["body_muted"],
    )

    y -= 49 * mm
    c.setFont(SERIF_BOLD, 19)
    c.setFillColor(NAVY)
    c.drawString(MARGIN, y, "Register or Enquire")
    y -= 10 * mm
    contact = [
        ("Website", "husnihalim.com/kaizenchampion"),
        ("Phone / WhatsApp", "+60 16-526 1901"),
        ("Email", "husnihalim@visiarmada.com"),
        ("Provider", "Visi Armada Consulting, Shah Alam, Selangor"),
    ]
    for label, value in contact:
        c.setFont(SANS_BOLD, 8)
        c.setFillColor(BURGUNDY)
        c.drawString(MARGIN, y, label.upper())
        c.setFont(SANS, 10)
        c.setFillColor(INK)
        c.drawString(MARGIN + 42 * mm, y, value)
        y -= 8 * mm

    c.setFillColor(NAVY)
    c.roundRect(MARGIN, 30 * mm, CONTENT_W, 23 * mm, 7, stroke=0, fill=1)
    c.setFont(SANS_BOLD, 9)
    c.setFillColor(colors.white)
    c.drawString(MARGIN + 8 * mm, 43 * mm, "Program Lead")
    c.setFont(SANS, 8.4)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.78))
    c.drawString(MARGIN + 8 * mm, 37 * mm, "Husni Halim | EFESO-Certified Process Kaizen Engineer | MPC QE5.0 External Auditor")
    c.drawString(MARGIN + 8 * mm, 32 * mm, "16+ years across Malaysia and 11 countries | 84 organisations and project sites served")
    c.showPage()


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Kaizen Champion Development Program - Program Outline")
    c.setAuthor("Visi Armada Consulting")
    c.setSubject("Professional program outline for the Kaizen Champion Development Program")
    draw_cover(c)
    draw_intro(c)
    draw_outcomes(c)
    draw_curriculum_1(c)
    draw_curriculum_2(c)
    draw_investment(c)
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
