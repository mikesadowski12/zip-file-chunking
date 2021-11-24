const fs = require('fs');
const spookyhash = require('spookyhash');

const localFileHeaderSignatureToDecimal = 67324752; // 0x04034b50 (hex) = 67324752 (dec)
const centralDirectoryHeaderSignatureToDecimal = 33639248; // 0x02014b50 (hex) = 33639248 (dec)

const chunker = (file) => {
  fs.readFile(file, '', (err, data) => {
    if (err) throw err;

    // Create a buffer object from the data of the zip file
    const buffer = Buffer.from(data);
  });
};

module.exports = {
  chunker,
};