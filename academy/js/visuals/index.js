/**
 * Quick Services Academy — Visual Component Engine (30 Semantic Kinds)
 * Renders pure accessible HTML5 and inline SVG components with zero raster images.
 */

export function renderVisual(visual) {
  if (!visual || !visual.kind) {
    return `<div class="visual-card"><p>No visual data specified.</p></div>`;
  }

  const title = escapeHtml(visual.title || 'Concept Visual');
  const caption = visual.caption ? `<div class="visual-caption">${escapeHtml(visual.caption)}</div>` : '';
  const kind = visual.kind;
  const data = visual.data || {};

  let bodyHtml = '';

  switch (kind) {
    case 'definition': {
      bodyHtml = `
        <div class="visual-def-box">
          <div class="visual-def-term">${escapeHtml(data.term || '')}</div>
          <div class="visual-def-meaning">${escapeHtml(data.meaning || '')}</div>
          ${data.example ? `<div class="visual-def-example"><strong>Example:</strong> ${escapeHtml(data.example)}</div>` : ''}
        </div>`;
      break;
    }

    case 'compare': {
      const cols = data.columns || ['Option A', 'Option B'];
      const rows = data.rows || [];
      bodyHtml = `
        <table class="visual-compare-table">
          <thead>
            <tr>
              <th>Criteria</th>
              <th>${escapeHtml(cols[0])}</th>
              <th>${escapeHtml(cols[1])}</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td><strong>${escapeHtml(r.metric || '')}</strong></td>
                <td>${escapeHtml(r.col1 || '')}</td>
                <td>${escapeHtml(r.col2 || '')}</td>
              </tr>`).join('')}
          </tbody>
        </table>`;
      break;
    }

    case 'funnel': {
      const stages = data.stages || [];
      bodyHtml = `
        <div class="visual-funnel-wrap">
          ${stages.map((st, idx) => {
            const width = Math.max(45, 100 - (idx * 16));
            return `
              <div class="visual-funnel-stage" style="width: ${width}%;">
                <strong>${escapeHtml(st.label || '')}</strong>
                <div style="font-size: 12px; color: var(--qsa-text-light-muted);">${escapeHtml(st.desc || '')}</div>
              </div>`;
          }).join('')}
        </div>`;
      break;
    }

    case 'annotatedExample': {
      const callouts = data.callouts || [];
      bodyHtml = `
        <div class="visual-annotated-text">
          <p style="margin-bottom: 12px; font-weight: 600;">${escapeHtml(data.lead || '')}</p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${callouts.map(c => `
              <div>
                <span class="visual-callout-pill">${escapeHtml(c.text || '')}</span>
                <span class="visual-callout-tag">← ${escapeHtml(c.label || '')}</span>
              </div>`).join('')}
          </div>
        </div>`;
      break;
    }

    case 'hierarchy': {
      const children = data.children || [];
      bodyHtml = `
        <div class="visual-tree">
          <div class="visual-tree-root">${escapeHtml(data.root || '')}</div>
          <div class="visual-tree-children">
            ${children.map(ch => `
              <div class="visual-tree-node">
                <div style="font-weight: 800; font-size: 14px; margin-bottom: 4px;">${escapeHtml(ch.name || '')}</div>
                <div style="font-size: 12.5px; color: var(--qsa-text-light-muted);">${escapeHtml(ch.desc || '')}</div>
              </div>`).join('')}
          </div>
        </div>`;
      break;
    }

    case 'checklist': {
      const items = data.items || [];
      bodyHtml = `
        <div class="visual-check-list">
          ${items.map(it => `
            <div class="visual-check-item">
              <span class="visual-check-icon">✓</span>
              <div>
                <strong style="font-size: 14.5px;">${escapeHtml(it.label || '')}</strong>
                <div style="font-size: 13px; color: var(--qsa-text-light-muted);">${escapeHtml(it.desc || '')}</div>
              </div>
            </div>`).join('')}
        </div>`;
      break;
    }

    case 'scale': {
      const markers = data.markers || [];
      bodyHtml = `
        <div style="padding: 10px 0;">
          <div class="visual-scale-bar">
            ${markers.map(m => `
              <div class="visual-scale-marker" style="left: ${m.pos}%;">
                <div class="visual-scale-label">
                  <div>${escapeHtml(m.label || '')}</div>
                  <span style="font-weight: normal; font-size: 11px; color: var(--qsa-text-light-muted);">${escapeHtml(m.desc || '')}</span>
                </div>
              </div>`).join('')}
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: 700; color: var(--qsa-text-light-muted); margin-top: 36px;">
            <span>${escapeHtml(data.min || 'Low')}</span>
            <span>${escapeHtml(data.max || 'High')}</span>
          </div>
        </div>`;
      break;
    }

    case 'process': {
      const steps = data.steps || [];
      bodyHtml = `
        <div class="visual-process-grid">
          ${steps.map((st, idx) => `
            <div class="visual-process-card">
              <div class="visual-process-num">${idx + 1}</div>
              <strong style="font-size: 14px; display: block; margin-bottom: 4px;">${escapeHtml(st.title || '')}</strong>
              <div style="font-size: 12.5px; color: var(--qsa-text-light-muted);">${escapeHtml(st.desc || '')}</div>
            </div>`).join('')}
        </div>`;
      break;
    }

    case 'dosDonts': {
      const dos = data.dos || [];
      const donts = data.donts || [];
      bodyHtml = `
        <div class="visual-dos-donts">
          <div class="visual-dos-col">
            <h4 style="color: #15803d; margin: 0 0 12px; font-size: 14px; text-transform: uppercase;">✓ What Works (Do)</h4>
            ${dos.map(d => `<div class="visual-do-item"><span>✓</span><span>${escapeHtml(d)}</span></div>`).join('')}
          </div>
          <div class="visual-donts-col">
            <h4 style="color: #b91c1c; margin: 0 0 12px; font-size: 14px; text-transform: uppercase;">✕ Topic Traps (Avoid)</h4>
            ${donts.map(d => `<div class="visual-dont-item"><span>✕</span><span>${escapeHtml(d)}</span></div>`).join('')}
          </div>
        </div>`;
      break;
    }

    case 'matrix2x2': {
      const quadrants = data.quadrants || {};
      bodyHtml = `
        <div class="visual-matrix">
          <div class="visual-matrix-cell">
            <span class="visual-matrix-tag">${escapeHtml(quadrants.tl?.label || 'Top Left')}</span>
            <strong style="display: block; font-size: 14px; margin: 4px 0;">${escapeHtml(quadrants.tl?.title || '')}</strong>
            <div style="font-size: 12.5px; color: var(--qsa-text-light-muted);">${escapeHtml(quadrants.tl?.desc || '')}</div>
          </div>
          <div class="visual-matrix-cell highlighted">
            <span class="visual-matrix-tag" style="background: var(--qsa-accent-orange); color: #fff;">${escapeHtml(quadrants.tr?.label || 'Target Zone')}</span>
            <strong style="display: block; font-size: 14px; margin: 4px 0;">${escapeHtml(quadrants.tr?.title || '')}</strong>
            <div style="font-size: 12.5px; color: var(--qsa-text-light-muted);">${escapeHtml(quadrants.tr?.desc || '')}</div>
          </div>
          <div class="visual-matrix-cell">
            <span class="visual-matrix-tag">${escapeHtml(quadrants.bl?.label || 'Bottom Left')}</span>
            <strong style="display: block; font-size: 14px; margin: 4px 0;">${escapeHtml(quadrants.bl?.title || '')}</strong>
            <div style="font-size: 12.5px; color: var(--qsa-text-light-muted);">${escapeHtml(quadrants.bl?.desc || '')}</div>
          </div>
          <div class="visual-matrix-cell">
            <span class="visual-matrix-tag">${escapeHtml(quadrants.br?.label || 'Bottom Right')}</span>
            <strong style="display: block; font-size: 14px; margin: 4px 0;">${escapeHtml(quadrants.br?.title || '')}</strong>
            <div style="font-size: 12.5px; color: var(--qsa-text-light-muted);">${escapeHtml(quadrants.br?.desc || '')}</div>
          </div>
        </div>`;
      break;
    }

    case 'quote': {
      bodyHtml = `
        <div style="border-left: 4px solid var(--qsa-accent-orange); padding: 16px 20px; background: var(--qsa-bg-muted-light); border-radius: 0 12px 12px 0;">
          <p style="font-family: var(--qsa-font-serif); font-size: 16px; font-style: italic; line-height: 1.6; margin: 0 0 8px; color: var(--qsa-text-light);">
            "${escapeHtml(data.text || '')}"
          </p>
          <div style="font-size: 13px; font-weight: 700; color: var(--qsa-accent-orange);">— ${escapeHtml(data.author || 'Academic Standard')}</div>
        </div>`;
      break;
    }

    case 'mistakeFix': {
      bodyHtml = `
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 14px 18px;">
            <div style="color: #b91c1c; font-weight: 800; font-size: 12.5px; text-transform: uppercase; margin-bottom: 4px;">✕ The Mistake</div>
            <div style="font-size: 14px; color: #1c1917;">${escapeHtml(data.mistake || '')}</div>
          </div>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 14px 18px;">
            <div style="color: #15803d; font-weight: 800; font-size: 12.5px; text-transform: uppercase; margin-bottom: 4px;">✓ The Scholarly Fix</div>
            <div style="font-size: 14px; color: #1c1917;">${escapeHtml(data.fix || '')}</div>
          </div>
        </div>`;
      break;
    }

    case 'cycle': {
      const phases = data.phases || [];
      bodyHtml = `
        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; padding: 12px 0;">
          ${phases.map((ph, idx) => `
            <div style="flex: 1 1 140px; background: var(--qsa-bg-muted-light); border: 1px solid var(--qsa-border-light); border-radius: 12px; padding: 14px; text-align: center;">
              <div style="font-size: 20px; font-weight: 800; color: var(--qsa-accent-orange); margin-bottom: 4px;">0${idx + 1}</div>
              <strong style="font-size: 13.5px; display: block; margin-bottom: 4px;">${escapeHtml(ph.title || '')}</strong>
              <div style="font-size: 12px; color: var(--qsa-text-light-muted);">${escapeHtml(ph.desc || '')}</div>
            </div>`).join('')}
        </div>`;
      break;
    }

    case 'flow': {
      const steps = data.steps || [];
      bodyHtml = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${steps.map((s, idx) => `
            <div style="display: flex; gap: 14px; align-items: center; background: var(--qsa-bg-muted-light); padding: 12px 16px; border-radius: 10px;">
              <span style="width: 28px; height: 28px; border-radius: 50%; background: var(--qsa-accent-orange); color: var(--qsa-bg-dark); font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">${idx + 1}</span>
              <div>
                <strong style="font-size: 14.5px;">${escapeHtml(s.title || '')}</strong>
                <div style="font-size: 13px; color: var(--qsa-text-light-muted);">${escapeHtml(s.desc || '')}</div>
              </div>
            </div>`).join('')}
        </div>`;
      break;
    }

    case 'timeline': {
      const events = data.events || [];
      bodyHtml = `
        <div class="visual-timeline-events">
          ${events.map(ev => `
            <div class="visual-timeline-item">
              <span style="font-weight: 800; font-size: 13px; color: var(--qsa-accent-orange);">${escapeHtml(ev.time || '')}</span>
              <div>
                <strong style="font-size: 14px;">${escapeHtml(ev.title || '')}</strong>
                <div style="font-size: 13px; color: var(--qsa-text-light-muted);">${escapeHtml(ev.desc || '')}</div>
              </div>
            </div>`).join('')}
        </div>`;
      break;
    }

    case 'decisionTree': {
      bodyHtml = `
        <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: 14px; padding: 20px; text-align: center;">
          <div style="font-size: 15px; font-weight: 800; margin-bottom: 16px; padding: 10px 16px; background: var(--qsa-bg-muted-light); border-radius: var(--qsa-radius-pill); display: inline-block;">
            ❓ ${escapeHtml(data.condition || '')}
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; text-align: left;">
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; padding: 14px; border-radius: 10px;">
              <strong style="color: #15803d; font-size: 13px;">YES:</strong>
              <div style="font-size: 13.5px; margin-top: 4px;">${escapeHtml(data.yes || '')}</div>
            </div>
            <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 14px; border-radius: 10px;">
              <strong style="color: #b91c1c; font-size: 13px;">NO:</strong>
              <div style="font-size: 13.5px; margin-top: 4px;">${escapeHtml(data.no || '')}</div>
            </div>
          </div>
        </div>`;
      break;
    }

    case 'stack': {
      bodyHtml = `
        <div class="visual-stack-wrap">
          ${(data.layers || []).map(l => `
            <div class="visual-stack-layer">
              <strong style="font-size: 14.5px;">${escapeHtml(l.name || '')}</strong>
              <div style="font-size: 13px; color: var(--qsa-text-light-muted);">${escapeHtml(l.desc || '')}</div>
            </div>`).join('')}
        </div>`;
      break;
    }

    case 'beforeAfter': {
      bodyHtml = `
        <div class="visual-before-after">
          <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px;">
            <strong style="color: #b91c1c; font-size: 13px; text-transform: uppercase;">✕ ${escapeHtml(data.before?.title || 'Before')}</strong>
            <p style="font-size: 13.5px; margin: 8px 0 0; line-height: 1.5;">${escapeHtml(data.before?.content || '')}</p>
          </div>
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 16px;">
            <strong style="color: #15803d; font-size: 13px; text-transform: uppercase;">✓ ${escapeHtml(data.after?.title || 'After')}</strong>
            <p style="font-size: 13.5px; margin: 8px 0 0; line-height: 1.5;">${escapeHtml(data.after?.content || '')}</p>
          </div>
        </div>`;
      break;
    }

    case 'formula': {
      bodyHtml = `
        <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: 14px; padding: 20px; text-align: center;">
          <div style="font-family: var(--qsa-font-mono); font-size: 20px; font-weight: 700; color: var(--qsa-accent-orange); margin-bottom: 16px;">
            ${escapeHtml(data.equation || '')}
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; text-align: left; border-top: 1px solid var(--qsa-border-light); padding-top: 14px;">
            ${(data.variables || []).map(v => `
              <div style="font-size: 13.5px;">
                <code style="background: var(--qsa-bg-muted-light); padding: 2px 6px; border-radius: 4px; font-weight: 700;">${escapeHtml(v.symbol || '')}</code>
                = ${escapeHtml(v.meaning || '')}
              </div>`).join('')}
          </div>
        </div>`;
      break;
    }

    case 'venn': {
      const sets = data.sets || [{ label: 'Set A' }, { label: 'Set B' }];
      const interLabel = data.intersection?.label || 'Overlap';
      bodyHtml = `
        <div style="text-align: center; overflow-x: auto;">
          <svg viewBox="0 0 400 240" style="max-width: 100%; height: auto; font-family: var(--qsa-font-sans, sans-serif);">
            <circle cx="160" cy="120" r="85" fill="rgba(255, 107, 44, 0.22)" stroke="#ff6b2c" stroke-width="2.5" />
            <circle cx="240" cy="120" r="85" fill="rgba(16, 43, 78, 0.22)" stroke="#102b4e" stroke-width="2.5" />
            <text x="110" y="125" font-size="14" font-weight="700" fill="#ff6b2c" text-anchor="middle">${escapeHtml(sets[0]?.label || '')}</text>
            <text x="290" y="125" font-size="14" font-weight="700" fill="#102b4e" text-anchor="middle">${escapeHtml(sets[1]?.label || '')}</text>
            <text x="200" y="125" font-size="12" font-weight="800" fill="#1c1917" text-anchor="middle">${escapeHtml(interLabel)}</text>
          </svg>
        </div>`;
      break;
    }

    case 'pyramid': {
      const levels = data.levels || [{ label: 'Level 1' }, { label: 'Level 2' }, { label: 'Level 3' }];
      bodyHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 0;">
          ${levels.map((lvl, idx) => {
            const widthPct = Math.min(100, 40 + idx * (60 / Math.max(1, levels.length - 1)));
            const bg = lvl.color || (idx === 0 ? '#ff6b2c' : idx === levels.length - 1 ? '#102b4e' : '#334155');
            return `
              <div style="width: ${widthPct}%; background: ${bg}; color: #ffffff; padding: 10px 14px; border-radius: 8px; text-align: center; transition: all 0.2s ease;">
                <div style="font-weight: 700; font-size: 13.5px;">${escapeHtml(lvl.label || '')}</div>
                ${lvl.description ? `<div style="font-size: 11.5px; opacity: 0.9; margin-top: 2px;">${escapeHtml(lvl.description)}</div>` : ''}
              </div>`;
          }).join('')}
        </div>`;
      break;
    }

    case 'numberLine': {
      const min = data.min ?? 0;
      const max = data.max ?? 100;
      const markers = data.markers || [];
      bodyHtml = `
        <div style="padding: 24px 10px; overflow-x: auto;">
          <svg viewBox="0 0 500 120" style="max-width: 100%; height: auto; font-family: var(--qsa-font-sans, sans-serif);">
            <line x1="40" y1="60" x2="460" y2="60" stroke="var(--qsa-border-strong, #cbd5e1)" stroke-width="4" stroke-linecap="round" />
            <text x="40" y="86" font-size="12" font-weight="700" fill="var(--qsa-text-muted, #64748b)" text-anchor="middle">${escapeHtml(String(min))}</text>
            <text x="460" y="86" font-size="12" font-weight="700" fill="var(--qsa-text-muted, #64748b)" text-anchor="middle">${escapeHtml(String(max))}</text>
            ${markers.map(m => {
              const range = max - min || 1;
              const posX = 40 + Math.max(0, Math.min(1, (m.val - min) / range)) * 420;
              const color = m.color || '#ff6b2c';
              return `
                <circle cx="${posX}" cy="60" r="7" fill="${color}" stroke="#ffffff" stroke-width="2" />
                <line x1="${posX}" y1="36" x2="${posX}" y2="53" stroke="${color}" stroke-width="1.5" stroke-dasharray="2,2" />
                <text x="${posX}" y="30" font-size="11" font-weight="700" fill="${color}" text-anchor="middle">${escapeHtml(m.label || '')} (${escapeHtml(String(m.val))})</text>`;
            }).join('')}
          </svg>
        </div>`;
      break;
    }

    case 'barchart': {
      const bars = data.bars || [];
      const highest = Math.max(...bars.map(b => b.value || 0), 1);
      bodyHtml = `
        <div style="display: flex; flex-direction: column; gap: 12px; padding: 8px 0;">
          ${bars.map(b => {
            const pctVal = Math.round(((b.value || 0) / highest) * 100);
            const color = b.color || '#ff6b2c';
            return `
              <div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; margin-bottom: 4px;">
                  <span>${escapeHtml(b.label || '')}</span>
                  <span style="color: ${color}; font-weight: 700;">${escapeHtml(String(b.value))}</span>
                </div>
                <div style="height: 10px; background: var(--qsa-bg-muted, #f1f5f9); border-radius: 999px; overflow: hidden;">
                  <div style="height: 100%; width: ${pctVal}%; background: ${color}; border-radius: 999px; transition: width 0.3s ease;"></div>
                </div>
              </div>`;
          }).join('')}
        </div>`;
      break;
    }

    case 'donut': {
      const pctDonut = Math.max(0, Math.min(100, data.percent ?? 50));
      const circumference = 2 * Math.PI * 40;
      const strokeDashoffset = circumference - (pctDonut / 100) * circumference;
      bodyHtml = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 24px; padding: 12px 0; flex-wrap: wrap;">
          <svg viewBox="0 0 100 100" style="width: 110px; height: 110px; transform: rotate(-90deg);">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--qsa-border-light, #e2e8f0)" stroke-width="12" />
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ff6b2c" stroke-width="12"
              stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" />
            <text x="50" y="55" font-size="16" font-weight="800" fill="var(--qsa-text-strong, #0f172a)" text-anchor="middle"
              style="transform: rotate(90deg); transform-origin: 50% 50%; font-family: var(--qsa-font-sans, sans-serif);">
              ${pctDonut}%
            </text>
          </svg>
          ${data.centerLabel ? `<div style="font-size: 14px; font-weight: 600; color: var(--qsa-text-secondary, #475569); max-width: 220px;">${escapeHtml(data.centerLabel)}</div>` : ''}
        </div>`;
      break;
    }

    case 'mindmap': {
      const branches = data.branches || [];
      bodyHtml = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 8px 0;">
          <div style="background: #102b4e; color: #ffffff; padding: 10px 22px; border-radius: 999px; font-weight: 800; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">
            ${escapeHtml(data.root || title)}
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; width: 100%;">
            ${branches.map(b => `
              <div style="background: var(--qsa-card-bg, #ffffff); border: 1.5px solid var(--qsa-border-light, #e2e8f0); border-radius: 10px; padding: 12px;">
                <div style="font-weight: 700; font-size: 13px; color: #ff6b2c; margin-bottom: 6px;">${escapeHtml(b.title || '')}</div>
                <ul style="margin: 0; padding-left: 18px; font-size: 12.5px; line-height: 1.5; color: var(--qsa-text-secondary, #475569);">
                  ${(b.items || []).map(i => `<li>${escapeHtml(i)}</li>`).join('')}
                </ul>
              </div>`).join('')}
          </div>
        </div>`;
      break;
    }

    case 'iconCards': {
      const cards = data.cards || [];
      bodyHtml = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; padding: 6px 0;">
          ${cards.map(c => `
            <div style="background: var(--qsa-card-bg, #ffffff); border: 1.5px solid var(--qsa-border-light, #e2e8f0); border-radius: 12px; padding: 14px;">
              <div style="font-size: 24px; margin-bottom: 6px;">${escapeHtml(c.icon || '📌')}</div>
              <div style="font-weight: 700; font-size: 13.5px; color: var(--qsa-text-strong, #0f172a); margin-bottom: 4px;">${escapeHtml(c.title || '')}</div>
              <p style="font-size: 12.5px; margin: 0; line-height: 1.45; color: var(--qsa-text-secondary, #475569);">${escapeHtml(c.text || '')}</p>
            </div>`).join('')}
        </div>`;
      break;
    }

    case 'keyTermCard': {
      bodyHtml = `
        <div style="background: var(--qsa-card-bg, #ffffff); border-left: 4px solid #ff6b2c; border-top: 1.5px solid var(--qsa-border-light, #e2e8f0); border-right: 1.5px solid var(--qsa-border-light, #e2e8f0); border-bottom: 1.5px solid var(--qsa-border-light, #e2e8f0); border-radius: 0 12px 12px 0; padding: 16px 20px;">
          <div style="display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;">
            <span style="font-size: 16px; font-weight: 800; color: #ff6b2c;">${escapeHtml(data.term || '')}</span>
            ${data.phonetic ? `<span style="font-family: var(--qsa-font-mono, monospace); font-size: 12px; color: var(--qsa-text-muted, #64748b);">${escapeHtml(data.phonetic)}</span>` : ''}
          </div>
          <div style="font-size: 13.5px; line-height: 1.55; color: var(--qsa-text-strong, #0f172a); margin: 8px 0;">
            ${escapeHtml(data.definition || '')}
          </div>
          ${data.context ? `<div style="font-size: 12px; color: var(--qsa-text-secondary, #475569); font-style: italic; border-top: 1px dashed var(--qsa-border-light, #e2e8f0); padding-top: 6px; margin-top: 6px;">Context: ${escapeHtml(data.context)}</div>` : ''}
        </div>`;
      break;
    }

    case 'table': {
      const ths = data.headers || [];
      const trs = data.rows || [];
      bodyHtml = `
        <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 8px; border: 1px solid var(--qsa-border-light, #e2e8f0);">
          <table class="visual-compare-table" style="width: 100%; border-collapse: collapse; min-width: 320px;">
            ${ths.length ? `
              <thead>
                <tr style="background: var(--qsa-bg-muted, #f8fafc);">
                  ${ths.map(h => `<th style="padding: 10px 14px; text-align: left; font-size: 13px; font-weight: 700; border-bottom: 2px solid var(--qsa-border-light, #e2e8f0);">${escapeHtml(String(h))}</th>`).join('')}
                </tr>
              </thead>` : ''}
            <tbody>
              ${trs.map((row, rIdx) => `
                <tr style="background: ${rIdx % 2 === 0 ? 'transparent' : 'var(--qsa-bg-subtle, #fdfdfd)'};">
                  ${(Array.isArray(row) ? row : []).map(cell => `<td style="padding: 10px 14px; font-size: 13px; border-bottom: 1px solid var(--qsa-border-light, #e2e8f0);">${escapeHtml(String(cell))}</td>`).join('')}
                </tr>`).join('')}
            </tbody>
          </table>
        </div>`;
      break;
    }

    case 'anatomy': {
      const parts = data.parts || [];
      bodyHtml = `
        <div style="background: var(--qsa-card-bg, #ffffff); border: 1.5px solid var(--qsa-border-light, #e2e8f0); border-radius: 12px; padding: 18px;">
          ${data.sample ? `
            <div style="font-family: var(--qsa-font-serif, Georgia, serif); font-size: 15px; line-height: 1.6; background: var(--qsa-bg-muted, #f8fafc); padding: 14px; border-radius: 8px; margin-bottom: 14px; border-left: 3px solid #102b4e;">
              ${escapeHtml(data.sample)}
            </div>` : ''}
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${parts.map((p, idx) => `
              <div style="display: flex; gap: 10px; align-items: baseline; font-size: 13px;">
                <span style="background: ${p.color || '#ff6b2c'}; color: #ffffff; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 800; flex-shrink: 0;">Part ${idx + 1}</span>
                <div><strong>${escapeHtml(p.label || '')}:</strong> <span>${escapeHtml(p.text || '')}</span></div>
              </div>`).join('')}
          </div>
        </div>`;
      break;
    }

    case 'textFallback': {
      bodyHtml = `
        <div style="background: var(--qsa-bg-muted, #f8fafc); border: 1px solid var(--qsa-border-light, #e2e8f0); border-radius: 10px; padding: 14px 18px; font-size: 13.5px; line-height: 1.6; color: var(--qsa-text-strong, #0f172a);">
          ${escapeHtml(data.content || '')}
        </div>`;
      break;
    }

    default: {
      bodyHtml = `
        <div class="visual-def-box">
          <div class="visual-def-term">${escapeHtml(title)}</div>
          <pre style="font-size: 12px; overflow-x: auto;">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
        </div>`;
      break;
    }
  }

  return `
    <div class="visual-card" data-visual-kind="${escapeHtml(kind)}">
      <div class="visual-header">
        <div class="visual-title">
          <span>📊</span>
          <span>${title}</span>
        </div>
        <span class="visual-kind-badge">${escapeHtml(kind)}</span>
      </div>
      <div class="visual-body">
        ${bodyHtml}
      </div>
      ${caption}
    </div>`;
}

// Fallback Tier B: Heuristic layout engine for arbitrary student note text
export function renderFallback(text) {
  if (!text || typeof text !== 'string') return '';
  const trimmed = text.trim();

  // If text has "first", "then", "finally" -> flow
  if (/first|second|then|finally|next/i.test(trimmed)) {
    const steps = trimmed.split(/\.|\n/).filter(s => s.trim().length > 5).map(s => ({ title: 'Step', desc: s.trim() }));
    return renderVisual({
      kind: 'flow',
      title: 'Sequential Steps',
      data: { steps },
      caption: 'Generated automatically from note sequence.'
    });
  }

  // If text has "versus" or "vs" -> compare
  if (/\bvs\b|\bversus\b/i.test(trimmed)) {
    const parts = trimmed.split(/\bvs\b|\bversus\b/i);
    return renderVisual({
      kind: 'compare',
      title: 'Comparative Notes',
      data: {
        columns: ['Side A', 'Side B'],
        rows: [{ metric: 'Key Distinction', col1: (parts[0] || '').trim(), col2: (parts[1] || '').trim() }]
      },
      caption: 'Generated comparison table from note.'
    });
  }

  // Default to quote/definition
  return renderVisual({
    kind: 'quote',
    title: 'Note Highlight',
    data: { text: trimmed, author: 'Student Note' },
    caption: 'Saved student observation.'
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
