const fs = require('fs');
const spookyhash = require('spookyhash');

const localFileHeaderSignatureToDecimal = 67324752; // 0x04034b50 (hex) = 67324752 (dec)
const centralDirectoryHeaderSignatureToDecimal = 33639248; // 0x02014b50 (hex) = 33639248 (dec)

const poc = (file) => {
  fs.readFile(file, '', (err, data) => {
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

    // console.log('fileNameLength: ', fileNameLength);
    // console.log('extraFieldLength: ', extraFieldLength);

    // const fileName = buffer.toString('utf8', offsetStartFileToFilename, offsetStartFileToFilename + (fileNameLength * 2));
    // console.log('fileName: ', fileName);

    // Calculate the chunk's size:
    // 30 bytes for the header information + file name length + extra field length = chunk size
    const offsetStartFileToFilename = 30;
    const offsetStartFileToExtraFields = offsetStartFileToFilename + fileNameLength;
    const fileHeaderChunkSize = offsetStartFileToExtraFields + extraFieldLength;
    console.log('fileHeaderChunkSize: ', fileHeaderChunkSize);

    const fileHeaderChunk = buffer.slice(0, fileHeaderChunkSize);
    // console.log(chunk);
    // console.log(buffer);

    const hash = new spookyhash.Hash();
    hash.update(fileHeaderChunk);
    console.log('fileHeaderChunk hash: ', spookyhash.hash128(fileHeaderChunk).toString('base64'));

    console.log('--');
    /*
      * Data descriptor:
      *
      *  crc-32                          4 bytes
      *  compressed size                 4 bytes
      *  uncompressed size               4 bytes
      *
      *  Final offset from end of file header to start of file data = 12 bytes
      *  File data can be an arbitrary length, need to loop until next file header signature is found
    */
    const dataDescriptorSize = 12;
    let offsetFromStartToEndFileData = fileHeaderChunkSize + dataDescriptorSize;
    let done = false;

    while (!done) {
      buffer.readUInt32LE(offsetFromStartToEndFileData) !=
        localFileHeaderSignatureToDecimal ? offsetFromStartToEndFileData++ : done = true;
    }

    const fileDataChunkSize = offsetFromStartToEndFileData - fileHeaderChunkSize;

    console.log('fileDataChunkSize: ', fileDataChunkSize);

    const fileDataChunk = buffer.slice(fileHeaderChunkSize, offsetFromStartToEndFileData);
    hash.update(fileDataChunk);
    console.log('fileDataChunk hash: ', spookyhash.hash128(fileDataChunk).toString('base64'));

    console.log('--');
    done = false;
    let offsetFromStartToCentralDirectory = offsetFromStartToEndFileData;

    while (!done) {
      buffer.readUInt32LE(offsetFromStartToCentralDirectory) !=
        centralDirectoryHeaderSignatureToDecimal ? offsetFromStartToCentralDirectory++ : done = true;
    }

    const centralDirectoryChunkSize = buffer.length - offsetFromStartToCentralDirectory;
    console.log('centralDirectoryChunkSize: ', centralDirectoryChunkSize);

    const centralDirectoryChunk = buffer.slice(offsetFromStartToCentralDirectory, buffer.length);
    hash.update(centralDirectoryChunk);
    console.log('centralDirectoryChunk hash: ', spookyhash.hash128(centralDirectoryChunk).toString('base64'));
  });
};

module.exports = {
  poc,
};
