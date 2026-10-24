import os

DEST_DIR = r"C:\Users\Huzaifa Mahi\quick-services-site\academy\assets\images"
os.makedirs(DEST_DIR, exist_ok=True)

# Common SVG wrapper with chamfered octagon shape and inner styling
def make_badge(filename, title, inner_svg):
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%" aria-label="{title}" role="img">
  <defs>
    <filter id="soft-shadow" x="-8%" y="-8%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#102B4E" flood-opacity="0.06"/>
    </filter>
    <linearGradient id="badge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCFAF7"/>
      <stop offset="100%" stop-color="#F5EFE6"/>
    </linearGradient>
  </defs>

  <!-- Outer Octagon Container -->
  <polygon points="60,12 140,12 188,60 188,140 140,188 60,188 12,140 12,60" 
           fill="url(#badge-grad)" 
           stroke="#E2D7CC" 
           stroke-width="2" 
           stroke-linejoin="round"
           filter="url(#soft-shadow)"/>

  <!-- Inner Hairline Octagon Accent -->
  <polygon points="63,20 137,20 180,63 180,137 137,180 63,180 20,137 20,63" 
           fill="none" 
           stroke="#EADECF" 
           stroke-width="1" 
           stroke-dasharray="3 3"/>

  <!-- Inner Artwork -->
  <g transform="translate(0, 0)">
{inner_svg}
  </g>
</svg>'''
    filepath = os.path.join(DEST_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"Generated {filename}")

# 1. Master Hero Emblem: Laurel wreath, open scholarly book, precision quill, graduation cap node
hero_svg = '''    <!-- Laurel Wreath Leaves (Left) -->
    <path d="M 52,90 C 44,110 54,138 78,154 C 68,142 66,120 72,106" fill="none" stroke="#637083" stroke-width="2" stroke-linecap="round"/>
    <path d="M 50,96 C 40,94 36,86 42,80 C 48,82 52,88 50,96 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="1.5"/>
    <path d="M 45,114 C 36,114 32,106 38,100 C 44,102 47,108 45,114 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="1.5"/>
    <path d="M 52,132 C 44,136 40,128 44,120 C 50,120 54,126 52,132 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="1.5"/>
    <path d="M 64,148 C 58,154 52,148 54,140 C 60,138 64,142 64,148 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="1.5"/>

    <!-- Laurel Wreath Leaves (Right) -->
    <path d="M 148,90 C 156,110 146,138 122,154 C 132,142 134,120 128,106" fill="none" stroke="#637083" stroke-width="2" stroke-linecap="round"/>
    <path d="M 150,96 C 160,94 164,86 158,80 C 152,82 148,88 150,96 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="1.5"/>
    <path d="M 155,114 C 164,114 168,106 162,100 C 156,102 153,108 155,114 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="1.5"/>
    <path d="M 148,132 C 156,136 160,128 156,120 C 150,120 146,126 148,132 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="1.5"/>
    <path d="M 136,148 C 142,154 148,148 146,140 C 140,138 136,142 136,148 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="1.5"/>

    <!-- Open Academic Book -->
    <path d="M 100,104 C 88,96 72,96 60,100 L 60,136 C 74,132 88,132 100,140 C 112,132 126,132 140,136 L 140,100 C 128,96 112,96 100,104 Z" 
          fill="#FAF8F5" stroke="#102B4E" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="100" y1="104" x2="100" y2="140" stroke="#102B4E" stroke-width="2"/>
    <line x1="68" y1="110" x2="92" y2="108" stroke="#B95335" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="68" y1="118" x2="90" y2="116" stroke="#637083" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="68" y1="126" x2="86" y2="124" stroke="#637083" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="132" y1="110" x2="108" y2="108" stroke="#B95335" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="132" y1="118" x2="110" y2="116" stroke="#637083" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="132" y1="126" x2="114" y2="124" stroke="#637083" stroke-width="1.5" stroke-linecap="round"/>

    <!-- Mortarboard (Top Center) -->
    <polygon points="100,52 136,66 100,80 64,66" fill="#102B4E" stroke="#102B4E" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M 80,73 L 80,84 C 80,90 120,90 120,84 L 120,73" fill="none" stroke="#102B4E" stroke-width="2"/>
    <path d="M 126,70 L 132,84 L 130,94" fill="none" stroke="#B95335" stroke-width="2" stroke-linecap="round"/>
    <circle cx="130" cy="95" r="2" fill="#B95335"/>

    <!-- Star / Accent Sparkles -->
    <path d="M 100,34 L 102,42 L 110,44 L 102,46 L 100,54 L 98,46 L 90,44 L 98,42 Z" fill="#B95335"/>
    <circle cx="68" cy="46" r="1.5" fill="#B95335"/>
    <circle cx="132" cy="46" r="1.5" fill="#B95335"/>'''

# 2. Thesis 101: Funnel + Compass
thesis_svg = '''    <!-- Funnel / Topic Narrowing -->
    <path d="M 64,52 L 136,52 L 112,86 L 112,126 L 88,126 L 88,86 Z" 
          fill="#FAF8F5" stroke="#102B4E" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="72" y1="62" x2="128" y2="62" stroke="#B95335" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 3"/>
    <line x1="82" y1="74" x2="118" y2="74" stroke="#B95335" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 3"/>
    
    <!-- Compass Rose at Base -->
    <circle cx="100" cy="142" r="26" fill="#FAF5F0" stroke="#102B4E" stroke-width="2"/>
    <circle cx="100" cy="142" r="2" fill="#102B4E"/>
    <!-- Compass Needle -->
    <polygon points="100,122 104,142 96,142" fill="#B95335"/>
    <polygon points="100,162 104,142 96,142" fill="#102B4E"/>
    <line x1="100" y1="120" x2="100" y2="164" stroke="#102B4E" stroke-width="1.5"/>
    <line x1="78" y1="142" x2="122" y2="142" stroke="#102B4E" stroke-width="1.5"/>
    <!-- Cardinal Directions -->
    <text x="100" y="118" font-family="'Plus Jakarta Sans', sans-serif" font-size="7" font-weight="bold" fill="#B95335" text-anchor="middle">N</text>
    <text x="127" y="144" font-family="'Plus Jakarta Sans', sans-serif" font-size="6" fill="#637083" text-anchor="middle">E</text>
    <text x="73" y="144" font-family="'Plus Jakarta Sans', sans-serif" font-size="6" fill="#637083" text-anchor="middle">W</text>
    <text x="100" y="171" font-family="'Plus Jakarta Sans', sans-serif" font-size="6" fill="#637083" text-anchor="middle">S</text>'''

# 3. Cite 101: Citation Glyph + Linked Network
cite_svg = '''    <!-- Parenthetical Quotation Marks -->
    <g transform="translate(62, 54)">
      <path d="M 12,24 C 6,24 2,18 2,12 C 2,4 10,0 18,0 L 18,8 C 14,8 10,10 10,14 C 12,14 14,14 16,16 C 18,18 18,22 18,24 Z" fill="#B95335"/>
      <path d="M 32,24 C 26,24 22,18 22,12 C 22,4 30,0 38,0 L 38,8 C 34,8 30,10 30,14 C 32,14 34,14 36,16 C 38,18 38,22 38,24 Z" fill="#B95335"/>
    </g>

    <!-- Scholarly Document Page -->
    <rect x="70" y="86" width="60" height="76" rx="4" fill="#FAF8F5" stroke="#102B4E" stroke-width="2.5"/>
    <!-- Page Corner Fold -->
    <polygon points="116,86 130,100 116,100" fill="#E2D7CC" stroke="#102B4E" stroke-width="1.5"/>
    <!-- Text Lines -->
    <line x1="80" y1="102" x2="110" y2="102" stroke="#637083" stroke-width="2" stroke-linecap="round"/>
    <line x1="80" y1="112" x2="120" y2="112" stroke="#637083" stroke-width="2" stroke-linecap="round"/>
    <line x1="80" y1="122" x2="108" y2="122" stroke="#B95335" stroke-width="2" stroke-linecap="round"/>
    <line x1="80" y1="132" x2="116" y2="132" stroke="#637083" stroke-width="2" stroke-linecap="round"/>
    <line x1="80" y1="142" x2="100" y2="142" stroke="#637083" stroke-width="2" stroke-linecap="round"/>

    <!-- Reference Link Nodes -->
    <circle cx="140" cy="72" r="8" fill="#FAF5F0" stroke="#102B4E" stroke-width="2"/>
    <text x="140" y="75" font-family="'Newsreader', Georgia, serif" font-size="9" font-style="italic" font-weight="bold" fill="#102B4E" text-anchor="middle">p</text>
    <path d="M 126,90 L 134,78" fill="none" stroke="#B95335" stroke-width="1.5" stroke-dasharray="2 2"/>'''

# 4. Integrity 101: Scale of Justice + Shield
integrity_svg = '''    <!-- Integrity Verification Shield -->
    <path d="M 100,42 L 144,56 C 144,102 118,136 100,148 C 82,136 56,102 56,56 Z" 
          fill="#FAF8F5" stroke="#102B4E" stroke-width="2.5" stroke-linejoin="round"/>
    
    <!-- Balance Scales inside Shield -->
    <!-- Center Beam -->
    <line x1="100" y1="62" x2="100" y2="118" stroke="#102B4E" stroke-width="2.5" stroke-linecap="round"/>
    <polygon points="94,118 106,118 102,124 98,124" fill="#102B4E"/>
    <!-- Crossbar -->
    <line x1="74" y1="72" x2="126" y2="72" stroke="#102B4E" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="100" cy="72" r="3" fill="#B95335"/>
    
    <!-- Left Pan -->
    <line x1="76" y1="72" x2="68" y2="92" stroke="#637083" stroke-width="1.5"/>
    <line x1="76" y1="72" x2="84" y2="92" stroke="#637083" stroke-width="1.5"/>
    <path d="M 64,92 C 64,100 88,100 88,92 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="2"/>

    <!-- Right Pan -->
    <line x1="124" y1="72" x2="116" y2="92" stroke="#637083" stroke-width="1.5"/>
    <line x1="124" y1="72" x2="132" y2="92" stroke="#637083" stroke-width="1.5"/>
    <path d="M 112,92 C 112,100 136,100 136,92 Z" fill="#DDE8DF" stroke="#102B4E" stroke-width="2"/>

    <!-- Verified Checkmark Badge at Bottom Right -->
    <circle cx="134" cy="134" r="14" fill="#FAF5F0" stroke="#102B4E" stroke-width="2"/>
    <path d="M 127,134 L 132,139 L 142,128" fill="none" stroke="#B95335" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'''

# 5. Edit 101: Fountain Pen Nib + Precision Lines
edit_svg = '''    <!-- Fountain Pen Nib -->
    <g transform="translate(100, 84) rotate(-45) translate(-100, -84)">
      <!-- Nib Body -->
      <path d="M 88,50 L 112,50 L 114,88 L 100,126 L 86,88 Z" fill="#FAF8F5" stroke="#102B4E" stroke-width="2.5" stroke-linejoin="round"/>
      <!-- Breather Hole and Slit -->
      <circle cx="100" cy="88" r="3.5" fill="#B95335"/>
      <line x1="100" y1="92" x2="100" y2="126" stroke="#102B4E" stroke-width="2"/>
      <path d="M 94,62 L 106,62" stroke="#637083" stroke-width="1.5"/>
      <!-- Barrel Collar -->
      <rect x="86" y="38" width="28" height="12" rx="2" fill="#102B4E" stroke="#102B4E"/>
    </g>

    <!-- Guided Editorial Baseline Waves -->
    <path d="M 44,142 C 60,134 76,148 94,140 C 112,132 130,146 156,138" fill="none" stroke="#637083" stroke-width="2" stroke-linecap="round"/>
    <path d="M 54,156 C 70,148 86,162 104,154 C 122,146 140,160 152,154" fill="none" stroke="#B95335" stroke-width="1.5" stroke-dasharray="3 3" stroke-linecap="round"/>
    
    <!-- Editorial Caret Proofing Mark -->
    <path d="M 124,128 L 130,118 L 136,128" fill="none" stroke="#B95335" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'''

# 6. Lit Search: PRISMA Prism + Search Stream
lit_svg = '''    <!-- Optical Prism -->
    <polygon points="100,48 148,126 52,126" fill="#FAF8F5" stroke="#102B4E" stroke-width="2.5" stroke-linejoin="round"/>
    
    <!-- Incoming Research Query Beam -->
    <line x1="30" y1="76" x2="80" y2="92" stroke="#102B4E" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="30" cy="76" r="3" fill="#102B4E"/>

    <!-- Refracted PRISMA Streams -->
    <line x1="120" y1="92" x2="168" y2="68" stroke="#B95335" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="124" y1="98" x2="172" y2="88" stroke="#102B4E" stroke-width="2" stroke-linecap="round"/>
    <line x1="126" y1="106" x2="170" y2="108" stroke="#637083" stroke-width="2" stroke-linecap="round"/>
    <line x1="122" y1="114" x2="166" y2="128" stroke="#DDE8DF" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Database Cylinder Discs at Base -->
    <g transform="translate(68, 138)">
      <ellipse cx="32" cy="6" rx="28" ry="7" fill="#FAF5F0" stroke="#102B4E" stroke-width="2"/>
      <path d="M 4,6 L 4,14 C 4,18 60,18 60,14 L 60,6" fill="none" stroke="#102B4E" stroke-width="2"/>
      <path d="M 4,14 L 4,22 C 4,26 60,26 60,22 L 60,14" fill="none" stroke="#102B4E" stroke-width="2"/>
      <line x1="16" y1="14" x2="48" y2="14" stroke="#B95335" stroke-width="1.5"/>
    </g>'''

# 7. Sample Size: Gaussian Bell Curve + Critical Region
sample_svg = '''    <!-- Coordinates Axes -->
    <line x1="42" y1="146" x2="158" y2="146" stroke="#102B4E" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="100" y1="46" x2="100" y2="150" stroke="#637083" stroke-width="1.5" stroke-dasharray="3 3"/>

    <!-- Normal Distribution Gaussian Bell Curve -->
    <path d="M 46,144 C 64,144 76,134 86,96 C 94,62 106,62 114,96 C 124,134 136,144 154,144" 
          fill="none" stroke="#102B4E" stroke-width="3" stroke-linecap="round"/>

    <!-- Shaded Rejection Region (Alpha / Power) -->
    <path d="M 126,112 C 132,128 140,140 154,144 L 126,144 Z" fill="#B95335" opacity="0.35"/>
    <line x1="126" y1="110" x2="126" y2="146" stroke="#B95335" stroke-width="2"/>

    <!-- Target / Crosshair Overlay (N=Size) -->
    <circle cx="100" cy="74" r="14" fill="none" stroke="#B95335" stroke-width="1.5" stroke-dasharray="2 2"/>
    <circle cx="100" cy="74" r="2" fill="#B95335"/>
    
    <!-- Math Labels -->
    <text x="134" y="104" font-family="'Newsreader', Georgia, serif" font-size="12" font-style="italic" fill="#B95335" font-weight="bold">α</text>
    <text x="82" y="72" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" fill="#102B4E">1 - β</text>
    <text x="100" y="162" font-family="'Newsreader', Georgia, serif" font-size="11" font-style="italic" font-weight="bold" fill="#102B4E" text-anchor="middle">G*Power N</text>'''

# 8. SPSS 101: Tabular Matrix Grid + Regression Fit
spss_svg = '''    <!-- Tabular Spreadsheet Matrix Card -->
    <rect x="46" y="52" width="108" height="96" rx="4" fill="#FAF8F5" stroke="#102B4E" stroke-width="2.5"/>
    <!-- Header Row -->
    <rect x="46" y="52" width="108" height="20" rx="4" fill="#DDE8DF" stroke="#102B4E" stroke-width="2"/>
    <line x1="46" y1="72" x2="154" y2="72" stroke="#102B4E" stroke-width="2"/>
    
    <!-- Grid Column Lines -->
    <line x1="82" y1="52" x2="82" y2="148" stroke="#102B4E" stroke-width="1.5"/>
    <line x1="118" y1="52" x2="118" y2="148" stroke="#102B4E" stroke-width="1.5"/>
    
    <!-- Grid Row Lines -->
    <line x1="46" y1="96" x2="154" y2="96" stroke="#E2D7CC" stroke-width="1.5"/>
    <line x1="46" y1="122" x2="154" y2="122" stroke="#E2D7CC" stroke-width="1.5"/>

    <!-- Column Headers -->
    <text x="64" y="66" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="bold" fill="#102B4E" text-anchor="middle">VAR_1</text>
    <text x="100" y="66" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="bold" fill="#102B4E" text-anchor="middle">MEAN</text>
    <text x="136" y="66" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="bold" fill="#B95335" text-anchor="middle">SIG.</text>

    <!-- Regression Trendline Overlay Across Table -->
    <line x1="54" y1="138" x2="146" y2="82" stroke="#B95335" stroke-width="3" stroke-linecap="round"/>
    
    <!-- Scatter Plot Points -->
    <circle cx="62" cy="130" r="3" fill="#102B4E"/>
    <circle cx="86" cy="120" r="3" fill="#102B4E"/>
    <circle cx="106" cy="102" r="3" fill="#102B4E"/>
    <circle cx="122" cy="98" r="3" fill="#102B4E"/>
    <circle cx="138" cy="84" r="3.5" fill="#B95335"/>

    <text x="100" y="164" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="600" fill="#637083" text-anchor="middle">p &lt; .001 ANOVA</text>'''

# 9. SmartPLS: Structural Equation Model
smartpls_svg = '''    <!-- Latent Construct Circles (Exogenous & Endogenous) -->
    <!-- Latent 1 (Left) -->
    <circle cx="68" cy="96" r="22" fill="#FAF8F5" stroke="#102B4E" stroke-width="2.5"/>
    <text x="68" y="100" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" fill="#102B4E" text-anchor="middle">ξ₁</text>

    <!-- Latent 2 (Right) -->
    <circle cx="136" cy="96" r="22" fill="#FAF5F0" stroke="#102B4E" stroke-width="2.5"/>
    <text x="136" y="100" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="bold" fill="#102B4E" text-anchor="middle">η₁</text>

    <!-- Structural Path Arrow (β Coefficient) -->
    <line x1="90" y1="96" x2="114" y2="96" stroke="#B95335" stroke-width="3" stroke-linecap="round"/>
    <polygon points="114,92 122,96 114,100" fill="#B95335"/>
    <text x="103" y="88" font-family="'Newsreader', Georgia, serif" font-size="10" font-style="italic" font-weight="bold" fill="#B95335" text-anchor="middle">β=.68</text>

    <!-- Indicator Blocks (Manifest Variables for Latent 1) -->
    <rect x="36" y="52" width="18" height="12" rx="2" fill="#FAF8F5" stroke="#637083" stroke-width="1.5"/>
    <line x1="50" y1="64" x2="60" y2="78" stroke="#637083" stroke-width="1.5"/>

    <rect x="62" y="44" width="18" height="12" rx="2" fill="#FAF8F5" stroke="#637083" stroke-width="1.5"/>
    <line x1="71" y1="56" x2="70" y2="74" stroke="#637083" stroke-width="1.5"/>

    <!-- Indicator Blocks (Manifest Variables for Latent 2) -->
    <rect x="124" y="44" width="18" height="12" rx="2" fill="#FAF8F5" stroke="#637083" stroke-width="1.5"/>
    <line x1="133" y1="56" x2="134" y2="74" stroke="#637083" stroke-width="1.5"/>

    <rect x="150" y="52" width="18" height="12" rx="2" fill="#FAF8F5" stroke="#637083" stroke-width="1.5"/>
    <line x1="154" y1="64" x2="144" y2="78" stroke="#637083" stroke-width="1.5"/>

    <!-- Model Fit Metric at Bottom -->
    <rect x="62" y="142" width="80" height="20" rx="10" fill="#DDE8DF" stroke="#102B4E" stroke-width="1.5"/>
    <text x="102" y="155" font-family="'Plus Jakarta Sans', sans-serif" font-size="8" font-weight="bold" fill="#102B4E" text-anchor="middle">R² = .742 SRMR &lt; .08</text>'''

# 10. Viva Defense: Academic Lectern & Laurel of Mastery
viva_svg = '''    <!-- Presentation Lectern / Podium -->
    <!-- Base & Pedestal -->
    <polygon points="76,146 124,146 118,88 82,88" fill="#FAF8F5" stroke="#102B4E" stroke-width="2.5" stroke-linejoin="round"/>
    <line x1="70" y1="146" x2="130" y2="146" stroke="#102B4E" stroke-width="3" stroke-linecap="round"/>
    <!-- Top Angled Slant -->
    <polygon points="72,88 128,88 122,76 78,76" fill="#102B4E" stroke="#102B4E" stroke-width="1.5"/>
    
    <!-- Microphones on Lectern -->
    <path d="M 86,76 C 86,64 94,62 96,52" fill="none" stroke="#637083" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="96" cy="50" rx="3" ry="4" fill="#B95335"/>
    
    <path d="M 114,76 C 114,66 106,64 104,54" fill="none" stroke="#637083" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="104" cy="52" rx="3" ry="4" fill="#637083"/>

    <!-- Thesis Manuscript on Lectern -->
    <rect x="88" y="70" width="24" height="12" rx="1" fill="#FAF8F5" stroke="#B95335" stroke-width="1.5" transform="rotate(-5 100 76)"/>

    <!-- Gold Academic Laurel of Defense Success -->
    <path d="M 52,106 C 50,126 62,142 80,152" fill="none" stroke="#B95335" stroke-width="2" stroke-linecap="round"/>
    <path d="M 148,106 C 150,126 138,142 120,152" fill="none" stroke="#B95335" stroke-width="2" stroke-linecap="round"/>
    <circle cx="50" cy="110" r="2.5" fill="#B95335"/>
    <circle cx="54" cy="124" r="2.5" fill="#B95335"/>
    <circle cx="64" cy="138" r="2.5" fill="#B95335"/>
    <circle cx="150" cy="110" r="2.5" fill="#B95335"/>
    <circle cx="146" cy="124" r="2.5" fill="#B95335"/>
    <circle cx="136" cy="138" r="2.5" fill="#B95335"/>
    
    <text x="100" y="122" font-family="'Newsreader', Georgia, serif" font-size="12" font-style="italic" font-weight="bold" fill="#102B4E" text-anchor="middle">VIVA</text>'''

# Generate all
make_badge("hero-academy-emblem.svg", "Quick Academy Master Academic Emblem", hero_svg)
make_badge("badge-thesis101.svg", "Thesis 101 Badge", thesis_svg)
make_badge("badge-cite101.svg", "Citation & Referencing Mastery Badge", cite_svg)
make_badge("badge-integrity101.svg", "Research Integrity Badge", integrity_svg)
make_badge("badge-edit101.svg", "Academic Writing & Proofreading Badge", edit_svg)
make_badge("badge-lit-search.svg", "Literature Review & Search Badge", lit_svg)
make_badge("badge-sample-size.svg", "Sample Size Determination Badge", sample_svg)
make_badge("badge-spss101.svg", "SPSS Quantitative Analysis Badge", spss_svg)
make_badge("badge-smartpls.svg", "SmartPLS Structural Equation Modeling Badge", smartpls_svg)
make_badge("badge-viva.svg", "Viva Voce & Defense Preparation Badge", viva_svg)

print("All 10 Claude Academy badges generated successfully!")
