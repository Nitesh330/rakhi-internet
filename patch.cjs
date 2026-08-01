const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  /const isActive =\s*contactModalOpen \|\|\s*pdfToolsModalOpen \|\|\s*photoToolsModalOpen \|\|\s*courierTrackModalOpen \|\|\s*courierRatesModalOpen \|\|\s*mobileMenuOpen \|\|\s*currentView !== "home";/,
  `const isActive =
      contactModalOpen ||
      pdfToolsModalOpen ||
      photoToolsModalOpen ||
      imageResizerModalOpen ||
      courierTrackModalOpen ||
      courierRatesModalOpen ||
      mobileMenuOpen ||
      currentView !== "home";`
);

content = content.replace(
  /  }, \[\s*contactModalOpen,\s*pdfToolsModalOpen,\s*photoToolsModalOpen,\s*courierTrackModalOpen,\s*courierRatesModalOpen,\s*mobileMenuOpen,\s*currentView,\s*\]\);/g,
  `  }, [
    contactModalOpen,
    pdfToolsModalOpen,
    photoToolsModalOpen,
    imageResizerModalOpen,
    courierTrackModalOpen,
    courierRatesModalOpen,
    mobileMenuOpen,
    currentView,
  ]);`
);

fs.writeFileSync('src/App.tsx', content);
