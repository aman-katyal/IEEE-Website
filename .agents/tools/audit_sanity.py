import json
import urllib.request
import urllib.error

PROJECT_ID = "vq0v7yv4"
DATASET = "production"
API_VERSION = "2024-03-16"

def query_sanity(query):
    encoded_query = urllib.parse.quote(query)
    url = f"https://{PROJECT_ID}.apicdn.sanity.io/v{API_VERSION}/data/query/{DATASET}?query={encoded_query}"
    req = urllib.request.Request(url, headers={"User-Agent": "SanityAuditor/1.0"})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get("result", [])
    except Exception as e:
        print(f"Error querying Sanity: {e}")
        return []

print("=" * 80)
print("AUDITING SANITY CMS DOCUMENTS & FIELDS")
print("=" * 80)

# 1. Fetch document count by type
types = query_sanity('*[!(_id in path("_.**"))]._type')
type_counts = {}
for t in types:
    type_counts[t] = type_counts.get(t, 0) + 1

print("\n--- 1. Document Counts by Type ---")
for t, count in sorted(type_counts.items()):
    print(f"  {t:<20}: {count} document(s)")

# 2. Check Site Settings
print("\n--- 2. Auditing Site Settings Document ---")
settings = query_sanity('*[_type == "siteSettings"][0]')
if not settings:
    print("  [WARNING]: No siteSettings document found!")
else:
    print(f"  ID: {settings.get('_id')}")
    key_fields = ["discordUrl", "calendarUrl", "calendarId", "paymentUrl", "duesDescription", "duesBenefits", "duesOptions", "branchConstitution", "committeeBylaws"]
    for k in key_fields:
        val = settings.get(k)
        status = "OK" if val else "MISSING / EMPTY"
        print(f"  - {k:<22}: {status} (type: {type(val).__name__})")

# 3. Check Committees
print("\n--- 3. Auditing Committees ---")
committees = query_sanity('*[_type == "committee"]{_id, name, "slug": id.current, tagline, description, longDescription, chair, email, sections, metrics, tags, image}')
print(f"  Total Committees Found: {len(committees)}")
for c in sorted(committees, key=lambda x: x.get("name") or ""):
    cid = c.get("slug") or c.get("_id")
    name = c.get("name") or "NO_NAME"
    warnings = []
    if not c.get("slug"): warnings.append("Missing slug/id")
    if not c.get("description"): warnings.append("Missing description")
    if not c.get("chair"): warnings.append("Missing chair reference")
    if not c.get("email"): warnings.append("Missing email")
    if not c.get("image"): warnings.append("Missing image")
    
    sections = c.get("sections") or []
    sec_types = [s.get("_type") for s in sections if isinstance(s, dict)]
    
    status_str = f"[{', '.join(warnings)}]" if warnings else "[OK]"
    print(f"  • {name:<30} (/{cid:<12}) {status_str} | Sections: {len(sections)} ({', '.join(set(sec_types)) if sec_types else 'none'})")

# 4. Check Leaders / Officers
print("\n--- 4. Auditing Leaders / Officers ---")
leaders = query_sanity('*[_type == "leader"]{_id, name, role, category, email, image}')
print(f"  Total Leaders Found: {len(leaders)}")
missing_imgs = [f"{l.get('name')} ({l.get('role')})" for l in leaders if not l.get("image")]
missing_emails = [f"{l.get('name')}" for l in leaders if not l.get("email")]
print(f"  - Missing Images: {len(missing_imgs)}/{len(leaders)} -> {missing_imgs}")
print(f"  - Missing Emails: {len(missing_emails)}/{len(leaders)}")

# 5. Check Partners / Sponsors
print("\n--- 5. Auditing Partners / Sponsors ---")
partners = query_sanity('*[_type == "partner"]{_id, name, tier, domain, websiteUrl, logo}')
print(f"  Total Partners in CMS: {len(partners)}")
if len(partners) == 0:
    print("  [NOTE]: 0 partner documents in Sanity CMS; website is safely using STATIC_PARTNERS from src/data/partners.ts")
for p in partners:
    print(f"  • {p.get('name'):<25} | Tier: {p.get('tier'):<8} | Domain: {p.get('domain') or 'none':<20} | Logo: {'YES' if p.get('logo') else 'NO'}")

# 6. Check Home Page Document
print("\n--- 6. Auditing Home Page Document ---")
home = query_sanity('*[_type == "homePage"][0]')
if not home:
    print("  [WARNING]: No homePage document found in CMS!")
else:
    print(f"  ID: {home.get('_id')}")
    print(f"  Hero Title   : {'SET (' + home.get('heroTitle')[:30] + '...)' if home.get('heroTitle') else 'EMPTY (using fallback)'}")
    print(f"  Hero Subtitle: {'SET' if home.get('heroSubtitle') else 'EMPTY (using fallback)'}")
    print(f"  Hero Image   : {'SET' if home.get('heroImage') else 'EMPTY (using fallback)'}")
    print(f"  Stats Count  : {len(home.get('stats', []))}")

# 7. Check About Page Document
print("\n--- 7. Auditing About Page Document ---")
about = query_sanity('*[_type == "aboutPage"][0]')
if not about:
    print("  [WARNING]: No aboutPage document found in CMS!")
else:
    print(f"  ID: {about.get('_id')}")
    print(f"  Sections Count: {len(about.get('sections', []))}")
    print(f"  Quote Author  : {about.get('quoteAuthor') or 'EMPTY'}")

print("\n" + "=" * 80)
print("AUDIT COMPLETE")
print("=" * 80)
