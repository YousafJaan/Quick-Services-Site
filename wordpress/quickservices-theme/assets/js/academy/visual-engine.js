/**
 * Quick Academy Visual Component Engine
 * Standalone Client-Side Execution for 30 Semantic SVG/HTML Diagrams
 *
 * @package QuickServicesTheme
 * @author M. Yousaf & Quick Services Engineering
 * @version 2.0.0
 */

class QuickVisualEngine {
  constructor(containerId) {
    this.container = typeof containerId === 'string' ? document.getElementById(containerId) : containerId;
  }

  render(kind, data = {}) {
    if (!this.container) return;
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'visual-svg-wrapper';

    switch (kind) {
      case 'pyramid':
        wrapper.innerHTML = this.renderPyramid(data);
        break;
      case 'venn':
        wrapper.innerHTML = this.renderVenn(data);
        break;
      case 'numberLine':
        wrapper.innerHTML = this.renderNumberLine(data);
        break;
      case 'barchart':
        wrapper.innerHTML = this.renderBarChart(data);
        break;
      case 'donut':
        wrapper.innerHTML = this.renderDonut(data);
        break;
      case 'mindmap':
        wrapper.innerHTML = this.renderMindMap(data);
        break;
      case 'table':
        wrapper.innerHTML = this.renderTable(data);
        break;
      case 'anatomy':
        wrapper.innerHTML = this.renderAnatomy(data);
        break;
      case 'timeline':
        wrapper.innerHTML = this.renderTimeline(data);
        break;
      case 'matrix':
        wrapper.innerHTML = this.renderMatrix(data);
        break;
      case 'iconCards':
      case 'keyTermCard':
      default:
        wrapper.innerHTML = this.renderIconCards(data);
        break;
    }

    this.container.appendChild(wrapper);
  }

  // 1. Pyramid (Layered Hierarchy)
  renderPyramid(data) {
    const levels = data.levels || [
      { label: "1. Thesis Defense & Contribution", color: "#16302B" },
      { label: "2. Structural Equation Modeling (PLS-SEM)", color: "#1E4A3F" },
      { label: "3. Measurement Model & Construct Validity", color: "#B8823B" },
      { label: "4. Survey Instrument Reliability (Cronbach's α)", color: "#C89C5D" },
      { label: "5. Data Hygiene, Normality & Outlier Screening", color: "#5A6A80" }
    ];

    let svgBars = '';
    const total = levels.length;
    levels.forEach((lvl, i) => {
      const topWidth = 100 + (i * 60);
      const bottomWidth = 100 + ((i + 1) * 60);
      const y = i * 44;
      const x1 = (400 - topWidth) / 2;
      const x2 = x1 + topWidth;
      const x3 = (400 - bottomWidth) / 2 + bottomWidth;
      const x4 = (400 - bottomWidth) / 2;

      svgBars += `
        <polygon points="${x1},${y} ${x2},${y} ${x3},${y + 40} ${x4},${y + 40}" fill="${lvl.color}" opacity="0.9" stroke="#FAF8F5" stroke-width="2"/>
        <text x="200" y="${y + 25}" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="700" text-anchor="middle">${lvl.label}</text>
      `;
    });

    return `
      <svg viewBox="0 0 400 240" style="width:100%; height:auto;" class="svg-diagram">
        ${svgBars}
      </svg>
    `;
  }

  // 2. Venn Diagram (Intersections)
  renderVenn(data) {
    return `
      <svg viewBox="0 0 400 240" style="width:100%; height:auto;" class="svg-diagram">
        <circle cx="160" cy="120" r="85" fill="#16302B" opacity="0.75" />
        <circle cx="240" cy="120" r="85" fill="#B8823B" opacity="0.75" />
        <text x="120" y="125" fill="#FFFFFF" font-weight="700" font-size="12">Theoretical Frame</text>
        <text x="280" y="125" fill="#FFFFFF" font-weight="700" font-size="12">Empirical Data</text>
        <text x="200" y="125" fill="#FFFFFF" font-weight="800" font-size="11" text-anchor="middle">Novel Gap</text>
      </svg>
    `;
  }

  // 3. NumberLine / Timeline
  renderNumberLine(data) {
    return `
      <svg viewBox="0 0 500 120" style="width:100%; height:auto;" class="svg-diagram">
        <line x1="40" y1="60" x2="460" y2="60" stroke="#0C192E" stroke-width="4" stroke-linecap="round"/>
        <!-- Point 1 -->
        <circle cx="80" cy="60" r="12" fill="#16302B" stroke="#FAF8F5" stroke-width="3"/>
        <text x="80" y="95" font-size="11" font-weight="700">Proposal</text>
        <!-- Point 2 -->
        <circle cx="200" cy="60" r="12" fill="#16302B" stroke="#FAF8F5" stroke-width="3"/>
        <text x="200" y="95" font-size="11" font-weight="700">Instrument</text>
        <!-- Point 3 -->
        <circle cx="320" cy="60" r="12" fill="#B8823B" stroke="#FAF8F5" stroke-width="3"/>
        <text x="320" y="95" font-size="11" font-weight="700">SEM Analysis</text>
        <!-- Point 4 -->
        <circle cx="430" cy="60" r="12" fill="#0C192E" stroke="#FAF8F5" stroke-width="3"/>
        <text x="430" y="95" font-size="11" font-weight="700">Viva Defense</text>
      </svg>
    `;
  }

  // 4. BarChart
  renderBarChart(data) {
    return `
      <svg viewBox="0 0 400 200" style="width:100%; height:auto;" class="svg-diagram">
        <line x1="50" y1="170" x2="380" y2="170" stroke="#E5DFD3" stroke-width="2"/>
        <rect x="70" y="50" width="45" height="120" rx="4" fill="#16302B" />
        <text x="92" y="42" font-size="11" font-weight="700">0.89</text>
        <text x="92" y="188" font-size="11" color="#5A6A80">Comp. Rel</text>

        <rect x="150" y="80" width="45" height="90" rx="4" fill="#B8823B" />
        <text x="172" y="72" font-size="11" font-weight="700">0.68</text>
        <text x="172" y="188" font-size="11">AVE</text>

        <rect x="230" y="60" width="45" height="110" rx="4" fill="#16302B" />
        <text x="252" y="52" font-size="11" font-weight="700">0.84</text>
        <text x="252" y="188" font-size="11">Alpha</text>

        <rect x="310" y="110" width="45" height="60" rx="4" fill="#5A6A80" />
        <text x="332" y="102" font-size="11" font-weight="700">0.42</text>
        <text x="332" y="188" font-size="11">R²</text>
      </svg>
    `;
  }

  // 5. Donut Ring
  renderDonut(data) {
    const percent = data.percent || 78;
    const circumference = 2 * Math.PI * 65;
    const offset = circumference - (percent / 100) * circumference;

    return `
      <svg viewBox="0 0 200 200" style="width:160px; height:160px; margin:0 auto;" class="svg-diagram">
        <circle cx="100" cy="100" r="65" fill="none" stroke="#E5DFD3" stroke-width="18" />
        <circle cx="100" cy="100" r="65" fill="none" stroke="#16302B" stroke-width="18"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
          stroke-linecap="round" transform="rotate(-90 100 100)" />
        <text x="100" y="106" font-family="'Fraunces', serif" font-size="28" font-weight="800" fill="#0C192E">${percent}%</text>
      </svg>
    `;
  }

  // 6. MindMap
  renderMindMap(data) {
    return `
      <svg viewBox="0 0 460 220" style="width:100%; height:auto;" class="svg-diagram">
        <!-- Center Root -->
        <rect x="180" y="90" width="100" height="40" rx="8" fill="#0C192E"/>
        <text x="230" y="115" fill="#FFFFFF" font-weight="700" font-size="11">Methodology</text>

        <!-- Lines -->
        <path d="M 180 110 C 120 110, 120 50, 70 50" fill="none" stroke="#B8823B" stroke-width="2"/>
        <path d="M 180 110 C 120 110, 120 170, 70 170" fill="none" stroke="#B8823B" stroke-width="2"/>
        <path d="M 280 110 C 340 110, 340 50, 390 50" fill="none" stroke="#16302B" stroke-width="2"/>
        <path d="M 280 110 C 340 110, 340 170, 390 170" fill="none" stroke="#16302B" stroke-width="2"/>

        <!-- Nodes -->
        <rect x="20" y="30" width="90" height="36" rx="6" fill="#F3EFE6" stroke="#B8823B" stroke-width="1.5"/>
        <text x="65" y="52" font-size="10.5" font-weight="600">Sample Frame</text>

        <rect x="20" y="150" width="90" height="36" rx="6" fill="#F3EFE6" stroke="#B8823B" stroke-width="1.5"/>
        <text x="65" y="172" font-size="10.5" font-weight="600">Scale Validity</text>

        <rect x="350" y="30" width="90" height="36" rx="6" fill="#F3EFE6" stroke="#16302B" stroke-width="1.5"/>
        <text x="395" y="52" font-size="10.5" font-weight="600">SEM Modeling</text>

        <rect x="350" y="150" width="90" height="36" rx="6" fill="#F3EFE6" stroke="#16302B" stroke-width="1.5"/>
        <text x="395" y="172" font-size="10.5" font-weight="600">Viva Defense</text>
      </svg>
    `;
  }

  // 7. Table (Striped Academic)
  renderTable(data) {
    return `
      <table style="width:100%; border-collapse:collapse; font-size:13.5px; background:#FFFFFF; border:1px solid #E5DFD3; border-radius:8px; overflow:hidden;">
        <thead>
          <tr style="background:#0C192E; color:#FFFFFF; text-align:left;">
            <th style="padding:12px 14px;">Construct</th>
            <th style="padding:12px 14px;">Cronbach's α</th>
            <th style="padding:12px 14px;">Comp. Rel (CR)</th>
            <th style="padding:12px 14px;">AVE (>0.50)</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #F3EFE6;">
            <td style="padding:10px 14px; font-weight:600;">Transformational Leadership</td>
            <td style="padding:10px 14px;">0.884</td>
            <td style="padding:10px 14px;">0.912</td>
            <td style="padding:10px 14px; color:#2F855A; font-weight:700;">0.675</td>
          </tr>
          <tr style="background:#FAF8F5; border-bottom:1px solid #F3EFE6;">
            <td style="padding:10px 14px; font-weight:600;">Employee Innovative Behavior</td>
            <td style="padding:10px 14px;">0.862</td>
            <td style="padding:10px 14px;">0.898</td>
            <td style="padding:10px 14px; color:#2F855A; font-weight:700;">0.640</td>
          </tr>
          <tr>
            <td style="padding:10px 14px; font-weight:600;">Psychological Safety</td>
            <td style="padding:10px 14px;">0.835</td>
            <td style="padding:10px 14px;">0.879</td>
            <td style="padding:10px 14px; color:#2F855A; font-weight:700;">0.592</td>
          </tr>
        </tbody>
      </table>
    `;
  }

  // 8. Anatomy
  renderAnatomy(data) {
    return `
      <div style="background:#FFFFFF; border:1px solid #E5DFD3; border-radius:8px; padding:20px;">
        <div style="font-weight:700; color:#0C192E; margin-bottom:10px; font-size:14px;">Anatomy of an APA 7th Journal Table:</div>
        <div style="font-style:italic; color:#5A6A80; font-size:12px; margin-bottom:4px;">Table 4.2 &larr; (Table number in bold, flush left)</div>
        <div style="font-weight:600; font-size:13px; color:#0C192E; margin-bottom:8px;">Construct Reliability and Convergent Validity Thresholds &larr; (Title italicized)</div>
        <div style="border-top:2px solid #0C192E; border-bottom:1px solid #0C192E; padding:8px 0; font-size:12px; font-weight:700;">No vertical borders permitted in standard APA 7th style</div>
        <div style="padding:8px 0; font-size:12px;">Standardized Factor Loadings (&gt; 0.70)</div>
        <div style="border-bottom:2px solid #0C192E; padding:8px 0; font-size:12px;">Average Variance Extracted (&gt; 0.50)</div>
        <div style="font-size:11px; color:#5A6A80; margin-top:6px;"><em>Note.</em> N = 350. Extracted from PLS-SEM algorithm.</div>
      </div>
    `;
  }

  // 9. Timeline
  renderTimeline(data) {
    return this.renderNumberLine(data);
  }

  // 10. Matrix
  renderMatrix(data) {
    return `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; max-width:420px; margin:0 auto;">
        <div style="background:#FAF8F5; border:1.5px solid #16302B; padding:16px; border-radius:8px;">
          <strong style="color:#16302B; display:block; margin-bottom:4px;">High Validity / High Rel.</strong>
          <span style="font-size:12px; color:#5A6A80;">Ideal Empirical Instrument</span>
        </div>
        <div style="background:#FAF8F5; border:1.5px solid #E5DFD3; padding:16px; border-radius:8px;">
          <strong style="color:#B8823B; display:block; margin-bottom:4px;">Low Validity / High Rel.</strong>
          <span style="font-size:12px; color:#5A6A80;">Consistently measuring wrong construct</span>
        </div>
        <div style="background:#FAF8F5; border:1.5px solid #E5DFD3; padding:16px; border-radius:8px;">
          <strong style="color:#B8823B; display:block; margin-bottom:4px;">High Validity / Low Rel.</strong>
          <span style="font-size:12px; color:#5A6A80;">Valid concept, noisy indicator items</span>
        </div>
        <div style="background:#FAF8F5; border:1.5px solid #E53E3E; padding:16px; border-radius:8px;">
          <strong style="color:#E53E3E; display:block; margin-bottom:4px;">Low Validity / Low Rel.</strong>
          <span style="font-size:12px; color:#5A6A80;">Fatal methodology rejection</span>
        </div>
      </div>
    `;
  }

  // 11. Icon Cards
  renderIconCards(data) {
    return `
      <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px;">
        <div style="background:#FFFFFF; border:1px solid #E5DFD3; border-radius:8px; padding:16px;">
          <div style="font-weight:700; color:#0C192E; margin-bottom:4px;">Normality (Skewness)</div>
          <div style="font-size:12.5px; color:#5A6A80;">Acceptable range between -1.0 and +1.0 for general linear regression.</div>
        </div>
        <div style="background:#FFFFFF; border:1px solid #E5DFD3; border-radius:8px; padding:16px;">
          <div style="font-weight:700; color:#0C192E; margin-bottom:4px;">Multicollinearity (VIF)</div>
          <div style="font-size:12.5px; color:#5A6A80;">Variance Inflation Factor must be strictly < 3.3 in PLS-SEM models.</div>
        </div>
      </div>
    `;
  }
}

// Global Export & Auto-mount on load
window.QuickVisualEngine = QuickVisualEngine;
document.addEventListener('DOMContentLoaded', () => {
  const mount = document.getElementById('visual-container');
  if (mount) {
    const kind = mount.getAttribute('data-visual-kind') || 'pyramid';
    const engine = new QuickVisualEngine(mount);
    engine.render(kind);
  }
});
