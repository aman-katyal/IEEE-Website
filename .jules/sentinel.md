## 2025-05-18 - Hardcoded Google Calendar API Key Fallback
**Vulnerability:** A hardcoded Google Calendar API key (`AIzaSyCiHFpbbbSmpu60-2KpFdqIhoLaygoCAIA`) was used as a fallback for the environment variable `VITE_GOOGLE_CALENDAR_API_KEY` in `src/data/calendarConfig.ts`.
**Learning:** Hardcoding API keys as fallbacks in configuration files exposes secrets in the source code and version control, even if they are meant to be a developer convenience or safe default. If the API key has quotas or billing attached, this allows unrestricted abuse by anyone reading the public repository or decompiled client bundle.
**Prevention:** Never use hardcoded strings as fallbacks for API keys or secrets. Instead, fallback to an empty string `""` or `undefined`, and explicitly handle the missing key at the call site (e.g., in the data-fetching hook `useGoogleCalendarEvents.ts`) by setting an appropriate error state and aborting the request without attempting a network call.

## 2025-05-18 - Reverse Tabnabbing via window.open
**Vulnerability:** External links were opened in a new tab via `window.open(url)` inside an onClick handler without specifying the `noopener,noreferrer` parameters. This allows the opened external site to manipulate the `window.opener` object, potentially leading to reverse tabnabbing and phishing attacks.
**Learning:** While modern browsers automatically secure `<a target="_blank">` tags by applying `noopener` by default, this automatic protection does NOT apply to programmatic navigations using `window.open()`. The `window.opener` context remains exposed to the target tab unless explicitly revoked.
**Prevention:** Always explicitly provide the third argument `"noopener,noreferrer"` when using `window.open(url, "_blank")` for untrusted or external URLs, exactly as you would have historically done for `<a>` tags.

## 2025-05-18 - DOM-based XSS via window.open
**Vulnerability:** External links were opened in a new tab via `window.open(url)` inside an onClick handler without explicitly validating the URL protocol. An attacker could potentially supply a `javascript:` or `data:` URL which would then be executed in the context of the user's browser, leading to Cross-Site Scripting (XSS).
**Learning:** `window.open()` is susceptible to DOM-based XSS if the input URL is not sanitized or strictly validated. While `<a href="javascript:...">` is a well-known XSS vector, programmatic navigation via `window.open()` is equally dangerous. Relying on simple string checks like `startsWith("http")` is not always robust against variations in protocol formatting.
**Prevention:** Always parse and validate untrusted URLs using the `URL` constructor (e.g., `new URL(url)`) and explicitly check the `protocol` property to ensure it is `http:` or `https:` before passing it to `window.open()` or assigning it to `location.href`.

## 2026-08-14 - Target Blank Noopener Check
**Vulnerability:** Found issue describing missing rel="noopener noreferrer" for target="_blank" links.
**Learning:** Sometimes reported security vulnerabilities may have already been fixed in a recent PR or by another team member. In this case, `rel="noopener noreferrer"` was already present.
**Prevention:** Always verify the codebase state directly before applying security patches to prevent unnecessary churn or overwriting good fixes.
## 2024-08-26 - Prevent XSS in Breadcrumbs JSON-LD
**Vulnerability:** XSS vulnerability in Breadcrumbs component due to unsanitized JSON string injection via `dangerouslySetInnerHTML`.
**Learning:** When injecting serialized JSON into a `<script>` tag, HTML-sensitive characters must be escaped.
**Prevention:** Always sanitize JSON injected into HTML contexts by replacing `<`, `>`, and `&` with their unicode escapes.

## 2025-01-01 - Insecure OTP Generation
**Vulnerability:** Predictable OTP generation using `Math.random()` in `src/discord-worker.js`.
**Learning:** `Math.random()` is not cryptographically secure and can be predicted by attackers, leading to potential authentication bypass.
**Prevention:** Always use a cryptographically secure random number generator like `crypto.getRandomValues()` for generating security tokens, OTPs, or any cryptographic keys.
