const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = './images';
fs.readdirSync(dir).forEach(file => {
  if (file.match(/\.(png|jpg|jpeg)$/i)) {
    const outPath = path.join(dir, file.replace(/\.[^/.]+$/, '.webp'));
    if (!fs.existsSync(outPath)) {
      console.log('Converting ' + file);
      sharp(path.join(dir, file))
        .webp({ quality: 80 })
        .toFile(outPath)
        .then(() => console.log('Done: ' + outPath))
        .catch(err => console.error('Error converting ' + file + ':', err));
    }
  }
});
