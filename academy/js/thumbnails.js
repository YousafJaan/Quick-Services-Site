/**
 * Quick Services Academy — Handcrafted Claude Academy Style Vector SVG Thumbnails
 * Reverse-engineered from Claude Academy (academy.claude.com)
 * Minimalist geometric linework, fine construction lines, terracotta accents (#d97757),
 * warm paper/parchment surfaces, and mathematically balanced academic metaphors.
 */

export function getCourseThumbnailSvg(courseId, { width = 400, height = 160 } = {}) {
  const bg = '#f6f4ee';
  const strokeDark = '#2c2b29';
  const strokeClay = '#d97757';
  const strokeMuted = '#9c9a92';
  const strokeGuide = '#c8c5bb';
  const fillSubtle = '#ebe7dc';
  const fillClaySoft = '#fcedea';

  switch (courseId) {
    case 'thesis101':
      // Topic Narrowing Funnel + Central Architectural Plumbline + Scope Target
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Background Grid / Construction Guidelines -->
          <line x1="40" y1="80" x2="360" y2="80" stroke="${strokeGuide}" stroke-width="1" stroke-dasharray="3,3"/>
          <line x1="200" y1="20" x2="200" y2="140" stroke="${strokeGuide}" stroke-width="1" stroke-dasharray="3,3"/>
          
          <!-- Funnel Stages (Broad Interest -> Specific Field -> Operational Research Question) -->
          <polygon points="120,32 280,32 245,68 155,68" fill="${fillSubtle}" stroke="${strokeDark}" stroke-width="1.5" stroke-linejoin="round"/>
          <polygon points="155,68 245,68 225,104 175,104" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5" stroke-linejoin="round"/>
          <polygon points="175,104 225,104 210,132 190,132" fill="${fillClaySoft}" stroke="${strokeClay}" stroke-width="1.75" stroke-linejoin="round"/>
          
          <!-- Concentric Scope Circles -->
          <circle cx="200" cy="80" r="54" fill="none" stroke="${strokeMuted}" stroke-width="1" stroke-dasharray="4,4"/>
          <circle cx="200" cy="80" r="68" fill="none" stroke="${strokeGuide}" stroke-width="1"/>
          
          <!-- Architectural Needle & Target Node -->
          <line x1="200" y1="24" x2="200" y2="136" stroke="${strokeClay}" stroke-width="1.5"/>
          <circle cx="200" cy="132" r="3.5" fill="${strokeClay}"/>
          <circle cx="200" cy="32" r="2.5" fill="${strokeDark}"/>
          
          <!-- Annotation Mark -->
          <text x="290" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="${strokeMuted}" letter-spacing="0.5">BROAD TOPIC</text>
          <text x="290" y="132" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="${strokeClay}" letter-spacing="0.5">NARROW PROBLEM</text>
        </svg>`;

    case 'cite101':
      // Typographic Quotation Glyph + Hanging Indent Schema + DOI Hypergraph
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Construction Lines -->
          <line x1="60" y1="40" x2="340" y2="40" stroke="${strokeGuide}" stroke-width="1" stroke-dasharray="2,2"/>
          <line x1="60" y1="120" x2="340" y2="120" stroke="${strokeGuide}" stroke-width="1" stroke-dasharray="2,2"/>
          
          <!-- Stylized Serif Quotation Mark in Terracotta -->
          <path d="M 100,52 C 100,42 108,35 118,35 C 126,35 132,41 132,49 C 132,60 120,72 106,78 L 102,74 C 112,70 118,63 118,56 C 116,56 114,57 112,57 C 105,57 100,52 100,52 Z" fill="${strokeClay}"/>
          <path d="M 126,52 C 126,42 134,35 144,35 C 152,35 158,41 158,49 C 158,60 146,72 132,78 L 128,74 C 138,70 144,63 144,56 C 142,56 140,57 138,57 C 131,57 126,52 126,52 Z" fill="${strokeClay}"/>
          
          <!-- Hanging Indent Visual Representation (First line flush, subsequent lines indented) -->
          <rect x="150" y="52" width="180" height="4" rx="2" fill="${strokeDark}"/>
          <rect x="175" y="64" width="155" height="4" rx="2" fill="${strokeMuted}"/>
          <rect x="175" y="76" width="130" height="4" rx="2" fill="${strokeMuted}"/>
          
          <!-- DOI / Citation Graph Nodes -->
          <circle cx="105" cy="112" r="5" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="160" cy="112" r="5" fill="${fillClaySoft}" stroke="${strokeClay}" stroke-width="1.5"/>
          <circle cx="220" cy="112" r="5" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="280" cy="112" r="4" fill="${fillSubtle}" stroke="${strokeMuted}" stroke-width="1.5"/>
          <line x1="110" y1="112" x2="155" y2="112" stroke="${strokeDark}" stroke-width="1.5"/>
          <line x1="165" y1="112" x2="215" y2="112" stroke="${strokeClay}" stroke-width="1.5"/>
          <line x1="225" y1="112" x2="276" y2="112" stroke="${strokeMuted}" stroke-width="1.5" stroke-dasharray="3,2"/>
          
          <!-- Annotation -->
          <text x="160" y="130" font-family="'SF Mono', Menlo, monospace" font-size="8.5" font-weight="600" fill="${strokeClay}" text-anchor="middle">doi:10.1037/arc000001</text>
        </svg>`;

    case 'edit101':
      // Three-Pass Editing Architecture: Argument -> Paragraph Flow -> Mechanics
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Manuscript Page Silhouette -->
          <rect x="80" y="24" width="240" height="112" rx="6" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <line x1="80" y1="46" x2="320" y2="46" stroke="${strokeGuide}" stroke-width="1"/>
          
          <!-- Heading Bar -->
          <rect x="100" y="34" width="70" height="5" rx="2.5" fill="${strokeDark}"/>
          
          <!-- Text Lines with Proofreading Markups -->
          <line x1="100" y1="60" x2="270" y2="60" stroke="${strokeMuted}" stroke-width="2"/>
          <line x1="100" y1="74" x2="230" y2="74" stroke="${strokeMuted}" stroke-width="2"/>
          
          <!-- Redline Deletion Strike in Terracotta -->
          <line x1="234" y1="74" x2="280" y2="74" stroke="${strokeClay}" stroke-width="2"/>
          <line x1="240" y1="68" x2="274" y2="80" stroke="${strokeClay}" stroke-width="1.5"/>
          
          <line x1="100" y1="88" x2="290" y2="88" stroke="${strokeMuted}" stroke-width="2"/>
          <line x1="100" y1="102" x2="250" y2="102" stroke="${strokeMuted}" stroke-width="2"/>
          
          <!-- Proofreader's Pilcrow & Insertion Caret -->
          <text x="96" y="74" font-family="'Newsreader', Georgia, serif" font-size="12" font-weight="700" fill="${strokeClay}" text-anchor="end">¶</text>
          <path d="M 180,94 L 184,88 L 188,94" fill="none" stroke="${strokeClay}" stroke-width="1.75"/>
          
          <!-- Margin Stamp: Three-Pass Quality Seal -->
          <rect x="250" y="108" width="60" height="18" rx="4" fill="${fillClaySoft}" stroke="${strokeClay}" stroke-width="1"/>
          <text x="280" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="800" fill="${strokeClay}" text-anchor="middle">3-PASS PASS</text>
        </svg>`;

    case 'integrity101':
      // Turnitin / HEC Policy Integrity Shield + Match Crosshair Lens + Originality Dial
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Academic Integrity Shield Outline -->
          <path d="M 200,26 L 248,46 C 248,88 226,118 200,134 C 174,118 152,88 152,46 Z" fill="${fillSubtle}" stroke="${strokeDark}" stroke-width="1.75" stroke-linejoin="round"/>
          <path d="M 200,34 L 240,51 C 240,84 222,110 200,124 C 178,110 160,84 160,51 Z" fill="#ffffff" stroke="${strokeGuide}" stroke-width="1"/>
          
          <!-- HEC Similarity 19% Threshold Arc Gauge -->
          <path d="M 180,82 A 22 22 0 0 1 216,74" fill="none" stroke="${strokeClay}" stroke-width="3" stroke-linecap="round"/>
          <circle cx="200" cy="80" r="2.5" fill="${strokeDark}"/>
          <line x1="200" y1="80" x2="214" y2="72" stroke="${strokeClay}" stroke-width="1.75" stroke-linecap="round"/>
          
          <!-- Inspection Reticle / Crosshair -->
          <circle cx="200" cy="80" r="32" fill="none" stroke="${strokeMuted}" stroke-width="1" stroke-dasharray="4,3"/>
          <line x1="162" y1="80" x2="176" y2="80" stroke="${strokeDark}" stroke-width="1.5"/>
          <line x1="224" y1="80" x2="238" y2="80" stroke="${strokeDark}" stroke-width="1.5"/>
          <line x1="200" y1="42" x2="200" y2="56" stroke="${strokeDark}" stroke-width="1.5"/>
          <line x1="200" y1="104" x2="200" y2="118" stroke="${strokeDark}" stroke-width="1.5"/>
          
          <!-- Side Document Match Highlights -->
          <rect x="75" y="55" width="48" height="52" rx="4" fill="#ffffff" stroke="${strokeMuted}" stroke-width="1.25"/>
          <line x1="83" y1="67" x2="115" y2="67" stroke="${strokeClay}" stroke-width="2.5"/>
          <line x1="83" y1="77" x2="105" y2="77" stroke="${strokeMuted}" stroke-width="1.5"/>
          <line x1="83" y1="87" x2="112" y2="87" stroke="${strokeMuted}" stroke-width="1.5"/>
          <line x1="83" y1="97" x2="98" y2="97" stroke="${strokeGuide}" stroke-width="1.5"/>
          
          <rect x="277" y="55" width="48" height="52" rx="4" fill="#ffffff" stroke="${strokeMuted}" stroke-width="1.25"/>
          <line x1="285" y1="67" x2="317" y2="67" stroke="${strokeClay}" stroke-width="2.5"/>
          <line x1="285" y1="77" x2="310" y2="77" stroke="${strokeMuted}" stroke-width="1.5"/>
          <line x1="285" y1="87" x2="304" y2="87" stroke="${strokeMuted}" stroke-width="1.5"/>
          <line x1="285" y1="97" x2="315" y2="97" stroke="${strokeGuide}" stroke-width="1.5"/>
          
          <!-- HEC Rule Badge -->
          <text x="200" y="148" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="${strokeClay}" text-anchor="middle" letter-spacing="0.5">HEC SIMILARITY &lt; 19%</text>
        </svg>`;

    case 'lit-search':
      // PRISMA Flow Diagram + Boolean Logic Intersecting Circles
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Boolean Venn Intersections (AND, OR, NOT) -->
          <circle cx="110" cy="80" r="38" fill="${fillSubtle}" stroke="${strokeDark}" stroke-width="1.5" opacity="0.6"/>
          <circle cx="150" cy="80" r="38" fill="${fillClaySoft}" stroke="${strokeClay}" stroke-width="1.5" opacity="0.7"/>
          
          <!-- PRISMA Flow Blocks on Right -->
          <!-- Step 1: Identification -->
          <rect x="220" y="32" width="120" height="24" rx="4" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.25"/>
          <text x="280" y="47" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="${strokeDark}" text-anchor="middle">Identification (n = 840)</text>
          
          <line x1="280" y1="56" x2="280" y2="68" stroke="${strokeMuted}" stroke-width="1.5" marker-end="url(#arrow)"/>
          
          <!-- Step 2: Screening -->
          <rect x="220" y="68" width="120" height="24" rx="4" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.25"/>
          <text x="280" y="83" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="${strokeDark}" text-anchor="middle">Screening (n = 192)</text>
          
          <line x1="280" y1="92" x2="280" y2="104" stroke="${strokeClay}" stroke-width="1.5"/>
          
          <!-- Step 3: Included -->
          <rect x="220" y="104" width="120" height="24" rx="4" fill="${fillClaySoft}" stroke="${strokeClay}" stroke-width="1.5"/>
          <text x="280" y="119" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" fill="${strokeClay}" text-anchor="middle">Included Studies (n = 34)</text>
          
          <!-- Boolean Symbol In Overlap -->
          <text x="130" y="84" font-family="'SF Mono', Menlo, monospace" font-size="10" font-weight="800" fill="${strokeDark}" text-anchor="middle">AND</text>
        </svg>`;

    case 'sample-size':
      // Gaussian Distribution Bell Curve + G*Power Beta Power Threshold
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Coordinate Axes -->
          <line x1="60" y1="130" x2="340" y2="130" stroke="${strokeDark}" stroke-width="1.5"/>
          <line x1="200" y1="20" x2="200" y2="135" stroke="${strokeGuide}" stroke-width="1" stroke-dasharray="3,3"/>
          
          <!-- Normal Bell Curve H0 -->
          <path d="M 70,130 Q 140,130 170,80 Q 200,25 230,80 Q 260,130 330,130" fill="none" stroke="${strokeDark}" stroke-width="2"/>
          
          <!-- Shaded Critical Rejection Region (Alpha = .05) -->
          <path d="M 245,100 Q 260,130 330,130 L 245,130 Z" fill="${fillClaySoft}" stroke="${strokeClay}" stroke-width="1"/>
          
          <!-- Critical Value Threshold Line -->
          <line x1="245" y1="40" x2="245" y2="130" stroke="${strokeClay}" stroke-width="1.75" stroke-dasharray="4,2"/>
          
          <!-- Labels & Effect Size Vectors -->
          <text x="245" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="${strokeClay}" text-anchor="middle">α = 0.05</text>
          <text x="145" y="85" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="${strokeMuted}">Power (1-β) = 0.80</text>
          
          <!-- Cochran FPC Indicator -->
          <circle cx="200" cy="28" r="3.5" fill="${strokeClay}"/>
          <text x="200" y="146" font-family="'SF Mono', Menlo, monospace" font-size="8.5" font-weight="600" fill="${strokeMuted}" text-anchor="middle">n₀ = Z²pq / e²</text>
        </svg>`;

    case 'spss':
    case 'spss101':
      // Bivariate Linear Regression Line + Scatter Coordinates + Variance Residuals
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Graph Grid -->
          <line x1="80" y1="130" x2="320" y2="130" stroke="${strokeDark}" stroke-width="1.5"/>
          <line x1="80" y1="25" x2="80" y2="130" stroke="${strokeDark}" stroke-width="1.5"/>
          <line x1="80" y1="60" x2="320" y2="60" stroke="${strokeGuide}" stroke-width="1" stroke-dasharray="2,2"/>
          <line x1="80" y1="95" x2="320" y2="95" stroke="${strokeGuide}" stroke-width="1" stroke-dasharray="2,2"/>
          
          <!-- Scatter Plot Points -->
          <circle cx="110" cy="112" r="3" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="135" cy="102" r="3" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="160" cy="85" r="3" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="190" cy="82" r="3" fill="${strokeClay}" stroke="${strokeClay}" stroke-width="1.5"/>
          <circle cx="220" cy="65" r="3" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="250" cy="50" r="3" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="280" cy="42" r="3" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          
          <!-- Fitted Regression Line (y = mx + b) -->
          <line x1="90" y1="120" x2="300" y2="35" stroke="${strokeClay}" stroke-width="2"/>
          
          <!-- Residual Error Bar for Point (190, 82) -->
          <line x1="190" y1="82" x2="190" y2="79" stroke="${strokeDark}" stroke-width="1.5" stroke-dasharray="2,1"/>
          
          <!-- Regression Formula Tag -->
          <rect x="220" y="98" width="100" height="24" rx="4" fill="#ffffff" stroke="${strokeMuted}" stroke-width="1"/>
          <text x="270" y="113" font-family="'SF Mono', Menlo, monospace" font-size="9" font-weight="700" fill="${strokeDark}" text-anchor="middle">R² = .784, p &lt; .001</text>
        </svg>`;

    case 'smartpls':
      // Structural Equation Model (PLS-SEM): Latent Constructs + Outer Indicator Loadings
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Latent Construct 1 (IV) -->
          <circle cx="100" cy="80" r="28" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.75"/>
          <text x="100" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="${strokeDark}" text-anchor="middle">IV (ξ₁)</text>
          
          <!-- Reflective Indicators for IV (3 rectangles) -->
          <rect x="42" y="42" width="22" height="15" rx="2" fill="${fillSubtle}" stroke="${strokeMuted}" stroke-width="1"/>
          <rect x="42" y="73" width="22" height="15" rx="2" fill="${fillSubtle}" stroke="${strokeMuted}" stroke-width="1"/>
          <rect x="42" y="104" width="22" height="15" rx="2" fill="${fillSubtle}" stroke="${strokeMuted}" stroke-width="1"/>
          <line x1="64" y1="50" x2="78" y2="65" stroke="${strokeMuted}" stroke-width="1"/>
          <line x1="64" y1="80" x2="72" y2="80" stroke="${strokeMuted}" stroke-width="1"/>
          <line x1="64" y1="110" x2="78" y2="95" stroke="${strokeMuted}" stroke-width="1"/>
          
          <!-- Path Arrow IV -> Mediator -->
          <line x1="128" y1="80" x2="172" y2="80" stroke="${strokeClay}" stroke-width="2"/>
          <polygon points="172,76 180,80 172,84" fill="${strokeClay}"/>
          <text x="150" y="72" font-family="'SF Mono', monospace" font-size="8.5" font-weight="800" fill="${strokeClay}" text-anchor="middle">β = .48</text>
          
          <!-- Latent Construct 2 (Mediator) -->
          <circle cx="210" cy="80" r="28" fill="${fillClaySoft}" stroke="${strokeClay}" stroke-width="2"/>
          <text x="210" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="800" fill="${strokeClay}" text-anchor="middle">MED (η₁)</text>
          
          <!-- Path Arrow Mediator -> DV -->
          <line x1="238" y1="80" x2="282" y2="80" stroke="${strokeDark}" stroke-width="2"/>
          <polygon points="282,76 290,80 282,84" fill="${strokeDark}"/>
          <text x="260" y="72" font-family="'SF Mono', monospace" font-size="8.5" font-weight="800" fill="${strokeDark}" text-anchor="middle">β = .62</text>
          
          <!-- Latent Construct 3 (DV) -->
          <circle cx="320" cy="80" r="28" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.75"/>
          <text x="320" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="${strokeDark}" text-anchor="middle">DV (η₂)</text>
          
          <!-- Direct Effect Arc IV -> DV -->
          <path d="M 115,55 Q 210,22 305,55" fill="none" stroke="${strokeGuide}" stroke-width="1.25" stroke-dasharray="3,3"/>
          <text x="210" y="32" font-family="'SF Mono', monospace" font-size="7.5" font-weight="600" fill="${strokeMuted}" text-anchor="middle">Direct: β = .14 (ns)</text>
        </svg>`;

    case 'qualitative':
      // Thematic Analysis: Inductive Coding Hierarchy + Affinity Nodes
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Level 1: Raw Quotes (3 nodes on left) -->
          <circle cx="80" cy="45" r="10" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="80" cy="80" r="10" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="80" cy="115" r="10" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <text x="80" y="49" font-family="'SF Mono', monospace" font-size="8" font-weight="700" fill="${strokeDark}" text-anchor="middle">Q1</text>
          <text x="80" y="84" font-family="'SF Mono', monospace" font-size="8" font-weight="700" fill="${strokeDark}" text-anchor="middle">Q2</text>
          <text x="80" y="119" font-family="'SF Mono', monospace" font-size="8" font-weight="700" fill="${strokeDark}" text-anchor="middle">Q3</text>
          
          <!-- Level 2: Initial Open Codes (2 boxes in center) -->
          <line x1="90" y1="45" x2="160" y2="60" stroke="${strokeMuted}" stroke-width="1.25"/>
          <line x1="90" y1="80" x2="160" y2="60" stroke="${strokeMuted}" stroke-width="1.25"/>
          <line x1="90" y1="115" x2="160" y2="100" stroke="${strokeMuted}" stroke-width="1.25"/>
          
          <rect x="160" y="48" width="80" height="24" rx="4" fill="${fillSubtle}" stroke="${strokeDark}" stroke-width="1.25"/>
          <text x="200" y="63" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="${strokeDark}" text-anchor="middle">Code: Barrier</text>
          
          <rect x="160" y="88" width="80" height="24" rx="4" fill="${fillSubtle}" stroke="${strokeDark}" stroke-width="1.25"/>
          <text x="200" y="103" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="${strokeDark}" text-anchor="middle">Code: Strategy</text>
          
          <!-- Level 3: Overarching Global Theme (Right Card) -->
          <line x1="240" y1="60" x2="280" y2="80" stroke="${strokeClay}" stroke-width="1.5"/>
          <line x1="240" y1="100" x2="280" y2="80" stroke="${strokeClay}" stroke-width="1.5"/>
          
          <rect x="280" y="60" width="85" height="40" rx="6" fill="${fillClaySoft}" stroke="${strokeClay}" stroke-width="1.75"/>
          <text x="322" y="78" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="${strokeClay}" text-anchor="middle">THEME 1</text>
          <text x="322" y="91" font-family="'Plus Jakarta Sans', sans-serif" font-size="7.5" font-weight="600" fill="${strokeDark}" text-anchor="middle">Institutional Friction</text>
        </svg>`;

    case 'viva':
      // Viva Voce Defense: Academic Rostrum + Examination Triad + Defense Seal
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <!-- Academic Presentation Beam Guidelines -->
          <polygon points="120,80 280,35 280,125" fill="${fillClaySoft}" opacity="0.4"/>
          
          <!-- Candidate Rostrum / Speaker Podium -->
          <polygon points="100,65 130,65 125,125 105,125" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.75"/>
          <rect x="95" y="60" width="40" height="7" rx="2" fill="${strokeClay}"/>
          <!-- Microphone -->
          <line x1="115" y1="60" x2="115" y2="48" stroke="${strokeDark}" stroke-width="1.5"/>
          <circle cx="115" cy="46" r="3" fill="${strokeClay}"/>
          
          <!-- Tripartite Examination Committee (3 circular nodes) -->
          <circle cx="280" cy="48" r="14" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <text x="280" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="${strokeDark}" text-anchor="middle">Ext.</text>
          
          <circle cx="295" cy="80" r="14" fill="${fillClaySoft}" stroke="${strokeClay}" stroke-width="1.75"/>
          <text x="295" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" fill="${strokeClay}" text-anchor="middle">Chair</text>
          
          <circle cx="280" cy="112" r="14" fill="#ffffff" stroke="${strokeDark}" stroke-width="1.5"/>
          <text x="280" y="116" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="700" fill="${strokeDark}" text-anchor="middle">Int.</text>
          
          <!-- Commendation Seal Ribbon -->
          <circle cx="200" cy="80" r="18" fill="#ffffff" stroke="${strokeClay}" stroke-width="1.5"/>
          <circle cx="200" cy="80" r="14" fill="none" stroke="${strokeGuide}" stroke-width="1" stroke-dasharray="2,2"/>
          <polygon points="196,73 204,73 205,82 200,80 195,82" fill="${strokeClay}"/>
          <polygon points="200,80 205,82 204,89 200,86 196,89 195,82" fill="${strokeDark}"/>
          <text x="200" y="110" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" fill="${strokeClay}" text-anchor="middle">VIVA VOCE</text>
        </svg>`;

    default:
      // Fallback clean geometric vignette
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="background:${bg};">
          <circle cx="200" cy="80" r="54" fill="none" stroke="${strokeClay}" stroke-width="1.5"/>
          <circle cx="200" cy="80" r="34" fill="none" stroke="${strokeDark}" stroke-width="1.25" stroke-dasharray="4,4"/>
          <text x="200" y="85" font-family="'Newsreader', Georgia, serif" font-size="20" font-weight="500" fill="${strokeDark}" text-anchor="middle">${courseId.toUpperCase()}</text>
        </svg>`;
  }
}
