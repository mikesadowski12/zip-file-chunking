const express = require('express');

const port = 3000;
const app = express();

const { poc } = require('./zipChunkingPoc');
const { chunker } = require('./zipChunker');
const { assemble } = require('./zipAssembler');

const wordFile = 'data/Word/MainContent/FileStream.docx';
const powerPointFile = 'data/PowerPoint/MainContent/FileStream.pptx';
const excelFile = 'data/Excel/MainContent/FileStream.xlsx';

const rebuildFile = (file, extension) => {
  const chunks = chunker(file);

  chunks.forEach(chunk => console.log({
    length: chunk.data.length,
    hash: chunk.hash
  }));

  assemble(chunks, extension);
}

app.listen(port, () => {
  // poc(wordFile);
  // poc(powerPointFile);
  // poc(excelFile);

  rebuildFile(wordFile, '.docx');
  // rebuildFile(powerPointFile, '.pptx');
  // rebuildFile(excelFile, '.xlsx');
});
