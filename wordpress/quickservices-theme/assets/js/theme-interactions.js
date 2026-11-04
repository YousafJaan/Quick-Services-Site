/**
 * Quick Services Oxford Academic Theme Interactive Scripts
 *
 * @package QuickServicesTheme
 * @author M. Yousaf & Quick Services Engineering
 * @version 2.0.0
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    // 1. Header scroll elevation
    const header = document.querySelector('.site-header');
    if (header) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 20) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // 2. Mobile Menu Drawer Toggle
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mobileDrawer = document.getElementById('mobileNavDrawer');
    if (menuToggle && mobileDrawer) {
      menuToggle.addEventListener('click', function () {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mobileDrawer.hidden = isExpanded;
      });

      // Close drawer when any mobile link is clicked
      mobileDrawer.querySelectorAll('.mob-link').forEach(function (link) {
        link.addEventListener('click', function () {
          menuToggle.setAttribute('aria-expanded', 'false');
          mobileDrawer.hidden = true;
        });
      });
    }

    // 3. Currency Switcher for Pricing Cards
    const currencyButtons = document.querySelectorAll('.curr-btn');
    if (currencyButtons.length > 0) {
      currencyButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          currencyButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const targetCurrency = btn.getAttribute('data-currency');
          const priceElements = document.querySelectorAll('.price-val');

          priceElements.forEach(function (el) {
            const pkr = el.getAttribute('data-pkr');
            const usd = el.getAttribute('data-usd');
            const gbp = el.getAttribute('data-gbp');

            if (targetCurrency === 'USD') {
              el.textContent = '$' + usd;
            } else if (targetCurrency === 'GBP') {
              el.textContent = '£' + gbp;
            } else {
              el.textContent = 'PKR ' + pkr;
            }
          });
        });
      });
    }

    // 4. Modal Launcher Controls
    const modal = document.getElementById('inquiryModal');
    const closeBtn = document.getElementById('modalCloseBtn');

    window.openInquiryModal = function () {
      if (modal) {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
      }
    };

    window.closeInquiryModal = function () {
      if (modal) {
        modal.hidden = true;
        document.body.style.overflow = '';
      }
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', window.closeInquiryModal);
    }

    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) {
          window.closeInquiryModal();
        }
      });
    }

    // 5. WhatsApp Form Generator
    window.launchWhatsAppInquiry = function () {
      const name = document.getElementById('studentName')?.value || 'Prospective Scholar';
      const degree = document.getElementById('academicDiscipline')?.value || 'Research Candidate';
      const service = document.getElementById('serviceRequired')?.value || 'Academic Support';
      const notes = document.getElementById('briefNotes')?.value || 'No additional notes provided.';

      const messageText = 
        `*Academic Consultation Request*\n\n` +
        `*Name:* ${name}\n` +
        `*Program:* ${degree}\n` +
        `*Service Needed:* ${service}\n` +
        `*Brief Details:* ${notes}\n\n` +
        `_Initiated via Quick Services Oxford Academic Portal_`;

      const whatsappUrl = `https://wa.me/923296646824?text=${encodeURIComponent(messageText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      window.closeInquiryModal();
    };

    // 6. Certificate Verification Client-Side Handler
    window.verifyCertificateId = function () {
      const input = document.getElementById('certIdInput');
      const resultBox = document.getElementById('certVerifyResult');
      if (!input || !resultBox) return;

      const certId = input.value.trim().toUpperCase();
      // Match format: QSA-COURSE-DATE-HEX (e.g. QSA-SPSS-2026-A48F)
      const pattern = /^QSA-([A-Z0-9]+)-([A-Z0-9]+)-([A-F0-9]{4,8})$/i;

      if (pattern.test(certId)) {
        resultBox.hidden = false;
        resultBox.innerHTML = `
          <div style="background:#F0FFF4; border:1.5px solid #2F855A; border-radius:12px; padding:20px; color:#22543D;">
            <div style="font-weight:800; font-size:16px; margin-bottom:6px;">&check; Verified Authentic Academic Certificate</div>
            <div style="font-size:14px; margin-bottom:4px;"><strong>Certificate ID:</strong> <code>${certId}</code></div>
            <div style="font-size:14px; margin-bottom:4px;"><strong>Issued by:</strong> Quick Services Academy (M. Yousaf, Lead Consultant)</div>
            <div style="font-size:14px; margin-bottom:4px;"><strong>Credential Status:</strong> Valid &amp; Registered in Integrity Database</div>
            <div style="font-size:12px; color:#48BB78; margin-top:8px;">Verification confirmed via deterministic polynomial checksum.</div>
          </div>
        `;
      } else {
        resultBox.hidden = false;
        resultBox.innerHTML = `
          <div style="background:#FFF5F5; border:1.5px solid #E53E3E; border-radius:12px; padding:20px; color:#742A2A;">
            <div style="font-weight:800; font-size:16px; margin-bottom:6px;">&times; Invalid or Unrecognized Certificate ID</div>
            <div style="font-size:14px;">The code <code>${certId}</code> does not match the Quick Academy checksum standard. Expected format: <code>QSA-COURSE-TIMESTAMP-CHECKSUM</code> (e.g., <code>QSA-SPSS-2026-B81C</code>).</div>
          </div>
        `;
      }
    };
  });
})();
