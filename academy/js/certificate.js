/**
 * Quick Services Academy — Certificate Issuance & Verification Engine
 * Features One-Time Learner Identity Locking (prevents unauthorized renaming & duplicate forging),
 * High-Resolution Guilloché Academic Canvas Rendering, HEC Compliance Watermarking, and Verifiable IDs.
 */

import { store } from './store.js';

export function renderCertificateView(container, { certId, courseId }) {
  const courses = [
    { id: 'thesis101', title: 'Thesis Writing 101', hours: 3.5, code: 'THESIS' },
    { id: 'cite101', title: 'Citations & Referencing', hours: 3.0, code: 'CITE' },
    { id: 'integrity101', title: 'Academic Integrity & Similarity Reports', hours: 2.8, code: 'INTEG' },
    { id: 'edit101', title: 'Proofreading & Academic Editing', hours: 3.2, code: 'EDIT' },
    { id: 'lit-search', title: 'Literature Search with Zotero', hours: 3.2, code: 'SEARCH' },
    { id: 'sample-size', title: 'Sample Size & Research Methodology', hours: 3.8, code: 'SAMPLE' },
    { id: 'spss101', title: 'SPSS Basics for Research Students', hours: 4.2, code: 'SPSS' },
    { id: 'smartpls', title: 'SmartPLS & SEM Introduction', hours: 4.0, code: 'PLS' },
    { id: 'viva', title: 'Viva & Presentation Coaching', hours: 2.8, code: 'VIVA' }
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

  container.innerHTML = `
    <div class="wrap" style="padding: 40px 20px 80px; max-width: 980px;">
      <!-- Action Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
        <a href="#certificates" class="reader-back-btn" style="text-decoration: none;">
          <span style="font-size: 15px;">←</span> <span>All Certificates</span>
        </a>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button type="button" class="btn btn-secondary btn-sm" id="print-cert-btn">🖨️ Print Certificate</button>
          <button type="button" class="btn btn-primary btn-sm" id="download-cert-btn">📥 Download Official PNG</button>
        </div>
      </div>

      <!-- Identity Verification & One-Time Name Putting Card -->
      ${!isLocked ? `
        <div class="identity-lock-card" id="identity-lock-section" style="background: #ffffff; border: 1.5px solid var(--qsa-accent-clay); border-radius: var(--qsa-radius-card); padding: 24px 28px; margin-bottom: 32px; box-shadow: 0 4px 18px rgba(217, 119, 87, 0.12);">
          <div style="display: flex; align-items: flex-start; gap: 16px;">
            <div style="font-size: 32px; flex-shrink: 0;">🛡️</div>
            <div style="flex: 1;">
              <h3 style="font-size: 18px; margin: 0 0 6px 0; color: var(--qsa-text-primary); font-family: var(--qsa-font-serif);">
                Official Learner Identity Verification
              </h3>
              <p style="font-size: 13.5px; color: var(--qsa-text-secondary); margin: 0 0 16px 0; line-height: 1.6;">
                <strong>⚠️ Strict Academic Credential Policy:</strong> To prevent duplicate, fraudulent, or inappropriate certificate generation, your name will be <strong>permanently bound</strong> to your verifiable Certificate ID and this device. Once confirmed, this name <strong>cannot be modified or transferred</strong>.
              </p>
              
              <div style="display: flex; flex-direction: column; gap: 12px; max-width: 540px;">
                <label style="font-size: 12.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--qsa-text-muted);">
                  Full Official Academic / Legal Name:
                </label>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <input type="text" id="initial-student-name" placeholder="e.g. Dr. Muhammad Yousaf" style="flex: 1; min-width: 260px; padding: 10px 16px; border: 1.5px solid var(--qsa-border-strong); border-radius: var(--qsa-radius-pill); font-size: 15px; font-weight: 600; outline: none; background: #ffffff;">
                  <button type="button" class="btn btn-primary btn-sm" id="lock-identity-btn" style="white-space: nowrap;">
                    🔒 Confirm &amp; Lock Identity Permanently
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
        <div class="identity-verified-card" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: var(--qsa-radius-card); padding: 16px 24px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: #16a34a; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800;">
              ✓
            </div>
            <div>
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #15803d; letter-spacing: 0.6px;">
                Permanent Academic Record Verified &amp; Locked
              </div>
              <strong style="font-size: 16px; color: #14532d;">${lockedName}</strong>
              <span style="font-size: 12px; color: #166534; margin-left: 8px; font-family: 'SF Mono', monospace;">(${regId})</span>
            </div>
          </div>
          <span class="tag tag-clay" style="font-size: 11px;">🔒 Identity Non-Transferable</span>
        </div>
      `}

      <!-- Prestigious Certificate Canvas Display -->
      <div id="certificate-stage" style="background: #fffdf9; color: #1c1917; border-radius: 16px; border: 10px double #292524; padding: 56px 42px; box-shadow: 0 16px 48px rgba(0,0,0,0.14); text-align: center; position: relative; overflow: hidden;">
        <!-- Watermark Guilloché BG -->
        <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, rgba(217,119,87,0.04) 0%, rgba(255,255,255,0) 70%); pointer-events: none;"></div>

        <!-- Certificate Header -->
        <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--qsa-accent-clay); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 800; font-family: var(--qsa-font-sans); box-shadow: 0 4px 12px rgba(217,119,87,0.25);">
            Q
          </div>
          <div style="text-align: left;">
            <div style="font-family: var(--qsa-font-serif); font-size: 24px; font-weight: 600; color: #1c1917; letter-spacing: -0.02em;">Quick Services Academy</div>
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #78716c;">Academic Research &amp; Dissertation Consulting</div>
          </div>
        </div>

        <div style="font-size: 13px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase; color: var(--qsa-accent-clay); margin: 24px 0 10px;">
          Certificate of Scholarly Completion
        </div>

        <p style="font-size: 15px; color: #78716c; margin-bottom: 20px; font-style: italic;">This is to certify that</p>

        <!-- Recipient Name -->
        <h2 id="cert-name-display" style="font-family: var(--qsa-font-serif); font-size: clamp(32px, 5vw, 46px); font-weight: 500; color: #1c1917; margin: 0 0 16px 0; border-bottom: 2px solid var(--qsa-accent-clay); display: inline-block; padding: 0 24px 6px;">
          ${isLocked ? lockedName : 'Registered Scholar'}
        </h2>

        <p style="font-size: 15px; color: #57534e; max-width: 620px; margin: 16px auto 24px; line-height: 1.6;">
          has rigorously completed all curriculum modules, interactive conceptual evaluations, and final defense examinations for the accredited specialization:
        </p>

        <h3 style="font-family: var(--qsa-font-serif); font-size: clamp(22px, 3.5vw, 30px); font-weight: 600; color: #1c1917; margin: 0 0 28px 0;">
          ${course.title}
        </h3>

        <!-- Seal & Signatures Grid -->
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 20px; border-top: 1px solid #e7e5e4; padding-top: 28px; margin-top: 36px;">
          <!-- Left Signature -->
          <div style="text-align: center;">
            <div style="font-family: 'Newsreader', Georgia, cursive; font-size: 24px; color: #44403c; margin-bottom: 4px;">Muhammad Yousaf</div>
            <div style="border-top: 1.5px solid #a8a29e; width: 160px; margin: 0 auto 6px;"></div>
            <strong style="font-size: 12px; color: #1c1917;">M. Yousaf</strong><br>
            <span style="font-size: 11px; color: #78716c;">Chief Research Consultant</span>
          </div>

          <!-- Gold Embossed Academic Seal -->
          <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 78px; height: 78px; border-radius: 50%; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border: 3px solid #ffffff; box-shadow: 0 4px 16px rgba(217,119,6,0.35); display: flex; align-items: center; justify-content: center; color: #ffffff; text-align: center;">
              <div style="border: 1px dashed rgba(255,255,255,0.7); border-radius: 50%; width: 68px; height: 68px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <span style="font-size: 16px;">★</span>
                <span style="font-size: 7.5px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase;">VERIFIED</span>
                <span style="font-size: 6.5px; font-weight: 700;">HEC STANDARD</span>
              </div>
            </div>
          </div>

          <!-- Right Signature -->
          <div style="text-align: center;">
            <div style="font-family: 'Newsreader', Georgia, cursive; font-size: 24px; color: #44403c; margin-bottom: 4px;">Academic Council</div>
            <div style="border-top: 1.5px solid #a8a29e; width: 160px; margin: 0 auto 6px;"></div>
            <strong style="font-size: 12px; color: #1c1917;">Registrar Office</strong><br>
            <span style="font-size: 11px; color: #78716c;">Academic Verification Division</span>
          </div>
        </div>

        <!-- Verification Metadata Strip -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 32px; padding: 12px 16px; background: #f5f5f4; border-radius: 8px; font-size: 12px; color: #78716c; text-align: left;">
          <div><strong>Instruction Hours:</strong> ${course.hours} Accredited Hours</div>
          <div><strong>Date Conferred:</strong> ${dateStr}</div>
          <div><strong>Credential ID:</strong> <code style="font-weight: 700; color: var(--qsa-accent-clay);">${idStr}</code></div>
        </div>

        <!-- Regulatory Notice -->
        <div style="margin-top: 20px; font-size: 11px; color: #a8a29e; font-style: italic;">
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

  container.querySelector('#download-cert-btn')?.addEventListener('click', () => {
    const studentName = store.getVerifiedStudentName() || 'Registered Scholar';
    generateHighResCertificate(studentName, course.title, dateStr, idStr, course.hours);
  });
}

function generateHighResCertificate(studentName, courseTitle, dateStr, certId, hours) {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1357;
  const ctx = canvas.getContext('2d');

  // Parchment Background
  ctx.fillStyle = '#fffdfa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer Border Double Guilloché
  ctx.strokeStyle = '#292524';
  ctx.lineWidth = 14;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

  ctx.strokeStyle = '#d97757';
  ctx.lineWidth = 4;
  ctx.strokeRect(68, 68, canvas.width - 136, canvas.height - 136);

  ctx.strokeStyle = '#e7e5e4';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(78, 78, canvas.width - 156, canvas.height - 156);

  // Logo Q Badge
  ctx.fillStyle = '#d97757';
  ctx.beginPath();
  ctx.roundRect(canvas.width / 2 - 45, 120, 90, 90, 20);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Q', canvas.width / 2, 185);

  // Institution Title
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 46px serif';
  ctx.fillText('Quick Services Academy', canvas.width / 2, 260);

  ctx.fillStyle = '#78716c';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('ACADEMIC RESEARCH & DISSERTATION CONSULTING', canvas.width / 2, 296);

  // Subtitle
  ctx.fillStyle = '#d97757';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('CERTIFICATE OF SCHOLARLY COMPLETION', canvas.width / 2, 360);

  ctx.fillStyle = '#78716c';
  ctx.font = 'italic 26px serif';
  ctx.fillText('This is to certify that', canvas.width / 2, 430);

  // Student Name
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 64px serif';
  ctx.fillText(studentName, canvas.width / 2, 530);

  // Underline
  ctx.strokeStyle = '#d97757';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 380, 560);
  ctx.lineTo(canvas.width / 2 + 380, 560);
  ctx.stroke();

  // Achievement Description
  ctx.fillStyle = '#57534e';
  ctx.font = '26px sans-serif';
  ctx.fillText('has rigorously completed all curriculum modules, interactive evaluations, and final defense for', canvas.width / 2, 640);

  // Course Title
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 52px serif';
  ctx.fillText(courseTitle, canvas.width / 2, 730);

  // Signatures
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 26px serif';
  ctx.fillText('M. Yousaf', 450, 980);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#78716c';
  ctx.fillText('Chief Research Consultant', 450, 1010);
  ctx.strokeStyle = '#a8a29e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(300, 940);
  ctx.lineTo(600, 940);
  ctx.stroke();

  // Gold Seal in Canvas Center
  ctx.fillStyle = '#d97706';
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 970, 70, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('★ VERIFIED ★', canvas.width / 2, 965);
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('HEC STANDARD', canvas.width / 2, 988);

  // Right Signature
  ctx.fillStyle = '#1c1917';
  ctx.font = 'bold 26px serif';
  ctx.fillText('Registrar Office', canvas.width - 450, 980);
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#78716c';
  ctx.fillText('Academic Verification Council', canvas.width - 450, 1010);
  ctx.beginPath();
  ctx.moveTo(canvas.width - 600, 940);
  ctx.lineTo(canvas.width - 300, 940);
  ctx.stroke();

  // Bottom Metadata
  ctx.fillStyle = '#44403c';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`Accredited Hours: ${hours} Hours  •  Issued: ${dateStr}  •  Certificate ID: ${certId}`, canvas.width / 2, 1150);

  ctx.fillStyle = '#a8a29e';
  ctx.font = 'italic 18px sans-serif';
  ctx.fillText('Quick Services • Academic Support & Research Consulting • Multan, Pakistan', canvas.width / 2, 1220);

  // Trigger download
  const link = document.createElement('a');
  link.download = `${certId}_${studentName.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
