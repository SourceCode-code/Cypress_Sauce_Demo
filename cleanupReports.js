const fs = require('fs');
const path = require('path');

const folderPath = path.join('./cypress/results');

if (fs.existsSync(folderPath)) {
  const files = fs.readdirSync(folderPath);
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    fs.unlinkSync(filePath);
  });
  console.log('✅ Old report files deleted.');
} else {
  console.log('⚠️ Folder not found:', folderPath);
}
