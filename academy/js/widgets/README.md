# Interactive Academic Widgets

## Overview
A collection of 15 standalone interactive calculators, formula explorers, and research tools designed to help students master empirical research methods and statistical modeling.

## Interface
- `renderWidget(widgetName, container)`: [widgets/index.js:6] Factory router mounting the designated widget inside target DOM element.
- Widget modules:
  - `renderCochranCalculator(el)`: Sample size determination via Cochran's formula with margin of error sliders.
  - `renderPowerExplainer(el)`: Interactive statistical power ($\beta$) and Type I / Type II error matrix.
  - `renderTopicFunnel(el)`: Research problem narrowing tool from broad theme to specific inquiry.
  - `renderWordPlanner(el)`: Thesis chapter word budget and timeline allocation.
  - `renderApaDissecter(el)`: Interactive breakdown of APA 7th journal and book reference elements.
  - `renderSimilaritySimulator(el)`: Turnitin similarity defense and citation masking calculator.
  - `renderTestPicker(el)`: Decision tree for statistical test selection (t-test, ANOVA, Regression, Mann-Whitney).
  - `renderSpssAnnotator(el)`: Annotated SPSS regression/correlation output tables.
  - `renderPlsModel(el)`: SmartPLS path model inspector with $R^2$, $f^2$, and outer loadings.
  - `renderThresholdsTable(el)`: Psychometric validity & reliability threshold reference ($CR > 0.7$, $AVE > 0.5$).
  - `renderBooleanBuilder(el)`: Boolean search string generator with AND/OR/NOT and wildcards.
  - `renderZoteroFlow(el)`: Systematic literature search workflow diagram.
  - `renderVivaCards(el)`: Defense question flashcards with modal answer guides.
  - `renderSlideTimer(el)`: Presentation pacing stopwatch with slide transition queues.

## Invariants
- Zero third-party mathematical or charting dependencies.
- Dynamic responsive recalculation on range slider or input event.
- Mobile viewport compatibility down to 360px without horizontal overflow.

## Side Effects
- Mutates target container DOM.

## Verification
- Run: `node ../../tools/validate-content.mjs`

