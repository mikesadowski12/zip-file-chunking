## FILE-CHUNKING
* This app is intended to test chunking a zip file (i.e. office files `.docx`, `.pptx`, `.xlsx`) according to the zip file specification (https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT)
* It chunks the `file header` + `file data` for each file in the zip, and finally the `central directory` located at the end of the zip file
* The chunk ID is generated via spooky hash + base64 encoding (https://www.npmjs.com/package/spookyhash), which is logged in the console to verify against the `ChunkInfo.txt` files in the data directory
* The file is also re-assembled as an office file (either `.docx`, `.pptx`, `.xlsx`) at the very end

### DESCRIPTION
* `zipChunkerPoc.js` contains the proof of concept for the foundation of the chunking algorithm
* `zipChunker.js` contains the chunking algorithm
* `zipAssembler.js` contains the algorithm for assembling the file out of the buffer chunks (output is in the root directory of this project as `rebuilt.docx`, `rebuilt.pptx`, `rebuilt.xlsx`)

### REQUIREMENTS
* node `v14.15.1`

### USAGE
* Run `node server.js` in root directory of this project

### DOCUMENTATION
*+Zip (Office) File Chunking+*

https://pkware.cachefly.net/webdocs/casestudies/APPNOTE.TXT
\\
\\

_*Zip File Specification*_
- *File Header*
{code}
      local file header signature     4 bytes  (0x04034b50)
      version needed to extract       2 bytes
      general purpose bit flag        2 bytes
      compression method              2 bytes
      last mod file time              2 bytes
      last mod file date              2 bytes
      crc-32                          4 bytes
      compressed size                 4 bytes
      uncompressed size               4 bytes
      file name length                2 bytes
      extra field length              2 bytes

      file name (variable size)
      extra field (variable size)
{code}
** Contains information about the file (i.e. filename length, file name)
** A file header is present for every file inside of the zip file (1..n files = 1..n file headers)
*** First bytes of every zip file contain a file header for the first file in the zip
** All file headers begin with byte sequence equal to _0x04034b50_ (signature)
** Following the signature, there are 26 more bytes of information (30 bytes total including the signature)
*** last 4 bytes are most important, they contain the _file name length_ and _extra field lengths_ which can be variable, changing the size of the header for each file
** File header ends after the extra fields

- *File Data*
{code}
Data descriptor:

        crc-32                          4 bytes
        compressed size                 4 bytes
        uncompressed size               4 bytes
{code}
** Immediately after the file header ends, the file data begins
** File data contains the data inside of the zipped file
** Similar to the file headers, file data is present for every file inside of the zip file (1..n files = 1..n file data's)
** First 12 bytes is the data descriptor, the proceeding bytes is the rest of the data
** File data ends when the next file header start (signature _0x04034b50_ is encountered)

- *Central Directory*
{code}
        central file header signature   4 bytes  (0x02014b50)
        version made by                 2 bytes
        version needed to extract       2 bytes
        general purpose bit flag        2 bytes
        compression method              2 bytes
        last mod file time              2 bytes
        last mod file date              2 bytes
        crc-32                          4 bytes
        compressed size                 4 bytes
        uncompressed size               4 bytes
        file name length                2 bytes
        extra field length              2 bytes
        file comment length             2 bytes
        disk number start               2 bytes
        internal file attributes        2 bytes
        external file attributes        4 bytes
        relative offset of local header 4 bytes

        file name (variable size)
        extra field (variable size)
        file comment (variable size)
{code}
** Located at the very end of the zip (after all file headers/file data)
** All file central directories begin with byte sequence equal to _0x02014b50_ (signature)
** Central directory ends at the end of the zip file

- *Final Structure*
{code}
      [local file header 1]
      [encryption header 1]
      [file data 1]
      [data descriptor 1]
      .
      .
      .
      [local file header n]
      [encryption header n]
      [file data n]
      [data descriptor n]
      [central directory header 1]
      .
      .
      .
      [central directory header n]
      [zip64 end of central directory record]
      [zip64 end of central directory locator]
      [end of central directory record]
{code}
\\
\\

*_Chunking For Microsoft_*
- We are to treat the _file header_ as its own chunk
- We are to treat the _file data_ as its own chunk
- We are to treat the _central directory_ as its own chunk
- Each chunk requires a chunkID
** These id's are generated by a 128-bit Spooky hash of the buffer contents of the chunk, which is then base64 encoded
- _File signature_ maps which chunkID corresponds to which chunk
\\
\\

----
I have created a POC of this chunking method which can be found here: https://github.com/mikesadowski12/zip-file-chunking
