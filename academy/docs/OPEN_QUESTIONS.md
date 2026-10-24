# Quick Services Academy — Open Questions & Policy Benchmarks

This tracking document records institutional nuances, policy ambiguities, and operational decisions that require supervisor or departmental clarification.

---

## 1. Verified Policies vs University Variations

| Item | Verified National Policy (HEC) | University Variations Observed | Academy Implementation |
|---|---|---|---|
| **Turnitin Similarity Threshold** | Maximum 19% overall index, single source < 5% (HEC Plagiarism Policy 2020) | Some medical universities (e.g. UHS) enforce 15% or 10%; some humanities faculties permit up to 20% excluding quotes. | We state the official 19% / 5% HEC standard while prominently instructing students to consult their institutional guidelines. |
| **G*Power Statistical Power Standard** | Minimum power $(1-\beta) = 0.80$ at $\alpha = 0.05$ | Certain clinical trials and pharmaceutical faculties require power $(1-\beta) \ge 0.90$ or $0.95$. | Default to $0.80$ as universal baseline; explain and offer slider toggle for $0.90$ and $0.95$. |
| **HTMT Discriminant Validity Benchmark** | $HTMT < 0.85$ (Henseler et al., 2015 conservative); $HTMT < 0.90$ (liberal threshold for conceptually similar constructs) | Some older faculty examiners still request the legacy Fornell-Larcker criterion or cross-loadings. | Teach both HTMT (modern standard) and Fornell-Larcker, advising students to report both in Chapter 4 tables. |
| **APA 7th Student Title Page** | Omits running head; includes course name, instructor name, and submission date | Some Pakistani universities still mandate a running head or a custom institutional crest page. | Teach standard APA 7th while providing a downloadable sample institutional template. |

---

## 2. Questions for Student Clarification
1. **Video Production Hosting**: Videos are prepared as script-ready placeholders in `videos/tracker.csv`. Will recorded MP4 files be hosted on Cloudflare R2, an unlisted YouTube playlist, or Vimeo? (The player seamlessly handles any of these options).
2. **Institutional Customization**: If specific universities (e.g., BZU, NUST, Quaid-i-Azam University, Punjab University) mandate unique thesis margin or binding guidelines, should we create an "Institutional Variations Appendix" in `edit101`?
