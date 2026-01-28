## 2026-01-28 - Accessible Names for Icon-Only Buttons
**Learning:** several key interactive elements (password toggle, edit/delete actions) relied solely on icons without accessible names. This makes them invisible to screen reader users and ambiguous for some visual users.
**Action:** Consistently enforce `aria-label` on all icon-only buttons and wrap them in `Tooltip` components to provide both accessible names and visual confirmation on hover.
