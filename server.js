const express = require('express');

const port = 3000;
const app = express();

const { poc } = require('./zipChunkingPoc');
const { chunker } = require('./zipChunker');

const wordFile = 'data/Word/MainContent/FileStream.docx';
const powerPointFile = 'data/PowerPoint/MainContent/FileStream.pptx';
const excelFile = 'data/Excel/MainContent/FileStream.xlsx';

app.listen(port, () => {
  // poc(wordFile);
  // poc(powerPointFile);
  // poc(excelFile);

  chunker(wordFile).forEach(chunk => console.log({
    length: chunk.chunk.length,
    hash:chunk.hash
  }));

  // chunker(powerPointFile).forEach(chunk => console.log({
  //   length: chunk.chunk.length,
  //   hash:chunk.hash
  // }));

  // chunker(excelFile).forEach(chunk => console.log({
  //   length: chunk.chunk.length,
  //   hash:chunk.hash
  // }));
});
