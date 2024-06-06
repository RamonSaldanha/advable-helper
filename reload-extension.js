const fs = require('fs');
const path = require('path');

const extensionDir = path.resolve(__dirname, 'dist');

fs.writeFileSync(path.join(extensionDir, 'reload.txt'), Date.now().toString());

console.log('Extension reloaded');
