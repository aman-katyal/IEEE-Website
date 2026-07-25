const fs = require('fs');

function replaceFile(file, replacer) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = replacer(content);
    fs.writeFileSync(file, content);
  }
}

const dedupImports = (content) => {
  return content.replace(/import \{ GlobalDataProvider \} from '.*GlobalDataContext';\nimport \{ GlobalDataProvider \} from '.*GlobalDataContext';/g, "import { GlobalDataProvider } from '../../context/GlobalDataContext';");
};

replaceFile('src/app/pages/JoinPage.test.tsx', content => {
  content = dedupImports(content);
  return content;
});

replaceFile('src/app/pages/PartnersPage.test.tsx', content => {
  content = dedupImports(content);
  return content;
});

replaceFile('src/app/pages/HomePage.test.tsx', content => {
  content = dedupImports(content);
  return content;
});

replaceFile('src/app/components/shared/Footer.test.tsx', content => {
  content = content.replace(/import \{ GlobalDataProvider \} from '.*GlobalDataContext';\nimport \{ GlobalDataProvider \} from '.*GlobalDataContext';/g, "import { GlobalDataProvider } from '../../../context/GlobalDataContext';");
  return content;
});
