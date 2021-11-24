const fs = require('fs');
const spookyhash = require('spookyhash');

const offsetToFilenameLength = 26;
const offsetToExtraFieldLength = 28;
const offsetToFilename = 30;
const dataDescriptorSize = 12;

const localFileHeaderSignatureToDecimal = 67324752; // 0x04034b50 (hex) = 67324752 (dec)
const centralDirectoryHeaderSignatureToDecimal = 33639248; // 0x02014b50 (hex) = 33639248 (dec)

let buffer;

const findNextLocalFileHeaderSignature = (start) => {
  let ptr = start;
  let done = false;

  while (!done) {
    buffer.readUInt32LE(ptr) != localFileHeaderSignatureToDecimal ? ptr++ : done = true;
  }

  return ptr;
}

const chunker = (file) => {
  fs.readFile(file, '', (err, data) => {
    if (err) throw err;

    // Create a buffer object from the data of the zip file
    buffer = Buffer.from(data);

    const hash = new spookyhash.Hash();

    let offset = 0;
    let startOfChunk = offset;
    // 12 files
    for (let i = 0; i <= 10; i ++) {
      console.log('offset:', offset);
      console.log('buffer.readUInt32LE(offset)', buffer.readUInt32LE(offset));
      let fileNameLength = buffer.readUInt16LE(offset + offsetToFilenameLength);
      let extraFieldLength = buffer.readUInt16LE(offset + offsetToExtraFieldLength);

      offset += offsetToFilename;
      const fileName = buffer.toString('utf8', offset, offset + (fileNameLength * 2));
      console.log('fileName: ', fileName);

      offset += fileNameLength + extraFieldLength;

      const fileHeaderChunk = buffer.slice(startOfChunk, offset);
      hash.update(fileHeaderChunk);
      console.log('fileHeaderChunk size:', fileHeaderChunk.length);
      console.log('fileHeaderChunk hash:', spookyhash.hash128(fileHeaderChunk).toString('base64'));

      const offsetEndOfFileData = findNextLocalFileHeaderSignature(offset + dataDescriptorSize);

      const fileDataChunk = buffer.slice(offset, offsetEndOfFileData);
      hash.update(fileDataChunk);
      console.log('fileDataChunk size:', fileDataChunk.length);
      console.log('fileDataChunk hash:', spookyhash.hash128(fileDataChunk).toString('base64'));

      offset = offsetEndOfFileData;
      startOfChunk = offset;

      console.log('=====================');
    }
  });
};

module.exports = {
  chunker,
};
