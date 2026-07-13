/**
 * Sanity Migration Script
 * Converts plain-string chair fields on committees and plain-string
 * name/email fields on cornerstone leads to proper officer references.
 *
 * Run with: node migrate.mjs
 * Requires: SANITY_TOKEN env var with write access
 */
import { createClient } from '@sanity/client'

const TOKEN = process.env.SANITY_TOKEN
if (!TOKEN) {
  console.error('❌  Missing SANITY_TOKEN env var. Set it and re-run.')
  process.exit(1)
}

const client = createClient({
  projectId: 'vq0v7yv4',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: TOKEN,
})

// ── 1. Fetch current live data ────────────────────────────────────────────────
const [committees, leaders, cornerstones] = await Promise.all([
  client.fetch('*[_type=="committee"]{_id,name,chair}'),
  client.fetch('*[_type=="leader"]{_id,name,role}'),
  client.fetch('*[_type=="cornerstone"]{_id,name,leads}'),
])

// Build lookup: name → leader _id
const byName = {}
for (const l of leaders) {
  byName[l.name.trim().toLowerCase()] = l._id
}

console.log('Leader name → _id map:', byName)

// ── 2. Patch committees: chair string → reference ─────────────────────────────
console.log('\n=== Patching committee chairs ===')

for (const committee of committees) {
  const chairName = committee.chair
  if (!chairName || typeof chairName !== 'string') {
    console.log(`  [${committee.name}] — chair already a reference or missing, skipping`)
    continue
  }

  const leaderId = byName[chairName.trim().toLowerCase()]
  if (!leaderId) {
    console.warn(`  ⚠️  [${committee.name}] — no leader for "${chairName}", clearing field`)
    try {
      await client.patch(committee._id).unset(['chair']).commit()
      console.log(`  🗑️  [${committee.name}] chair cleared`)
    } catch (err) {
      console.error(`  ❌ [${committee.name}] unset failed:`, err.message)
    }
    continue
  }

  try {
    await client.patch(committee._id).set({
      chair: { _type: 'reference', _ref: leaderId }
    }).commit()
    console.log(`  ✅ [${committee.name}] chair → ${leaderId} (${chairName})`)
  } catch (err) {
    console.error(`  ❌ [${committee.name}] patch failed:`, err.message)
  }
}

// ── 3. Patch cornerstone leads: name/email strings → officer reference ─────────
console.log('\n=== Patching cornerstone leads ===')

for (const cornerstone of cornerstones) {
  if (!cornerstone.leads || cornerstone.leads.length === 0) continue

  const patchedLeads = cornerstone.leads.map(lead => {
    const name = lead.name
    if (!name || typeof name !== 'string') return lead // already a ref or empty

    const leaderId = byName[name.trim().toLowerCase()]
    if (!leaderId) {
      console.warn(`  ⚠️  [${cornerstone.name}] lead "${name}" has no matching leader, clearing name/email`)
      const { name: _n, email: _e, ...rest } = lead
      return rest
    }

    console.log(`  ✅ [${cornerstone.name}] lead "${name}" → officer ref ${leaderId}`)
    return {
      ...lead,
      officer: { _type: 'reference', _ref: leaderId },
      // keep name/email as fallback in case ref is removed later
    }
  })

  try {
    await client.patch(cornerstone._id).set({ leads: patchedLeads }).commit()
    console.log(`  ✅ [${cornerstone.name}] leads patched`)
  } catch (err) {
    console.error(`  ❌ [${cornerstone.name}] patch failed:`, err.message)
  }
}

console.log('\n✅  Migration complete.')
