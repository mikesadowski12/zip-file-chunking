const express = require('express');
const fs = require('fs');
const spookyhash = require('spookyhash');

const port = 3000;
const app = express();

const wordFile = 'data/SampleFileChunkings/Word/MainContent/FileStream.docx';
const wordFileChunkInfo = 'data/SampleFileChunkings/Word/MainContent/ChunkInfo.txt';

const localFileHeaderSignatureToDecimal = 67324752; // 0x04034b50 (hex) = 67324752 (dec)

app.listen(port, () => {
  console.log(`file-chunking app listening at http://localhost:${port}`);

  fs.readFile(wordFile, '', function(err, data) {
    if (err) throw err;

    // Create a buffer object from the data of the zip file
    const buffer = Buffer.from(data);

    /*
      * local file header signature     4 bytes  (0x04034b50)
      * version needed to extract       2 bytes
      * general purpose bit flag        2 bytes
      * compression method              2 bytes
      * last mod file time              2 bytes
      * last mod file date              2 bytes
      * crc-32                          4 bytes
      * compressed size                 4 bytes
      * uncompressed size               4 bytes
      * file name length                2 bytes
      * extra field length              2 bytes
      *
      * file name (variable size)
      * extra field (variable size)
      *
      * Final offset from start of file to file name length = 26 bytes
      * Final offset from start of file to extra field length = 28 bytes
      *
      * Final offset from start of file to file name = 30 bytes
      * Final offset from start of file to extra field = 30 bytes + file name length
    */

    // Read the file's 'file header':
    const offsetStartFileToFilenameLength = 26;
    const offsetStartFileToExtraFieldLength = 28;

    const fileNameLength = buffer.readUInt16LE(offsetStartFileToFilenameLength);
    const extraFieldLength = buffer.readUInt16LE(offsetStartFileToExtraFieldLength);

    console.log('fileNameLength: ', fileNameLength);
    console.log('extraFieldLength: ', extraFieldLength);

    // const fileName = buffer.toString('utf8', offsetStartFileToFilename, offsetStartFileToFilename + (fileNameLength * 2));
    // console.log('fileName: ', fileName);

    // Calculate the chunk's size:
    // 30 bytes for the header information + file name length + extra field length = chunk size
    const offsetStartFileToFilename = 30;
    const offsetStartFileToExtraFields = offsetStartFileToFilename + fileNameLength;
    const chunkSize = offsetStartFileToExtraFields + extraFieldLength;
    console.log('chunkSize: ', chunkSize);

    const chunk = buffer.slice(0, chunkSize);
    // console.log(chunk);
    // console.log(buffer);

    const hash = new spookyhash.Hash();
    hash.update(chunk);
    console.log(spookyhash.hash128(chunk).toString('base64'));
  });
});
