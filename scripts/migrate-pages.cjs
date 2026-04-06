const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'vq0v7yv4',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-03-16',
  token: 'SK_YOUR_TOKEN_HERE' // You will need to provide a token with write access
});

const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  heroTitle: '“Fostering technological innovation and excellence for the benefit of humanity.”',
  heroSubtitle: '— IEEE Mission Statement',
  aboutEyebrow: '// Overview',
  aboutTitle: 'At Purdue, we strive to be the best',
  aboutContent: 'Whether creating drones, designing radio transmitters, or pioneering next-gen biotech, Purdue engineers excel. Purdue IEEE is the university\'s largest technical organization, where students from all backgrounds work on real-world problems and advance their engineering skills.',
  aboutStatsValue: '1903',
  aboutStatsLabel: 'Established & Innovating',
  stats: [
    { _key: 's1', label: 'Committees', sublabel: 'Technical & support', value: 11 },
    { _key: 's2', label: 'Founded', sublabel: 'Legacy of innovation', value: 1903 },
    { _key: 's3', label: 'Members', sublabel: 'Across all disciplines', suffix: '+', value: 750 },
    { _key: 's4', label: 'Raised Annually', prefix: '$', sublabel: 'Project funding', value: 50000 }
  ],
  sysUptime: 'ACTIVE',
  semester: 'SP_2026'
};

const aboutPage = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  sections: [
    {
      _key: 'sec1',
      eyebrow: '// Excellence',
      title: 'At Purdue, we strive to be the best',
      content: 'Whether creating drones, designing radio transmitters, or pioneering next-gen biotech, Purdue engineers excel. Purdue IEEE (Eye-Triple-E) is no different. Founded in 1903, we are the largest technical organization with students of every academic background. Our members work on real-world problems and advance their engineering skills.',
      cardTitle: 'Established 1903',
      cardContent: 'Over a century of fostering innovation and engineering excellence at Purdue University.',
      colorTheme: 'blue',
      layout: 'normal'
    },
    {
      _key: 'sec2',
      eyebrow: '// Technical Growth',
      title: 'Applying academics to extracurriculars',
      content: 'Purdue IEEE continually strives to further our goals of technical and professional growth. We help our members enter their professional careers, learn engineering software and skills, and socialize with others to form lasting connections inside and outside of this organization.\n\nOur teams apply the knowledge and create real-world, practical solutions to complex engineering projects.',
      cardContent: 'Professional Careers\nEngineering Software\nPractical Solutions\nLasting Connections',
      colorTheme: 'gold',
      layout: 'reversed'
    },
    {
      _key: 'sec3',
      eyebrow: '// Professional Success',
      title: 'Connecting industry partners to talented engineers',
      content: 'Our alumni go on to utilize the skills they learn at some of the world\'s largest companies. We have alumni working in every sector of every industry, helping shape the future of technology.\n\nWe host regular professional networking events and company recruiting sessions - just for our members. We also host resume reviews, alumni panels, and professor talks.\n\nWith Purdue IEEE, you can learn what it takes to be successful after college, whether it be in industry or academia.',
      cardContent: '"Our alumni go on to work at some of the world\'s largest companies... helping shape the future of technology."',
      colorTheme: 'blue',
      layout: 'normal'
    }
  ]
};

async function migrate() {
  console.log('Starting migration...');
  try {
    await client.createOrReplace(homePage);
    console.log('✅ Home Page migrated');
    await client.createOrReplace(aboutPage);
    console.log('✅ About Page migrated');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.log('\nTip: Ensure your API Token has "Editor" or "Administrator" permissions.');
  }
}

migrate();
