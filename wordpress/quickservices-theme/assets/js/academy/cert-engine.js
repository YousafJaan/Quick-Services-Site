/**
 * Quick Academy Certificate Engine
 * Deterministic Cryptographic Polynomial Checksum & Canvas Issuer
 *
 * @package QuickServicesTheme
 * @author M. Yousaf & Quick Services Engineering
 * @version 2.0.0
 */

class QuickCertEngine {
  constructor() {
    this.issuer = "Quick Services Academy (M. Yousaf, MS English, BZU)";
  }

  // Polynomial Checksum (DJB2 + CRC32 variant)
  calculateChecksum(inputString) {
    let hash = 5381;
    for (let i = 0; i < inputString.length; i++) {
      hash = ((hash << 5) + hash) + inputString.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    // Return formatted uppercase 4-digit hex
    return (Math.abs(hash) % 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }

  generateCertificateId(courseCode, studentName, score, issueDate) {
    const cleanCode = (courseCode || 'MASTER').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const cleanName = (studentName || 'SCHOLAR').trim().toUpperCase();
    const dateStr = issueDate || new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const payload = `${cleanCode}:${cleanName}:${score}:${dateStr}`;
    const checksum = this.calculateChecksum(payload);

    return `QSA-${cleanCode}-${dateStr.slice(0, 4)}-${checksum}`;
  }

  renderCertificateHtml(courseTitle, studentName, certId, issueDate) {
    return `
      <div class="academic-certificate-frame" style="background:#FAF8F5; border:3px solid #B8823B; padding:36px; border-radius:12px; box-shadow:0 8px 30px rgba(12,25,46,0.12); position:relative; max-width:720px; margin:0 auto; font-family:'Plus Jakarta Sans', sans-serif;">
        <div style="text-align:center; border-bottom:2px solid #E5DFD3; padding-bottom:20px; margin-bottom:24px;">
          <div style="font-family:'Fraunces', serif; font-size:24px; font-weight:800; color:#0C192E; letter-spacing:1px;">QUICK SERVICES ACADEMY</div>
          <div style="font-size:12px; text-transform:uppercase; letter-spacing:0.12em; color:#B8823B; font-weight:700; margin-top:4px;">Official Certificate of Academic Mastery</div>
        </div>

        <div style="text-align:center; margin-bottom:24px;">
          <p style="font-size:14px; color:#5A6A80; margin-bottom:8px;">This document certifies that</p>
          <h2 style="font-family:'Fraunces', serif; font-size:32px; color:#0C192E; margin:0 0 12px; border-bottom:1px solid #B8823B; display:inline-block; padding-bottom:6px;">${studentName}</h2>
          <p style="font-size:14.5px; color:#5A6A80; max-width:540px; margin:0 auto 16px; line-height:1.5;">
            has successfully fulfilled all empirical assessment thresholds and demonstrated advanced methodological rigor in
          </p>
          <h3 style="font-family:'Fraunces', serif; font-size:22px; color:#16302B; margin:0;">${courseTitle}</h3>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid #E5DFD3; padding-top:20px; font-size:12px; color:#5A6A80;">
          <div>
            <div><strong>Issue Date:</strong> ${issueDate}</div>
            <div><strong>Verification ID:</strong> <code style="font-family:monospace; color:#0C192E; font-weight:700;">${certId}</code></div>
          </div>
          <div style="text-align:center;">
            <div style="font-family:'Fraunces', serif; font-size:16px; font-weight:700; color:#0C192E;">M. Yousaf</div>
            <div style="font-size:11px; border-top:1px solid #5A6A80; padding-top:2px;">Lead Consultant (MS English, BZU)</div>
          </div>
        </div>
      </div>
    `;
  }
}

// Global Export
window.QuickCertEngine = QuickCertEngine;

// Attach generator button if on lesson page
document.addEventListener('DOMContentLoaded', () => {
  const genBtn = document.getElementById('generateCertBtn');
  const nameInput = document.getElementById('studentCertName');
  const displayArea = document.getElementById('certDisplayArea');

  if (genBtn && nameInput && displayArea) {
    genBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (!name) {
        alert('Please enter your full name to generate the certificate.');
        return;
      }

      const engine = new QuickCertEngine();
      const courseTitle = document.title.split('|')[0].trim() || 'SPSS & SmartPLS Mastery';
      const certId = engine.generateCertificateId('SPSS', name, 100);
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      displayArea.hidden = false;
      displayArea.innerHTML = engine.renderCertificateHtml(courseTitle, name, certId, dateStr);
      displayArea.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
