# Mobile Device QA

All results begin as **NOT TESTED**. Update this checklist only after testing the named physical device and browser.

## Test Matrix

| Device | OS | Browser | Viewport | Portrait result | Landscape result | Notes |
|---|---|---|---|---|---|---|
| Mid-range Android phone | NOT TESTED | Chrome | 360 × 800 | NOT TESTED | NOT TESTED | |
| Android phone | NOT TESTED | Chrome | 390 × 844 | NOT TESTED | NOT TESTED | |
| iPhone | NOT TESTED | Safari | 375 × 812 | NOT TESTED | NOT TESTED | |
| Notched iPhone | NOT TESTED | Safari | 390 × 844 | NOT TESTED | NOT TESTED | Check safe areas/home indicator. |
| Large phone | NOT TESTED | Chrome/Safari | 430 × 932 | NOT TESTED | NOT TESTED | |
| Tablet | NOT TESTED | Chrome/Safari | 768px wide | NOT TESTED | NOT TESTED | |

## Global

- [ ] NOT TESTED — Navigation drawer, Back behavior, profile and notifications.
- [ ] NOT TESTED — Operational touch targets and adjacent-action safety.
- [ ] NOT TESTED — Top/bottom safe areas on notched and home-indicator devices.
- [ ] NOT TESTED — Virtual keyboard keeps focused fields, validation and actions reachable.
- [ ] NOT TESTED — Camera permission denied, camera unavailable/in-use, retry, and loading states provide visible feedback rather than a blank preview.
- [ ] NOT TESTED — Closing, cancelling, navigating away, accepting a photo, and unmounting stop the active camera indicator/stream.
- [ ] NOT TESTED — Repeated taps while camera startup is in progress do not create multiple camera sessions.

## Auditor

- [ ] NOT TESTED — Audit Execution with long questions, evidence and navigation.
- [ ] NOT TESTED — Reference Guide and full-screen reference image.
- [ ] NOT TESTED — Evidence camera launch, cancel and return.
- [ ] NOT TESTED — Audit question and finding evidence use the rear camera in portrait and landscape; Capture, Retake, and Use Photo work without opening a file picker.
- [ ] NOT TESTED — Preview, edit and return.
- [ ] NOT TESTED — Front camera permission, capture, Retake and close cleanup.
- [ ] NOT TESTED — Final Auditor Verification selects the front/selfie camera and retains photo, signature, and completion gating after capture.
- [ ] NOT TESTED — Signature drawing, Clear, confirmation and no page scroll.
- [ ] NOT TESTED — Complete Audit gating and completion.

## Zone Member

- [ ] NOT TESTED — Action Detail hierarchy and long Action Plan.
- [ ] NOT TESTED — Before evidence preview.
- [ ] NOT TESTED — After camera, same-angle guidance, Retake and Use Photo.
- [ ] NOT TESTED — Corrective Action and Red Tag After capture prefer the rear camera and preserve the Before/After comparison in portrait and landscape.
- [ ] NOT TESTED — Background/resume while camera is open.
- [ ] NOT TESTED — Completion comment, Save Progress and Submit.

## Zone Leader

- [ ] NOT TESTED — Before/After comparison.
- [ ] NOT TESTED — Return for Rework with virtual keyboard.
- [ ] NOT TESTED — Approve & Close confirmation.

## Admin

- [ ] NOT TESTED — Audit Configuration with a long question.
- [ ] NOT TESTED — Reorder, Edit and Delete controls.
- [ ] NOT TESTED — Editor with virtual keyboard and image processing.

## Manager

- [ ] NOT TESTED — Dashboard NC cards and shared filters.
- [ ] NOT TESTED — NC Export selection and filtered Select All.
- [ ] NOT TESTED — Report navigation and actions.

## Red Tag

- [ ] NOT TESTED — Issue/Before photo opens the rear live camera; Capture, Retake, Use Photo, permission denial, retry, close cleanup, and back navigation work.
- [ ] NOT TESTED — After photo opens the rear live camera and retains same-angle guidance and Before reference through Retake and Use Photo.

## Continuous Improvement

- [ ] NOT TESTED — Proposal Existing Photo “Take Photo” opens the rear live camera while “Upload Image” remains a separate gallery/file action.
- [ ] NOT TESTED — Completion Evidence “Take Photo” opens the rear live camera while “Upload Photo” remains separate; capture persists through the existing workflow.
- [ ] NOT TESTED — Both CI camera flows handle permission denial, unavailable/in-use camera, Retake, Use Photo, close cleanup, back navigation, portrait, and landscape.

## Reports

- [ ] NOT TESTED — Audit Report phone reading view and long report.
- [ ] NOT TESTED — Corrective Action Report, long Action Plan and evidence.
- [ ] NOT TESTED — Red Tag Report phone reading view and print artifact.
- [ ] NOT TESTED — PDF generation with small and evidence-heavy reports.
- [ ] NOT TESTED — Native file Share and share cancellation.
- [ ] NOT TESTED — Unsupported-share Download fallback and downloaded filename.
- [ ] NOT TESTED — IQ branding, multipage content and image quality in PDF/print.
