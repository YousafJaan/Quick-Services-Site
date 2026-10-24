/**
 * Quick Services Academy — Handcrafted Claude Academy Style Vector SVG Thumbnails
 * Elevated with vibrant, aesthetic, attention-grabbing color palettes and subtle luminous gradients
 * while preserving meticulous geometric construction linework, academic metaphors, and editorial elegance.
 */

export function getCourseThumbnailSvg(courseId, { width = 400, height = 160 } = {}) {
  switch (courseId) {
    case 'thesis101':
      // Warm Apricot & Terracotta Sunset • Topic Narrowing Funnel + Architectural Plumbline
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-thesis-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff8f3"/>
              <stop offset="100%" stop-color="#ffedd5"/>
            </linearGradient>
            <linearGradient id="grad-thesis-funnel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fdba74"/>
              <stop offset="100%" stop-color="#ea580c"/>
            </linearGradient>
            <filter id="shadow-thesis" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#ea580c" flood-opacity="0.16"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-thesis-bg)"/>
          
          <!-- Delicate Construction Grid -->
          <line x1="40" y1="80" x2="360" y2="80" stroke="#fed7aa" stroke-width="1" stroke-dasharray="3,3"/>
          <line x1="200" y1="15" x2="200" y2="145" stroke="#fed7aa" stroke-width="1" stroke-dasharray="3,3"/>
          <circle cx="200" cy="80" r="54" fill="none" stroke="#fdba74" stroke-width="1" stroke-dasharray="4,4" opacity="0.6"/>
          <circle cx="200" cy="80" r="70" fill="none" stroke="#fed7aa" stroke-width="1" opacity="0.5"/>

          <!-- Funnel Stages -->
          <polygon points="120,32 280,32 245,66 155,66" fill="#ffffff" stroke="#9a3412" stroke-width="1.75" stroke-linejoin="round" filter="url(#shadow-thesis)"/>
          <polygon points="155,66 245,66 225,102 175,102" fill="#fff7ed" stroke="#c2410c" stroke-width="1.75" stroke-linejoin="round"/>
          <polygon points="175,102 225,102 210,132 190,132" fill="url(#grad-thesis-funnel)" stroke="#ea580c" stroke-width="2" stroke-linejoin="round"/>

          <!-- Laser Precision Needle & Core Focus Node -->
          <line x1="200" y1="20" x2="200" y2="136" stroke="#ea580c" stroke-width="2"/>
          <circle cx="200" cy="132" r="4.5" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="200" cy="32" r="3.5" fill="#9a3412"/>

          <!-- Editorial Micro-Typography -->
          <rect x="268" y="26" width="95" height="18" rx="4" fill="#ffffff" stroke="#fdba74" stroke-width="1"/>
          <text x="315" y="38" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800" fill="#c2410c" text-anchor="middle" letter-spacing="0.5">BROAD DOMAIN</text>
          
          <rect x="250" y="122" width="125" height="18" rx="4" fill="#ea580c"/>
          <text x="312" y="134" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">DEFENSIBLE TOPIC</text>
        </svg>`;

    case 'cite101':
      // Warm Saffron & Golden Honey • Typographic Quotation Glyph + DOI Citation Hypergraph
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-cite-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fffdf5"/>
              <stop offset="100%" stop-color="#fef3c7"/>
            </linearGradient>
            <linearGradient id="grad-quote-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d97706"/>
              <stop offset="100%" stop-color="#b45309"/>
            </linearGradient>
            <filter id="shadow-cite" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#d97706" flood-opacity="0.18"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-cite-bg)"/>

          <!-- Golden Construction Guides -->
          <line x1="50" y1="40" x2="350" y2="40" stroke="#fde68a" stroke-width="1" stroke-dasharray="3,3"/>
          <line x1="50" y1="120" x2="350" y2="120" stroke="#fde68a" stroke-width="1" stroke-dasharray="3,3"/>

          <!-- Quotation Marks in Burnished Gold -->
          <path d="M 96,52 C 96,40 106,32 118,32 C 128,32 135,39 135,49 C 135,62 121,75 104,82 L 99,77 C 111,72 118,65 118,57 C 116,57 113,58 111,58 C 102,58 96,52 96,52 Z" fill="url(#grad-quote-gold)" filter="url(#shadow-cite)"/>
          <path d="M 126,52 C 126,40 136,32 148,32 C 158,32 165,39 165,49 C 165,62 151,75 134,82 L 129,77 C 141,72 148,65 148,57 C 146,57 143,58 141,58 C 132,58 126,52 126,52 Z" fill="url(#grad-quote-gold)" filter="url(#shadow-cite)"/>

          <!-- Hanging Indent Paper Card (APA / Harvard Reference Structure) -->
          <rect x="180" y="34" width="160" height="54" rx="6" fill="#ffffff" stroke="#fcd34d" stroke-width="1.5" filter="url(#shadow-cite)"/>
          <rect x="194" y="44" width="132" height="5" rx="2.5" fill="#b45309"/>
          <rect x="214" y="55" width="112" height="4" rx="2" fill="#d97706" opacity="0.8"/>
          <rect x="214" y="65" width="90" height="4" rx="2" fill="#f59e0b" opacity="0.6"/>
          <rect x="214" y="75" width="75" height="3.5" rx="1.75" fill="#fcd34d"/>

          <!-- DOI Citation Graph Nodes in Golden Amber -->
          <line x1="90" y1="120" x2="310" y2="120" stroke="#fcd34d" stroke-width="2"/>
          <circle cx="90" cy="120" r="7" fill="#ffffff" stroke="#b45309" stroke-width="2"/>
          <circle cx="90" cy="120" r="3" fill="#b45309"/>
          <circle cx="160" cy="120" r="7" fill="#ffffff" stroke="#d97706" stroke-width="2"/>
          <circle cx="160" cy="120" r="3.5" fill="#f59e0b"/>
          <circle cx="235" cy="120" r="8" fill="#d97706" stroke="#ffffff" stroke-width="2" filter="url(#shadow-cite)"/>
          <circle cx="310" cy="120" r="7" fill="#ffffff" stroke="#b45309" stroke-width="2"/>
          <circle cx="310" cy="120" r="3" fill="#b45309"/>

          <!-- Live DOI Badge -->
          <rect x="195" y="134" width="80" height="16" rx="4" fill="#b45309"/>
          <text x="235" y="145" font-family="'SF Mono', Menlo, monospace" font-size="7.5" font-weight="700" fill="#ffffff" text-anchor="middle">APA 7th &bull; DOI</text>
        </svg>`;

    case 'integrity101':
      // Botanical Emerald & Jade Mint • Turnitin Integrity Shield + HEC Gauge
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-integ-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f0fdf4"/>
              <stop offset="100%" stop-color="#dcfce7"/>
            </linearGradient>
            <linearGradient id="grad-shield-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#22c55e"/>
              <stop offset="100%" stop-color="#15803d"/>
            </linearGradient>
            <filter id="shadow-integ" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#15803d" flood-opacity="0.18"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-integ-bg)"/>

          <!-- Botanical Construction Ring -->
          <circle cx="200" cy="80" r="66" fill="none" stroke="#86efac" stroke-width="1" stroke-dasharray="4,4" opacity="0.7"/>

          <!-- Academic Integrity Shield -->
          <path d="M 200,24 L 252,45 C 252,90 228,122 200,138 C 172,122 148,90 148,45 Z" fill="url(#grad-shield-green)" stroke="#166534" stroke-width="2" filter="url(#shadow-integ)"/>
          <path d="M 200,32 L 244,50 C 244,85 224,113 200,127 C 176,113 156,85 156,50 Z" fill="#ffffff" opacity="0.95"/>

          <!-- HEC Pakistan Similarity Gauge (Target &lt; 19%) -->
          <circle cx="200" cy="78" r="26" fill="#f0fdf4" stroke="#86efac" stroke-width="1.5"/>
          <path d="M 180,82 A 20 20 0 0 1 216,70" fill="none" stroke="#16a34a" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="200" y1="78" x2="214" y2="68" stroke="#15803d" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="200" cy="78" r="3.5" fill="#15803d"/>

          <!-- Originality Seal Pill -->
          <rect x="156" y="94" width="88" height="18" rx="9" fill="#15803d"/>
          <text x="200" y="106" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">HEC &lt; 19% PASS</text>

          <!-- Side Matched vs Paraphrased Cards -->
          <rect x="68" y="52" width="60" height="56" rx="6" fill="#ffffff" stroke="#86efac" stroke-width="1.5" filter="url(#shadow-integ)"/>
          <line x1="76" y1="64" x2="118" y2="64" stroke="#dc2626" stroke-width="2.5"/>
          <line x1="76" y1="74" x2="110" y2="74" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="76" y1="84" x2="114" y2="84" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="76" y1="94" x2="102" y2="94" stroke="#cbd5e1" stroke-width="1.5"/>

          <rect x="272" y="52" width="60" height="56" rx="6" fill="#ffffff" stroke="#86efac" stroke-width="1.5" filter="url(#shadow-integ)"/>
          <line x1="280" y1="64" x2="322" y2="64" stroke="#16a34a" stroke-width="2.5"/>
          <line x1="280" y1="74" x2="318" y2="74" stroke="#16a34a" stroke-width="1.5" opacity="0.6"/>
          <line x1="280" y1="84" x2="312" y2="84" stroke="#94a3b8" stroke-width="1.5"/>
          <line x1="280" y1="94" x2="320" y2="94" stroke="#cbd5e1" stroke-width="1.5"/>
        </svg>`;

    case 'edit101':
      // Rose Peach & Ruby Coral • Three-Pass Proofreading Architecture & Pilcrow Caret
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-edit-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff1f2"/>
              <stop offset="100%" stop-color="#ffe4e6"/>
            </linearGradient>
            <linearGradient id="grad-edit-ruby" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f43f5e"/>
              <stop offset="100%" stop-color="#e11d48"/>
            </linearGradient>
            <filter id="shadow-edit" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#e11d48" flood-opacity="0.16"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-edit-bg)"/>

          <!-- Manuscript Parchment Card -->
          <rect x="80" y="22" width="240" height="116" rx="8" fill="#ffffff" stroke="#fecdd3" stroke-width="1.5" filter="url(#shadow-edit)"/>
          <line x1="80" y1="46" x2="320" y2="46" stroke="#ffe4e6" stroke-width="1"/>

          <!-- Section Heading -->
          <rect x="100" y="32" width="85" height="6" rx="3" fill="#be123c"/>

          <!-- Text Lines with Proofreading Markups -->
          <line x1="100" y1="58" x2="275" y2="58" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
          
          <!-- Line 2: Redline Strike and Replacement -->
          <line x1="100" y1="72" x2="220" y2="72" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
          <line x1="226" y1="72" x2="275" y2="72" stroke="#e11d48" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="230" y1="66" x2="271" y2="78" stroke="#e11d48" stroke-width="2"/>
          
          <!-- Proofreader's Pilcrow & Insertion Caret in Ruby Coral -->
          <text x="94" y="73" font-family="'Newsreader', Georgia, serif" font-size="14" font-weight="700" fill="#e11d48" text-anchor="end">&para;</text>
          <path d="M 175,92 L 180,85 L 185,92" fill="none" stroke="#e11d48" stroke-width="2"/>
          <text x="180" y="80" font-family="'SF Mono', Menlo, monospace" font-size="7.5" font-weight="700" fill="#e11d48" text-anchor="middle">cohesive</text>

          <line x1="100" y1="88" x2="290" y2="88" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>
          <line x1="100" y1="104" x2="240" y2="104" stroke="#64748b" stroke-width="2" stroke-linecap="round"/>

          <!-- Margin Quality Stamp -->
          <rect x="238" y="108" width="72" height="18" rx="4" fill="url(#grad-edit-ruby)"/>
          <text x="274" y="120" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">3-PASS READY</text>
        </svg>`;

    case 'lit-search':
      // Cerulean Sky & Ocean Cobalt • Boolean Search Venn + PRISMA Flow
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-lit-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f0f9ff"/>
              <stop offset="100%" stop-color="#e0f2fe"/>
            </linearGradient>
            <linearGradient id="grad-lit-blue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0369a1"/>
            </linearGradient>
            <filter id="shadow-lit" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#0284c7" flood-opacity="0.18"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-lit-bg)"/>

          <!-- Intersecting Boolean Venn Rings -->
          <circle cx="100" cy="80" r="42" fill="#bae6fd" stroke="#0284c7" stroke-width="2" opacity="0.6"/>
          <circle cx="145" cy="80" r="42" fill="#7dd3fc" stroke="#0369a1" stroke-width="2" opacity="0.6"/>
          <text x="122" y="84" font-family="'SF Mono', Menlo, monospace" font-size="11" font-weight="800" fill="#0369a1" text-anchor="middle">AND</text>

          <!-- PRISMA Flow Blocks on Right -->
          <!-- Step 1: Identification -->
          <rect x="220" y="28" width="130" height="26" rx="6" fill="#ffffff" stroke="#bae6fd" stroke-width="1.5" filter="url(#shadow-lit)"/>
          <text x="285" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#0369a1" text-anchor="middle">Identification (n = 1,240)</text>

          <line x1="285" y1="54" x2="285" y2="68" stroke="#0284c7" stroke-width="2"/>
          <polygon points="282,68 285,73 288,68" fill="#0284c7"/>

          <!-- Step 2: Screening -->
          <rect x="220" y="72" width="130" height="26" rx="6" fill="#ffffff" stroke="#7dd3fc" stroke-width="1.5" filter="url(#shadow-lit)"/>
          <text x="285" y="88" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="700" fill="#0284c7" text-anchor="middle">Screening (n = 280)</text>

          <line x1="285" y1="98" x2="285" y2="112" stroke="#0284c7" stroke-width="2"/>
          <polygon points="282,112 285,117 288,112" fill="#0284c7"/>

          <!-- Step 3: Synthesis / Included -->
          <rect x="220" y="116" width="130" height="26" rx="6" fill="url(#grad-lit-blue)" stroke="#0369a1" stroke-width="1.5" filter="url(#shadow-lit)"/>
          <text x="285" y="132" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle">Included Studies (n = 42)</text>
        </svg>`;

    case 'sample-size':
      // Royal Lavender & Amethyst Violet • Gaussian Distribution Bell Curve + G*Power
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-sample-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#faf5ff"/>
              <stop offset="100%" stop-color="#f3e8ff"/>
            </linearGradient>
            <linearGradient id="grad-sample-violet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#9333ea"/>
              <stop offset="100%" stop-color="#7c3aed"/>
            </linearGradient>
            <filter id="shadow-sample" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#7c3aed" flood-opacity="0.18"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-sample-bg)"/>

          <!-- Coordinate Axes -->
          <line x1="50" y1="130" x2="350" y2="130" stroke="#7e22ce" stroke-width="1.75"/>
          <line x1="200" y1="20" x2="200" y2="135" stroke="#d8b4fe" stroke-width="1" stroke-dasharray="3,3"/>

          <!-- Normal Bell Curve H0 -->
          <path d="M 60,130 Q 140,130 170,80 Q 200,24 230,80 Q 260,130 340,130" fill="none" stroke="#7c3aed" stroke-width="2.5"/>

          <!-- Shaded Critical Rejection Region (Alpha = .05) in Glowing Violet -->
          <path d="M 245,98 Q 260,130 340,130 L 245,130 Z" fill="#c084fc" opacity="0.65"/>

          <!-- Critical Value Threshold Line -->
          <line x1="245" y1="36" x2="245" y2="130" stroke="#9333ea" stroke-width="2" stroke-dasharray="4,2"/>

          <!-- Labels & Power Metrics -->
          <rect x="220" y="24" width="60" height="18" rx="4" fill="#7c3aed"/>
          <text x="250" y="36" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" fill="#ffffff" text-anchor="middle">&alpha; = 0.05</text>

          <rect x="100" y="70" width="105" height="20" rx="4" fill="#ffffff" stroke="#d8b4fe" stroke-width="1" filter="url(#shadow-sample)"/>
          <text x="152" y="83" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" fill="#6b21a8" text-anchor="middle">Power (1-&beta;) = 0.80</text>

          <circle cx="200" cy="28" r="4.5" fill="#7c3aed" stroke="#ffffff" stroke-width="1.5"/>
          <text x="200" y="146" font-family="'SF Mono', Menlo, monospace" font-size="8.5" font-weight="700" fill="#6b21a8" text-anchor="middle">G*Power 3.1 &bull; n &ge; 384</text>
        </svg>`;

    case 'spss':
    case 'spss101':
      // Tangerine Sunrise & Warm Terracotta • Linear Regression Slope & Residual Halos
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-spss-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff7ed"/>
              <stop offset="100%" stop-color="#ffedd5"/>
            </linearGradient>
            <linearGradient id="grad-spss-line" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ea580c"/>
              <stop offset="100%" stop-color="#c2410c"/>
            </linearGradient>
            <filter id="shadow-spss" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#ea580c" flood-opacity="0.2"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-spss-bg)"/>

          <!-- Graph Grid -->
          <line x1="80" y1="130" x2="330" y2="130" stroke="#9a3412" stroke-width="1.75"/>
          <line x1="80" y1="25" x2="80" y2="130" stroke="#9a3412" stroke-width="1.75"/>
          <line x1="80" y1="60" x2="330" y2="60" stroke="#fed7aa" stroke-width="1" stroke-dasharray="3,3"/>
          <line x1="80" y1="95" x2="330" y2="95" stroke="#fed7aa" stroke-width="1" stroke-dasharray="3,3"/>

          <!-- Fitted Regression Slope in Vivid Tangerine -->
          <line x1="90" y1="120" x2="310" y2="35" stroke="url(#grad-spss-line)" stroke-width="2.75" stroke-linecap="round"/>

          <!-- Scatter Points with Glowing Halos -->
          <circle cx="110" cy="112" r="4" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="135" cy="102" r="4" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="160" cy="85" r="4" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="190" cy="82" r="6" fill="#c2410c" stroke="#ffffff" stroke-width="2" filter="url(#shadow-spss)"/>
          <circle cx="220" cy="65" r="4" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="250" cy="50" r="4" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>
          <circle cx="280" cy="42" r="4" fill="#ea580c" stroke="#ffffff" stroke-width="1.5"/>

          <!-- Residual Error Bar -->
          <line x1="190" y1="82" x2="190" y2="78" stroke="#7c2d12" stroke-width="1.75" stroke-dasharray="2,1"/>

          <!-- Statistical Model Summary Tag -->
          <rect x="220" y="98" width="115" height="24" rx="6" fill="#ffffff" stroke="#fdba74" stroke-width="1.5" filter="url(#shadow-spss)"/>
          <text x="277" y="113" font-family="'SF Mono', Menlo, monospace" font-size="8.5" font-weight="800" fill="#9a3412" text-anchor="middle">R² = .784, p &lt; .001</text>
        </svg>`;

    case 'smartpls':
      // Topaz Gold & Warm Canary • PLS-SEM Latent Constructs & Path Coefficients
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-pls-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fefce8"/>
              <stop offset="100%" stop-color="#fef08a"/>
            </linearGradient>
            <linearGradient id="grad-pls-node" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#d97706"/>
            </linearGradient>
            <filter id="shadow-pls" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#d97706" flood-opacity="0.2"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-pls-bg)"/>

          <!-- Latent Construct 1 (Independent Variable) -->
          <circle cx="95" cy="80" r="30" fill="#ffffff" stroke="#ca8a04" stroke-width="2" filter="url(#shadow-pls)"/>
          <text x="95" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="800" fill="#854d0e" text-anchor="middle">IV (&xi;₁)</text>

          <!-- Outer Model Indicators -->
          <rect x="36" y="42" width="24" height="16" rx="3" fill="#ffffff" stroke="#ca8a04" stroke-width="1"/>
          <rect x="36" y="72" width="24" height="16" rx="3" fill="#ffffff" stroke="#ca8a04" stroke-width="1"/>
          <rect x="36" y="102" width="24" height="16" rx="3" fill="#ffffff" stroke="#ca8a04" stroke-width="1"/>
          <line x1="60" y1="50" x2="72" y2="65" stroke="#ca8a04" stroke-width="1"/>
          <line x1="60" y1="80" x2="65" y2="80" stroke="#ca8a04" stroke-width="1"/>
          <line x1="60" y1="110" x2="72" y2="95" stroke="#ca8a04" stroke-width="1"/>

          <!-- Path Arrow IV -> Mediator -->
          <line x1="125" y1="80" x2="175" y2="80" stroke="#b45309" stroke-width="2.5"/>
          <polygon points="175,76 182,80 175,84" fill="#b45309"/>
          <text x="150" y="72" font-family="'SF Mono', monospace" font-size="8.5" font-weight="800" fill="#b45309" text-anchor="middle">&beta; = .48**</text>

          <!-- Latent Construct 2 (Mediator in Radiant Gold) -->
          <circle cx="212" cy="80" r="30" fill="url(#grad-pls-node)" stroke="#b45309" stroke-width="2.5" filter="url(#shadow-pls)"/>
          <text x="212" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="800" fill="#ffffff" text-anchor="middle">MED (&eta;₁)</text>

          <!-- Path Arrow Mediator -> DV -->
          <line x1="242" y1="80" x2="292" y2="80" stroke="#b45309" stroke-width="2.5"/>
          <polygon points="292,76 299,80 292,84" fill="#b45309"/>
          <text x="267" y="72" font-family="'SF Mono', monospace" font-size="8.5" font-weight="800" fill="#b45309" text-anchor="middle">&beta; = .62***</text>

          <!-- Latent Construct 3 (Dependent Variable) -->
          <circle cx="330" cy="80" r="30" fill="#ffffff" stroke="#ca8a04" stroke-width="2" filter="url(#shadow-pls)"/>
          <text x="330" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="10.5" font-weight="800" fill="#854d0e" text-anchor="middle">DV (&eta;₂)</text>

          <!-- Direct Effect Arc -->
          <path d="M 112,54 Q 212,18 312,54" fill="none" stroke="#ca8a04" stroke-width="1.5" stroke-dasharray="3,3"/>
          <text x="212" y="28" font-family="'SF Mono', monospace" font-size="7.5" font-weight="700" fill="#854d0e" text-anchor="middle">Direct Path: &beta; = .12 (ns)</text>
        </svg>`;

    case 'viva':
      // Royal Evergreen & Imperial Laurel Gold • Academic Rostrum + Defense Seal
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-viva-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ecfdf5"/>
              <stop offset="100%" stop-color="#d1fae5"/>
            </linearGradient>
            <linearGradient id="grad-viva-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f59e0b"/>
              <stop offset="100%" stop-color="#d97706"/>
            </linearGradient>
            <filter id="shadow-viva" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#059669" flood-opacity="0.2"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-viva-bg)"/>

          <!-- Presentation Spotlight Beams -->
          <polygon points="120,80 290,32 290,128" fill="#a7f3d0" opacity="0.45"/>

          <!-- Candidate Speaker Rostrum -->
          <polygon points="95,64 135,64 128,126 102,126" fill="#ffffff" stroke="#047857" stroke-width="2" filter="url(#shadow-viva)"/>
          <rect x="90" y="58" width="50" height="8" rx="3" fill="#047857"/>
          <line x1="115" y1="58" x2="115" y2="44" stroke="#065f46" stroke-width="2"/>
          <circle cx="115" cy="42" r="3.5" fill="#f59e0b"/>

          <!-- Examination Committee Triad -->
          <circle cx="280" cy="45" r="16" fill="#ffffff" stroke="#047857" stroke-width="1.75" filter="url(#shadow-viva)"/>
          <text x="280" y="49" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#065f46" text-anchor="middle">EXT</text>

          <circle cx="300" cy="80" r="17" fill="#047857" stroke="#ffffff" stroke-width="2" filter="url(#shadow-viva)"/>
          <text x="300" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle">CHAIR</text>

          <circle cx="280" cy="115" r="16" fill="#ffffff" stroke="#047857" stroke-width="1.75" filter="url(#shadow-viva)"/>
          <text x="280" y="119" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#065f46" text-anchor="middle">INT</text>

          <!-- Golden Commendation Seal & Ribbon -->
          <circle cx="195" cy="80" r="20" fill="url(#grad-viva-gold)" stroke="#ffffff" stroke-width="2" filter="url(#shadow-viva)"/>
          <circle cx="195" cy="80" r="16" fill="none" stroke="#fef3c7" stroke-width="1" stroke-dasharray="2,2"/>
          <text x="195" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="800" fill="#ffffff" text-anchor="middle">&#10003;</text>
          
          <rect x="155" y="106" width="80" height="18" rx="9" fill="#047857"/>
          <text x="195" y="118" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="0.5">VIVA VOCE</text>
        </svg>`;

    case 'qualitative':
      // Mauve & Coral Sunset • Thematic Analysis & Inductive Coding Hierarchy
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-qual-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#faf5ff"/>
              <stop offset="100%" stop-color="#fce7f3"/>
            </linearGradient>
            <linearGradient id="grad-qual-theme" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#c026d3"/>
              <stop offset="100%" stop-color="#db2777"/>
            </linearGradient>
            <filter id="shadow-qual" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#c026d3" flood-opacity="0.18"/>
            </filter>
          </defs>
          <rect width="400" height="160" fill="url(#grad-qual-bg)"/>

          <!-- Quotes Nodes (Left) -->
          <circle cx="75" cy="45" r="12" fill="#ffffff" stroke="#c026d3" stroke-width="1.5" filter="url(#shadow-qual)"/>
          <text x="75" y="49" font-family="'SF Mono', monospace" font-size="8.5" font-weight="800" fill="#a21caf" text-anchor="middle">Q1</text>
          
          <circle cx="75" cy="80" r="12" fill="#ffffff" stroke="#c026d3" stroke-width="1.5" filter="url(#shadow-qual)"/>
          <text x="75" y="84" font-family="'SF Mono', monospace" font-size="8.5" font-weight="800" fill="#a21caf" text-anchor="middle">Q2</text>
          
          <circle cx="75" cy="115" r="12" fill="#ffffff" stroke="#c026d3" stroke-width="1.5" filter="url(#shadow-qual)"/>
          <text x="75" y="119" font-family="'SF Mono', monospace" font-size="8.5" font-weight="800" fill="#a21caf" text-anchor="middle">Q3</text>

          <!-- Initial Codes (Center) -->
          <line x1="87" y1="45" x2="155" y2="60" stroke="#f0abfc" stroke-width="1.5"/>
          <line x1="87" y1="80" x2="155" y2="60" stroke="#f0abfc" stroke-width="1.5"/>
          <line x1="87" y1="115" x2="155" y2="100" stroke="#f0abfc" stroke-width="1.5"/>

          <rect x="155" y="48" width="85" height="24" rx="5" fill="#ffffff" stroke="#e879f9" stroke-width="1.5" filter="url(#shadow-qual)"/>
          <text x="197" y="63" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" fill="#86198f" text-anchor="middle">Code: Barrier</text>

          <rect x="155" y="88" width="85" height="24" rx="5" fill="#ffffff" stroke="#e879f9" stroke-width="1.5" filter="url(#shadow-qual)"/>
          <text x="197" y="103" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="800" fill="#86198f" text-anchor="middle">Code: Strategy</text>

          <!-- Overarching Global Theme (Right) -->
          <line x1="240" y1="60" x2="280" y2="80" stroke="#c026d3" stroke-width="2"/>
          <line x1="240" y1="100" x2="280" y2="80" stroke="#c026d3" stroke-width="2"/>

          <rect x="280" y="58" width="95" height="44" rx="8" fill="url(#grad-qual-theme)" stroke="#86198f" stroke-width="1.5" filter="url(#shadow-qual)"/>
          <text x="327" y="76" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="800" fill="#ffffff" text-anchor="middle">CORE THEME</text>
          <text x="327" y="90" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="600" fill="#fdf4ff" text-anchor="middle">Systemic Friction</text>
        </svg>`;

    default:
      // Fallback Refined Aesthetic Vignette
      return `
        <svg viewBox="0 0 400 160" width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad-def-bg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fff8f3"/>
              <stop offset="100%" stop-color="#fed7aa"/>
            </linearGradient>
          </defs>
          <rect width="400" height="160" fill="url(#grad-def-bg)"/>
          <circle cx="200" cy="80" r="50" fill="none" stroke="#ea580c" stroke-width="1.75"/>
          <circle cx="200" cy="80" r="32" fill="none" stroke="#9a3412" stroke-width="1.25" stroke-dasharray="4,4"/>
          <text x="200" y="86" font-family="'Newsreader', Georgia, serif" font-size="19" font-weight="500" fill="#7c2d12" text-anchor="middle">${courseId.toUpperCase()}</text>
        </svg>`;
  }
}
