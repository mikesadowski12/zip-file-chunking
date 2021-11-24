const fs = require('fs');
const spookyhash = require('spookyhash');

const offsetToFilenameLength = 26;
const offsetToExtraFieldLength = 28;
const offsetToFilename = 30;
const dataDescriptorSize = 12;

const localFileHeaderSignatureToDecimal = 67324752; // 0x04034b50 (hex) = 67324752 (dec)
const centralDirectoryHeaderSignatureToDecimal = 33639248; // 0x02014b50 (hex) = 33639248 (dec)

let buffer;
const chunks = [];

const findCentralDirectorySignature = (start) => {
  return buffer.readUInt32LE(start) === centralDirectoryHeaderSignatureToDecimal ? true : false;
}

const findFileHeaderSignature = (start) => {
  return buffer.readUInt32LE(start) === localFileHeaderSignatureToDecimal ? true : false;
}

const findNextSignature = (start) => {
  let ptr = start;
  let done = false;

  while (!done) {
    !findFileHeaderSignature(ptr) && !findCentralDirectorySignature(ptr) ? ptr++ : done = true;
  }

  return ptr;
}

const saveChunk = (chunk) => {
  const hash = new spookyhash.Hash();
  hash.update(chunk);

  chunks.push({
    hash: spookyhash.hash128(chunk).toString('base64'),
    data: chunk,
  });
}

const chunker = (file) => {
  let offset = 0;
  let startOfChunk = offset;

  const data = fs.readFileSync(file, '');

  buffer = Buffer.from(data);

  while (!findCentralDirectorySignature(offset)) {
    let fileNameLength = buffer.readUInt16LE(offset + offsetToFilenameLength);
    let extraFieldLength = buffer.readUInt16LE(offset + offsetToExtraFieldLength);

    offset += offsetToFilename + fileNameLength + extraFieldLength;

    const fileHeaderChunk = buffer.slice(startOfChunk, offset);
    saveChunk(fileHeaderChunk);

    const offsetEndOfFileData = findNextSignature(offset + dataDescriptorSize);

    const fileDataChunk = buffer.slice(offset, offsetEndOfFileData);
    saveChunk(fileDataChunk);

    offset = offsetEndOfFileData;
    startOfChunk = offset;
  }

  const centralDirectoryChunk = buffer.slice(offset, buffer.length);
  saveChunk(centralDirectoryChunk);

  return chunks;
};

module.exports = {
  chunker,
};
