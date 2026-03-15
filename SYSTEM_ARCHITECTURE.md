# SYSTEM_ARCHITECTURE

## Purpose
Reduce cognitive load around complex information by running one input through three constrained analyses:
1. Meaning
2. Origin
3. Verification

## Engine design
### Meaning Buddy
- Extracts assertions
- Produces plain meaning
- Surfaces action and timeline signals

### Origin Maps
- Detects source domain
- Detects publisher/author/time signals
- Produces provenance context

### Verification Router
- Classifies assertions
- Routes each assertion to named record systems
- Flags missing source paths and interpretive limits

## Constraint rule
No narrative padding.
No personality layer.
No truth verdicts.
No advice.
No speculative interpretation.

## Flow
Input text
→ sentence split
→ assertion detection
→ meaning extraction
→ origin extraction
→ verification routing
→ readable output panels

## Record-system principle
Use named systems, not vague domains.

Examples:
- Scientific → PubMed, ClinicalTrials.gov, NIH, FDA, CDC
- Policy / legal → Congress.gov, Federal Register, CourtListener
- Corporate / financial → SEC EDGAR, Investor Relations
- Statistical → Census, BLS, BEA, FRED, World Bank, OECD
- Infrastructure / energy → EIA, FERC, NERC, ISO/RTO, WECC
