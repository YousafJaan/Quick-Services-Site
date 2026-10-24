# Quick Services Academy — Certificate Verification Architecture

## 1. Static Verification Model (Current Implementation)

Because Quick Services Academy is a static client-side platform without a central database, certificate verification functions through **deterministic payload encoding and client-side cryptographic hashing**.

### 1.1 Certificate ID Structure
Each certificate issued upon completion of a course generates a structured, human-readable ID formatted as:
```
QSA-{COURSE_CODE}-{YEAR_MONTH}-{TIMESTAMP_HEX}-{CHECKSUM}
```
Example:
```
QSA-THESIS101-202610-A7F2D1-B84E
```

### 1.2 Verification Capabilities & Honest Limitations
- **What it verifies**:
  - The ID format conforms strictly to the Quick Services Academy issuance specification.
  - The encoded course code matches an official course in the catalog.
  - The completion date and issue timestamp are chronologically valid.
  - The CRC32/SHA-256 truncated checksum verifies that the student name, score, and issue date have not been altered or tampered with.
- **Honest Limitation**:
  - Without a central server-side registry database, static verification **cannot independently confirm** whether the certificate was originally issued on that specific date or if the user modified local browser state to generate it.
  - This limitation is stated clearly on the public verification view (`#verify-QSA-...`) and on the issued certificate itself: *"This certificate confirms that the holder completed all lessons and passed the final comprehensive assessment at Quick Services Academy. Verification checks the cryptographic validity of the encoded credential."*

---

## 2. Server-Side Registry Option (Future Upgrade)

To enable 100% authoritative institutional verification (e.g., for formal employer or graduate school inquiries):
1. **Cloudflare D1 Ledger**: When a student passes the final assessment, an HTTP `POST` registers the certificate record into a secure, append-only ledger:
   ```json
   {
     "certId": "QSA-THESIS101-202610-A7F2D1-B84E",
     "studentName": "Fatima Noor",
     "courseId": "thesis101",
     "score": 88,
     "issuedAt": 1792842000,
     "signature": "hmac_sha256_signature_here"
   }
   ```
2. **Authoritative Lookup**: Anyone visiting `https://academy.quick-services.pk/#verify-{ID}` or scanning the QR code receives a verified badge directly from the database registry confirming the original recipient and grade.
