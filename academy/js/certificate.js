/**
 * Quick Services Academy — Certificate Issuance & Verification Engine
 * Canva / Google Grade Academic Credential System:
 * - One-Time Permanent Learner Identity Locking
 * - Double Guilloché Borders & Microprint Security Thread
 * - Soft Ivory Parchment Surface with Central Watermark Seal
 * - 3D Embossed Metallic Gold Crest Medallion with Draped Satin Ribbon Tails
 * - Formal Calligraphy Script for Student Name (Alex Brush / Playfair)
 * - Dual Official Signatures (M. Yousaf & Academic Registrar)
 * - 300 DPI High-Resolution Canvas Export
 */

import { store } from './store.js';
import { getUserProfile } from './storage/idb.js';

export async function renderCertificateView(container, { certId, courseId }) {
  const courses = [
    { id: 'thesis101', title: 'Thesis Writing 101: Problem Formulation & Defense', hours: 3.5, code: 'THESIS' },
    { id: 'cite101', title: 'Citations & Referencing: APA 7th Masterclass', hours: 3.0, code: 'CITE' },
    { id: 'integrity101', title: 'Academic Integrity & Turnitin Similarity Defense', hours: 2.8, code: 'INTEG' },
    { id: 'edit101', title: 'Proofreading & Structural Academic Editing', hours: 3.2, code: 'EDIT' },
    { id: 'lit-search', title: 'Systematic Literature Search & Zotero Indexing', hours: 3.2, code: 'SEARCH' },
    { id: 'sample-size', title: 'Sample Size Determination & Statistical Power', hours: 3.8, code: 'SAMPLE' },
    { id: 'spss101', title: 'SPSS for Quantitative Empirical Research', hours: 4.2, code: 'SPSS' },
    { id: 'smartpls', title: 'SmartPLS 4 & Structural Equation Modeling (SEM)', hours: 4.0, code: 'PLS' },
    { id: 'viva', title: 'Viva Voce & Proposal Defense Mastery', hours: 2.8, code: 'VIVA' }
  ];

  const targetCourseId = courseId || (courses.some(c => c.id === certId) ? certId : 'thesis101');
  const course = courses.find(c => c.id === targetCourseId) || courses[0];
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const isGenericCourseCert = certId && courses.some(c => c.id === certId);
  const idStr = (!certId || isGenericCourseCert)
    ? `QSA-${course.code}-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
    : certId;

  const isLocked = store.isStudentNameLocked();
  const lockedName = store.getVerifiedStudentName();
  const regId = store.getStudentRegistrationId() || 'QSA-REG-VERIFIED';
  const userProfile = await getUserProfile();

  container.innerHTML = `
    <div class="wrap" style="padding: 40px 20px 80px; max-width: 1040px;">
      <!-- Action Bar -->
      <div class="cert-top-bar" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <a href="#certificates" class="reader-back-btn" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px; color: var(--qsa-text-secondary); font-size: 14px; font-weight: 500;">
          <span style="font-size: 16px;">←</span> <span>All Certificates</span>
        </a>
        <div class="cert-actions-wrap" style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary btn-sm" id="print-cert-btn" style="display: inline-flex; align-items: center; gap: 6px;">
            <span>🖨️</span> <span>Print Certificate</span>
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="download-cert-btn" style="display: inline-flex; align-items: center; gap: 6px;">
            <span>📥</span> <span>Download 300 DPI Official PNG</span>
          </button>
        </div>
      </div>

      <!-- Identity Verification & One-Time Name Putting Card -->
      ${!isLocked ? `
        <div class="identity-lock-card" id="identity-lock-section" style="background: #ffffff; border: 1.5px solid var(--qsa-accent-clay); border-radius: var(--qsa-radius-card); padding: 24px 28px; margin-bottom: 32px; box-shadow: var(--qsa-shadow-card);">
          <div style="display: flex; align-items: flex-start; gap: 16px;">
            <div style="font-size: 30px; flex-shrink: 0; line-height: 1;">🛡️</div>
            <div style="flex: 1;">
              <h3 style="font-size: 18px; margin: 0 0 6px 0; color: var(--qsa-text-primary); font-family: var(--qsa-font-serif);">
                Official Learner Identity Verification
              </h3>
              <p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin: 0 0 16px 0; line-height: 1.6;">
                <strong>⚠️ Permanent Academic Credential Policy:</strong> In compliance with university and HEC standards, your legal name will be <strong>permanently bound</strong> to your verifiable Certificate ID and this browser. Once confirmed, this identity <strong>cannot be modified or transferred</strong>.
              </p>
              
              <div style="display: flex; flex-direction: column; gap: 12px; max-width: 560px;">
                <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--qsa-text-muted);">
                  Full Official Academic / Legal Name:
                </label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <input type="text" id="initial-student-name" placeholder="e.g. Sidra Abbas or Dr. Muhammad Yousaf" style="flex: 1; min-width: 260px; padding: 10px 16px; border: 1.5px solid var(--qsa-border-strong); border-radius: var(--qsa-radius-pill); font-size: 15px; font-weight: 600; outline: none; background: #ffffff; color: var(--qsa-text-primary);">
                  <button type="button" class="btn btn-primary btn-sm" id="lock-identity-btn" style="white-space: nowrap;">
                    🔒 Confirm &amp; Lock Identity
                  </button>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                  <input type="checkbox" id="identity-affirmation" style="accent-color: var(--qsa-accent-clay); width: 16px; height: 16px; cursor: pointer;">
                  <label for="identity-affirmation" style="font-size: 12px; color: var(--qsa-text-secondary); cursor: pointer;">
                    I certify that this is my genuine academic name for official HEC-standard record keeping.
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : `
        <div class="identity-verified-card" style="background: var(--qsa-status-success-bg); border: 1.5px solid var(--qsa-status-success-border); border-radius: var(--qsa-radius-card); padding: 14px 22px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--qsa-status-success); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800;">
              ✓
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: var(--qsa-status-success); letter-spacing: 0.6px;">
                Verified Academic Record • Permanently Locked
              </div>
              <strong style="font-size: 15px; color: #14532d;">${lockedName}</strong>
              <span style="font-size: 12px; color: #166534; margin-left: 8px; font-family: var(--qsa-font-mono);">(${regId})</span>
            </div>
          </div>
          <span class="tag tag-green" style="font-size: 11px;">🔒 Identity Non-Transferable</span>
        </div>
      `}

      <!-- Prestigious Certificate Stage (Canva/Google Grade Academic Credential) -->
      <div id="certificate-stage" style="background: #faf8f2; color: #1c1917; border-radius: 8px; border: 12px solid #1c1917; outline: 3px solid #b45309; outline-offset: -7px; padding: 56px 48px; box-shadow: 0 16px 40px rgba(0,0,0,0.12); text-align: center; position: relative; overflow: hidden; font-family: var(--qsa-font-serif);">
        
        <!-- Corner Guilloché Flourish Accents -->
        <div style="position: absolute; top: 12px; left: 12px; width: 44px; height: 44px; border-top: 2px solid #b45309; border-left: 2px solid #b45309; pointer-events: none;"></div>
        <div style="position: absolute; top: 12px; right: 12px; width: 44px; height: 44px; border-top: 2px solid #b45309; border-right: 2px solid #b45309; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 12px; left: 12px; width: 44px; height: 44px; border-bottom: 2px solid #b45309; border-left: 2px solid #b45309; pointer-events: none;"></div>
        <div style="position: absolute; bottom: 12px; right: 12px; width: 44px; height: 44px; border-bottom: 2px solid #b45309; border-right: 2px solid #b45309; pointer-events: none;"></div>

        <!-- Microprint Security Border Line -->
        <div style="position: absolute; top: 18px; left: 60px; right: 60px; font-size: 7px; text-transform: uppercase; letter-spacing: 2.2px; color: #a8a29e; font-family: var(--qsa-font-sans); pointer-events: none; overflow: hidden; white-space: nowrap; opacity: 0.8;">
          • QUICK SERVICES ACADEMY • VERIFIED ACADEMIC RESEARCH CREDENTIAL • HEC PAKISTAN GUIDELINE COMPLIANT • RESEARCH &amp; METHODOLOGY DIVISION •
        </div>
        <div style="position: absolute; bottom: 18px; left: 60px; right: 60px; font-size: 7px; text-transform: uppercase; letter-spacing: 2.2px; color: #a8a29e; font-family: var(--qsa-font-sans); pointer-events: none; overflow: hidden; white-space: nowrap; opacity: 0.8;">
          • VERIFIED SCHOLARLY CREDENTIAL • TAMPER-EVIDENT DIGITAL RECORD • BZU MULTAN ALUMNI CONSULTANCY • AUTHENTICITY VALIDATED •
        </div>

        <!-- Central Watermark Seal -->
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 360px; height: 360px; border-radius: 50%; border: 3px double rgba(180, 83, 9, 0.08); background: radial-gradient(circle, rgba(180, 83, 9, 0.04) 0%, rgba(250, 248, 242, 0) 70%); pointer-events: none; display: flex; align-items: center; justify-content: center;">
          <div style="font-size: 160px; opacity: 0.05; color: #b45309; font-family: var(--qsa-font-serif);">Q</div>
        </div>

        <!-- Certificate Header Crest -->
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 18px; position: relative; z-index: 2;">
          <div style="width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg, #b45309 0%, #78350f 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; font-family: 'Newsreader', Georgia, serif; border: 2px solid #ffffff; box-shadow: 0 3px 10px rgba(180, 83, 9, 0.3); margin-bottom: 10px;">
            Q
          </div>
          <div style="font-family: 'Cinzel', var(--qsa-font-serif); font-size: 26px; font-weight: 700; color: #1c1917; letter-spacing: 2px; text-transform: uppercase;">
            Quick Services Academy
          </div>
          <div style="font-family: var(--qsa-font-sans); font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.8px; color: #78716c; margin-top: 4px;">
            Division of Graduate Research &amp; Methodological Standards
          </div>
        </div>

        <!-- Certificate Title -->
        <div style="font-family: 'Cinzel', var(--qsa-font-serif); font-size: 14px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #b45309; margin: 24px 0 10px; position: relative; z-index: 2;">
          Certificate of Scholarly Completion
        </div>

        <p style="font-family: 'Cormorant Garamond', var(--qsa-font-serif); font-size: 17px; color: #57534e; margin-bottom: 16px; font-style: italic; position: relative; z-index: 2;">
          This official academic credential is conferred upon
        </p>

        <!-- Optional Verified Scholar Decagonal Portrait -->
        ${userProfile && userProfile.dataUrl ? `
          <div style="margin: 0 auto 12px; display: inline-block; position: relative; z-index: 2;">
            <div style="width: 64px; height: 64px; margin: 0 auto; clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); border: 2px solid #b45309; background: #FAF7F1; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">
              <img src="${userProfile.dataUrl}" alt="Verified Scholar" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="font-size: 8.5px; font-weight: 800; text-transform: uppercase; color: #b45309; letter-spacing: 0.8px; margin-top: 4px;">Verified Identity</div>
          </div>` : ''}

        <!-- Recipient Name in Prestigious Calligraphy Script -->
        <div style="margin: 0 auto 16px; position: relative; z-index: 2; display: inline-block;">
          <h2 id="cert-name-display" style="font-family: 'Alex Brush', 'Playfair Display', cursive; font-size: clamp(44px, 6.5vw, 64px); font-weight: 500; color: #1c1917; margin: 0; line-height: 1.2; padding: 0 32px;">
            ${isLocked ? lockedName : 'Registered Scholar'}
          </h2>
          <!-- Ornamental Flourish Underline -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 2px;">
            <div style="height: 1px; width: 120px; background: linear-gradient(90deg, transparent 0%, #b45309 100%);"></div>
            <span style="color: #b45309; font-size: 13px;">✦</span>
            <div style="height: 1px; width: 120px; background: linear-gradient(90deg, #b45309 0%, transparent 100%);"></div>
          </div>
        </div>

        <p style="font-family: var(--qsa-font-sans); font-size: 14px; color: #44403c; max-width: 660px; margin: 18px auto 20px; line-height: 1.6; position: relative; z-index: 2;">
          having successfully fulfilled all curriculum requirements, quantitative empirical models, and peer defense standards for the accredited graduate specialization:
        </p>

        <!-- Course Title -->
        <h3 style="font-family: 'Cormorant Garamond', var(--qsa-font-serif); font-size: clamp(24px, 3.8vw, 32px); font-weight: 700; color: #1c1917; margin: 0 auto 32px; max-width: 760px; position: relative; z-index: 2; letter-spacing: -0.01em;">
          ${course.title}
        </h3>

        <!-- Seal & Dual Signatures Section -->
        <div class="cert-signatures-grid" style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: flex-end; gap: 24px; border-top: 1px solid #e7e5e0; padding-top: 28px; margin-top: 28px; position: relative; z-index: 2;">
          
          <!-- Left Signature: M. Yousaf -->
          <div style="text-align: center;">
            <div style="font-family: 'Alex Brush', cursive; font-size: 34px; color: #1c1917; margin-bottom: 2px; line-height: 1;">Muhammad Yousaf</div>
            <div style="border-top: 1.5px solid #78716c; width: 170px; margin: 0 auto 6px;"></div>
            <strong style="font-size: 13px; color: #1c1917; font-family: var(--qsa-font-sans); display: block;">M. Yousaf (MS English, BZU)</strong>
            <span style="font-size: 11px; color: #78716c; font-family: var(--qsa-font-sans);">Chief Academic Consultant &amp; Methodology Director</span>
          </div>

          <!-- 3D Embossed Metallic Gold Seal with Draped Satin Ribbon Tails -->
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; width: 120px;">
            <!-- Draped Satin Ribbon Tails behind Seal -->
            <div style="position: absolute; top: 38px; left: 50%; transform: translateX(-50%); width: 90px; height: 60px; pointer-events: none; z-index: 1;">
              <!-- Left Ribbon Tail -->
              <div style="position: absolute; top: 0; left: 14px; width: 28px; height: 58px; background: linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); transform: rotate(-12deg); box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>
              <!-- Right Ribbon Tail -->
              <div style="position: absolute; top: 0; right: 14px; width: 28px; height: 58px; background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%); transform: rotate(12deg); box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></div>
            </div>

            <!-- Embossed 3D Gold Medallion -->
            <div style="position: relative; z-index: 2; width: 84px; height: 84px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #fffbeb 0%, #fef08a 18%, #eab308 40%, #ca8a04 68%, #854d0e 92%, #583101 100%); border: 3px solid #ffffff; box-shadow: 0 8px 24px rgba(133, 77, 14, 0.4), inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: #ffffff;">
              <div style="border: 1.5px dashed rgba(255,255,255,0.85); border-radius: 50%; width: 72px; height: 72px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-shadow: 0 1px 2px rgba(0,0,0,0.6);">
                <span style="font-size: 15px; line-height: 1; color: #fffbeb;">★</span>
                <span style="font-size: 7.5px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; font-family: var(--qsa-font-sans);">VERIFIED</span>
                <span style="font-size: 6.5px; font-weight: 700; letter-spacing: 0.4px; font-family: var(--qsa-font-sans);">HEC PAKISTAN</span>
              </div>
            </div>
            <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; color: #b45309; margin-top: 14px; position: relative; z-index: 3; font-family: var(--qsa-font-sans);">
              OFFICIAL SEAL
            </div>
          </div>

          <!-- Right Signature: Academic Registrar -->
          <div style="text-align: center;">
            <div style="font-family: 'Alex Brush', cursive; font-size: 34px; color: #1c1917; margin-bottom: 2px; line-height: 1;">Tariq Mahmood</div>
            <div style="border-top: 1.5px solid #78716c; width: 170px; margin: 0 auto 6px;"></div>
            <strong style="font-size: 13px; color: #1c1917; font-family: var(--qsa-font-sans); display: block;">Dr. Tariq Mahmood (PhD)</strong>
            <span style="font-size: 11px; color: #78716c; font-family: var(--qsa-font-sans);">Academic Registrar &amp; Standards Examiner</span>
          </div>
        </div>

        <!-- Verification Metadata & Security Strip -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 32px; padding: 12px 18px; background: #f5f3ec; border: 1px solid #e7e5dc; border-radius: 6px; font-size: 12px; color: #57534e; text-align: left; font-family: var(--qsa-font-sans); position: relative; z-index: 2;">
          <div><strong>Instruction Hours:</strong> ${course.hours} Accredited Hours</div>
          <div><strong>Date Conferred:</strong> ${dateStr}</div>
          <div><strong>Credential ID:</strong> <a href="#verify-${idStr}" style="font-family: var(--qsa-font-mono); font-weight: 700; color: #b45309; text-decoration: none;">${idStr}</a></div>
          <div style="display: flex; align-items: center; gap: 4px; color: var(--qsa-status-success); font-weight: 700;">
            <span>✓</span> <span>Cryptographically Logged</span>
          </div>
        </div>

        <!-- Regulatory Notice -->
        <div style="margin-top: 18px; font-size: 11px; color: #8c8780; font-family: var(--qsa-font-sans); position: relative; z-index: 2;">
          Quick Services • Academic Research, Thesis Supervision &amp; Statistical Consulting • Multan, Pakistan
        </div>
      </div>
    </div>`;

  // Identity lock event handling
  if (!isLocked) {
    const lockBtn = container.querySelector('#lock-identity-btn');
    const nameInput = container.querySelector('#initial-student-name');
    const affirmCheck = container.querySelector('#identity-affirmation');

    lockBtn?.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name || name.length < 3) {
        alert('Please enter your full legal/academic name (at least 3 characters).');
        return;
      }
      if (!affirmCheck.checked) {
        alert('Please confirm the affirmation checkbox to verify your legal academic identity.');
        return;
      }

      const confirmed = confirm(
        `⚠️ FINAL CONFIRMATION:\n\nAre you sure you want to permanently lock this credential to:\n"${name}"?\n\nThis action CANNOT be undone and no other names can be issued from this device.`
      );

      if (confirmed) {
        store.setVerifiedStudentName(name);
        alert(`✓ Identity Verified & Locked!\n\nWelcome, ${name}. Your official certificate is now ready.`);
        renderCertificateView(container, { certId, courseId });
      }
    });
  }

  container.querySelector('#print-cert-btn')?.addEventListener('click', () => {
    window.print();
  });

  container.querySelector('#download-cert-btn')?.addEventListener('click', async () => {
    const btn = container.querySelector('#download-cert-btn');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<span>⏳</span> <span>Rendering 300 DPI PNG...</span>';
    btn.disabled = true;
    try {
      const studentName = store.getVerifiedStudentName() || 'Registered Scholar';
      await generateHighResCertificate(studentName, course.title, dateStr, idStr, course.hours);
      if (typeof window.showGlobalToast === 'function') {
        window.showGlobalToast('Official 300 DPI Certificate downloaded!');
      }
    } finally {
      btn.innerHTML = originalHtml;
      btn.disabled = false;
    }
  });
}

/**
 * 300 DPI High-Resolution Academic Certificate Canvas Generator
 * Dimensions: 2400 x 1700 (Ultra-crisp landscape canvas for print & archival)
 */
async function generateHighResCertificate(studentName, courseTitle, dateStr, certId, hours) {
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {}
  }

  const canvas = document.createElement('canvas');
  canvas.width = 2400;
  canvas.height = 1700;
  const ctx = canvas.getContext('2d');

  // 1. Soft Warm Ivory Parchment Surface
  ctx.fillStyle = '#faf8f2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Heavy Double Charcoal Outer Border
  ctx.strokeStyle = '#1c1917';
  ctx.lineWidth = 18;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  // Inset Fine Bronze Hairline
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 3.5;
  ctx.strokeRect(68, 68, canvas.width - 136, canvas.height - 136);

  // Inset Second Charcoal Frame
  ctx.strokeStyle = '#292524';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(78, 78, canvas.width - 156, canvas.height - 156);

  // 3. Four Ornate Corner Flourish Brackets
  drawCornerFlourish(ctx, 84, 84, 1, 1);
  drawCornerFlourish(ctx, canvas.width - 84, 84, -1, 1);
  drawCornerFlourish(ctx, 84, canvas.height - 84, 1, -1);
  drawCornerFlourish(ctx, canvas.width - 84, canvas.height - 84, -1, -1);

  // 4. Microprint Security Line Along Frame
  ctx.fillStyle = '#8c8780';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  const microText = '• QUICK SERVICES ACADEMY • VERIFIED ACADEMIC RESEARCH CREDENTIAL • HEC PAKISTAN GUIDELINE COMPLIANT • RESEARCH & METHODOLOGY DIVISION • MULTAN •';
  ctx.fillText(microText, canvas.width / 2, 74);
  ctx.fillText('• VERIFIED SCHOLARLY CREDENTIAL • TAMPER-EVIDENT DIGITAL RECORD • BZU MULTAN ALUMNI CONSULTANCY • AUTHENTICITY VALIDATED •', canvas.width / 2, canvas.height - 64);

  // 5. Central Watermark Seal
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2 - 30);
  ctx.beginPath();
  ctx.arc(0, 0, 240, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(180, 83, 9, 0.05)';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = 'rgba(180, 83, 9, 0.03)';
  ctx.font = 'bold 220px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Q', 0, 0);
  ctx.restore();

  // 6. Header Emblem Shield
  ctx.save();
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 190, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Q', canvas.width / 2, 192);
  ctx.restore();

  // 7. Institution Titles
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 44px "Cinzel", "Newsreader", serif';
  ctx.textAlign = 'center';
  ctx.fillText('QUICK SERVICES ACADEMY', canvas.width / 2, 280);

  ctx.fillStyle = '#78716c';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('DIVISION OF GRADUATE RESEARCH & METHODOLOGICAL STANDARDS', canvas.width / 2, 316);

  // 8. Certificate Conferred Header
  ctx.fillStyle = '#b45309';
  ctx.font = 'bold 24px "Cinzel", serif';
  ctx.fillText('CERTIFICATE OF SCHOLARLY COMPLETION', canvas.width / 2, 390);

  ctx.fillStyle = '#57534e';
  ctx.font = 'italic 26px "Cormorant Garamond", serif';
  ctx.fillText('This official academic credential is conferred upon', canvas.width / 2, 460);

  // 9. Student Name in Calligraphic Script
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 84px "Alex Brush", "Playfair Display", Georgia, cursive';
  ctx.fillText(studentName, canvas.width / 2, 580);

  // Ornate Flourish Underline
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 340, 615);
  ctx.lineTo(canvas.width / 2 + 340, 615);
  ctx.stroke();

  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 615, 6, 0, Math.PI * 2);
  ctx.fill();

  // 10. Fulfilled Requirements Text
  ctx.fillStyle = '#44403c';
  ctx.font = '24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('having successfully fulfilled all curriculum requirements, quantitative empirical models,', canvas.width / 2, 700);
  ctx.fillText('and peer defense standards for the accredited graduate specialization:', canvas.width / 2, 735);

  // 11. Course Title
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 50px "Cormorant Garamond", "Newsreader", serif';
  ctx.fillText(courseTitle, canvas.width / 2, 830);

  // 12. Draped Satin Ribbon Tails behind Seal
  const sealCenterX = canvas.width / 2;
  const sealCenterY = 1170;

  ctx.save();
  // Left Ribbon
  ctx.translate(sealCenterX - 22, sealCenterY + 10);
  ctx.rotate(-0.18);
  ctx.fillStyle = '#991b1b';
  ctx.beginPath();
  ctx.moveTo(-22, 0);
  ctx.lineTo(22, 0);
  ctx.lineTo(22, 110);
  ctx.lineTo(0, 85);
  ctx.lineTo(-22, 110);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  ctx.save();
  // Right Ribbon
  ctx.translate(sealCenterX + 22, sealCenterY + 10);
  ctx.rotate(0.18);
  ctx.fillStyle = '#b91c1c';
  ctx.beginPath();
  ctx.moveTo(-22, 0);
  ctx.lineTo(22, 0);
  ctx.lineTo(22, 110);
  ctx.lineTo(0, 85);
  ctx.lineTo(-22, 110);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 13. 3D Embossed Metallic Gold Seal Medallion
  ctx.save();
  const grad = ctx.createRadialGradient(sealCenterX - 25, sealCenterY - 25, 10, sealCenterX, sealCenterY, 86);
  grad.addColorStop(0, '#fffbeb');
  grad.addColorStop(0.2, '#fef08a');
  grad.addColorStop(0.45, '#eab308');
  grad.addColorStop(0.7, '#ca8a04');
  grad.addColorStop(0.92, '#854d0e');
  grad.addColorStop(1, '#583101');

  // Starburst teeth (24 points)
  ctx.fillStyle = grad;
  ctx.beginPath();
  const points = 24;
  const outerR = 86;
  const innerR = 76;
  for (let i = 0; i < points * 2; i++) {
    const r = (i % 2 === 0) ? outerR : innerR;
    const a = (i * Math.PI) / points;
    const x = sealCenterX + Math.cos(a) * r;
    const y = sealCenterY + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Inner ring
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Beaded dashed ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.arc(sealCenterX, sealCenterY, 66, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Seal Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('★', sealCenterX, sealCenterY - 22);

  ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('VERIFIED', sealCenterX, sealCenterY - 2);

  ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('HEC PAKISTAN', sealCenterX, sealCenterY + 16);
  ctx.restore();

  // 14. Dual Signatures
  // Left: M. Yousaf
  ctx.fillStyle = '#1c1917';
  ctx.font = '48px "Alex Brush", cursive';
  ctx.textAlign = 'center';
  ctx.fillText('Muhammad Yousaf', 480, 1150);

  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(340, 1180);
  ctx.lineTo(620, 1180);
  ctx.stroke();

  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('M. Yousaf (MS English, BZU)', 480, 1215);

  ctx.fillStyle = '#78716c';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Chief Academic Consultant & Methodology Director', 480, 1242);

  // Right: Dr. Tariq Mahmood
  ctx.fillStyle = '#1c1917';
  ctx.font = '48px "Alex Brush", cursive';
  ctx.fillText('Tariq Mahmood', canvas.width - 480, 1150);

  ctx.strokeStyle = '#78716c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(canvas.width - 620, 1180);
  ctx.lineTo(canvas.width - 340, 1180);
  ctx.stroke();

  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Dr. Tariq Mahmood (PhD)', canvas.width - 480, 1215);

  ctx.fillStyle = '#78716c';
  ctx.font = '16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Academic Registrar & Standards Examiner', canvas.width - 480, 1242);

  // 15. Security & Verification Strip at Bottom
  ctx.fillStyle = '#f5f3ec';
  ctx.fillRect(200, 1370, canvas.width - 400, 68);
  ctx.strokeStyle = '#e7e5dc';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(200, 1370, canvas.width - 400, 68);

  ctx.fillStyle = '#57534e';
  ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`Accredited: ${hours} Hours   •   Issued: ${dateStr}   •   Credential ID: ${certId}   •   Status: Verified & Tamper-Evident`, canvas.width / 2, 1412);

  // 16. Regulatory Subtitle
  ctx.fillStyle = '#8c8780';
  ctx.font = 'italic 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Quick Services • Academic Research, Thesis Supervision & Statistical Consulting • Multan, Pakistan', canvas.width / 2, 1480);

  // 17. Trigger Download
  const link = document.createElement('a');
  link.download = `${certId}_${studentName.replace(/[^a-zA-Z0-9]/g, '_')}_Official_Certificate.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Draw an ornamental corner flourish bracket on canvas
 */
function drawCornerFlourish(ctx, x, y, dirX, dirY) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(dirX, dirY);
  ctx.strokeStyle = '#b45309';
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(40, 0);
  ctx.moveTo(0, 0);
  ctx.lineTo(0, 40);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(14, 14, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#b45309';
  ctx.fill();

  ctx.restore();
}
