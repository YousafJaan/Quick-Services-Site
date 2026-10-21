"""
tools/guide_content.py
Complete 27-page content and CSS blueprint for The Research Student's Field Guide.
"""

def get_html(qr_image_path):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>The Research Student's Field Guide</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
@page {{
  size: A4 portrait;
  margin: 0;
}}
* {{
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}}
body {{
  margin: 0;
  padding: 0;
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  color: #0a0f1c;
  background: #ffffff;
  font-size: 13px;
  line-height: 1.52;
}}
.d {{
  font-family: 'Bricolage Grotesque', sans-serif;
  letter-spacing: -0.035em;
  font-weight: 800;
}}
a {{
  color: inherit;
  text-decoration: none;
}}
.page {{
  width: 210mm;
  height: 297mm;
  max-height: 297mm;
  overflow: hidden;
  position: relative;
  page-break-after: always;
  break-after: page;
  padding: 16mm 18mm 14mm 18mm;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}}

/* Top rule on inner pages */
.top-bar-rule {{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4.5mm;
  background: #ff6b2c;
}}

/* Header & Footer */
.p-hdr {{
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 2.5mm;
  margin-bottom: 4.5mm;
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
  color: #64748b;
}}
.p-hdr span.accent {{
  color: #ff6b2c;
}}
.p-ftr {{
  margin-top: auto;
  border-top: 1px solid #e2e8f0;
  padding-top: 2.5mm;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #64748b;
  font-weight: 600;
}}

/* Typography */
h1.ch-title {{
  font-size: 26px;
  line-height: 1.12;
  margin: 0 0 10px;
  color: #0a0f1c;
}}
.ch-num {{
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #ff6b2c;
  margin-bottom: 3px;
}}
.subh {{
  font-size: 15px;
  margin: 10px 0 5px;
  color: #0a0f1c;
}}
p {{
  margin: 0 0 8px;
  color: #334155;
}}
ul, ol {{
  margin: 4px 0 8px;
  padding-left: 18px;
  color: #334155;
}}
li {{
  margin: 3px 0;
}}
strong {{
  color: #0a0f1c;
}}

/* Styled components */
.problem-card {{
  background: #f1f5f9;
  border-left: 3.5px solid #0a0f1c;
  padding: 8px 12px;
  border-radius: 6px;
  margin: 6px 0 10px;
  font-size: 12.5px;
}}
.tip-box {{
  background: #fff7ed;
  border-left: 3.5px solid #ff6b2c;
  padding: 8px 12px;
  border-radius: 6px;
  margin: 6px 0;
  font-size: 12px;
  color: #7c2d12;
}}
.tip-box strong {{
  color: #9a3412;
}}
.mistake-box {{
  background: #fef2f2;
  border-left: 3.5px solid #ef4444;
  padding: 8px 12px;
  border-radius: 6px;
  margin: 6px 0;
  font-size: 12px;
  color: #991b1b;
}}
.mistake-box strong {{
  color: #b91c1c;
}}
.help-card {{
  background: #0a0f1c;
  color: #ffffff;
  border-radius: 10px;
  padding: 10px 14px;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}}
.help-card .htxt strong {{
  color: #fdba74;
  font-size: 13px;
  display: block;
}}
.help-card .htxt span {{
  font-size: 11.5px;
  color: #94a3b8;
  display: block;
  line-height: 1.35;
}}
.wa-btn {{
  background: #ff6b2c;
  color: #0a0f1c !important;
  font-weight: 800;
  font-size: 11.5px;
  padding: 7px 14px;
  border-radius: 999px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}}

/* Tables */
table.clean-tbl {{
  width: 100%;
  border-collapse: collapse;
  font-size: 11.5px;
  margin: 6px 0 8px;
}}
table.clean-tbl th {{
  background: #0a0f1c;
  color: #ffffff;
  padding: 6px 8px;
  text-align: left;
  font-weight: 700;
}}
table.clean-tbl td {{
  padding: 5px 8px;
  border-bottom: 1px solid #e2e8f0;
  color: #334155;
  vertical-align: top;
}}
table.clean-tbl tr:nth-child(even) td {{
  background: #f8fafc;
}}

/* Specific Cover */
.cover {{
  background: #0a0f1c;
  color: #ffffff;
  padding: 24mm 20mm;
  justify-content: space-between;
}}
.back-cover {{
  background: #0a0f1c;
  color: #ffffff;
  padding: 22mm 20mm;
  justify-content: space-between;
  text-align: center;
}}
.tag-badge {{
  display: inline-block;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 1.6px;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid #fdba74;
  color: #fdba74;
}}
</style>
</head>
<body>

<!-- ==========================================
     PAGE 1: COVER
     ========================================== -->
<div class="page cover">
  <div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:28mm">
      <span style="width:42px;height:42px;border-radius:12px;background:#ff6b2c;color:#0a0f1c;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:900" class="d">Q</span>
      <span class="d" style="font-size:24px;color:#fff;letter-spacing:-0.02em">Quick Services</span>
    </div>

    <span class="tag-badge">The Complete Reference Manual</span>
    <h1 class="d" style="font-size:46px;line-height:0.98;color:#ffffff;margin:18px 0 16px;max-width:180mm">
      The Research Student's <span style="color:#ff6b2c">Field Guide.</span>
    </h1>
    <p style="font-size:18px;color:#94a3b8;max-width:160mm;line-height:1.45;margin:0 0 24px">
      From topic selection, sampling, and SPSS data analysis to thesis writing and viva defense — step by step.
    </p>

    <div style="background:#111827;border:1px solid #1e293b;border-radius:14px;padding:14px 18px;max-width:165mm">
      <div style="color:#fdba74;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">
        Strict Academic Integrity Protocol
      </div>
      <div style="color:#cbd5e1;font-size:12px;line-height:1.45">
        We teach, edit, and coach. The student remains the sole author. We never ghostwrite assignments or theses, and we never assist in evading plagiarism or AI-detection systems.
      </div>
    </div>
  </div>

  <div style="border-top:1px solid #1e293b;padding-top:16px;display:flex;justify-content:space-between;align-items:flex-end">
    <div>
      <div class="d" style="font-size:17px;color:#fff">M. Yousaf</div>
      <div style="font-size:12px;color:#94a3b8">Lead Academic Consultant, Quick Services</div>
      <div style="font-size:12px;color:#64748b;margin-top:4px">WhatsApp: +92 329 6646824 &bull; quickservices489@gmail.com</div>
    </div>
    <div style="text-align:right">
      <div style="color:#ff6b2c;font-weight:800;font-size:12px">Free Complete Edition</div>
      <div style="color:#64748b;font-size:11px">quickservices.pk</div>
    </div>
  </div>
</div>

<!-- ==========================================
     PAGE 2: AUTHOR'S NOTE
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services &bull; Introduction</span><span class="accent">Author's Note</span></div>

  <span class="ch-num">Welcome</span>
  <h1 class="ch-title d">Why I wrote this guide for you</h1>

  <div style="display:flex;gap:18px;margin-bottom:12px;align-items:flex-start">
    <div style="width:70px;height:70px;border-radius:16px;background:linear-gradient(135deg,#ff6b2c,#9a3412);color:#0a0f1c;font-size:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0" class="d">
      MY
    </div>
    <div>
      <div class="d" style="font-size:16px;color:#0a0f1c">M. Yousaf</div>
      <div style="font-size:12px;color:#64748b;margin-bottom:6px">Lead Academic Consultant &bull; [ADD: degrees & university] &bull; [ADD: years of experience]</div>
      <p style="font-size:12.5px;line-height:1.45;margin:0">
        Every academic year, I review hundreds of dissertation drafts, proposal papers, and statistical datasets. Most struggling students are not lacking intelligence; they are simply trapped in avoidable methodological traps.
      </p>
    </div>
  </div>

  <p>
    I wrote <strong>The Research Student's Field Guide</strong> to demystify every phase of the research cycle. Too many supervisors hand students an outdated university template and expect them to independently master Crossref Boolean syntax, G*Power calculations, SPSS variance assumptions, and APA 7th style conventions without guidance.
  </p>

  <div class="tip-box">
    <strong>My core philosophy:</strong> You must understand and own every sentence and statistical coefficient you submit. When you defend your viva, your supervisor cannot sit next to you. My mission is to make sure you never have to panic or guess during your defense.
  </div>

  <h2 class="subh d">What this guide provides</h2>
  <ul>
    <li><strong>Zero fluff:</strong> Concrete formulas, verifiable database search strings, and tested alignment matrices.</li>
    <li><strong>Click-by-click SPSS paths:</strong> No mysterious scripts; straightforward menu paths and reporting patterns.</li>
    <li><strong>Real problem frameworks:</strong> Battle-tested worksheets for topic feasibility, alignment, and viva rehearsals.</li>
    <li><strong>Direct access:</strong> When you hit a roadblock on your own project, I am personally available on WhatsApp to assist.</li>
  </ul>

  <div class="help-card" style="margin-top:auto">
    <div class="htxt">
      <strong>Discuss your research with M. Yousaf</strong>
      <span>Send your working topic or draft for an honest evaluation and free consultation.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20read%20your%20welcome%20note%20in%20the%20Field%20Guide%20and%20would%20like%20to%20discuss%20my%20research." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 2</span></div>
</div>

<!-- ==========================================
     PAGE 3: INTEGRITY & HOW TO USE
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services &bull; Standards</span><span class="accent">Academic Integrity</span></div>

  <span class="ch-num">Foundations</span>
  <h1 class="ch-title d">How to use this guide &amp; our promise</h1>

  <div style="background:#0a0f1c;color:#fff;border-radius:12px;padding:16px 18px;margin-bottom:12px">
    <span class="tag-badge" style="border-color:#ff6b2c;color:#ff6b2c;margin-bottom:8px">Our Uncompromising Commitment</span>
    <div class="d" style="font-size:18px;color:#ffffff;margin:4px 0 6px">We teach and coach. You remain the author.</div>
    <p style="color:#cbd5e1;font-size:12px;line-height:1.45;margin:0">
      Quick Services operates under strict academic ethics. We do not write assignments, proposals, or theses for submission under your name. We do not fabricate data, invent artificial survey responses, or assist in bypassing Turnitin, Copyleaks, or AI-detection filters. Honest scholarship reported with clarity is the fastest and only reliable path to a degree you can stand behind with pride.
    </p>
  </div>

  <h2 class="subh d">Table of Contents &amp; Guide Roadmap</h2>
  <table class="clean-tbl">
    <thead>
      <tr><th style="width:16%">Chapter</th><th style="width:68%">Topic &amp; Core Learning Objective</th><th style="width:16%;text-align:right">Page</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Chapter 01</strong></td><td><strong>Topic Selection:</strong> The 3-question feasibility filter and 1-page supervisor pitch.</td><td style="text-align:right">4 &ndash; 5</td></tr>
      <tr><td><strong>Chapter 02</strong></td><td><strong>Research Questions &amp; Objectives:</strong> Comparison, relationship, and alignment matrix.</td><td style="text-align:right">6 &ndash; 7</td></tr>
      <tr><td><strong>Chapter 03</strong></td><td><strong>Literature Search:</strong> Crossref, OpenAlex, PubMed, Boolean operators, and log sheets.</td><td style="text-align:right">8 &ndash; 9</td></tr>
      <tr><td><strong>Chapter 04</strong></td><td><strong>Design &amp; Sampling:</strong> Quantitative vs qualitative, G*Power calculation, survey formulas.</td><td style="text-align:right">10 &ndash; 11</td></tr>
      <tr><td><strong>Chapter 05</strong></td><td><strong>SPSS &amp; SmartPLS Analysis:</strong> Data cleaning, outlier screening, and menu paths.</td><td style="text-align:right">12 &ndash; 13</td></tr>
      <tr><td><strong>Chapter 06</strong></td><td><strong>Writing &amp; Formatting:</strong> IMRaD, honest paraphrasing, APA/IEEE citations, abstract rules.</td><td style="text-align:right">14 &ndash; 15</td></tr>
      <tr><td><strong>Chapter 07</strong></td><td><strong>Viva Defense Preparation:</strong> Examiner psychology, A-R-E framework, and question bank.</td><td style="text-align:right">16 &ndash; 17</td></tr>
      <tr><td><strong>Specialities</strong></td><td><strong>Field by Field Services:</strong> Detailed breakdown of M. Yousaf's six consulting domains.</td><td style="text-align:right">18 &ndash; 23</td></tr>
      <tr><td><strong>Process &amp; FAQ</strong></td><td><strong>Workflow &amp; Answers:</strong> 4-step process, pricing, payment methods, and ethics FAQ.</td><td style="text-align:right">24 &ndash; 26</td></tr>
    </tbody>
  </table>

  <div class="tip-box">
    <strong>Navigation advice:</strong> Read Chapters 1 through 4 before collecting your first questionnaire or instrument. If you are already at the data stage, proceed directly to Chapter 5.
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 3</span></div>
</div>

<!-- ==========================================
     PAGE 4: CHAPTER 1 (PART 1)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 01 &bull; Part 1</span><span class="accent">Topic Selection</span></div>

  <span class="ch-num">Chapter 01</span>
  <h1 class="ch-title d">Choose a topic you can actually finish</h1>

  <div class="problem-card">
    <strong>The Real-World Problem:</strong> Most delayed theses stall at month three because the student chose a grand, philosophical topic without checking whether participants, medical records, or data files actually exist.
  </div>

  <h2 class="subh d">The 3-Question Feasibility Filter</h2>
  <p>Test every candidate topic idea against these three ruthless criteria before submitting a proposal:</p>
  <ul>
    <li><strong>1. Answerable:</strong> Can empirical data or concrete evidence settle the question, rather than subjective debate?</li>
    <li><strong>2. Measurable:</strong> Can you explicitly name the variables, scales, or qualitative themes you will gather?</li>
    <li><strong>3. Doable:</strong> Can you complete collection within your timeline, physical geographic access, and budget?</li>
  </ul>

  <h2 class="subh d">The Narrowing Funnel (Step-by-Step Walkthrough)</h2>
  <p>Broad topics invite harsh committee criticism. Narrow your focus across three distinct levels:</p>
  
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px 14px;margin:8px 0">
    <div style="color:#64748b;font-size:11px;font-weight:700">STAGE 1: TOO BROAD</div>
    <div style="font-weight:700;color:#991b1b">&times; "Hospital Waste Management and Environmental Health"</div>
    <div style="color:#64748b;font-size:11px;font-weight:700;margin-top:6px">STAGE 2: NARROWER BUT VAGUE</div>
    <div style="font-weight:700;color:#c2410c">&sim; "Clinical Waste Practices in Operating Theatres of Private Hospitals"</div>
    <div style="color:#64748b;font-size:11px;font-weight:700;margin-top:6px">STAGE 3: ACTIONABLE &amp; DEFENDABLE</div>
    <div style="font-weight:700;color:#15803d">&check; "Waste Segregation Protocol Compliance Among Scrub Nurses in Tertiary Private Hospitals of Lahore"</div>
  </div>

  <div class="tip-box">
    <strong>M. Yousaf's Advice:</strong> Notice how Stage 3 names the specific population (scrub nurses), the specific behavior (segregation protocol compliance), the exact facility tier (tertiary private hospitals), and the geographic boundary.
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 4</span></div>
</div>

<!-- ==========================================
     PAGE 5: CHAPTER 1 (PART 2)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 01 &bull; Part 2</span><span class="accent">Topic Scoring &amp; Pitch</span></div>

  <span class="ch-num">Chapter 01 &bull; Tools</span>
  <h1 class="ch-title d">Scoring worksheet &amp; supervisor pitch</h1>

  <p>Score up to three candidate topics from 1 (weak) to 5 (strong). Choose the highest overall score, but reject any topic that receives a 1 on participant access or ethics feasibility:</p>

  <table class="clean-tbl">
    <thead>
      <tr><th>Evaluation Criterion</th><th>Topic A</th><th>Topic B</th><th>Topic C</th></tr>
    </thead>
    <tbody>
      <tr><td>Personal interest (will I still care in 6 months?)</td><td>/ 5</td><td>/ 5</td><td>/ 5</td></tr>
      <tr><td>Answerable with empirical data / documents</td><td>/ 5</td><td>/ 5</td><td>/ 5</td></tr>
      <tr><td>Variables or themes are clearly defined</td><td>/ 5</td><td>/ 5</td><td>/ 5</td></tr>
      <tr><td>Guaranteed access to sample or organizational data</td><td>/ 5</td><td>/ 5</td><td>/ 5</td></tr>
      <tr><td>Fits current budget and semester timeline</td><td>/ 5</td><td>/ 5</td><td>/ 5</td></tr>
      <tr><td>Supervisor has proven expertise in this sub-domain</td><td>/ 5</td><td>/ 5</td><td>/ 5</td></tr>
      <tr><td><strong>Total Feasibility Score (Max 30)</strong></td><td><strong>/ 30</strong></td><td><strong>/ 30</strong></td><td><strong>/ 30</strong></td></tr>
    </tbody>
  </table>

  <h2 class="subh d">The 1-Page Pitch for Your Supervisor</h2>
  <ol>
    <li><strong>Working Title:</strong> Single concise line stating variables and target population.</li>
    <li><strong>The Gap:</strong> Exactly what remains unmeasured or unsolved in two sentences.</li>
    <li><strong>Research Question:</strong> The core comparison or relationship to be examined.</li>
    <li><strong>Methodology Outline:</strong> Proposed design, sample size estimate, and tool source.</li>
    <li><strong>Feasibility Evidence:</strong> How consent, data access, and ethics will be secured.</li>
    <li><strong>The Specific Ask:</strong> The exact approval or guidance requested during the meeting.</li>
  </ol>

  <div class="mistake-box">
    <strong>Common Mistake:</strong> Walking into your supervisor's office asking "What topic should I do?" Supervisors respect candidates who present two evaluated options with feasibility metrics.
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Where M. Yousaf Helps &bull; Topic Review Session</strong>
      <span>Get a 1-on-1 assessment of your proposed topic and a drafted supervisor pitch.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20help%20choosing%20and%20refining%20my%20research%20topic." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 5</span></div>
</div>

<!-- ==========================================
     PAGE 6: CHAPTER 2 (PART 1)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 02 &bull; Part 1</span><span class="accent">Research Questions</span></div>

  <span class="ch-num">Chapter 02</span>
  <h1 class="ch-title d">Turn your topic into clear questions</h1>

  <div class="problem-card">
    <strong>The Real-World Problem:</strong> Students often write poetic or philosophical questions ("How can hospital culture be improved?") that cannot be answered with statistical tests or qualitative coding frames.
  </div>

  <h2 class="subh d">The Three Standard Question Frames</h2>
  <p>A rigorous empirical question explicitly identifies the independent variable, dependent variable, and target population. Fill in these proven frames:</p>

  <div style="background:#0a0f1c;color:#fff;border-radius:10px;padding:12px 16px;margin:8px 0">
    <div style="color:#fdba74;font-weight:700;font-size:11.5px;text-transform:uppercase">Frame 1: Comparison (Between 2 or more groups)</div>
    <div style="font-size:13px;margin:3px 0 8px">
      "Does <span style="color:#ff6b2c">[Dependent Variable]</span> differ significantly between <span style="color:#ff6b2c">[Group A]</span> and <span style="color:#ff6b2c">[Group B]</span> among <span style="color:#ff6b2c">[Population]</span>?"
    </div>
    <div style="color:#fdba74;font-weight:700;font-size:11.5px;text-transform:uppercase">Frame 2: Relationship / Association (Continuous or Categorical)</div>
    <div style="font-size:13px;margin:3px 0 8px">
      "Is there a significant relationship between <span style="color:#ff6b2c">[Variable 1]</span> and <span style="color:#ff6b2c">[Variable 2]</span> among <span style="color:#ff6b2c">[Population]</span>?"
    </div>
    <div style="color:#fdba74;font-weight:700;font-size:11.5px;text-transform:uppercase">Frame 3: Prevalence / Description</div>
    <div style="font-size:13px;margin:3px 0 0">
      "What is the prevalence / distribution of <span style="color:#ff6b2c">[Phenomenon/Condition]</span> among <span style="color:#ff6b2c">[Population]</span> across <span style="color:#ff6b2c">[Setting]</span>?"
    </div>
  </div>

  <h2 class="subh d">Writing Cohesive SMART Objectives</h2>
  <p>Every research question must map directly to one operational objective starting with an active, measurable research verb:</p>
  <ul>
    <li>&check; <strong>Measure:</strong> "To measure the mean burnout score using the Maslach Burnout Inventory..."</li>
    <li>&check; <strong>Compare:</strong> "To compare infection rates between pre-operative protocol A and B..."</li>
    <li>&check; <strong>Determine:</strong> "To determine whether baseline serum ferritin predicts 30-day outcomes..."</li>
    <li>&times; <strong>Avoid:</strong> "To explore", "to understand", "to learn" (too vague for empirical validation).</li>
  </ul>

  <div class="tip-box">
    <strong>Rule of Thumb:</strong> If an objective does not generate its own dedicated table or chart in your Results chapter, it should not exist in Chapter 1.
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 6</span></div>
</div>

<!-- ==========================================
     PAGE 7: CHAPTER 2 (PART 2)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 02 &bull; Part 2</span><span class="accent">The Alignment Matrix</span></div>

  <span class="ch-num">Chapter 02 &bull; Tools</span>
  <h1 class="ch-title d">The Research Alignment Matrix</h1>

  <p>The single most common reason examiners fail proposals is <strong>methodological drift</strong> — when Chapter 3 uses tests that do not answer the questions in Chapter 1. Fill one row per objective:</p>

  <table class="clean-tbl">
    <thead>
      <tr>
        <th style="width:24%">Objective</th>
        <th style="width:20%">Hypothesis</th>
        <th style="width:20%">Variable &amp; Scale</th>
        <th style="width:20%">Statistical Test</th>
        <th style="width:16%">Target Table</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1. Compare test scores between groups</td>
        <td>H1: Group A will score higher than B</td>
        <td>Score (Continuous ratio scale)</td>
        <td>Independent samples t-test</td>
        <td>Table 4.1</td>
      </tr>
      <tr>
        <td>2. Determine link between stress &amp; sleep</td>
        <td>H2: Significant negative correlation</td>
        <td>Stress (Scale), Sleep (Hours)</td>
        <td>Pearson r correlation</td>
        <td>Table 4.2</td>
      </tr>
      <tr>
        <td>3. Assess compliance association by shift</td>
        <td>H3: Association between shift &amp; compliance</td>
        <td>Shift (Nominal), Compliance (Binary)</td>
        <td>Chi-square test of independence</td>
        <td>Table 4.3</td>
      </tr>
    </tbody>
  </table>

  <h2 class="subh d">Final Validation Checklist</h2>
  <ul>
    <li>Every directional hypothesis (H1) is grounded in cited theoretical literature.</li>
    <li>Measurement scales (nominal, ordinal, interval, ratio) are established before tool deployment.</li>
    <li>Statistical tests are chosen based on data distribution assumptions, not personal convenience.</li>
  </ul>

  <div class="mistake-box">
    <strong>Common Mistake:</strong> Stating five objectives in Chapter 1, but only presenting three tables in Chapter 4. Examiners cross-reference these page numbers immediately.
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Where M. Yousaf Helps &bull; Question &amp; Matrix Audit</strong>
      <span>Review your objectives, hypotheses, and alignment matrix before proposal submission.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20help%20with%20my%20research%20questions%20and%20alignment%20matrix." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 7</span></div>
</div>

<!-- ==========================================
     PAGE 8: CHAPTER 3 (PART 1)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 03 &bull; Part 1</span><span class="accent">Literature Search</span></div>

  <span class="ch-num">Chapter 03</span>
  <h1 class="ch-title d">Search the literature properly</h1>

  <div class="problem-card">
    <strong>The Real-World Problem:</strong> Relying solely on Google Scholar page one, citing predatory journals, or copying citations from third-party bibliographies without reading the primary source.
  </div>

  <h2 class="subh d">Where to Search: The Core Scientific Databases</h2>
  <table class="clean-tbl">
    <thead>
      <tr><th>Repository</th><th>Discipline Focus</th><th>Best For</th></tr>
    </thead>
    <tbody>
      <tr><td><strong>Crossref</strong></td><td>All disciplines (140M+ DOI records)</td><td>Verifying exact digital object identifiers &amp; metadata.</td></tr>
      <tr><td><strong>OpenAlex</strong></td><td>Multidisciplinary global database</td><td>Citation networks, institutional tracing, modern open science.</td></tr>
      <tr><td><strong>PubMed</strong></td><td>Medicine, nursing, health sciences</td><td>Peer-reviewed clinical trials, MeSH terminology indexing.</td></tr>
      <tr><td><strong>arXiv</strong></td><td>Physics, mathematics, computer science</td><td>Cutting-edge preprints, computational algorithms.</td></tr>
    </tbody>
  </table>

  <h2 class="subh d">Constructing Professional Boolean Search Strings</h2>
  <p>Never type conversational questions into academic databases. Combine concepts using Boolean logic:</p>
  <ul>
    <li><code>AND</code>: Narrows the search (both concepts must appear in the record).</li>
    <li><code>OR</code>: Broadens the search by including known synonyms and spelling variations.</li>
    <li><code>" "</code> (Quotes): Forces exact phrase matching (e.g., <code>"operating theatre"</code>).</li>
    <li><code>*</code> (Wildcard): Captures suffixes (e.g., <code>complian*</code> finds compliance, compliant).</li>
  </ul>

  <div class="tip-box">
    <strong>Search String Example:</strong><br>
    <code>("clinical waste" OR "biomedical waste" OR "hospital waste") AND (segregat* OR handl* OR management) AND ("operating room" OR "operating theatre" OR "surgical suite")</code>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 8</span></div>
</div>

<!-- ==========================================
     PAGE 9: CHAPTER 3 (PART 2)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 03 &bull; Part 2</span><span class="accent">Log &amp; Reference Setup</span></div>

  <span class="ch-num">Chapter 03 &bull; Tools</span>
  <h1 class="ch-title d">Search log &amp; reference management</h1>

  <p>To defend your literature review as rigorous and reproducible, keep a systematic search log:</p>

  <table class="clean-tbl">
    <thead>
      <tr><th>Date</th><th>Database</th><th>Exact Query String</th><th>Filters (Years/Types)</th><th>Hits</th><th>Kept</th></tr>
    </thead>
    <tbody>
      <tr><td>12/10/26</td><td>PubMed</td><td>("clinical waste") AND (segregat*)</td><td>2020-2026, English, Free Full Text</td><td>142</td><td>18</td></tr>
      <tr><td>14/10/26</td><td>OpenAlex</td><td>("hospital waste") AND ("operating theatre")</td><td>2021-2026, Peer-reviewed articles</td><td>89</td><td>12</td></tr>
      <tr><td>16/10/26</td><td>Crossref</td><td>"surgical waste management"</td><td>2019-2026</td><td>45</td><td>7</td></tr>
    </tbody>
  </table>

  <h2 class="subh d">Configuring Your Reference Manager (Zotero / Mendeley / EndNote)</h2>
  <ol>
    <li><strong>Commit to One Tool:</strong> Do not switch managers midway through thesis writing.</li>
    <li><strong>Import via DOI / PMID:</strong> Avoid manual citation entry; direct metadata imports prevent typographical errors.</li>
    <li><strong>Organize by Chapter Collections:</strong> Tag references by chapter (e.g., <code>Ch2_Prevalence</code>, <code>Ch2_MethodReview</code>).</li>
    <li><strong>Verify Real PDFs:</strong> Attach the full PDF to every record. Never cite an abstract alone.</li>
    <li><strong>Audit Authors in Manager:</strong> Correct accented names or corporate authors inside the manager, not by editing Word text.</li>
  </ol>

  <div class="mistake-box">
    <strong>Common Mistake:</strong> Copy-pasting citations generated by AI chatbots. These frequently invent fictitious authors and non-existent DOIs. Always verify the DOI on Crossref.
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Where M. Yousaf Helps &bull; Literature Search Training</strong>
      <span>Master database search strings, Zotero reference library setup, and citation audit.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20literature%20search%20training%20for%20my%20review." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 9</span></div>
</div>

<!-- ==========================================
     PAGE 10: CHAPTER 4 (PART 1)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 04 &bull; Part 1</span><span class="accent">Methodology Design</span></div>

  <span class="ch-num">Chapter 04</span>
  <h1 class="ch-title d">Pick a design and sample size</h1>

  <div class="problem-card">
    <strong>The Real-World Problem:</strong> Students pulling random numbers like "100 participants" out of nowhere without mathematical justification or statistical power analysis.
  </div>

  <h2 class="subh d">Selecting the Methodological Design</h2>
  <table class="clean-tbl">
    <thead>
      <tr><th>Design Type</th><th>When to Use</th><th>Data Collected</th><th>Typical Tools</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Quantitative Descriptive</strong></td>
        <td>Measuring prevalence, baseline characteristics, attitudes.</td>
        <td>Numerical survey scores, demographic data.</td>
        <td>Validated Likert scales, questionnaires.</td>
      </tr>
      <tr>
        <td><strong>Quantitative Quasi-Experimental</strong></td>
        <td>Testing pre-post interventions without random allocation.</td>
        <td>Pre-test and post-test scores across cohorts.</td>
        <td>Paired measurements, standardized tests.</td>
      </tr>
      <tr>
        <td><strong>Qualitative Phenomenological</strong></td>
        <td>Understanding lived experiences and perspectives.</td>
        <td>Audio transcripts, reflective field notes.</td>
        <td>Semi-structured interview guides.</td>
      </tr>
      <tr>
        <td><strong>Mixed Methods Explanatory</strong></td>
        <td>Using qualitative interviews to explain surprising statistical results.</td>
        <td>Initial quantitative survey followed by focused interviews.</td>
        <td>Questionnaire + purposive sub-sample interviews.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="subh d">Sampling Strategies: Probability vs. Non-Probability</h2>
  <ul>
    <li><strong>Simple Random / Stratified Sampling:</strong> Gold standard for generalizability; requires complete sampling frame.</li>
    <li><strong>Purposive Sampling:</strong> Essential for qualitative research where specific expertise or clinical diagnosis is mandatory.</li>
    <li><strong>Convenience Sampling:</strong> Acceptable for student pilot studies, provided limitations are honestly declared in Chapter 3.</li>
  </ul>

  <div class="tip-box">
    <strong>Rule:</strong> Your research question mandates the design. Never pick "quantitative" just because you want to avoid transcription, or "qualitative" because you fear SPSS.
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 10</span></div>
</div>

<!-- ==========================================
     PAGE 11: CHAPTER 4 (PART 2)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 04 &bull; Part 2</span><span class="accent">Sample Size &amp; Ethics</span></div>

  <span class="ch-num">Chapter 04 &bull; Formulas</span>
  <h1 class="ch-title d">Sample size formulas &amp; ethics approval</h1>

  <h2 class="subh d">1. Survey Proportion Sample Size (Cochran's Formula)</h2>
  <p>For estimating prevalence or proportions in large or unknown populations:</p>
  <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:8px 12px;font-family:monospace;margin:6px 0">
    n = (Z^2 * p * (1 - p)) / d^2
  </div>
  <ul>
    <li><code>Z</code> = 1.96 (for a standard 95% Confidence Interval)</li>
    <li><code>p</code> = 0.50 (assumed proportion for maximum variability)</li>
    <li><code>d</code> = 0.05 (margin of error at 5%)</li>
    <li><strong>Calculation:</strong> (1.96^2 * 0.5 * 0.5) / 0.05^2 = <strong>384.16 &rarr; Minimum 385 participants.</strong></li>
  </ul>

  <h2 class="subh d">2. Statistical Power Analysis via G*Power</h2>
  <p>For hypothesis testing (e.g. comparing two independent means with a t-test):</p>
  <ul>
    <li><strong>Test family:</strong> t tests &rarr; Means: Difference between two independent means</li>
    <li><strong>Type of power analysis:</strong> A priori: Compute required sample size</li>
    <li><strong>Input Parameters:</strong> Effect size d = 0.50 (medium effect), &alpha; err prob = 0.05, Power (1-&beta;) = 0.80, Allocation ratio N2/N1 = 1</li>
    <li><strong>Output Result:</strong> Sample size group 1 = 64, Sample size group 2 = 64 &rarr; <strong>Total sample size = 128.</strong></li>
  </ul>

  <h2 class="subh d">Institutional Ethics Clearance Checklist</h2>
  <ul>
    <li>Participant Information Sheet (PIS) written in plain, accessible language.</li>
    <li>Written Informed Consent Form with voluntary withdrawal clause.</li>
    <li>Data de-identification plan (storing survey keys separately from responses).</li>
    <li>Secure encrypted storage declaration and institutional approval letter.</li>
  </ul>

  <div class="help-card">
    <div class="htxt">
      <strong>Where M. Yousaf Helps &bull; Methodology Coaching</strong>
      <span>Calculate exact G*Power inputs and structure your research ethics application.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20methodology%20and%20sample%20size%20coaching." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 11</span></div>
</div>

<!-- ==========================================
     PAGE 12: CHAPTER 5 (PART 1)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 05 &bull; Part 1</span><span class="accent">SPSS Data Cleaning</span></div>

  <span class="ch-num">Chapter 05</span>
  <h1 class="ch-title d">Analyse your data without panic</h1>

  <div class="problem-card">
    <strong>The Real-World Problem:</strong> Jumping directly to running t-tests and regressions in SPSS on raw survey imports without checking missing values, reverse coding, or normality assumptions.
  </div>

  <h2 class="subh d">The 4-Step Pre-Analysis Cleaning Protocol</h2>
  <ol>
    <li>
      <strong>Variable View Definition:</strong> Open <code>Variable View</code> in SPSS. Verify every item has explicit <em>Values</em> defined (e.g. 1 = Strongly Disagree to 5 = Strongly Agree), appropriate <em>Measure</em> setting (Nominal, Ordinal, Scale), and clean Variable Names without illegal spaces.
    </li>
    <li>
      <strong>Missing Value Audit:</strong> Run <code>Analyze > Descriptive Statistics > Frequencies</code>. Screen for missing entries. Decide transparently: exclude pairwise or impute mean only if missing rate is below 5%. Never hide missing data.
    </li>
    <li>
      <strong>Outlier Detection:</strong> Generate boxplots: <code>Analyze > Descriptive Statistics > Explore</code>. Inspect extreme values (marked with asterisks). Check for data-entry typos (e.g. typing "55" instead of "5" on a 5-point scale).
    </li>
    <li>
      <strong>Assumption Checking:</strong>
      <ul>
        <li><strong>Normality:</strong> Inspect Shapiro-Wilk (p &gt; .05) and Skewness/Kurtosis between -1.5 and +1.5.</li>
        <li><strong>Homogeneity of Variance:</strong> Verify Levene's Test (p &gt; .05) before interpreting standard ANOVA.</li>
      </ul>
    </li>
  </ol>

  <h2 class="subh d">Parametric vs. Non-Parametric Match Guide</h2>
  <table class="clean-tbl">
    <thead>
      <tr><th>Research Objective</th><th>Normal / Scale (Parametric)</th><th>Skewed / Ordinal (Non-Parametric)</th></tr>
    </thead>
    <tbody>
      <tr><td>Compare 2 independent groups</td><td><strong>Independent samples t-test</strong></td><td><strong>Mann-Whitney U test</strong></td></tr>
      <tr><td>Compare same group twice (pre/post)</td><td><strong>Paired samples t-test</strong></td><td><strong>Wilcoxon signed-rank test</strong></td></tr>
      <tr><td>Compare 3 or more groups</td><td><strong>One-way ANOVA</strong></td><td><strong>Kruskal-Wallis H test</strong></td></tr>
      <tr><td>Relationship between 2 continuous items</td><td><strong>Pearson correlation (r)</strong></td><td><strong>Spearman rank correlation (rho)</strong></td></tr>
      <tr><td>Association between 2 categorical items</td><td><strong>Chi-square test of independence</strong></td><td><strong>Fisher's exact test (if cell &lt; 5)</strong></td></tr>
    </tbody>
  </table>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 12</span></div>
</div>

<!-- ==========================================
     PAGE 13: CHAPTER 5 (PART 2)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 05 &bull; Part 2</span><span class="accent">SPSS Paths &amp; Reporting</span></div>

  <span class="ch-num">Chapter 05 &bull; Execution</span>
  <h1 class="ch-title d">SPSS navigation paths &amp; reporting templates</h1>

  <h2 class="subh d">Menu-by-Menu SPSS Execution Paths</h2>
  <ul>
    <li><strong>Independent t-test:</strong> <code>Analyze > Compare Means > Independent-Samples T Test</code>. Move outcome to <em>Test Variable(s)</em>, grouping factor to <em>Grouping Variable</em> &rarr; <em>Define Groups</em> (1, 2).</li>
    <li><strong>One-Way ANOVA:</strong> <code>Analyze > Compare Means > One-Way ANOVA</code>. Select <em>Post Hoc > Tukey</em>, and <em>Options > Homogeneity of variance test</em>.</li>
    <li><strong>Pearson Correlation:</strong> <code>Analyze > Correlate > Bivariate</code>. Select Pearson, Two-tailed, Flag significant correlations.</li>
    <li><strong>Chi-Square:</strong> <code>Analyze > Descriptive Statistics > Crosstabs</code>. Under <em>Statistics</em> check <em>Chi-square</em> and <em>Phi and Cramer's V</em>; under <em>Cells</em> check <em>Observed</em> and <em>Expected</em>.</li>
  </ul>

  <h2 class="subh d">Ready-to-Adapt APA Result Reporting Templates</h2>
  
  <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:8px 12px;margin:6px 0;font-size:12px;line-height:1.45">
    <strong>Independent t-test:</strong><br>
    "An independent-samples t-test was conducted to compare scores between Group A (M = [M1], SD = [SD1]) and Group B (M = [M2], SD = [SD2]). There was a significant difference in scores; t([df]) = [t-val], p = .024, d = 0.52."
  </div>

  <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:8px 12px;margin:6px 0;font-size:12px;line-height:1.45">
    <strong>One-Way ANOVA:</strong><br>
    "A one-way between-subjects ANOVA was conducted to compare the effect of [Factor] on [Outcome] across conditions [A, B, C]. There was a significant effect; F([df1], [df2]) = [F-val], p = .008, &eta;&sup2; = .14. Post-hoc comparisons using the Tukey HSD test indicated that the mean score for Condition A was significantly different from Condition B."
  </div>

  <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:8px 12px;margin:6px 0;font-size:12px;line-height:1.45">
    <strong>Chi-Square Test:</strong><br>
    "A chi-square test of independence was performed to examine the relation between shift timing and protocol compliance. The relation between these variables was significant, &chi;&sup2;([df], N = [N]) = [val], p = .031, Cramer's V = .22."
  </div>

  <div class="tip-box">
    <strong>Reporting Rule:</strong> Report exact p-values (e.g., <code>p = .032</code>), unless SPSS shows <code>.000</code>, which you must write as <code>p &lt; .001</code>. Always report the effect size alongside significance.
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Where M. Yousaf Helps &bull; SPSS &amp; SmartPLS Support</strong>
      <span>Complete data screening, test execution, APA tables, and interpretation coaching (from PKR 8,000).</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20help%20with%20SPSS%20or%20SmartPLS%20analysis." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 13</span></div>
</div>

<!-- ==========================================
     PAGE 14: CHAPTER 6 (PART 1)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 06 &bull; Part 1</span><span class="accent">Academic Writing</span></div>

  <span class="ch-num">Chapter 06</span>
  <h1 class="ch-title d">Write, cite and format cleanly</h1>

  <div class="problem-card">
    <strong>The Real-World Problem:</strong> Treating the literature review like an annotated shopping list ("Author A said X. Author B said Y."), or mixing personal interpretations into the Results chapter before reaching the Discussion.
  </div>

  <h2 class="subh d">The IMRaD Dissertation Blueprint</h2>
  <table class="clean-tbl">
    <thead>
      <tr><th style="width:20%">Section</th><th style="width:40%">What You Must Deliver</th><th style="width:40%">Common Student Mistake</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Introduction</strong></td>
        <td>Problem statement, identified research gap, objectives, significance.</td>
        <td>Starting with overly broad generalities; failing to clearly articulate the specific gap.</td>
      </tr>
      <tr>
        <td><strong>Literature Review</strong></td>
        <td>Thematic synthesis across themes; conceptual framework.</td>
        <td>Summarizing one isolated study per paragraph with no synthesis between authors.</td>
      </tr>
      <tr>
        <td><strong>Methodology</strong></td>
        <td>Design, sample justification, instruments, validity/reliability, analysis plan.</td>
        <td>Too brief to allow another researcher to replicate the study.</td>
      </tr>
      <tr>
        <td><strong>Results</strong></td>
        <td>Objective-by-objective presentation of statistical tables &amp; findings.</td>
        <td>Introducing opinions or discussing broader literature findings here.</td>
      </tr>
      <tr>
        <td><strong>Discussion</strong></td>
        <td>Comparing findings with prior studies; theoretical/practical implications; limits.</td>
        <td>Merely re-listing percentages from the results chapter without explaining why.</td>
      </tr>
      <tr>
        <td><strong>Conclusion</strong></td>
        <td>Direct answers to research questions; concrete recommendations for practice.</td>
        <td>Introducing brand-new data or references not presented in earlier chapters.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="subh d">Write the Abstract Last</h2>
  <p>Your abstract is a micro-summary of what you <em>actually discovered</em>, not what you <em>hoped to do</em>. Structure it with 4 strict blocks: Background &amp; Aim (2 sentences), Methods &amp; Sample (2 sentences), Core Findings with numbers (3 sentences), and Primary Conclusion (1 sentence). Word limit: typically 200–250 words.</p>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 14</span></div>
</div>

<!-- ==========================================
     PAGE 15: CHAPTER 6 (PART 2)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 06 &bull; Part 2</span><span class="accent">Citations &amp; Paraphrasing</span></div>

  <span class="ch-num">Chapter 06 &bull; Precision</span>
  <h1 class="ch-title d">Citation styles &amp; the paraphrasing test</h1>

  <h2 class="subh d">Core Citation Style Patterns (Journal Article Example)</h2>
  <table class="clean-tbl">
    <thead>
      <tr><th style="width:18%">Style</th><th>Reference List Pattern</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>APA 7th</strong></td>
        <td>Author, A. A., &amp; Author, B. B. (2024). Title of journal article. <em>Journal of Healthcare Management</em>, 18(2), 112&ndash;124. https://doi.org/10.1016/j.jhm.2024.01.005</td>
      </tr>
      <tr>
        <td><strong>Vancouver</strong></td>
        <td>Author AA, Author BB. Title of journal article. J Healthc Manag. 2024;18(2):112-24.</td>
      </tr>
      <tr>
        <td><strong>IEEE</strong></td>
        <td>[1] A. A. Author and B. B. Author, "Title of journal article," <em>J. Healthc. Manag.</em>, vol. 18, no. 2, pp. 112&ndash;124, 2024.</td>
      </tr>
      <tr>
        <td><strong>Harvard</strong></td>
        <td>Author, A.A. and Author, B.B. (2024) 'Title of journal article', <em>Journal of Healthcare Management</em>, 18(2), pp. 112&ndash;124.</td>
      </tr>
    </tbody>
  </table>

  <h2 class="subh d">The Honest Paraphrasing Test</h2>
  <div class="tip-box">
    <strong>How to Paraphrase Legally &amp; Honestly:</strong><br>
    1. Read the source paragraph twice until you understand its underlying argument.<br>
    2. Close the browser tab or paper completely.<br>
    3. Explain the finding in your own words onto a blank screen as if teaching a classmate.<br>
    4. Open the source and compare sentence structures. If your draft mimics the original word order, discard it and start over.<br>
    5. Add the parenthetical in-text citation immediately. <em>Paraphrased ideas still belong to the original author.</em>
  </div>

  <h2 class="subh d">Pre-Submission Formatting Checklist</h2>
  <ul>
    <li>Consistent heading hierarchy (H1, H2, H3) throughout using Word Styles.</li>
    <li>Every table and figure is numbered, captioned, and explicitly referenced in paragraph text ("As shown in Table 4.2...").</li>
    <li>100% two-way match: every citation in text appears in the reference list; every list item is cited.</li>
  </ul>

  <div class="help-card">
    <div class="htxt">
      <strong>Where M. Yousaf Helps &bull; Proofreading &amp; Formatting</strong>
      <span>Thorough line edits, citation audits, and university template compliance on your own draft.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20editing%20and%20formatting%20support%20on%20my%20draft." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 15</span></div>
</div>

<!-- ==========================================
     PAGE 16: CHAPTER 7 (PART 1)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 07 &bull; Part 1</span><span class="accent">Viva Defense</span></div>

  <span class="ch-num">Chapter 07</span>
  <h1 class="ch-title d">Prepare for your viva defense</h1>

  <div class="problem-card">
    <strong>The Real-World Problem:</strong> Students viewing examiners as hostile adversaries trying to "catch them out", leading to defensive arguments, ungrounded justifications, and verbal rambling.
  </div>

  <h2 class="subh d">Understanding Examiner Psychology</h2>
  <p>Examiners rarely expect a flawless study. They evaluate whether you comprehend the boundaries of what you did. They test three core fundamentals:</p>
  <ul>
    <li><strong>Methodological Justification:</strong> Why did you select this specific approach over available alternatives?</li>
    <li><strong>Intellectual Honesty:</strong> Can you candidly identify your study's limitations before the committee points them out?</li>
    <li><strong>Core Contribution:</strong> Can you summarize what your data adds to the literature in two precise sentences?</li>
  </ul>

  <h2 class="subh d">The A-R-E Answering Framework</h2>
  <p>When an examiner asks a probing question, structure your oral response in three disciplined stages:</p>
  
  <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:10px 14px;margin:8px 0">
    <div style="font-weight:700;color:#ff6b2c">STAGE 1: ANSWER (A) &bull; One Direct Sentence</div>
    <div style="color:#0a0f1c;margin:2px 0 6px">Directly answer the question without hedging or apologizing. ("I chose an independent samples t-test because the dependent variable was measured on a continuous scale and satisfied normality assumptions.")</div>
    <div style="font-weight:700;color:#ff6b2c">STAGE 2: REASON (R) &bull; The Academic / Methodological Logic</div>
    <div style="color:#0a0f1c;margin:2px 0 6px">Provide the cited rationale. ("According to Field (2018), when skewness and kurtosis fall between &plusmn;1.0, parametric tests provide superior statistical power.")</div>
    <div style="font-weight:700;color:#ff6b2c">STAGE 3: EXAMPLE (E) &bull; Concrete Evidence From Your Dataset</div>
    <div style="color:#0a0f1c;margin:2px 0 6px">Anchor the answer in your actual thesis findings. ("In my dataset, the Shapiro-Wilk test yielded p = .18 for Group A and p = .24 for Group B, confirming acceptable normality.")</div>
    <div style="font-weight:800;color:#15803d;margin-top:6px">&rarr; STOP TALKING: Close your mouth and allow the committee to ask their next question.</div>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 16</span></div>
</div>

<!-- ==========================================
     PAGE 17: CHAPTER 7 (PART 2)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Chapter 07 &bull; Part 2</span><span class="accent">Viva Question Bank</span></div>

  <span class="ch-num">Chapter 07 &bull; Rehearsal</span>
  <h1 class="ch-title d">Committee question bank &amp; 7-day countdown</h1>

  <table class="clean-tbl">
    <thead>
      <tr><th style="width:22%">Domain</th><th>Questions You Must Prepare and Rehearse Out Loud</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Purpose &amp; Gap</strong></td>
        <td>Why did you choose this topic? What exact gap does it fill? What is your primary contribution?</td>
      </tr>
      <tr>
        <td><strong>Methodology</strong></td>
        <td>Why this design? Why this specific sampling frame? How did you control for confounding variables?</td>
      </tr>
      <tr>
        <td><strong>Instruments</strong></td>
        <td>How was validity and reliability established? Did you pilot test the tool? How was consent recorded?</td>
      </tr>
      <tr>
        <td><strong>Analysis</strong></td>
        <td>Why did you choose this test over non-parametric alternatives? How did you treat missing data?</td>
      </tr>
      <tr>
        <td><strong>Results &amp; Limits</strong></td>
        <td>Which finding surprised you? Which result do you trust least, and why? What are your limitations?</td>
      </tr>
      <tr>
        <td><strong>Future Impact</strong></td>
        <td>If you had six more months, what would you do differently? Who should act on these findings?</td>
      </tr>
    </tbody>
  </table>

  <h2 class="subh d">The 7-Day Pre-Viva Countdown</h2>
  <ul>
    <li><strong>Day 7 to 5:</strong> Re-read your Abstract, Objectives, and Conclusions until you can recite them without slides.</li>
    <li><strong>Day 4 to 3:</strong> Review every single table: know the sample size, test statistic, p-value, and effect size by heart.</li>
    <li><strong>Day 2:</strong> Conduct a full timed slide rehearsal with an academic friend or coach who interrupts with questions.</li>
    <li><strong>Day 1:</strong> Prepare your bound copy with colored adhesive tabs for instant chapter and table navigation. Rest.</li>
  </ul>

  <div class="help-card">
    <div class="htxt">
      <strong>Where M. Yousaf Helps &bull; Mock Viva Defense Session</strong>
      <span>Experience an intensive 1-on-1 mock defense with direct feedback on your slides, delivery, and answers.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20viva%20coaching%20and%20a%20mock%20defense." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 17</span></div>
</div>

<!-- ==========================================
     PAGE 18: SPECIALITY 1 - EDITING
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services Speciality 01</span><span class="accent">Academic Editing</span></div>

  <span class="ch-num">Speciality Profile 01</span>
  <h1 class="ch-title d">Proofreading &amp; Academic Editing</h1>

  <div class="problem-card">
    <strong>Who It Is For:</strong> Postgraduate candidates (BS, Master's, MPhil, PhD) and early-career faculty who have written their own draft but struggle with academic tone, paragraph transitions, grammar, or supervisory feedback regarding clarity.
  </div>

  <h2 class="subh d">Specific Concrete Problems Fixed</h2>
  <ul>
    <li>Inconsistent terminology across chapters (e.g. switching between "respondents", "subjects", and "participants").</li>
    <li>Overly colloquial expressions replaced with formal academic phrasing.</li>
    <li>Run-on sentences, awkward syntax, passive-voice ambiguities, and punctuation errors.</li>
    <li>Restructuring disjointed paragraphs so each carries one clear claim, evidence, and transition.</li>
  </ul>

  <h2 class="subh d">What the Student Receives &amp; How It Works</h2>
  <ul>
    <li><strong>Two Word Documents:</strong> One with tracked changes and marginal explanatory notes; one clean finalized copy.</li>
    <li><strong>Line-by-Line Annotations:</strong> Every major edit includes an explanatory comment teaching you <em>why</em> it was altered.</li>
    <li><strong>Turnaround:</strong> Agreed before commencement based on your exact deadline.</li>
  </ul>

  <div class="mistake-box">
    <strong>What M. Yousaf Will Never Do:</strong> I will never write chapters from scratch, fabricate arguments, or alter your raw data findings. The intellectual arguments remain 100% yours.
  </div>

  <div class="tip-box">
    <strong>Illustrative Scenario:</strong><br>
    <em>A Master's student in Public Health had her Results chapter returned twice because of informal phrasing ("A lot of nurses didn't bother following protocols"). Through line editing, this was refined to: "A notable proportion of nursing personnel exhibited non-compliance with institutional segregation guidelines (34.2%, n = 48)." The draft passed review on the subsequent submission.</em>
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Get a Quote for Editing Your Draft</strong>
      <span>Send your draft, word count, and university guidelines on WhatsApp for an immediate quote.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20a%20quote%20for%20proofreading%20and%20editing%20my%20draft." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 18</span></div>
</div>

<!-- ==========================================
     PAGE 19: SPECIALITY 2 - SPSS / SMARTPLS
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services Speciality 02</span><span class="accent">Statistical Analysis</span></div>

  <span class="ch-num">Speciality Profile 02</span>
  <h1 class="ch-title d">SPSS &amp; SmartPLS Analysis Support</h1>

  <div class="problem-card">
    <strong>Who It Is For:</strong> Researchers who have gathered survey, experimental, or clinical data but need guidance cleaning datasets, selecting correct statistical tests, interpreting outputs, and drafting APA tables.
  </div>

  <h2 class="subh d">Pricing &amp; Scope</h2>
  <div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:8px 12px;margin:6px 0">
    <span class="d" style="font-size:18px;color:#ff6b2c">From PKR 8,000+</span>
    <span style="color:#64748b;font-size:12px;margin-left:8px">(Approximately $45 USD, based on dataset dimensions, sample size, and model complexity)</span>
  </div>

  <h2 class="subh d">Specific Concrete Problems Fixed</h2>
  <ul>
    <li>Correcting statistical mismatch (e.g. reporting independent t-tests on severely skewed non-normal data).</li>
    <li>Constructing structural equation models in SmartPLS (measurement model, convergent validity, AVE, CR, HTMT).</li>
    <li>Handling missing values, outlier screening, recoding reverse-scored items, and computing composite indices.</li>
    <li>Generating camera-ready APA 7th style summary tables with exact p-values and effect sizes.</li>
  </ul>

  <h2 class="subh d">What the Student Receives</h2>
  <ul>
    <li>Cleaned SPSS (.sav) or SmartPLS (.splsm) file with fully configured labels and measurement levels.</li>
    <li>Formatted Word document with APA results tables and paragraph-by-paragraph interpretation.</li>
    <li><strong>1-on-1 Voice/Screen Coaching:</strong> A walkthrough session ensuring you understand every number for your defense.</li>
  </ul>

  <div class="mistake-box">
    <strong>What M. Yousaf Will Never Do:</strong> I will never invent survey responses, manipulate significance levels, or fabricate data to force hypotheses to be supported. Real data honestly reported is mandatory.
  </div>

  <div class="tip-box">
    <strong>Illustrative Scenario:</strong><br>
    <em>An MPhil Business candidate had 280 survey responses but could not establish discriminant validity in SmartPLS due to cross-loading items. M. Yousaf guided the candidate through HTMT matrix screening, identifying two redundant items, re-calculating the model, and coaching the student to defend the final outer loadings during the defense.</em>
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Book Statistical Analysis Support</strong>
      <span>Send your dataset and objectives for an immediate scope evaluation and quotation.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20help%20with%20SPSS%20or%20SmartPLS%20analysis." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 19</span></div>
</div>

<!-- ==========================================
     PAGE 20: SPECIALITY 3 - METHODOLOGY
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services Speciality 03</span><span class="accent">Methodology Coaching</span></div>

  <span class="ch-num">Speciality Profile 03</span>
  <h1 class="ch-title d">Research Methodology Coaching</h1>

  <div class="problem-card">
    <strong>Who It Is For:</strong> Candidates drafting their thesis proposals (Chapter 3), developing data collection questionnaires, applying for institutional ethics approval, or facing supervisor objections regarding study design.
  </div>

  <h2 class="subh d">Specific Concrete Problems Fixed</h2>
  <ul>
    <li>Resolving methodological mismatch between the conceptual framework and operational research design.</li>
    <li>Calculating mathematical sample size justifications using G*Power or Cochran formulas.</li>
    <li>Structuring questionnaire tools with validated Likert scales, content validity checks, and reliability protocols.</li>
    <li>Writing institutional review board (IRB) ethics protocols, participant consent forms, and risk mitigations.</li>
  </ul>

  <h2 class="subh d">What the Student Receives</h2>
  <ul>
    <li>Complete, defensible Chapter 3 methodology framework tailored to your departmental guidelines.</li>
    <li>A validated Research Alignment Matrix mapping every research question to its specific tool and test.</li>
    <li>Step-by-step coaching on how to explain sampling bias and study limitations calmly in front of committee members.</li>
  </ul>

  <div class="mistake-box">
    <strong>What M. Yousaf Will Never Do:</strong> I will never recommend a complex, flashy design when a simple, clean design answers the question with greater rigor and lower risk of student failure.
  </div>

  <div class="tip-box">
    <strong>Illustrative Scenario:</strong><br>
    <em>A Nursing scholar proposed a clinical quasi-experimental trial across 6 hospitals without calculating power or securing multi-center access. Through two coaching sessions, M. Yousaf helped refine the study into a single-center prospective cohort design with an achievable sample of 120 patients, enabling the student to secure ethics committee approval on first review.</em>
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Get Methodology &amp; Design Coaching</strong>
      <span>Message M. Yousaf to review your proposal design, sampling plan, or questionnaire.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20methodology%20and%20sample%20size%20coaching." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 20</span></div>
</div>

<!-- ==========================================
     PAGE 21: SPECIALITY 4 - LITERATURE
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services Speciality 04</span><span class="accent">Literature Training</span></div>

  <span class="ch-num">Speciality Profile 04</span>
  <h1 class="ch-title d">Literature Search Training</h1>

  <div class="problem-card">
    <strong>Who It Is For:</strong> Researchers preparing Chapter 2 (Literature Review) or systematic reviews who struggle to locate high-impact peer-reviewed studies, build Boolean search strings, or organize reference libraries.
  </div>

  <h2 class="subh d">Specific Concrete Problems Fixed</h2>
  <ul>
    <li>Moving beyond generic search engine results to query Crossref, OpenAlex, PubMed, and arXiv effectively.</li>
    <li>Designing structured Boolean strings combining Medical Subject Headings (MeSH), synonyms, and wildcards.</li>
    <li>Eliminating predatory journal citations and identifying seminal foundational papers in your specific niche.</li>
    <li>Setting up Zotero, Mendeley, or EndNote with automated cloud sync, tags, and DOI deduplication.</li>
  </ul>

  <h2 class="subh d">What the Student Receives</h2>
  <ul>
    <li>Personalized search string dossier formulated specifically for your exact research topic.</li>
    <li>Structured literature synthesis matrix template organizing papers by themes, samples, and gaps.</li>
    <li>Live 1-on-1 coaching session demonstrating database querying, screening protocols, and citation exports.</li>
  </ul>

  <div class="mistake-box">
    <strong>What M. Yousaf Will Never Do:</strong> I will never deliver unverified bibliography lists generated by AI tools. Every single cited paper must be cross-checked against its legitimate Crossref DOI.
  </div>

  <div class="tip-box">
    <strong>Illustrative Scenario:</strong><br>
    <em>A PhD Education scholar spent two months finding only 14 relevant papers on blended learning assessment in secondary schools. M. Yousaf trained the candidate in Boolean synonym clustering and OpenAlex citation chaining, uncovering 84 peer-reviewed empirical studies within 3 hours and transforming the literature review chapter.</em>
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Book Literature Search Training</strong>
      <span>Learn to search databases properly and organize your reference library with M. Yousaf.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20literature%20search%20training%20for%20my%20review." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 21</span></div>
</div>

<!-- ==========================================
     PAGE 22: SPECIALITY 5 - CITATIONS
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services Speciality 05</span><span class="accent">Formatting &amp; Citations</span></div>

  <span class="ch-num">Speciality Profile 05</span>
  <h1 class="ch-title d">Formatting &amp; Citation Checks</h1>

  <div class="problem-card">
    <strong>Who It Is For:</strong> Candidates submitting finished theses or journal manuscripts that must strictly comply with university formatting manuals (margins, pagination, preliminary pages) or style guides (APA 7th, Harvard, Vancouver, IEEE).
  </div>

  <h2 class="subh d">Specific Concrete Problems Fixed</h2>
  <ul>
    <li>Resolving citation mismatches (sources cited in text missing from reference list; entries in list never cited in text).</li>
    <li>Fixing broken heading numbering, runaway page numbering, and mismatched preliminary Roman numerals.</li>
    <li>Standardizing table formatting, notes, abbreviations, and figure captions to departmental specifications.</li>
    <li>Correcting punctuation, italics, volume/issue notations, and DOI links across the entire bibliography.</li>
  </ul>

  <h2 class="subh d">What the Student Receives</h2>
  <ul>
    <li>A fully formatted master Word (.docx) file configured to your exact university template guidelines.</li>
    <li>Comprehensive discrepancy report detailing every citation that was reconciled or updated.</li>
    <li>Automated Table of Contents, List of Tables, and List of Figures configured with native Word fields.</li>
  </ul>

  <div class="mistake-box">
    <strong>What M. Yousaf Will Never Do:</strong> I will never guess citation metadata. If a paper has an ambiguous publication date or missing page range, I locate the primary publisher record to verify.
  </div>

  <div class="tip-box">
    <strong>Illustrative Scenario:</strong><br>
    <em>An Engineering researcher preparing a submission for an IEEE journal had his draft rejected at the editorial desk due to non-compliant references and non-standard figure widths. Quick Services audited all 46 citations to IEEE numeric standards and formatted layout tables, leading to immediate progression into peer review.</em>
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Book Citation &amp; Formatting Audit</strong>
      <span>Send your thesis draft and guidelines to M. Yousaf for a complete structural and citation review.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20formatting%20and%20citation%20help." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 22</span></div>
</div>

<!-- ==========================================
     PAGE 23: SPECIALITY 6 - VIVA
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services Speciality 06</span><span class="accent">Viva Coaching</span></div>

  <span class="ch-num">Speciality Profile 06</span>
  <h1 class="ch-title d">Viva &amp; Presentation Coaching</h1>

  <div class="problem-card">
    <strong>Who It Is For:</strong> Candidates scheduled for their defense who experience severe presentation anxiety, struggle to articulate their research contribution, or fear critical questions from committee members.
  </div>

  <h2 class="subh d">Specific Concrete Problems Fixed</h2>
  <ul>
    <li>Eliminating slide overcrowding (turning 60-word bullet walls into clean, punchy visual presentation slides).</li>
    <li>Practicing the A-R-E framework out loud so answers remain succinct, structured, and methodologically grounded.</li>
    <li>Neutralizing aggressive committee critique by mastering calm, non-defensive acknowledgment of study limitations.</li>
    <li>Mastering the 10-minute thesis elevator pitch: Problem &rarr; Method &rarr; Key Results &rarr; Practical Implication.</li>
  </ul>

  <h2 class="subh d">What the Student Receives</h2>
  <ul>
    <li>Slide deck review with line-by-line notes on pacing, readability, and visual hierarchy.</li>
    <li>Personalized 25-question committee prediction sheet drafted specifically from your thesis text.</li>
    <li><strong>60-Minute Mock Viva Simulation:</strong> Realistic defense simulation with verbal critique and answer sharpening.</li>
  </ul>

  <div class="mistake-box">
    <strong>What M. Yousaf Will Never Do:</strong> I will never teach you to memorize scripts. True confidence comes from understanding your dataset so thoroughly that you can discuss it casually from memory.
  </div>

  <div class="tip-box">
    <strong>Illustrative Scenario:</strong><br>
    <em>A Clinical Psychology scholar was terrified that external examiners would fail her thesis due to a small qualitative sample (n = 12). During coaching, M. Yousaf trained her to defend data saturation principles using Guest et al.'s criteria. During the actual viva, the examiner asked that exact question; she delivered her prepared rationale calmly and passed with no major corrections.</em>
  </div>

  <div class="help-card">
    <div class="htxt">
      <strong>Book a Mock Viva Coaching Session</strong>
      <span>Send your slide draft and thesis abstract to schedule your personalized mock defense rehearsal.</span>
    </div>
    <a href="https://wa.me/923296646824?text=Hi%20M.%20Yousaf%2C%20I%20need%20viva%20coaching%20and%20a%20mock%20defense." class="wa-btn">Message on WhatsApp &rarr;</a>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 23</span></div>
</div>

<!-- ==========================================
     PAGE 24: HOW WORKING TOGETHER WORKS
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services &bull; Workflow</span><span class="accent">How We Work</span></div>

  <span class="ch-num">Client Experience</span>
  <h1 class="ch-title d">Four steps. Transparent. No surprises.</h1>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:10px 0 16px">
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px">
      <div style="width:30px;height:30px;border-radius:50%;background:#ff6b2c;color:#0a0f1c;font-weight:900;display:flex;align-items:center;justify-content:center;margin-bottom:6px" class="d">1</div>
      <div class="d" style="font-size:15px;color:#0a0f1c;margin-bottom:3px">Brief &amp; Review</div>
      <p style="font-size:12px;margin:0">Send your topic, guidelines, current draft, or dataset via WhatsApp or email. State your target deadline.</p>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px">
      <div style="width:30px;height:30px;border-radius:50%;background:#ff6b2c;color:#0a0f1c;font-weight:900;display:flex;align-items:center;justify-content:center;margin-bottom:6px" class="d">2</div>
      <div class="d" style="font-size:15px;color:#0a0f1c;margin-bottom:3px">Upfront Fixed Quote</div>
      <p style="font-size:12px;margin:0">Receive an honest evaluation of feasibility, turnaround timeline, and clear fixed pricing agreed before work begins.</p>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px">
      <div style="width:30px;height:30px;border-radius:50%;background:#ff6b2c;color:#0a0f1c;font-weight:900;display:flex;align-items:center;justify-content:center;margin-bottom:6px" class="d">3</div>
      <div class="d" style="font-size:15px;color:#0a0f1c;margin-bottom:3px">1-on-1 Working Session</div>
      <p style="font-size:12px;margin:0">Receive your edited documents, data outputs, or live coaching walkthrough directly with M. Yousaf.</p>
    </div>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px">
      <div style="width:30px;height:30px;border-radius:50%;background:#ff6b2c;color:#0a0f1c;font-weight:900;display:flex;align-items:center;justify-content:center;margin-bottom:6px" class="d">4</div>
      <div class="d" style="font-size:15px;color:#0a0f1c;margin-bottom:3px">Follow-Up Support</div>
      <p style="font-size:12px;margin:0">Any follow-up questions on the completed deliverables are addressed until you feel completely confident.</p>
    </div>
  </div>

  <h2 class="subh d">Accepted Payment Channels</h2>
  <p>For your convenience, Quick Services accepts domestic and international payments through all standard banking and mobile channels:</p>

  <div style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 16px">
    <span style="background:#0a0f1c;color:#fff;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700">JazzCash</span>
    <span style="background:#0a0f1c;color:#fff;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700">EasyPaisa</span>
    <span style="background:#0a0f1c;color:#fff;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700">SadaPay</span>
    <span style="background:#0a0f1c;color:#fff;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700">NayaPay</span>
    <span style="background:#0a0f1c;color:#fff;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700">Bank Transfer (IBFT)</span>
    <span style="background:#0a0f1c;color:#fff;padding:6px 14px;border-radius:999px;font-size:12px;font-weight:700">Western Union</span>
  </div>

  <div class="tip-box">
    <strong>Free Consultation Guarantee:</strong> You are never charged for initial scoping messages or feasibility reviews. Send your material, get a clear proposal, and decide with no obligation.
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 24</span></div>
</div>

<!-- ==========================================
     PAGE 25: FAQ (PART 1)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services &bull; FAQ</span><span class="accent">Ethics &amp; Boundaries</span></div>

  <span class="ch-num">Answers</span>
  <h1 class="ch-title d">Frequently Asked Questions &bull; Part 1</h1>

  <div style="margin-bottom:12px">
    <div class="d" style="font-size:14px;color:#0a0f1c;margin-bottom:3px">Will you write my thesis or assignment for me?</div>
    <p style="font-size:12.5px;margin:0 0 10px">
      <strong>No.</strong> We never ghostwrite. Quick Services exists to coach you, edit your own written sentences, and explain statistical logic so that you understand every word. The thesis you submit to your university must be your own authentic scholarship.
    </p>
  </div>

  <div style="margin-bottom:12px">
    <div class="d" style="font-size:14px;color:#0a0f1c;margin-bottom:3px">Do you help reduce Turnitin or AI-detection similarity scores?</div>
    <p style="font-size:12.5px;margin:0 0 10px">
      <strong>No.</strong> We do not use automated synonym spinners or evasion tricks. We teach you how to read sources, synthesize ideas, paraphrase legitimately in your own voice, and cite accurately. That is the only honest way to a clean similarity report.
    </p>
  </div>

  <div style="margin-bottom:12px">
    <div class="d" style="font-size:14px;color:#0a0f1c;margin-bottom:3px">Is my research data and draft kept confidential?</div>
    <p style="font-size:12.5px;margin:0 0 10px">
      <strong>Yes, 100%.</strong> All research datasets, questionnaire instruments, and dissertation manuscripts are handled under strict confidentiality. Your work is never shared, published, or repurposed for any other student or third party.
    </p>
  </div>

  <div style="margin-bottom:12px">
    <div class="d" style="font-size:14px;color:#0a0f1c;margin-bottom:3px">Do you guarantee specific university grades or journal publication?</div>
    <p style="font-size:12.5px;margin:0 0 10px">
      <strong>No.</strong> Academic grades and journal acceptances depend on the independent evaluation of university committees and peer reviewers. What we guarantee is rigorous editing, correct statistical procedures, and clear explanations.
    </p>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 25</span></div>
</div>

<!-- ==========================================
     PAGE 26: FAQ (PART 2)
     ========================================== -->
<div class="page">
  <div class="top-bar-rule"></div>
  <div class="p-hdr"><span>Quick Services &bull; FAQ</span><span class="accent">Operations &amp; Scope</span></div>

  <span class="ch-num">Answers</span>
  <h1 class="ch-title d">Frequently Asked Questions &bull; Part 2</h1>

  <div style="margin-bottom:12px">
    <div class="d" style="font-size:14px;color:#0a0f1c;margin-bottom:3px">I only have a few days before my submission deadline. Can you help?</div>
    <p style="font-size:12.5px;margin:0 0 10px">
      Often yes, provided the scope is focused (such as reviewing an analysis chapter, auditing citations, or proofreading a completed draft). Send your deadline and draft on WhatsApp, and M. Yousaf will confirm realistically before you commit.
    </p>
  </div>

  <div style="margin-bottom:12px">
    <div class="d" style="font-size:14px;color:#0a0f1c;margin-bottom:3px">Which statistical tools and citation formats do you support?</div>
    <p style="font-size:12.5px;margin:0 0 10px">
      We specialize in <strong>SPSS</strong> and <strong>SmartPLS</strong> for quantitative models, and support APA (6th &amp; 7th), Harvard, Vancouver, and IEEE citation conventions. If your university uses another specific departmental template, message us to confirm.
    </p>
  </div>

  <div style="margin-bottom:12px">
    <div class="d" style="font-size:14px;color:#0a0f1c;margin-bottom:3px">Can you assist with peer-reviewed journal papers and reviewer comments?</div>
    <p style="font-size:12.5px;margin:0 0 10px">
      Yes. We help early-career researchers structure journal submissions, format statistical tables according to journal instructions, and formulate professional, respectful rebuttal letters addressing peer reviewer comments.
    </p>
  </div>

  <div style="margin-bottom:12px">
    <div class="d" style="font-size:14px;color:#0a0f1c;margin-bottom:3px">Will I speak directly with M. Yousaf or an assistant?</div>
    <p style="font-size:12.5px;margin:0 0 10px">
      You work directly with <strong>M. Yousaf</strong>. You communicate with him on WhatsApp for quotes, working sessions, and feedback, ensuring continuity and academic accountability without middleman ticketing queues.
    </p>
  </div>

  <div class="p-ftr"><span>Quick Services | WhatsApp +92 329 6646824</span><span>Page 26</span></div>
</div>

<!-- ==========================================
     PAGE 27: BACK COVER
     ========================================== -->
<div class="page back-cover">
  <div>
    <span class="tag-badge" style="border-color:#ff6b2c;color:#ff6b2c;margin-bottom:12mm">Ready When You Are</span>
    <h1 class="d" style="font-size:42px;line-height:1.02;color:#ffffff;margin:16px 0 18px">
      Make your research <span style="color:#ff6b2c">make sense.</span>
    </h1>
    <p style="font-size:16px;color:#94a3b8;max-width:140mm;margin:0 auto 28px;line-height:1.5">
      Send your topic, guidelines or current draft to M. Yousaf for an honest review, clear quote, and personal academic consultation.
    </p>

    <!-- QR Code Container -->
    <div style="background:#ffffff;border-radius:18px;padding:16px;display:inline-block;margin:0 auto 20px">
      <img src="{qr_image_path}" style="width:140px;height:140px;display:block" alt="WhatsApp QR Code">
      <div style="color:#0a0f1c;font-size:10px;font-weight:800;margin-top:6px;text-transform:uppercase;letter-spacing:1px">Scan to Chat on WhatsApp</div>
    </div>

    <div>
      <a href="https://wa.me/923296646824" class="wa-btn" style="font-size:14px;padding:10px 24px;border-radius:999px">
        WhatsApp: +92 329 6646824 &rarr;
      </a>
    </div>
  </div>

  <div style="border-top:1px solid #1e293b;padding-top:16px;display:flex;justify-content:space-between;align-items:center;color:#64748b;font-size:12px">
    <div>Quick Services &bull; Academic Support &amp; Research Consulting</div>
    <div>quickservices489@gmail.com &bull; quickservices.pk</div>
  </div>
</div>

</body>
</html>
"""
