const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'mochawesome-report');

if (fs.existsSync(folderPath)) {
  const files = fs.readdirSync(folderPath);

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const stats = fs.lstatSync(filePath);

    if (stats.isDirectory()) {
      // Delete folder recursively
      fs.rmSync(filePath, { recursive: true, force: true });
      console.log(`Deleted folder: ${filePath}`);
    } else {
      // Delete file
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
  });
  console.log('✅ Mochawesome report folder cleaned.');
} else {
  console.log('⚠️ Folder not found:', folderPath);
}
