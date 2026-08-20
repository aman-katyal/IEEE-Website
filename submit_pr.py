import json

title = '🛡️ Sentinel: [False Positive] Missing rel="noopener noreferrer"'
body = """🚨 **Severity:** N/A (False Positive)
💡 **Vulnerability:** The report indicated a missing `rel="noopener noreferrer"` attribute on the Discord join link in `src/app/pages/JoinPage.tsx:132`, which could lead to reverse tabnabbing via `window.opener`.
🎯 **Impact:** If unmitigated, navigating to external, untrusted links could allow the external site to run scripts in the context of the opening tab. However, the attribute is already present.
🔧 **Fix:** No code changes were necessary. The vulnerability is a false positive as the `rel="noopener noreferrer"` attribute was confirmed to be correctly implemented across the entire repository.
✅ **Verification:**
- Grepped all `<a target="_blank">` tags across `src/` to confirm `rel="noopener noreferrer"` exists everywhere.
- Checked `JoinPage.tsx` explicitly to verify the Discord link properly uses the attribute.
- Ensured programmatic `window.open` calls also use `noopener,noreferrer`.
- Ran the full test suite (`pnpm test -- --run`) which passes successfully.
"""

payload = {
    "title": title,
    "body": body,
    "head": "jules-false-positive-fix",
    "base": "master"
}

with open("pr_payload.json", "w") as f:
    json.dump(payload, f)
