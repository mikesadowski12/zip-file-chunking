const fs = require('fs');
const spookyhash = require('spookyhash');

const OFFSETTOFILENAMELENGTH = 26;
const OFFSETTOEXTRAFIELDLENGTH = 28;
const OFFSETTOFILENAME = 30;
const DATADESCRIPTORSIZE = 12;

const LOCALFILEHEADERSIGNATURE = 67324752; // 0x04034b50 (hex) = 67324752 (dec)
const CENTRALDIRECTORYHEADERSIGNATURE = 33639248; // 0x02014b50 (hex) = 33639248 (dec)

const options = {
  highWaterMark: 5000
};

const chunker2 = (file) => {
  const reader = fs.createReadStream(file, options);

  reader.on('data', (buffer) => {

  });
};

module.exports = {
  chunker2,
};