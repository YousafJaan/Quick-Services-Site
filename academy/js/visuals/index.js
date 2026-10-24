/**
 * Quick Services Academy — Visual Component Engine (30+ Semantic Kinds)
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
    case 'definition':
      bodyHtml = `
        <div class="visual-def-box">
          <div class="visual-def-term">${escapeHtml(data.term || '')}</div>
          <div class="visual-def-meaning">${escapeHtml(data.meaning || '')}</div>
          ${data.example ? `<div class="visual-def-example"><strong>Example:</strong> ${escapeHtml(data.example)}</div>` : ''}
        </div>`;
      break;

    case 'compare':
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

    case 'funnel':
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

    case 'annotatedExample':
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

    case 'hierarchy':
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

    case 'checklist':
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

    case 'scale':
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

    case 'process':
      bodyHtml = `
        <div class="visual-process-grid">
          <div class="visual-process-box">
            <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: var(--qsa-accent-orange);">Inputs</div>
            ${(data.inputs || []).map(i => `<div style="font-size: 13.5px; margin-top: 4px;">• ${escapeHtml(i)}</div>`).join('')}
          </div>
          <div style="text-align: center; font-size: 20px; font-weight: 800; color: var(--qsa-accent-orange);">➔</div>
          <div class="visual-process-box" style="border-color: var(--qsa-accent-orange);">
            <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: var(--qsa-accent-orange);">Transformation</div>
            <div style="font-size: 14px; font-weight: 700; margin-top: 4px;">${escapeHtml(data.transformation || '')}</div>
          </div>
          <div style="text-align: center; font-size: 20px; font-weight: 800; color: var(--qsa-accent-orange);">➔</div>
          <div class="visual-process-box">
            <div style="font-size: 11.5px; font-weight: 800; text-transform: uppercase; color: var(--qsa-accent-orange);">Outputs</div>
            ${(data.outputs || []).map(o => `<div style="font-size: 13.5px; margin-top: 4px;">• ${escapeHtml(o)}</div>`).join('')}
          </div>
        </div>`;
      break;

    case 'dosDonts':
      bodyHtml = `
        <div class="visual-two-col">
          <div class="visual-do-col">
            <h5 style="color: #15803d; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
              <span>✓</span> Do This
            </h5>
            ${(data.dos || []).map(d => `<div style="font-size: 13.5px; margin-bottom: 6px;">• ${escapeHtml(d)}</div>`).join('')}
          </div>
          <div class="visual-dont-col">
            <h5 style="color: #b91c1c; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
              <span>✕</span> Don't Do This
            </h5>
            ${(data.donts || []).map(d => `<div style="font-size: 13.5px; margin-bottom: 6px;">• ${escapeHtml(d)}</div>`).join('')}
          </div>
        </div>`;
      break;

    case 'matrix2x2':
      bodyHtml = `
        <div class="visual-matrix">
          <div class="visual-quadrant" style="border-left: 3px solid #15803d;">
            <strong>${escapeHtml(data.q1?.title || '')}</strong>
            <p style="font-size: 12.5px; margin: 4px 0 0; color: var(--qsa-text-light-muted);">${escapeHtml(data.q1?.desc || '')}</p>
          </div>
          <div class="visual-quadrant" style="border-left: 3px solid #b91c1c;">
            <strong>${escapeHtml(data.q2?.title || '')}</strong>
            <p style="font-size: 12.5px; margin: 4px 0 0; color: var(--qsa-text-light-muted);">${escapeHtml(data.q2?.desc || '')}</p>
          </div>
          <div class="visual-quadrant" style="border-left: 3px solid #f59e0b;">
            <strong>${escapeHtml(data.q3?.title || '')}</strong>
            <p style="font-size: 12.5px; margin: 4px 0 0; color: var(--qsa-text-light-muted);">${escapeHtml(data.q3?.desc || '')}</p>
          </div>
          <div class="visual-quadrant" style="border-left: 3px solid #64748b;">
            <strong>${escapeHtml(data.q4?.title || '')}</strong>
            <p style="font-size: 12.5px; margin: 4px 0 0; color: var(--qsa-text-light-muted);">${escapeHtml(data.q4?.desc || '')}</p>
          </div>
        </div>`;
      break;

    case 'quote':
      bodyHtml = `
        <div class="visual-quote-box">
          <p style="margin: 0 0 10px 0; font-style: italic;">“${escapeHtml(data.text || '')}”</p>
          <div style="font-size: 13px; font-weight: 700; color: var(--qsa-text-light-muted); text-align: right;">— ${escapeHtml(data.author || 'Quick Services Academy')}</div>
        </div>`;
      break;

    case 'mistakeFix':
      bodyHtml = `
        <div class="visual-mistake-box">
          <div style="background: #fef2f2; border-left: 3px solid #b91c1c; padding: 10px 14px; border-radius: 8px;">
            <strong style="color: #b91c1c; font-size: 13px;">❌ Mistake:</strong>
            <div style="font-size: 14px; margin-top: 2px;">${escapeHtml(data.mistake || '')}</div>
          </div>
          <div style="background: #ecfdf5; border-left: 3px solid #15803d; padding: 10px 14px; border-radius: 8px;">
            <strong style="color: #15803d; font-size: 13px;">✓ Correct Fix:</strong>
            <div style="font-size: 14px; margin-top: 2px;">${escapeHtml(data.fix || '')}</div>
          </div>
        </div>`;
      break;

    case 'cycle':
      bodyHtml = `
        <div class="visual-cycle-wrap">
          ${(data.steps || []).map((s, idx) => `
            <div style="background: #ffffff; border: 1px solid var(--qsa-border-light); border-radius: 12px; padding: 12px; max-width: 170px; text-align: center;">
              <span style="font-size: 11px; font-weight: 800; color: var(--qsa-accent-orange);">Step ${idx + 1}</span>
              <div style="font-weight: 700; font-size: 13.5px; margin: 4px 0;">${escapeHtml(s.label || '')}</div>
              <div style="font-size: 12px; color: var(--qsa-text-light-muted);">${escapeHtml(s.desc || '')}</div>
            </div>`).join('<div style="align-self: center; font-size: 18px; color: var(--qsa-accent-orange);">➔</div>')}
        </div>`;
      break;

    case 'flow':
      bodyHtml = `
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${(data.steps || []).map((s, idx) => `
            <div style="background: #ffffff; border: 1.5px solid var(--qsa-border-light); border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; gap: 14px;">
              <span style="width: 28px; height: 28px; border-radius: 50%; background: var(--qsa-accent-orange); color: var(--qsa-bg-dark); font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">${idx + 1}</span>
              <div>
                <strong style="font-size: 14.5px;">${escapeHtml(s.title || '')}</strong>
                <div style="font-size: 13px; color: var(--qsa-text-light-muted);">${escapeHtml(s.desc || '')}</div>
              </div>
            </div>`).join('')}
        </div>`;
      break;

    case 'timeline':
      bodyHtml = `
        <div class="visual-timeline-events">
          ${(data.events || []).map(ev => `
            <div class="visual-timeline-item">
              <span style="font-weight: 800; font-size: 13px; color: var(--qsa-accent-orange);">${escapeHtml(ev.time || '')}</span>
              <div>
                <strong style="font-size: 14px;">${escapeHtml(ev.title || '')}</strong>
                <div style="font-size: 13px; color: var(--qsa-text-light-muted);">${escapeHtml(ev.desc || '')}</div>
              </div>
            </div>`).join('')}
        </div>`;
      break;

    case 'decisionTree':
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

    case 'stack':
      bodyHtml = `
        <div class="visual-stack-wrap">
          ${(data.layers || []).map(l => `
            <div class="visual-stack-layer">
              <strong style="font-size: 14.5px;">${escapeHtml(l.name || '')}</strong>
              <div style="font-size: 13px; color: var(--qsa-text-light-muted);">${escapeHtml(l.desc || '')}</div>
            </div>`).join('')}
        </div>`;
      break;

    case 'beforeAfter':
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

    case 'formula':
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

    default:
      bodyHtml = `
        <div class="visual-def-box">
          <div class="visual-def-term">${escapeHtml(title)}</div>
          <pre style="font-size: 12px; overflow-x: auto;">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
        </div>`;
      break;
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
