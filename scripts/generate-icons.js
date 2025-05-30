const sharp = require('sharp');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Sizes for PWA icons
const pwaSizes = [192, 512];

// Sizes for favicons
const faviconSizes = [16, 32, 48];

// Sizes for iOS icons
const iosSizes = [120, 152, 167, 180];

// Generate PWA icons
pwaSizes.forEach(size => {
  execSync(`npx svgexport public/app-icon.svg public/icon-${size}x${size}.png ${size}:`);
  
  // Optimize the PNG using sharp
  sharp(`public/icon-${size}x${size}.png`)
    .png({ quality: 90 })
    .toFile(`public/icon-${size}x${size}-optimized.png`)
    .then(() => {
      // Replace original with optimized version
      fs.unlinkSync(`public/icon-${size}x${size}.png`);
      fs.renameSync(
        `public/icon-${size}x${size}-optimized.png`,
        `public/icon-${size}x${size}.png`
      );
      console.log(`Generated PWA icon ${size}x${size}`);
    });
});

// Generate iOS icons
iosSizes.forEach(size => {
  execSync(`npx svgexport public/app-icon.svg public/apple-icon-${size}x${size}.png ${size}:`);
  
  // Optimize the PNG using sharp
  sharp(`public/apple-icon-${size}x${size}.png`)
    .png({ quality: 90 })
    .toFile(`public/apple-icon-${size}x${size}-optimized.png`)
    .then(() => {
      // Replace original with optimized version
      fs.unlinkSync(`public/apple-icon-${size}x${size}.png`);
      fs.renameSync(
        `public/apple-icon-${size}x${size}-optimized.png`,
        `public/apple-icon-${size}x${size}.png`
      );
      console.log(`Generated iOS icon ${size}x${size}`);
    });
});

// Generate favicons
faviconSizes.forEach(size => {
  execSync(`npx svgexport public/app-icon.svg public/favicon-${size}x${size}.png ${size}:`);
  
  // Optimize the PNG using sharp
  sharp(`public/favicon-${size}x${size}.png`)
    .png({ quality: 90 })
    .toFile(`public/favicon-${size}x${size}-optimized.png`)
    .then(() => {
      // Replace original with optimized version
      fs.unlinkSync(`public/favicon-${size}x${size}.png`);
      fs.renameSync(
        `public/favicon-${size}x${size}-optimized.png`,
        `public/favicon-${size}x${size}.png`
      );
      console.log(`Generated favicon ${size}x${size}`);
    });
});

// Generate .ico file (combines 16x16, 32x32, and 48x48)
Promise.all(faviconSizes.map(size => 
  sharp(`public/favicon-${size}x${size}.png`).toBuffer()
)).then(buffers => {
  sharp(buffers[0])  // Start with 16x16
    .toFile('public/favicon.ico')
    .then(() => {
      console.log('Generated favicon.ico');
      // Clean up individual favicon PNGs
      faviconSizes.forEach(size => {
        fs.unlinkSync(`public/favicon-${size}x${size}.png`);
      });
    });
}); 