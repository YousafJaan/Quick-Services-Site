#!/usr/bin/env python3
"""
tools/build_guide.py
Builds the complete, persuasive, 27-page "Research Student's Field Guide" PDF for Quick Services.

Usage:
    python tools/build_guide.py

Requirements:
    pip install qrcode pillow pypdf
    Google Chrome installed (used for pixel-perfect PDF rendering)
"""

import os
import subprocess
import qrcode
import pypdf

SITE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(SITE_DIR, "assets")
TOOLS_DIR = os.path.join(SITE_DIR, "tools")
PDF_OUTPUT = os.path.join(ASSETS_DIR, "Research-Student-Field-Guide.pdf")
QR_PATH = os.path.join(ASSETS_DIR, "qr-whatsapp.png")
HTML_TEMP = os.path.join(TOOLS_DIR, "guide_print.html")

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    # Fallback search
    for p in [r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
              os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")]:
        if os.path.exists(p):
            CHROME_PATH = p
            break

def ensure_qr():
    if not os.path.exists(QR_PATH):
        qr = qrcode.QRCode(version=1, box_size=10, border=2)
        qr.add_data("https://wa.me/923296646824")
        qr.make(fit=True)
        img = qr.make_image(fill_color="#0a0f1c", back_color="#ffffff")
        img.save(QR_PATH)
        print("Generated QR code at:", QR_PATH)

def build_pdf():
    ensure_qr()
    print("Generating printable HTML layout for 27-page Field Guide...")
    
    # We will write the full guide HTML template
    import guide_content
    html = guide_content.get_html(QR_PATH.replace("\\", "/"))
    
    with open(HTML_TEMP, "w", encoding="utf-8") as f:
        f.write(html)
        
    print("Calling Chrome headless to print vector A4 PDF...")
    temp_pdf = os.path.join(TOOLS_DIR, "temp_guide.pdf")
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={temp_pdf}",
        HTML_TEMP
    ]
    subprocess.run(cmd, check=True)
    
    print("Applying PDF metadata and bookmarks with pypdf...")
    reader = pypdf.PdfReader(temp_pdf)
    writer = pypdf.PdfWriter()
    
    for page in reader.pages:
        writer.add_page(page)
        
    writer.add_metadata({
        "/Title": "The Research Student's Field Guide",
        "/Author": "M. Yousaf, Quick Services",
        "/Subject": "Academic Support & Research Consulting - From Topic to Viva",
        "/Keywords": "academic research, thesis, dissertation, SPSS, SmartPLS, methodology, literature search, formatting, viva defense",
        "/Creator": "Quick Services Publication Engine"
    })
    
    with open(PDF_OUTPUT, "wb") as f:
        writer.write(f)
        
    if os.path.exists(temp_pdf):
        os.remove(temp_pdf)
    if os.path.exists(HTML_TEMP):
        os.remove(HTML_TEMP)
        
    file_size_mb = os.path.getsize(PDF_OUTPUT) / (1024 * 1024)
    page_count = len(reader.pages)
    print(f"\nSUCCESS: Generated {PDF_OUTPUT}")
    print(f"Total Pages: {page_count} (Requirement: 24 to 32)")
    print(f"File Size: {file_size_mb:.2f} MB (Requirement: under 3 MB)")

if __name__ == "__main__":
    build_pdf()
