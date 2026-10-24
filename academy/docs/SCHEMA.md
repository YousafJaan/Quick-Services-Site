# Quick Services Academy — Master Data & Content Schema

This document specifies the exact JSON schemas for courses, lessons, visual renderers, and quiz engines. All content files must strictly adhere to these schemas and validate against `tools/validate-content.mjs`.

---

## 1. Catalog Schema (`data/courses.json`)

```json
[
  {
    "id": "thesis101",
    "title": "Thesis Writing 101",
    "tagline": "From topic selection to an approved proposal and defense-ready thesis.",
    "category": "Research Design",
    "level": "All Levels",
    "modulesCount": 5,
    "lessonsCount": 20,
    "minutes": 215,
    "badge": "Proposal Approved",
    "accentColor": "#ff6b2c",
    "svgCover": "thesis-cover-svg"
  }
]
```

---

## 2. Course Manifest Schema (`data/courses/<id>.json`)

```json
{
  "id": "thesis101",
  "title": "Thesis Writing 101",
  "category": "Research Design",
  "level": "All Levels",
  "minutes": 215,
  "outcomes": [
    "Formulate an empirical research question using the FINER criteria.",
    "Structure an empirical thesis across five proportional chapters.",
    "Synthesize empirical literature thematically instead of listing summaries.",
    "Navigate supervisor feedback and institutional defense expectations."
  ],
  "modules": [
    {
      "id": "m1",
      "title": "Module 1: Finding Your Question & The Proposal",
      "description": "Transform broad research interests into focused, defensible research problems.",
      "lessons": [
        {
          "id": "t1",
          "title": "What Makes a Thesis Topic Work?",
          "type": "read",
          "minutes": 10
        },
        {
          "id": "t2",
          "title": "The Topic Narrowing Funnel",
          "type": "visual",
          "widget": "funnel",
          "minutes": 12
        },
        {
          "id": "t3",
          "title": "Crafting Defensible Problem Statements",
          "type": "video",
          "vid": "V-THESIS-01",
          "minutes": 8
        },
        {
          "id": "t5",
          "title": "Module 1 Assessment: Topic & Proposal Mastery",
          "type": "quiz",
          "minutes": 10
        }
      ]
    }
  ]
}
```

---

## 3. Lesson Schemas (`data/lessons/<course>/<id>.json`)

### 3.1 `read` Lesson (Core Pedagogical Engine)
```json
{
  "id": "t1",
  "course": "thesis101",
  "title": "What Makes a Thesis Topic Work?",
  "type": "read",
  "minutes": 10,
  "content": {
    "quick": "A defensible thesis topic must satisfy the FINER criteria: Feasible, Interesting, Novel, Ethical, and Relevant. Avoid topic traps like choosing a question that is too broad to investigate or has already been exhaustively answered.",
    "blocks": [
      {
        "id": "p1",
        "sentences": [
          {
            "id": "s1",
            "text": "Every successful academic thesis begins with a problem that is both empirically investigable and clearly bounded.",
            "visual": {
              "kind": "definition",
              "title": "Empirically Investigable Problem",
              "data": {
                "term": "Bounded Problem",
                "meaning": "A research gap with specific population, variables, and geographic constraints that can be measured within available time and resources.",
                "example": "E.g., turnover intention among private school teachers in Lahore during 2025."
              },
              "caption": "A defensible topic specifies who, what, and where before data collection begins."
            }
          }
        ],
        "visual": {
          "kind": "compare",
          "title": "Broad Topic vs Bounded Research Problem",
          "data": {
            "columns": ["Unbounded Idea (Fails)", "Bounded Topic (Succeeds)"],
            "rows": [
              { "metric": "Scope", "col1": "AI in Higher Education", "col2": "Undergraduate Adoption of GenAI in Computer Science at BZU" },
              { "metric": "Data Source", "col1": "Vague global literature", "col2": "Survey of 280 enrolled 3rd-year undergraduates" },
              { "metric": "Defense Verdict", "col1": "Rejected as too vague", "col2": "Approved by departmental committee" }
            ]
          },
          "caption": "Narrowing your focus increases academic defensibility."
        },
        "explain": "If you try to study everything about a topic, you will finish nothing. Pick a specific group of people, one specific setting, and measurable variables.",
        "check": {
          "topic": "topic-bounding",
          "confidence": true,
          "questions": [
            {
              "type": "single",
              "q": "Which of the following represents a properly bounded research problem?",
              "options": [
                "The impact of technology on society",
                "How digital banking apps influence financial literacy among retail shopkeepers in Multan",
                "Problems with the education system in Pakistan",
                "Why students get stressed during examinations"
              ],
              "answer": 1,
              "hint": "Look for specific variables, a distinct target population, and a defined geographical context.",
              "explanation": "Option 2 defines the precise variables (banking apps, financial literacy), the exact population (retail shopkeepers), and the location (Multan). The other options are too broad to test empirically."
            }
          ]
        }
      }
    ],
    "deep": [
      {
        "title": "Go deeper: The FINER Framework in Institutional Proposal Review",
        "blocks": [
          {
            "id": "dp1",
            "sentences": [
              {
                "id": "ds1",
                "text": "The FINER criteria (Feasible, Interesting, Novel, Ethical, Relevant) are commonly used by university research evaluation committees to determine whether a proposal qualifies for formal registration.",
                "visual": {
                  "kind": "checklist",
                  "title": "The FINER Proposal Evaluation Matrix",
                  "data": {
                    "items": [
                      { "label": "Feasible", "desc": "Adequate sample size, technical expertise, manageable time & budget", "checked": true },
                      { "label": "Interesting", "desc": "Compelling intellectual inquiry for both researcher and discipline", "checked": true },
                      { "label": "Novel", "desc": "Confirms, refutes, or extends existing literature with fresh insights", "checked": true },
                      { "label": "Ethical", "desc": "Minimal risk to human subjects with institutional review board approval", "checked": true },
                      { "label": "Relevant", "desc": "Contributes to theoretical knowledge or practical organizational policy", "checked": true }
                    ]
                  },
                  "caption": "Ensure every box is checked before presenting your proposal to your supervisor."
                }
              }
            ]
          }
        ]
      }
    ],
    "mistakes": [
      "Choosing a topic solely because 'no one has written about it before'—often this means there is no theoretical foundation to build upon.",
      "Selecting an organization that will not grant data access or sign an institutional consent agreement."
    ],
    "key": [
      "A defensible thesis topic must have clear boundaries defining population, variables, and context.",
      "The FINER framework ensures your topic can be completed within academic deadlines and ethical guidelines.",
      "Verify access to your target sample before seeking formal proposal approval."
    ]
  }
}
```

### 3.2 `video` Lesson
```json
{
  "id": "t3",
  "course": "thesis101",
  "title": "Crafting Defensible Problem Statements",
  "type": "video",
  "minutes": 8,
  "content": {
    "len": "8 min",
    "vid": "V-THESIS-01",
    "url": "",
    "shots": [
      "Instructor on camera introducing the 3-part problem statement formula",
      "Slide: Hook (Ideal state), Conflict (Reality), Consequence (Why it matters)",
      "Screen capture: Highlighting problem statements in three published BZU theses",
      "Diagram: The Problem Statement Triangle"
    ],
    "transcript": [
      "Welcome to Lesson 3. In this video, we will break down the exact three-part formula for writing a problem statement that academic examiners cannot tear apart.",
      "Part one is the ideal condition: what should be happening in your field or organization.",
      "Part two is the practical reality: what obstacle or gap exists right now.",
      "Part three is the consequence: why solving this problem matters to theory or practice."
    ],
    "key": [
      "Every problem statement requires an ideal state, a current reality, and a consequence.",
      "Avoid stating a 'lack of research' as your primary problem; focus on the practical or theoretical dilemma.",
      "Examiners look for the consequence section to justify why the degree should be awarded."
    ]
  }
}
```

### 3.3 `visual` Lesson (Interactive Widget Engine)
```json
{
  "id": "t2",
  "course": "thesis101",
  "title": "The Topic Narrowing Funnel",
  "type": "visual",
  "minutes": 12,
  "content": {
    "widget": "funnel",
    "intro": "Use this interactive narrowing funnel to take a general research domain and step-by-step convert it into a focused, defensible thesis question that satisfies departmental review boards.",
    "key": [
      "Move through four narrowing stages: Domain, Context, Variables, and Boundaries.",
      "Test each stage against the FINER verification rubric.",
      "Export your formulated question directly into your proposal draft."
    ]
  }
}
```

### 3.4 `quiz` Lesson
```json
{
  "id": "t5",
  "course": "thesis101",
  "title": "Module 1 Assessment: Topic & Proposal Mastery",
  "type": "quiz",
  "minutes": 10,
  "content": {
    "show": 6,
    "pass": 70,
    "bank": [ ...array of 18+ questions ]
  }
}
```

---

## 4. Visual Component Kinds (30+ Built-in Renderers)

1. `flow`: Step-by-step sequential workflow connected with arrows.
2. `cycle`: Continuous circular process loop with phase nodes.
3. `compare`: Multi-column comparison grid with feature verdicts.
4. `table`: Styled tabular data with header highlights and row stripes.
5. `hierarchy`: Organizational or conceptual tree structure.
6. `timeline`: Chronological event sequence with milestone markers.
7. `venn`: Overlapping two- or three-set conceptual intersection diagram.
8. `pyramid`: Layered hierarchical foundation diagram (e.g., Bloom's taxonomy).
9. `matrix2x2`: 4-quadrant conceptual decision matrix.
10. `funnel`: Wide-to-narrow reduction process with stage indicators.
11. `stack`: Layered architectural or structural stack.
12. `formula`: Mathematical or statistical formula with interactive variable definitions.
13. `numberLine`: Continuous numeric axis with benchmark points.
14. `barchart`: Relative quantitative comparative values in SVG.
15. `donut`: Proportional percentage distribution ring.
16. `scale`: Continuum from low to high with threshold labels.
17. `checklist`: Interactive checklist with status indicators.
18. `beforeAfter`: Side-by-side contrast of poor vs exemplary practice.
19. `annotatedExample`: Academic text sample with callout tags.
20. `definition`: Card highlighting term, definition, and practical example.
21. `quote`: Formal rule or policy quotation with author attribution.
22. `dosDonts`: Green check vs red cross side-by-side best practices.
23. `mistakeFix`: Common student blunder paired with the exact corrective action.
24. `decisionTree`: Branching decision flowchart with yes/no forks.
25. `mindmap`: Central concept with radiating thematic branches.
26. `iconCards`: Grid of SVG icon tiles explaining category components.
27. `keyTermCard`: High-impact glossary card highlighting a critical concept.
28. `process`: Inputs, Transformation Steps, and Outputs architecture.
29. `anatomy`: Dissected diagram (e.g., citation structure) with interactive parts.
30. `textFallback`: Tier B heuristic layout engine for unstructured text.

---

## 5. Quiz Question Types (12 Engines)

1. `single`: Single correct answer from 4 options.
2. `multi`: Multiple correct selections; requires all correct answers for full credit.
3. `trueFalse`: Binary choice paired with a pedagogical justification.
4. `fillBlank`: Exact typed string input with accepted aliases and typo tolerance.
5. `order`: Drag-and-drop or accessible up/down button sorting of steps.
6. `match`: Pair-matching interface connecting concepts to definitions.
7. `categorise`: Sorting items into discrete categorized buckets.
8. `hotspot`: Clicking a designated interactive coordinate on an SVG diagram or table.
9. `spotError`: Tapping erroneous words or formatting errors in a sample sentence/citation.
10. `shortAnswer`: Open-ended typed response evaluated against a model rubric with self-scoring.
11. `scenario`: Branching case study where selections trigger consequences and follow-up prompts.
12. `calculation`: Numeric input checked against an exact mathematical answer within a specified tolerance percentage.
