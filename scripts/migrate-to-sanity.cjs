const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
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

/**
 * Uploads an image to Sanity and returns an image object with a reference.
 * Supports both local paths (relative to public/) and remote URLs.
 */
async function uploadImage(imagePath) {
  if (!imagePath || typeof imagePath !== 'string') return null;

  try {
    let source;
    if (imagePath.startsWith('http')) {
      // Remote URL
      const response = await fetch(imagePath);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      source = Buffer.from(await response.arrayBuffer());
    } else {
      // Local path relative to public/
      const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
      const fullPath = path.join(__dirname, '..', 'public', cleanPath);
      
      if (!fs.existsSync(fullPath)) {
        console.warn(`  [Warn] Image not found on disk: ${fullPath}`);
        return null;
      }
      source = fs.createReadStream(fullPath);
    }

    const asset = await client.assets.upload('image', source, {
      filename: path.basename(imagePath)
    });

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    };
  } catch (err) {
    console.error(`  [Error] Failed to upload image ${imagePath}:`, err.message);
    return null;
  }
}

async function migrateCommittees() {
  const committeesDir = path.join(__dirname, '../src/data/content/committees');
  const files = fs.readdirSync(committeesDir).filter(file => file.endsWith('.json'));

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(committeesDir, file), 'utf-8'));
    console.log(`\nMigrating committee: ${data.name} (${data.id})`);

    // 1. Upload root image
    const mainImage = await uploadImage(data.image);

    // 2. Map sections and upload their images
    const sections = [];
    if (data.sections) {
      for (let i = 0; i < data.sections.length; i++) {
        const section = data.sections[i];
        const { image, type, items, ...rest } = section;
        
        const mappedSection = {
          _key: `section-${i}`,
          ...rest,
          _type: type === 'text' ? 'textSection' : 
                 type === 'projects' ? 'projectsSection' :
                 type === 'faq' ? 'faqSection' :
                 type === 'gallery' ? 'gallerySection' : 'textSection'
        };

        // Upload section image if it exists
        if (image) {
          const uploadedSectionImage = await uploadImage(image);
          if (uploadedSectionImage) {
            mappedSection.image = uploadedSectionImage;
          }
        }

        // Upload images for items in projects/gallery
        if (items && Array.isArray(items)) {
          const mappedItems = [];
          for (let j = 0; j < items.length; j++) {
            const item = items[j];
            const { image: itemImage, ...itemRest } = item;
            const mappedItem = { ...itemRest, _key: `item-${j}` };
            
            if (itemImage) {
              const uploadedItemImage = await uploadImage(itemImage);
              if (uploadedItemImage) {
                mappedItem.image = uploadedItemImage;
              }
            }
            mappedItems.push(mappedItem);
          }
          mappedSection.items = mappedItems;
        }

        sections.push(mappedSection);
      }
    }

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
      sections: sections,
      socialLinks: data.socialLinks?.map((link, idx) => ({ _key: `link-${idx}`, ...link })),
    };

    if (mainImage) {
      doc.image = mainImage;
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
    
    const image = await uploadImage(leader.image);

    const doc = {
      _type: 'leader',
      _id: `leader-${leader.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: leader.name,
      role: leader.role,
      committees: leader.committees,
      email: leader.email,
    };

    if (image) {
      doc.image = image;
    }

    try {
      await client.createOrReplace(doc);
      console.log(`Successfully migrated ${leader.name}`);
    } catch (err) {
      console.error(`Failed to migrate ${leader.name}:`, err.message);
    }
  }
}

async function migrateCornerstones() {
  const cornerstonePath = path.join(__dirname, '../src/data/content/cornerstone.json');
  const { groups } = JSON.parse(fs.readFileSync(cornerstonePath, 'utf-8'));

  for (const group of groups) {
    console.log(`Migrating cornerstone: ${group.name}`);
    const doc = {
      _type: 'cornerstone',
      _id: `cornerstone-${group.id}`,
      id: { _type: 'slug', current: group.id },
      name: group.name,
      description: group.description,
      leads: group.leads?.map((lead, idx) => ({
        _key: `lead-${idx}`,
        role: lead.role,
        name: lead.name,
        email: lead.email,
        description: lead.description,
      })),
    };

    try {
      await client.createOrReplace(doc);
      console.log(`Successfully migrated ${group.name}`);
    } catch (err) {
      console.error(`Failed to migrate ${group.name}:`, err.message);
    }
  }
}

async function run() {
  await migrateCommittees();
  await migrateLeaders();
  await migrateCornerstones();
  console.log('\nMigration completed!');
}

run();
