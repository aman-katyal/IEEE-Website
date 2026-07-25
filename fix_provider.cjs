const fs = require('fs');

function replaceFile(file, replacer) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = replacer(content);
    fs.writeFileSync(file, content);
  }
}

replaceFile('src/app/pages/JoinPage.test.tsx', content => {
  content = content.replace(
    /import \{ JoinPage \} from '\.\/JoinPage';/g,
    "import { JoinPage } from './JoinPage';\nimport { GlobalDataProvider } from '../../context/GlobalDataContext';"
  );
  content = content.replace(
    /vi\.mock\('\.\.\/\.\.\/hooks\/useSanityData', \(\) => \(\{\n  useSiteSettings: vi\.fn\(\),\n\}\)\);/g,
    "vi.mock('../../hooks/useSanityData', () => ({\n  useSiteSettings: vi.fn(),\n  useCommittees: vi.fn(),\n}));"
  );
  content = content.replace(
    /beforeEach\(\(\) => \{\n    vi\.clearAllMocks\(\);\n    \n    \(useSanityData\.useSiteSettings as any\)\.mockReturnValue\(\{\n      settings: mockSettings,\n      loading: false,\n      error: null\n    \}\);\n  \}\);/g,
    "beforeEach(() => {\n    vi.clearAllMocks();\n    \n    (useSanityData.useSiteSettings as any).mockReturnValue({\n      settings: mockSettings,\n      loading: false,\n      error: null\n    });\n    (useSanityData.useCommittees as any).mockReturnValue({\n      committees: [],\n      loading: false,\n      error: null\n    });\n  });"
  );
  content = content.replace(
    /<JoinPage \/>/g,
    "<GlobalDataProvider><JoinPage /></GlobalDataProvider>"
  );
  return content;
});

replaceFile('src/app/pages/PartnersPage.test.tsx', content => {
  content = content.replace(
    /import \{ PartnersPage \} from '\.\/PartnersPage';/g,
    "import { PartnersPage } from './PartnersPage';\nimport { GlobalDataProvider } from '../../context/GlobalDataContext';"
  );
  content = content.replace(
    /vi\.mock\('\.\.\/\.\.\/hooks\/useSanityData', \(\) => \(\{\n  usePartners: vi\.fn\(\),\n  useSiteSettings: vi\.fn\(\),\n\}\)\);/g,
    "vi.mock('../../hooks/useSanityData', () => ({\n  usePartners: vi.fn(),\n  useSiteSettings: vi.fn(),\n  useCommittees: vi.fn(),\n}));"
  );
  content = content.replace(
    /beforeEach\(\(\) => \{\n    \(useSanityData\.usePartners as any\)\.mockReturnValue\(\{\n      partners: mockPartners,\n      loading: false\n    \}\);\n\n    \(useSanityData\.useSiteSettings as any\)\.mockReturnValue\(\{\n      settings: mockSettings,\n      loading: false\n    \}\);\n  \}\);/g,
    "beforeEach(() => {\n    (useSanityData.usePartners as any).mockReturnValue({\n      partners: mockPartners,\n      loading: false\n    });\n\n    (useSanityData.useSiteSettings as any).mockReturnValue({\n      settings: mockSettings,\n      loading: false\n    });\n    (useSanityData.useCommittees as any).mockReturnValue({\n      committees: [],\n      loading: false\n    });\n  });"
  );
  content = content.replace(
    /<PartnersPage \/>/g,
    "<GlobalDataProvider><PartnersPage /></GlobalDataProvider>"
  );
  return content;
});

replaceFile('src/app/pages/HomePage.test.tsx', content => {
  content = content.replace(
    /import \{ HomePage \} from '\.\/HomePage';/g,
    "import { HomePage } from './HomePage';\nimport { GlobalDataProvider } from '../../context/GlobalDataContext';"
  );
  content = content.replace(
    /<HomePage \/>/g,
    "<GlobalDataProvider><HomePage /></GlobalDataProvider>"
  );
  return content;
});

replaceFile('src/app/components/shared/Footer.test.tsx', content => {
  content = content.replace(
    /import \{ Footer \} from '\.\/Footer';/g,
    "import { Footer } from './Footer';\nimport { GlobalDataProvider } from '../../../context/GlobalDataContext';"
  );
  content = content.replace(
    /const renderWithTheme = \(ui: React\.ReactElement\) => render\(\n  <ThemeProvider attribute="class" defaultTheme="dark">\n    \{ui\}\n  <\/ThemeProvider>\n\);/g,
    "const renderWithTheme = (ui: React.ReactElement) => render(\n  <ThemeProvider attribute=\"class\" defaultTheme=\"dark\">\n    <GlobalDataProvider>\n      {ui}\n    </GlobalDataProvider>\n  </ThemeProvider>\n);"
  );
  content = content.replace(
    /render\(\n      <MemoryRouter>\n        <Footer \/>\n      <\/MemoryRouter>\n    \);/g,
    "render(\n      <MemoryRouter>\n        <GlobalDataProvider>\n          <Footer />\n        </GlobalDataProvider>\n      </MemoryRouter>\n    );"
  );
  return content;
});
