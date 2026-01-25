## 2025-02-18 - Form Accessibility
**Learning:** Form fields (Input, Select) often lack programmatic association with their error messages, making it difficult for screen reader users to know why a field is invalid.
**Action:** Always generate a unique ID for error messages and link them to the input using `aria-describedby` and `aria-invalid`.
