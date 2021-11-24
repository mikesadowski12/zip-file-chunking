## FILE-CHUNKING
* This app is intended to test chunking a zip file (i.e. office files `.docx`, `.pptx`, `.xlsx`) according to the zip file specification (https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT)
* It chunks the `file header` + `file data` for each file in the zip, and finally the `central directory` located at the end of the zip file
* The chunk ID is generated via spooky hash + base64 encoding (https://www.npmjs.com/package/spookyhash), which is logged in the console
* The file is also re-assembled as an office file (either `.docx`, `.pptx`, `.xlsx`) at the very end

### DESCRIPTION
* `zipChunkerPoc.js` contains the proof of concept for the foundation of the chunking algorithm
* `zipChunker.js` contains the chunking algorithm
* `zipAssembler.js` contains the algorithm for assembling the file out of the buffer chunks (output is in the root directory of this project as `rebuilt.docx`, `rebuilt.pptx`, `rebuilt.xlsx`)

### Requirements
* `node v14`

### USAGE
* Run `node server.js` in root directory of this project