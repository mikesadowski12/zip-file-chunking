const fs = require('fs');
const spookyhash = require('spookyhash');

const OFFSETTOFILENAMELENGTH = 26;
const OFFSETTOEXTRAFIELDLENGTH = 28;
const OFFSETTOFILENAME = 30;
// const OFFSETTOEXTRAFIELDLENGTHFROMFILENAMELENGTH = 2;
// const OFFSETTOFILENAMEFROMEXTRAFIELDLENGTH = 2;
const DATADESCRIPTORSIZE = 12;

const LOCALFILEHEADERSIGNATURE = 67324752; // 0x04034b50 (hex) = 67324752 (dec)
const CENTRALDIRECTORYHEADERSIGNATURE = 33639248; // 0x02014b50 (hex) = 33639248 (dec)

const options = {
  highWaterMark: 500
};

const chunks = [];
let buffer;

const findCentralDirectorySignature = (start) => {
  return buffer.readUInt32LE(start) === CENTRALDIRECTORYHEADERSIGNATURE ? true : false;
}

const findFileHeaderSignature = (start) => {
  return buffer.readUInt32LE(start) === LOCALFILEHEADERSIGNATURE ? true : false;
}

const isRoomInBuffer = (start) => {
  return buffer[start] + 32 >= buffer.length ? true : false;
}

const findNextSignature = (start) => {
  let ptr = start;
  let done = false;

  while (!done) {
    !isRoomInBuffer() && !findFileHeaderSignature(ptr) && !findCentralDirectorySignature(ptr) ? ptr++ : done = true;
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

const chunker2 = (file) => {
  const reader = fs.createReadStream(file, options);

  // let offset = 0;
  // let startOfChunk = offset;

  // let remainingBuffer = [];

  // let filenameLengthSpill = false;
  // let extraFieldsLengthSpill = false;
  // let fileHeaderSpill = false;

  // let fileDataSpill = false;
  // let centralDirectorySpill = false;


// file header = 5 bytes
// file data = 10 bytes
// central directory = 2 bytes

// [1,2,3]
// [4,5,6]
// [7,8,9]
// [10,11,12]
// [13,14,15]
// [16,17,18]

  reader.on('data', (curBuffer) => {
    buffer = curBuffer;

    // let remainingBytesInBuffer = buffer.length;

    // let fileNameLength = 0;
    // let extraFieldLength = 0;
    // let fileHeaderChunk;
    // let fileDataChunk;

    while (!findCentralDirectorySignature(offset)) {
    // for (let i = 0; i <= 0; i++) {
    //   if (fileHeaderSpill) {
    //     fileHeaderChunk = Buffer.concat([remainingBuffer, buffer.slice(0, offset)]);
    //     fileHeaderSpill = false;
    //   } else {
    //     if (offset + OFFSETTOFILENAMELENGTH > remainingBytesInBuffer) { // IF SPILLING OVER TO NEXT BUFFER
    //       console.log(1);
    //       filenameLengthSpill = true;
    //       remainingBuffer.push(buffer.slice(offset, buffer.length));
    //       offset = OFFSETTOFILENAMELENGTH - remainingBytesInBuffer;
    //       break;
    //     } else if (filenameLengthSpill) { // IF ALREADY SPILLED OVER TO NEXT BUFFER
    //       console.log(2);
    //       fileNameLength = Buffer.concat([remainingBuffer, buffer.slice(0, offset)]).readUInt16LE(0);
    //       filenameLengthSpill = false;
    //     } else if (!extraFieldsLengthSpill && !fileDataSpill) { // IF NOT SPILLING OVER OR SPILLED OVER
    //       console.log(3);
    //       fileNameLength = buffer.readUInt16LE(offset + OFFSETTOFILENAMELENGTH);
    //     }

    //     if (offset + OFFSETTOEXTRAFIELDLENGTH > remainingBytesInBuffer) {
    //       console.log(4);
    //       extraFieldsLengthSpill = true;
    //       remainingBuffer.push(buffer.slice(offset, buffer.length));
    //       offset = OFFSETTOEXTRAFIELDLENGTH - remainingBytesInBuffer;
    //       break;
    //     } else if (extraFieldsLengthSpill) {
    //       console.log(5);
    //       extraFieldLength = Buffer.concat([remainingBuffer, buffer.slice(0, offset)]).readUInt16LE(0);
    //       extraFieldsLengthSpill = false;
    //     } else if (!fileDataSpill) {
    //       console.log(6);
    //       extraFieldLength = buffer.readUInt16LE(offset + OFFSETTOEXTRAFIELDLENGTH);
    //     }

    //     if (offset + OFFSETTOFILENAME + fileNameLength + extraFieldLength > remainingBytesInBuffer) {
    //       remainingBuffer = buffer.slice(offset, buffer.length);

    //       offset = offset + OFFSETTOFILENAME + fileNameLength + extraFieldLength - remainingBytesInBuffer;

    //       fileHeaderSpill = true;
    //       break;
    //     }

    //     offset += OFFSETTOFILENAME + fileNameLength + extraFieldLength;
    //     console.log('offset', offset);

    //     fileHeaderChunk = buffer.slice(startOfChunk, offset);
    //   }

    //   if (fileDataSpill) {
    //     const offsetEndOfFileData = findNextSignature(offset);
    //     fileDataChunk = Buffer.concat([remainingBuffer, buffer.slice(0, offsetEndOfFileData)]);
    //     fileDataSpill = false;
    //   } else {
    //     const offsetEndOfFileData = findNextSignature(offset);

    //     if (offsetEndOfFileData >= buffer.length) {

    //     }
    //   }

    //   saveChunk(fileHeaderChunk);
    //   // saveChunk(fileDataChunk);

    //   remainingBytesInBuffer -= offset;
    //   console.log('remainingBytesInBuffer', remainingBytesInBuffer);

      // if (offset + DATADESCRIPTORSIZE > remainingBytesInBuffer) {
      //   remainingBuffer = buffer.slice(offset, buffer.length);
      //   offset = DATADESCRIPTORSIZE - remainingBytesInBuffer;
      //   fileDataSpill = true;
      //   break;
      // }

      // const offsetEndOfFileData = findNextSignature(offset + DATADESCRIPTORSIZE);

      // const fileDataChunk = buffer.slice(offset, offsetEndOfFileData);
      // saveChunk(fileDataChunk);
    }
    // const centralDirectoryChunk = buffer.slice(offset, buffer.length);
    // saveChunk(centralDirectoryChunk);

    // chunks.forEach(chunk => console.log({
    //   length: chunk.data.length,
    //   hash: chunk.hash
    // }));

    // return chunks;
  });
};

module.exports = {
  chunker2,
};
