const fs = require('fs');

const assemble = (chunks, extension) => {
  const chunkData = [];

  chunks.forEach(chunk => {
    chunkData.push(chunk.data);
  });

  const buffer = Buffer.concat(chunkData);
  fs.writeFileSync(`./rebuilt${extension}`, buffer);
};

module.exports = {
  assemble,
};
