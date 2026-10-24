/**
 * Quick Services Academy — Certificate Issuance & Verification Engine
 * Generates high-resolution canvas PNG exports, print views, and verification records.
 */

import { store } from './store.js';

export function renderCertificateView(container, { certId, courseId }) {
  const courses = [
    { id: 'thesis101', title: 'Thesis Writing 101', hours: 3.5 },
    { id: 'cite101', title: 'Citations & Referencing', hours: 3.0 },
    { id: 'integrity101', title: 'Academic Integrity & Similarity Reports', hours: 2.8 },
    { id: 'edit101', title: 'Proofreading & Academic Editing', hours: 3.2 },
    { id: 'lit-search', title: 'Literature Search with Zotero', hours: 3.2 },
    { id: 'sample-size', title: 'Sample Size & Research Methodology', hours: 3.8 },
    { id: 'spss101', title: 'SPSS Basics for Research Students', hours: 4.2 },
    { id: 'smartpls', title: 'SmartPLS & SEM Introduction', hours: 4.0 },
    { id: 'viva', title: 'Viva & Presentation Coaching', hours: 2.8 }
  ];

  const course = courses.find(c => c.id === (courseId || 'thesis101')) || courses[0];
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const idStr = certId || `QSA-${course.id.toUpperCase()}-${new Date().toISOString().slice(0,7).replace('-','')}-${Math.random().toString(36).substring(2,7).toUpperCase()}`;

  container.innerHTML = `
    <div class="wrap" style="padding: 48px 20px 80px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
        <a href="#certificates" style="color: var(--qsa-accent-peach); font-size: 14px; font-weight: 700;">
          ← Back to All Certificates
        </a>
        <div style="display: flex; gap: 12px;">
          <button type="button" class="btn btn-secondary btn-sm" id="print-cert-btn">🖨️ Print Certificate</button>
          <button type="button" class="btn btn-primary btn-sm" id="download-cert-btn">📥 Download PNG</button>
        </div>
      </div>

      <!-- Editable Name Input -->
      <div style="background: var(--qsa-bg-card-dark); border: 1px solid var(--qsa-border-dark); border-radius: 14px; padding: 16px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
        <label style="font-size: 14px; font-weight: 700; color: var(--qsa-text-dark-secondary);">Recipient Full Name:</label>
        <input type="text" id="cert-student-name" value="Muhammad Yousaf" style="padding: 8px 16px; border-radius: var(--qsa-radius-pill); border: 1.5px solid var(--qsa-accent-orange); background: #ffffff; color: var(--qsa-bg-dark); font-weight: 700; font-size: 15px; min-width: 260px;">
      </div>

      <!-- Certificate Visual Container -->
      <div id="certificate-stage" style="background: #ffffff; color: #0a0f1c; border-radius: 20px; border: 8px double #1e293b; padding: 48px 36px; max-width: 840px; margin: 0 auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5); text-align: center; position: relative;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px;">
          <span style="width: 44px; height: 44px; border-radius: 12px; background: #ff6b2c; color: #0a0f1c; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800;">Q</span>
          <span style="font-family: var(--qsa-font-display); font-size: 26px; font-weight: 800; color: #0a0f1c;">Quick Services Academy</span>
        </div>

        <div style="font-size: 13px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #ff6b2c; margin-bottom: 12px;">
          Certificate of Completion
        </div>

        <p style="font-size: 15px; color: #475569; margin-bottom: 24px;">This is to certify that</p>

        <h2 id="cert-name-display" style="font-family: var(--qsa-font-display); font-size: clamp(32px, 6vw, 48px); font-weight: 800; color: #0a0f1c; margin: 0 0 20px 0; border-bottom: 2px solid #ff6b2c; display: inline-block; padding-bottom: 6px;">
          Muhammad Yousaf
        </h2>

        <p style="font-size: 15px; color: #475569; margin: 0 0 16px 0;">has successfully completed all modules, interactive exercises, and final comprehensive examination for</p>

        <h3 style="font-size: 26px; font-weight: 800; color: #0a0f1c; margin: 0 0 24px 0;">
          ${course.title}
        </h3>

        <div style="display: flex; justify-content: space-around; border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px; font-size: 13.5px; color: #64748b;">
          <div>
            <strong>Verified Hours:</strong><br>${course.hours} Hours of Instruction
          </div>
          <div>
            <strong>Date Issued:</strong><br>${dateStr}
          </div>
          <div>
            <strong>Certificate ID:</strong><br><code>${idStr}</code>
          </div>
        </div>

        <div style="margin-top: 28px; font-size: 12px; color: #94a3b8; font-style: italic;">
          Quick Services • Academic Support & Research Consulting • Multan, Pakistan
        </div>
      </div>
    </div>`;

  const nameInput = container.querySelector('#cert-student-name');
  const nameDisplay = container.querySelector('#cert-name-display');
  nameInput.addEventListener('input', () => {
    nameDisplay.innerText = nameInput.value || 'Student Name';
  });

  container.querySelector('#print-cert-btn').addEventListener('click', () => {
    window.print();
  });

  container.querySelector('#download-cert-btn').addEventListener('click', () => {
    generateCertificateCanvas(nameInput.value || 'Student Name', course.title, dateStr, idStr, course.hours);
  });
}

function generateCertificateCanvas(studentName, courseTitle, dateStr, certId, hours) {
  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1130;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer Double Border
  ctx.strokeStyle = '#0a0f1c';
  ctx.lineWidth = 12;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  ctx.strokeStyle = '#ff6b2c';
  ctx.lineWidth = 4;
  ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

  // Logo Q Mark
  ctx.fillStyle = '#ff6b2c';
  ctx.beginPath();
  ctx.roundRect(750, 100, 100, 100, 24);
  ctx.fill();

  ctx.fillStyle = '#0a0f1c';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Q', 800, 172);

  // Institution Title
  ctx.fillStyle = '#0a0f1c';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText('Quick Services Academy', 800, 260);

  // Subtitle
  ctx.fillStyle = '#ff6b2c';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('CERTIFICATE OF COMPLETION', 800, 310);

  ctx.fillStyle = '#64748b';
  ctx.font = '26px sans-serif';
  ctx.fillText('This is to certify that', 800, 390);

  // Student Name
  ctx.fillStyle = '#0a0f1c';
  ctx.font = 'bold 60px sans-serif';
  ctx.fillText(studentName, 800, 480);

  // Underline
  ctx.strokeStyle = '#ff6b2c';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(400, 510);
  ctx.lineTo(1200, 510);
  ctx.stroke();

  // Achievement text
  ctx.fillStyle = '#64748b';
  ctx.font = '26px sans-serif';
  ctx.fillText('has successfully completed all modules and final examination for', 800, 580);

  // Course Title
  ctx.fillStyle = '#0a0f1c';
  ctx.font = 'bold 46px sans-serif';
  ctx.fillText(courseTitle, 800, 660);

  // Metadata Footer
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText(`Recorded Study: ${hours} Hours`, 400, 850);
  ctx.fillText(`Issued: ${dateStr}`, 800, 850);
  ctx.fillText(`ID: ${certId}`, 1200, 850);

  // Attribution
  ctx.fillStyle = '#94a3b8';
  ctx.font = 'italic 20px sans-serif';
  ctx.fillText('Quick Services • Academic Support & Research Consulting • Multan, Pakistan', 800, 960);

  // Trigger Download
  const link = document.createElement('a');
  link.download = `${certId}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
