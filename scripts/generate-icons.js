const sharp = require('sharp');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];

// First convert SVG to PNG using svgexport (better quality than direct sharp conversion)
sizes.forEach(size => {
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
      console.log(`Generated ${size}x${size} icon`);
    });
}); 