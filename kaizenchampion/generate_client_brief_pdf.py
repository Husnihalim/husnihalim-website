from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "kaizenchampion" / "Kaizen-Champion-Client-Brief.pdf"

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
    "h1": ParagraphStyle(
        "h1",
        fontName=SERIF_BOLD,
        fontSize=34,
        leading=38,
        textColor=colors.white,
        spaceAfter=10,
    ),
    "cover_sub": ParagraphStyle(
        "cover_sub",
        fontName=SANS,
        fontSize=12,
        leading=17,
        textColor=colors.Color(1, 1, 1, alpha=0.82),
    ),
    "h2": ParagraphStyle(
        "h2",
        fontName=SERIF_BOLD,
        fontSize=24,
        leading=29,
        textColor=NAVY,
        spaceAfter=8,
    ),
    "h3": ParagraphStyle(
        "h3",
        fontName=SANS_BOLD,
        fontSize=10.5,
        leading=14,
        textColor=NAVY,
        spaceAfter=4,
    ),
    "body": ParagraphStyle(
        "body",
        fontName=SANS,
        fontSize=9.7,
        leading=14.2,
        textColor=INK,
        spaceAfter=8,
    ),
    "muted": ParagraphStyle(
        "muted",
        fontName=SANS,
        fontSize=8.8,
        leading=12.8,
        textColor=MUTED,
        spaceAfter=6,
    ),
    "small": ParagraphStyle(
        "small",
        fontName=SANS,
        fontSize=7.5,
        leading=10,
        textColor=MUTED,
        alignment=TA_CENTER,
    ),
}


def para(c, text, x, y_top, width, style):
    p = Paragraph(text, style)
    _, h = p.wrap(width, 900)
    p.drawOn(c, x, y_top - h)
    return y_top - h


def header(c, title, page_no):
    c.setFillColor(colors.white)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(NAVY)
    c.rect(0, PAGE_H - 16 * mm, PAGE_W, 16 * mm, stroke=0, fill=1)
    c.setFont(SANS_BOLD, 7.8)
    c.setFillColor(colors.white)
    c.drawString(MARGIN, PAGE_H - 10.5 * mm, "KAIZEN CHAMPION DEVELOPMENT PROGRAM")
    c.setFont(SANS, 7.4)
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.68))
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 10.5 * mm, title.upper())
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.2)
    c.line(MARGIN, PAGE_H - 16 * mm, PAGE_W - MARGIN, PAGE_H - 16 * mm)

    c.setFont(SANS, 7.2)
    c.setFillColor(MUTED)
    c.drawString(MARGIN, 10 * mm, "Kaizen Champion Development Program")
    c.drawRightString(PAGE_W - MARGIN, 10 * mm, str(page_no))


def section_title(c, y, kicker, title, subtitle=None):
    c.setFont(SANS_BOLD, 7.5)
    c.setFillColor(GOLD)
    c.drawString(MARGIN, y, kicker.upper())
    y -= 7 * mm
    y = para(c, title, MARGIN, y + 3, CONTENT_W, styles["h2"])
    if subtitle:
        y = para(c, subtitle, MARGIN, y - 1, 128 * mm, styles["muted"])
    return y - 3 * mm


def bullet_list(c, items, x, y, width, size=9.1, leading=13.1):
    bullet_gap = 8
    style = ParagraphStyle(
        "bullet",
        fontName=SANS,
        fontSize=size,
        leading=leading,
        textColor=INK,
        leftIndent=bullet_gap,
        firstLineIndent=0,
        spaceAfter=5,
    )
    for item in items:
        p = Paragraph(item, style)
        _, h = p.wrap(width - bullet_gap, 220)
        c.setFont(SANS_BOLD, size)
        c.setFillColor(BURGUNDY)
        c.drawString(x, y - size, "-")
        p.drawOn(c, x, y - h)
        y -= h + 1.2
    return y


def card(c, x, y_top, w, h, title, body, accent=BURGUNDY, fill=colors.white):
    c.setFillColor(fill)
    c.setStrokeColor(LINE)
    c.roundRect(x, y_top - h, w, h, 5, stroke=1, fill=1)
    c.setFillColor(accent)
    c.roundRect(x, y_top - h, 3.2, h, 2, stroke=0, fill=1)
    c.setFont(SANS_BOLD, 9.2)
    c.setFillColor(NAVY)
    c.drawString(x + 7 * mm, y_top - 8 * mm, title)
    para(c, body, x + 7 * mm, y_top - 12.5 * mm, w - 12 * mm, styles["muted"])


def draw_cover(c):
    c.setFillColor(NAVY)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    c.setFillColor(NAVY_2)
    c.circle(PAGE_W + 8 * mm, PAGE_H - 8 * mm, 60 * mm, stroke=0, fill=1)
    c.setFillColor(BURGUNDY)
    c.circle(PAGE_W - 10 * mm, PAGE_H - 28 * mm, 34 * mm, stroke=0, fill=1)
    c.setFillColor(GOLD)
    c.rect(0, PAGE_H - 49 * mm, 7 * mm, 49 * mm, stroke=0, fill=1)

    c.setFont(SANS_BOLD, 8.8)
    c.setFillColor(GOLD)
    c.drawString(MARGIN, PAGE_H - 27 * mm, "CLIENT PROGRAM BRIEF")

    y = PAGE_H - 72 * mm
    y = para(c, "Kaizen Champion<br/>Development Program", MARGIN, y, 130 * mm, styles["h1"])
    y -= 5 * mm
    y = para(
        c,
        "Developing internal improvement leaders for manufacturing operations",
        MARGIN,
        y,
        126 * mm,
        styles["cover_sub"],
    )

    y -= 22 * mm
    c.setFillColor(colors.Color(1, 1, 1, alpha=0.08))
    c.setStrokeColor(colors.Color(1, 1, 1, alpha=0.14))
    c.roundRect(MARGIN, y - 52 * mm, CONTENT_W, 52 * mm, 8, stroke=1, fill=1)
    c.setFont(SANS_BOLD, 8)
    c.setFillColor(GOLD)
    c.drawString(MARGIN + 8 * mm, y - 10 * mm, "BRIEF INTRODUCTION")
    para(
        c,
        "This program is designed to develop internal Kaizen Champions who can identify operational waste, structure improvement work, and support practical follow-through on the factory floor. Participants will learn how to frame real workplace problems, use simple but disciplined improvement tools, and prepare an A3-based action plan that can be reviewed with management after the program.",
        MARGIN + 8 * mm,
        y - 18 * mm,
        CONTENT_W - 16 * mm,
        ParagraphStyle(
            "cover_body",
            fontName=SANS,
            fontSize=10,
            leading=15.4,
            textColor=colors.Color(1, 1, 1, alpha=0.82),
            alignment=TA_LEFT,
        ),
    )

    bottom_y = 34 * mm
    facts = [
        ("Practical", "Workplace problem framing"),
        ("Structured", "PDCA, root cause and A3 thinking"),
        ("Sustainable", "Follow-through and ownership mindset"),
    ]
    fact_w = (CONTENT_W - 12 * mm) / 3
    for i, (label, body) in enumerate(facts):
        x = MARGIN + i * (fact_w + 6 * mm)
        c.setFillColor(colors.Color(1, 1, 1, alpha=0.06))
        c.roundRect(x, bottom_y, fact_w, 28 * mm, 5, stroke=0, fill=1)
        c.setFont(SANS_BOLD, 9)
        c.setFillColor(colors.white)
        c.drawString(x + 6 * mm, bottom_y + 17 * mm, label)
        para(
            c,
            body,
            x + 6 * mm,
            bottom_y + 12 * mm,
            fact_w - 12 * mm,
            ParagraphStyle("cover_small", fontName=SANS, fontSize=7.8, leading=10.6, textColor=colors.Color(1, 1, 1, alpha=0.68)),
        )
    c.showPage()


def draw_objectives(c):
    header(c, "Course Objectives", 2)
    y = PAGE_H - 31 * mm
    y = section_title(
        c,
        y,
        "COURSE OBJECTIVES",
        "What the Program Is Designed to Build",
        "The objectives focus on practical improvement ownership: seeing the problem clearly, analysing it with discipline, and preparing action that can be followed through at work.",
    )

    objectives = [
        ("Champion Role", "Understand the role of a Kaizen Champion in supporting continuous improvement and practical workplace ownership."),
        ("Waste Identification", "Identify waste, recurring problems, and operational losses in daily manufacturing work."),
        ("Structured Problem Solving", "Apply PDCA, 5 Why, Fishbone, and 7QC tools to analyse real workplace problems."),
        ("Business Impact", "Use QCD thinking to connect improvement activity with quality, cost, delivery, and management priorities."),
        ("Countermeasure Design", "Develop practical countermeasures using visual management, standard work, mistake-proofing, and simple control methods."),
        ("A3 Action Planning", "Prepare a clear A3 improvement report and implementation action plan for management review."),
    ]

    card_w = (CONTENT_W - 8 * mm) / 2
    card_h = 38 * mm
    start_y = y
    for idx, (title, body) in enumerate(objectives):
        row = idx // 2
        col = idx % 2
        x = MARGIN + col * (card_w + 8 * mm)
        yy = start_y - row * (card_h + 7 * mm)
        card(c, x, yy, card_w, card_h, title, body, GOLD if idx in (1, 3) else BURGUNDY, SOFT if idx % 2 == 0 else colors.white)

    y = start_y - 3 * (card_h + 7 * mm) - 4 * mm
    c.setFillColor(PAPER)
    c.setStrokeColor(LINE)
    c.roundRect(MARGIN, y - 38 * mm, CONTENT_W, 38 * mm, 7, stroke=1, fill=1)
    c.setFont(SERIF_BOLD, 17)
    c.setFillColor(NAVY)
    c.drawString(MARGIN + 8 * mm, y - 10 * mm, "Learning Approach")
    para(
        c,
        "The program uses a practical, workshop-based format. Participants work from operational examples and improvement logic rather than theory alone. The emphasis is on making problems visible, using evidence, selecting workable countermeasures, and preparing the next action in a way that supervisors and managers can review.",
        MARGIN + 8 * mm,
        y - 16 * mm,
        CONTENT_W - 16 * mm,
        styles["body"],
    )
    c.showPage()


def draw_outline_outcomes(c):
    header(c, "Detailed Course Outline", 3)
    y = PAGE_H - 31 * mm
    y = section_title(
        c,
        y,
        "COURSE OUTLINE",
        "Detailed 5-Day Learning Flow",
        "Each day builds one part of the Champion capability model: foundation, diagnosis, analysis, implementation planning, and sustainment.",
    )

    y = detailed_day(
        c,
        y,
        "Day 1",
        "Foundation of Kaizen",
        [
            "Program overview and participant introductions.",
            "Kaizen philosophy, historical context, and relevance to modern manufacturing operations.",
            "The role of a Kaizen Champion: responsibilities, expected behaviours, and organisational impact.",
            "Quality, Cost, Delivery (QCD) framework and how improvement links to business performance.",
            "PDCA cycle as the basic engine for continuous improvement.",
        ],
        [
            "Reactive versus proactive mindset: moving from firefighting to prevention.",
            "Champion competencies: technical problem solving, facilitation, communication, and follow-through.",
            "Operational excellence case study and discussion on successful improvement methods.",
            "PDCA exercise using practical operational challenges.",
            "Personal goal setting and participant commitment for the program.",
        ],
    )
    detailed_day(
        c,
        y - 6 * mm,
        "Day 2",
        "Baseline and Problem Identification",
        [
            "The 8 Wastes: overproduction, waiting, transport, processing, inventory, motion, defects, and underutilised talent.",
            "Baseline metrics and KPI selection, including cycle time, defect rate, downtime, lead time, and labour productivity.",
            "Assessment methodology for understanding the current state before jumping to solutions.",
        ],
        [
            "Waste identification workshop using practical workplace examples.",
            "5S framework: Sort, Set in Order, Shine, Standardise, and Sustain.",
            "Data collection planning: process boundary, metric definition, owner, timing, and evidence required.",
        ],
    )
    c.showPage()


def draw_outline_part_two(c):
    header(c, "Detailed Course Outline", 4)
    y = PAGE_H - 31 * mm
    y = section_title(c, y, "COURSE OUTLINE", "Analysis, Countermeasures and Implementation")
    y = detailed_day(
        c,
        y,
        "Day 3",
        "Root Cause Analysis and Solutions",
        [
            "5 Why analysis method for drilling down from symptoms to true causes.",
            "Fishbone diagram construction using Man, Machine, Method, Material, and Environment thinking.",
            "7 Quality Control Tools: Check Sheet, Pareto, Histogram, Run Chart, Scatter Plot, Stratification, and Control Chart.",
        ],
        [
            "Data analysis workshop using baseline information and observed process patterns.",
            "Countermeasure development: creating specific, testable responses to root causes.",
            "Implementation plan framework covering owner, timing, resources, success criteria, and follow-up.",
        ],
    )
    detailed_day(
        c,
        y - 6 * mm,
        "Day 4",
        "Implementation and Leadership",
        [
            "A3 report development: background, current condition, analysis, countermeasures, plan, and expected results.",
            "Poka Yoke mistake-proofing and how to prevent errors before they happen.",
            "Jidoka concept: building quality into the process and responding when abnormalities appear.",
        ],
        [
            "Visual management systems that make status, problems, and targets visible at a glance.",
            "Standard work documentation: best known method, sequence, timing, and quality criteria.",
            "Leading change: communicating why, involving staff, training properly, and building early buy-in.",
            "Pilot and rollout strategy: start small, monitor daily, adjust quickly, then scale.",
        ],
    )
    c.showPage()


def draw_outline_part_three(c):
    header(c, "Detailed Course Outline", 5)
    y = PAGE_H - 31 * mm
    y = section_title(c, y, "COURSE OUTLINE", "Sustainment and Participant Output")
    y = detailed_day(
        c,
        y,
        "Day 5",
        "Sustainability and Culture",
        [
            "Sustainability strategy: standard work audits, visual metrics, accountability, and recognition.",
            "Preventing regression through review routines, quick-fix protocols, and training refreshes.",
            "Managing resistance by addressing fear, habit, effort, and ownership barriers with empathy.",
        ],
        [
            "KPI tracking and dashboards linked to Quality, Cost, and Delivery.",
            "Business impact framing: connecting KPI movement, waste reduction, and evidence to management priorities.",
            "Capstone presentations where participants present their A3 report and receive feedback.",
            "Implementation action plan review covering next steps, owner rhythm, support needed, and follow-through.",
        ],
    )

    y -= 3 * mm
    c.setFont(SANS_BOLD, 7.5)
    c.setFillColor(GOLD)
    c.drawString(MARGIN, y, "LEARNING OUTCOMES")
    y -= 8 * mm

    outcomes = [
        "Explain key Kaizen principles and the Champion role.",
        "Identify waste and define a practical improvement opportunity.",
        "Analyse problems using structured root cause methods.",
        "Select suitable countermeasures based on evidence.",
        "Build a simple KPI tracking structure.",
        "Present an A3 improvement plan clearly to supervisors or management.",
        "Support follow-through so improvements are not lost after training.",
    ]

    left_w = 96 * mm
    y_left = bullet_list(c, outcomes[:4], MARGIN, y, left_w)
    bullet_list(c, outcomes[4:], MARGIN + left_w + 12 * mm, y, CONTENT_W - left_w - 12 * mm)

    note_y = min(y_left, y - 46 * mm) - 5 * mm
    c.setFillColor(NAVY)
    c.roundRect(MARGIN, note_y - 27 * mm, CONTENT_W, 27 * mm, 7, stroke=0, fill=1)
    c.setFont(SERIF_BOLD, 15)
    c.setFillColor(colors.white)
    c.drawString(MARGIN + 8 * mm, note_y - 9 * mm, "Expected Participant Output")
    para(
        c,
        "A structured A3 improvement plan, selected KPI, and practical implementation actions that can be reviewed with the participant's supervisor or management team.",
        MARGIN + 8 * mm,
        note_y - 15 * mm,
        CONTENT_W - 16 * mm,
        ParagraphStyle("white_body", fontName=SANS, fontSize=8.8, leading=12.6, textColor=colors.Color(1, 1, 1, alpha=0.8)),
    )
    c.showPage()


def detailed_day(c, y, day, title, morning, afternoon):
    c.setFillColor(SOFT)
    c.setStrokeColor(LINE)
    block_h = 90 * mm
    c.roundRect(MARGIN, y - block_h, CONTENT_W, block_h, 6, stroke=1, fill=1)
    c.setFillColor(BURGUNDY)
    c.roundRect(MARGIN, y - 16 * mm, CONTENT_W, 16 * mm, 6, stroke=0, fill=1)
    c.setFont(SANS_BOLD, 9)
    c.setFillColor(colors.white)
    c.drawString(MARGIN + 7 * mm, y - 10 * mm, day)
    c.setFont(SANS_BOLD, 10)
    c.drawString(MARGIN + 28 * mm, y - 10 * mm, title)

    col_w = (CONTENT_W - 21 * mm) / 2
    left_x = MARGIN + 7 * mm
    right_x = left_x + col_w + 7 * mm
    body_y = y - 24 * mm

    c.setFont(SANS_BOLD, 8)
    c.setFillColor(NAVY)
    c.drawString(left_x, body_y, "MORNING SESSION")
    bullet_list(c, morning, left_x, body_y - 5 * mm, col_w, size=7.8, leading=10.6)

    c.setFont(SANS_BOLD, 8)
    c.setFillColor(NAVY)
    c.drawString(right_x, body_y, "AFTERNOON SESSION")
    bullet_list(c, afternoon, right_x, body_y - 5 * mm, col_w, size=7.8, leading=10.6)

    return y - block_h - 6 * mm


def main():
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Kaizen Champion Development Program - Client Brief")
    c.setAuthor("Kaizen Champion Development Program")
    draw_cover(c)
    draw_objectives(c)
    draw_outline_outcomes(c)
    draw_outline_part_two(c)
    draw_outline_part_three(c)
    c.save()
    print(OUT)


if __name__ == "__main__":
    main()
