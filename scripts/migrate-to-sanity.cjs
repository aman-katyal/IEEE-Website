const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
// The user must set these before running the script
const SANITY_PROJECT_ID = 'vq0v7yv4';
const SANITY_TOKEN = 'sk8wOO1dQJyLuz5JVMg3EmV06Rb3FzVO4PzvrCpnFMggVYg2hLkAvvSrAhj45eXzjolC265tX4kNBovQXikBztv5ewb4j9RXZjr747gX1tCZE3lnaxvrCrO3Mn0QToR9fb3qbCJHXwZsYZtJfJX84uHqqlbDuxfyVcr0ABE8wu4Wbo9kGDog';
const DATASET = 'production';

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: DATASET,
  token: SANITY_TOKEN,
  useCdn: false,
  apiVersion: '2024-03-16',
});

async function migrateCommittees() {
  const committeesDir = path.join(__dirname, '../src/data/content/committees');
  const files = fs.readdirSync(committeesDir).filter(file => file.endsWith('.json'));

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(committeesDir, file), 'utf-8'));
    console.log(`Migrating committee: ${data.name}`);

    const doc = {
      _type: 'committee',
      _id: `committee-${data.id}`,
      id: { _type: 'slug', current: data.id },
      name: data.name,
      shortName: data.shortName,
      tagline: data.tagline,
      description: data.description,
      longDescription: data.longDescription,
      status: data.status,
      statusColor: data.statusColor,
      statusBg: data.statusBg,
      chair: data.chair,
      email: data.email,
      tags: data.tags,
      metrics: data.metrics,
      joinConfig: data.joinConfig,
      // Note: Images need to be uploaded separately as assets in a real migration
      // This script assumes placeholder or manually uploaded images for now
      // Or you can use the image string as a temporary field
      sections: data.sections?.map((section, idx) => {
        const { image, type, ...rest } = section;
        return {
          _key: `section-${idx}`,
          ...rest,
          // Map types to match Sanity schema
          _type: type === 'text' ? 'textSection' : 
                 type === 'projects' ? 'projectsSection' :
                 type === 'faq' ? 'faqSection' :
                 type === 'gallery' ? 'gallerySection' : 'textSection'
        };
      }),
      socialLinks: data.socialLinks?.map((link, idx) => ({ _key: `link-${idx}`, ...link })),
    };

    // Deeply remove any remaining 'image' fields that are strings
    if (doc.sections) {
      doc.sections.forEach(section => {
        if (section.items && Array.isArray(section.items)) {
          section.items.forEach(item => {
            if (typeof item.image === 'string') {
              delete item.image;
            }
          });
        }
      });
    }

    // Remove the root image if it's a string
    if (typeof doc.image === 'string') {
      delete doc.image;
    }

    try {
      await client.createOrReplace(doc);
      console.log(`Successfully migrated ${data.name}`);
    } catch (err) {
      console.error(`Failed to migrate ${data.name}:`, err.message);
    }
  }
}

async function migrateLeaders() {
  const leadershipPath = path.join(__dirname, '../src/data/leadership.json');
  const { leaders } = JSON.parse(fs.readFileSync(leadershipPath, 'utf-8'));

  for (const leader of leaders) {
    console.log(`Migrating leader: ${leader.name}`);
    const doc = {
      _type: 'leader',
      _id: `leader-${leader.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: leader.name,
      role: leader.role,
      committees: leader.committees,
      email: leader.email,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`Successfully migrated ${leader.name}`);
    } catch (err) {
      console.error(`Failed to migrate ${leader.name}:`, err.message);
    }
  }
}

async function run() {
  if (SANITY_PROJECT_ID === 'YOUR_PROJECT_ID') {
    console.error('Please set your SANITY_PROJECT_ID and SANITY_TOKEN in the script first.');
    return;
  }
  await migrateCommittees();
  await migrateLeaders();
}

run();
