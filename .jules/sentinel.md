## 2025-05-18 - Hardcoded Google Calendar API Key Fallback
**Vulnerability:** A hardcoded Google Calendar API key (`AIzaSyCiHFpbbbSmpu60-2KpFdqIhoLaygoCAIA`) was used as a fallback for the environment variable `VITE_GOOGLE_CALENDAR_API_KEY` in `src/data/calendarConfig.ts`.
**Learning:** Hardcoding API keys as fallbacks in configuration files exposes secrets in the source code and version control, even if they are meant to be a developer convenience or safe default. If the API key has quotas or billing attached, this allows unrestricted abuse by anyone reading the public repository or decompiled client bundle.
**Prevention:** Never use hardcoded strings as fallbacks for API keys or secrets. Instead, fallback to an empty string `""` or `undefined`, and explicitly handle the missing key at the call site (e.g., in the data-fetching hook `useGoogleCalendarEvents.ts`) by setting an appropriate error state and aborting the request without attempting a network call.

## 2025-05-18 - Reverse Tabnabbing via window.open
**Vulnerability:** External links were opened in a new tab via `window.open(url)` inside an onClick handler without specifying the `noopener,noreferrer` parameters. This allows the opened external site to manipulate the `window.opener` object, potentially leading to reverse tabnabbing and phishing attacks.
**Learning:** While modern browsers automatically secure `<a target="_blank">` tags by applying `noopener` by default, this automatic protection does NOT apply to programmatic navigations using `window.open()`. The `window.opener` context remains exposed to the target tab unless explicitly revoked.
**Prevention:** Always explicitly provide the third argument `"noopener,noreferrer"` when using `window.open(url, "_blank")` for untrusted or external URLs, exactly as you would have historically done for `<a>` tags.

## 2025-02-28 - Validate URLs before window.open
**Vulnerability:** DOM-based Cross-Site Scripting (XSS) via `javascript:` URIs passed to `window.open`.
**Learning:** `window.open` will execute `javascript:` URIs if passed directly without validation. This is a common DOM XSS vector if URLs are sourced from external APIs or user input.
**Prevention:** Always parse and validate external URLs using `new URL()` and verify the protocol is explicitly `http:` or `https:` before opening them.
