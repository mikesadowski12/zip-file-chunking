const express = require('express');

const port = 3000;
const app = express();

const { poc } = require('./zipChunkingPoc');
const { chunker } = require('./zipChunker');

const wordFile = 'data/Word/MainContent/FileStream.docx';
const powerPointFile = 'data/PowerPoint/MainContent/FileStream.pptx';
const excelFile = 'data/Excel/MainContent/FileStream.xlsx';

app.listen(port, () => {
  console.log(`file-chunking app listening at http://localhost:${port}`);
  console.log('--');
  console.log('--');

  // poc(wordFile);
  // poc(powerPointFile);
  // poc(excelFile);

  chunker(wordFile);
});
