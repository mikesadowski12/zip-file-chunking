const express = require('express');

const port = 3000;
const app = express();

const { poc } = require('./zipChunkingPoc');

const wordFile = 'data/SampleFileChunkings/Word/MainContent/FileStream.docx';

app.listen(port, () => {
  console.log(`file-chunking app listening at http://localhost:${port}`);
  console.log('--');

  poc(wordFile);
});
