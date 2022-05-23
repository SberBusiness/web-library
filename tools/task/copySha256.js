const fs = require('fs');
const path = require('path');

fs.copyFileSync(path.resolve(__dirname, '../../src/@sbbol/web-library/common/utils/sha256.js'), path.resolve(__dirname, '../../out/@sbbol/web-library/common/utils/sha256.js'));