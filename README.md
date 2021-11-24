## FILE-CHUNKING
* This app is intended to test chunking a zip file (i.e. office files `.docx`, `.pptx`, `.xlsx`) according to the zip file specification
* It chunks the `file header` + `file data` for each file in the zip, and finally the `central directory` located at the end of the zip file
* The chunk ID is generated via spooky hash + base64 encoding (https://www.npmjs.com/package/spookyhash)
* The file is also re-assembled as an office file (either `.docx`, `.pptx`, `.xlsx`) at the very end

https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT

### USAGE
* `zipChunkerPoc.js` contains the proof of concept for the foundation of the chunking algorithm
* `zipChunker.js` contains the chunking algorithm
* `zipAssembler.js` contains the algorithm for assembling the file out of the buffer chunks
** output is in the root directory of this project (`rebuilt.docx`, `rebuilt.pptx`, `rebuilt.xlsx`)

### Requirements
* `node v14`