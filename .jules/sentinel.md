## 2025-05-18 - Hardcoded Google Calendar API Key Fallback
**Vulnerability:** A hardcoded Google Calendar API key (`AIzaSyCiHFpbbbSmpu60-2KpFdqIhoLaygoCAIA`) was used as a fallback for the environment variable `VITE_GOOGLE_CALENDAR_API_KEY` in `src/data/calendarConfig.ts`.
**Learning:** Hardcoding API keys as fallbacks in configuration files exposes secrets in the source code and version control, even if they are meant to be a developer convenience or safe default. If the API key has quotas or billing attached, this allows unrestricted abuse by anyone reading the public repository or decompiled client bundle.
**Prevention:** Never use hardcoded strings as fallbacks for API keys or secrets. Instead, fallback to an empty string `""` or `undefined`, and explicitly handle the missing key at the call site (e.g., in the data-fetching hook `useGoogleCalendarEvents.ts`) by setting an appropriate error state and aborting the request without attempting a network call.

## 2025-05-24 - Missing HSTS Security Header
**Vulnerability:** Missing Strict-Transport-Security (HSTS) header in Cloudflare Pages deployment configuration (`public/_headers`).
**Learning:** Even if a site is served over HTTPS by default by the hosting provider (like Cloudflare Pages), failing to enforce HSTS allows browsers to attempt initial connections over HTTP before being redirected. This window of unencrypted connection makes users vulnerable to protocol downgrade attacks and cookie hijacking on insecure networks (e.g., public Wi-Fi).
**Prevention:** Always explicitly define `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` in the deployment headers file to instruct browsers to *only* connect via HTTPS for all future requests, closing the downgrade window.
